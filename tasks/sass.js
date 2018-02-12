'use strict';

module.exports = function (opts) {
    // addToTaskGroups(opts.groupedTasks, task, opts.config.taskPostfix);

    gulp.task('sass' + opts.config.taskPostfix, /* ['clean-sass' + opts.config.taskPostfix], */ function () {
        return gulp.src(opts.config.paths.source.sass)
            .pipe(plumber(handleErrors))
            .pipe(sass().on('error', sass.logError))
            .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
            // .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(opts.config.paths.build.styles));
        // stream is done in dist-css
        // .pipe(browserSync.stream());
    });
};
