'use strict';

const gulp = require('gulp');
const { addToTaskGroups } = require('../functions');


module.exports = function (opts) {

    addToTaskGroups(opts.groupedTasks, 'dist', opts.config.taskPostfix);

    const DIST_TASKS = [
        "dist-css-fusion",
        "dist-css-bundle",
        "dist-css-library",
        "dist-js-fusion",
        "dist-js-bundle",
        "dist-js-library",
        "dist-serviceworker",
        "dist-copy",
        "favicon"
    ];

    const tasks = DIST_TASKS
        .map(task => task + opts.config.taskPostfix)
        .filter(task => gulp.task(task))

    gulp.task('dist' + opts.config.taskPostfix, gulp.parallel(tasks));
};
