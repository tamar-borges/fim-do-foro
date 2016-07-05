'use strict';
const path = require('path');
const pack = require('../../../package');

var cache = {};
const $baseUrl = 'http://fim-do-foro.mbl.org.br';
module.exports = ($datum) => {
    if (!$datum) $datum = {path: ''};

    if (!cache[$datum.path]) {
        cache[$datum.path] = Object.freeze({
            pack,
            path: $datum.path,
            url: `${$baseUrl}/${pack.name}`,
            template: path.join(__dirname, '..', '..', 'template'),
            partial: path.join(__dirname, '..', '..', 'partials'),
            www: path.join(process.cwd(), `www/${pack.name}`)
        });
    }
    return cache[$datum.path];
};
