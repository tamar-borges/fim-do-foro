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
            favor: _data.filter(o => o.vote === true),
            undecided: _data.filter(o => o.vote === undefined),
            against: _data.filter(o => o.vote === false)
        };
        tplDefaults(template);

        template.presidentClass = 'purple';
        template.president = {shortName: 'Michel Temer', party: 'PMDB', dir: 'executivos', fileName: 'michel-temer'};

        template.favorEmails = template.favor.map(o => o.email).join(',');
        template.undecidedEmails = template.undecided.map(o => o.email).join(',');
        template.againstEmails = template.against.map(o => o.email).join(',');

        template.favorPct = Math.round((template.favor.length + 1) * 100 / _data.length);
        template.againstPct = Math.round((template.against.length + 1) * 100 / _data.length);

        let undPct = 100 - (template.againstPct + template.favorPct);
        template.undecidedPct = Math.round(undPct);

        ['favorPct', 'againstPct', 'undecidedPct'].forEach(n => _data[n] = template[n]);

        let paths = ['', 'deputados'];
        for (let i = 0, len = paths.length; i < len; i++) {
            let path = paths[i];
            let templ = JSON.parse(JSON.stringify(template));
            if (path !== '') {
                templ.url += `/${path}`;
            }
            let prom = gulp.src($path.join($paths.template, 'placar.html'))
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
