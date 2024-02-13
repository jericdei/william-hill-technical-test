import "./style.css"
import "primevue/resources/themes/lara-dark-blue/theme.css"
import "primeicons/primeicons.css"

import { createApp } from "vue"
import App from "./App.vue"
import PrimeVue from "primevue/config"
import ToastService from "primevue/toastservice"

createApp(App).use(PrimeVue).use(ToastService).mount("#app")
