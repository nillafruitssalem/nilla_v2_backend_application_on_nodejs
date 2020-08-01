const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const indexschema = require("../Schema")
const upload = require('../Config/multerconfig');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
const aes256 = require('aes256');


// add measure units en_complete
exports.addmeasure = async (req, res) => {
    req.body = JSON.parse(aes256.decrypt(process.env.ENKEY, req.body.data));    
    units = new indexschema.measureschema({
        unitsid: (req.body.units).substring(0, 2) + Date.now(),
        units: req.body.units
    })
    units.save().then(result => {
        return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": true, "msg": "Record Insertion Success" })));                
    }).catch(e => {
        console.log(e)
        return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": false, "msg": "Record Insertion UnSuccess", "Error": e })));        
      })
    // })
}
// all measure units en_complete
exports.allmeasure = async (req, res) => {    
    indexschema.measureschema.find({}).then(result => {
        return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": true, "Data": result })));        
    }).catch(e => {
        console.log(e)
        return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": false, "Error": e })));        
    })
    // })
}
// delete measure units en_complete
exports.deletemeasure = async (req, res) => {      
    
    indexschema.measureschema.findOneAndDelete(
        { "unitsid": req.params.unitsid }).then(result => {
            if (result == null) {
                return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": true, "msg": "No Record found" })));                
            }
            return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": true, "msg": "Record Deletion Success" })));                            
        }).catch(e => {
            console.log(e)
            return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": false, "msg": "Record Deletion UnSuccess", "Error": e })));                            
          })
    // })
}