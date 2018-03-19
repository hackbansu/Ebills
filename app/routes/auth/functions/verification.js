const Router = require("express").Router;
const route = Router();
const randomString = require("randomstring");
const models = require(process.env.APP_ROOT + "/app/db/models");
const User = models.user;
const accountSid = process.env.TWILIO_ACCOUNTSID;
const authToken = process.env.TWILIO_AUTHTOKEN;
const client = require('twilio')(accountSid, authToken);

module.exports = (mailTransporter) => {

    //query = {otp, contact}
    route.get('/verifyOTP', function (req, res, next) {
        let otp = parseInt(req.query["otp"]);
        let contact = req.query["contact"];
        User
            .findAll({
                where: {
                    contact: contact,
                    otp: otp
                },
                limit: 1
            })
            .then(obj => {
                if (obj.length === 0) {
                    return res.status(400).json({status: false, msg: "not found"});
                }
                let user = obj[0];
                user
                    .update({
                        is_contact_verified: true,
                        otp: null
                    })
                    .then(() => {
                        req.login(user, function (err) {
                            if (err) {
                                console.log(err);
                                return res.status(503).json({status: false, msg: "error in processing"});
                            }
                            return res.status(200).json({status: true, msg: "contact verified and login successful"});
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        return res.status(503).json({status: false, msg: "error in database"})
                    });
            })
            .catch((err) => {
                console.log(err);
                return res.status(503).json({status: false, msg: "error in database"})
            });
    });

    //query = {contact}
    route.get('/resendOTP', function (req, res, next) {
        let contact = req.query["contact"];
        User
            .findAll({
                where: {
                    contact: contact,
                },
                limit: 1
            })
            .then(obj => {
                if (obj.length === 0 || obj[0].is_contact_verified) {
                    return res.status(400).json({status: false, msg: "not found"});
                }
                let user = obj[0];
                // add the otp
                let otp = randomString.generate({
                    length: 8,
                    charset: 'numeric'
                });
                user
                    .update({
                        otp: otp
                    })
                    .then(() => {
                        //sending the otp
                        client["messages"].create({
                            body: "Hi, your otp for E-Bills id is " + otp,
                            to: "+91" + user.contact,
                            from: "+" + process.env.TWILIO_ADMIN_CONTACT,
                        })
                            .then((message) => {
                                return res.status(200).json({status: true, msg: "otp sent"});
                            })
                            .catch(err => {
                                console.log(err);
                                return res.status(503).json({status: false, msg: "error in sending otp"})
                            });
                    })
                    .catch((err) => {
                        console.log(err);
                        return res.status(503).json({status: false, msg: "error in database"})
                    });
            })
            .catch((err) => {
                console.log(err);
                return res.status(503).json({status: false, msg: "error in database"})
            });
    });

    //query = {isBlogger, emailVerifKey, email}
    route.get('/verifyEmail', function (req, res, next) {
        let emailVerifyKey = req.query["emailVerifyKey"];
        let email = req.query["email"];
        User
            .findAll({
                where: {
                    email: email,
                    email_verify_key: emailVerifyKey
                },
                limit: 1
            })
            .then(obj => {
                if (obj.length === 0) {
                    return res.status(400).json({status: false, msg: "not found"});
                }
                obj[0]
                    .update({
                        is_email_verified: true,
                        email_verify_key: null
                    })
                    .then(() => {
                        return res.status(200).json({status: true, msg: "email verified successfully"});
                    })
                    .catch((err) => {
                        console.log(err);
                        return res.status(503).json({status: false, msg: "error in database"})
                    });
            })
            .catch((err) => {
                console.log(err);
                return res.status(503).json({status: false, msg: "error in database"})
            });
    });

    // check that user is logged in to resend email
    route.use(function (req, res, next) {
        if (!req["user"]) {
            return res.status(403).json({status: false, msg: "please log in first"});
        }
        return next();
    });

    //query = {isBlogger, email}
    route.get('/resendEmail', function (req, res, next) {
        let user = req["user"];
        if (user.is_email_verified) {
            return res.status(400).json({status: false, msg: "email already verified"});
        }

        let emailLink = "http://" + process.env.DOMAIN + "/api/auth/verification/verifyEmail?email=" + user.email
            + "&emailVerifyKey=" + user.email_verify_key;
        let mailOptions = {
            from: process.env.EMAIL_ID, // sender address
            to: user.email, // list of receivers
            subject: 'verify E-Bills email', // Subject line
            text: `click the link or copy paste in browser to verify E-Bills email id: ${emailLink}`, // plain text body
        };

        // send mail with defined transport object
        mailTransporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(503).json({status: false, msg: "error in sending mail"});
            }
            console.log('Message sent: %s', info.messageId);
            return res.status(200).json({status: true, msg: "verification mail sent"});
        });
    });

    return route;
};
