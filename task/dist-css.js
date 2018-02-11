'use strict';

module.exports = function (opts) {
    taskGroups(opts.groupedTasks, 'dist-css', opts.config.taskPostfix);

    opts.gulp.task('dist-css' + opts.config.taskPostfix, ['sass' + opts.config.taskPostfix], function () {
        // CSS
        // console.log('CCS files');
        // console.log(opts.config.project.cssFiles);

        return opts.gulp.src(opts.config.project.cssFiles)
            .pipe(concat('webandco.css'))
            .pipe(sourceMaps.init())
            .pipe(opts.gulp.dest(opts.config.paths.build.styles))
            // group media queries
            .pipe(gcmq())
            // clean
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
            .pipe(stripCssComments(opts.config.project.css.stripCssComments))
            .pipe(rename(function (path) {
                path.basename = path.basename + '.min';
            }))
            .pipe(sourceMaps.write('./'))
            // .pipe(opts.gulp.dest(paths.dist.styles)) // needed here for header()
            // .pipe(header(project.banner))
            // replace in the correct sass path with dist relative path
            .pipe(replace("../../../Images", '../Images'))
            .pipe(replace("../../Images", '../Images'))
            // .pipe(replace("../fonts", 'Styles/fonts'))
            .pipe(opts.gulp.dest(opts.config.paths.dist.styles))
            .pipe(opts.browserSync.stream({match: '**/*.css'}));
    });
};
