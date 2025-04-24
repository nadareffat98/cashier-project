import en from "./locales/en.json";
import ar from "./locales/ar.json";
import VueI18n from "vue-i18n";
import Vue from 'vue';


Vue.use(VueI18n);

export default new VueI18n({
    locale: localStorage.getItem('lang') || 'ar',
    messages:{
        en:en ,
        ar:ar
    }
})