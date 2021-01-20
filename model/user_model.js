const mongoose = require('mongoose');
const moment = require('moment');
const mongoSchema = mongoose.Schema({
	nama :String ,
	username : String , 
	role : String , 
	password : String , 
	alamat : String , 
	fakultas : String , 
	prodi : String , 
	dosen : {
        type: String,
        default: "0",
    } ,
	created_at: {
        type: Date,
        default: new Date().toISOString()
    }
})
module.exports = mongoose.model('user', mongoSchema);
