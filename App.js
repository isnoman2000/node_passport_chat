/**
 * Created by Noman on 2/15/15.
 */

var express = require('express'),
    app = express(),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    config = require('./config/config.js'),
    connectMongo = require('connect-mongo')(session),
    mongoose = require('mongoose').connect(config.dbURL),
    passport = require('passport'),
    facebookStrategy = require('passport-facebook').Strategy;
var rooms =[];

//set the views path
app.set('views', path.join(__dirname, 'views'));

//define templating engine and rendaring
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname , 'public')));
app.use(cookieParser());

var env = process.env.NODE_ENV || 'development';
if(env === 'development') {
    app.use(session({
            secret : config.sessionSecret,
            saveUninitialized: true,
            resave: true
        }
    ));

} else {
    app.use(session({
            secret : config.sessionSecret,
            saveUninitialized: true,
            resave: true,

            /** manual connection ***/
/*
            store: new connectMongo({
                url: config.dbURL,
                stringify:true
            })
*/
            /** Mongoose Connections**/
            store: new connectMongo({
                mongooseConnection:mongoose.connections[0],
                stringify:true
            })
        }
    ));
}


/** example of saving database**/
/*
var userSchema = mongoose.Schema({
    'username': String,
    'password': String,
    'fullname': String
});

var person = mongoose.model('users', userSchema);

var userNoman = new person({
    'username': 'saifnoman',
    'password': 'Saifnoman99999',
    'fullname': 'Saif Noman'
});

userNoman.save(function(err){
    console.log('User saved!!!');
});

*/
/**end save**/

app.use(passport.initialize());
app.use(passport.session());

require('./auth/passportAuth.js')(passport, facebookStrategy, config, mongoose);
require('./routes/routes.js')(express, app, passport, config, rooms);





//define the routes for HTTP request

//make server listening on port 3000
//app.listen(3000, function(){
//    console.log('NodeChat working at!!!' + __dirname);
//    console.log('Environment is : ' + env);
//    console.log('config sessionsecren is : ' + config.sessionSecret);
//});

app.set('port', process.env.PORT||3000);
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
require('./socket/socket.js')(io, rooms);

server.listen(app.get('port'), function(){
    console.log('NodeChat working at!!!' + app.get('port'));
});

//mongodb://chatcat:nomanchatcat@ds047591.mongolab.com:47591/chatcat

