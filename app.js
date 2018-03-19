const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const logger = require('morgan');
const dotenv = require('dotenv');

process.env.APP_ROOT = __dirname;
dotenv.config();
dotenv.load();
const app = express();

const routes = require("./app/routes");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser(process.env.SECRET));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


if (process.env.NODE_ENV !== 'PRODUCTION') {
    console.log("In Development Environment");
} else {
    console.log("PRODUCTION ENVIRONMENT");
}

app.use(express.static('uploads'));
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    console.log("Not Found");
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    console.log(err);
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'DEVELOPMENT' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({status: false, msg: 'error'});
});

module.exports = app;