import axios from "axios";
// import store from "./store/index.js";
import i18n from "./i18n";

// axios.defaults.baseURL = process.env.VUE_APP_API_BASE + "/api/";
axios.defaults.baseURL='https://dev.efatorh.com/api/';
axios.defaults.headers.common["Authorization"] =
  "Bearer" + localStorage.getItem("token");
axios.defaults.headers.common["X-localization"] = i18n.locale;

