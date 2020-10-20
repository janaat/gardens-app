const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Storage=require("../models/storage");
const Product=require("../models/product");
const jwt=require('jsonwebtoken');;
const checkAuth = require('../middleware/check');


// router.post("/addgarden", (req,res,next) =>{
//   console.log("Usao u gardens.js");
//     const garden=new Garden({
//       username: req.body.username,
//       name: req.body.name,
//       place: req.body.place,
//       free: req.body.free,
//       used: req.body.used,
//       water: req.body.water,
//       temperature: req.body.temperature,
//       products: req.body.products,
//       storage: req.body.storage,
// x:req.body.x,
// y:req.body.y
//     });
//     console.log(garden);
//     garden.save().then(result=>{
//       res.status(201).json({
//         message: "Garden added",
//         result: result
//       });
//     }).catch(err=>{
//       res.status(500).json({
//         message:"Gardens.js jao bre",
//         error: err
//     });
//   });
// });

// router.post("/delete", (req, res, next) => {
//   Garden.deleteOne({username: req.body.name})
//   .then(result => {
//     if (!result) {
//       return res.status(401).json({
//         message: "Error while deleting"
//       });
//     }
//     return res.status(200).json({
//       message:"User deleted"
//     });
//   })
//   .catch(error => {
//     res.status(500).json({
//       message: "Error while deleting user"
//     });
//   });
// });
router.get("", (req, res, next) => {
  Storage.find().then(documents => {
    res.status(200).json({
      message: "Storage fetched successfully",
      storages: documents
    });
  });
});
router.post("/planting",(req,res,next)=>{
  Storage.findOneAndUpdate({name:req.body.name},{$inc:{quantity:-1}}).then(storage=>{
    if(storage){
      console.log("Nasao magacin");
      Product.findOneAndUpdate({name:req.body.p.name},{$inc:{quantity:-1}}).then(prod=>{
        if(prod){
        res.status(200).json(prod);
        }else{
          res.status(404).json(
            {message:"nije nasao product u magacinu za planting"});
    }});
  }
       else {
      console.log("Nije nasao magacin");
      res.status(404).json({ message: "Nije nasao magacin"});
  }});
});
router.get("/:name", (req, res, next) => {
  Storage.findOne({name: req.params.name}).then( storage => {
    if (storage) {
      console.log("Nasao magacin");
      res.status(200).json(storage);
    } else {
      console.log("Nije nasao magacin");
      res.status(404).json({ message: "Nije nasao magacin"});
    }
  });
});
router.post("/addbasictostorage",(req,res,next)=>{
  Storage.findOneAndUpdate({name:req.body.name},{products:req.body.products1}).then(storage=>{
    res.status(201).json({
      message: "Product added to storage",
      result: result,
    });
  })
  .catch((err) => {
    res.status(500).json({
      message: "Orders.js jao bre addbasic",
      error: err,
    });
  })
});


module.exports=router;
