import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

class myUtils {
  static IdIndex(clientArr, id) {
    for (let i = 0; i < clientArr.length; i++) {
      if (clientArr[i].id === id) {
        return i;
      }
    }
    return -1;
  }
  static getClientById(clientArr, id) {
    for (const client of clientArr) {
      if (client["id"] == id) {
        return client;
      }
    }
    return false;
  }
}

Vue.config.productionTip = false;

Vue.prototype.$myUtils = myUtils;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
