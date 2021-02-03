'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const sourceMaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const sass = require('gulp-sass');
const gcmq = require('gulp-group-css-media-queries');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const stripCssComments = require('gulp-strip-css-comments');
const fs = require('fs');
const path = require('path');
const modifyFile = require('gulp-modify-file');
const { addToTaskGroups, scssFileImporterFactory, transformResourceUrls } = require('../functions');

module.exports = function (opts) {
    if (!(opts.config.project.styles && opts.config.project.styles.bundled && opts.config.project.styles.bundled.sources)) {
        return 'no-task';
    }

    addToTaskGroups(opts.groupedTasks, 'dist-css-bundle', opts.config.taskPostfix);

    const includePaths = opts.config.project.styles.bundled.sources
        .filter(src => fs.existsSync(src))
        .map(src => path.dirname(src));

    if (opts.config.project.styles.bundled.includePaths) {
        includePaths.push(...opts.config.project.styles.bundled.includePaths);
    }

    gulp.task('dist-css-bundle' + opts.config.taskPostfix, function () {

        return gulp.src(opts.config.project.styles.bundled.sources, {allowEmpty: true})
            .pipe(gulpif(opts.config.project.styles.options.sourceMaps, sourceMaps.init()))
            .pipe(concat(opts.config.project.styles.bundled.filename ? opts.config.project.styles.bundled.filename : 'style.css'))
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
            .pipe(gulpif(opts.config.project.styles.options.sourceMaps, sourceMaps.write('./')))
            .pipe(gulp.dest(opts.config.paths.dist.styles))
            .pipe(opts.browserSync.stream({match: '**/*.css'}));
    });
};
