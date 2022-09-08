<template>
  <div class="floor">
    <span class="floor__index">{{ floorIndex }}</span>
    <div class="floor__button"></div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    floorIndex: Number,
  },
  data() {
    return {};
  },
  created() {
    console.log(23);
  },
  methods: {},
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/AppFloor.scss";
</style>
