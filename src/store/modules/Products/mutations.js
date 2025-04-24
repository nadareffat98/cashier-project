export default {
  setProducts(state, payload) {
    state.products = payload;
  },
  setSearchProduct(state, payload) {
    state.searchProducts = payload;
  },
  // set count pages of pagination
  setPageCount(state, payload) {
    state.pageCount = payload;
  },
  //calculate tax
  setTax(state, payload) {
    state.tax = payload / 100;
  },
  setUserPrice(state, payload) {
    state.userPrice = payload;
  },
  setProductsErrors(state, payload) {
    state.errors = payload;
  },
};
