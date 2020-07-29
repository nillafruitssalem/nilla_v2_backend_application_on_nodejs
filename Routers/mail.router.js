var controllers = require('../Controllers/mail.controllers');
const upload = require('../Config/multerconfig');
const validateToken = require('../auth/jwt_auth').validateToken;

module.exports = (app) => {

    // sending mail product order to cutomer
    app.post("/customerordermail",validateToken, controllers.customerordermail);

    // customer complaint mail
    app.post("/usercomplaintmail",validateToken, controllers.usercomplaintmail);

    // send offer mail to customer
    app.post("/sendoffermailtocustomer",validateToken, controllers.sendoffermailtocustomer);
   
}