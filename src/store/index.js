import Vue from "vue";
import Vuex from "vuex";
import authModule from "./modules/Auth/index.js";
import productModule from "./modules/Products/index.js";
import clientModule from "./modules/Clients/index.js";
import employeeModule from "./modules/Employees/index.js";
import supplierModule from "./modules/Suppliers/index.js";
import tilersModule from "./modules/Tilers/index.js";
import paymentMethodsModule from "./modules/PaymentMethods/index.js";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    auth: authModule,
    product: productModule,
    client: clientModule,
    employee: employeeModule,
    supplier: supplierModule,
    tiler: tilersModule,
    paymentMethods: paymentMethodsModule,
  },
});
export default store;
