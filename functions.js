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
    addToTaskGroups: addToTaskGroups,
    readYaml: readYaml,
    replacePlaceholder: replacePlaceholder
};
