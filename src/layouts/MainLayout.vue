<template>
  <div class="main-layout">
    <div class="main-layout__shaft-container">
      <AppShaft
        v-for="shaftIndex in shafts"
        :key="shaftIndex"
        :floorsCount="floorsCount"
      />
    </div>
    <ul class="main-layout__floors">
      <li
        v-for="floorIndex in floors"
        :key="floorIndex"
        class="main-layout__floor"
      >
        {{ floorIndex }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import AppShaft from "@/components/AppShaft.vue";
import range from "lodash/range";

const floorsCount = 5; // количество этажей
const shaftsCount = 4; // количество лифтовых шахт (лифтов)

export default {
  data() {
    return {
      shafts: range(shaftsCount),
      floorsCount,
      floors: range(floorsCount),
    };
  },
  components: {
    AppShaft,
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/MainLayout.scss";
</style>
