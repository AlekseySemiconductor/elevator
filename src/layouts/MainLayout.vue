<template>
  <div class="main-layout">
    <div class="main-layout__shaft-container">
      <AppShaft
        v-for="shaftIndex in shafts"
        :key="shaftIndex"
        :floorsCount="floorsCount"
      />
    </div>
    <div class="main-layout__floors">
      <AppFloor
        v-for="floorIndex in floors"
        :key="floorIndex"
        :floorIndex="floorIndex"
      />
    </div>
  </div>
</template>

<script lang="ts">
import AppShaft from "@/components/AppShaft.vue";
import AppFloor from "@/components/AppFloor.vue";
import range from "lodash/range";

const floorsCount = 5; // количество этажей
const shaftsCount = 4; // количество лифтовых шахт (лифтов)

export default {
  data() {
    return {
      shafts: range(shaftsCount),
      floorsCount,
      floors: range(floorsCount).map((x) => floorsCount - x),
    };
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
