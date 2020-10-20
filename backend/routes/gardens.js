const express = require("express");
const router = express.Router();
const Garden = require("../models/garden");
const Storage = require("../models/storage");
const Product = require("../models/product");
var nodemailer = require("nodemailer");
const checkAuth = require("../middleware/check");

router.post("/addgarden", (req, res, next) => {
  console.log("Usao u gardens.js");
  const garden = new Garden({
    username: req.body.username,
    name: req.body.name,
    place: req.body.place,
    free: req.body.free,
    used: req.body.used,
    water: req.body.water,
    temperature: req.body.temperature,
    products: req.body.products,
    storage: req.body.storage,
    x: req.body.x,
    y: req.body.y,
  });
  console.log(garden);
  garden
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Garden added",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Gardens.js jao bre",
        error: err,
      });
    });
  const storage = new Storage({
    status: true,
    name: req.body.name,
    products: null,
  });
  storage
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Storage added too",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Storage nije prosao",
        error: err,
      });
    });
});
router.post("/takeout", (req, res, next) => {
  Garden.findOneAndUpdate(
    { name: req.body.name },
    { products: req.body.products, $inc:{used:-1,free:1}}
  )
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Takeout failed",
        });
      }
      return res.status(200).json({
        message: "Takeout updated",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error while takeout!",
      });
    });
});
router.post("/water", (req, res, next) => {
  console.log("Usao u water u gardens.js");
  Garden.findOneAndUpdate({ name: req.body.name }, { $inc: { water: 1 } })
    .then((result) => {
      console.log("Usao u then");
      const garden = new Garden({
        username: result.username,
        name: result.name,
        place: result.place,
        free: result.free,
        used: result.used,
        water: result.water,
        temperature: result.temperature,
        products: result.products,
        storage: result.storage,
        x: result.x,
        y: result.y,
      });
      console.log(garden);
      if (!result) {
        return res.status(401).json({
          message: "Water adding failed",
        });
      }
      return res.status(200).json({
        message: "Water updated",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error while adding water!",
      });
    });
});
router.post("/temperature", (req, res, next) => {
  console.log("Usao u temp u gardens.js");
  Garden.findOneAndUpdate({ name: req.body.name }, { $inc: { temperature: 1 } })
    .then((result) => {
      console.log("aaaaaaaaaaaaaaaaaa" + result);
      const garden = new Garden({
        username: result.username,
        name: result.name,
        place: result.place,
        free: result.free,
        used: result.used,
        water: result.water,
        temperature: result.temperature,
        products: result.products,
        storage: result.storage,
        x: result.x,
        y: result.y,
      });
      console.log(garden);
      //garden.temperature+=1;
      if (!result) {
        console.log("nije nasao bastu");
        return res.status(401).json({
          message: "Temperature adding failed",
        });
      }
      console.log("Nasao bastu");
      console.log(garden.temperature);
      return res.status(200).json({
        message: "Temperature updated",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error while adding temperature!",
      });
    });
});
router.post("/delete", (req, res, next) => {
  Garden.deleteOne({ username: req.body.name })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Error while deleting",
        });
      }
      return res.status(200).json({
        message: "User deleted",
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error while deleting user",
      });
    });
});
router.get("", (req, res, next) => {
  Garden.find().then((documents) => {
    res.status(200).json({
      message: "Gardens fetched successfully",
      gardens: documents,
    });
  });
});
router.get("/:name", (req, res, next) => {
  Garden.findOne({ name: req.params.name }).then((garden) => {
    if (garden) {
      console.log("Nasao bastu");
      res.status(200).json(garden);
    } else {
      console.log("Nije nasao bastu");
      res.status(404).json({ message: "Nije nasao bastu" });
    }
  });
});
router.post("/addstarted",(req,res,next)=>{
  Garden.findOneAndUpdate({ name: req.body.name }, { products:req.body.plant })
    .then((result) => {
      res.status(201).json({
        message: "Product added to planted",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Orders.js jao bre planted ne valja",
        error: err,
      });
    })
});
router.post("/plant",(req,res,next)=>{
  Garden.findOneAndUpdate({name:req.body.name},{products:req.body.products,$inc:{free:-1,used:1}}).then((result)=>{
    if (!result) {
      return res.status(401).json({
        message: "Error while planting!!",
      });
    }
    return res.status(200).json({
      message: "Planted successfully",
    });
  })
  .catch((error) => {
    res.status(500).json({
      message: "Error while planting",
    });
  });
})
// router.get("/getfert/:name", (req, res, next) => {
//   Garden.findOne({storage: req.params.storage}).then( garden => {          // ovo je za glupi getfertilizator
//     if (garden) {
//       console.log("Nasao bastu");
//       res.status(200).json(garden);
//     } else {
//       console.log("Nije nasao bastu");
//       res.status(404).json({ message: "Nije nasao bastu"});
//     }
//   });
// });
router.delete("/:username", checkAuth, (req, res, next) => {
  console.log("Usao u delete u gardens.js");
  Garden.deleteOne({ username: req.params.username })
    .then((result) => {
      res.status(200).json({ message: "Garden deleted" });
    })
    .catch((err) => {
      console.log("error u gardens.js deletu");
    });
});
router.delete("/:id", checkAuth, (req, res, next) => {
  Garden.deleteOne({ _id: req.params.idUser })
    .then((result) => {
      res.status(200).json({ message: "Garden deleted" });
    })
    .catch((err) => {
      console.log("doslo je do greske u gardens.js delete");
      console.log(err);
    });
});
router.post("/decr", (req, res, next) => {
  Garden.updateMany({}, { $inc: { water: -1, temperature: -0.5 } })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Decrease failed",
        });
      }
      return res.status(200).json({
        message: "Decrease updated",
      });
      // const garden=new Garden({
      //   username: result.username,
      //   name: result.name,
      //   place: result.place,
      //   free: result.free,
      //   used: result.used,
      //   water: result.water,
      //   temperature: result.temperature,
      // products: result.products,
      // storage: result.storage,
      // x:result.x,
      // y:result.y
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error while decreasing!",
      });
    });
});

module.exports = router;
