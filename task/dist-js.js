'use strict';

module.exports = function (opts) {
    if (!opts.config.project.scriptFiles) {
        // gulpUtil.log(gulpUtil.colors.red('No css files configured - dist-js'));
        return false;
    }

    addToTaskGroups(opts.groupedTasks, 'dist-js', opts.config.taskPostfix);

    gulp.task('dist-js' + opts.config.taskPostfix, function () {
        // Javascript
        // console.log('Javascript files');
        // console.log(opts.config.project.scriptFiles);
        return gulp.src(opts.config.project.scriptFiles)
            .pipe(sourceMaps.init())
            .pipe(concat('webandco.js'))
           .pipe(uglify(
               // {compress: {negate_iife: false}}
           ).on('error', function () {
               gulpUtil.log(gulpUtil.colors.red("Error    'dist-js' -> see hint-js"));
           }))
            .pipe(rename('webandco.min.js'))
            .pipe(sourceMaps.write('./'))
            .pipe(gulp.dest(opts.config.paths.dist.scripts));
    });
};
