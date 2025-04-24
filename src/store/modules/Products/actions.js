import axios from "axios";

export default {
  // get all products
  products(context, payload) {
    axios
      .get("getProduct", {
        params: payload != "" && { page: payload },
        headers: {
          Authorization: "Bearer " + context.getters.getToken,
        },
      })
      .then((res) => {
        context.commit("setProducts", res.data.data.data);
        context.commit("setPageCount", res.data.data.meta.last_page);
      })
      .catch((err) => {
        if (err.response.data.message == "Unauthenticated.")
          context.dispatch("logout");
      });
  },

  // create new product
  addProduct(context, product) {
    axios
      .post("setProduct", product, {
        headers: {
          Authorization: "Bearer " + context.getters.getToken,
          "content-type": "multipart/form-data",
        },
      })
      .then(() => context.commit("setProductsErrors", null))
      .catch((err) =>
        context.commit("setProductsErrors", err.response.data.message)
      );
  },
  // edit exist product
  editProduct(context, payload) {
    axios
      .post(`editProduct/${payload.id}`, payload.product, {
        params: { _method: "PATCH" },
        headers: {
          Authorization: "Bearer " + context.getters.getToken,
          "content-type": "multipart/form-data",
        },
      })
      .then(() => context.commit("setProductsErrors", null))
      .catch((err) =>
        context.commit("setProductsErrors", err.response.data.message)
      );
  },
  deleteProduct(context, productIndex) {
    axios.post(`destroyProduct/${productIndex}`, null, {
      headers: {
        Authorization: "Bearer " + context.getters.getToken,
      },
    });
  },
  searchProduct(context, payload) {
    axios
      .post(
        "searchProduct",
        {
          search: payload.searchProduct,
        },
        {
          params: payload.page != "" && { page: payload.page },
          headers: {
            Authorization: "Bearer " + context.getters.getToken,
          },
        }
      )
      .then((res) => {
        context.commit("setProducts", res.data.data.data);
        context.commit("setPageCount", res.data.data.meta.last_page);
      })
      .catch((err) => console.log(err));
  },
  tax(context) {
    axios
      .get("general_setting", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        context.commit("setTax", res.data.data[9].value);
        context.commit("setUserPrice", res.data.data[15].value);
        localStorage.setItem("publishable_key",res.data.data[20].value)
      })
      .catch((err) => console.log(err));
  },
};
