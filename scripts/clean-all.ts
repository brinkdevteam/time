import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import {
  forAllPackagesAsync,
} from './forward-to-packages';

forAllPackagesAsync(async info => {
  for (const pattern of [
    '**/*.js',
    '**/*.js.map',
  ]) {
    const packageCwd = path.resolve(__dirname, '..', info.packageDir);
    const files = await new Promise<string[]>((resolve, reject) => {
      glob(pattern, {
        cwd: packageCwd,
      }, (ex, result) => ex ? reject(ex) : resolve(result));
    });
    await Promise.all(files.filter(file => {
      // Skip ones in packages/*/node_modules/. Because we set cwd,
      // this will look relative to the package dir itself.
      if (file.indexOf('node_modules/') === 0) {
        return false;
      }
      return true;
    }).map(file => path.resolve(packageCwd, file)).map(file => {
      return new Promise<void>((resolve, reject) => {
        // tslint:disable-next-line:no-console
        console.log(`Removing “${file}”`);
        fs.unlink(file, ex => ex ? reject(ex) : resolve());
      });
    }));
  }
});
