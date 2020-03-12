"use strict";

const fs = require('fs');
const path = require('path');
const log = require('fancy-log');
const colors = require('ansi-colors');
const gulp = require('gulp');
const { readYaml, replacePlaceholder } = require('./functions');


const projectRoot = path.join(__dirname, '..', '..');

let packagePaths = [
    path.join(projectRoot, 'Packages/Theme/'),
    path.join(projectRoot, 'DistributionPackages/')
];

const packages = [];

packagePaths.forEach(packagePath => {
    if (!fs.existsSync(packagePath)) return;
    const directoryContents = fs.readdirSync(packagePath);
    directoryContents.forEach(packageName => {
        if (fs.statSync(path.join(packagePath, packageName)).isDirectory()) {
            packages.push({
                name: packageName,
                path: packagePath
            });
        }
    });
});

const TASKS = [
    // "dist-css-fusion",
    // "dist-css-bundle",
    // "dist-js-fusion",
    // "dist-js-bundle",
    // "dist-copy",
    "favicon",
    // "lint-js",
    "lint-scss",
    // "server",
    // "watch"
];

const distTasks = [];

packages.forEach(theme => {
    const packageName = theme.name;
    const packagePath = path.join(theme.path, packageName);
    const yamlConfigFile = path.join(packagePath, '/Configuration/Gulp.yaml');

    if (fs.existsSync(yamlConfigFile)) {
        let yamlConfig = readYaml(yamlConfigFile);
        let yamlString = JSON.stringify(yamlConfig);
        yamlString = replacePlaceholder(yamlString, packagePath, packageName, projectRoot);

        let config = JSON.parse(yamlString).Webandco.Gulp.config;

        config.projectName = packageName;
        config.taskPostfix = '-' + packageName.toLowerCase();

        let projectDistTasks = [
            // 'dist-copy' + config.taskPostfix,
            // 'dist-css-bundle' + config.taskPostfix,
            // 'dist-css-fusion' + config.taskPostfix,
            // 'lint-js' + config.taskPostfix,
            // 'dist-js-bundle' + config.taskPostfix,
            // 'dist-js-fusion' + config.taskPostfix,
            'favicon' + config.taskPostfix,
        ];

        const browserSync = require('browser-sync').create(config.projectName);

        for (let key in TASKS) {
            require('./tasks/' + TASKS[key])({
                config: config,
                browserSync: browserSync,
                //groupedTasks: taskGroups
            });
        }

        gulp.task('dist' + config.taskPostfix, projectDistTasks);
        distTasks.push('dist' + config.taskPostfix);
    } else {
        log(colors.gray(packageName + ' - Package has no Gulp.yaml file'));
    }
});

if (distTasks.length > 0) {
    gulp.task('dist', distTasks);
}

// console.log(taskGroups);

// for (let task in taskGroups) {
//     gulp.task(task, taskGroups[task]);
// }

// use `gulp -T`
// gulp.task('viz', require('gulp-task-graph-visualizer')());

gulp.task('default', ['watch']);
