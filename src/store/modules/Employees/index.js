import actions from "./actions.js";
import getters from "./getters.js";
import mutations from "./mutations.js";

const employeeModule = {
  state: () => ({
    employees: null,
  }),
  mutations,
  actions,
  getters,
};

export default employeeModule;