const Router = require("express").Router;
const route = Router();
const randomString = require("randomstring");
const models = require(process.env.APP_ROOT + "/app/db/models");
const User = models.user;
const Blogger = models.blogger;
const bcrypt = require('bcrypt');
const salt = parseInt(process.env.SALT);
const accountSid = process.env.TWILIO_ACCOUNTSID;
const authToken = process.env.TWILIO_AUTHTOKEN;
const client = require('twilio')(accountSid, authToken);

module.exports = (passport, mailTransporter) => {
    //body = {contact, password}
    route.post('/login', function (req, res, next) {
        passport.authenticate('local', function (err, user, info) {
            if (err) {
                console.log(err);
                return res.status(503).json({status: false, msg: "error in database"});
            }
            if (!user) {
                return res.status(404).json({status: false, msg: info.message});
            }
            if (!user.is_contact_verified) {
                return res.status(404).json({
                    status: false,
                    msg: "please verify your contact " + user.contact,
                    notVerified: "contact"
                });
            }

            req.login(user, function (err) {
                if (err) {
                    console.log(err);
                    return res.status(503).json({status: false, msg: "error in processing"});
                }
                return res.status(200).json({status: true, msg: "login successful"});
            })
        })(req, res, next);
    });

    //body = {email, contact, password, first_name, last_name, gender}
    route.post('/signUp', function (req, res) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
            if (err) {
                console.log(err);
                return res.status(503).json({status: false, msg: "error in processing"});
            }
            req.body.password = hash;
            let otp = randomString.generate({
                length: 6,
                charset: 'numeric'
            });
            User
                .findOrCreate({
                    where: {
                        contact: req.body.contact,
                    },
                    defaults: {
                        password: req.body.password,
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        gender: req.body.gender.toUpperCase(),
                        email: req.body.email,
                        email_verify_key: randomString.generate(15),
                        otp: otp
                    },
                    logging: false
                })
                .spread((user, created) => {
                    if (!created) {
                        res.status(400).json({status: false, msg: "already signedUp"});
                    }
                    //send otp
                    client.messages.create({
                        body: "Hi, your otp for E-Bills id is " + otp,
                        to: "+91" + user.contact,
                        from: "+" + process.env.TWILIO_ADMIN_CONTACT,
                    })
                        .then((message) => {
                            return res.status(200).json({status: true, msg: "otp sent"});
                        })
                        .catch(err => {
                            return res.status(503).json({status: false, msg: "error in sending otp"})
                        });
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(503).json({status: false, msg: "error in database"})
                });
        });
    });

    return route;
};
