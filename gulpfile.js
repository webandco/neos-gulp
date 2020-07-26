"use strict";

const fs = require('fs');
const path = require('path');
const log = require('fancy-log');
const colors = require('ansi-colors');
const gulp = require('gulp');
const deepmerge = require('deepmerge');
const { readYaml, replacePlaceholder } = require('./functions');


const projectRoot = path.join(__dirname, '..', '..');

let packagePaths = [
    path.join(projectRoot, 'DistributionPackages/'),
    path.join(projectRoot, 'Source/')
];

const packages = [];
let globalConfig;

const globalYamlConfigFile = path.join(projectRoot, 'Configuration', 'Gulp.yaml');
if (fs.existsSync(globalYamlConfigFile)) {
    const yamlConfig = readYaml(globalYamlConfigFile);
    let yamlString = JSON.stringify(yamlConfig);
    yamlString = replacePlaceholder(yamlString, undefined, undefined, projectRoot);
    globalConfig = JSON.parse(yamlString).Webandco.Gulp.config;

    if (globalConfig.packagePaths) {
        packagePaths = [...new Set([...packagePaths, ...globalConfig.packagePaths])];
    }
    if (globalConfig.packages) {
        globalConfig.packages.forEach(p => {
            if (fs.statSync(p).isDirectory()) {
                packages.push({
                    path: path.join(p, '..'),
                    name: path.basename(p)
                });
            }
        });
    }
}

packagePaths.forEach(packagePath => {
    if (!fs.existsSync(packagePath)) return;
    const directoryContents = fs.readdirSync(packagePath);
    directoryContents.forEach(packageName => {
        if (fs.statSync(path.join(packagePath, packageName)).isDirectory() && packages.findIndex(p => p.name === packageName) === -1) {
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
    "dist-js-library",
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
    "dist-js-library",
    "dist-serviceworker",
    "dist-copy",
    "favicon"
];

const allConfigs = {};

packages.forEach(p => {
    const packageName = p.name;
    const packagePath = path.join(p.path, packageName);
    const yamlConfigFile = path.join(packagePath, '/Configuration/Gulp.yaml');

    if (fs.existsSync(yamlConfigFile)) {
        let yamlConfig = readYaml(yamlConfigFile).Webandco.Gulp.config;
        yamlConfig = deepmerge(globalConfig, yamlConfig);
        let yamlString = JSON.stringify(yamlConfig);
        yamlString = replacePlaceholder(yamlString, packagePath, packageName, projectRoot);
        let config = JSON.parse(yamlString);

        config.projectRoot = projectRoot;
        config.projectName = packageName;
        config.taskPostfix = '-' + packageName.toLowerCase();

        allConfigs[packageName] = config;

    } else {
        log(colors.gray(packageName + ' - Package has no Gulp.yaml file'));
    }
});

const distTasks = [];
const taskGroups = {};

for (let packageConfig in allConfigs) {
    const browserSync = require('browser-sync').create(allConfigs[packageConfig].projectName);

    const projectDistTasks = [];

    for (let key in TASKS) {
        const task = require('./tasks/' + TASKS[key])({
            allConfigs: allConfigs,
            config: allConfigs[packageConfig],
            browserSync: browserSync,
            groupedTasks: taskGroups
        });
        if (task !== 'no-task' && DIST_TASKS.includes(TASKS[key])) {
            projectDistTasks.push(TASKS[key] + allConfigs[packageConfig].taskPostfix);
        }
    }

    gulp.task('dist' + allConfigs[packageConfig].taskPostfix, projectDistTasks);
    distTasks.push('dist' + allConfigs[packageConfig].taskPostfix);
}

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
