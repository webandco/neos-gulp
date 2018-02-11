'use strict';

module.exports = function (opts) {
    taskGroups(opts.groupedTasks, 'lint-js', opts.config.taskPostfix);

    opts.gulp.task('lint-js' + opts.config.taskPostfix, function () {
        return opts.gulp.src(opts.config.project.lint.js)
            .pipe(jshint())
            .pipe(jshint.reporter(jsHintStylish))
            .pipe(jshint.reporter('fail'));
    });
};
