// import {
//   TypeormStore,
// } from 'connect-typeorm';
// import {
//   NextFunction,
//   Request,
//   RequestHandler,
//   Response,
// } from 'express';
import * as express from 'express';
// import * as session from 'express-session';
// import {
//   Runtype,
//   Static,
// } from 'runtypes';
// import {
//   Writable,
// } from 'stream';
// import {
//   EntityManager,
// } from 'typeorm';
import dbPromise from './db';
// import Session from './entities/Session';
// import User from './entities/User';
// import transientObjectCache from './transient-object-cache';

export const managerPromise = (async () => {
  const db = await dbPromise;
  return db.createEntityManager();
})();

// THE FOLLOWING COMMENTED OUT IS COPY AND PASTED FROM GRIT LEADERSHIP'S express.ts

// function coalesce<T>(value: T|undefined, valueIfUndefined: T): T {
//   return value === undefined ? valueIfUndefined : value;
// }

// const userCache = transientObjectCache<{
//   value?: User;
// }>('reqUser');
// export async function getUserAsync(req: IRequestInfo) {
//   const userId = req.session.userId;
//   if (userId === undefined) {
//     return undefined;
//   }
//   {
//     const cachedUser = userCache.get(req);
//     if (cachedUser !== undefined
//         && cachedUser.value !== undefined
//        && cachedUser.value.id === userId) {
//       return cachedUser.value;
//     }
//   }
//   const user = await req.manager.findOne(User, userId);
//   userCache.set(req, {
//     value: user,
//   });
//   return user;
// }

// /**
//  * Gets user from request and asserts. You should have placed
//  * requireUser() in your express pipeline, this is just to skip the
//  * undefined check to make TypeScript happy.
//  */
// export async function requireUserAsync(req: IRequestInfo) {
//   const user = await getUserAsync(req);
//   if (user === undefined) {
//     throw new Error('User required.');
//   }
//   return user;
// }

// // Promise wrapper for express.
// type PromiseRequestHandler<T> = (req: Request, res: Response, next: NextFunction) => Promise<T>;
// function promiseHandler<T = void>(handlerAsync: PromiseRequestHandler<T>): RequestHandler {
//   return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
//     // Track if next() was called by intercepting it. This way, we can
//     // check if the Promise was resolved too early or not. The Promise
//     // should only be resolved if the handler fully handled the
//     // request *or* if it called next() to pass the buck.
//     let nextCalled = false;
//     let endCalled = false;
//     const replacedEnd = res.end;
//     // tslint:disable-next-line:ban-types
//     res.end = function (chunk?: string|Buffer|Function, encoding?: string|Function, callback?: Function) {
//       endCalled = true;
//       replacedEnd.call(this, chunk, encoding, callback);
//     };
//     try {
//       const response = await handlerAsync(req, res, ex => {
//         nextCalled = true;
//         next(ex);
//       });
//       if (response !== undefined) {
//         if (nextCalled || endCalled) {
//           throw new Error(`Handler ${coalesce<string>(handlerAsync.name, '«anonymous»')}() returned a value even though it had already called res.end() or next(). Did you return something from a handler unintentionally?`);
//         }
//         res.json(response);
//       }
//       // If we got here and the handler did not call next or did not
//       // call res.end(), that means it left the request hanging or
//       // that it is missing an await. To keep code clean, we require
//       // either condition or throw.
//       if (!nextCalled && !endCalled) {
//         throw new Error(`Handler ${coalesce<string>(handlerAsync.name, '«anonymous»')}() resolved prior to calling res.end() or next(). Did you forget an await or set up a pipe() without waiting for its end event?`);
//       }
//     } catch (ex) {
//       next(ex);
//     }
//   };
// }

// // ts
// interface IQueryShape {
//   [key: string]: IQueryShape|string|undefined;
// }

// // Typed session and promise wrapper for express.
// export interface IRequestInfo {
//   body?: {};
//   headers: {};
//   manager: EntityManager;
//   params: {
//     [key: string]: string|undefined,
//   };
//   query: IQueryShape;
//   session: Express.Session & {
//     userId?: number,
//   };
//   get(name: 'set-cookie'): string[]|undefined;
//   get(name: string): string|undefined;
//   onClose(cb: () => void): void;
//   pipe<T extends Writable>(stream: T): T;
// }

// type PromiseSessionRequestHandler<TResult> = (req: IRequestInfo, res: Response, next: NextFunction) => Promise<TResult>;

// type TypedPromiseSessionRequestHandler<T extends Runtype, TResult> = (body: Static<T>, req: IRequestInfo, res: Response, next: NextFunction) => Promise<TResult>;

// function isRequestInfo(info: any): info is IRequestInfo {
//   return !!info.session
//     && !!info.manager;
// }

// export function sessionPromiseHandler<TResult = void>(handlerAsync: PromiseSessionRequestHandler<TResult>): RequestHandler {
//   return promiseHandler(async (req, res, next) => {
//     // ugly haxx :'(
//     (req as any).manager = await managerPromise;
//     if (!isRequestInfo(req)) {
//       throw new Error(`Request object isn’t IRequestInfo.`);
//     }
//     return await handlerAsync(req, res, next);
//   });
// }

// export function typedSessionPromiseHandler<T extends Runtype, TResult = void>(runType: T, handlerAsync: TypedPromiseSessionRequestHandler<T, TResult>): RequestHandler {
//   return sessionPromiseHandler(async (req, res, next) => {
//     if (runType.guard(req.body)) {
//       return await handlerAsync(req.body, req, res, next);
//     } else {
//       res.sendStatus(400);
//     }
//   });
// }

const api = express();

// const sessionSecret = process.env.SESSION_SECRET;
// if (sessionSecret === '' || sessionSecret === undefined) {
//   throw new Error('SESSION_SECRET must be specified in the environment or via .env(.*) files.');
// }
// const typeormSessionStore = new TypeormStore();
// // Have to wait for typeorm and session to be initialized prior to
// // letting the first request try to access sessions.
// const sessionStoreInitialized = managerPromise.then(manager => {
//   typeormSessionStore.connect(manager.connection.getRepository(Session));
// });
// api.use((req, res, next) => sessionStoreInitialized.then(next, next));
// api.use(session({
//   resave: false,
//   saveUninitialized: false,
//   secret: sessionSecret,
//   store: typeormSessionStore,
// }));

// api.use(express.json());

// api.use((req, res, next) => {
//   // By default use Cache-Control: max-age=0. APIs whose responses
//   // should be cached should be marked explicitly.
//   res.set('Cache-Control', 'max-age=0');
//   next();
// });

export default api;
