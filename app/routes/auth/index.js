const Router = require("express").Router;
const route = Router();

module.exports = (passport, mailTransporter) => {
    const routes = {
        local: require("./functions/local")(passport, mailTransporter),
        verification: require("./functions/verification")(mailTransporter)
    };

    route.use('/local', routes.local);
    route.use('/verification', routes.verification);

    return route;
};