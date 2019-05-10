"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runtypes_1 = require("runtypes");
//
// Event Definitions
//
exports.ITaskEvent = runtypes_1.Record({
    name: runtypes_1.String,
    startTime: runtypes_1.Number,
    // tslint:disable-next-line: object-literal-sort-keys
    endTime: runtypes_1.Number,
    taskId: runtypes_1.Number,
    projectId: runtypes_1.Number,
    goalId: runtypes_1.Number,
    vauleId: runtypes_1.Number,
});
//
// Definitions for Module-Created Entities
//
