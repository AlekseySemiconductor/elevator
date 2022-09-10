import { createStore } from "vuex";
import { ElevatorState } from "@/models/elevator-state";
import { Floor } from "@/models/floor";
import range from "lodash/range";

const floorsCount = 7; // количество этажей
const shaftsCount = 4; // количество лифтовых шахт (лифтов)
const currentFloorIndex = 1; // todo: вынести либо в environment, либо в input формы
const pendingTime = 3000;

export default createStore({
  state: {
    shafts: range(shaftsCount).map((x, i) => ({
      index: i,
      state: ElevatorState.Free,
      currentFloorIndex,
      nextFloorIndex: 0, // пусть следующий этаж по умолчанию будет 0, пока не вызовут лифт // todo: оставить только currentFloorIndex?
    })),
    floorsCount,
    floors: range(floorsCount).map((x) => ({
      index: floorsCount - x,
      isActive: false,
    })),
    pendingFloors: [] as number[],
  },
  getters: {},
  mutations: {
    callElevator(state, nextFloorIndex: number) {
      const hasFloorElevator = state.shafts.some(
        (x) => x.nextFloorIndex === nextFloorIndex
      );
      if (hasFloorElevator) {
        return;
      }

      state.floors.find((x) => x.index === nextFloorIndex)!.isActive = true;
      const freeElevator = state.shafts.find(
        (x) => x.state === ElevatorState.Free
      );

      if (freeElevator) {
        freeElevator.nextFloorIndex = nextFloorIndex;
        freeElevator.state = ElevatorState.Moving;
      } else {
        state.pendingFloors.push(nextFloorIndex);
      }
    },
    startPendingElevator(state, { nextFloorIndex, shaftIndex }) {
      state.shafts[shaftIndex].state = ElevatorState.Pending;
      state.floors.find((x: Floor) => x.index === nextFloorIndex)!.isActive =
        false;
    },
    stopPendingElevator(state, shaftIndex: number) {
      state.shafts[shaftIndex].state = ElevatorState.Free;
      state.shafts[shaftIndex].currentFloorIndex =
        state.shafts[shaftIndex].nextFloorIndex;
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
