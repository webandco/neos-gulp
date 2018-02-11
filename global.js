"use strict";

// const FUNCTIONS = require("./functions");

const LIBRARIES = {
    autoprefixer: 'gulp-autoprefixer',
    cleanCSS: 'gulp-clean-css',
    cache: 'gulp-cached',
    concat: 'gulp-concat',
	// connect: 'gulp-connect',
    fs: 'fs',
	gcmq: 'gulp-group-css-media-queries',
    gulp: 'gulp',
    gulpUtil: 'gulp-util',
    isThere: 'is-there',
    jshint: 'gulp-jshint',
    jsHintStylish: 'jshint-stylish',
    lint:'gulp-scss-lint',
    lintStylish: 'gulp-scss-lint-stylish',
	path: 'path',
	// plumber: 'gulp-plumber',
    readDir: 'readdir',
    realFavicon: 'gulp-real-favicon',
	rename: 'gulp-rename',
	replace: 'gulp-replace',
	sass: 'gulp-sass',
	stripCssComments: 'gulp-strip-css-comments',
	sourceMaps: 'gulp-sourcemaps',
    taskGroups: './task/task-groups',
    uglify: 'gulp-uglify',
    yaml: 'js-yaml'
};

for (let key in LIBRARIES) {
    global[key] = require(LIBRARIES[key]);
}
