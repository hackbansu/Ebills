const passport = require('passport');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const models = require(process.env.APP_ROOT + "/app/db/models");

module.exports = (app) => {
    const dbConf = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
    };
    const sessionStore = new MySQLStore(dbConf);

    require('./functions/localStrategy')(passport);

    app.use(session({
        secret: process.env["SECRET"],
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, cb) {
        return cb(null, {id: user.id});
    });
    passport.deserializeUser(require("./functions/deserializeUser"));

    return passport;
};
