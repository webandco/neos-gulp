'use strict';

module.exports = function (opts) {
    addToTaskGroups(opts.groupedTasks, 'watch', opts.config.taskPostfix);

    gulp.task('watch' + opts.config.taskPostfix, function () {
        gulp.watch([opts.config.paths.watch.sass], ['dist-css' + opts.config.taskPostfix]);

        gulp.watch([opts.config.project.scriptFiles], ['dist-js' + opts.config.taskPostfix]);
        gulp.watch([opts.config.project.hint.js], ['hint-js' + opts.config.taskPostfix]);
        gulp.watch([opts.config.project.lint.scss], ['lint-scss' + opts.config.taskPostfix]);
        gulp.watch([opts.config.favicon.dataFile, opts.config.favicon.masterPicture], ['favicon-create-template' + opts.config.taskPostfix]);
    });
};
