const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
	title:{type:String, required:true},
	description:{type:String, required:true},
	author:{type:Schema.Types.ObjectId, ref:'User'},
	featureUrl:{type:String, required:true},
	videos:[],
	rating:{type:Number, default:0},
	ratesQty:{type:Number, default:0},
	category:{type:String, required:true},
	subCategory:{type:String, required:true},
	price:{type:Number, default:9.99}
});

module.exports = mongoose.model('Course', courseSchema);