'use strict';
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

const pathsFactory = require('./utils/paths');

gulp.task('copy:images', () => {
    let promises = [];
    let $paths = pathsFactory();
    let prom = gulp.src('src/images/*')
        .pipe(plugins.rename({
            suffix: `-${$paths.pack.version}`
        }))
        .pipe(gulp.dest(`${$paths.www}/images`));
    promises.push(prom);

    let promIt = gulp.src(`src/images/deputados/*`)
        .pipe(gulp.dest(`${$paths.www}/images/deputados`));
    promises.push(promIt);

    return Promise.all(promises);
});
