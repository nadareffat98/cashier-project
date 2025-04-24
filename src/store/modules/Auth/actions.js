import axios from "axios";
import router from "../../../router/index.js";

export default {
  login(context, payload) {
    axios
      .post("loginEmail", payload)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        if (res.data.data.subscription != null) {
          localStorage.setItem(
            "copy_rights_visible",
            res.data.data.subscription["copy_rights_visible"]
          );
          localStorage.setItem(
            "reports_on",
            res.data.data.subscription["reports_on"]
          );
        } else {
          localStorage.setItem("copy_rights_visible", 0);
          localStorage.setItem("reports_on", 0);
        }
        localStorage.setItem("addProductSound", false);
        localStorage.setItem("betaDialog", true);
        if (res.data.data.phone_verified == 0) {
          localStorage.setItem("PhoneVerified", JSON.stringify(false));
          context.commit("setPhoneNum", res.data.data.phone);
          return;
        }
        context.commit("setToken", res.data.token);
        localStorage.setItem("PhoneVerified", JSON.stringify(true));
        context.dispatch("userDetail");
        setTimeout(() => {
          context.dispatch("meDetail");
        }, 30);
      })
      .catch((err) => {
        context.commit("setErrors", err.response.data);
      });
  },
  signUp(context, payload) {
    axios
      .post("add_owner", payload)
      .then((res) => {
        context.commit("setPhoneNum", res.data.data.phone);
        localStorage.setItem("token", res.data.token);
        router.push("/login");
      })
      .catch((err) => {
        console.log(err);
        context.commit("setErrors", err.response.data.message);
      });
  },
  tryLoginIn(context) {
    const token = localStorage.getItem("token");
    if (token && JSON.parse(localStorage.getItem("PhoneVerified"))) {
      context.commit("setToken", token);
    }
  },
  logout(context) {
    localStorage.clear();
    context.commit("setToken", null);
    router.replace("/login");
    location.reload();
  },
  userDetail(context) {
    axios
      .get("user-detail", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        localStorage.setItem("userDetails", JSON.stringify(res.data.data));
        localStorage.setItem("taxInvoice", res.data.data.tax_on_of);
        context.commit(
          "setUser",
          JSON.parse(localStorage.getItem("userDetails"))
        );
        if (res.data.data.subscription != null) {
          localStorage.setItem(
            "copy_rights_visible",
            res.data.data.subscription["copy_rights_visible"]
          );
        } else {
          localStorage.setItem("copy_rights_visible", 0);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
  meDetail() {
    axios
      .get("me", {
        headers: {
          Authorization: "Bearer" + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        localStorage.setItem("meDetails", JSON.stringify(res.data));
        router.replace("/cashier");
        location.reload();
      })
      .catch((err) => console.log(err));
  },
};
