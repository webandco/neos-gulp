'use strict';

module.exports = function (groups, task, postfix) {
    if (undefined === groups[task]) {
         groups[task] = [];
    }
    groups[task].push(task + postfix);
};