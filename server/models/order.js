const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
	cart:{type:Schema.Types.ObjectId, ref:'Cart'},
	userId:{type:String, required:true}
});

module.exports = mongoose.model('Order', orderSchema);