'use strict';

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
