// Ensure environment is configured before including anything else.
// import 'dotenv-byenv/config';

import * as express from 'express';
import app from './app';

const server = express();

server.use(app);

server.listen(3001);
