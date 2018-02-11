'use strict';

module.exports = function (opts) {
    taskGroups(opts.groupedTasks, 'dist-js', opts.config.taskPostfix);

    opts.gulp.task('dist-js' + opts.config.taskPostfix, function () {
        // Javascript
        // console.log('Javascript files');
        // console.log(opts.config.project.scriptFiles);
        return opts.gulp.src(opts.config.project.scriptFiles)
            .pipe(sourceMaps.init())
            .pipe(concat('webandco.js'))
           .pipe(uglify(
               // {compress: {negate_iife: false}}
           ).on('error', function () {
               gulpUtil.log(gulpUtil.colors.red("Error    'dist-js' -> see lint-js"));
           }))
            .pipe(rename('webandco.min.js'))
            .pipe(sourceMaps.write('./'))
            .pipe(opts.gulp.dest(opts.config.paths.dist.scripts));
    });
};
