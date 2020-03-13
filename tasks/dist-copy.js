'use strict';

const gulp = require('gulp');
const log = require('fancy-log');
const colors = require('ansi-colors');

module.exports = function (opts) {
    if (!opts.config.project.copyFiles) {
        return;
    }

    // addToTaskGroups(opts.groupedTasks, 'dist-copy', opts.config.taskPostfix);

    gulp.task('dist-copy' + opts.config.taskPostfix, function () {
        log(opts.config.projectName, ':');
        for (const entry of opts.config.project.copyFiles) {
            log('  ', entry.source, colors.green('->'), entry.dest);
            gulp.src(entry.source)
                .pipe(gulp.dest(entry.dest));
        }
    });
};
