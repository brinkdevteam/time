import {
  Number,
  Partial,
  Record,
  Static,
  String,
} from 'runtypes';

//
// Event Definitions
//
export const ITaskEvent = Record({
  endTime: Number,
  name: String,
  startTime: Number,
  taskId: Number,
}).And(Partial({
  goalId: Number,
  projectId: Number,
  vauleId: Number,
}));

export default interface ITaskEventData extends Static<typeof ITaskEvent> {
}

//
// Definitions for Module-Created Entities
//