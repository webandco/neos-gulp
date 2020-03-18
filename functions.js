"use strict";
const yaml = require('js-yaml');
const fs = require('fs');


function readYaml(path) {
    return yaml.safeLoad(fs.readFileSync(path));
}

function addToTaskGroups(groups, task, postfix) {
    if (!groups[task]) {
         groups[task] = [];
    }
    groups[task].push(task + postfix);
}

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
    addToTaskGroups
};
