'use strict';

var taskGroups = require('./task-groups');

module.exports = function (opts) {
    taskGroups(opts.groupedTasks, 'watch', opts.config.taskPostfix);

    opts.gulp.task('watch' + opts.config.taskPostfix, function () {
        opts.gulp.watch([opts.config.paths.watch.sass], ['dist-css' + opts.config.taskPostfix]);

        // opts.gulp.watch([opts.config.project.scriptFiles], ['dist-js' + opts.config.taskPostfix]);
        // opts.gulp.watch([opts.config.project.lint.js], ['lint-js' + opts.config.taskPostfix]);
        opts.gulp.watch([opts.config.project.lint.scss], ['lint-scss' + opts.config.taskPostfix]);
        // opts.gulp.watch([opts.config.favicon.dataFile, opts.config.favicon.masterPicture], ['favicon-create-template' + opts.config.taskPostfix]);
    });
};
