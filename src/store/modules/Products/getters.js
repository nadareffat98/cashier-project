export default {
    getProducts(state) {
      return state.products;
    },
    getSearchProduct(state){
      return state.searchProducts;
    },
    getPageCount(state) {
      return state.pageCount;
    },
    getTax(state)
    {
      return state.tax;
    },
    getUserPrice(state){
      return state.userPrice;
    },
    getProductsErrors(state) {
      return state.errors;
    },
  };