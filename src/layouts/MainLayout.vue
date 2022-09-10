<template>
  <div class="main-layout">
    <div class="main-layout__shaft-container">
      <AppShaft
        v-for="shaft in $store.state.shafts"
        :key="shaft.index"
        :shaftIndex="shaft.index"
        :currentFloorIndex="shaft.currentFloorIndex"
        :nextFloorIndex="shaft.nextFloorIndex"
      />
    </div>
    <div class="main-layout__floors">
      <AppFloor
        v-for="floor in $store.state.floors"
        :key="floor.index"
        :floorIndex="floor.index"
        :isActive="floor.isActive"
      />
    </div>
  </div>
</template>

<script lang="ts">
import AppShaft from "@/components/AppShaft.vue";
import AppFloor from "@/components/AppFloor.vue";

export default {
  data() {
    return {};
  },
  components: {
    AppShaft,
    AppFloor,
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/MainLayout.scss";
</style>
