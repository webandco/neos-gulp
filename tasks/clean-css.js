'use strict';

const gulp = require('gulp');
const log = require('fancy-log');
const clean = require('gulp-clean');

module.exports = function (opts) {
    if (!(opts.config.paths && opts.config.paths.dist && opts.config.paths.dist.styles)) {
        return 'no-task';
    }

    gulp.task('clean-css' + opts.config.taskPostfix, function () {
        log('Clean-CSS:' + opts.config.projectName);

        const toClean = (opts.config.paths.dist.styles.endsWith('/') ? opts.config.paths.dist.styles : opts.config.paths.dist.styles + '/');

        return gulp.src([toClean + '**/*.css.map', toClean + '**/*.css'])
            .pipe(clean({force: true}));
    });
};
