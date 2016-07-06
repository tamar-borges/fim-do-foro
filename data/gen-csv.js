var fs = require('fs');
var data = require('./national-congress-data'),
    commission = require('./commission');
var csv = [
];
for (let i= 0, len=data.length; i<len; i++) {
    let p = data[i];
    let line = [
        p.email,
        '',
        p.fullName || p.shortName,
        p.shortName,
        p.party,
        p.state,
        ~commission.indexOf(p.email) ? 'X' : '',
        p.phone,
        '',
        '',
        p.cabinet,
        p.site,
        p.image,
        p.gender
    ];
    csv.push(line.join(';'));
}

fs.writeFileSync(`${__dirname}/fim-do-foro.csv`, csv.join('\n'), 'utf8');


