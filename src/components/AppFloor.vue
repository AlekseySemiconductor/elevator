<template>
  <div class="floor">
    <span class="floor__index">{{ floorIndex }}</span>
    <div
      class="floor__button"
      :class="{
        'floor__button--active': isActive,
      }"
      @click="callElevator"
    ></div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    floorIndex: Number,
    isActive: Boolean,
  },
  data() {
    return {};
  },
  methods: {
    callElevator() {
      this.$store.dispatch("callElevator", { nextFloorIndex: this.floorIndex });
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/AppFloor.scss";
</style>
