require('dotenv').config({ path: './Config/.env' });
const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const cloudinary = require('cloudinary').v2;
const path = require("path");
const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const db = require('./Config/db.config');
var app = express();
app.use(bodyparser.json({ limit: '50mb' }));
app.use(bodyparser.urlencoded({ extended: true }))
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.set('setsecret', process.env.SECRETECODE);
require('./Routers/index.js')(app);

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
db.dbconnection();
// console.log(db.dbconnection,"db connection")
// mongoose.Promise = global.Promise;
// mongoose.connection.on('connected', function () {
//     console.log('Connection to Mongo established.');
//     if (mongoose.connection.client.s.url.startsWith('mongodb+srv')) {
//         mongoose.connection.db = mongoose.connection.client.db(process.env.DBNAME);
//     }
// });
// mongoose.connect(process.env.MONGODBURL, { dbName: process.env.DBNAME, useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true }).catch(err => {
//     if (err) {

//         console.log("TEST", err)
//         return err;
//     }
// })
var port = process.env.PORT || 3000;
app.listen(port, (err) => {
    if (!err) {
        console.info(`REST API running on port ${port}`)
    }
    return err;

})

// test();
// function test(){
//     console.log("started")
//     var array = [1,2,3,4,5]
//     return new Promise((resolve,reject) =>{
//      array.forEach(i =>{
//          console.log("data",i)
//          resolve(i)
//      })
//     }).then(()=>{
//         console.log("ended")
//     })
// }