const mongoose=require('mongoose');
const userSchema=require("./user");
const productSchema=require('./product');

const orderSchema=mongoose.Schema({
  user:{type: String},
  products:{type: Array},
  status:{type:String},
  date:{type:Date},
  isDelivered:{type:Boolean},
  manufacturer:{type:Boolean},
  garden:{type:String}
  //products: [{name: String},{manufacturer: String},{type: String},{reviews: [{comment:String},{rating: Number}]},{quantity: Number},{available: Boolean}]
  //products: [{name: String},{manufacturer: String},{status: Number},{quantity: Number},{type: String}]
});

module.exports=mongoose.model("Order",orderSchema);


