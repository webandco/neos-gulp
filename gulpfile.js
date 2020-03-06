"use strict";

require("./globals");

let packagePaths = [
    projectRoot + 'Packages/Theme/',
    projectRoot + 'DistributionPackages/'
];

packagePaths.forEach(function(packagePath) {
    let directoryContents = readDir.readSync(packagePath, null, readDir.NON_RECURSIVE + readDir.INCLUDE_DIRECTORIES);
    directoryContents.forEach(function (path) {
        if (path.substring(path.length - 1) == '/') {
            packages.push({
                name: path.substr(0, path.length - 1),
                path: packagePath
            });
        }
    });
});

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

let distTasks = [];

// console.log(packages);
packages.forEach(function (theme) {
    let packageName = theme.name;
    let packagePath = theme.path + packageName;
    let yamlConfigFile = packagePath + '/Configuration/Gulp.yaml' ;

    if (isThere(yamlConfigFile)) {
        let yamlConfig = readYaml(yamlConfigFile);
        let yamlString = JSON.stringify(yamlConfig);
        yamlString = replacePlaceholder(yamlString, packagePath, packageName, projectRoot);

        let config = JSON.parse(yamlString).Webandco.Gulp.config;

        config.projectName = packageName;
        config.taskPostfix = '-' + packageName.toLowerCase();

        let projectDistTasks = [
            'dist-copy' + config.taskPostfix,
            'dist-css' + config.taskPostfix,
            'hint-js' + config.taskPostfix,
            'dist-js' + config.taskPostfix,
            'favicon' + config.taskPostfix,
        ];

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
        distTasks.push('dist' + config.taskPostfix);
    } else {
        gulpUtil.log(gulpUtil.colors.gray(packageName + ' - Package has no Gulp.yaml file'));
    }
});

if (distTasks.length > 0) {
    gulp.task('dist', distTasks);
}

// console.log(taskGroups);

for (let task in taskGroups) {
    gulp.task(task, taskGroups[task]);
}

// use `gulp -T`
// gulp.task('viz', require('gulp-task-graph-visualizer')());

gulp.task('default', ['watch']);
