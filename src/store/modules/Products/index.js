import actions from "./actions.js";
import getters from "./getters.js";
import mutations from "./mutations.js";

const productModule = {
  state: () => ({
    products: null,
    searchProducts:null,
    pageCount:null,
    tax:null,
    userPrice:null,
    errors: null,
  }),
  mutations,
  actions,
  getters,
};

export default productModule;
