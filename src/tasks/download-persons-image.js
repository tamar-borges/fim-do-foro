'use strict';
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
var mkdirp = require('mkdirp');

const $path = require('path');
const $fs = require('fs');

const $download = require('./utils/download');

gulp.task('download:person-img', ['load:data'], () => {
    let promises = [];
    for (let d = 0; d < $data.length; d++) {
        let $datum = $data[d],
            _data = $datum._data;

        let baseDir = $path.join(process.cwd(), 'src', 'images', 'deputados');
        mkdirp.sync(baseDir);
        let promise = Promise.resolve();
        for (let i = 0; i < _data.length; i++) {
            let template = _data[i],
                file = $path.join(baseDir, template.photo);

            if ($fs.existsSync(file) || !template.photoUrl) {
                continue;
            }
            promise = promise.then(() => $download(template.photoUrl, file));
        }
        promises.push(promise);
    }
    return Promise.all(promises);
});

