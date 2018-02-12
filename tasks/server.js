'use strict';

module.exports = function (opts) {
    addToTaskGroups(opts.groupedTasks, 'server', opts.config.taskPostfix);

    gulp.task('server' + opts.config.taskPostfix, ['watch' + opts.config.taskPostfix, /* ,'browser-sync'*/], function () {
        if (opts.config.server) {
            if (opts.config.server.browserSync) {
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
            }
        } else {
            console.log('server config does not exist for task server');
        }
    });
};
