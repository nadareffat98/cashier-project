import actions from "./actions.js";
import getters from "./getters.js";
import mutations from "./mutations.js";

const clientModule = {
  state: () => ({
    clients: null,
  }),
  mutations,
  actions,
  getters,
};

export default clientModule;