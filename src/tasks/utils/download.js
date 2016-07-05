'use strict';
const fs = require('fs'),
    request = require('request');

module.exports = (url, filename) => new Promise((resolve, reject) => {
    let options = {
        url,
        headers: {
            'User-Agent': 'Mozilla/5.0'
        }
    };
    request.head(options, (err, res) => {
        if (err) {
            console.log('error in:', url, err);
            return reject(err);
        } else if (res.statusCode >= 400) {
            console.log(res.statusCode, 'invalid url', url);
            //return reject(new Error(res));
            return resolve();
        }
        console.log('start downloading from: ', url);
        //console.log('content-type:', res.headers['content-type']);
        //console.log('content-length:', res.headers['content-length']);

        request(options).pipe(fs.createWriteStream(filename)).on('close', () => resolve());
    });
});
