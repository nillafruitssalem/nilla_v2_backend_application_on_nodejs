var controllers = require('../Controllers/order.controller');
const upload = require('../Config/multerconfig');
const validateToken = require('../auth/jwt_auth').validateToken;
module.exports = (app) => {

      // add order
    app.post("/addorder_user/:pid",validateToken, controllers.addOrder);

    // allorderconformdetails
    app.get("/allorderconformdetails/:orderdate",validateToken, controllers.allorderconformdetails);

    // maintaining users cart orders
    app.get("/userorderdetails_cart/:userid",validateToken, controllers.userorderdetails);

    // users conformation order cart
    app.post("/userorderdetails_cart_conformation/:userid",validateToken, controllers.userorderdetails_cart_conformation);


    // pending user order
    app.get("/pendingorder/:userid",validateToken, controllers.pendingorder);


    // user order history
    app.get("/orderhistory/:userid",validateToken, controllers.orderhistory);

    //  cancel order
    app.get("/usercancelorder/:orderid",validateToken, controllers.usercancelorder);

    // conform order
    app.post("/conformorder",validateToken, controllers.confromorder);

}