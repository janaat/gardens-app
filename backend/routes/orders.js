const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Order = require("../models/order");
const Product=require("../models/product");
const Storage=require("../models/storage");
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/check");

router.post("/addorder", (req, res, next) => {
  console.log("Usao u orders.js");
  const order = new Order({
    user: req.body.user,
    products: req.body.products,
    status: req.body.status,
    date: req.body.date,
    isDelivered: req.body.isDelivered,
    garden: req.body.garden
  });
  console.log(order);
  order
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Order added",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Orders.js jao bre",
        error: err,
      });
    });
});
router.post("/deliver", (req, res, next) => {
  Order.updateOne({ user:req.body.user,date:req.body.date}, { status: req.body.status }) //bilo status: "In delivery"
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Order update failed",
        });
      }
      return res.status(200).json({
        message: "Order updated",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error while approving user!",
      });
    });
});
router.post("/delivered", (req, res, next) => {
  Order.updateOne({ user: req.body.user,date:req.body.date}, { status: req.body.status, isDelivered: true }) //bilo status: "Delivered"
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Order update failed",
        });
      }
      return res.status(200).json({
        message: "Order updated",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error while approving user!",
      });
    });
});
router.get("", (req, res, next) => {
  //console.log("Usao u get u orders.js");
  Order.find().then((documents) => {
    //console.log(documents);
    res.status(200).json({
      message: "Orders fetched successfully",
      products: documents,
    });
  });
});

router.post("/delete", (req, res, next) => {
  Order.deleteOne({ name: req.body.name, date: req.body.date})
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Error while deleting",
        });
      }
      return res.status(200).json({
        message: "Product deleted",
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error while deleting user",
      });
    });
});
router.post("/storageupdate",(req,res,next)=>{
  // console.log("Usao u orders.js storage update");
  const product = new Product({
    name: req.body.name,
    manufacturer: req.body.manufacturer,
    type: req.body.type,
    quantity: req.body.quantity,
    progress: req.body.progress,
    dynamics: req.body.dynamics,
    rating: req.body.rating,
    available: req.body.available,
    reviews: req.body.reviews
  });
  // console.log(product);
  product
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Product added",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Orders.js jao bre storageupdate",
        error: err,
      });
    });

})




// iznad je updatestorage




// router.post("/water", (req, res, next) => {
//   Garden.findOneAndUpdate({'name':req.body.name},{$inc: {'water': 1}})
//   .then(result => {
//     const garden=new Garden({
//       username: result.username,
//       name: result.name,
//       place: result.place,
//       free: result.free,
//       used: result.used,
//       water: result.water,
//       temperature: result.temperature,
//       products: result.products,
// //       storage: result.storage,
// x:req.body.x,
// y:req.body.y
//     });
//     console.log(garden);
//     if (!result) {
//       return res.status(401).json({
//         message: "Water adding failed"
//       });
//     }
//     return res.status(200).json({
//       message:"Water updated"
//     });
//   })
//   .catch(err => {
//     res.status(500).json({
//       message: "Error while adding water!"
//     })
//   });
// });
// router.post("/temperature", (req, res, next) => {
//   console.log("Usao u temp u gardens.js");
//   Garden.findOneAndUpdate({'name': req.body.name},{$inc: {'temperature':1}}) // izbacila {temp: req.body.temp+1}
//   .then(result => {
//     console.log("aaaaaaaaaaaaaaaaaa"+result);
//     const garden=new Garden({
//       username: result.username,
//       name: result.name,
//       place: result.place,
//       free: result.free,
//       used: result.used,
//       water: result.water,
//       temperature: result.temperature,
// //       products: result.products,
// //       storage: result.storage,
// x:req.body.x,
// y:req.body.y
//     });
//     console.log(garden);
//     //garden.temperature+=1;
//     if (!result) {
//       console.log("nije nasao bastu");
//       return res.status(401).json({
//         message: "Temperature adding failed"
//       });
//     }
//     console.log("Nasao bastu");
//     console.log(garden.temperature);
//     return res.status(200).json({
//       message:"Temperature updated"
//     });
//   })
//   .catch(err => {
//     res.status(500).json({
//       message: "Error while adding temperature!"
//     })
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
// router.get("", (req, res, next) => {
//   Garden.find().then(documents => {
//     res.status(200).json({
//       message: "Gardens fetched successfully",
//       gardens: documents
//     });
//   });
// });
// router.get("/:id", (req, res, next) => {
//   Garden.findById(req.params.idUser).then(garden => {
//     if (garden) {
//       res.status(200).json(garden);
//     } else {
//       res.status(404).json({ message: "Garden not found"});
//     }
//   });
// });
// router.get("/:name", (req, res, next) => {
//   Garden.findOne({'name': req.params.name}).then( garden => {
//     if (garden) {
//       console.log("Nasao bastu");
//       res.status(200).json(garden);
//     } else {
//       console.log("Nije nasao bastu");
//       res.status(404).json({ message: "Garden not found"});
//     }
//   });
// });
// router.delete("/:username", checkAuth, (req, res, next) => {
//   console.log("Usao u delete u gardens.js");
//   Garden.deleteOne({username: req.params.username }).then(result => {
//     res.status(200).json({message: "Garden deleted"});
//   })
//   .catch(err => {
//     console.log("error u gardens.js deletu");
//   });
// });
// router.delete("/:id", checkAuth, (req, res, next) => {
//   Garden.deleteOne({_id: req.params.idUser}).then(result =>{
//     res.status(200).json({message: "Garden deleted"});
//   }).catch(err => {
//     console.log("doslo je do greske u gardens.js delete");
//     console.log(err);
//   });
// });

module.exports = router;
