const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const indexschema = require("../Schema")
const upload = require('../Config/multerconfig');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
const aes256 = require('aes256');

// add order
exports.addOrder = async (req, res) => {
    // app.post("/addorder_user/:pid", (req, res) => {
    indexschema.productschema.findOne({ "productid": req.params.pid }).then(result => {
        // console.log("reuslt order", result)
        if (result.productqty == 0) {
            res.json({ "status": false, "msg": "out of stock please update product quatity" });
            res.end();
            return;
        }
        else {
            let fd = new Date();
            let s = fd.getDate().toString().padStart(2, "0") + "-" + (fd.getMonth() + 1).toString().padStart(2, "0") + "-" + fd.getFullYear()
            // console.log(s)
            order = new indexschema.orderschema({
                userid: req.body.userid,
                orderid: (req.body.userid).substring(0, 6) + Date.now(),
                productid: req.params.pid,
                postedBy: indexschema.userschema._id,
                orderhistory: false,
                orderproductname: result.productname,
                orderproductrate: result.productrate,
                orderproductqty: req.body.orderqty,
                orderproductunits: result.productunits,
                orderproductimage: result.productimage,
                orderconform: false,
                orderedon: s
            })
            order.save().then(result => {
                res.json({ "status": true, "msg": "Order added  Success" });
                res.end();
            }).catch(e => {
                console.log(e)
                res.json({ "status": false, "msg": "Unable to add the Order UnSuccess", "Error": e });
                res.end();
            })
        }
    }).catch(e => {
        res.json({ "status": false, "msg": e });
        res.end();
    })
}
// allorderconformdetails
exports.allorderconformdetails = async (req, res) => {
    // app.get("/allorderconformdetails/:orderdate", async (req, res) => {
    indexschema.orderschema.find({ "orderedon": req.params.orderdate, "orderhistory": true, "orderconform": false })
        .then(async result => {
            // console.log("admin orders", result) 
            if (result == null) {
                res.json({ "status": true, "msg": "No Record found" });
                res.end();
            } else {

                res.json({ "status": true, "Data": await result });
                res.end();
            }
        }).catch(e => {
            console.log(e)
            res.json({ "status": false, "msg": "No Record from all products ", "Error": e });
            res.end();
        })

}
// maintaining users cart orders
exports.userorderdetails = async (req, res) => {
    // app.get("/userorderdetails_cart/:userid", (req, res) => {
    // console.log(req.params.userid)
    indexschema.orderschema.find({ "userid": req.params.userid, "orderhistory": false, "orderconform": false })
        .then(result => {
            if (result == null) {
                res.json({ "status": true, "msg": "No Record found" });
                res.end();
            }
            else {
                res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": true, "Data": result })));                
                res.end();
            }
        }).catch(e => {
            console.log(e)
            res.json({ "status": false, "msg": "No Record from all products ", "Error": e });
            res.end();
        })

}
// users conformation order cart en done
exports.userorderdetails_cart_conformation = async (req, res) => {
    // app.post("/userorderdetails_cart_conformation/:userid", (req, res) => {
        req.body = JSON.parse(aes256.decrypt(process.env.ENKEY, req.body.data));
    indexschema.orderschema.find({ "userid": req.params.userid, "orderid": req.body.orderid, "orderhistory": false, "orderconform": false })
        .then(result => {
            if (result == null) {
                res.json({ "status": true, "msg": "No Record found" });
                res.end();
            }
            else {

                indexschema.orderschema.findOneAndUpdate(
                    { "orderid": req.body.orderid },
                    { "orderhistory": true })
                    .then(orderresult => {

                        res.json({ "status": true, "msg": "Your order conforms" });
                        res.end();
                    }).catch(e => {
                        res.json({ "status": false, "msg": "No Record from all products ", "Error": e });
                        res.end();
                    })

            }
        }).catch(e => {
            console.log(e)
            res.json({ "status": false, "msg": "No Record from all products ", "Error": e });
            res.end();
        })
    // })

}
// pending user order en done
exports.pendingorder = async (req, res) => {
    // app.get("/pendingorder/:userid", (req, res) => {
    indexschema.orderschema.find({ "userid": req.params.userid, "orderhistory": true, "orderconform": false })
        .then(result => {
            if (result == null) {
                res.json({ "status": false, "msg": "No Record found" });
                res.end();
            }
            else {
                res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": true, "Data": result })));                                
                res.end();
            }
        }).catch(e => {
            console.log(e)
            res.json({ "status": false, "msg": "No Record from all products ", "Error": e });
            res.end();
        })
    // })

}
// user order history
exports.orderhistory = async (req, res) => {
    // app.get("/orderhistory/:userid", (req, res) => {
    indexschema.orderschema.find({ "userid": req.params.userid, "orderhistory": true, "orderconform": true })
        .then(result => {
            if (result == null) {
                res.json({ "status": false, "msg": "No Record found" });
                res.end();
            }
            else {

                res.json({ "status": true, "Data": result });
                res.end();
            }
        }).catch(e => {
            console.log(e)
            res.json({ "status": false, "msg": "No Record from all products ", "Error": e });
            res.end();
        })
    // })

}
//  cancel order
exports.usercancelorder = async (req, res) => {
    // app.get("/usercancelorder/:orderid", (req, res) => {
    indexschema.orderschema.findOneAndDelete(
        { "orderid": req.params.orderid }).then(result => {
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
// conform order
exports.confromorder = async (req, res) => {
    var updatenode = false;
    var count = 0;
    var orderarray = req.body.order;
    orderarray.forEach(async (i) => {
        count++;
        console.log("Count $$$$$$$$$", count)
        console.log(await i, await i)
        await indexschema.orderschema.findOneAndUpdate(
            { "userid": await i.userid, "orderid": await i.orderid, "productid": await i.productid, "orderedon": await i.orderedon, "orderhistory": await i.orderhistory },
            { "orderconform": true }) //updating here
            .then(async () => {
                // console.log("order data", orderdata)
                await indexschema.productschema.find({ "productid": await i.productid })
                    .then(async proddet => {

                        if (proddet[0]["productqty"] != 0 || await proddet[0]["productqty"] >= await i.orderproductqty && proddet[0]["productqty"] > 0) {
                            var totalqty = 0;
                            // console.log("******",proddet[0]["productqty"]);
                            totalqty = await parseFloat(proddet[0]["productqty"]) - await parseFloat(i.orderproductqty)
                            // console.log("Toal qty",totalqty)
                            // console.log("Toal qty 2",proddet.productqty,i.orderproductqty);
                            await indexschema.productschema.findOneAndUpdate(
                                { "productid": await i.productid },
                                { "productqty": totalqty }
                            ).then(() => {
                                if (orderarray.length == count) {
                                    updatenode = true;

                                }
                            })
                                .catch(e => {
                                    console.log("error on product schema findone and update", e)
                                    return res.json({ "status": false, "err": e });
                                    res.end();
                                })
                        } else {

                            console.log("check your qty")

                            await indexschema.orderschema.findOneAndUpdate(
                                { "userid": await i.userid, "orderid": await i.orderid, "productid": await i.productid, "orderedon": await i.orderedon, "orderhistory": await i.orderhistory },
                                { "orderconform": false }) //updating here
                                .then(async () => {
                                    return res.json({ "status": true, "msg": "check your qty" });
                                    res.end();

                                })
                        }
                        if (updatenode == true) {
                            return res.json({ "status": true, "msg": "order conformed" });
                            res.end();
                        }

                    })
                    .catch(e => {
                        console.log("error on product schema find", e)
                    })


            }).catch(e => {
                console.log("Error on order schema", e)
            });
    });

    // res.end();
    // })
}

