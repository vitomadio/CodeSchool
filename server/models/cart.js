const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
	courses:[{type:Schema.Types.ObjectId, ref:'Course'}],
	userId:String
});

module.exports = mongoose.model('Cart', cartSchema);