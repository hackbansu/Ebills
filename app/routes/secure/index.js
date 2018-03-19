const Router = require("express").Router;
const route = Router();

route.use('/upload', require("./functions/uploadxml"));

route.use(function (req, res, next) {
    if (!req["user"]) {
        return res.status(403).json({status: false, msg: "please log in first"});
    }
    return next();
});

module.exports = route;