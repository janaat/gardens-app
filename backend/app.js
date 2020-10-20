const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const userRoutes=require('./routes/userss'); // users ili userss su dve opcije
const productRoutes=require('./routes/products');
const gardenRoutes = require('./routes/gardens');
const orderRoutes = require('./routes/orders.js');
const storageRoutes = require('./routes/storages.js');

const app = express();

mongoose.connect("mongodb+srv://Jana:zSDWwRXidOQyjI82@rasadnik-ukcsb.mongodb.net/test", {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
  console.log("Congrats!! You're connected to database");

})
.catch((error) => {
  console.log(error);
  console.log("Sorry, connection failed!");
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const server = require('http').createServer(app);

mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});
server.listen(app.get('port'), function() {
  console.log("GETTING ON PORT : "+app.get('port'));
});
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/garden", gardenRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/storage", storageRoutes);

module.exports=app;
