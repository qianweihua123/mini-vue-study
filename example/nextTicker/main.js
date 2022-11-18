import {
    createApp
} from "../../lib/mini-vue-study.esm.js";
import App from "./App.js";

const rootContainer = document.querySelector("#root");
createApp(App).mount(rootContainer);