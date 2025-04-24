import axios from "axios";

export default {
  tilers(context) {
    axios
      .get("tilers", {
        headers: {
          Authorization: "Bearer" + context.getters.getToken,
        },
      })
      .then((res) => context.commit("setTilers",res.data.data))
      .catch((err) => console.log(err));
  },
};