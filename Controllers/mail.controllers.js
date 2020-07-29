const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const indexschema = require("../Schema")
const upload = require('../Config/multerconfig');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
const aes256 = require('aes256');

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
     req.body = JSON.parse(aes256.decrypt(process.env.ENKEY, req.body.data));

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
                return res.json(aes256.encrypt(process.env.ENKEY, JSON.stringify({ "status": true, "msg": "Mail sent was successfully", "Data": result })));
                //  res.json({ "status": true, "msg": "Mail sent was successfully", "Data": result });
                res.end();
            }
        }).catch(async e => {
            return res.json({ "status": false, "Error": e });
            res.end();
        })

    })    
}
