'use strict';
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

const pathsFactory = require('./utils/paths');

gulp.task('copy:js', () => {
    let promises = [];
    for (let d = 0; d < $data.length; d++) {
        let $datum = $data[d];

        let $paths = pathsFactory($datum);
        let prom = gulp.src('src/js/**/*')
            .pipe(plugins.uglify())
            .pipe(plugins.rename({
                suffix: `-${$paths.pack.version}.min`
            }))
            .pipe(gulp.dest(`${$paths.www}/js`));
        promises.push(prom);
    }
    return Promise.all(promises);
});
