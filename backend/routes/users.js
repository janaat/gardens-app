const express=require("express");
const User=require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const multer = require('multer');
const checkAuth=require('../middleware/check');

const saltRounds=10;

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const isValid = MIME_TYPE_MAP[file.mimetype];
//     let error = new Error("invalid mime type");
//     if(isValid){
//       error = null;
//     }
//     cb(error, "backend/images");
//   },
//   filename: (req, file, cb) => {
//     const name = file.originalname
//       .toLowerCase()
//       .split(" ")
//       .join("-");
//       const ext = MIME_TYPE_MAP[file.mimetype];
//       cb(null, name + "-" + Date.now() + "." + ext);
//   }
// });

const userRouter=express.Router();

userRouter.post("/register", (req,res,next)=>{
  //const url=req.protocol='://'+req.get("host");
  bcrypt.hash(req.body.password, saltRounds,function(err, hash){
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
    console.log("Ucitano iz forme");
    console.log(user.name);
    user.save().then(function(err,createdUser){
      console.log("da li dodje dovde?");
      res.status(201).json({
        message: "User added!",
        user: createdUser
        // user:{
        //   username: createdUser.username,
        //   password: createdUser.password,
        //   name: createdUser.name,
        //   surname: createdUser.surname,
        //   email: createdUser.email,
        //   confirmPassword: createdUser.confirmPassword,
        //   place: createdUser.place,
        //   phone: createdUser.phone,
        //   approved: createdUser.approved,
        //   date: createdUser.date,
        //   type: createdUser.type
        //}
      });
    })
    .catch(err=>{
      res.status(500).json({

        message: "Username already taken!"
      });
    });
  });
});

userRouter.post('/change', (req,res,next)=>{
  User.updateOne({username: req.body.username},{approved:true})
  .then(result=>{
    if(!result){
      return res.status(401).json({
        message:"Authentication failed!"
      });
    }
    return res.status(200).json({
      message:"User updated!"
    });
  }).catch(err=>{
    res.status(500).json({
      message: "Error about approving user!"
    })
  });
});
userRouter.post("/changepass", (req,res,next)=>{
  bcrypt.hash(req.body.newpassword,10, function(err,hash){
    const passwor=hash;

    bcrypt.hash(req.body.oldpassword, 10, function(err,hash){
      User.findOne({username: req.body.username}).then(user=>{
        if(bcrypt.compare(req.body.oldpassword, user.password).then(function(result){
        User.updateOne({username:req.body.username},{password: passwor})
        .then(function(result){
          if(!result){
            return res.status(401).json({
              message:"Incorrect password/username routes/users/104line"
            });
          }
          return res.status(200).json({
            message:"User updated routes/users/108line"
          });
        })
        .catch(error=>{
          res.status(500).json({
            message: "Wrong input routes/users"
          });
        });
      }).catch(error=>{
        res.status(500).json({
          message:"Wrong input routes/users"
        });
      }));
    }).catch(error=>{
      res.status(500).json({
        message:"Wrong input"
      });
    });
  }).catch(error=>{
    res.status(500).json({
      message: "Wrong input"
    });
  });
});
});


userRouter.post("/delete", (req,res,next)=>{
  User.deleteOne({username:req.body.username})
  .then(result=>{
    if(!result){
      return res.status(401).json({
        message:"Deleting error"
      });
    }
    return res.status(200).json({
      message:"User deleted!"
    });
  }).catch(error=>{
    res.status(500).json({
      message:"Error while deleting user"
    });
  });
});

userRouter.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ username: req.body.username, type: req.body.type })
  .then(user => {
    if (!user) {
      return res.status(401).json({
        message: "Inavlid authentication credentials"
      });
    }
    if(user.approved === false) {
      return res.status(401).json({
        message: "User is not approved"
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result => {
    if (!result) {
      return res.status(401).json({
        message: "Invalid authentication credentials"
      });
    }
  const token = jwt.sign({username: fetchedUser.username, userId: fetchedUser._id}, 'secret_this_should_be_longer', {expiresIn: '1h'});
  res.status(200).json({
      token: token,
      expiresIn: 3600
    });
  })
  .catch( err => {
    console.log(err);

    return res.status(401).json({
      message: "Invalid authentication credentials"
    });
  });
});
userRouter.get("", (req, res, next) => {
  User.find().then(documents => {
    res.status(200).json({
      message: "Users fetched successfully",
      users: documents
    });
  });
});

userRouter.get("/:id", (req, res, next) => {
  User.findById(req.params.idUser).then(user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found"});
    }
  });
});


userRouter.get("/:username", (req, res, next) => {
  User.findOne({username: req.params.username}).then( user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found"});
    }
  });
});
userRouter.delete("/:username", checkAuth, (req, res, next) => {
  console.log("Usao u delete u back delete");
  User.deleteOne({username: req.params.username }).then(result => {
    res.status(200).json({message: "User deleted"});
  })
  .catch(err => {
    console.log("error u users.js deletu");
  });
});

userRouter.delete("/:id", checkAuth, (req, res, next) => {
  User.deleteOne({_id: req.params.idUser}).then(result =>{
    res.status(200).json({message: "User deleted"});
  }).catch(err => {
    console.log("doslo je do greske u back deletu");
    console.log(err);
  });
});


// userRouter.put("/:id", checkAuth, multer({storage: storage}).single("image"), (req, res, next) => {
//   let imagePath = req.body.imagePath;
//   if (req.file) {
//     const url = req.protocol + "://" + req.get("host");
//     imagePath = url + "/images" + req.file.filename;
//   }
//   const user = new AuthData({
//     _id: req.body.idUser,
//     username: req.body.username,
//     password: req.body.password,
//     name: req.body.name,
//     surname: req.body.surname,
//     profession: req.body.profession,
//     sex: req.body.sex,
//     type: req.body.type,
//     personalID: req.body.personalID,
//     secretAnswer: req.body.secretAnswer,
//     secretQuestion: req.body.secretQuestion,
//     approved: req.body.approved,
//     confirmPassword: req.body.confirmPassword,
//     imagePath: req.body.imagePath,
//     email: req.body.email
//   });
//   User.updateOne({_id: req.params.idUser}, user).then(result => {
//     res.status(200).json({message: "Update succesful"});
//   });
// });

module.exports = userRouter;
