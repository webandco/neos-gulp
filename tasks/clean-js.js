'use strict';

const gulp = require('gulp');
const log = require('fancy-log');
const clean = require('gulp-clean');

module.exports = function (opts) {

    gulp.task('clean-js' + opts.config.taskPostfix, function () {
        log('Clean-JS:' + opts.config.projectName);

        const toClean = (opts.config.paths.dist.scripts.endsWith('/') ? opts.config.paths.dist.scripts : opts.config.paths.dist.scripts + '/');

        return gulp.src([toClean + '**/*.js.map', toClean + '**/*.js'])
            .pipe(clean({read: false, force: true}));
    });
};
