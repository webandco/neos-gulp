'use strict';

const log = require('fancy-log');
const colors = require('ansi-colors');
const realFavicon = require('gulp-real-favicon');
const { addToTaskGroups } = require('../functions');
const gulp = require('gulp');
const fs = require('fs');
const path = require('path');

module.exports = function (opts) {
    if (!opts.config.favicon) {
        log(colors.red('favicon not configured - favicon'));
        return 'no-task';
    }

    if (!opts.config.favicon.masterPicture) {
        log(colors.red('masterPicture not configured - favicon'));
	    return 'no-task';
    }

    if (!fs.existsSync(opts.config.favicon.masterPicture)) {
        log(colors.red('masterPicture file ' + opts.config.favicon.masterPicture + ' does not exists'));
	    return 'no-task';
    }

    if (!opts.config.favicon.templateFile) {
        log(colors.red('templateFile is not configured - favicon'));
	    return 'no-task';
    }

    addToTaskGroups(opts.groupedTasks, 'favicon', opts.config.taskPostfix);

    log('Favicon      :');
    const resourceJsonDir = path.dirname(opts.config.favicon.dataFile);

    if (fs.existsSync(resourceJsonDir)) {
        log('  JsonDir    :', colors.green(resourceJsonDir), 'exists');
    } else {
        try {
            fs.mkdirSync(resourceJsonDir);
            log('  JsonDir    :', colors.green(resourceJsonDir), 'was created');
        } catch (e) {
            log.error(e);
        }
    }

    if (fs.existsSync(opts.config.favicon.dest)) {
        log('  Dest       :', colors.green(opts.config.favicon.dest), 'exists');
    } else {
        try {
            fs.mkdirSync(opts.config.favicon.dest);
            log('  Dest       :', colors.green(opts.config.favicon.dest), 'was created');
        } catch (e) {
            log.error(e);
        }
    }
    log('--');

    gulp.task('favicon-create-template' + opts.config.taskPostfix, function (done) {
        if (fs.existsSync(opts.config.favicon.dataFile)) {
            const templateDir = path.dirname(opts.config.favicon.templateFile);
            if (fs.existsSync(templateDir)) {
                log('  TemplateDir:', colors.green(templateDir), 'exists');
            } else {
                try {
                    fs.mkdirSync(templateDir);
                    log('  TemplateDir:', colors.green(templateDir), 'was created');

                } catch (e) {
                    log.error(e);
                }
            }
            let code = JSON.parse(fs.readFileSync(opts.config.favicon.dataFile).toString()).favicon.html_code;
            if (opts.config.favicon.replace.templatePath) {
                if (opts.config.favicon.replace.templatePrefix) {
                    code = opts.config.favicon.replace.templatePrefix + code;
                }
                if (opts.config.favicon.replace.templateHrefPattern) {
                    let pattern = "$1=\"{webco:uri.static(path: '" + opts.config.favicon.replace.templatePath + "$2', package: '" + opts.config.projectName + "')}";
                    pattern = '$1="' +  opts.config.favicon.replace.templateHrefPattern;
                    pattern = pattern.replace(/FAVICON_URL/g, opts.config.favicon.replace.templatePath + "$2");
                    // replace image url with pattern, eg for view Helpers
                    code = code.replace(/(content|href)=\"_PATH_([^\">]+)/gi, pattern);
                }
            } else {
                log(colors.yellow('replace.templatePath is not configured - favicon'));
            }

            fs.writeFileSync(opts.config.favicon.templateFile, code);
            log('  Template  :', colors.green(opts.config.favicon.templateFile), 'created');
        } else {
            log(colors.red('Datafile ' + opts.config.favicon.dataFile + ' does not exist! Run task favicon-generate()'));
        }

        done();
    });

    gulp.task('favicon-replace-webmanifest' + opts.config.taskPostfix, function (cb) {
        let manifestFile = opts.config.favicon.dest + "/site.webmanifest";

        if (fs.existsSync(manifestFile)) {
            let code = fs.readFileSync(manifestFile).toString();
            code = code.replace(/_PATH_\//gi, "");

            const webmanifest = JSON.parse(code);
            webmanifest.scope = opts.config.favicon.webmanifest.scope || '/';
            webmanifest.start_url = opts.config.favicon.webmanifest.startUrl || '/';
            webmanifest.display = opts.config.favicon.webmanifest.display || 'browser';
            webmanifest.orientation = opts.config.favicon.webmanifest.orientation;
            webmanifest.short_name = opts.config.favicon.webmanifest.shortName || webmanifest.short_name;
            webmanifest.description = opts.config.favicon.webmanifest.description;
            webmanifest.lang = opts.config.favicon.webmanifest.lang;

            fs.writeFileSync(manifestFile, JSON.stringify(webmanifest, null, 2));
        } else {
            log(colors.red('Webmanifest file : ' + manifestFile + ' does not exist! Run task favicon-generate()'));
        }
        cb();
    });

    gulp.task('favicon-replace-browserconfig' + opts.config.taskPostfix, function (cb) {
        let browserConfigFile = opts.config.favicon.dest + "/browserconfig.xml";

        if (fs.existsSync(browserConfigFile)) {
            let code = fs.readFileSync(browserConfigFile).toString();
            if (opts.config.favicon.replace.browserconfigPath) {
                code = code.replace(/_PATH_/gi, opts.config.favicon.replace.browserconfigPath);
            }
            fs.writeFileSync(browserConfigFile, code);
            log('  Browserconfig: ' + colors.green( browserConfigFile ) + ' exist!');
        } else {
            log(colors.red('Browserconfig file ' + browserConfigFile + ' does not exist! Run task favicon-generate()'));
        }
        cb();
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
                        name: opts.config.favicon.webmanifest.name,
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
            gulp.series(
                gulp.task('favicon-create-template' + opts.config.taskPostfix),
                gulp.task('favicon-replace-webmanifest' + opts.config.taskPostfix),
                gulp.task('favicon-replace-browserconfig' + opts.config.taskPostfix),
            )();
            done();
        });
    });

    // Check for updates on RealFaviconGenerator (think: Apple has just
    // released a new Touch icon along with the latest version of iOS).
    // Run this task from time to time. Ideally, make it part of your
    // continuous integration system.
    gulp.task('favicon-check-for-update' + opts.config.taskPostfix, function (cb) {
        let currentVersion = '';

        if (fs.existsSync(opts.config.favicon.dataFile)) {
            currentVersion = JSON.parse(fs.readFileSync(opts.config.favicon.dataFile).toString()).version;
        }

        log('Favicon: Checking Version ', colors.green(currentVersion));
        realFavicon.checkForUpdates(currentVersion, function (err) {
            if (err !== undefined) {
                gulp.series(gulp.task('favicon-generate' + opts.config.taskPostfix))();
            }
        });
        cb();
    });

    gulp.task('favicon' + opts.config.taskPostfix, gulp.parallel(['favicon-check-for-update' + opts.config.taskPostfix]));
};
