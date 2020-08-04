'use strict';

const gulp = require('gulp');
const { addToTaskGroups, rimraf } = require('../functions');


module.exports = function (opts) {

    addToTaskGroups(opts.groupedTasks, 'clean', opts.config.taskPostfix);

    gulp.task('clean' + opts.config.taskPostfix, gulp.series(gulp.parallel(['clean-js' + opts.config.taskPostfix, 'clean-css' + opts.config.taskPostfix]), function (cb) {
        rimraf(opts.config.paths.dist.styles);
        rimraf(opts.config.paths.dist.scripts);
        cb();
    }));
};
