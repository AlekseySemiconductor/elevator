import { createStore } from "vuex";
import { ElevatorState } from "@/models/elevator-state";
import { Floor } from "@/models/floor";
import { Shaft } from "@/models/shaft";
import range from "lodash/range";

const initialFloorsCount = 7; // количество этажей
const initialShaftsCount = 4; // количество лифтовых шахт (лифтов)
const initialFloorIndex = 1; // начальная позиция всех лифтов - первый этаж
const pendingTime = 3000; // время ожидания лифта перед тем, как он снова сможет двигаться на вызванный этаж
const speed = 1000 / 100; // 1 этаж(100px) за 1000ms

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
    updateElevatorPosition(state, { elevator }) {
      elevator.position =
        elevator.nextFloorIndex > elevator.currentFloorIndex
          ? elevator.position - 1
          : elevator.position + 1;
    },
    startPendingElevator(state, { elevator }) {
      elevator.state = ElevatorState.Pending;
      state.floors.find(
        (x: Floor) => x.index === elevator.nextFloorIndex
      )!.isActive = false;
    },
    stopPendingElevator(state, { elevator }) {
      elevator.state = ElevatorState.Free;
      elevator.currentFloorIndex = elevator.nextFloorIndex;
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
    callElevator(context, { nextFloorIndex }) {
      const isTheSameFloor = context.state.shafts.some(
        (x) => x.nextFloorIndex === nextFloorIndex
      );
      if (isTheSameFloor) {
        return;
      }

      context.state.floors.find((x) => x.index === nextFloorIndex)!.isActive =
        true;

      const nearestFreeElevator = getNearestFreeElevator(
        nextFloorIndex,
        context.state.shafts
      );
      if (nearestFreeElevator) {
        context.dispatch("moveElevator", {
          elevator: nearestFreeElevator,
          nextFloorIndex,
        });
        return;
      }

      context.state.pendingFloors.push(nextFloorIndex);
    },
    moveElevator({ dispatch, commit }, { elevator, nextFloorIndex }) {
      elevator.nextFloorIndex = nextFloorIndex;
      elevator.state = ElevatorState.Moving;

      const nextPos = calculatePosition(nextFloorIndex);

      const interval = setInterval(() => {
        if (nextPos === elevator.position) {
          clearInterval(interval);

          commit("startPendingElevator", {
            elevator,
          });

          dispatch("stopElevator", {
            elevator,
          });
          return;
        }

        commit("updateElevatorPosition", {
          elevator,
        });
      }, speed);
    },
    stopElevator({ commit, state, dispatch }, { elevator }) {
      setTimeout(() => {
        commit("stopPendingElevator", { elevator });
        const pendingFloorIndex = state.pendingFloors.shift();
        if (pendingFloorIndex) {
          dispatch("callElevator", {
            nextFloorIndex: pendingFloorIndex,
          });
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
    nextFloorIndex: initialFloorIndex,
    position: calculatePosition(initialFloorIndex),
  };
}

function createFloor(index: number) {
  return {
    index,
    isActive: false,
  };
}

function getNearestFreeElevator(
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

function calculatePosition(floorIndex: number): number {
  return -(floorIndex - 1) * 100;
}
