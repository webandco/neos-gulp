'use strict';

const lint = require('gulp-scss-lint');
const lintStylish = require('gulp-scss-lint-stylish');
const { addToTaskGroups } = require('../functions');
const cache = require('gulp-cached');
const gulp = require('gulp');

const maxBufferSize = 1024 * 1000;

module.exports = function ({config, groupedTasks}) {
    if (!(config.project.styles.lint)) {
        return 'no-task';
    }
    addToTaskGroups(groupedTasks, 'lint-scss', config.taskPostfix);

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
