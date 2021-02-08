'use strict';

const gulp = require('gulp');
const { addToTaskGroups, rimraf } = require('../functions');


module.exports = function (opts) {

    const cleanTasks = [];
    if (gulp.task('clean-js' + opts.config.taskPostfix)) {
        cleanTasks.push('clean-js' + opts.config.taskPostfix);
    }
    if (gulp.task('clean-css' + opts.config.taskPostfix)) {
        cleanTasks.push('clean-css' + opts.config.taskPostfix);
    }
    if (cleanTasks.length === 0) {
        return 'no-task';
    }

    addToTaskGroups(opts.groupedTasks, 'clean', opts.config.taskPostfix);

    gulp.task('clean' + opts.config.taskPostfix, gulp.series(gulp.parallel(cleanTasks), function (cb) {
        if (opts.config.paths && opts.config.paths.dist && opts.config.paths.dist.styles) {
            rimraf(opts.config.paths.dist.styles);
        }
        if (opts.config.paths && opts.config.paths.dist && opts.config.paths.dist.scripts) {
            rimraf(opts.config.paths.dist.scripts);
        }
        cb();
    }));
};
