'use strict';
const path = require('path');
const pack = require('../../../package');

var cache = {};
const $baseUrl = 'https://fimdoforo.mbl.org.br';
//const $baseUrl = 'https://fim-do-foro.firebaseapp.com';
module.exports = ($datum) => {
    if (!$datum) $datum = {path: '/'};

    if (!cache[$datum.path]) {
        cache[$datum.path] = Object.freeze({
            pack,
            path: $datum.path,
            url: $baseUrl,
            template: path.join(__dirname, '..', '..', 'template'),
            partial: path.join(__dirname, '..', '..', 'partials'),
            www: path.join(process.cwd(), 'www')
        });
    }
    return cache[$datum.path];
};
