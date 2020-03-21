'use strict';

const gulp = require('gulp');
const log = require('fancy-log');
const colors = require('ansi-colors');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const sourceMaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const modifyFile = require('gulp-modify-file');
const { paramCase } = require('change-case');
const { addToTaskGroups } = require('../functions');
const path = require('path');

module.exports = function (opts) {
    if (!(opts.config.project.scripts && opts.config.project.scripts.fusion && opts.config.project.scripts.fusion.sources)) {
        return 'no-task';
    }

    addToTaskGroups(opts.groupedTasks, 'dist-js-fusion', opts.config.taskPostfix);

    gulp.task('dist-js-fusion' + opts.config.taskPostfix, function () {

        return gulp.src(opts.config.project.scripts.fusion.sources)
            .pipe(gulpif(opts.config.project.scripts.options.sourceMaps, sourceMaps.init()))
            .pipe(modifyFile((content, filePath, file) => {
                let className = content.match(/(?<!\/\/\s)const\sclassName\s?=\s?("|')([A-Za-z-]+)("|');/);
                if (!className) {
                    const dirname = path.dirname(filePath);
                    if (dirname.endsWith('Section')) {
                        className = 'section-' + paramCase(path.basename(filePath).replace('.js', ''));
                    }
                } else {
                    className = className[2];
                }

                if (!className) {
                    log.error(colors.red('Error: ' + filePath + '   class name could not be automatically resolved. Please specify it as "const className = "className";'));
                }

                return `document.querySelectorAll('.${className}').forEach(__node__ => { ${content} main(__node__)})`;
            }))
            .pipe(babel({
                presets: ['@babel/env']
            }))
            .pipe(gulpif(opts.config.project.scripts.options.minify, terser()))
            .pipe(gulpif(opts.config.project.scripts.options.sourceMaps, sourceMaps.write('./')))
            .pipe(gulp.dest(opts.config.paths.dist.scripts));
    });
};
