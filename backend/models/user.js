const mongoose=require('mongoose');
const uniqueP=require("mongoose-unique-validator");

const userSchema=mongoose.Schema({
  username:{type:String, required:true, unique:true},
  password:{type:String, required: true},
  name:{type:String, required:true},
  surname:{type:String, default: null},
  email:{type:String, required:true},
  confirmPassword:{type:String,required:true},
  place:{type:String, required:true},
  phone:{type:String},
  approved:{type:Boolean, required:true},
  date:{type:Date},
  type:{type:String,required:true}
});

userSchema.plugin(uniqueP);
module.exports=mongoose.model("User",userSchema);
