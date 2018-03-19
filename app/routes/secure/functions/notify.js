
module.exports = (json, pdf, html, token, cb) => {
    const FCM = require('fcm-node');
    const serverKey = 'AAAAqnuzpeU:APA91bElb1MezHLiDYNPyFFGC9CaSuNOCMqvwpkxd8oSFd68UMUR4gS1DDYVtJ_ZzWrGXM4pi0NbJwRH86lwg-zRm38HqYITxQs6gMu_PhIXR9ca4-wWIfP4xu3fep7f9wLiErcGoDpi';

    const fcm = new FCM(serverKey);

    const message = {
        to: token,
        collapse_key: 'green',

        notification: {
            title: 'Title of your push notification',
            body: 'This is just a random message'
        },

        data: {  //you can send only notification or only data(or include both)
            json,
            pdf
        }
    };

    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!");
            cb(err);
        } else {
            console.log("Successfully sent with response: ", response);
            cb(null);
        }
    });
};