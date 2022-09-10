import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";

createApp({
  extends: App,
  beforeCreate() {
    this.$store.commit("initialiseStore");
  },
})
  .use(store)
  .mount("#app");
