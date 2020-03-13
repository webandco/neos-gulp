'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');

module.exports = function (opts) {
    if (!(opts.config.project.scripts && opts.config.project.scripts.lint)) {
        return;
    }

    //addToTaskGroups(opts.groupedTasks, 'hint-js', opts.config.taskPostfix);

    gulp.task('lint-js' + opts.config.taskPostfix, function () {
        return gulp.src(opts.config.project.scripts.lint)
            .pipe(eslint({
                configFile: './eslint.json'
            }))
            .pipe(eslint.format())
    });
};
