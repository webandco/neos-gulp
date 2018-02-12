'use strict';

module.exports = function (opts) {
    if (!(opts.config.project.lint && opts.config.project.hint.js)) {
        // gulpUtil.log(gulpUtil.colors.red('No js files configured for lint - hint-js'));
        return false;
    }

    addToTaskGroups(opts.groupedTasks, 'hint-js', opts.config.taskPostfix);

    gulp.task('hint-js' + opts.config.taskPostfix, function () {
        return gulp.src(opts.config.project.hint.js)
            .pipe(jshint())
            .pipe(jshint.reporter(jsHintStylish))
            .pipe(jshint.reporter('fail'));
    });
};
