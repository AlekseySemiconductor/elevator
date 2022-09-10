import { createStore } from "vuex";
import { ElevatorState } from "@/models/elevator-state";
import { Floor } from "@/models/floor";
import { Shaft } from "@/models/shaft";
import range from "lodash/range";

const initialFloorsCount = 7; // количество этажей
const initialShaftsCount = 4; // количество лифтовых шахт (лифтов)
const initialFloorIndex = 1; // todo: вынести либо в environment, либо в input формы
const pendingTime = 3000;

const store = createStore({
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
    initialiseStore(state) {
      if (localStorage.getItem("store")) {
        this.replaceState(
          Object.assign(state, JSON.parse(localStorage.getItem("store")!))
        );
      }
    },
    callElevator(state, nextFloorIndex: number) {
      const isFloorBusy = state.shafts.some(
        (x) => x.currentFloorIndex === nextFloorIndex
      );
      if (isFloorBusy) {
        return;
      }

      state.floors.find((x) => x.index === nextFloorIndex)!.isActive = true;

      const nearestFreeElevator = getNearestFreeElevatorIndex(
        nextFloorIndex,
        state.shafts
      );
      if (nearestFreeElevator) {
        nearestFreeElevator.isUpDirection =
          nextFloorIndex > nearestFreeElevator.currentFloorIndex;
        nearestFreeElevator.currentFloorIndex = nextFloorIndex;
        nearestFreeElevator.state = ElevatorState.Moving;
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

store.subscribe((mutation, state) => {
  localStorage.setItem("store", JSON.stringify(state));
});

export default store;

function createShaft(index: number): Shaft {
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

function getNearestFreeElevatorIndex(
  nextFloorIndex: number,
  shafts: Shaft[]
): Shaft | null {
  const freeShaft = shafts.filter((x) => x.state === ElevatorState.Free);
  return freeShaft.length
    ? freeShaft.reduce((prev, curr) =>
        Math.abs(curr.currentFloorIndex - nextFloorIndex) <
        Math.abs(prev.currentFloorIndex - nextFloorIndex)
          ? curr
          : prev
      )
    : null;
}
