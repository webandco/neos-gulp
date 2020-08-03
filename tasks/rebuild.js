'use strict';

const gulp = require('gulp');
const { addToTaskGroups } = require('../functions');

module.exports = function (opts) {

    addToTaskGroups(opts.groupedTasks, 'rebuild', opts.config.taskPostfix);

    gulp.task('rebuild' + opts.config.taskPostfix, gulp.series(['clean' + opts.config.taskPostfix, 'dist' + opts.config.taskPostfix]));
};
