const mongoose = require('mongoose');
const moment = require('moment');
var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;
const mongoSchema = mongoose.Schema({
	nama: String,
	nim: String,
	kodeMk: String,
	namaMk: String,
	created_at: {
		type: Date,
		default: new Date().toISOString()
	}
})
module.exports = mongoose.model('pengujis', mongoSchema);
