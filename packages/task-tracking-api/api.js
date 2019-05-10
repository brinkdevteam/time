"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import {
//     NextFunction,
//     Request,
//     RequestHandler,
//     Response,
//   } from 'express';
const EventSource_entity_1 = require("./entities/EventSource.entity");
const EventSourceProvideType_entity_1 = require("./entities/EventSourceProvideType.entity");
const express_1 = require("./express");
const modules_1 = require("./modules");
// import * as session from 'express-session';
express_1.default.route('/task').get(async (req, res) => {
    const manager = await express_1.managerPromise;
    // Find all event sources which provide tasks
    await manager.find(EventSourceProvideType_entity_1.default, {});
    // eventId = event_type = "task" or parent is "task"
});
express_1.default.use('/module', modules_1.default);
const nameObject = Object.assign({}, modules_1.default);
// tslint:disable-next-line: no-shadowed-variable
const getVarNameFromObject = (nameObject) => {
    // tslint:disable-next-line: forin
    for (const varName in nameObject) {
        return varName;
    }
};
let varName = getVarNameFromObject(nameObject);
// tslint:disable-next-line: no-console
console.log('hi' + varName);
// Run on server start
void (async () => {
    const manager = await express_1.managerPromise;
    await manager.save(EventSource_entity_1.default, { name: "system" });
})();
exports.default = express_1.default;
