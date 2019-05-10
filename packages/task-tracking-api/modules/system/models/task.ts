import {
  Number,
  Record,
  Static,
  String,
} from 'runtypes';

//
// Event Definitions
//
export const ITaskEvent = Record({
  name: String,
  startTime: Number,
  // tslint:disable-next-line: object-literal-sort-keys
  endTime: Number,
  taskId: Number,
  projectId: Number,
  goalId: Number,
  vauleId: Number,
});

export default interface ITaskEventData extends Static<typeof ITaskEvent> {
}

//
// Definitions for Module-Created Entities
//