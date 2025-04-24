import actions from "./actions.js";
import getters from "./getters.js";
import mutations from "./mutations.js";

const authModule =  {
  state: ()=>({
    errors: null,
    token:null,
    userDetails:null,
    phoneNum:null,
  }),
  mutations,
  actions,
  getters
};

export default authModule;
