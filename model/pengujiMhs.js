const mongoose = require('mongoose');
const moment = require('moment');
var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;
const mongoSchema = mongoose.Schema({
	namaMhs: String ,
  nim : String ,
  mk1 : String ,
  mk2 : String ,
  mk3 : String ,
  mk4 : String ,
  mk5 : String ,
  mk6 : String ,
	created_at: {
        type: Date,
        default: new Date().toISOString()
    }
})
module.exports = mongoose.model('pengujiMkMahasiswas', mongoSchema);
