<template>
  <MainLayout />
</template>
<script lang="ts">
import MainLayout from "./layouts/MainLayout.vue";

export default {
  components: {
    MainLayout,
  },
};
</script>

<style lang="scss">
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
