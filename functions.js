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

function notifyText(object) {
    if (object.warning || object.error || object.warnings || object.errors) {
        let warning;
        let message = " found";
        let hasError = object.error || object.errors ? true : false;
        let options = {
            title: object.title ? object.title : hasError ? "Error" : "Warning",
            icon: hasError ? gulpIcons.error : gulpIcons.warning,
            wait: hasError,
            sound: hasError ? "Basso" : false
        };

        if (
            object.warning ||
            (object.error && (!object.warnings && !object.errors))
        ) {
            message = "Some issues found";
        }
        if (object.warnings) {
            warning = pluralize(" warning", object.warnings);
            message = object.warnings + warning + message;
        }
        if (object.errors) {
            let error = pluralize(" error", object.errors);
            message =
                object.errors +
                error +
                (object.warnings ? " and " : "") +
                message;
        }

        if (config.global.notifications) {
            notifier.notify({
                title: options.title,
                subtitle: object.subtitle,
                message: message,
                icon: options.icon,
                wait: options.wait,
                sound: options.sound
            });
        } else {
            // Output an error message in the console
            let text = ` (${object.subtitle}): ${message}`;
            if (hasError) {
                log(colors.red(options.title) + text);
            } else {
                log(colors.yellow(options.title) + text);
            }
        }
    }
}

module.exports = {
    // getTimestamp: getTimestamp,
    // loadTasks: loadTasks,
    readYaml: readYaml,
    addToTaskGroups: addToTaskGroups
};
