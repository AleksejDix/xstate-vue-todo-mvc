import Vue from "vue";
import App from "./App.vue";
import VueCompositionApi from "@vue/composition-api";
import "todomvc-common/base.css";
import "todomvc-app-css/index.css";

Vue.use(VueCompositionApi);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
