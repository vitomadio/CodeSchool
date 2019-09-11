const express = require('express');
const router = express.Router();
const multer = require('multer');
const uuid4 = require('uuid4');
const jwt = require('jsonwebtoken');
const config = require('../config');
const fs = require('fs');

//Required Models
const Course = require('../models/course');
const User = require('../models/user');
const Categories = require('../models/categories');

//Config Multer
const upload = multer({dest: 'public/uploads'}).single('file');

//Config Multer to upload videos.
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/video-uploads')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname + '-' + uuid4(Date.now()))
	}
});
const uploadVideos = multer({storage: storage}).array('file');
const uploadVideo = multer({storage: storage}).single('file');
// End of multer config


//========= Get Courses List ==================
router.get('/', (req,res) => {
	Course.find({}).populate('author')
	.exec((err, courses) => {
		if(!err){
			return res.json({ success: true, courses: courses });
		}
		console.log(err);
	})
});

//======= Get Categories ==================
router.get("/categories", (req,res) => {
	Categories.find({},(err, categories) => {
		if(!err){
			return res.json({success:true, categories:categories});
		}
		res.json({ success: false, message: "Somenthing wrong happened while getting categories" });
	})
});

//======================== Streaming video =============================== 
router.get("/video", function(req, res) {
  const path = req.query.path;
  // const path = "public/video-uploads/Angular 2 for Beginners - Tutorial 1 - Getting Started.mp4-b9beea73-104c-454b-965a-cc1ff5b1e6d3";
	console.log(path)
	const stat = fs.statSync(path);
	const fileSize = stat.size;
	const range = req.headers.range;
  if (range) {
		const parts = range.replace(/bytes=/, "").split("-");
		const start = parseInt(parts[0], 10);
		const end = parts[1]
			? parseInt(parts[1], 10)
      : fileSize-1
    const chunksize = (end-start)+1
		const file = fs.createReadStream(path, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
		res.writeHead(200, head);
		fs.createReadStream(path).pipe(res);
  }
});

//====  MIDDLEWARE - Used to grab user's token from headers =========
router.use((req, res, next) => {
	const token = req.headers['authorization']; // Create token found in headers
	// Check if token was found in headers
	if (!token) {
	  res.json({ success: false, message: "No token provided" }); // Return error
	} else {
		try{
		  	// Verify the token is valid
		    jwt.verify(token, config.secret, (err, decoded) => {
		    // Check if error is expired or invalid
		        if (err) {
		            res.json({ success: false, message: "Token invalid: " + err }); // Return error for token validation
		        } else {
		            req.decoded = decoded; // Create global variable to use in any request beyond
		            next(); // Exit middleware
		        }
		    });
		}
		catch(err){
			console.log(err)
		}
	}
});

//========== Get specific course ===================================
router.post("/course", (req, res) => {
	console.log(req.body.courseId, "here")
	Course.findById(req.body.courseId, (err, course) => {
		if(!err){
			return res.json({success:true,course:course});
		}
		res.json({success:false, message:"Error: "+err});
	});
});

//==========   Get Imparted Courses ================================
router.get("/imparted-courses", (req,res) => {
	Course.find({author:req.decoded.userId}, (err, courses) => {
		if(!err){
			return res.json({success:true,courses:courses});
		}
		res.json({success:false,message:"Something happened @ get request"});
	});
});

//==========   Upload multiples videos
router.post("/upload-videos", (req,res,next) => {
	const saveVideos = new Promise((resolve,reject) => {
		uploadVideos(req,res, (err) => {
		if(!err){
			const videos = [];
			const titles = JSON.parse(req.body.titles);
			for (let i=0;i<req.files.length;i++){
				videos.push({videoUrl:"http://localhost:3231/video-uploads/"+req.files[i].filename,title:titles[i]});
			}
			resolve (videos)
		}
		reject(err)
		});
	});
	saveVideos
	.then((videos) => {
		Course.findOneAndUpdate({_id:req.body.courseId},{$addToSet:{videos:{$each:videos}}},{new:true}, (err, course) => {
			if(!err){
				return res.json({success:true,message:"Videos were successfully uploaded!",course:course});
			}
			res.json({success:false,message:"Something happened while videos were being uploaded",err});
		})
	})
});

//===========   Upload Video ==========================
router.post("/upload-video", (req,res,next) => {
	const saveVideo = new Promise((resolve,reject) => {
		uploadVideo(req,res, (err) => {
			const filename = req.file.filename
			if(!err){
				resolve({videoUrl:"http://localhost:3231/video-uploads/"+filename});
			}
			reject(err)
		});
	});
	saveVideo
	.then(({videoUrl}) => {
		const video = {
		 	title:req.body.title,
		 	videoUrl:videoUrl
		} 
		Course.findOneAndUpdate({_id:req.body.courseId},{$push:{videos:video}},{new:true}, (err, course) => {  // Use argument {new:true} in order to return the new value
			if(!err){
				return res.json({success:true,course:course});
			}
			res.json({success:false,message:"Something happened while video was being uploaded, please try again"});
		});
	})
	.catch(err => console.log(err))
	
});

//=========== Remove Video ========================

router.post("/remove-video", (req,res) => {
	const video = req.body.videoUrl;
	const videoUrl = video.slice(21);
	Course.findOneAndUpdate({_id:req.body.courseId},{$pull:{videos:{videoUrl:video}}}, (err, course) => {
		if(!err){
			return fs.unlink("public"+videoUrl, (err) => {
				if(!err){
					return res.json({success:true,message:"Video was remove successfully from database."});
				}
				res.json({success:false,message:"Ups! Something happened while was being deleted, try again later."});
			});
		}
		res.json({success:false,message:"Ups! Something happned while video was being removed from the course."});
	});
});

//===========  Upload Course ======================

router.post("/upload-course", (req,res,next) => {
	const userId = req.decoded.userId

	/* Save feature image to storage */
	upload(req,res, (err) => {
		if(!err){
			const filename=req.file.filename;
			const newCourse = new Course({
				title: req.body.title,
				category: req.body.category,
				subCategory: req.body.subCategory,
				description:req.body.description,
				featureUrl:"http://localhost:3231/uploads/"+filename,
				author:userId
			});
			/* Save new course in database */
			return newCourse.save((err, course) => {
				if(!err){
					return res.json({success:true,course:course, message:"Course was successfully saved!"});
				}
				res.json({success:false,message:"Upss! Something happenend while saving the course, please try again later."});
			});
		}
		res.json({success:false,message:"Upss! Something happenend while feature image was being saved, please try again later."});
	});
});

//=================  Edit course ========================

router.post("/edit-course", (req,res,next) => {
	upload(req,res, (err) => {
		if(!err){
			if(!req.file){
				const { title, category, subCategory, description } = req.body;
				const videos = JSON.parse(req.body.videos)
				return Course.findOneAndUpdate({_id:req.body.courseId},{
					$set:{
						title:title,
						category:category,
						subCategory:subCategory,
						description:description,
						videos:videos,
					}},{multi:true},(err, course) => {
						if(!err){
							return res.json({success:true,message:"The changes had been successfully saved!!!", course:course});
						}
						res.json({success:false,message:"Ups!!! Something happened while saving changes, tray again later."+err});
					});
			}
			/* If there is no feature image file to upload */
			const filename = req.file.filename
			const { title, category, subCategory, description } = req.body;
			const videos = JSON.parse(req.body.videos)
			return Course.findOneAndUpdate({_id:req.body.courseId},{
				$set:{
					title:title,
					category:category,
					subCategory:subCategory,
					description:description,
					videos:videos,
					featureUrl: "http://localhost:3231/uploads/"+filename
				}},{multi:true}, (err, course) => {
					if(!err){
						return res.json({success:true,message:"The changes had been successfully saved!!!", course:course});
					}
					res.json({success:false,message:"Ups!!! Something happened while saving changes, tray again later."});
				});
		}
		res.json({success:false,message:"Ups!!! Something happened while uploading feature image, try again later."});
	});
});

//========================  Delete course. ============================
router.post("/delete", (req,res) => {
	Course.findOneAndDelete({_id:req.body.courseId}, (err) => {
		if(!err){
			return res.json({success:true,message:"Course was successfully deleted."});
		}
		res.json({succes:false,message:"Something happened while course was been dleted."});
	});
});

//======================== Get purchased courses ===========================
router.get("/my-courses", (req,res) => {
	const getCoursesIds = new Promise((resolve,reject) => {
		User.findById(req.decoded.userId, (err, user) => {
			if(!err){
				return resolve(user.courses);
			}
			reject(err);
		});
	});

	getCoursesIds
	.then(courses => {
		Course.find({_id:{$in:courses}}, (err, courses) => {
			if(!err){
				return res.json({success:true,courses:courses});
			}
			res.json({success:false,message:"Something happened while courses were being loaded. "+err});
		});
	})
	.catch(err => console.log(err));
});




module.exports = router;