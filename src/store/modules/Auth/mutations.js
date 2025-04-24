export default {
  setErrors(state, payload) {
    state.errors = payload;
  },
  setToken(state, token) {
    state.token = token;
  },
  setUser(state,userDetails)
  {
    state.userDetails = userDetails; 
  },
  setPhoneNum(state,payload)
  {
    state.phoneNum = payload;
  },
};
