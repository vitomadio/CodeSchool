const express = require('express') 
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config');
const ObjectId = require('mongodb').ObjectID;

const Cart = require('../models/cart');
const Courses = require('../models/cart');
const Order = require('../models/order');
const User = require('../models/user');



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

//Get Cart.
router.get('/', (req,res) => {
	Cart.findOne({userId:req.decoded.userId}).populate('courses').exec((err, cart) => {
		if(!err){
			return res.json({success:true, cart:cart})
		}
		console.log('Something happened', err)

	})
});

//Add item to cart.
router.post('/add-to-cart', (req,res) => {
	Cart.findOne({userId:req.decoded.userId},(err, cart) => {
		if(!err){
			if(!cart){
				const newCart = new Cart({
					userId : req.decoded.userId,
					courses : [ObjectId(req.body.courseId)]
				});
				return newCart.save((err, cart) => {
					if(!err){
						return res.json({success: true, cart:cart});
					}
					res.json({success:false,message:"Error: "+err});
				})
			}
			cart.courses = [...cart.courses, ObjectId(req.body.courseId)]
			cart.save((err,cartUploaded) => {
				if(!err){
					return res.json({success:true,cart:cartUploaded})
				}
				res.json({success:false,message:"Error: "+err});
				console.log(err)
			})
		}
		
	})
});

//Remove Item from cart.
router.put('/remove-item', (req,res) => {
	Cart.findOneAndUpdate({userId:req.decoded.userId},{$pull:{courses:ObjectId(req.body.courseId)}}, (err, cart) => {
		if(!err){
			return res.json({success:true,message:"Item have been remove from your cart.",cart:cart});
		}
		if(cart.courses.length = 0){
			cart.remove(err => {
				if(!err){
					return res.json({success:true,message:"Your shopping cart is empty"});
				}
				res.json({success:false,message:"Something happened while cart was been removed. "+err});
			})
		}
		res.json({success:false,message:"Ups!!! Something just happened and your item couldn't be removed from cart. "+ err});
	});
});

//Delete Cart
router.get('/delete-cart/', (req,res) => {
	const deleteOrder = new Promise((resolve,reject)=>{
		Order.findOneAndDelete({userId:req.decoded.userId}, (err) => {
			if(!err){
				return resolve("deleted")
			}
			reject(err)
		})
	})

	deleteOrder
	.then(response => {
		if(response === "deleted"){
			return Cart.findOneAndDelete({userId:req.decoded.userId}, (err) => {
				if(!err){
					return res.json({success:true,message:"Cart was successfully deleted."})
				}
				res.json({success:false,message:"Something happened while cart was being deleted."})
			});
		}
		res.json({success:false,message:"Somenthing happened while order was being deleted."})
	})
	.catch(err => res.json(err));
});

//Get Order.
router.get('/get-order', (req,res) => {
	Order.findOne({userId:req.decoded.userId}, (err, order) => {
		if(!err){
			return Cart.findOne(order.cart).populate('courses').exec((err, cart) => {
			if(!err){
				return res.json({success:true,cart:cart});
			}
			res.json({success:false,message:"Somenthing happened while cart was being loading."+err})
			});
		}
		res.json({success:false,message:"Somenthing happened while order was being loading."+err})
	});
});

//Create order.
router.post('/create-order', (req,res) => {
	Cart.findById(req.body.cart._id, (err, cart) => {
		if(!err){
			const newOrder = new Order({
				cart:cart,
				userId:req.decoded.userId
			});
			return newOrder.save((err, order) => {
				if(!err){
					return res.json({success:true,message:"New order was created, proceed to checkout.",order:order});
				}
				res.json({success:false,message:"Ups! Something happened while oreder was being created, please try again later."});
			});
		}
		res.json({success:false,message:"Error: "+err})
	});
});

//Remove Order.
router.get('/remove-order', (req,res) => {
	Order.findOneAndDelete({userId:req.decoded.userId}, (err) => {
		if(!err){
			return res.json({success:true,message:"Order successfully deleted."})
		}
		res.json({success:false,message:"Something happened while order was being deleted... "+err})
	});
});
	


module.exports = router;