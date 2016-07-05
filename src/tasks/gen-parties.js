'use strict';
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

const $path = require('path');

const pathsFactory = require('./utils/paths');
const tplDefaultsFactory = require('./utils/template-defaults');
const optFactory = require('./utils/options-factory');

gulp.task('gen:parties', ['load:data'], () => {
    let promises = [];
    for (let d = 0; d < $data.length; d++) {
        let $datum = $data[d],
            _parties = $datum._parties;

        let $paths = pathsFactory($datum),
            tplDefaults = tplDefaultsFactory($datum),
            options = optFactory($datum);

        let template = {
                favor: [],
                undecided: [],
                against: []
            },
            keys = Object.keys(_parties);
        tplDefaults(template);

        for (let i = 0, len = keys.length; i < len; i++) {
            let party = keys[i],
                total = _parties[party],
                fullName = party,
                data = {
                    party,
                    fullName,
                    totalFavor: total[0],
                    totalAgainst: total[2],
                    totalUnd: total[1]
                };
            if (total[0] > total[1] && total[0] > total[2]) {
                template.favor.push(data);
            } else if (total[2] > total[0] && total[2] > total[1]) {
                template.against.push(data);
            } else {
                template.undecided.push(data);
            }
        }

        let prom = gulp.src($path.join($paths.template, 'parties.html'))
            .pipe(plugins.compileHandlebars(template, options))
            .pipe(plugins.rename(`index.html`))
            .pipe(plugins.htmlmin({
                collapseWhitespace: true,
                removeComments: true,
                removeScriptTypeAttributes: true
            }))
            .pipe(gulp.dest(`${$paths.www}/partidos`));

        promises.push(prom);
    }
    return Promise.all(promises);
});
