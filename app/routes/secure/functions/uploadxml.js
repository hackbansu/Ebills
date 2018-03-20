const Router = require("express").Router;
const route = Router();
var fs = require('fs');
const notify = require("./notify");
const parser = require('xml2json');
const bodyParser = require('body-parser');
route.use(bodyParser.text({
    type: "text/*",
    // defaultCharset: "utf-16"
}));
//
// route.use('/file', function (req, res, next) {
//     console.log(req.get('Content-Type'));
//     console.log("handling");
//     req.text = '';
//     // req.setEncoding('utf8');
//     req.on('data', function (chunk) {
//         req.text += chunk
//     });
//     req.on('end', next);
// });

route.use('/file', function (req, res) {
    let isXML = true;
    let newPath = './upload/abc.xml';
    // req.body = fs.readFileSync("./upload/abc.xml")
    // if (req.text[2] !== 'E') {
    //     res.write('File uploaded and moved!');
    //     res.end();
    //     isXML = false;
    //     let htmlData = req.text;
    //     let jsonData = require("./upload/abc.json");
    //     let pdfLink = "/pdf/abc.pdf";
    //     let token = "dPpJrQ0m5J4:APA91bFb_CdN3C2lKTOyVzvr09R1z_j1mrax3Kx2WGQFlZoQAo0F6R4uR1E0YCLWN7D8YEBqlgAA3TCJXqfaSja12cNWQpeClVnjBPiWrKBwLroAEtQ30qDlzPDeo8JSLzVoC5umshan";
    //     notify(jsonData, pdfLink, html, token, function (err) {
    //         console.log("notifications sent");
    //     });
    // }
    res.write('File uploaded and moved!');
    res.end();
    fs.writeFile(newPath, req.body, function (err) {
        if (err) throw err;
        console.log('File written!');

        //xml to json
        let xmlData = req.body;
        console.log(req.body);
        let jsonData = parser.toJson(xmlData);
        console.log("Converted");
        // fs.writeFile("./upload/test.json", jsonData, function (err) {
        //     console.log("Json saved");
        // })
        // return 1;
        jsonData = JSON.parse(jsonData);
        let d = jsonData["ENVELOPE"]["BODY"]["IMPORTDATA"]["REQUESTDATA"]["TALLYMESSAGE"];
        let updatedJsonData = {
            seller: {
                name: d[1]["COMPANY"]["REMOTECMPINFO.LIST"]["REMOTECMPNAME"],
                state: d[1]["COMPANY"]["REMOTECMPINFO.LIST"]["REMOTECMPSTATE"]
            },
            buyer: {
                name: d[0]["VOUCHER"]["LEDGERENTRIES.LIST"][0]["LEDGERNAME"]
            },
            invoice: {
                amount: d[0]["VOUCHER"]["LEDGERENTRIES.LIST"][0]["AMOUNT"],
                date: d[0]["VOUCHER"]["DATE"],
                products: d[0]["VOUCHER"]["ALLINVENTORYENTRIES.LIST"]
            }
        };


        fs.writeFile("./upload/abc.json", JSON.stringify(updatedJsonData), function (err) {
            if (err) throw err;
            console.log("File written");

            fs.readFile("./upload/abc.html", function (err, data) {
                if (err) throw err;
                console.log("HTML File read");
                let htmlData = "https://3d9312ec.ngrok.io/abc.html"
                let jsonData = JSON.stringify(updatedJsonData);
                console.log(jsonData);
                let pdfLink = "https://3d9312ec.ngrok.io/abc.pdf";
                let token = "f75BEw6Jk-8:APA91bGbCm6aYzkeEjKIfwN1KX8gTfIlwh9DJ62XHXLUzxpYKCUFLwQTgC5-fMHtjW0Bq51NkU56nTVJBBHPXrlxo0n6AoeBBmaddKcVNaOfDaawN6QEBhX4BamiF3_1uM_ZFA0L8uEy";
                notify(jsonData, pdfLink, htmlData, token, function (err) {
                    if(err) throw err;
                    console.log("notifications sent");
                });
                console.log('File written!');
            });
        })
    });
});

module.exports = route;
