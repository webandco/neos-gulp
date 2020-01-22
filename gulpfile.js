"use strict";

require("./globals");

let themePaths = [
    '../../Packages/Theme/',
    '../../DistributionPackages/'
];

themePaths.forEach(function(themePath) {
    let directoryContents = readDir.readSync(themePath, null, readDir.NON_RECURSIVE + readDir.INCLUDE_DIRECTORIES);
    directoryContents.forEach(function (path) {
        if (path.substring(path.length - 1) == '/') {
            themes.push({
                name: path.substr(0, path.length - 1),
                path: themePath
            });
        }
    });
});

let localTopLevelDomain = 'test';

const TASKS = [
    "dist-css",
    "dist-js",
    "dist-copy",
    "favicon",
    "hint-js",
    "lint-scss",
    "sass",
    "server",
    "watch"
];

// console.log('themes directories');
// console.log(themes);
themes.forEach(function (theme) {
    let themeDir = themePath + theme;
    let themeName = theme;

    let yamlConfig = readYaml(themeDir + '/Configuration/Gulp.yaml');
    let yamlString = JSON.stringify(yamlConfig);
    yamlString = yamlString.replace(/THEME_PATH/g, themeDir);
    yamlString = yamlString.replace(/THEME_NAME/g, themeName);
    let config = JSON.parse(yamlString).config;

    config.projectName = themeName;
    config.taskPostfix = '-' + themeName.toLowerCase().replace(/webco\.(\w+)\.theme/, "$1");

    let projectDistTasks = [
        'dist-copy' + config.taskPostfix,
        'dist-css' + config.taskPostfix,
        'hint-js' + config.taskPostfix,
        'dist-js' + config.taskPostfix,
        'favicon' + config.taskPostfix,
    ];

    // console.log(config);
    browserSync[config.projectName] = require('browser-sync').create(config.projectName);

    for (let key in TASKS) {
        require('./tasks/' + TASKS[key])({
            config: config,
            groupedTasks: taskGroups
        });
    }

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
    //     for (let distId in config.penthouse.dist) {
    //         // console.log(penthouseId, config.penthouse.dist[distId]);
    //         require('./task/penthouse-combine')({
    //             config: config,
    //             groupedTasks: penthouseCombineTaskGroups,
    //             distId: distId,
    //             gulp: gulp
    //         });
    //     }
    //
    //     for (let penthouseId in config.penthouse.pages) {
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

    gulp.task('dist' + config.taskPostfix, projectDistTasks)
});

// console.log(taskGroups);

for (let task in taskGroups) {
    gulp.task(task, taskGroups[task]);
}

gulp.task('viz', require('gulp-task-graph-visualizer')());
gulp.task('default', ['watch']);
