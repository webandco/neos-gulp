'use strict';

const gulp = require('gulp');
const { addToTaskGroups } = require('../functions');

module.exports = function (opts) {

    addToTaskGroups(opts.groupedTasks, 'watch', opts.config.taskPostfix);

    gulp.task('watch' + opts.config.taskPostfix, function () {
        const browserSyncReload = function(cb) {
            opts.browserSync.reload();
            cb();
        };

        if (opts.config.project && opts.config.project.styles && opts.config.project.styles.bundled && opts.config.project.styles.bundled.watch)
            gulp.watch(opts.config.project.styles.bundled.watch, gulp.series(['dist-css-bundle' + opts.config.taskPostfix]));

        if (opts.config.project && opts.config.project.styles && opts.config.project.styles.fusion && opts.config.project.styles.fusion.watch)
            gulp.watch(opts.config.project.styles.fusion.watch, gulp.series(['dist-css-fusion' + opts.config.taskPostfix, browserSyncReload]));

        if (opts.config.project && opts.config.project.styles && opts.config.project.styles.library && opts.config.project.styles.library.watch)
            gulp.watch(opts.config.project.styles.library.watch, gulp.series(['dist-css-library' + opts.config.taskPostfix, browserSyncReload]));

        if (opts.config.project && opts.config.project.scripts && opts.config.project.scripts.bundled && opts.config.project.scripts.bundled.watch)
            gulp.watch(opts.config.project.scripts.bundled.watch, gulp.series(['dist-js-bundle' + opts.config.taskPostfix]));

        if (opts.config.project && opts.config.project.scripts && opts.config.project.scripts.fusion && opts.config.project.scripts.fusion.watch)
            gulp.watch(opts.config.project.scripts.fusion.watch, gulp.series(['dist-js-fusion' + opts.config.taskPostfix, browserSyncReload]));

        if (opts.config.project && opts.config.project.scripts && opts.config.project.scripts.library && opts.config.project.scripts.library.watch)
            gulp.watch(opts.config.project.scripts.library.watch, gulp.series(['dist-js-library' + opts.config.taskPostfix, browserSyncReload]));

        if (opts.config.project && opts.config.project.scripts && opts.config.project.scripts.serviceWorker && opts.config.project.scripts.serviceWorker.source)
            gulp.watch(opts.config.project.scripts.serviceWorker.source, gulp.series(['dist-serviceworker' + opts.config.taskPostfix, browserSyncReload]));

        if (opts.config.project && opts.config.project.scripts && opts.config.project.scripts.lint && opts.config.project.scripts.lint.sources)
            gulp.watch(opts.config.project.scripts.lint.sources, gulp.series(['lint-js' + opts.config.taskPostfix]));

        if (opts.config.project && opts.config.project.styles && opts.config.project.styles.lint)
            gulp.watch(opts.config.project.styles.lint, gulp.series(['lint-scss' + opts.config.taskPostfix]));

        if (opts.config.favicon && gulp.task('favicon-create-template' + opts.config.taskPostfix))
            gulp.watch([opts.config.favicon.dataFile, opts.config.favicon.masterPicture], gulp.series(['favicon-create-template' + opts.config.taskPostfix]));

        if (opts.config.fallbackChainConfig && opts.config.fallbackChainConfig.hasOwnProperty(opts.config.projectName)) {
            for (let fallback of opts.config.fallbackChainConfig[opts.config.projectName]) {
                if (opts.allConfigs[fallback]) {
                    if (opts.allConfigs[fallback].project.styles && opts.allConfigs[fallback].project.styles.fusion && opts.allConfigs[fallback].project.styles.fusion.watch)
                        gulp.watch(opts.allConfigs[fallback].project.styles.fusion.watch, gulp.series(['dist-css-fusion' + opts.allConfigs[fallback].taskPostfix, browserSyncReload]));

                    if (opts.allConfigs[fallback].project.scripts && opts.allConfigs[fallback].project.scripts.fusion && opts.allConfigs[fallback].project.scripts.fusion.watch)
                        gulp.watch(opts.allConfigs[fallback].project.scripts.fusion.watch, gulp.series(['dist-js-fusion' + opts.allConfigs[fallback].taskPostfix, browserSyncReload]));
                }
            }
        }
    });
};
