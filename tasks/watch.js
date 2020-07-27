'use strict';

const gulp = require('gulp');
const { addToTaskGroups } = require('../functions');

module.exports = function (opts) {

    addToTaskGroups(opts.groupedTasks, 'watch', opts.config.taskPostfix);

    gulp.task('watch' + opts.config.taskPostfix, function () {
        if (opts.config.project.styles && opts.config.project.styles.bundled && opts.config.project.styles.bundled.watch)
            gulp.watch([opts.config.project.styles.bundled.watch], ['dist-css-bundle' + opts.config.taskPostfix]);

        if (opts.config.project.styles && opts.config.project.styles.fusion && opts.config.project.styles.fusion.watch)
            gulp.watch([opts.config.project.styles.fusion.watch], ['dist-css-fusion' + opts.config.taskPostfix, opts.browserSync.reload]);

        if (opts.config.project.scripts && opts.config.project.scripts.bundled && opts.config.project.scripts.bundled.watch)
            gulp.watch([opts.config.project.scripts.bundled.watch], ['dist-js-bundle' + opts.config.taskPostfix]);

        if (opts.config.project.scripts && opts.config.project.scripts.fusion && opts.config.project.scripts.fusion.watch)
            gulp.watch([opts.config.project.scripts.fusion.watch], ['dist-js-fusion' + opts.config.taskPostfix, opts.browserSync.reload]);

        if (opts.config.project.scripts && opts.config.project.scripts.library && opts.config.project.scripts.library.watch)
            gulp.watch([opts.config.project.scripts.library.watch], ['dist-js-library' + opts.config.taskPostfix, opts.browserSync.reload]);

        if (opts.config.project.scripts && opts.config.project.scripts.serviceWorker && opts.config.project.scripts.serviceWorker.source)
            gulp.watch([opts.config.project.scripts.serviceWorker.source], ['dist-serviceworker' + opts.config.taskPostfix, opts.browserSync.reload]);

        if (opts.config.project.scripts && opts.config.project.scripts.lint && opts.config.project.scripts.lint.sources)
            gulp.watch([opts.config.project.scripts.lint.sources], ['lint-js' + opts.config.taskPostfix]);

        if (opts.config.project.styles && opts.config.project.styles.lint)
            gulp.watch([opts.config.project.styles.lint], ['lint-scss' + opts.config.taskPostfix]);

        if (opts.config.favicon)
            gulp.watch([opts.config.favicon.dataFile, opts.config.favicon.masterPicture], ['favicon-create-template' + opts.config.taskPostfix]);

        if (opts.config.fallbackChainConfig.hasOwnProperty(opts.config.projectName)) {
            for (let fallback of opts.config.fallbackChainConfig[opts.config.projectName]) {
                if (opts.allConfigs[fallback]) {
                    if (opts.allConfigs[fallback].project.styles && opts.allConfigs[fallback].project.styles.fusion && opts.allConfigs[fallback].project.styles.fusion.watch)
                        gulp.watch([opts.allConfigs[fallback].project.styles.fusion.watch], ['dist-css-fusion' + opts.allConfigs[fallback].taskPostfix, opts.browserSync.reload]);

                    if (opts.allConfigs[fallback].project.scripts && opts.allConfigs[fallback].project.scripts.fusion && opts.allConfigs[fallback].project.scripts.fusion.watch)
                        gulp.watch([opts.allConfigs[fallback].project.scripts.fusion.watch], ['dist-js-fusion' + opts.allConfigs[fallback].taskPostfix, opts.browserSync.reload]);
                }
            }
        }
    });
};
