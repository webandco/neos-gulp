"use strict";
const yaml = require('js-yaml');
const fs = require('fs');


function readYaml(path) {
    return yaml.safeLoad(fs.readFileSync(path));
}

let isWatch = false;

function setIsWatch() {
    isWatch = true;
}

function getOptionsWatchDist(config) {
    if (isWatch) {
        return config['watch'] || config['dist'];
    } else {
        return config['dist'];
    }
}

// function addToTaskGroups(groups, task, postfix) {
//     if (undefined === groups[task]) {
//          groups[task] = [];
//     }
//     groups[task].push(task + postfix);
// }
//
// // function loadTasks() {
// //     require("./task");
// // }

function replacePlaceholder(code, packagePath, packageName, projectRoot) {
    let result = code;

    result = result.replace(/PACKAGE_PATH/g, packagePath);
    result = result.replace(/PACKAGE_NAME/g, packageName);
    result = result.replace(/PROJECT_ROOT/g, projectRoot);

    // @deprecated - will be removed. Use PACKAGE_PATH and PACKAGE_NAME instead
    result = result.replace(/THEME_PATH/g, packagePath);
    result = result.replace(/THEME_NAME/g, packageName);

    return result;
}

module.exports = {
    readYaml,
    replacePlaceholder,
    getOptionsWatchDist,
    setIsWatch
};
