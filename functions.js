"use strict";
const yaml = require('js-yaml');
const fs = require('fs');
const tap = require('gulp-tap');


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

    return result;
}

function touchFusionFile() {
    return tap((file) => {
       const fusionFile = file.path.replace(/(\.css|\.js)/, '.fusion');
       if (fs.existsSync(fusionFile)) {
           const time = new Date();
           fs.utimesSync(fusionFile, time, time);
       }
    });
}

module.exports = {
    readYaml,
    replacePlaceholder,
    addToTaskGroups,
    touchFusionFile
};
