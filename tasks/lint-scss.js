'use strict';

const log = require('fancy-log');
const colors = require('ansi-colors');
const lint = require('gulp-scss-lint');
const lintStylish = require('gulp-scss-lint-stylish');
const cache = require('gulp-cached');
const gulp = require('gulp');

const maxBufferSize = 1024 * 1000;

module.exports = function ({config}) {
    if (!(config.project.styles.lint)) {
        return 'no-task';
    }
    //addToTaskGroups(opts.groupedTasks, 'lint-scss', opts.config.taskPostfix);

    gulp.task('lint-scss' + config.taskPostfix, function() {
        return gulp.src(config.project.styles.lint)
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
