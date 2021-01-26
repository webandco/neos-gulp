"use strict";
const yaml = require('js-yaml');
const fs = require('fs');
const tap = require('gulp-tap');
const path = require('path');

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

    if (packagePath)
        result = result.replace(/PACKAGE_PATH/g, packagePath);

    if (packageName)
        result = result.replace(/PACKAGE_NAME/g, packageName);

    if (projectRoot)
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

function scssFileImporterFactory(config) {
    return function (url, file, done) {

        // node_modules
        if (url.startsWith('~')) {
            const newUrl = path.join(config.projectRoot, 'node_modules', url.substring(1));
            done({ file: newUrl });
            return;
        }

        // Neos resource path
        if (url.startsWith('resource://')) {
            let [pack, type, ...resourcePath] = url.replace('resource://', '').split('/');

            const packageLocations = [
                path.join(config.projectRoot, 'Packages', 'Application'),
                path.join(config.projectRoot, 'Packages', 'Plugins'),
                path.join(config.projectRoot, 'Packages', 'Sites')
            ];

            let resolvedResourcePath;
            for (let location of packageLocations) {
                if (fs.existsSync(path.join(location, pack))) {
                    resolvedResourcePath = path.join(location, pack);
                    break;
                }
            }
            if (!resolvedResourcePath) {
                done(new Error(url + ' can\'t be resolved'));
                return;
            }
            resolvedResourcePath = path.join(resolvedResourcePath, 'Resources', type, ...resourcePath);
            if (!(fs.existsSync(resolvedResourcePath) || fs.existsSync(resolvedResourcePath + '.css') || fs.existsSync(resolvedResourcePath + '.scss'))) {
                done(new Error(url + ' can\'t be resolved'));
                return;
            }
            done({file: resolvedResourcePath});
            return;
        }
        done({ file: url });
    }
}

function transformResourceUrls(content) {
    return content.replace(/url\(['"]?resource:\/\/(.*)\/(Public|Private)\/(.*)['"]?\);?/g, (match, pack, type, path) => {
        if (type === 'Private') {
            throw new Error(match + ' cannot be imported, you can only use Public Resources in SCSS.')
        }

        return `url('/_Resources/Static/Packages/${pack}/${path}');`
    });
}

function rimraf(dir_path) {
    if (fs.existsSync(dir_path)) {
        fs.readdirSync(dir_path).forEach(entry => {
            const entry_path = path.join(dir_path, entry);
            if (fs.lstatSync(entry_path).isDirectory()) {
                rimraf(entry_path);
            } else {
                fs.unlinkSync(entry_path);
            }
        });
        fs.rmdirSync(dir_path);
    }
}

module.exports = {
    readYaml,
    replacePlaceholder,
    addToTaskGroups,
    touchFusionFile,
    scssFileImporterFactory,
    transformResourceUrls,
    rimraf
};
