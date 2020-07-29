const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const indexschema = require("../Schema")
const upload = require('../Config/multerconfig');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
const aes256 = require('aes256');
const express = require("express");

// test en_complete
exports.test = async (req, res) => {
    return res.status(200).json("Connected");    
}
// decrypt en_complete
exports.decrypt = async (req, res) => {
    return res.json(JSON.parse(aes256.decrypt(process.env.ENKEY, req.body.Data)));    
}
// reguser en_complete
exports.reguser = async (req,res) =>{
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
            return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": true, "msg": "Record Insertion Success" })));                        
        }).catch(e => {
            console.log(e)
            return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": false, "msg": "Record Insertion UnSuccess", "Error": e })));            
        })
    }).catch(e => {
        console.log(e)
        return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": false, "msg": "Record Insertion UnSuccess", "Error": e })));        
    })

}
// login en_complete
exports.login = async (req, res) => {
    req.body  = JSON.parse(aes256.decrypt(process.env.ENKEY, req.body.data));    
    // console.log(req.body,"req bdoy")
    jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60), data: req.body.emailid }, process.env.SECRETECODE, (e, d) => {
        // jwt.sign(req.body.name,app.get('setsecret'),{expiresIn: Math.floor(Date.now() / 1000) + (60 * 1) },(e,d)=>{   
        if (e) {
            return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": false, "Error": e })));            
        }
        if (d) {
            indexschema.userschema.findOne({ "emailid": req.body.emailid }).then(result => {
                if (result == null) {
                    return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": false, "msg": "Your Are Not A User / Check your Credencials" })));                                
                } else {
                    bcrypt.compare(req.body.password, result["password"]).then(hashcmp => {
                        if (hashcmp == true) {
                            return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": true, "Data": result, "token": d })));                            
                        }
                        if (hashcmp == false) {
                            return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": false, "msg": "Incorrect Password" })));                                                            
                        }

                    }).catch(e => {
                        return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": false, "Error": e })));                      
                    })

                }
            }).catch(e => {
                return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": false, "Error": e })));
            })
        }
    })
}
// reset password en_complete
exports.resetpassword = async (req,res) =>{
    req.body = JSON.parse(aes256.decrypt(process.env.ENKEY, req.body.data));
    const saltRounds = 14;
    bcrypt.hash(req.body.resetpassword, saltRounds).then(hash => {
        indexschema.userschema.findOneAndUpdate(
            { "emailid": req.body.emailid, "phonenumber": req.body.phonenumber },
            {
                "password": hash
            }).then(result => {
                if (result == null) {
                    return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": false, "msg": "Record  Not Updated Successfully" })));                                        
                }
                else {
                    return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": true, "msg": "Record Updated Success" })));                                        
                }
            }).catch(e => {
                console.log(e)
                return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": false, "msg": "Record Updated UnSuccess", "Error": e })));                
            })
    }).catch(e => {
        console.log(e)
        return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": false, "msg": "Record Updated UnSuccess", "Error": e })));                        
    })
}
// find specific user en_complete
exports.findspecificuser = async (req, res) => {
    req.params = JSON.parse(aes256.decrypt(process.env.ENKEY, req.params.userid));
    indexschema.userschema.findOne({ userid: req.params.userid }).then(result => {
        return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": true, "Data": result })));                
    }).catch(e => {
        console.log(e)
        return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": false, "Error": e })));        
    })
}
// show all users en_complete
exports.allusers = async (req, res) => {    
    indexschema.userschema.find({}).then(result => {
        return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": true, "Data": result })));        
    }).catch(e => {
        console.log(e)
        return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": false, "Error": e })));        
    })
}

