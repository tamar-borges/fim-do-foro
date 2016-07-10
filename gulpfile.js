'use strict';
var gulp = require('gulp');

// load tasks
require('require-dir')('./src/tasks');

let generators = ['gen:persons', 'gen:placar', 'gen:parties', 'gen:helpers'],
    defaults = ['copy:js', 'copy:css', 'copy:images'].concat(generators);

gulp.task('dev:watch', () => {
    gulp.watch('src/partials**/*.html', generators).on('error', e => console.error(e));
    gulp.watch('src/template/placar*.html', ['gen:placar']).on('error', e => console.error(e));
    gulp.watch('src/template/person.html', ['gen:persons']).on('error', e => console.error(e));
    gulp.watch('src/template/parties.html', ['gen:parties']).on('error', e => console.error(e));
    gulp.watch('src/template/help.html', ['gen:helpers']).on('error', e => console.error(e));
    gulp.watch('src/template/how-work.html', ['gen:helpers']).on('error', e => console.error(e));

    gulp.watch('src/js/**/*', ['copy:js']).on('error', e => console.error(e));
    gulp.watch('src/css/**/*', ['copy:css']).on('error', e => console.error(e));
    gulp.watch('src/images/**/*', ['copy:images']).on('error', e => console.error(e));
});


gulp.task('default', defaults);

gulp.task('dev', defaults.concat('dev:watch'));