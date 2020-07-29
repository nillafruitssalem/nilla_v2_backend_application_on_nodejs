const jwt = require('jsonwebtoken');
// const validateToken = require('../utils').validateToken;
module.exports = {
  validateToken: (req, res, next) => {
    var token = req.headers['access-token']
    if (token) {
        jwt.verify(token, process.env.SECRETECODE, (err, data) => {
            if (err) {
                return res.status(401).json({ status: false, msg: "invalid token", Error: err });            
            } else {
                next();
            }
        })
    } else {
        return res.status(401).json({ status: false, msg: 'No Token Provided' });    
    }
  }
};