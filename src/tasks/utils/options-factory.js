'use strict';
const pathsPactory = require('./paths');

module.exports = ($datum) => {
    let $paths = pathsPactory($datum);
    return {
        ignorePartials: true, //ignores the unknown footer2 partial in the handlebars template, defaults to false
        partials: {},
        batch: [$paths.partial],
        helpers: {
            capitals: function(str){
                return str.toUpperCase();
            }
        }
    };
};
