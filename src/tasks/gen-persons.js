'use strict';
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

const $path = require('path');

const pathsFactory = require('./utils/paths');
const tplDefaultsFactory = require('./utils/template-defaults');
const optFactory = require('./utils/options-factory');

gulp.task('gen:persons', ['load:data', 'download:person-img'], () => {
    let promises = [];
    for (let d = 0; d < $data.length; d++) {
        let $datum = $data[d],
            _data = $datum._data;

        let $paths = pathsFactory($datum),
            tplDefaults = tplDefaultsFactory($datum),
            options = optFactory($datum);

        for (let i = 0; i < _data.length; i++) {
            let template = _data[i];
            tplDefaults(template);
            let prom = gulp.src($path.join($paths.template, 'person.html'))
                .pipe(plugins.compileHandlebars(template, options))
                .pipe(plugins.rename(`${template.fileName}.html`))
                .pipe(plugins.htmlmin({
                    collapseWhitespace: true,
                    removeComments: true,
                    removeScriptTypeAttributes: true
                }))
                .pipe(gulp.dest(`${$paths.www}/${template.dir}`));
            promises.push(prom);
        }
    }
    return Promise.all(promises);
});

