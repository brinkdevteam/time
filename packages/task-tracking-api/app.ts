import * as express from 'express';
import * as path from 'path';
import api from './api';

const app = express();

app.use('/api', api, (req, res) => {
  // Anything falling through the API on that URI should be treated as
  // not found.
  res.status(404).json('404 Not Fount');
});

const buildDirPath = path.join(__dirname, 'build');
app.use(express.static(buildDirPath));

const indexPath = path.join(buildDirPath, 'index.html');
app.get('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.sendFile(indexPath, next);
}, (ex: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.send("I guess we'll never know who got rid of the cat video.");
});

export default app;
