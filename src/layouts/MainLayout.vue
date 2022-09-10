<template>
  <div class="main-layout">
    <div class="main-layout__controls-wrapper">
      <button
        class="main-layout__btn main-layout__btn-slide-down"
        @click="addShaft"
      >
        <span class="main-layout__btn-text">Добавить новый лифт</span>
      </button>
      <button
        class="main-layout__btn main-layout__btn-slide-up"
        @click="addFloor"
      >
        <span class="main-layout__btn-text">Добавить новый этаж</span>
      </button>
      <button
        class="main-layout__btn main-layout__btn--border"
        @click="clearStore"
      >
        <span class="main-layout__btn-text">Очистить store и localStorage</span>
      </button>
    </div>
    <div class="main-layout__wrapper">
      <div class="main-layout__shaft-container">
        <AppShaft
          v-for="shaft in $store.state.shafts"
          :key="shaft.index"
          :shaftIndex="shaft.index"
          :currentFloorIndex="shaft.currentFloorIndex"
          :nextFloorIndex="shaft.nextFloorIndex"
          :position="shaft.position"
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
  methods: {
    addFloor() {
      this.$store.commit("addFloor");
    },
    addShaft() {
      this.$store.commit("addShaft");
    },
    clearStore() {
      this.$store.dispatch("clearStore");
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/MainLayout.scss";
</style>
