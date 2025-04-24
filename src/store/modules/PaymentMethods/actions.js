import axios from "axios";

export default {
  paymentMethods(context, payload) {
    axios
      .get("payment_methods", {
        headers: {
          Authorization: "Bearer" + context.getters.getToken,
          "X-localization": payload.lang,
        },
      })
      .then((res) => context.commit("setPaymentMethods", res.data.data))
      .catch((err) => {
        if (err.response.data.message == "Unauthenticated.")
          this.$store.dispatch("logout");
      });
  },
};
