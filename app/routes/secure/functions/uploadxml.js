const Router = require("express").Router;
const route = Router();
var fs = require('fs');
const notify = require("./notify");
const convert = require('xml-js');
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
    let isXML = true;
    let newPath = './upload/abc.xml';
    if (req.text.charAt(1) !== 'E') {
        res.write('File uploaded and moved!');
        res.end();
        isXML = false;
        let htmlData = req.text;
        let jsonData = require("./upload/abc.json");
        let pdfLink = "/pdf/abc.pdf";

        notify(jsonData, pdfLink, html, tokens, function (err) {
            console.log("notifications sent");
        });
    }

    fs.writeFile(newpath, req.text, function (err) {
        if (err) throw err;
        console.log('File written!');

        //xml to json
        let xmlData = req.text;
        let jsonData = convert.xml2js(xmlData, {compact: false, spaces: 4});
        let d = jsonData["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"];
        let updatedJsonData = {
            seller: {
                name: d[1]["COMPANY"]["REMOTECMPINFO.LIST"]["REMOTECMPNAME"],
                state: d[1]["COMPANY"]["REMOTECMPINFO.LIST"]["REMOTECMPNAME"]["REMOTECMPSTATE"]
            },
            buyer: {
                name: d[0]["VOUCHER"]["LEDGERENTRIES.LIST"]["LEDGERNAME"]
            },
            invoice: {
                amount: d[0]["VOUCHER"]["LEDGERENTRIES.LIST"]["AMOUNT"],
                date: d[0]["VOUCHER"]["DATE"],
                products: d[0]["VOUCHER"]["ALLINVENTORYENTRIES.LIST"]
            }
        };

        fs.writeFile("./upload/abc.json", updatedJsonData, function (err) {
            if (err) throw err;
            res.write('File uploaded and moved!');
            res.end();
            console.log('File written!');
        })
    });
});

module.exports = route;