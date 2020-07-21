require('dotenv').config({ path: './Config/.env' });
const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const bodyparser = require("body-parser");
const cors = require("cors");
const cloudinary = require('cloudinary').v2;
const path = require("path");
const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const indexschema = require("./Schema")
const aes256 = require('aes256');
// const Cryptr = require('cryptr');
// const aes256 = new Cryptr('aes-256');


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

app.get("/", (req, res) => {
    res.json("Connected");
    res.end();
});
//  show all products with out jwt token
app.get("/allproduct_withoutauth", (req, res) => {
    indexschema.productschema.find({}).then(result => {
        res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": true, "Data": result })));
        res.end();
    }).catch(e => {
        console.log(e)
        res.json({ "status": false, "Error": e });
        res.end();
    })
});

app.post("/decrypt", (req, res) => {
    res.json(JSON.parse(aes256.decrypt(process.env.ENKEY, req.body.Data)));
    res.end();
})

// register user
app.post("/reguser", (req, res) => {
    req.body = JSON.parse(aes256.decrypt(process.env.ENKEY, req.body.data));
    const saltRounds = 14;
    bcrypt.hash(req.body.password, saltRounds).then(hash => {
        user = new indexschema.userschema({
            userid: (req.body.username).substring(0, 3) + Date.now(),
            username: req.body.username,
            password: hash,
            emailid: req.body.emailid,
            address: req.body.address,
            phonenumber: req.body.phonenumber,
            location: req.body.location
        })
        user.save().then(result => {
            res.json({ "status": true, "msg": "Record Insertion Success" });
            res.end();
        }).catch(e => {
            console.log(e)
            res.json({ "status": false, "msg": "Record Insertion UnSuccess", "Error": e });
            res.end();
        })
    }).catch(e => {
        console.log(e)
        res.json({ "status": false, "msg": "Record Insertion UnSuccess", "Error": e });
        res.end();
    })
})
// login
app.post("/login", (req, res) => {
    req.body = JSON.parse(aes256.decrypt(process.env.ENKEY, req.body.data));
    jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60), data: req.body.emailid }, app.get('setsecret'), (e, d) => {
        // jwt.sign(req.body.name,app.get('setsecret'),{expiresIn: Math.floor(Date.now() / 1000) + (60 * 1) },(e,d)=>{   
        if (e) {
            res.json({ "status": false, "Error": e });
            res.end();
        }
        if (d) {
            indexschema.userschema.findOne({ "emailid": req.body.emailid }).then(result => {
                if (result == null) {
                    res.json({ "status": false, "msg": "Your Are Not A User / Check your Credencials" });
                    res.end();
                } else {
                    bcrypt.compare(req.body.password, result["password"]).then(hashcmp => {
                        if (hashcmp == true) {
                            res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": true, "Data": result, "token": d })));
                            res.end();
                        }
                        if (hashcmp == false) {
                            res.json({ "status": false, "msg": "Incorrect Password" });
                            res.end();
                        }

                    }).catch(e => {
                        res.json({ "status": false, "Error": e });
                        res.end();
                    })

                }
            }).catch(e => {
                // console.log(e)
                res.json({ "status": false, "Error": e });
                res.end();
            })
        }
    })

})
// en done
app.put("/resetpassword", (req, res) => {    
    req.body = JSON.parse(aes256.decrypt(process.env.ENKEY, req.body.data));
    const saltRounds = 14;
    bcrypt.hash(req.body.resetpassword, saltRounds).then(hash => {
        indexschema.userschema.findOneAndUpdate(
            { "emailid": req.body.emailid, "phonenumber": req.body.phonenumber },
            {
                "password": hash
            }).then(result => {
                // console.log(result,"reset pwd")
                if (result == null) {
                    res.json({ "status": false, "msg": "Record  Not Updated Successfully" });
                    res.end();
                }
                else {
                    res.json({ "status": true, "msg": "Record Updated Success" });
                    res.end();
                }
            }).catch(e => {
                console.log(e)
                res.json({ "status": false, "msg": "Record Updated UnSuccess", "Error": e });
                res.end();
            })
    }).catch(e => {
        console.log(e)
        res.json({ "status": false, "msg": "Record Updated UnSuccess", "Error": e });
        res.end();
    })
})
// jwt auth
app.use((req, res, next) => {
    var token = req.headers['access-token']
    if (token) {
        jwt.verify(token, app.get('setsecret'), (err, data) => {
            if (err) {
                res.json({ status: false, msg: "invalid token", Error: err });
                res.end();
            } else {
                next();
            }
        })
    } else {
        res.json({ status: false, msg: 'no token provided' });
        res.end();
    }
})
require('./Routers/allrouter.js')(app);


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

mongoose.Promise = global.Promise;
mongoose.connection.on('connected', function () {
    console.log('Connection to Mongo established.');
    if (mongoose.connection.client.s.url.startsWith('mongodb+srv')) {
        mongoose.connection.db = mongoose.connection.client.db(process.env.DBNAME);
    }
});
mongoose.connect(process.env.MONGODBURL, { dbName: process.env.DBNAME, useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true }).catch(err => {
    if (err) {

        console.log("TEST", err)
        return err;
    }
})
var port = process.env.PORT || 3000;
app.listen(port, (err) => {
    if (!err) {
        console.log("Port is Listening on " + port);
    }
    return err;

})


