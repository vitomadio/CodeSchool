const express = require('express');
const router = express.Router();
const config = require('../config');
const csrf = require('csurf');
const jwt = require('jsonwebtoken');
const crypto = require('crypto').randomBytes(256).toString('hex');
const nodemailer = require('nodemailer');


require('dotenv').config() //Configure dotenv.

const User = require('../models/user'); //Import User.

const csrfProtection = csrf(); //Initializing csurf.

//=================Nodemailer Configuration=============================
const { google } = require('googleapis'); //import googleapi OAuth for nodemailer
const OAuth2 = google.auth.OAuth2;

//Configure nodemailer
let oauth2Client = new OAuth2(
  config.client_id,
  config.client_secret,
  "https://developers.google.com/oauthplayground"
  );

oauth2Client.setCredentials({ //Set refresh token
  refresh_token: config.refresh_token
});

let accessToken = ""; //Initialize an access token variable


oauth2Client.getRequestHeaders(function(err, tokens){ //Get the access token
  accessToken = tokens.access_token;
});

let smtpTransport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth:{
    type: "OAuth2",
    user: config.user,
    clientId: config.client_id,
    clientSecret: config.client_secret,
    refreshToken: config.refresh_token,
    accessToken: accessToken
  }
});

//Verify token
router.get('/verify/:token', function(req,res,next){
  User.findOneAndUpdate({verifyToken:req.params.token},{active:true,verifyToken:undefined}, function(err, user){
  	if(!err){
      res.redirect('http://localhost:3000?message=Your%20account%20was%20successfully%20verifiyed,%20you%20can%20now%20login%20normally.');
  	} else {
		  res.json({success:false,message:err})
  	}
  });
});


  // ================= REGISTRATION ===============================

  router.post('/signup', (req,res) => {
    if(!req.body){
      res.json({success:false, message:'Email or password must be provided'});
    }else{
      User.findOne({email: req.body.email}, (err, user) => {
        if(err){
          res.json({success:false, message: err});
        }else{
          if(user){
            res.json({success:false, message:'Email provided already exists, please check and try again.'});
          }else{
            const token = jwt.sign({data: 'token'},crypto,{expiresIn: 60 * 60 });
            const newUser = new User
              newUser.email = req.body.email,
              newUser.password = newUser.encryptPassword(req.body.password),
              newUser.verifyToken = token,
              newUser.username = req.body.username
              newUser.save((err, user) => {
              if(err){
                res.json({success:false, message:err});
              }else{
                var mailOptions = {
                  to: req.body.email,
                  from: 'account_verification@demo.com',
                  subject: 'Account verification',
                  text: 'Hello,\n\n' +
                  'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                  'http://' + req.headers.host + '/auth/verify/'+token+ ' \n\n' +
                  'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };
                smtpTransport.sendMail(mailOptions, function(err) {
                  if(!err){
                    return res.json({success:true, message:'Please check your email and follow the instructions to verify your account.'});
                  }
                  console.log(err)
                });
              }
            })
          }
        }
      });
    }
  });

  /*======================ACOOUNT VERIFICATION ============================*/

  router.get('/verify/:token', (req,res) => {
    User.findOne({verificationToken: req.params.token}, (err, user) => {
      if(err){
        res.json({success:false, message:err});
      }else{
        user.update({verificationToken:null,active:true,avatarUrl:"http://i.pravatar.cc/200"}, (err, updateUser) => {
          if(err){
            res.json({success:false, message:err});
          }else{
            res.redirect('http://localhost:8080');
          }
        });
      }
    });
  });


  /*========================LOGIN=============================*/

  router.post('/signin', (req,res) => {
    if(!req.body){
      res.json({success:false, message:'Email or password must be provided'});
    }else{
      User.findOne({email: req.body.email}, (err, user) => {
        if(err){
          res.json({success:false, message: err});
        }else{
          if(!user){
            res.json({success:false, message:'Please check your credentials and try again.'});
          }else{
            const validPassword = user.validPassword(req.body.password);
            if(!validPassword){
              res.json({success:false, message:'Wrong password, please try again.'})
            }else{
              const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h'});
              res.json({
                success: true,
                token: token
              });
            }
          }
        }
      });
    }
  });
 

module.exports = router;