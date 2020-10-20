const mongoose=require('mongoose');
const productSchema=require("./product");

const storageSchema=mongoose.Schema({
  status: {type: String},
  name:{type:String},
  products:{type:Array}
  //products: [{name: String},{manufacturer: String},{type: String},{reviews: [{comment:String},{rating: Number}]},{quantity: Number},{available: Boolean},{rating: Number}]
  //products: [{name: String},{manufacturer: String},{status: Number},{quantity: Number},{type: String}]
});

module.exports=mongoose.model("Storage",storageSchema);


