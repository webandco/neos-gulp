'use strict';

const gulp = require('gulp');
const sourceMaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const rename = require("gulp-rename");


module.exports = function (opts) {
    if (!(opts.config.project.scripts && opts.config.project.scripts.serviceWorker && opts.config.project.scripts.serviceWorker.source)) {
        return 'no-task';
    }

    gulp.task('dist-serviceworker' + opts.config.taskPostfix, function () {

        return gulp.src(opts.config.project.scripts.serviceWorker.source)
            .pipe(gulpif(opts.config.project.scripts.options.sourceMaps, sourceMaps.init()))
            .pipe(rename(opts.config.project.scripts.serviceWorker.distName ? opts.config.project.scripts.serviceWorker.distName : 'service-worker.js'))
            .pipe(babel({
                presets: ['@babel/env']
            }))
            .pipe(gulpif(opts.config.project.scripts.options.minify, terser()))
            .pipe(gulpif(opts.config.project.scripts.options.sourceMaps, sourceMaps.write('./')))
            .pipe(gulp.dest(opts.config.project.scripts.serviceWorker.distPath));
    });
}
