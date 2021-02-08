'use strict';

const gulp = require('gulp');
const sourceMaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const path = require('path');
const modifyFile = require('gulp-modify-file');
const sass = require('gulp-sass');
const gcmq = require('gulp-group-css-media-queries');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const stripCssComments = require('gulp-strip-css-comments');
const { addToTaskGroups, scssFileImporterFactory } = require('../functions');

module.exports = function (opts) {
    if (!(opts.config.project && opts.config.project.styles && opts.config.project.styles.library && opts.config.project.styles.library.sources)) {
        return 'no-task';
    }

    addToTaskGroups(opts.groupedTasks, 'dist-css-library', opts.config.taskPostfix);

    const includePaths = [opts.config.projectRoot];
    if (opts.config.project.styles.library.includePaths) {
        includePaths.push(...opts.config.project.styles.library.includePaths);
    }

    gulp.task('dist-css-library' + opts.config.taskPostfix, function () {

        let dependencies;
        if (opts.config.project.styles.library.dependencies) {
            dependencies = opts.config.project.styles.library.dependencies.reduce((acc, cur) => {
                return acc + '@import "' + cur + '";\n';
            }, '');
        }

        return gulp.src(opts.config.project.styles.library.sources)
            .pipe(gulpif(opts.config.project.styles.options.sourceMaps, sourceMaps.init()))
            .pipe(modifyFile((content, path, file) => {
                return dependencies ? dependencies + content : content;
            }))
            .pipe(sass({
                includePaths: includePaths,
                importer: scssFileImporterFactory(opts.config)
            }).on('error', sass.logError))
            .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
            .pipe(gcmq())
            .pipe(cleanCSS({
                advanced: false,
                aggressiveMerging: false,
                // format: 'beautify',
                keepSpecialComments: false,
                processImportFrom: ['!fonts.googleapis.com'], // a list of @import rules, can be ['all'] (default), ['local'], ['remote'], or a blacklisted path e.g. ['!fonts.googleapis.com']
                // target: 'Styles/img',
                // rebase: true,
                // debug: true,
                // level: 2 // mp: check if it works - removes duplicates
            }, function (details) {
                // console.log('CSS minified efficiency ' + (Math.round(details.stats.efficiency * 10000) / 100) + '%');
                // console.log(details.name + ': ' + details.stats.originalSize + 'kb source');
                // console.log(details.name + ': ' + details.stats.minifiedSize + 'kb minified');
            }))
            .pipe(stripCssComments(opts.config.project.styles.options.stripCssComments))
            .pipe(gulpif(opts.config.project.styles.options.sourceMaps, sourceMaps.write('./')))
            .pipe(gulp.dest(path.join(opts.config.paths.dist.styles, 'Library')))
    });
};
