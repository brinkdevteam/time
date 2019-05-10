"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import {
//     NextFunction,
//     Request,
//     RequestHandler,
//     Response,
//   } from 'express';
const axios_1 = require("axios");
const express = require("express");
// import * as session from 'express-session';
const passport = require("passport");
// import User from '../../entities/User';
const db_1 = require("./../../db");
const GitLabStrategy = require('passport-gitlab2');
const EventSource_entity_1 = require("../../entities/EventSource.entity");
// import EventSourceProvideType from '../../entities/EventSourceProvideType.entity';
// import EventType from '../../entities/EventType.entity';
// Module relies on the system module being enabled providing parent types: task, project
const gitlab = express();
const managerPromise = (async () => {
    const db = await db_1.default;
    return db.createEntityManager();
})();
//
// Initialize Module (called after user authorization)
//
gitlab.route('/gitlab/initialize').get(async (req, res) => {
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
//
// AUTHENTICATION
//
passport.use(new GitLabStrategy({
    clientID: "86787d7ff26408e601d436e96bfb6d9f03d595aa6a95524c0cf4f2e254a7360b",
    clientSecret: "049efcf29ea4bb595fb91a7c7b062ef376d1de8ad39a85199d9d89f4abcdb4e4",
    // tslint:disable-next-line: object-literal-sort-keys
    callbackURL: "http://localhost:3001/api/module/gitlab/auth/callback",
    baseURL: "https://gitlab.brinkdevelopmentllc.com/",
    scope: ['api'],
}, async (token, tokenSecret, profile, cb) => {
    // tslint:disable-next-line: no-console
    console.log("Token" + token);
    const manager = await managerPromise;
    await manager.save(EventSource_entity_1.default, { name: "Gitlab", authToken: token, userId: 1 });
    // tslint:disable-next-line: no-unused-expression
    cb(null, tokenSecret);
}));
gitlab.get('/gitlab/auth', passport.authorize('gitlab'));
gitlab.get('/gitlab/auth/callback', passport.authorize('gitlab', { failureRedirect: '/account' }), (req, res) => {
    // tslint:disable-next-line: no-console
    console.log("hihihihi");
    // tslint:disable-next-line: no-console
    console.log(JSON.stringify(req.user));
    res.redirect('/api/module/gitlab/initialize');
});
//
// Tasks API
//
gitlab.route('/gitlab/task/').get(async (req, res) => {
    const manager = await managerPromise;
    const source = await manager.findOneOrFail(EventSource_entity_1.default, { name: "Gitlab", userId: 1 });
    axios_1.default.get('https://gitlab.brinkdevelopmentllc.com/api/v4/issues', {
        headers: {
            Authorization: `Bearer ${source.authToken}`,
        },
        validateStatus: status => status >= 200 && status < 400,
    }).then(result => {
        res.json({ task: result });
        // tslint:disable-next-line: no-console
    }).catch(err => console.log('error!' + err));
});
//
// Provide source (push, commits)
//
// api.post('/login/google/callback', typedSessionPromiseHandler(LoginCallbackRequestRuntype, async (body, req, res): Promise<ILoginCallbackResponse> => {
//   const {
//     tokens,
//   } = await googleOAuth2Client.getToken(body.code);
//   if (tokens.id_token === null || tokens.id_token === undefined) {
//     res.status(400);
//     return {
//       user: {
//       },
//     };
//   }
// AXIOS-------------------
// axios.get('https://www.googleapis.com/userinfo/v2/me', {
//     headers: {
//       'Authorization': `Bearer ${accessToken}`
//     },
//     validateStatus: status => status >= 200 && status < 400
//   }).then(result => {
//     // Require there to either be one or a defined primary email.
//     const email = loginInfo.email;
//     done(null, {
//       avatarUrl: result.data.picture,
//       email: email,
//       locale: result.data.locale,
//       fullName: result.data.name,
//       provider: 'google'
//     });
//   }).catch(done);
// }));
exports.default = gitlab;
