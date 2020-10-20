const mongoose=require('mongoose');
const uniqueP=require("mongoose-unique-validator");

const productSchema=mongoose.Schema({
  name: {type: String, require: true},
  manufacturer: {type: String, require: true},
  type: {type: String, require: true},
  quantity: {type: Number, require: true},
  reviews: {type: Array}, //postoji sansa da je greska jer nije Review[]
  rating: {type: Number},
  available: {type: Boolean},
  progress:{type: Number},
  dynamics:{type: Number}

});

productSchema.plugin(uniqueP);
module.exports=mongoose.model("Product",productSchema);


