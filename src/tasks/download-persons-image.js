'use strict';
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
var mkdirp = require('mkdirp');

const $path = require('path');
const $fs = require('fs');

const $download = require('./utils/download');

let dirs = {};
const getDir = (tpl) => {
    if (!dirs[tpl.dir]) {
        let dir = $path.join(process.cwd(), 'src', 'images', tpl.dir);
        mkdirp.sync(dir);
        dirs[tpl.dir] = dir
    }
    return dirs[tpl.dir];
};

gulp.task('download:person-img', ['load:data'], () => {
    let promises = [];
    for (let d = 0; d < $data.length; d++) {
        let $datum = $data[d],
            _data = $datum._data;


        let promise = Promise.resolve();
        for (let i = 0; i < _data.length; i++) {
            let template = _data[i],
                baseDir = getDir(template),
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

