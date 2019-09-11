const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
	number:Number,
});

module.exports = mongoose.model('Invoice', invoiceSchema);