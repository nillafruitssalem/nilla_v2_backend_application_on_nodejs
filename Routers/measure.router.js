var controllers = require('../Controllers/measure.controller');
const upload = require('../Config/multerconfig');
const validateToken = require('../auth/jwt_auth').validateToken;
module.exports = (app) => {    
    // add measure units
    app.post("/addmeasure",validateToken, controllers.addmeasure);

    // all measure units
    app.get("/allmeasure",validateToken, controllers.allmeasure);

    // delete measure units
    app.delete("/deletemeasure/:unitsid",validateToken, controllers.deletemeasure);
}