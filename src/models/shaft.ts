import { ElevatorState } from "./elevator-state";

export interface Shaft {
  index: number;
  state: ElevatorState;
  currentFloorIndex: number;
  isUpDirection: boolean;
  position: number;
}
