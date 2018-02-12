"use strict";

// function getTimestamp() {
//     let timestamp;
//     let now = new Date();
//     timestamp = now.getFullYear().toString();
//     timestamp += "-";
//     timestamp +=
//         (now.getMonth() < 9 ? "0" : "") + (now.getMonth() + 1).toString();
//     timestamp += "-";
//     timestamp += (now.getDate() < 10 ? "0" : "") + now.getDate().toString();
//     timestamp += " ";
//     timestamp += (now.getHours() < 10 ? "0" : "") + now.getHours().toString();
//     timestamp += ":";
//     timestamp +=
//         (now.getMinutes() < 10 ? "0" : "") + now.getMinutes().toString();
//     //timestamp += ':';
//     //timestamp += (now.getSeconds() < 10 ? '0' : '') + now.getSeconds().toString();
//     return timestamp;
// }

function readYaml(path) {
    return yaml.safeLoad(fs.readFileSync(path));
}

function addToTaskGroups(groups, task, postfix) {
    if (undefined === groups[task]) {
         groups[task] = [];
    }
    groups[task].push(task + postfix);
}

// function loadTasks() {
//     require("./task");
// }

module.exports = {
    // getTimestamp: getTimestamp,
    // loadTasks: loadTasks,
    readYaml: readYaml,
    addToTaskGroups: addToTaskGroups
};
