'use strict';

var autoprefixer = require('gulp-autoprefixer'),
    // concat = require('gulp-concat'),
    // gulp = require('gulp'),
    // path = require('path'),
    plumber = require('gulp-plumber'),
    // rename = require('gulp-rename'),
    sass = require('gulp-sass')
    // sourcemaps = require('gulp-sourcemaps'),
    // task = path.basename(__filename, '.js'),
    // taskGroups = require('./task-groups')
    ;

module.exports = function (opts) {
    // taskGroups(opts.groupedTasks, task, opts.config.taskPostfix);

    opts.gulp.task('sass' + opts.config.taskPostfix, /* ['clean-sass' + opts.config.taskPostfix], */ function () {
        return opts.gulp.src(opts.config.paths.source.sass)
            .pipe(plumber())
            .pipe(sass().on('error', sass.logError))
            .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
            // .pipe(rename({suffix: '.min'}))
            .pipe(opts.gulp.dest(opts.config.paths.build.styles));
        // stream is done in dist-css
        // .pipe(browserSync.stream());
    });
};
