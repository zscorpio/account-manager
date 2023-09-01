import { createApp } from "vue";
import App from "./App.vue";
import moment from "moment";
import ArcoVue from "@arco-design/web-vue";
import "@arco-design/web-vue/dist/arco.css";
import router from "./router";

const app = createApp(App);
app.use(ArcoVue);
app.use(router);
app.config.globalProperties.$moment = moment;
app.mount("#app");
