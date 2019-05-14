// import {
//     NextFunction,
//     Request,
//     RequestHandler,
//     Response,
//   } from 'express';
import * as express from 'express';
// tslint:disable-next-line: ordered-imports
import axios from 'axios';
import { promiseHandler } from './../../express';
// import * as session from 'express-session';
// import User from '../../entities/User';
// import dbPromise from './../../db';
// import EventSource from "../../entities/EventSource.entity";
// import EventSourceProvideType from '../../entities/EventSourceProvideType.entity';
// import EventType from '../../entities/EventType.entity';

// Module relies on the system module being enabled providing parent types: task, project

const withings = express();

// const managerPromise = (async () => {
//  const db = await dbPromise;
//  return db.createEntityManager();
// })();
withings.get('/withings/auth', promiseHandler<any>(async (req, res) => {
    // placeholder
    return 'hi';
}));

withings.get('/withings/auth/callback', promiseHandler(async (req, res) => {
  // use authentication code to get access token
  await axios({ data: {
                  client_id: "05094ce5e64c11ab4fe03f0c699d3bb9fbc41d6c52f4b62d932b619934216889",
                  client_secret: "27fa89e546ecf9def7bb6b79daa94369f84b06d0919a1741bdf2fda2f590ce24",
                  code: req.query.code,
                  grant_type: 'authorization_code',
                  redirect_uri: "https://alb83.com/api/module/withings/auth/callback",
                },
                headers: {},
                method: 'post',
                url: 'https://account.withings.com/oauth2/token',
              }).then( (response: any) => {
    res.json('hi');
    // tslint:disable-next-line: no-console
    console.log(JSON.stringify(response));
  })
  .catch(
    (err: any) => {
      res.json('no!!');
// tslint:disable-next-line: no-console
      console.log(err);
    });
}));

export default withings;
