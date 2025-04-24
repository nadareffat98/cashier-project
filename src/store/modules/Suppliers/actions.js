import axios from "axios";

export default {
  suppliers(context) {
    axios
      .get("suppliers", {
        headers: {
          Authorization: "Bearer" + context.getters.getToken,
        },
      })
      .then((res) => context.commit("setSuppliers",res.data.suppliers))
      .catch((err) => console.log(err));
  },
};