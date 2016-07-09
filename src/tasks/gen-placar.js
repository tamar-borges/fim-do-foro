'use strict';
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

const $path = require('path');

const pathsFactory = require('./utils/paths');
const tplDefaultsFactory = require('./utils/template-defaults');
const optFactory = require('./utils/options-factory');

gulp.task('gen:placar', ['load:data'], () => {
    let promises = [];
    for (let d = 0; d < $data.length; d++) {
        let $datum = $data[d],
            _data = $datum._data;

        let $paths = pathsFactory($datum),
            options = optFactory($datum),
            tplDefaults = tplDefaultsFactory($datum);

        let template = {
            senate: {favor: [], undecided: [], against: []},
            congress: {favor: [], undecided: [], against: []},
            presidentClass: 'purple',
            president: {shortName: 'Michel Temer', party: 'PMDB', dir: 'executivos', fileName: 'michel-temer'}
        };
        let emails = {
            favor: [],
            undecided: [],
            against: []
        };
        tplDefaults(template);

        for (let i= 0, len=_data.length; i<len; i++) {
            let person = _data[i],
                tplRef = person.dir === 'deputados' ? template.congress : template.senate,
                vote = person.vote;
            if (vote) {
                tplRef.favor.push(person);
                emails.favor.push(person.email);
            } else if (vote === false) {
                tplRef.against.push(person);
                emails.against.push(person.email);
            } else {
                tplRef.undecided.push(person);
                emails.undecided.push(person.email);
            }
        }

        // emails
        template.favorEmails = emails.favor.join(',');
        template.undecidedEmails = emails.undecided.join(',');
        template.againstEmails = emails.against.join(',');

        // opinions
        template.senateFavor = template.senate.favor.length > (template.senate.against.length + template.senate.undecided.length);
        template.congressFavor = template.senate.favor.length > (template.senate.against.length + template.senate.undecided.length);

        if (template.senateFavor && template.congressFavor) {
            template.parlamentClass = 'green';
        } else if (!template.senateFavor && !template.congressFavor){
            template.parlamentClass = 'gray';
        } else {
            template.parlamentClass = 'purple';
        }

        let paths = ['', 'deputados', 'senadores'];
        for (let i = 0, len = paths.length; i < len; i++) {
            let path = paths[i];
            let templ = JSON.parse(JSON.stringify(template));
            if (path !== '') {
                templ.url += `/${path}`;
            }
            let prom = gulp.src($path.join($paths.template, `placar.html`))
                .pipe(plugins.compileHandlebars(templ, options))
                .pipe(plugins.rename(`index.html`))
                .pipe(plugins.htmlmin({
                    collapseWhitespace: true,
                    removeComments: true,
                    removeScriptTypeAttributes: true
                }))
                .pipe(gulp.dest(`${$paths.www}/${path}`));
            promises.push(prom);
        }
    }
    return Promise.all(promises);
});
