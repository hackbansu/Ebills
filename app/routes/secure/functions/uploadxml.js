const Router = require("express").Router;
const route = Router();
var fs = require('fs');
const notify = require("../generic/index")

const bodyParser = require('body-parser');
{
    app.use(bodyParser.json());
    app.use(bodyParser.text());
    app.use(bodyParser.urlencoded({extended: false}));
}

route.use('/fileupload', function (req, res, next) {
    console.log(req.get('Content-Type'));
    console.log("handling");
    req.text = '';
    // req.setEncoding('utf8');
    req.on('data', function (chunk) {
        req.text += chunk
    });
    req.on('end', next);
});

route.use('/fileupload', function (req, res) {
    var newpath = './upload/myfile.xml';
    fs.writeFile(newpath, req.text, function (err) {
        if (err) throw err;
        res.write('File uploaded and moved!');
        res.end();
        console.log('File written!');


    });
});

module.exports = route;
