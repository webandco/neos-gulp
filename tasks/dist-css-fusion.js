'use strict';

const gulp = require('gulp');
const sourceMaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const sass = require('gulp-sass');
const gcmq = require('gulp-group-css-media-queries');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const stripCssComments = require('gulp-strip-css-comments');
const modifyFile = require('gulp-modify-file');
const path = require('path');
const { addToTaskGroups, touchFusionFile, scssFileImporterFactory, transformResourceUrls } = require('../functions');

module.exports = function (opts) {
    if (!(opts.config.project.styles && opts.config.project.styles.fusion && opts.config.project.styles.fusion.sources)) {
        return 'no-task';
    }

    addToTaskGroups(opts.groupedTasks, 'dist-css-fusion', opts.config.taskPostfix);

    const includePaths = [opts.config.projectRoot];
    if (opts.config.project.styles.fusion.includePaths) {
        includePaths.push(...opts.config.project.styles.fusion.includePaths);
    }

    gulp.task('dist-css-fusion' + opts.config.taskPostfix, function () {

        let dependencies;
        if (opts.config.project.styles.fusion.dependencies) {
            dependencies = opts.config.project.styles.fusion.dependencies.reduce((acc, cur) => {
                return acc + '@import "' + cur + '";\n';
            }, '');
        }

        return gulp.src(opts.config.project.styles.fusion.sources)
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
                level: 2,
                inline: false
            }))
            .pipe(stripCssComments(opts.config.project.styles.options.stripCssComments))
            .pipe(modifyFile((content, path, file) => {
                return transformResourceUrls(content);
            }))
            .pipe(touchFusionFile())
            .pipe(gulpif(opts.config.project.styles.options.sourceMaps, sourceMaps.write('./')))
            .pipe(gulp.dest(path.join(opts.config.paths.dist.styles, 'Fusion')));
    });
};
