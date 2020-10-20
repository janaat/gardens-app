const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User=require("../models/user");
const jwt=require('jsonwebtoken');;
const checkAuth = require('../middleware/check');


router.post("/register", (req,res,next) =>{
  bcrypt.hash(req.body.password, 10).then(hash=>{
    const user=new User({
      username: req.body.username,
      password: hash,
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      confirmPassword: req.body.confirmPassword,
      place: req.body.place,
      phone: req.body.phone,
      approved: req.body.approved,
      date: req.body.date,
      type: req.body.type
    });
    user.save().then(result=>{
      res.status(201).json({
        message: "User added",
        result: result
      });
    }).catch(err=>{
      alert("Username already in use!");
      res.status(500).json({
        message:"Username already in use",
        error: err

      });
    });
  });
});
router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ username: req.body.username, type: req.body.type})
  .then(user => {
    if(!user){
      return res.status(401).json({message: "User not found!"});
      }
      if(user.approved === false) {
        return res.status(401).json({
          message: "User is not approved"
        });
      }
      fetchedUser=user;
      return bcrypt.compare(req.body.password, user.password);
  })
  .then(result => {
    if(!result){

      return res.status(401).json({message: "Password incorrect"});
    }
    const token=jwt.sign({username: fetchedUser.username, userId: fetchedUser._id}, "hocu_da_te_gledam_dok_se_ljubis_sa_njom",{
      expiresIn: "1h"
    });
    res.status(200).json({
      token: token,
      expiresIn: 3600
    });
  })
  .catch(err =>{

    return res.status(401).json({message: "Auth failed"});
    alert("Wrong password!");
  })
});
router.post("/change", (req, res, next) => {
  User.updateOne({username:req.body.username}, {approved: true})
  .then(result => {
    if (!result) {
      return res.status(401).json({
        message: "Auth failed"
      });
    }
    return res.status(200).json({
      message:"User updated"
    });
  })
  .catch(err => {
    res.status(500).json({
      message: "Error while approving user!"
    })
  });
});
router.post("/change", (req, res, next) => {
  console.log("usao u userss.js");
  User.findOneAndUpdate({username:req.body.username}, {approved: req.body.approved},{name: req.body.name},{surname: req.body.surname},
                    {date: req.body.date},{place: req.body.place},{email: req.body.email},{phone: req.body.phone} ,{type:req.body.type})
  .then(result => {
    console.log("usersss.js usao u then");
    console.log(result);
    if (!result) {
      return res.status(401).json({
        message: "Auth failed"
      });
    }
    return res.status(200).json({
      message:"User updated"
    });
  })
  .catch(err => {
    res.status(500).json({
      message: "Error while approving user!"
    })
  });
});
router.post("/changepass", (req, res, next) => {
  console.log("Usao u fju u userss.js");
  bcrypt.hash(req.body.newpassword, 10).then(hash => {
   const pass = hash;
   console.log(pass);
   bcrypt.hash(req.body.oldpassword, 10).then(hash => {
     User.findOne({username: req.body.username}).then(user => {
      if (bcrypt.compare(req.body.oldpassword, user.password))
      User.updateOne({username:req.body.username}, {password: pass})
      .then(result => {
        console.log("Usao u then u userss.js");
        if (!result) {
          return res.status(401).json({
            message: "Wrong password or username"
          });
        }
        return res.status(200).json({
          message:"User updated"
        });
      })
      .catch(error => {
        res.status(500).json({
          message: "Error, wrong credentials"
        });
      });
     })
     .catch(error => {
      res.status(500).json({
        message: "Error, wrong credentials"
      });
   });
  }).catch(error => {
    res.status(500).json({
      message: "Error, wrong credentials"
    });
});
}).catch(error => {
  res.status(500).json({
    message: "Error, wrong credentials"
  });
});
});
router.post("/delete", (req, res, next) => {
  User.deleteOne({username: req.body.username})
  .then(result => {
    if (!result) {
      return res.status(401).json({
        message: "Error while deleting"
      });
    }
    return res.status(200).json({
      message:"User deleted"
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Error while deleting user"
    });
  });
});
router.get("", (req, res, next) => {
  User.find().then(documents => {
    res.status(200).json({
      message: "Users fetched successfully",
      users: documents
    });
  });
});
router.get("/:id", (req, res, next) => {
  User.findById(req.params.idUser).then(user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found"});
    }
  });
});
router.get("/:username", (req, res, next) => {
  User.findOne({username: req.params.username}).then( user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found"});
    }
  });
});
router.delete("/:username", checkAuth, (req, res, next) => {
  console.log("Usao u delete u back delete");
  User.deleteOne({username: req.params.username }).then(result => {
    res.status(200).json({message: "User deleted"});
  })
  .catch(err => {
    console.log("error u users.js deletu");
  });
});
router.delete("/:id", checkAuth, (req, res, next) => {
  User.deleteOne({_id: req.params.idUser}).then(result =>{
    res.status(200).json({message: "User deleted"});
  }).catch(err => {
    console.log("doslo je do greske u back deletu");
    console.log(err);
  });
});

module.exports=router;
