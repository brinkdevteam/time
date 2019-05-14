// import {
//     NextFunction,
//     Request,
//     RequestHandler,
//     Response,
//   } from 'express';
// tslint:disable-next-line: ordered-imports
import axios from 'axios';
// import * as session from 'express-session';
// import User from '../../entities/User';
import dbPromise from './../../db';

// import EventSourceProvideType from '../../entities/EventSourceProvideType.entity';
// import EventType from '../../entities/EventType.entity';
import { stringify } from 'circular-json';
import * as express from 'express';
import EventSource from "../../entities/EventSource.entity";
const qs = require('qs');
import { promiseHandler } from './../../express';

// Module relies on the system module being enabled providing parent types: task, project

const withings = express();

const managerPromise = (async () => {
 const db = await dbPromise;
 return db.createEntityManager();
})();

const withingsConfig = {
  client_id: "05094ce5e64c11ab4fe03f0c699d3bb9fbc41d6c52f4b62d932b619934216889",
  client_secret: "27fa89e546ecf9def7bb6b79daa94369f84b06d0919a1741bdf2fda2f590ce24",
  redirect_uri: "http://alb83.com/api/module/withings/auth/callback",
  scope: "user.metrics,user.activity",
};

withings.get('/withings/auth', promiseHandler<any>(async (req, res) => {
    res.redirect('https://account.withings.com/oauth2_user/authorize2?response_type=code&client_id=' + withingsConfig.client_id + '&state=hi&scope=' + withingsConfig.scope + '&redirect_uri=' + withingsConfig.redirect_uri);
}));

withings.get('/withings/auth/callback', promiseHandler(async (req, res) => {
  const data = {
    client_id: withingsConfig.client_id,
    client_secret: withingsConfig.client_secret,
    code: req.query.code,
    grant_type: 'authorization_code',
    redirect_uri: withingsConfig.redirect_uri,
  };
  // use authentication code to get access token
// tslint:disable-next-line: object-literal-sort-keys
  await axios({
    method: 'POST',
    // tslint:disable-next-line: object-literal-sort-keys
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data),
    url: 'https://account.withings.com/oauth2/token',
  }).then( async (response: any) => {
    const manager = await managerPromise;
    await manager.save(EventSource, {name: "Withings", userId: 1, authToken: response.data.access_token, refreshToken: response.data.refresh_token});
    res.redirect('/');
  })
  .catch(
    (err: any) => {
      res.json('no!!');
// tslint:disable-next-line: no-console
      console.log(stringify(err));
    });
}));

export default withings;
