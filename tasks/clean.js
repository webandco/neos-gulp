'use strict';

const gulp = require('gulp');
const { addToTaskGroups } = require('../functions');


module.exports = function (opts) {

    addToTaskGroups(opts.groupedTasks, 'clean', opts.config.taskPostfix);

    gulp.task('clean' + opts.config.taskPostfix, ['clean-js' + opts.config.taskPostfix, 'clean-css' + opts.config.taskPostfix]);
};
