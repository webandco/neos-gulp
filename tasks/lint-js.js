'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const { addToTaskGroups } = require('../functions');

module.exports = function (opts) {
    if (!(opts.config.project && opts.config.project.scripts && opts.config.project.scripts.lint)) {
        return 'no-task';
    }

    addToTaskGroups(opts.groupedTasks, 'lint-js', opts.config.taskPostfix);

    gulp.task('lint-js' + opts.config.taskPostfix, function () {
        return gulp.src(opts.config.project.scripts.lint.sources)
            .pipe(eslint({
                configFile: './eslint.json',
                globals: opts.config.project.scripts.lint.globalVars
            }))
            .pipe(eslint.format())
    });
};
