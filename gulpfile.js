"use strict";

require("./global");

var themePath = '../../Packages/Theme/';

// var taskGroups = [];
// var browserSync = [];
// var themes = [];

var directoryContents = readDir.readSync(themePath, null, readDir.NON_RECURSIVE + readDir.INCLUDE_DIRECTORIES);
directoryContents.forEach(function (path) {
    if (path.substring(path.length - 1) == '/') {
        themes.push(path.substr(0, path.length - 1));
    }
});

var localTopLevelDomain = 'test';


// function readYaml(path) {
//     // console.log(path);
//     return yaml.safeLoad(fs.readFileSync(path));
// }

// console.log('themes directories');
// console.log(themes);
themes.forEach(function (theme) {
    var themeDir = themePath + theme;
    var themeName = theme;

    var yamlConfig = readYaml(themeDir + '/Configuration/Gulp.yaml');
    var yamlString = JSON.stringify(yamlConfig);
    var yamlString = yamlString.replace(/THEME_PATH/g, themeDir);
    var yamlString = yamlString.replace(/THEME_NAME/g, themeName);
    var config = JSON.parse(yamlString).config;

    config.projectName = themeName;
    config.taskPostfix = '-' + themeName.toLowerCase();

    var projectDistTasks = [
        // 'dist-copy' + config.taskPostfix,
        'dist-css' + config.taskPostfix,
        // 'hint-js' + config.taskPostfix,
        'dist-js' + config.taskPostfix,
        'favicon' + config.taskPostfix,
    ];

    // console.log(config);

    browserSync[config.projectName] = require('browser-sync').create(config.projectName);

    require('./task/dist-css')({
        browserSync: browserSync[config.projectName],
        config: config,
        groupedTasks: taskGroups
    });

    require('./task/dist-js')({
        config: config,
        groupedTasks: taskGroups
    });

    // todo: config need be be defined
    require('./task/dist-copy')({
        config: config,
        groupedTasks: taskGroups
    });

    // if (config.penthouse && config.penthouse.pages) {
    //     penthouseExtractTaskGroups['penthouse-extract' + config.taskPostfix] = ['dist-css' + config.taskPostfix];
    //     // console.log('penthouse', config.penthouse);
    //     // console.log('pages', config.penthouse.pages);
    //     require('./task/dist-penthouse')({
    //         config: config,
    //         groupedTasks: taskGroups,
    //         gulp: gulp,
    //         distTasks: penthouseDistTaskGroups,
    //     });
    //
    //     for (var distId in config.penthouse.dist) {
    //         // console.log(penthouseId, config.penthouse.dist[distId]);
    //         require('./task/penthouse-combine')({
    //             config: config,
    //             groupedTasks: penthouseCombineTaskGroups,
    //             distId: distId,
    //             gulp: gulp
    //         });
    //     }
    //
    //     for (var penthouseId in config.penthouse.pages) {
    //         // console.log(penthouseId, config.penthouse.pages[penthouseId]);
    //         require('./task/penthouse-extract')({
    //             config: config,
    //             groupedTasks: penthouseExtractTaskGroups,
    //             penthouseId: penthouseId,
    //             gulp: gulp
    //         });
    //     }
    //     projectDistTasks.push('dist-penthouse' + config.taskPostfix);
    // }

    require('./task/favicon')({
        config: config,
        groupedTasks: taskGroups
    });

    require('./task/hint-js')({
        config: config,
        groupedTasks: taskGroups
    });

    require('./task/lint-scss')({
        config: config,
        groupedTasks: taskGroups
    });

    require('./task/sass')({
        config: config,
        groupedTasks: taskGroups
    });

    require('./task/server')({
        browserSync: browserSync[config.projectName],
        config: config,
        groupedTasks: taskGroups
    });

    require('./task/watch')({
        config: config,
        groupedTasks: taskGroups
    });

    gulp.task('dist' + config.taskPostfix, projectDistTasks)
});

// console.log(taskGroups);

for (var task in taskGroups) {
    gulp.task(task, taskGroups[task]);
}

gulp.task('viz', require('gulp-task-graph-visualizer')());

gulp.task('test', null);


