const mongoose=require('mongoose');
const uniqueP=require("mongoose-unique-validator");
const productSchema=require('./product');
const storageSchema=require('./storage');

const gardenSchema=mongoose.Schema({
  name: {type: String, require: true},
  place: {type: String, require: true},
  username: {type: String, require: true},
  used: {type: Number, require: true},
  free: {type: Number, require: true},
  water: {type: Number, require: true}, //bilo default 200
  temperature: {type: Number, require: true}, //bilo default=18
  storage: {type: String},
  products: {type: Array},
  x:{type:Number},
  y:{type:Number}
});

gardenSchema.plugin(uniqueP);
module.exports=mongoose.model("Garden",gardenSchema);


