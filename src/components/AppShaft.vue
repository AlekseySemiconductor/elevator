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
        <template v-if="isUpDirection"> &uarr; </template>
        <template v-else> &darr; </template>
        {{ shaft.currentFloorIndex }} этаж
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ElevatorState } from "@/models/elevator-state";

export default {
  props: {
    shaftIndex: Number,
    currentFloorIndex: Number,
    isUpDirection: Boolean,
    position: Number,
  },
  data() {
    return {
      ElevatorState,
    };
  },
  created() {
    switch (this.shaft.state) {
      case ElevatorState.Moving:
        this.$store.dispatch("moveElevator", {
          elevator: this.shaft,
          nextFloorIndex: this.shaft.currentFloorIndex,
          afterRefresh: true, // todo: вернуть nextFloorIndex и currentFloorIndex, удалить afterRefresh
        });
        break;
      case ElevatorState.Pending:
        this.$store.dispatch("stopElevator", {
          shaftIndex: this.shaft.index,
        });
        break;
      case ElevatorState.Free:
        break;
      default:
        throw new Error(`state ${this.shaft.state} doesn't exist`);
    }
  },
  methods: {},
  computed: {
    floorsCount() {
      return this.$store.state.floorsCount;
    },
    shaft() {
      return this.$store.state.shafts[this.shaftIndex];
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/AppShaft.scss";
</style>
