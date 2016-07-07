'use strict';
const gulp = require('gulp');
const _ = require('lodash');
const xlsx = require('node-xlsx');
const diacritics = require('diacritics');

global.$data = require('../../data');

gulp.task('load:data', () => {
    for (let d = 0; d < $data.length; d++) {
        let $datum = $data[d];

        if (Array.isArray($datum.desc)) {
            $datum.desc = $datum.desc.join(' ');
        }
        let indexes = {},
            parties = {},
            data = require('../../data/national-congress-data').map(datum => {
                let name = datum.shortName,
                    email = datum.email,
                    fileName = diacritics.remove(name).trim().replace(/ /g, '-').toLocaleLowerCase(),
                    vote = datum.opinion && datum.opinion.trim().toLowerCase(),
                    party = datum.party.trim().toUpperCase();
                if (!parties[party]) {
                    parties[party] = [0, 0, 0];
                }
                if (!vote || ~vote.indexOf('indec')) {
                    vote = undefined;
                    parties[party][1]++;
                } else if (~vote.indexOf('favor')) {
                    vote = true;
                    parties[party][0]++;
                } else if (~vote.indexOf('contr')) {
                    vote = false;
                    parties[party][2]++;
                }
                let person = {
                    shortName: name,
                    fullName: datum.fullName,
                    fileName,
                    party,
                    phone: datum.phone,
                    cabinet: datum.cabinet,
                    email,
                    site: datum.links.details,
                    gender: datum.gender || 'M',
                    photo: `${fileName}.jpg`,
                    photoUrl: datum.image,
                    state: datum.state,
                    vote,
                    class: vote ? 'favor' : vote === false ? 'contra' : 'indeciso',
                    panelColor: 'panel-' + (vote ? 'primary' : vote === false ? 'red' : 'yellow')
                };
                indexes[email] = person;
                return person;
            });


        let obj = xlsx.parse($datum.file);
        obj[0].data.filter((o, i) => i !== 0 && o[0]).map(o => {
            let email = o[0],
                person = indexes[email];
            if (!person || obj) {
                return;
            }

            let name = o[3],
                vote = o[1] && o[1].trim().toLowerCase();
            if (!vote || ~vote.indexOf('indec')) {
                vote = undefined;
            } else if (~vote.indexOf('favor')) {
                vote = true;
            } else if (~vote.indexOf('contr')) {
                vote = false;
            }
            let data = {
                fullName: name,
                phone: o[5],
                facebook: o[6] ? o[6].trim() : '',
                twitter: o[7] ? o[7].trim() : '',
                cabinet: o[8],
                osite: o[9] ? o[9].trim() : '',
                photoUrl: o[10],
                gender: o[11],
                vote,
                class: vote ? 'favor' : vote === false ? 'contra' : 'indeciso',
                panelColor: 'panel-' + (vote ? 'primary' : vote === false ? 'red' : 'yellow')
            };
            _.extend(person, data);
        });

        $datum._data = data;
        $datum._parties = parties;
    }
});
