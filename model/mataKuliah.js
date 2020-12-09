const mongoose = require('mongoose');
const moment = require('moment');
const mongoSchema = mongoose.Schema({
	kodeMk :String ,
	namaMk : String ,
	created_at: {
        type: Date,
        default: new Date().toISOString()
    }
})
module.exports = mongoose.model('matakuliahs', mongoSchema);
