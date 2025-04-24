export default {
  getErrors(state) {
    return state.errors;
  },
  getToken(state) {
    return state.token;
  },
  getUser(state) {
    return state.userDetails;
  },
  isAuthenticated(state) {
    return !!state.token;
  },
  getPhoneNum(state) {
    return state.phoneNum;
  },
};
