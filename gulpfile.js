"use strict";

// var gulp = require('gulp'),
//     fs = require('fs'),
//     readDir = require('readdir'),
//     yaml = require('js-yaml');

require("./global");


var themePath = '../../Packages/Theme/';

var taskGroups = [];
var browserSync = [];

var directoryContents = readDir.readSync(themePath, null, readDir.NON_RECURSIVE + readDir.INCLUDE_DIRECTORIES);

var themes = [];
directoryContents.forEach(function (path) {
    if (path.substring(path.length - 1) == '/') {
        themes.push(path.substr(0, path.length - 1));
    }
});
var localTopLevelDomain = 'test';


function readYaml(path) {
    // console.log(path);
    return yaml.safeLoad(fs.readFileSync(path));
}


// console.log('themes directories');
// console.log(themes);
var portCount = 0;
themes.forEach(function (theme) {
    var themeDir = themePath + theme;
    var projectName = theme;

    var yamlConfig = readYaml(themeDir + '/Configuration/Gulp.yaml');
    var yamlString = JSON.stringify(yamlConfig).replace(/THEME_PATH/g, themeDir);
    var config = JSON.parse(yamlString).config;

    config.projectName = projectName;
    config.taskPostfix = '-' + projectName.toLowerCase();

    // console.log(config);


    // var config = {
    //     projectName: projectName,
    //     taskPostfix: '-' + projectName,
    //     paths: {
    //         build: {
    //             styles: themeDir + '/Resources/Public/build'
    //         },
    //         dist: {
    //             styles: themeDir + '/Resources/Public/dist'
    //         },
    //         source: {
    //             sass: [
    //                 themeDir + '/Resources/Public/scss/theme.scss',
    //                 themeDir + '/Resources/Private/Fusion/Component/**/*.scss'
    //             ]
    //         },
    //         watch: {
    //             sass: [
    //                 themeDir + '/Resources/Public/scss/*.scss',
    //                 themeDir + '/Resources/Private/Fusion/Component/**/*.scss'
    //             ]
    //         }
    //     },
    //     project: {
    //         css: {
    //             // remove all comments, @see https://github.com/sindresorhus/strip-css-comments#options
    //             stripCssComments: {
    //                 preserve: false
    //             }
    //         },
    //         lint: {
    //             scss: [
    //                 themeDir + '/**/*.scss'
    //             ]
    //         },
    //         cssFiles: [
    //             themeDir + '/Resources/Public/build/theme.css',
    //             themeDir + '/Resources/Public/build/**/style.css'
    //         ]
    //     },
    //     server: {
    //         browserSync: {
                // proxy: projectName + '.' + localTopLevelDomain,
                // proxy: projectName.toLowerCase() + '.' + localTopLevelDomain,
                // port: 3000 + portCount,
                // baseDir: './Web',
                // reload: [
                //     themeDir + '/Resources/Private/Fusion/Component/**/*.fusion'
                // ]
            // }
        // }
    // };
    // portCount++;

    var projectDistTasks = [
        // 'dist-copy' + config.taskPostfix,
        'dist-css' + config.taskPostfix,
        // 'lint-js' + config.taskPostfix,
        'dist-js' + config.taskPostfix,
        // 'favicon' + config.taskPostfix,
    ];

    // console.log(config);

    browserSync[config.projectName] = require('browser-sync').create(config.projectName);

    require('./task/dist-css')({
        browserSync: browserSync[config.projectName],
        config: config,
        groupedTasks: taskGroups,
        gulp: gulp
    });

    require('./task/dist-js')({
        config: config,
        groupedTasks: taskGroups,
        gulp: gulp
    });

    require('./task/lint-js')({
        config: config,
        groupedTasks: taskGroups,
        gulp: gulp
    });

    require('./task/lint-scss')({
        config: config,
        groupedTasks: taskGroups,
        gulp: gulp
    });

    require('./task/sass')({
        config: config,
        groupedTasks: taskGroups,
        gulp: gulp
    });

    require('./task/server')({
        browserSync: browserSync[config.projectName],
        config: config,
        gulp: gulp,
        groupedTasks: taskGroups
    });

    require('./task/watch')({
        config: config,
        groupedTasks: taskGroups,
        gulp: gulp
    });

    gulp.task('dist' + config.taskPostfix, projectDistTasks)
});


// console.log(taskGroups);

for (var task in taskGroups) {
    gulp.task(task, taskGroups[task]);
}

gulp.task('viz', require('gulp-task-graph-visualizer')());
