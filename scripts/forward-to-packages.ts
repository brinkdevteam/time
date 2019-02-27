#!/usr/bin/env ts-node
import * as spawn from 'cross-spawn';
import * as fs from 'fs';
import * as path from 'path';

// Detect if we’re actually in a node stage right now.
const lifecycleEvent = (() => {
  const rawLifecycleEvent = process.env.npm_lifecycle_event;
  if (rawLifecycleEvent === undefined) {
    throw new Error(`This is meant to be run indirectly through npm run.`);
  }
  // We are likely to be called from post things so just strip that
  // from the beginning. Hrmmmm, is this the best place for this?
  return rawLifecycleEvent
    .replace(/^post/, '')
  ;
})();

const stageRequiresNpmRun = [
  'install',
  'test',
].indexOf(lifecycleEvent) === -1;

const npmArgs = stageRequiresNpmRun ? ['run', lifecycleEvent]
  : [lifecycleEvent];

function isDirAsync(dirPath: string) {
  return new Promise((resolve, reject) => {
    fs.stat(dirPath, (ex, stats) => {
      if (ex) {
        reject(ex);
      } else {
        resolve(stats.isDirectory());
      }
    });
  });
}

function readdirAsync(dirPath: string) {
  return new Promise<string[]>((resolve, reject) => {
    fs.readdir(dirPath, (ex, files) => {
      if (ex) {
        reject(ex);
      } else {
        resolve(files);
      }
    });
  });
}

function print(line: string) {
  // tslint:disable-next-line:no-console
  console.log(line);
}

if (require.main === module) {
  forAllPackagesAsync(async info => {
    const exitCode = await new Promise<number>((resolve, reject) => {
      print(`Running: npm ${npmArgs.map(arg => JSON.stringify(arg)).join(' ')}`);
      spawn('npm', npmArgs, {
        cwd: path.resolve(info.packageDir),
        stdio: 'inherit',
      })
        .on('close', resolve)
        .on('error', reject)
      ;
    });
    if (exitCode !== 0) {
      print(`Process exited with code ${exitCode}`);
      process.exitCode = exitCode;
      info.preventContinue();
    }
  });
}

export async function forAllPackagesAsync(actionAsync: (info: {
  packageDir: string;
  preventContinue: () => void;
}) => Promise<void>) {
  try {
    const files = await readdirAsync('packages');
    // Sort by having the work “shared” in it (packages used by
    // others should be installed first). Then by alphabets
    // (detemrinism is nice).
    files.sort((a, b) => {
      {
        const [aHasShared, bHasShared] = [a, b].map(s => /shared$/.test(s));
        if (aHasShared !== bHasShared) {
          return aHasShared ? -1 : 1;
        }
      }
      return a < b ? -1
        : a > b ? 1
        : 0;
    });
    for (const packageName of files) {
      const relativePackagePath = path.join('packages', packageName);
      if (!await isDirAsync(relativePackagePath)) {
        continue;
      }
      print('');
      print(`Package: ${packageName}`);
      print('');
      let shouldContinue = true;
      await actionAsync({
        packageDir: relativePackagePath,
        preventContinue: () => {
          shouldContinue = false;
        },
      });
      if (!shouldContinue) {
        break;
      }
    }
  } catch (ex) {
    print(ex);
    process.exitCode = 1;
  }
}
