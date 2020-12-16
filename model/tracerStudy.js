const mongoose = require('mongoose');
const moment = require('moment');
const mongoSchema = mongoose.Schema({
	nama :String ,
	npm : String , 
	tempatLahir : String ,
	tanggalLahir : String,
	gender : String , 
	suku : String , 
	alamat : String ,  
	noHp : String ,
	fak: String ,
	prodi: String ,
	tglMasuk: String ,
	prestasi: String ,
	judulSkripsi: String ,
	pembimbing1: String ,
	pembimbing2: String ,
	tglLulus: String ,
	ipk: String ,
	predikat: String ,
	pekerjaan: String ,
	tglMasukKerja: String ,
	created_at: {
        type: Date,
        default: new Date().toISOString()
    }
})
module.exports = mongoose.model('tracer_study', mongoSchema);
