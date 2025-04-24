import axios from "axios";

export default {
  employees(context) {
    axios
      .get("employee", {
        headers: {
          Authorization: "Bearer" + context.getters.getToken,
        },
      })
      .then((res) => context.commit("setEmployees",res.data.employees))
      .catch((err) => console.log(err));
  },
};