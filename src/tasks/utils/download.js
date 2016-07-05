'use strict';
const fs = require('fs'),
    request = require('request');

module.exports = (uri, filename) => new Promise((resolve, reject) => {
    request.head(uri, (err, res) => {
        if (err) {
            console.log('error in:', err);
            return reject(err);
        } else if (res.statusCode >= 400) {
            console.log(res.statusCode, 'invalid url', uri);
            //return reject(new Error(res));
            return resolve();
        }
        console.log('start downloading from: ', uri);
        //console.log('content-type:', res.headers['content-type']);
        //console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', () => resolve());
    });
});
