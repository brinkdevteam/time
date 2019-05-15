// import {
//     NextFunction,
//     Request,
//     RequestHandler,
//     Response,
//   } from 'express';
// tslint:disable-next-line: ordered-imports
import axios from 'axios';
import delay from 'promise-delay-ts';

// import * as session from 'express-session';
// import User from '../../entities/User';
import dbPromise from './../../db';

// import EventSourceProvideType from '../../entities/EventSourceProvideType.entity';
import { stringify } from 'circular-json';
import * as express from 'express';
import Source from "../../entities/Source.entity";
const qs = require('qs');
import { format } from 'date-fns';
import { isArray } from 'util';
import Task from '../system/entities/Task.entity';
import TaskType from '../system/entities/TaskType.entity';
import { promiseHandler } from './../../express';

// Module relies on the system module being enabled providing parent types: task, project

const withings = express();

const managerPromise = (async () => {
 const db = await dbPromise;
 return db.createEntityManager();
})();

//
// Authentication
//
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
    await manager.save(Source, {
      name: "Withings",
      userId: 1,
      // tslint:disable-next-line: object-literal-sort-keys
      authToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      tokenExpireTimestamp: (Date.now() + response.data.expires_in * 1000).toString(),
    });
    res.redirect('/');
  })
  .catch(
    (err: any) => {
      res.json({message: 'Account already exists or the request failed for another reason.'});
// tslint:disable-next-line: no-console
      console.log(stringify(err));
    });
}));

const checkAuthorization = promiseHandler(async (req, res, next) => {
  // look for withings provider in database
  const manager = await managerPromise;
  const eventSource = await manager.findOne(Source, {name: 'Withings'});
  if (eventSource !== undefined) {
    // tslint:disable-next-line: no-console
    console.log('1');
    if (parseInt(eventSource.tokenExpireTimestamp, 10) < Date.now() ) {
      // refresh token
      try {
        const data = {
          client_id: withingsConfig.client_id,
          client_secret: withingsConfig.client_secret,
          grant_type: 'refresh_token',
          refresh_token: eventSource.refreshToken,
        };
        const response = await axios({
          method: "POST",
          // tslint:disable-next-line: object-literal-sort-keys
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          data: qs.stringify(data),
          url: 'https://account.withings.com/oauth2/token',
        });
        await manager.update(Source, { name: 'Withings', userId: 1}, {
          authToken: response.data.access_token,
          refreshToken: response.data.refresh_token,
          tokenExpireTimestamp: (Date.now() + response.data.expires_in * 1000).toString(),
        });
        next();
        return;
      } catch (ex) {
        // try reseting Withings auth and refresh token in database
        await manager.update(Source, {name: 'Withings'}, {authToken: "", refreshToken: ""});
        res.redirect('/api/module/withings/auth');
      }
    }
  }
  res.redirect('/api/module/withings/auth');
  // no withings in db => redirect res to /withings/auth/
    // check if token needs to be refreshed
});

//
// Get Sleep
// check if sleep data exists as events in db, if not, retrieve as far back as possible. If so, only retrieve from last timestamp date.
//
withings.get('/withings/sleep', checkAuthorization, promiseHandler(async (req, res) => {
  // tslint:disable-next-line: no-console
  console.log('1');
  const manager = await managerPromise;
  // tslint:disable-next-line: no-console
  console.log('0');
  const withingsSleepTaskType = await manager.findOne(TaskType, { name: 'withingsSleepTask'});
  // tslint:disable-next-line: no-console
  console.log('10');
  const withingsSource = await manager.findOne(Source, { name: 'Withings', userId: 1 });
  // tslint:disable-next-line: no-console
  console.log('12');
  if (withingsSource === undefined) { res.sendStatus(500); return; }
  // tslint:disable-next-line: no-console
  console.log('11');
  if (withingsSleepTaskType === undefined) { res.sendStatus(500); return; }
  // tslint:disable-next-line: no-console
  console.log('111');
  const withingsSleepTaskTypeId = withingsSleepTaskType.id;
  const event = await manager.findOne(Task, { type: withingsSleepTaskTypeId });
  // tslint:disable-next-line: no-console
  console.log('2');
  if (event === undefined) {
    // INITIAL SLEEP IMPORT
    // there are no withings sleep events in the database, retrieve events from withings as far back as possible
    const response = await axios({
      method: "POST",
      // tslint:disable-next-line: object-literal-sort-keys
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify({
        access_token: withingsSource.authToken,
        startdateymd: '2000-01-01',
        // tslint:disable-next-line: object-literal-sort-keys
        enddateymd: format(new Date(), 'YYYY-MM-DD'),
        data_fields: "durationtosleep",
      }),
      url: 'https://wbsapi.withings.net/v2/sleep?action=getsummary',
    });
    // tslint:disable-next-line: no-console
    if (!isArray(response.data.body.series)) { return console.log(stringify(response)); }
    // tslint:disable-next-line: no-console
    console.log('3');
    for (const newEvent of response.data.body.series) {
      await manager.save(Task, {
        startDate: newEvent.startdate,
        // tslint:disable-next-line: object-literal-sort-keys
        endDate: newEvent.enddate,
        type: withingsSleepTaskTypeId,
      });
    }
  }
  // a SLEEP EVENT was found, request new sleep from last received sleep event
  // tslint:disable-next-line: no-console
  console.log('Sleep events found. Uncomment code below this log message to implement fetching new sleep ');
  // tslint:disable-next-line: no-console
  // await axios({
  //   method: "POST",
  //   // tslint:disable-next-line: object-literal-sort-keys
  //   headers: { 'content-type': 'application/x-www-form-urlencoded' },
  //   data: qs.stringify({
  //     access_token: withingsSource.authToken,
  //     lastupdate: __GET_LATEST_SLEEP_TIME_FROM_DATABASE__,
  //     // tslint:disable-next-line: object-literal-sort-keys
  //     data_fields: "durationtosleep",
  //   }),
  //   url: 'https://wbsapi.withings.net/v2/sleep?action=getsummary',
  // })
  res.json('hey');
}));

export default withings;

void (async () => {
  // tslint:disable-next-line: no-console
  console.log(new Date());
  while (true) {
    await delay(1000 * 60 * 60);
    // tslint:disable-next-line: no-console
    console.log(new Date());
    await axios.get('http://alb83.com/api/module/withings/sleep');
  }
})();
