var controllers = require('../Controllers/user.controllers.js');
const upload = require('../Config/multerconfig');
const validateToken = require('../auth/jwt_auth').validateToken;
module.exports = (app) => {
// test
app.get('/', controllers.test)
// decrypt 
app.post('/decrypt', controllers.decrypt)
// login
app.post('/login', controllers.login)
// reguser 
app.post('/reguser', controllers.reguser)
// reset password
app.put('/resetpassword',controllers.resetpassword)
// find specific user en done
app.get('/allusers/:userid',validateToken, controllers.findspecificuser)
// show all users en done
app.get('/allusers',validateToken, controllers.allusers)

}