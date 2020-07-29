const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const indexschema = require("../Schema")
const upload = require('../Config/multerconfig');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
const aes256 = require('aes256');


// add measure units en done
exports.addmeasure = async (req, res) => {
    req.body = JSON.parse(aes256.decrypt(process.env.ENKEY, req.body.data));
    // app.post("/addmeasure", (req, res) => {
    units = new indexschema.measureschema({
        unitsid: (req.body.units).substring(0, 2) + Date.now(),
        units: req.body.units
    })
    units.save().then(result => {
        res.json({ "status": true, "msg": "Record Insertion Success" });
        res.end();
    }).catch(e => {
        console.log(e)
        res.json({ "status": false, "msg": "Record Insertion UnSuccess", "Error": e });
        res.end();
    })
    // })
}
// all measure units en done
exports.allmeasure = async (req, res) => {    
    indexschema.measureschema.find({}).then(result => {
        res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": true, "Data": result })));
        res.end();
    }).catch(e => {
        console.log(e)
        res.json({ "status": false, "Error": e });
        res.end();
    })
    // })
}
// delete measure units problem
exports.deletemeasure = async (req, res) => {    
    // console.log(JSON.stringify(req.params))
    // req.body = JSON.parse(aes256.decrypt(process.env.ENKEY, req.body.data));
    req.params = JSON.parse(aes256.decrypt(process.env.ENKEY, req.body.data));
    // console.log(req.body,"DEL")  
 console.log(req.params,"DEL")
    // app.delete("/deletemeasure/:unitsid", (req, res) => {
    indexschema.measureschema.findOneAndDelete(
        { "unitsid": req.params.unitsid }).then(result => {
            if (result == null) {
                res.json({ "status": true, "msg": "No Record found" });
                res.end();
            }
            res.json({ "status": true, "msg": "Record Deletion Success" });
            res.end();
        }).catch(e => {
            console.log(e)
            res.json({ "status": false, "msg": "Record Deletion UnSuccess", "Error": e });
            res.end();
        })
    // })
}