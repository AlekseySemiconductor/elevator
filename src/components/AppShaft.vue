<template>
  <div
    class="shaft"
    :class="{
      'shaft--pending': shaft.state === ElevatorState.Pending,
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
      <div
        class="shaft__elevator-content"
        :class="{
          'shaft__elevator-content--hidden': shaft.state === ElevatorState.Free,
        }"
      >
        <template v-if="shaft.currentFloorIndex < shaft.nextFloorIndex">
          &uarr;
        </template>
        <template v-else> &darr; </template>
        {{ shaft.nextFloorIndex }} этаж
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ElevatorState } from "@/models/elevator-state";

const speed = 1000 / 100; // 1 этаж(100px) за 1000ms

export default {
  props: {
    shaftIndex: Number,
    currentFloorIndex: Number,
    nextFloorIndex: Number,
  },
  data() {
    return {
      ElevatorState,
      position: this.calcalatePosition(this.currentFloorIndex),
    };
  },
  methods: {
    moveShaft(nextFloorIndex: number) {
      const nextPos = this.calcalatePosition(nextFloorIndex);
      const isUpDirection = nextFloorIndex > this.currentFloorIndex;
      const interval = setInterval(() => {
        if (nextPos === this.position) {
          clearInterval(interval);
          this.$store.dispatch("stopMoving", {
            nextFloorIndex,
            shaftIndex: this.shaftIndex,
          });
          return;
        }

        this.position = isUpDirection ? this.position - 1 : this.position + 1;
      }, speed);
    },
    calcalatePosition(floorIndex: number): number {
      return -(floorIndex - 1) * 100;
    },
  },
  computed: {
    floorsCount() {
      return this.$store.state.floorsCount;
    },
    shaft() {
      return this.$store.state.shafts[this.shaftIndex];
    },
  },
  watch: {
    nextFloorIndex(nextFloorIndex: number, oldVal: number) {
      this.moveShaft(nextFloorIndex);
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/AppShaft.scss";
</style>
