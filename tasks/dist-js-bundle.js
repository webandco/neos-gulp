'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const sourceMaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const path = require('path');
const { buildExternalHelpers } = require('@babel/core');
const modifyFile = require('gulp-modify-file');
const { addToTaskGroups } = require('../functions');

module.exports = function (opts) {
    if (!(opts.config.project.scripts && opts.config.project.scripts.bundled && opts.config.project.scripts.bundled.sources)) {
        return 'no-task';
    }

    addToTaskGroups(opts.groupedTasks, 'dist-js-bundle', opts.config.taskPostfix);

    let sources = opts.config.project.scripts.bundled.sources;
    const polyfills = [];

    if (opts.config.project.scripts.options.polyfills) {
        polyfills.push(path.join(__dirname, '..', 'node_modules', 'core-js-bundle', 'minified.js'));
        polyfills.push(path.join(__dirname, '..', 'node_modules', 'regenerator-runtime', 'runtime.js'));
        sources.unshift(...polyfills);
    }

    gulp.task('dist-js-bundle' + opts.config.taskPostfix, function () {

        return gulp.src(sources, {allowEmpty: true})
            .pipe(gulpif(opts.config.project.scripts.options.sourceMaps, sourceMaps.init()))
            .pipe(concat(opts.config.project.scripts.bundled.filename ? opts.config.project.scripts.bundled.filename : 'webandco.js'))
            .pipe(babel({
                presets: ['@babel/env'],
                plugins: opts.config.project.scripts.options.externalBabelHelpers ? ["@babel/plugin-external-helpers"] : undefined,
                overrides: [{
                    ignore: polyfills
                }]
            }))
            .on('error', function(err) {
                log.error(err.message);
                this.emit('end');
            })
            .pipe(gulpif(opts.config.project.scripts.options.externalBabelHelpers, modifyFile((content, filePath, file) => {
                return buildExternalHelpers() + content;
            })))
            .pipe(gulpif(opts.config.project.scripts.options.minify, terser()))
            .pipe(gulpif(opts.config.project.scripts.options.sourceMaps, sourceMaps.write('./')))
            .pipe(gulp.dest(opts.config.paths.dist.scripts))
            .pipe(opts.browserSync.stream({match: '**/*.js'}));
    });
};
