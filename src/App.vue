<template>
  <v-app :dir="$i18n.locale == 'en' ? 'ltr' : 'rtl'">
    <navigation-comp v-if="isAuthenticated"></navigation-comp>
    <v-main>
      <notification-box></notification-box>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import NavigationComp from "./components/navigation/NavigationComp.vue";
import NotificationBox from "./views/NotificationBox.vue";
import axios from "axios";
export default {
  name: "App",
  components: {
    NavigationComp,
    NotificationBox,
  },
  computed: {
    isAuthenticated() {
      return !!this.$store.getters.isAuthenticated;
    },
  },
  methods: {
    getData() {
      axios
        .get("me", {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          localStorage.setItem("meDetails", JSON.stringify(res.data));
          if (res.data.subscription != null) {
            localStorage.setItem(
              "copy_rights_visible",
              res.data.subscription["copy_rights_visible"]
            );
            localStorage.setItem(
              "reports_on",
              res.data.subscription["reports_on"]
            );
          } else {
            localStorage.setItem("copy_rights_visible", 0);
            localStorage.setItem("reports_on", 0);
          }
        })
        .catch((err) => {
          if (err.response.data.message == "Unauthenticated.") {
            if (this.$route.name != "register" && this.$route.name != "login")
              this.$store.dispatch("logout");
          }
        });
    },
  },
  mounted() {
    document.body.className = this.$i18n.locale === "en" ? "lang-en" : "";
    this.$store.dispatch("tryLoginIn");
  },
  updated() {
    this.getData();
  },
};
</script>
<style>
@font-face {
  font-family: "BahjiiSemiBold";
  src: local("BahjiiSemiBold"),
    url(./assets/fonts/bahjiisemibold.ttf) format("truetype");
}

@font-face {
  font-family: "BahjiiBold";
  src: local("BahjiiBold"),
    url(./assets/fonts/bahjiibold.ttf) format("truetype");
}

@font-face {
  font-family: "BahjiiLight";
  src: local("BahjiiLight"),
    url(./assets/fonts/bahijlight.ttf) format("truetype");
}

* {
  letter-spacing: 0 !important;
  font-family: "BahjiiSemiBold";
  font-size: 0.875rem;
}

p {
  margin-bottom: 0 !important;
}

h2 {
  font-size: 1.25rem;
}

.v-btn--is-elevated {
  box-shadow: none !important;
}

::-webkit-scrollbar {
  width: 6px !important;
}

::-webkit-scrollbar-thumb {
  background: #d2d2d2 !important;
  border-radius: 10px !important;
}

body {
  direction: rtl;
}

.lang-en body {
  direction: ltr !important;
}

.lang-en .v-navigation-drawer {
  left: 0 !important;
  right: auto !important;
}

.v-dialog::v-deep .v-card__title {
  letter-spacing: 0 !important;
}

@media (max-width:768px) {
  h2 {
    font-size: 1rem;
  }
}
</style>
