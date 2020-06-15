'use strict';

const gulp = require('gulp');
const { addToTaskGroups } = require('../functions');

module.exports = function (opts) {

    if (!(opts.config.server && opts.config.server.browserSync)) {
        return 'no-task';
    }

    addToTaskGroups(opts.groupedTasks, 'server', opts.config.taskPostfix);

    gulp.task('server' + opts.config.taskPostfix, ['watch' + opts.config.taskPostfix], function () {
        switch ("string") {
            case typeof opts.config.server.browserSync.proxy:
                opts.browserSync.init({
                    proxy: opts.config.server.browserSync.proxy,
                    port: opts.config.server.browserSync.port,
                    ui: false
                });
                break;
            case typeof opts.config.server.browserSync.baseDir:
                opts.browserSync.init({
                    server: {
                        baseDir: opts.config.server.browserSync.baseDir
                    }
                });
                break;
        }

        gulp.watch(opts.config.server.browserSync.reload).on('change', opts.browserSync.reload);
    });
};
