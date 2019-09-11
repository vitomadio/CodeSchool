const express = require('express');
const router = express.Router();
const multer = require('multer');
const jwt = require('jsonwebtoken');
const config = require('../config');
const fs = require('fs');

const upload = multer({dest: 'public/uploads/'}).single('file');//Configure Multer Middleware

const User = require('../models/user');
const Order = require('../models/order');
 
//====  MIDDLEWARE - Used to grab user's token from headers =========
router.use((req, res, next) => {
	const token = req.headers['authorization']; // Create token found in headers
	// Check if token was found in headers
	if (!token) {
	  res.json({ success: false, message: 'No token provided' }); // Return error
	} else {
		try{
		  	// Verify the token is valid
		    jwt.verify(token, config.secret, (err, decoded) => {
		    // Check if error is expired or invalid
		        if (err) {
		            res.json({ success: false, message: 'Token invalid: ' + err }); // Return error for token validation
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

//============ Gets Session User =================
router.get("/", (req,res,next) => {
	if(req.decoded.userId){
		return User.findById(req.decoded.userId, (err, user) => {
			if(!user){
				return res.json({success:false,message:"User doesn't exists."});
			}
			res.json({success:true,user:user});
		});
	}
	res.json({success:false,message:"Token has expired"});
});

//============== Uploads Avatar picture. ================
router.post("/upload-file", (req,res,next) => {
	try{
		upload(req,res, (err)=> {
		const file = req.file
		const prevUrl = req.body.prevUrl.slice(21)
		if(!err){
			const avatarUrl = `http://localhost:3231/uploads/${file.filename}`;
			return User.findOneAndUpdate({_id:req.decoded.userId},{avatarUrl:avatarUrl}, (err, user) => {
				if(!err){
					fs.unlink("public"+prevUrl, (err) => {
						if(err){
							return console.log(err)
						}
						console.log('Prev file was deleted');
					})
					return res.json({success:true, message:"File has been successfully uploaded",avatarUrl:avatarUrl});
				}
				console.log(err);
			})
		}
		console.log(err);
	});
	}
	catch(err){
		console.log(err);
	}
});

//================ Become Teacher Privileges =================
router.post("/become-teacher", (req,res) => {
	User.findOneAndUpdate({_id:req.decoded.userId},{
		teacher:true,
		name:req.body.name,
		lastName:req.body.lastName,
		summary:req.body.summary
	},{new:true}, function(err,user){
		if(!err){
			if(!user){
				return res.json({success:false, message:"ther's no user."})
			}
			res.json({success:true,message:'Congratulations you are now part of our team!!!',user:user});
		}
		return console.log(err);
	});
});

//=============== Adds access to courses after purchase =========
// router.post("/add-course-access", (req,res) => {
// 	User.findOneAndUpdate({_id:req.decoded.userId},{$addToSet:{courses:{$each:req.body.courses}}}, (err, user) => {
// 		if(!err){
// 			return res.json({success:true,message:"Thank you for your Purchase"});
// 		}
// 		res.json({success:false,message:"Your payment couldn't be processed "});
// 	});
// });

 
//=============== Edits user profile. ======================================= 
router.post('/edit-profile', (req,res) => {
  	User.findById(req.decoded.userId, (err, user) => {
  		if(!err){
  			user.name=req.body.name;
  			user.lastName=req.body.lastName;
  			user.email=req.body.email;
  			user.username=req.body.username;
  			user.summary=req.body.summary
  			return user.save((err, newUser) => {
				res.json({success:true,message:"Your profile was successfully updated!",user:newUser})
  			})
  		}
  		res.json({success:false,message:"Something went wrong while profile was being uploaded, please try later..."})
  		console.log(err)
  	})
});

//=================  Add purchased course access to user acount ==================
router.get('/add-purchased-course', (req,res) => {
	const getItems = new Promise((resolve,reject) => {
		Order.findOne({userId:req.decoded.userId}).populate('cart').exec((err,order) => {
			if(!err){
				return resolve(order);
			}
			reject(err)
		})
	})
	getItems
	.then(response => {
		console.log(response.cart.courses)
		User.findOneAndUpdate({_id:req.decoded.userId}, {$addToSet:{courses:{$each:response.cart.courses}}},{new:true}, (err, user) => {
			if(!err){
				return res.json({success:true,message:"Courses added to user courses list.",user:user});
			}
			res.json({success:false,message:"Something happened while courses were added to your list. "+err});
		})
	})
	.catch(err => res.json({success:false,message:err}))
});


module.exports = router;






