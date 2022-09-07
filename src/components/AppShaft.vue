<template>
  <div
    class="shaft"
    :style="{ height: floorsCount * 100 + 'px' }"
  >
    <div class="shaft__elevator"></div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    floorsCount: Number,
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/scss/AppShaft.scss";
</style>
