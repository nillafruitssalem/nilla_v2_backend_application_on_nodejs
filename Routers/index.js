module.exports = (app) => {
   require('./mail.router')(app),
   require('./measure.router')(app),
   require('./order.router')(app),
   require('./product.router')(app),
   require('./user.router')(app)
   // require('../Controllers/user.controllers')(app)
}
