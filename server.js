/**
 * Module dependencies.
 */
import dotenv from 'dotenv';

var express = require('express'),
    fs = require('fs'),
    passport = require('passport'),
    logger = require('mean-logger'),
    io = require('socket.io');

dotenv.config();

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

//Load configurations
//if test env, load example file
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
    config = require('./config/config'),
    auth = require('./config/middlewares/authorization'),
    mongoose = require('mongoose');

//Bootstrap db connection
mongoose.Promise = global.Promise;
var db = mongoose.connect(config.db);
//Bootstrap models
var models_path = __dirname + '/app/models';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js|coffee)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);

//bootstrap passport config
require('./config/passport')(passport);
var app = express();

app.use(function(req, res, next){
    next();
});
//express settings
require('./config/express')(app, passport, mongoose);

//Bootstrap routes
require('./config/routes')(app, passport, auth);

//Start the app by listening on <port>
var port = config.default.port;
var server = app.listen(process.env.PORT || port);

// function stop() {
//     server.close();
//   }

var ioObj = io.listen(server, { log: false });
//game logic handled here
require('./config/socket/socket')(ioObj);
console.log(`Express app started on port ${process.env.PORT || port}`);

//Initializing logger
logger.init(app, passport, mongoose);

//expose app
exports = module.exports = app;
// exports = module.exports = stop;
