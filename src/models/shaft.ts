import { ElevatorState } from "./elevator-state";

export interface Shaft {
  index: number;
  state: ElevatorState;
  currentFloorIndex: number;
  nextFloorIndex: number;
  position: number;
}
