// import {
//     NextFunction,
//     Request,
//     RequestHandler,
//     Response,
//   } from 'express';
import * as express from 'express';
// tslint:disable-next-line: ordered-imports
import axios from 'axios';
// import * as session from 'express-session';
// import User from '../../entities/User';
import dbPromise from './../../db';
import EventSource from "../../entities/EventSource.entity";
// import EventSourceProvideType from '../../entities/EventSourceProvideType.entity';
// import EventType from '../../entities/EventType.entity';

// Module relies on the system module being enabled providing parent types: task, project

const withings = express();

const managerPromise = (async () => {
 const db = await dbPromise;
 return db.createEntityManager();
})();

//
// Initialize Module (called after user authorization)
//
withings.route('/gitlab/initialize').get(async (req: any, res: any) => {
  // const manager = await managerPromise;
  // const gitlabSource = await manager.findOne(EventSource, {name: 'gitlab'});
  // const gitlabSourceId = gitlabSource !== undefined ? gitlabSource.id : 0;
  // const systemTask = await manager.findOne(EventType, {name: 'task'});
  // const taskTypeParentId = systemTask !== undefined ? systemTask.id : 0;

  // const project = await manager.findOne(EventType, {name: 'project'});
  // const projectTypeParentId = project !== undefined ? project.id : 0;
  // Add Gitlab event types to database
  // const gitlabTaskType = await manager.save(EventType, {name: 'gitlab-task', parentId: taskTypeParentId});
  // const gitlabProjectType = await manager.save(EventType, {name: 'gitlab-project', parentId: projectTypeParentId});
  // Associate Gitlab event types
  // await manager.save(EventSourceProvideType, {sourceId: gitlabSourceId, eventTypeId: gitlabTaskType.id});
  // await manager.save(EventSourceProvideType, {sourceId: gitlabSourceId, eventTypeId: gitlabProjectType.id});
});

withings.get('/withings/auth',
  
);

withings.get('/withings/auth/callback', (res: any, req: any) => {
// tslint:disable-next-line: no-console
  console.log(req.params);
  // use authentication code to get access token
  axios.post('https://account.withings.com/oauth2/token', {
    client_id: "05094ce5e64c11ab4fe03f0c699d3bb9fbc41d6c52f4b62d932b619934216889",
    client_secret: "27fa89e546ecf9def7bb6b79daa94369f84b06d0919a1741bdf2fda2f590ce24",
    code: req.params.code,
    grant_type: "authorization_code",
    redirect_uri: "http://alb83.com/api/module/withings/auth/callback"
  });
});

export default withings;
