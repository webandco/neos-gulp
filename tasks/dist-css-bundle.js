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
const replace = require('gulp-replace');

module.exports = function (opts) {
    if (!(opts.config.project.styles && opts.config.project.styles.bundled)) {
        return 'no-task';
    }

    //addToTaskGroups(opts.groupedTasks, 'dist-css', opts.config.taskPostfix);

    gulp.task('dist-css-bundle' + opts.config.taskPostfix, function () {

        return gulp.src(opts.config.project.styles.bundled.sources)
            .pipe(gulpif(opts.config.project.styles.options.sourceMaps, sourceMaps.init()))
            .pipe(concat(opts.config.project.styles.bundled.filename ? opts.config.project.styles.bundled.filename : 'style.css'))
            .pipe(sass().on('error', sass.logError))
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
            // .pipe(gulp.dest(paths.dist.styles)) // needed here for header()
            // .pipe(header(project.banner))
            // replace in the correct sass path with dist relative path
            .pipe(replace("../../../Images", '../Images'))
            .pipe(replace("../../Images", '../Images'))
            // .pipe(replace("../fonts", 'Styles/fonts'))
            .pipe(sourceMaps.write('./'))
            .pipe(gulpif(opts.config.project.styles.options.sourceMaps, sourceMaps.write('./')))
            .pipe(gulp.dest(opts.config.paths.dist.styles))
            .pipe(opts.browserSync.stream({match: '**/*.css'}));
    });
};
