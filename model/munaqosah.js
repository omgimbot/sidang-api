const mongoose = require('mongoose');
const moment = require('moment');
const mongoSchema = mongoose.Schema({
	nama :String ,
	nim : String , 
	judul : String , 
	key : String , 
	filename : String , 
	dosen : String ,  
	status : String ,
	surattugas: String ,
	created_at: {
        type: Date,
        default: new Date().toISOString()
    }
})
module.exports = mongoose.model('munaqosah', mongoSchema);
