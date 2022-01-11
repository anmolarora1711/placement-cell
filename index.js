require('dotenv').config();
const express = require('express');
const db = require('./config/mongoose');
const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passportLocal = require('./config/passport-local-strategy');
const customMiddleware = require('./config/middleware');


const app = express();

app.use(logger('dev'));

app.use(express.static(__dirname + '/assets'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(expressLayouts);

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// Template engine - EJS
app.set('view engine', 'ejs');
app.set('views', 'views');

// Express Session
app.use(
    session({
        name: 'authentication-template',
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000,
        },
        store: MongoStore.create(
			{
				mongoUrl: db._connectionString,
			},
			function (err) {
				console.log(err || "connect-mongodb setup ok");
			}
		),
    })
);

// Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

// Flash messages
app.use(flash());
app.use(customMiddleware.sendMessages);

// Routes
app.use('/', require('./routes'));

const PORT = process.env.PORT || 8000;

app.listen(PORT, (err) => {
    if(err){
        console.log("Error in starting the server. ", err);
        return;
    }
    console.log(`Server is running on the port: ${PORT}`);
});