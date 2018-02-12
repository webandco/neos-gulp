'use strict';

module.exports = function (opts) {
    if (!opts.config.project.copyFiles) {
        // gulpUtil.log(gulpUtil.colors.red('No file to copy configured - dist-copy'));
        return false;
    }

    addToTaskGroups(opts.groupedTasks, 'dist-copy', opts.config.taskPostfix);

    gulp.task('dist-copy' + opts.config.taskPostfix, function () {
        gulpUtil.log(opts.config.projectName, ':');
        for (var key in opts.config.project.copyFiles) {
            gulpUtil.log('  ', opts.config.project.copyFiles[key].source, gulpUtil.colors.green('->'), opts.config.project.copyFiles[key].dest);
            gulp.src(opts.config.project.copyFiles[key].source)
                .pipe(gulp.dest(opts.config.project.copyFiles[key].dest));
        }
    });
};
