const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const indexschema = require("../Schema")
const upload = require('../Config/multerconfig');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;

// exports.initial = async (req, res) => {
//     res.json("Connected");
//     res.end();
// }

//  show all products with out jwt token
// exports.allproduct_withoutauth = async (req, res) => {
//     // app.get("/allproduct_withoutauth", (req, res) => {
//     indexschema.productschema.find({}).then(result => {
//         res.json({ "status": true, "Data": result });
//         res.end();
//     }).catch(e => {
//         console.log(e)
//         res.json({ "status": false, "Error": e });
//         res.end();
//     })
// }
// // register user
// exports.reguser = async (req, res) => {
//     // app.post("/reguser", (req, res) => {
//     user = new indexschema.userschema({
//         userid: (req.body.username).substring(0, 3) + Date.now(),
//         username: req.body.username,
//         password: req.body.password,
//         emailid: req.body.emailid,
//         address: req.body.address,
//         phonenumber: req.body.phonenumber,
//         location: req.body.location
//     })
//     user.save().then(result => {
//         res.json({ "status": true, "msg": "Record Insertion Success" });
//         res.end();
//     }).catch(e => {
//         console.log(e)
//         res.json({ "status": false, "msg": "Record Insertion UnSuccess", "Error": e });
//         res.end();
//     })
// }
// // login 
// exports.login = async (req, res) => {
//     // app.post("/login", (req, res) => {
//     jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60), data: req.body.emailid }, app.get('setsecret'), (e, d) => {
//         // jwt.sign(req.body.name,app.get('setsecret'),{expiresIn: Math.floor(Date.now() / 1000) + (60 * 1) },(e,d)=>{   
//         if (e) {
//             res.json({ "status": false, "Error": e });
//             res.end();
//         }
//         if (d) {
//             indexschema.userschema.findOne({ "emailid": req.body.emailid, "password": req.body.password }).then(result => {
//                 if (result == null) {
//                     res.json({ "status": false, "msg": "Your Are Not A User / Check your Credencials" });
//                     res.end();
//                 } else {
//                     res.json({ "status": true, "Data": result, "token": d });
//                     res.end();
//                 }
//             }).catch(e => {
//                 // console.log(e)
//                 res.json({ "status": false, "Error": e });
//                 res.end();
//             })
//         }
//     })
// }

// reset password
// exports.resetPassword = async (req, res) => {
// console.log("reset password",req.body)
//     const saltRounds = 14;
//     bcrypt.hash(req.body.resetpassword, saltRounds).then(hash => {
//         indexschema.userschema.findOneAndUpdate(
//             { "emailid": req.body.emailid },
//             {
//                 "password": hash
//             }).then(result => {
//                 res.json({ "status": true, "msg": "Record Updated Success" });
//                 res.end();
//             }).catch(e => {
//                 console.log(e)
//                 res.json({ "status": false, "msg": "Record Updated UnSuccess", "Error": e });
//                 res.end();
//             })
//     }).catch(e => {
//         console.log(e)
//         res.json({ "status": false, "msg": "Record Updated UnSuccess", "Error": e });
//         res.end();
//     })

// }

// find specific user
exports.findspecificuser = async (req, res) => {
    // app.get("/allusers/:userid", (req, res) => {
    indexschema.userschema.findOne({ userid: req.params.userid }).then(result => {
        res.json({ "status": true, "Data": result });
        res.end();
    }).catch(e => {
        console.log(e)
        res.json({ "status": false, "Error": e });
        res.end();
    })
}
// show all users
exports.allusers = async (req, res) => {
    // app.get("/allusers", (req, res) => {
    indexschema.userschema.find({}).then(result => {
        res.json({ "status": true, "Data": result });
        res.end();
    }).catch(e => {
        console.log(e)
        res.json({ "status": false, "Error": e });
        res.end();
    })
}
//  show all products
exports.allproducts = async (req, res) => {
    // app.get("/allproduct", (req, res) => {
    indexschema.productschema.find({}).then(result => {
        res.json({ "status": true, "Data": result });
        res.end();
    }).catch(e => {
        console.log(e)
        res.json({ "status": false, "Error": e });
        res.end();
    })
}
//  add Product
exports.addProduct = async (req, res) => {
    // app.post("/addproduct", upload.single('file'), (req, res) => {
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
    // app.delete("/deleteproduct/:pid", (req, res) => {
    indexschema.productschema.findOneAndDelete(
        { "productid": req.params.pid }).then(result => {
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
}
// specific  Product
exports.getspecificproduct = async (req, res) => {
    // app.get("/allproduct/:pid", (req, res) => {
    indexschema.productschema.findOne({ "productid": req.params.pid })
        .then(result => {
            if (result == null) {
                res.json({ "status": true, "msg": "No Record found" });
                res.end();
            }
            res.json({ "status": true, "Data": result });
            res.end();
        }).catch(e => {
            console.log(e)
            res.json({ "status": false, "msg": "No Record from all products ", "Error": e });
            res.end();
        })
}
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

                res.json({ "status": true, "Data": result });
                res.end();
            }
        }).catch(e => {
            console.log(e)
            res.json({ "status": false, "msg": "No Record from all products ", "Error": e });
            res.end();
        })

}
// users conformation order cart
exports.userorderdetails_cart_conformation = async (req, res) => {
    // app.post("/userorderdetails_cart_conformation/:userid", (req, res) => {
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
// pending user order
exports.pendingorder = async (req, res) => {
    // app.get("/pendingorder/:userid", (req, res) => {
    indexschema.orderschema.find({ "userid": req.params.userid, "orderhistory": true, "orderconform": false })
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
// sending mail product order to cutomer
exports.customerordermail = async (req, res) => {
    // app.post("/customerordermail", (req, res) => {
    // console.log(req.body);    
    var mydata = req.body.order
    // console.log(mydata.length)
    var text = "";
    var i;
    var total = 0;

    text += "<br>"
    text += "<p>Your  Purchased Product  is Conformed !!!</p>"
    text += "<br>"
    text += "<br>"
    text += "<html>"
    text += "<head>"
    text += "<meta charset='utf-8'>"
    text += "<meta name='viewport' content='width=device-width, initial-scale=1'>"
    text += "<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css'>"
    text += "<script src='https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js'></script>"
    text += "<script src='https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js'></script>"
    text += "<script src='https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js'></script>"
    text += "<style>"
    text += " table { "
    text += " font-family: arial, sans-serif;"
    text += " border-collapse: collapse;"
    text += " width: 100%;"
    text += "  }"
    text += " td, th {"
    text += " border: 1px solid #dddddd;"
    text += " text-align: left;"
    text += " padding: 8px;"
    text += "}"
    text += "tr:nth-child(even) {"
    text += "background-color: #dddddd;"
    text += "}"
    text += " div.a {"
    text += " text-align: center;"
    text += " }"
    text += "div.c {"
    text += "text-align: right;"
    text += " } "
    text += "</style>"
    text += "</head>"
    text += "<table class='table table-bordered table-striped'>"
    text += "<tbody>"
    text += "<thead>"
    text += "<tr>"
    text += "<th>Orderid</th>"
    text += "<th>Product Image</th>"
    text += "<th>Product Name</th>"
    text += "<th>Rate</th>"
    text += "<th>Quantity</th>"
    text += "<th>Units</th>"
    text += "<th>Ordered On</th>"
    text += "<th>Subtotal</th>"
    text += "</tr>"
    text += "</thead>"
    for (i = 0; i < mydata.length; i++) {
        // console.log(mydata)
        let subtotal = parseFloat(mydata[i].orderproductrate.$numberDecimal) * parseFloat(mydata[i].orderproductqty)
        total += subtotal;
        text += "<tr>"
        text += "<td>" + mydata[i].orderid + "</td>"
        text += "<td><img src=" + mydata[i].orderproductimage + " width='50' height='50'/></td>"
        text += "<td>" + mydata[i].orderproductname + "</td>"
        text += "<td>" + mydata[i].orderproductrate.$numberDecimal + "</td>"
        text += "<td>" + mydata[i].orderproductqty + "</td>"
        text += "<td>" + mydata[i].orderproductunits + "</td>"
        text += "<td>" + mydata[i].orderedon + "</td>"
        text += "<td><b><span>&#8377;</span>" + subtotal + "<b></td>"
        text += "</tr>"
    }
    text += "<tfoot>"
    text += "<td>" + '' + "</td>"
    text += "<td>" + '' + "</td>"
    text += "<td>" + '' + "</td>"
    text += "<td>" + '' + "</td>"
    text += "<td>" + '' + "</td>"
    text += "<td>" + '' + "</td>"
    text += "<td>" + "Grand Total" + "</td>"
    text += "<td><b><span>&#8377;</span>" + total + "<b></td>"
    text += "</tfoot>"
    text += "</table>"
    text += "<br>"
    text += "<br>"
    text += "<label>Total : </label>"
    text += " <b><span>&#8377;</span><b><input type='text' readonly value=" + total + "><b><br>"
    text += "<label>Cash Type : </label>"
    text += " <input type='text' readonly value='Cash on Delivery'><br>"
    text += "<div class='a'>"
    text += "<h4>Thank you visit again</h4>"
    text += "<p>Nilla Fruits Salem</p>"
    text += "</div>"
    text += "<div class='c'>"
    text += "<h4>Contanct us</h4>"
    text += "<p>Address :" + "<br>"
    text += "5c," + "<br>"
    text += "Thandavarayan Street," + "<br>"
    text += "Shevapet," + "<br>"
    text += "Salem - 636002" + "<br>"
    text += "Phone : 9943835254" + "<br>"
    text += ": 8610585202</p>" + "<br>"
    text += "</div>"
    text += "</tbody>"
    text += "</html>"

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAILID,
            pass: process.env.GMAILPASSWORD
        }
    });
    let fd = new Date();
    let s = fd.getDate() + "-" + (fd.getMonth() + 1) + "-" + fd.getFullYear()
    let mailOptions = {
        from: 'nillafruitssalem@gmail.com',
        to: req.body.receivermailid,
        subject: 'Order Confirmation' + " " + s,
        text: 'Nilla Fruits Salem',
        html: text
    };
    transporter.sendMail(mailOptions).then(result => {
        // console.log("Email send", result)
        res.json({ "status": true, Data: result, "msg": "order confrom mail was sent successfully" });
        res.end();
    }).catch(e => {
        console.log(e);
        res.json({ "status": false, err: e, "msg": "unsuccess mail" });
        res.end();
    })

    // })

}
// customer complaint mail
exports.usercomplaintmail = async (req, res) => {
    // app.post("/usercomplaintmail", (req, res) => {
    let fd = new Date();
    let s = fd.getDate() + "-" + (fd.getMonth() + 1) + "-" + fd.getFullYear()
    var text = '';
    text += '<p>' + req.body.message + '</p>'
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAILID,
            pass: process.env.GMAILPASSWORD
        }
    });

    let mailOptions = {
        from: req.body.fromid,
        to: req.body.toid,
        subject: req.body.subject + '  ' + s,
        html: text
    };
    transporter.sendMail(mailOptions).then(result => {
        res.json({ "status": true, "msg": "Mail sent was successfully", "Data": result });
        res.end();
    }).catch(e => {
        res.json({ "status": false, "Error": e });
        res.end();
    })
    // })
}
// send offer mail to customer
exports.sendoffermailtocustomer = async (req, res) => {
    // app.post("/sendoffermailtocustomer", (req, res) => {
    var allmailid = [];
    var count = 0;
    allmailid = req.body.toarraymail;

    let fd = new Date();
    let s = fd.getDate() + "-" + (fd.getMonth() + 1) + "-" + fd.getFullYear()
    var text = '';
    text += '<p>' + req.body.message + '</p>'

    allmailid.forEach(async (i) => {
        count++;
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAILID,
                pass: process.env.GMAILPASSWORD
            }
        });

        let mailOptions = {
            from: 'nillafruitssalem@gmail.com',
            to: await i,
            subject: req.body.subject + '  ' + s,
            html: text,
        };

        await transporter.sendMail(mailOptions).then(async result => {
            if (allmailid.length == count) {
                return res.json({ "status": true, "msg": "Mail sent was successfully", "Data": result });
                res.end();
            }
        }).catch(async e => {
            return res.json({ "status": false, "Error": e });
            res.end();
        })

    })
    // })
}
// add measure units
exports.addmeasure = async (req, res) => {
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
// all measure units
exports.allmeasure = async (req, res) => {
    // app.get("/allmeasure", (req, res) => {
    indexschema.measureschema.find({}).then(result => {
        res.json({ "status": true, "Data": result });
        res.end();
    }).catch(e => {
        console.log(e)
        res.json({ "status": false, "Error": e });
        res.end();
    })
    // })
}
// delete measure units
exports.deletemeasure = async (req, res) => {
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