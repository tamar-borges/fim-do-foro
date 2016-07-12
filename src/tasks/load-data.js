'use strict';
const gulp = require('gulp');
const _ = require('lodash');
const xlsx = require('node-xlsx');
const diacritics = require('diacritics');
const changeCase = require('change-case');

global.$data = require('../../data');

const setClass = (person) => {
    let vote = person.vote;

    person.class = vote ? 'favor' : vote === false ? 'contra' : 'indeciso';
    person.color = (vote ? 'green' : vote === false ? 'gray' : 'purple');
    return person;
};
const verifyVote = vote => {
    if (!vote || ~vote.indexOf('indec')) {
        vote = undefined;
    } else if (~vote.indexOf('favor')) {
        vote = true;
    } else if (~vote.indexOf('contr')) {
        vote = false;
    }
    return vote;
};

const loadPerson = (dir, indexes) => datum => {
    let name = datum.shortName,
        email = datum.email,
        fileName = diacritics.remove(name).trim().replace(/ /g, '-').toLocaleLowerCase(),
        vote = datum.opinion && datum.opinion.trim().toLowerCase(),
        party = datum.party.trim();

    let person = {
        shortName: changeCase.titleCase(name),
        fullName: datum.fullName ? changeCase.titleCase(datum.fullName) : '',
        dir,
        fileName,
        party,
        phone: datum.phone,
        cabinet: datum.cabinet,
        email,
        siteGov: datum.links && datum.links.details || '',
        site: datum.site,
        facebook: datum.facebook,
        twitter: datum.twitter,
        gender: datum.gender || 'M',
        photo: `${fileName}.jpg`,
        photoUrl: datum.image,
        state: datum.state,
        vote: verifyVote(vote)
    };
    setClass(person);
    indexes[email || fileName.replace(/-/g, '.')] = person;
    return person;
};

gulp.task('load:data', () => {
    for (let d = 0; d < $data.length; d++) {
        let $datum = $data[d];

        if (Array.isArray($datum.desc)) {
            $datum.desc = $datum.desc.join(' ');
        }
        let indexes = {},
            parties = {},
            data = [],
            congress = require('../../data/national-congress-data').map(loadPerson('deputados', indexes)),
            senates = require('../../data/national-senate-data').map(loadPerson('senadores', indexes)),
            executives = require('../../data/national-executive-data').map(loadPerson('executivos', indexes));
        data.push(...senates);
        data.push(...congress);
        data.push(...executives);

        let obj = xlsx.parse($datum.file);
        // Deputados
        obj[0] && obj[0].data && obj[0].data.filter((o, i) => i !== 0 && o[0]).map(o => {
            let email = o[0],
                person = indexes[email];
            if (!person) {
                return;
            }

            let vote = o[1] && o[1].trim().toLowerCase();
            let data = {
                fullName: changeCase.titleCase(o[2]),
                commission: o[6] && o[6].toLowerCase().trim() === 'x',
                phone: o[7],
                facebook: o[8] ? o[8].trim() : null,
                twitter: o[9] ? o[9].trim() : null,
                cabinet: o[10],
                site: o[11] ? o[11].trim() : person.siteGov,
                photoUrl: o[12],
                gender: o[13],
                vote: verifyVote(vote)
            };
            _.extend(person, data);
            setClass(person);
        });

        // Senadores
        obj[1] && obj[1].data && obj[1].data.filter((o, i) => i !== 0 && o[0]).map(o => {
            let email = o[0],
                person = indexes[email];
            if (!person) {
                return;
            }

            let vote = o[1] && o[1].trim().toLowerCase();
            let data = {
                fullName: changeCase.titleCase(o[2]),
                phone: o[6],
                facebook: o[7] ? o[7].trim() : null,
                twitter: o[8] ? o[8].trim() : null,
                cabinet: o[9],
                site: o[10] ? o[10].trim() : person.siteGov,
                photoUrl: o[11],
                gender: o[12],
                vote: verifyVote(vote)
            };
            _.extend(person, data);
            setClass(person);
        });

        // check thiefs
        let thiefs = [
            ['prosecutions', true],
            ['investigations', false]
        ];
        thiefs.forEach(([name, upt]) => {
            $datum[name].forEach(thief => {
                let person = indexes[thief.email];
                if (!person) return;

                if (thief.list && thief.list.length) {
                    person[name] = thief.list;
                    person.thief = true;
                }

                if (upt && 'boolean' !== typeof person.vote) {
                    person.vote = false;
                    setClass(person);
                }
            });
        });

        for (let i= 0, len=data.length; i<len; i++) {
            let {vote, party, dir} = data[i];
            if (dir === 'executivos') {
                continue;
            }
            if (!parties[party]) {
                parties[party] = [0,0,0];
            }
            let _party = parties[party],
                idx = vote ? 0 : (vote === false && 2 || 1);
            _party[idx]++;
        }

        $datum._data = data.sort((a, b) => {
            let aName = diacritics.remove(a.shortName),
                bName = diacritics.remove(b.shortName);
            if (aName > bName) {
                return 1;
            } else if (aName < bName) {
                return -1;
            } else {
                return 0;
            }
        });
        $datum._parties = parties;
    }
});
