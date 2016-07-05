'use strict';
const gulp = require('gulp');
const $path = require('path');
const xlsx = require('node-xlsx');
const diacritics = require('diacritics');

global.$data = require('../../data');

gulp.task('load:data', () => {
    for (let d = 0; d < $data.length; d++) {
        let $datum = $data[d];

        if (!$datum.desc) {
            $datum.desc = [
                `Ajude o Movimento Brasil Livre - ${$datum.city} (MBL-${$datum.state})`,
                'a pressionar os deputados para votarem a favor do projeto de lei que regulamenta ',
                'os aplicativos de compartilhamento de veículos, tais como o Uber, BlaBlaCar e Cabify.',
                'Pela mobilidade urbana e pelo direito de escolha!'
            ];
        }
        if (Array.isArray($datum.desc)) {
            $datum.desc = $datum.desc.join(' ');
        }
        let indexes = {},
            parties = {},
            data = require('../../data/nationa-congress-data').map(datum => {
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
                    fullName: name,
                    fileName,
                    party,
                    phone: datum.phone,
                    email,
                    site: datum.links.details,
                    gender: datum.gender || 'M',
                    photo: `${fileName}.jpg`,
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
            let email = o[3],
                person = indexes[email];
            if (!person) {
                return;
            }

            let name = o[0],
                fileName = diacritics.remove(name).trim().replace(/ /g, '-').toLocaleLowerCase(),
                vote = o[10] && o[10].trim().toLowerCase(),
                party = o[1].trim().toUpperCase();
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
            return {
                fullName: name,
                fileName,
                party,
                phone: o[2],
                email: o[3],
                facebook: o[4] ? o[4].trim() : '',
                twitter: o[5] ? o[5].trim() : '',
                cabinet: o[6],
                osite: o[7] ? o[7].trim() : '',
                photo: `${fileName}.jpg`,
                photoUrl: o[8],
                gender: o[9],
                vote,
                class: vote ? 'favor' : vote === false ? 'contra' : 'indeciso',
                panelColor: 'panel-' + (vote ? 'primary' : vote === false ? 'red' : 'yellow')
            }
        });

        $datum._data = data;
        $datum._parties = parties;
    }
});
