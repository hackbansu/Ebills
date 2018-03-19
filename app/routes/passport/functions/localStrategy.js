const passportLocal = require('passport-local');
const LocalStrategy = passportLocal.Strategy;
const bcrypt = require("bcrypt");
const models = require(process.env.APP_ROOT + "/app/db/models");
const User = models.user;

let ls = new LocalStrategy({
        usernameField: 'contact',
        passwordField: 'password',
    },
    (contact, password, done) => {
        console.log("Checking credentials");
        let whereObj = {
            contact: contact,
        };

        User.findAll({
            where: whereObj,
            limit: 1,
            logging: false
        })
            .then(function (user) {
                if (user.length === 0) {
                    return done(null, false, {message: "invalid contact number"});
                }
                let user = user[0];
                bcrypt.compare(password, user['password'], function(err, res) {
                    if(err){
                        return done(err);
                    }
                    if(res === false){
                        return done(null, false, {message: "invalid password"});
                    }
                    // res == true
                    return done(null, user, {message: "success"});
                });
            })
            .catch(function (err) {
                return done(err);
            })
    });

module.exports = (passport) => {
    passport.use(ls);
};