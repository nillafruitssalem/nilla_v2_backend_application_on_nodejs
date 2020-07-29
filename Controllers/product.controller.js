const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const indexschema = require("../Schema")
const upload = require('../Config/multerconfig');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
const aes256 = require('aes256');

//  show all products with out jwt token en_complete
exports.allproduct_withoutauth = async (req,res) =>{
    indexschema.productschema.find({}).then(result => {
        return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": true, "Data": result })));        
    }).catch(e => {
        console.log(e)
        return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": false, "Error": e })));        
    })
}
//  show all products en_complete
exports.allproducts = async (req, res) => {
    indexschema.productschema.find({}).then(result => {
        return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": true, "Data": result })));                
    }).catch(e => {
        console.log(e)
        return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": false, "Error": e })));                
    })
}
//  add Product
exports.addProduct = async (req, res) => {
    req.body = JSON.parse(aes256.decrypt(process.env.ENKEY, req.body.data));
    req.file = JSON.parse(aes256.decrypt(process.env.ENKEY, req.body.data));
    let myarray = [];
    myarray.push(JSON.parse(req.body.pdata));
    if (!req.file) {
        res.status(500);
        res.json('file not found');
        res.end();
        return;
    }
    cloudinary.uploader.upload(req.file.path, (err, data) => {
        if (err) {
            console.log("err on cloudinary", err)
            res.end();
            return;
        }
        if (data) {
            prod = new indexschema.productschema({
                productid: (myarray[0].productname).substring(0, 3) + Date.now(),
                productname: myarray[0].productname,
                productrate: myarray[0].productrate,
                productqty: myarray[0].productqty,
                productunits: myarray[0].productunits,
                productimage: data["secure_url"],
                productimgdet: data
            })
            prod.save().then(result => {
                res.json({ "status": true, "msg": "Record Insertion Success" });
                res.end();
            }).catch(e => {
                console.log(e)
                res.json({ "status": false, "msg": "Record Insertion UnSuccess", "Error": e });
                res.end();
                return;
            })
        }
    })
}
// update Product
exports.updateProduct = async (req, res) => {
    // app.put("/updateproduct/:pid", upload.single('file'), (req, res) => {
    let myarray = [];
    myarray.push(JSON.parse(req.body.pdata));
    console.log("updateproduct", JSON.parse(req.body.pdata))
    if (!req.file) {
        indexschema.productschema.findOneAndUpdate(
            { "productid": req.params.pid },
            {
                "productname": myarray[0].productname,
                "productrate": myarray[0].productrate,
                "productqty": myarray[0].productqty,
                "productunits": myarray[0].productunits
            }).then(result => {
                res.json({ "status": true, "msg": "Record Updated Success" });
                res.end();
            }).catch(e => {
                console.log(e)
                res.json({ "status": false, "msg": "Record Updated UnSuccess", "Error": e });
                res.end();
            })
    }
    if (req.file) {
        cloudinary.uploader.upload(req.file.path, (err, data) => {
            if (err) {
                res.json({ "status": false, "msg": "Error on Cloudinary" });
                res.end();
            }
            if (data) {
                indexschema.productschema.findOneAndUpdate(
                    { "productid": req.params.pid },
                    {
                        "productname": myarray[0].productname,
                        "productrate": myarray[0].productrate,
                        "productqty": myarray[0].productqty,
                        "productunits": myarray[0].productunits,
                        "productimage": data["secure_url"],
                        "productimgdet": data
                    }).then(result => {
                        res.json({ "status": true, "msg": "Record Updated Success" });
                        res.end();
                    }).catch(e => {
                        console.log(e)
                        res.json({ "status": false, "msg": "Record Updated UnSuccess", "Error": e });
                        res.end();
                    })
            }
        })
    }
}
// delete Product
exports.deleteproduct = async (req, res) => {    
    indexschema.productschema.findOneAndDelete(
        { "productid": req.params.pid }).then(result => {
            if (result == null) {
                return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": true, "msg": "No Record found" })));                
            }
            return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": true, "msg": "Record Deletion Success" })));                            
        }).catch(e => {
            console.log(e)
            return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": false, "msg": "Record Deletion UnSuccess", "Error": e })));            
        })
}
// specific Product en_complete
exports.getspecificproduct = async (req, res) => {
    indexschema.productschema.findOne({ "productid": req.params.pid })
        .then(result => {
            if (result == null) {
                return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": true, "msg": "No Record found" })));                
            }
            return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": true, "Data": result })));            
        }).catch(e => {
            console.log(e)
            return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": false, "msg": "No Record from all products ", "Error": e })));                        
        })
}
