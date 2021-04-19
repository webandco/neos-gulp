'use strict';

const gulp = require('gulp');
const sourceMaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const sass = require('gulp-sass');
const gcmq = require('gulp-group-css-media-queries');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const stripCssComments = require('gulp-strip-css-comments');
const modifyFile = require('gulp-modify-file');
const path = require('path');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const rename = require("gulp-rename");
const csstree = require('css-tree');
const fs = require('fs');
const { addToTaskGroups, touchFusionFile, scssFileImporterFactory, transformResourceUrls, asyncModifyFile } = require('../functions');

module.exports = function (opts) {
    if (!(opts.config.project && opts.config.project.styles && opts.config.project.styles.fusion && opts.config.project.styles.fusion.sources && !!opts.config.project.styles.fusion.tailwindConfig)) {
        return 'no-task';
    }

    addToTaskGroups(opts.groupedTasks, 'dist-css-tailwind-fusion', opts.config.taskPostfix);

    const includePaths = [opts.config.projectRoot];
    if (opts.config.project.styles.fusion.includePaths) {
        includePaths.push(...opts.config.project.styles.fusion.includePaths);
    }

    gulp.task('dist-css-tailwind-fusion' + opts.config.taskPostfix, function () {

        let dependencies;
        if (opts.config.project.styles.fusion.dependencies) {
            dependencies = opts.config.project.styles.fusion.dependencies.reduce((acc, cur) => {
                return acc + '@import "' + cur + '";\n';
            }, '');
        }

        return gulp.src(opts.config.project.styles.fusion.sources)
            .pipe(gulpif(opts.config.project.styles.options.sourceMaps, sourceMaps.init()))
            .pipe(modifyFile((content, p, file) => {
                return dependencies ? dependencies + content : content;
            }))
            .pipe(sass({
                includePaths: includePaths,
                importer: scssFileImporterFactory(opts.config)
            }).on('error', sass.logError))
            .pipe(asyncModifyFile(async (content, p, file) => {
                try {
                    await postcss([
                        tailwindcss(opts.config.project.styles.fusion.tailwindConfig)
                    ]).process(content, {from: undefined});
                } catch (e) {
                    console.error(`Error in file: ${file.path}`);
                    throw e;
                }

                const applyMap = {};

                const ast = csstree.parse(content);
                csstree.walk(ast, (node, item, list) => {
                    if (node.type === 'Rule' && node.block.children.some(i => i.type === 'Atrule' && i.name === 'apply')) {
                        const applies = node.block.children.filter(i => i.type === 'Atrule' && i.name === 'apply').toArray();

                        const applyMapKey = csstree.generate(node.prelude);
                        if (applyMap[applyMapKey]) {
                            applyMap[applyMapKey].push(...applies.map(a => csstree.generate(a.prelude)))
                        } else {
                            applyMap[applyMapKey] = applies.map(a => csstree.generate(a.prelude));
                        }
                        node.block.children = node.block.children.filter(i => !(i.type === 'Atrule' && i.name === 'apply'))
                    }
                });
                for (const key in applyMap) {
                    applyMap[key] = applyMap[key].join(' ');
                }

                const tailwindJson = path.join(opts.config.paths.dist.styles, 'Fusion', file.relative.replace(/\.css/, '.tailwind.json'));
                fs.writeFileSync(tailwindJson, JSON.stringify(applyMap, null, 2));

                return csstree.generate(ast);
            }))
            .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
            .pipe(gcmq())
            .pipe(cleanCSS({
                level: {
                    2: {
                        removeDuplicateRules: true,
                        mergeSemantically: true
                    }
                },
                inline: false
            }))
            .pipe(stripCssComments(opts.config.project.styles.options.stripCssComments))
            .pipe(modifyFile((content, p, file) => {
                return transformResourceUrls(content);
            }))
            .pipe(touchFusionFile())
            .pipe(rename(p => {
                p.basename += '.tailwind';
                return p;
            }))
            .pipe(gulpif(opts.config.project.styles.options.sourceMaps, sourceMaps.write('./')))
            .pipe(gulp.dest(path.join(opts.config.paths.dist.styles, 'Fusion')));
    });
};
