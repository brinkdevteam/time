// import {
//     NextFunction,
//     Request,
//     RequestHandler,
//     Response,
//   } from 'express';
import EventSource from "./entities/EventSource.entity";
import EventSourceProvideType from './entities/EventSourceProvideType.entity';
import api, {
    managerPromise,
  } from './express';
import modules from './modules';
// import * as session from 'express-session';

api.route('/task').get(async (req, res) => {
    const manager = await managerPromise;
    // Find all event sources which provide tasks
    await manager.find(EventSourceProvideType, {});
    // eventId = event_type = "task" or parent is "task"
});

api.use('/module', modules);

const nameObject = {...modules};
// tslint:disable-next-line: no-shadowed-variable
const getVarNameFromObject = (nameObject: any) => {
// tslint:disable-next-line: forin
  for (const varName in nameObject) {
    return varName;
  }
}
let varName = getVarNameFromObject(nameObject);
// tslint:disable-next-line: no-console
console.log('hi' + varName);
// Run on server start
void (async () => {
    const manager = await managerPromise;
    await manager.save(EventSource, { name: "system"});
  })();
export default api;
