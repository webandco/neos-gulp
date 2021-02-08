'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const sourceMaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const path = require('path');
const { addToTaskGroups } = require('../functions');

module.exports = function (opts) {
    if (!(opts.config.project && opts.config.project.scripts && opts.config.project.scripts.library && opts.config.project.scripts.library.sources)) {
        return 'no-task';
    }

    addToTaskGroups(opts.groupedTasks, 'dist-js-library', opts.config.taskPostfix);

    gulp.task('dist-js-library' + opts.config.taskPostfix, function () {

        return gulp.src(opts.config.project.scripts.library.sources)
            .pipe(gulpif(opts.config.project.scripts.options.sourceMaps, sourceMaps.init()))
            .pipe(babel({
                presets: ['@babel/env'],
            }))
            .on('error', function(err) {
                log.error(err.message);
                this.emit('end');
            })
            .pipe(gulpif(opts.config.project.scripts.options.minify, terser()))
            .pipe(gulpif(opts.config.project.scripts.options.sourceMaps, sourceMaps.write('./')))
            .pipe(gulp.dest(path.join(opts.config.paths.dist.scripts, 'Library')))
    });
};
