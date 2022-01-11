const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const PasswordUtility = require('../utilities/password');

const User = require('../models/user');

// authentication using passport
passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, (email, password, done) => {
    // Match user
    User.findOne({ email: email })
        .then(user => {

            if(!user){
                console.log('Not Found');
                return done(null, false, { message: 'Email not recognized' });
            }

            // Match password
            const isValid = PasswordUtility.validPassword(password, user.hash, user.salt);
            if(isValid){
                return done(null, user);
            }
            return done(null, false, { message: 'Incorrect Password' });
        })
        .catch(err => {
            return done(err);
        });
}));

// serializing the user to decide which key is to be kept in the cookie
passport.serializeUser(function(user, done){
    done(null, user.id);
});

// deserializing the user from the key in the cookie
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding the user --> Passport');
            return done(err);
        }
        return done(null, user);
    });
});

// check if user is authenticated
passport.checkAuthentication = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/user/login');
}

passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;