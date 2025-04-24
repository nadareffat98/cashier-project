import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import store from "./store/index.js";
import Vuelidate from "vuelidate";
import VCreditCard from "v-credit-card-component";
import VueBarcodeScanner from "vue-barcode-scanner";
import firebase from "firebase/app";
import "firebase/messaging";
import "vuetify/dist/vuetify.min.css";
import "v-credit-card-component/dist/v-credit-card.css";
import "./axios";
import i18n from "./i18n";
import VueApexCharts from "vue-apexcharts";

//components
import AlertDialog from "./components/UI/AlertDialog";
import BaseTable from "./components/UI/BaseTable";
import BaseForm from "./components/UI/BaseForm";

let options = {
  sensitivity: 105, // default is 100
  requiredAttr: true, // default is false
  callbackAfterTimeout: true, // default is false
};

Vue.config.productionTip = false;
//initialize firebase
firebase.initializeApp({
  apiKey: "AIzaSyCnWHEmjGekrSqNsIXApiYwG5AnAAPYbKg",
  authDomain: "e-fatorh.firebaseapp.com",
  projectId: "e-fatorh",
  storageBucket: "e-fatorh.appspot.com",
  messagingSenderId: "562616822606",
  appId: "1:562616822606:web:0723c181bf931b65b78c1f",
  measurementId: "G-ZZJFPKW8ZS",
});

navigator.serviceWorker
  .register("firebase-messaging-sw.js", {
    scope: "firebase-cloud-messaging-push-scope",
  })
  .then((registration) => {
    const messaging = firebase.messaging();
    messaging.useServiceWorker(registration);
  })
  .catch((err) => {
    console.log(err);
  });

//global function for round number
Vue.prototype.$RoundingNumber = function RoundingNumber(number,type) {
  if(type=='product') return Math.round(Number(number) * 10000) / 10000;
  else return Math.round(Number(number) * 100) / 100;
  // return Number(number.toFixed(3))
};

Vue.use(VCreditCard);
Vue.use(VueBarcodeScanner, options);
Vue.use(VueApexCharts);

Vue.component("apex-chart", VueApexCharts);
Vue.component("alert-dialog", AlertDialog);
Vue.component("base-table", BaseTable);
Vue.component("base-form", BaseForm);


new Vue({
  router,
  vuetify,
  store,
  i18n,
  Vuelidate,
  render: (h) => h(App),
}).$mount("#app");
