const express=require('express');
const router=express.Router();
const Product=require('../models/product');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');;
const checkAuth = require('../middleware/check');


router.post("/addproduct", (req,res,next) =>{
  console.log("Usao u products.js");
    const product=new Product({
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      type: req.body.type,
      quantity: req.body.quantity,
      available: req.body.available,
      rating: req.body.rating,
      reviews: req.body.reviews,
      dynamics: req.body.dynamics,
      progress: req.body.progress
    });
    console.log(product);
    product.save().then(result=>{
      res.status(201).json({
        message: "Product added",
        result: result
      });
    }).catch(err=>{
      res.status(500).json({
        message:"Products.js jao bre",
        error: err
    });
  });
});
router.post("/delete", (req, res, next) => {
  Product.deleteOne({name: req.body.name,quantity:req.body.quantity})
  .then(result => {
    if (!result) {
      return res.status(401).json({
        message: "Error while deleting"
      });
    }
    return res.status(200).json({
      message:"Product deleted"
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Error while deleting user"
    });
  });
});
router.post("/available",(req,res,next)=>{
  Product.findOneAndUpdate({name:req.body.name, manufacturer:req.body.manufacturer},{available: false})
  .then(result=>{
    if(!result) {
      return res.status(401).json({
        message: "Error while adding product to order"
      });
    }
    return res.status(200).json({
      message:"Product added in order"
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Error while adding product in order!"
    });
  });
  });
router.post("/:name",(req,res,next)=>{
  Product.findOneAndUpdate({name:req.body.name, manufacturer:req.body.manufacturer},{$inc:{quantity:-1}})
  .then(result=>{
    if(!result) {
      return res.status(401).json({
        message: "Error while adding product to order"
      });
    }
    return res.status(200).json({
      message:"Product added in order"
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Error while adding product in order!"
    });
  });
  });

router.get("", (req, res, next) => {
  //console.log("Usao u get u products.js");
  Product.find().then(documents => {
    //console.log(documents);
    res.status(200).json({
      message: "Products fetched successfully",
      products: documents
    });
  });
});
router.get("/:id", (req, res, next) => {
  Product.findById(req.params.idUser).then(product => {
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found"});
    }
  });
});
router.get("/:name", (req, res, next) => {
  //console.log("Usao u products.js");
  console.log(req.params.name);
  Product.findOne({name: req.params.name}).then( product => {
    console.log(product);
    if (product) {
      console.log("Nasao proizvod");
      res.status(200).json({
        message:"Nasao",
        products: product});
    } else {
      //console.log("Nije nasao proizvod");
      res.status(404).json({ message: "Product not found"});
    }
  });
});
router.get("",(req,res,next)=>{
  Product.find().then(documents=>{
    res.status(200).json({
      message:"Product fetched successfully",
      products: documents
    });
  });
});
// router.delete("/:name", checkAuth, (req, res, next) => {
//   console.log("Usao u delete u products.js");
//   Product.deleteOne({name: req.params.name }).then(result => {
//     res.status(200).json({message: "Product deleted"});
//   })
//   .catch(err => {
//     console.log("error u products.js deletu");
//   });
// });
// router.delete("/:id", checkAuth, (req, res, next) => {
//   Product.deleteOne({_id: req.params.idUser}).then(result =>{
//     res.status(200).json({message: "Product deleted"});
//   }).catch(err => {
//     console.log("doslo je do greske u products.js delete");
//     console.log(err);
//   });
// });


module.exports=router;
