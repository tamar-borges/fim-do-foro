var fs = require('fs');
var data = require('./national-congress-data');
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

fs.writeFileSync('fim-do-foro.csv', csv.join('\n'), 'utf8');


