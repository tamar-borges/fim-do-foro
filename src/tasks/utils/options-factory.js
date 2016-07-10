'use strict';
const pathsPactory = require('./paths');

module.exports = ($datum) => {
    let $paths = pathsPactory($datum);
    return {
        ignorePartials: true, //ignores the unknown footer2 partial in the handlebars template, defaults to false
        partials: {},
        batch: [$paths.partial],
        helpers: {
            iff: function (a, operator, b, opts) {
                let bool = false;
                switch (operator) {
                    case '==':
                        bool = a == b;
                        break;
                    case '!=':
                        bool = a != b;
                        break;
                    case '>':
                        bool = a > b;
                        break;
                    case '<':
                        bool = a < b;
                        break;
                    default:
                        throw `Unknown operator ${operator}`;
                }

                if (bool) {
                    return opts.fn(this);
                } else {
                    return opts.inverse(this);
                }
            }
        }
    };
};
