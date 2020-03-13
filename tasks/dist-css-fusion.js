'use strict';

const gulp = require('gulp');
const sourceMaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const gcmq = require('gulp-group-css-media-queries');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const stripCssComments = require('gulp-strip-css-comments');
const replace = require('gulp-replace');
const modifyFile = require('gulp-modify-file');

module.exports = function (opts) {
    if (!(opts.config.project.styles && opts.config.project.styles.fusion)) {
        // gulpUtil.log(gulpUtil.colors.red('No css files configured - dist-css));
        return;
    }

    //addToTaskGroups(opts.groupedTasks, 'dist-css', opts.config.taskPostfix);

    gulp.task('dist-css-fusion' + opts.config.taskPostfix, function () {
        // CSS
        // console.log('CCS files');
        // console.log(opts.config.project.cssFiles);

// console.log(opts.config.projectName);

        const dependencies = opts.config.project.styles.fusion.dependencies.reduce((acc, cur) => {
            return acc + '@import "' + cur + '";\n';
        }, '');

        return gulp.src(opts.config.project.styles.fusion.sources)
            .pipe(sourceMaps.init())
            .pipe(modifyFile((content, path, file) => {
                return dependencies + content;
            }))
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
            .pipe(stripCssComments(opts.config.project.styles.stripCssComments))
            // .pipe(gulp.dest(paths.dist.styles)) // needed here for header()
            // .pipe(header(project.banner))
            // replace in the correct sass path with dist relative path
            .pipe(replace("../../../Images", '../Images'))
            .pipe(replace("../../Images", '../Images'))
            // .pipe(replace("../fonts", 'Styles/fonts'))
            .pipe(sourceMaps.write('./'))
            .pipe(gulp.dest(opts.config.paths.dist.styles))
            .pipe(opts.browserSync.stream({match: '**/*.css'}));
    });
};