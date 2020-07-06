var controllers = require('../Controllers/controllers');
const upload = require('../Config/multerconfig');

module.exports = (app) => {

    // app.get('/', controllers.initial);

    //  show all products with out jwt token
    // app.get('/allproduct_withoutauth', controllers.allproduct_withoutauth);

    // //  register user
    // app.post('/reguser', controllers.reguser);

    // //  login
    // app.post('/login', controllers.login);

    // reset password
    // app.put("/resetPassword",controllers.resetPassword);

    // find specific user
    app.get('/allusers/:userid', controllers.findspecificuser);

    // show all users
    app.get('/allusers', controllers.allusers);

    //  show all products
    app.get('/allproduct', controllers.allproducts);

    //  add Product
    app.post("/addproduct", upload.single('file'), controllers.addProduct);

    // update Product
    app.put("/updateproduct/:pid", upload.single('file'), controllers.updateProduct);

    // delete Product
    app.delete("/deleteproduct/:pid", controllers.deleteproduct);

    // specific  Product
    app.get("/allproduct/:pid", controllers.getspecificproduct);

    // add order
    app.post("/addorder_user/:pid", controllers.addOrder);

    // allorderconformdetails
    app.get("/allorderconformdetails/:orderdate", controllers.allorderconformdetails);

    // maintaining users cart orders
    app.get("/userorderdetails_cart/:userid", controllers.userorderdetails);

    // users conformation order cart
    app.post("/userorderdetails_cart_conformation/:userid", controllers.userorderdetails_cart_conformation);


    // pending user order
    app.get("/pendingorder/:userid", controllers.pendingorder);


    // user order history
    app.get("/orderhistory/:userid", controllers.orderhistory);

    //  cancel order
    app.get("/usercancelorder/:orderid", controllers.usercancelorder);

    // conform order
    app.post("/conformorder", controllers.confromorder);

    // sending mail product order to cutomer
    app.post("/customerordermail", controllers.customerordermail);

    // customer complaint mail
    app.post("/usercomplaintmail", controllers.usercomplaintmail);

    // send offer mail to customer
    app.post("/sendoffermailtocustomer", controllers.sendoffermailtocustomer);

    // add measure units
    app.post("/addmeasure", controllers.addmeasure);

    // all measure units
    app.get("/allmeasure", controllers.allmeasure);

    // delete measure units
    app.delete("/deletemeasure/:unitsid", controllers.deletemeasure);
}