import {
    createApp
} from "../../dist/mini-vue-study.esm.js";
import {
    App
} from "./App.js";

const rootContainer = document.querySelector("#app");
createApp(App).mount(rootContainer);