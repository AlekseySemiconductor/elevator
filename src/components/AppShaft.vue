<template>
  <div
    class="shaft"
    :class="{
      'shaft--pending': state === EvelatorState.Pending,
    }"
    :style="{
      height: floorsCount * 100 + 'px',
    }"
  >
    <div
      class="shaft__elevator"
      :style="{
        transform: `translateY(${position}px`,
      }"
    >
      {{ currentFloorIndex }} этаж
    </div>
  </div>
</template>

<script lang="ts">
const speed = 1000 / 100; // 1 этаж(100px) за 1000ms
const pendingTime = 3000;

enum EvelatorState {
  Free,
  Moving,
  Pending,
}

export default {
  props: {
    floorsCount: Number,
  },
  data() {
    const currentFloorIndex = 3; // todo: прокинуть в props
    return {
      EvelatorState,
      state: EvelatorState.Free,
      currentFloorIndex: currentFloorIndex,
      position: this.calcalatePosition(currentFloorIndex),
    };
  },
  created() {
    this.moveShaft(5);
  },
  methods: {
    calcalatePosition(floorIndex: number): number {
      return -(floorIndex - 1) * 100;
    },
    moveShaft(nextFloorIndex: number) {
      const isTheSameFloor = nextFloorIndex === this.currentFloorIndex;
      const isEvelatorBusy = this.state !== EvelatorState.Free;
      if (isTheSameFloor || isEvelatorBusy) {
        return;
      }

      const nextPos = this.calcalatePosition(nextFloorIndex);
      const isUpDirection = nextFloorIndex > this.currentFloorIndex;

      this.currentFloorIndex = nextFloorIndex;
      this.state = EvelatorState.Moving;

      const interval = setInterval(() => {
        if (nextPos === this.position) {
          this.stopMoving(interval);
          return;
        }

        this.position = isUpDirection ? this.position - 1 : this.position + 1;
      }, speed);
    },
    stopMoving(interval: number) {
      clearInterval(interval);
      this.state = EvelatorState.Pending;
      setTimeout(() => {
        this.state = EvelatorState.Free;
      }, pendingTime);
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/AppShaft.scss";
</style>
