'use strict';

module.exports = function (opts) {
    taskGroups(opts.groupedTasks, 'favicon', opts.config.taskPostfix);

    gutil.log('Favicon      :');
    var resourceJsonDir = path.dirname(opts.config.favicon.dataFile);

    if (isThere(resourceJsonDir)) {
        gutil.log('  JsonDir    :', gutil.colors.green(resourceJsonDir), 'exists');
    } else {
        fs.mkdirs(resourceJsonDir, function (err) {
            if (err) {
                    return console.error(err);
                }
            }
        );
        gutil.log('  JsonDir    :', gutil.colors.green(resourceJsonDir), 'was created');
    }

    if (false === isThere(opts.config.favicon.masterPicture)) {
        gutil.log('  Masterpic  :', gutil.colors.red(opts.config.favicon.masterPicture), 'does not exists');
    }

    if (isThere(opts.config.favicon.dest)) {
        gutil.log('  Dest       :', gutil.colors.green(opts.config.favicon.dest), 'exists');
    } else {
        fs.mkdirs(opts.config.favicon.dest, function (err) {
                if (err) {
                    gutil.log('  Dest       :', gutil.colors.red(opts.config.favicon.dest), 'does not exist');
                    return console.error(err);
                }
            }
        );
        gutil.log('  Dest       :', gutil.colors.green(opts.config.favicon.dest), 'was created');
    }
    gutil.log('--');

    // Generate the icons. This task takes a few seconds to complete.
    // You should run it at least once to create the icons. Then,
    // you should run it whenever RealFaviconGenerator updates its
    // package (see the check-for-favicon-update task below).
    opts.gulp.task('favicon-generate' + opts.config.taskPostfix, function (done) {
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
            done();
        });
    });

    opts.gulp.task('favicon-create-template' + opts.config.taskPostfix, ['favicon-generate' + opts.config.taskPostfix], function (done) {
        if (isThere(opts.config.favicon.dataFile)) {
            var templateDir = path.dirname(opts.config.favicon.templateFile);
            if (isThere(templateDir)) {
                gutil.log('  TemplateDir:', gutil.colors.green(templateDir), 'exists');
            } else {
                fs.mkdirs(templateDir, function (err) {
                    if (err) {
                            return console.error(err);
                        }
                    }
                );
                gutil.log('  TemplateDir:', gutil.colors.green(templateDir), 'was created');
            }

            var code = JSON.parse(fs.readFileSync(opts.config.favicon.dataFile)).favicon.html_code;
            // replace with neos uri.resource viewHelper
            code = code.replace(/(content|href)=\"_PATH_([^\">]+)/gi, "$1=\"{webco:uri.static(path: '" + opts.config.favicon.replacePath + "$2', package: '" + opts.config.sitePackage + "')}");
            code = '{namespace webco=Webco\\Fou001\\NodeTypes\\ViewHelpers}\n\n' + code;

            fs.writeFileSync(opts.config.favicon.templateFile, code);
            gutil.log('  Template  :', gutil.colors.green(opts.config.favicon.templateFile), 'created');
        } else {
            gutil.log('  Favicon   :', gutil.colors.red(opts.config.favicon.dataFile), 'does not exist!');
        }

        done();
    });

    // Check for updates on RealFaviconGenerator (think: Apple has just
    // released a new Touch icon along with the latest version of iOS).
    // Run this task from time to time. Ideally, make it part of your
    // continuous integration system.
    opts.gulp.task('favicon-check-for-update' + opts.config.taskPostfix, function (done) {
        var currentVersion = '';

        if (isThere(opts.config.favicon.dataFile)) {
            currentVersion = JSON.parse(fs.readFileSync(opts.config.favicon.dataFile)).version;
        }

        gutil.log('Favicon: Checking Version ', gutil.colors.green(currentVersion));
        realFavicon.checkForUpdates(currentVersion, function (err) {
            if (err !== undefined) {
                opts.gulp.start('favicon-create-template' + opts.config.taskPostfix);
                opts.gulp.start('favicon-replace-webmanifest' + opts.config.taskPostfix);
                opts.gulp.start('favicon-replace-browserconfig' + opts.config.taskPostfix);
            }
        });
    });

    opts.gulp.task('favicon-replace-webmanifest' + opts.config.taskPostfix, function (done) {
        var manifestFile = opts.config.favicon.dest + "/site.webmanifest";

        if (isThere(manifestFile)) {
            var code = fs.readFileSync(manifestFile).toString();
            code = code.replace(/_PATH_\//gi, "");
            fs.writeFileSync(manifestFile, code);
        } else {
            gutil.log('  Manifest   :', gutil.colors.red(manifestFile), 'does not exist');
        }
    });

    opts.gulp.task('favicon-replace-browserconfig' + opts.config.taskPostfix, function (done) {
        var browserConfigFile = opts.config.favicon.dest + "/browserconfig.xml";

        if (isThere(browserConfigFile)) {
            var code = fs.readFileSync(browserConfigFile).toString();
            code = code.replace(/_PATH_\//gi, "");
            fs.writeFileSync(browserConfigFile, code);
        } else {
            gutil.log('  ConfigFile :', gutil.colors.red(manifestFile), 'does not exist');
        }
    });

    opts.gulp.task('favicon' + opts.config.taskPostfix, ['favicon-check-for-update' + opts.config.taskPostfix], function (done) {
        done();
    });


};
