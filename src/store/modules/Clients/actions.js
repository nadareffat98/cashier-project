import axios from "axios";

export default {
  clients(context) {
    axios
      .get("getClient", {
        headers: {
          Authorization: "Bearer" + context.getters.getToken,
        },
      })
      .then((res) => context.commit("setClients", res.data.data))
      .catch((err) => console.log(err));
  },
};
