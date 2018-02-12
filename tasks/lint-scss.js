'use strict';

var maxBufferSize = 1024 * 1000;

module.exports = function (opts) {
    if (!(opts.config.project.lint && opts.config.project.lint.scss)) {
        gulpUtil.log(gulpUtil.colors.red('No js files configured for lint - lint-scss'));
        return false;
    }
    addToTaskGroups(opts.groupedTasks, 'lint-scss', opts.config.taskPostfix);

    gulp.task('lint-scss' + opts.config.taskPostfix, function () {
        return gulp.src(opts.config.project.lint.scss)
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
