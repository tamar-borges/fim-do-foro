'use strict';
const $path = require('path');
//const $fs = require('fs');

module.exports = [{
    //description: $fs.readFileSync($path.join(__dirname, 'desc.txt'), 'utf8').split(/\n/).map(d => d.trim()),
    file: $path.join(__dirname, 'Fim do Foro.xlsx'),
    congress: require('./national-congress-data'),
    senate: require('./national-senate-data'),
    executive: require('./national-executive-data'),
    investigations: require('./process/investigations'),
    prosecutions: require('./process/prosecutions')
}];
