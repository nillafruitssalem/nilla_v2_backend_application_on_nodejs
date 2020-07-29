const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
require('dotenv').config({ path: './.env' });

module.exports = {
    dbconnection: () => {
        mongoose.Promise = global.Promise;
        mongoose.connection.on('connected', function () {
            console.log('Connection to Mongo established.');
            if (mongoose.connection.client.s.url.startsWith('mongodb+srv')) {
                mongoose.connection.db = mongoose.connection.client.db(process.env.DBNAME);
            }
        });
        mongoose.connect(process.env.MONGODBURL, { dbName: process.env.DBNAME, useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true }).catch(err => {
            if (err) {
        
                console.log("TEST", err)
                return err;
            }
        })
    }
}