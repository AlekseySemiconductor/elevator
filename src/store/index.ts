import { createStore } from "vuex";
import { ElevatorState } from "@/models/elevator-state";
import { Floor } from "@/models/floor";
import range from "lodash/range";

const initialFloorsCount = 7; // количество этажей
const initialShaftsCount = 4; // количество лифтовых шахт (лифтов)
const initialFloorIndex = 1; // todo: вынести либо в environment, либо в input формы
const pendingTime = 3000;

export default createStore({
  state: {
    shafts: range(initialShaftsCount).map((x, i) => createShaft(i)),
    floorsCount: initialFloorsCount,
    floors: range(initialFloorsCount).map((x) =>
      createFloor(initialFloorsCount - x)
    ),
    pendingFloors: [] as number[],
  },
  getters: {},
  mutations: {
    callElevator(state, nextFloorIndex: number) {
      const isFloorBusy = state.shafts.some(
        (x) => x.currentFloorIndex === nextFloorIndex
      );
      if (isFloorBusy) {
        return;
      }

      state.floors.find((x) => x.index === nextFloorIndex)!.isActive = true;

      const freeElevator = state.shafts.find(
        (x) => x.state === ElevatorState.Free
      );
      if (freeElevator) {
        freeElevator.isUpDirection =
          nextFloorIndex > freeElevator.currentFloorIndex;
        freeElevator.currentFloorIndex = nextFloorIndex;
        freeElevator.state = ElevatorState.Moving;
        return;
      }

      state.pendingFloors.push(nextFloorIndex);
    },
    startPendingElevator(state, { nextFloorIndex, shaftIndex }) {
      state.shafts[shaftIndex].state = ElevatorState.Pending;
      state.floors.find((x: Floor) => x.index === nextFloorIndex)!.isActive =
        false;
    },
    stopPendingElevator(state, shaftIndex: number) {
      state.shafts[shaftIndex].state = ElevatorState.Free;
    },
    addFloor(state) {
      state.floorsCount += 1;
      state.floors.unshift(createFloor(state.floorsCount));
    },
    addShaft(state) {
      state.shafts.push(createShaft(state.shafts.length));
    },
  },
  actions: {
    stopMoving(context, { nextFloorIndex, shaftIndex }) {
      context.commit("startPendingElevator", {
        shaftIndex,
        nextFloorIndex,
      });

      setTimeout(() => {
        context.commit("stopPendingElevator", shaftIndex);
        const pendingShaft = context.state.pendingFloors.shift();
        if (pendingShaft) {
          context.commit("callElevator", pendingShaft);
        }
      }, pendingTime);
    },
  },
  modules: {},
});

function createShaft(index: number) {
  return {
    index,
    state: ElevatorState.Free,
    currentFloorIndex: initialFloorIndex,
    isUpDirection: false,
  };
}

function createFloor(index: number) {
  return {
    index,
    isActive: false,
  };
}
