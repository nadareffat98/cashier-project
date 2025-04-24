import actions from "./actions.js";
import getters from "./getters.js";
import mutations from "./mutations.js";

const supplierModule = {
  state: () => ({
    suppliers: null,
  }),
  mutations,
  actions,
  getters,
};

export default supplierModule;