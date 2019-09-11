const crypto = require('crypto').randomBytes(256).toString('hex'); 

require ('dotenv').config();

module.exports = {
	uri: process.env.DB_URI_PROD,
	secret: crypto, //Encrypt secret
	db: "codeschool",

	access_cors_dev: process.env.ACCESS_CORS_DEV,
	access_cors_prod: process.env.ACCESS_CORS_PROD,

	//For nodemailer and OAuth configuration.
	user:process.env.USER_EMAIL,
	client_secret:process.env.CLIENT_SECRET,
	client_id:process.env.CLIENT_ID,
	refresh_token:process.env.REFRESH_TOKEN,
	access_token:process.env.ACCESS_TOKEN,

	//Paypal credentials.
	paypal_id:process.env.PAYPAL_CLIENT_ID,
	paypal_secret:process.env.PAYPAL_CLIENT_SECRET

}