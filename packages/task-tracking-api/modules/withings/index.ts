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
import { stringify } from 'circular-json';
import * as express from 'express';
import EventSource from "../../entities/EventSource.entity";
const qs = require('qs');
import { format } from 'date-fns';
import { isArray } from 'util';
import Event from '../../entities/Event.entity';
import EventType from '../../entities/EventType.entity';
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
    await manager.save(EventSource, {
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
  const eventSource = await manager.findOne(EventSource, {name: 'Withings'});
  if (eventSource !== undefined) {
    // tslint:disable-next-line: no-console
    console.log('1');
    if (parseInt(eventSource.tokenExpireTimestamp, 10) < Date.now() ) {
      // refresh token
      const response = await axios({
        method: "POST",
        // tslint:disable-next-line: object-literal-sort-keys
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          grant_type: 'refresh_token',
          // tslint:disable-next-line: object-literal-sort-keys
          client_id: withingsConfig.client_id,
          client_secret: withingsConfig.client_secret,
          refresh_token: eventSource.refreshToken,
        },
        url: 'https://account.withings.com/oauth2/token',
      });
      await manager.update(EventSource, { name: 'Withings', userId: 1}, {
        authToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        tokenExpireTimestamp: (Date.now() + response.data.expires_in * 1000).toString(),
      });
      next();
      return;
    }
  }
  res.redirect('/get/a/token/person');
  // no withings in db => redirect res to /withings/auth/
    // check if token needs to be refreshed
});

//
// Get Sleep
// check if sleep data exists as events in db, if not, retrieve as far back as possible. If so, only retrieve from last timestamp date.
//
withings.get('/withings/sleep', checkAuthorization, promiseHandler(async (req, res) => {
  const manager = await managerPromise;
  const withingsSleepTaskType = await manager.findOne(EventType, { name: 'withingsSleepTask'});
  const withingsSource = await manager.findOne(EventSource, { name: 'Withings', userId: 1 });
  if (withingsSource === undefined) { res.sendStatus(500); return; }
  if (withingsSleepTaskType === undefined) { res.sendStatus(500); return; }
  const withingsSleepTaskTypeId = withingsSleepTaskType.id;
  const event = await manager.findOne(Event, { type: withingsSleepTaskTypeId });
  if (event === undefined) {

      // a SLEEP EVENT was found, request new sleep from last received sleep event
    // tslint:disable-next-line: no-console
    console.log('Sleep events found. Uncomment code below this log message to implement fetching new sleep ');
    // tslint:disable-next-line: no-console
    // await manager.query("SELECT data FROM Event WHERE data ->> 'startTime' > 0 ORDER BY data->>'startTime' ASC ").then((ress: any) => console.log(stringify(ress)));
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
    console.log('5');
    // tslint:disable-next-line: no-console
    if (!isArray(response.data.body.series)) { return console.log(stringify(response)); }
    // tslint:disable-next-line: no-console
    console.log('6');
    // TODO: NOT ACIDic!!!!!! (i.e., partial commit possible, not transactional)
    for (const newEvent of response.data.body.series) {
      await manager.save(Event, {
        data: {
          endTime: newEvent.enddate,
          startTime: newEvent.startdate,
        },
        sourceId: withingsSource.id,
        type: withingsSleepTaskTypeId,
      });
    }
    // tslint:disable-next-line: no-console
    console.log('7');
  // tslint:disable-next-line: no-console
  }
  res.json('hey');
}));

// use nathan's looper thing

export default withings;
