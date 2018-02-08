'use strict';

var cache = require('gulp-cached'),
    // gulp = require('gulp'),
    lint = require('gulp-scss-lint'),
    lintStylish = require('gulp-scss-lint-stylish'),
    maxBufferSize = 1024 * 1000,
    path = require('path'),
    task = path.basename(__filename, '.js'),
    taskGroups = require('./task-groups');

module.exports = function (opts) {
    taskGroups(opts.groupedTasks, task, opts.config.taskPostfix);

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
