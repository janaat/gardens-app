const mongoose=require('mongoose');

const reviewSchema=mongoose.Schema({
  user:{type: String},
  comment:{type: String},
  rating:{type: Number}
});

module.exports=mongoose.model("Review",reviewSchema);


