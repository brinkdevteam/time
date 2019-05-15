import {
  Number,
  Record,
  Static,
  Union,
} from 'runtypes';

import { ITaskEvent } from '../../system/models/task';

//
// Event Definitions
//
const IWithingsSleep = Record({
  durationtosleep: Number,
});

export const IWithingsSleepTask = Union(ITaskEvent, IWithingsSleep);

export default interface IWithingsSleepTask extends Static<typeof IWithingsSleepTask> {
}
