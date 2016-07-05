'use strict';
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

const $path = require('path');

const pathsFactory = require('./utils/paths');
const tplDefaultsFactory = require('./utils/template-defaults');
const optFactory = require('./utils/options-factory');

gulp.task('gen:helpers', () => {
    let $paths = pathsFactory(),
        options = optFactory(),
        tplDefaults = tplDefaultsFactory();

    let templateNames = [
        {tpl: 'how-work', to: 'como-funciona', dir: ''},
        {tpl: 'help', to: 'achou-erro', dir: ''}
    ];
    let promises = [];
    for (let i = 0, len = templateNames.length; i < len; i++) {
        let template = templateNames[i],
            tpl = tplDefaults();

        let prom = gulp.src($path.join($paths.template, `${template.tpl}.html`))
            .pipe(plugins.compileHandlebars(tpl, options))
            .pipe(plugins.rename(`${template.to}.html`))
            .pipe(plugins.htmlmin({
                collapseWhitespace: true,
                removeComments: true,
                removeScriptTypeAttributes: true
            }))
            .pipe(gulp.dest(`${$paths.www}/${template.dir}`));

        promises.push(prom);
    }
    return Promise.all(promises);
});