import actions from "./actions.js";
import getters from "./getters.js";
import mutations from "./mutations.js";

const tilersModule = {
  state: () => ({
    tilers: null,
  }),
  mutations,
  actions,
  getters,
};

export default tilersModule;