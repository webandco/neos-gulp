'use strict';

module.exports = function (opts) {
    if (!opts.config.favicon) {
        gulpUtil.log(gulpUtil.colors.red('favicon not configured - favicon'));
        return false;
    }

    if (!opts.config.favicon.masterPicture) {
        gulpUtil.log(gulpUtil.colors.red('masterPicture not configured - favicon'));
        return false;
    }

    if (false === isThere(opts.config.favicon.masterPicture)) {
        gulpUtil.log(gulpUtil.colors.red('masterPicture file ' + opts.config.favicon.masterPicture + ' does not exists'));
        return false;
    }

    if (!opts.config.favicon.templateFile) {
        gulpUtil.log(gulpUtil.colors.red('templateFile is not configured - favicon'));
        return false;
    }

    addToTaskGroups(opts.groupedTasks, 'favicon', opts.config.taskPostfix);

    gulpUtil.log('Favicon      :');
    let resourceJsonDir = path.dirname(opts.config.favicon.dataFile);

    if (isThere(resourceJsonDir)) {
        gulpUtil.log('  JsonDir    :', gulpUtil.colors.green(resourceJsonDir), 'exists');
    } else {
        fsExtra.mkdirs(resourceJsonDir, function (err) {
            if (err) {
                    return console.error(err);
                }
            }
        );
        gulpUtil.log('  JsonDir    :', gulpUtil.colors.green(resourceJsonDir), 'was created');
    }



    if (isThere(opts.config.favicon.dest)) {
        gulpUtil.log('  Dest       :', gulpUtil.colors.green(opts.config.favicon.dest), 'exists');
    } else {
        fsExtra.mkdirs(opts.config.favicon.dest, function (err) {
                if (err) {
                    gulpUtil.log('  Dest       :', gulpUtil.colors.red(opts.config.favicon.dest), 'does not exist');
                    return console.error(err);
                }
            }
        );
        gulpUtil.log('  Dest       :', gulpUtil.colors.green(opts.config.favicon.dest), 'was created');
    }
    gulpUtil.log('--');

    gulp.task('favicon-create-template' + opts.config.taskPostfix, function (done) {
        if (isThere(opts.config.favicon.dataFile)) {
            let templateDir = path.dirname(opts.config.favicon.templateFile);
            if (isThere(templateDir)) {
                gulpUtil.log('  TemplateDir:', gulpUtil.colors.green(templateDir), 'exists');
            } else {
                fsExtra.mkdirs(templateDir, function (err) {
                    if (err) {
                            return console.error(err);
                        }
                    }
                );
                gulpUtil.log('  TemplateDir:', gulpUtil.colors.green(templateDir), 'was created');
            }

            let code = JSON.parse(fsExtra.readFileSync(opts.config.favicon.dataFile)).favicon.html_code;
            if (opts.config.favicon.replacePath) {
                // replace with neos uri.resource viewHelper
                code = code.replace(/(content|href)=\"_PATH_([^\">]+)/gi, "$1=\"{webco:uri.static(path: '" + opts.config.favicon.replacePath + "$2', package: '" + opts.config.sitePackage + "')}");
                code = '{namespace webco=Webco\\Fou001\\NodeTypes\\ViewHelpers}\n\n' + code;
            } else {
                gulpUtil.log(gulpUtil.colors.red('replacePath is not configured - favicon'));
            }

            fsExtra.writeFileSync(opts.config.favicon.templateFile, code);
            gulpUtil.log('  Template  :', gulpUtil.colors.green(opts.config.favicon.templateFile), 'created');
        } else {
            gulpUtil.log(gulpUtil.colors.red('Datafile ' + opts.config.favicon.dataFile + ' does not exist! Run task favicon-generate()'));
        }

        done();
    });

    gulp.task('favicon-replace-webmanifest' + opts.config.taskPostfix, function (done) {
        let manifestFile = opts.config.favicon.dest + "/site.webmanifest";

        if (isThere(manifestFile)) {
            let code = fsExtra.readFileSync(manifestFile).toString();
            code = code.replace(/_PATH_\//gi, "");
            fsExtra.writeFileSync(manifestFile, code);
        } else {
            gulpUtil.log(gulpUtil.colors.red('Webmanifest file : ' + manifestFile, 'does not exist! Run task favicon-generate()'));
        }
    });

    gulp.task('favicon-replace-browserconfig' + opts.config.taskPostfix, function (done) {
        let browserConfigFile = opts.config.favicon.dest + "/browserconfig.xml";

        if (isThere(browserConfigFile)) {
            let code = fsExtra.readFileSync(browserConfigFile).toString();
            code = code.replace(/_PATH_\//gi, "");
            fsExtra.writeFileSync(browserConfigFile, code);
        } else {
            gulpUtil.log(gulpUtil.colors.red('Browserconfig file ' + browserConfigFile + ' does not exist! Run task favicon-generate()'));
        }
    });

    // Generate the icons. This task takes a few seconds to complete.
    // You should run it at least once to create the icons. Then,
    // you should run it whenever RealFaviconGenerator updates its
    // package (see the check-for-favicon-update task below).
    gulp.task('favicon-generate' + opts.config.taskPostfix, function (done) {
        realFavicon.generateFavicon({
            masterPicture: opts.config.favicon.masterPicture,
            dest: opts.config.favicon.dest,
            iconsPath: '_PATH_',
            design: {
                ios: {
                    pictureAspect: 'noChange'
                },
                desktopBrowser: {},
                windows: {
                    pictureAspect: 'noChange',
                    backgroundColor: opts.config.favicon.color.background,
                    onConflict: 'override'
                },
                androidChrome: {
                    pictureAspect: 'noChange',
                    themeColor: opts.config.favicon.color.theme,
                    manifest: {
                        name: opts.config.favicon.manifestName,
                        display: 'browser',
                        orientation: 'notSet',
                        onConflict: 'override',
                        declared: true
                    }
                },
                safariPinnedTab: {
                    pictureAspect: 'blackAndWhite',
                    threshold: 50,
                    themeColor: opts.config.favicon.color.theme
                }
            },
            settings: {
                scalingAlgorithm: 'Mitchell',
                errorOnImageTooSmall: false
            },
            markupFile: opts.config.favicon.dataFile
        }, function () {
            gulp.start('favicon-create-template' + opts.config.taskPostfix);
            gulp.start('favicon-replace-webmanifest' + opts.config.taskPostfix);
            gulp.start('favicon-replace-browserconfig' + opts.config.taskPostfix);
            done();
        });
    });

    // Check for updates on RealFaviconGenerator (think: Apple has just
    // released a new Touch icon along with the latest version of iOS).
    // Run this task from time to time. Ideally, make it part of your
    // continuous integration system.
    gulp.task('favicon-check-for-update' + opts.config.taskPostfix, function (done) {
        let currentVersion = '';

        if (isThere(opts.config.favicon.dataFile)) {
            currentVersion = JSON.parse(fsExtra.readFileSync(opts.config.favicon.dataFile)).version;
        }

        gulpUtil.log('Favicon: Checking Version ', gulpUtil.colors.green(currentVersion));
        realFavicon.checkForUpdates(currentVersion, function (err) {
            if (err !== undefined) {
                gulp.start('favicon-generate' + opts.config.taskPostfix);
            }
        });
    });

    gulp.task('favicon' + opts.config.taskPostfix, ['favicon-check-for-update' + opts.config.taskPostfix], function (done) {
        done();
    });
};
