// import {
//     NextFunction,
//     Request,
//     RequestHandler,
//     Response,
//   } from 'express';
import EventSourceProvideType from './entities/EventSourceProvideType.entity';
import api, {
    managerPromise,
    promiseHandler,
  } from './express';
import modules from './modules';
// import * as session from 'express-session';

api.route('/task').get(promiseHandler(async (res: any, req: any) => {
    const manager = await managerPromise;
    // Find all event sources which provide tasks
    await manager.find(EventSourceProvideType, {});
    // eventId = event_type = "task" or parent is "task"
}));

api.use('/module', modules);

// Run on server start
// void (async () => {
//     const manager = await managerPromise;
// // tslint:disable-next-line: no-console
//     await manager.save(EventSource, { name: 'hello', authToken: "system-1" }).catch(err => console.log('aaaahhhhh' + err));
// // tslint:disable-next-line: no-console
//   })().catch(err => console.log('error!' + err) );
export default api;
