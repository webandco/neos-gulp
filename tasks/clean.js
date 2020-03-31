'use strict';

const gulp = require('gulp');

module.exports = function (opts) {

    gulp.task('clean' + opts.config.taskPostfix, ['clean-js' + opts.config.taskPostfix, 'clean-css' + opts.config.taskPostfix]);
};
