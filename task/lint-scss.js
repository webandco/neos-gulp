'use strict';

var maxBufferSize = 1024 * 1000;

module.exports = function (opts) {
    taskGroups(opts.groupedTasks, 'lint-scss', opts.config.taskPostfix);

    opts.gulp.task('lint-scss' + opts.config.taskPostfix, function () {
        return opts.gulp.src(opts.config.project.lint.scss)
            .pipe(cache('scssLint'))
            .pipe(lint(
                {
                    config: './lint-scss.yml',
                    customReport: lintStylish,
                    maxBuffer: maxBufferSize
                }
            ));
    });
};
