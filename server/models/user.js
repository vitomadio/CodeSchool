const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
	username:{type:String, required:true},
	email:{type:String, required:true},
	password:{type:String, required:true},
	active:{type:Boolean, default:false},
	verifyToken:String,
	avatarUrl:{type:String, default: "https://via.placeholder.com/150"},
	teacher:{type:Boolean, default:false},
	name:String,
	lastName:String,
	summary:String,
	courses:[]

});

//Encrypt password
userSchema.methods.encryptPassword = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};
//Check if password matches
userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);