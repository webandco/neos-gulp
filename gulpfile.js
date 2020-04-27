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
    path.join(projectRoot, 'DistributionPackages/'),
    path.join(projectRoot, 'Source/')
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
    "dist-css-fusion",
    "dist-css-bundle",
    "dist-js-fusion",
    "dist-js-bundle",
    "dist-serviceworker",
    "dist-copy",
    "clean-css",
    "clean-js",
    "clean",
    "rebuild",
    "favicon",
    "lint-js",
    "lint-scss",
    "server",
    "watch"
];

const DIST_TASKS = [
    "dist-css-fusion",
    "dist-css-bundle",
    "dist-js-fusion",
    "dist-js-bundle",
    "dist-serviceworker",
    "dist-copy",
    "favicon"
];

const distTasks = [];
const taskGroups = {};

packages.forEach(theme => {
    const packageName = theme.name;
    const packagePath = path.join(theme.path, packageName);
    const yamlConfigFile = path.join(packagePath, '/Configuration/Gulp.yaml');

    if (fs.existsSync(yamlConfigFile)) {
        let yamlConfig = readYaml(yamlConfigFile);
        let yamlString = JSON.stringify(yamlConfig);
        yamlString = replacePlaceholder(yamlString, packagePath, packageName, projectRoot);

        let config = JSON.parse(yamlString).Webandco.Gulp.config;

        config.projectRoot = projectRoot;
        config.projectName = packageName;
        config.taskPostfix = '-' + packageName.toLowerCase();


        const browserSync = require('browser-sync').create(config.projectName);

        const projectDistTasks = [];

        for (let key in TASKS) {
            const task = require('./tasks/' + TASKS[key])({
                config: config,
                browserSync: browserSync,
                groupedTasks: taskGroups
            });
            if (task !== 'no-task' && DIST_TASKS.includes(TASKS[key])) {
                projectDistTasks.push(TASKS[key] + config.taskPostfix);
            }
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

for (let task in taskGroups) {
    gulp.task(task, taskGroups[task]);
}

// use `gulp -T`
// gulp.task('viz', require('gulp-task-graph-visualizer')());

gulp.task('default', ['watch']);
