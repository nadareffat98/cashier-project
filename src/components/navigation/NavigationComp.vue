<template>
  <div class="navigation">
    <v-app-bar
      color="white"
      app
      :clipped-right="clippedRight"
      :clipped-left="clippedLeft"
    >
      <v-layout align-center>
        <v-avatar
          :size="$vuetify.breakpoint.smAndDown ? '35' : '50'"
          style="margin-right: 20px"
          tile
        >
          <img class="logo" src="../../assets/imgs/logo.png" />
        </v-avatar>
        <v-app-bar-nav-icon
          :class="$vuetify.breakpoint.smAndDown ? 'mr-3' : 'mr-5'"
          @click.stop="toggleDrawer"
        ></v-app-bar-nav-icon>
      </v-layout>
      <v-spacer></v-spacer>
      <v-layout align-center justify-end>
        <v-btn
          icon
          width="35"
          height="35"
          class="icons text-dark"
          @click="handleChangeLang($i18n.locale)"
        >
          {{ $i18n.locale }}
        </v-btn>
        <v-btn
          icon
          width="35"
          height="35"
          class="icons"
          @click="logout"
          v-if="$vuetify.breakpoint.mdAndUp"
          ><v-icon size="20" color="red">logout</v-icon></v-btn
        >
        <v-menu offset-y max-height="300">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              width="35"
              height="35"
              class="icons"
              v-bind="attrs"
              v-on="on"
              @click="showMenu"
            >
              <v-badge color="red" dot v-if="notReaded"></v-badge>
              <v-icon color="black" size="21">
                notifications_none</v-icon
              ></v-btn
            >
          </template>
          <v-list class="dropdown pt-0" v-if="notifications.length != 0">
            <v-list-item
              v-for="notification in notifications"
              :key="notification.title"
              :class="[{ not_read: notification['read_at'] == null }, 'mt-0']"
              style="padding: 15px 15px 6px"
            >
              <a
                href="#"
                class="d-flex justify-start align-center"
                style="gap: 5px"
              >
                <v-icon
                  :color="notification.type == 'public' ? 'red' : 'green'"
                  size="22"
                  >circle</v-icon
                >
                <div>
                  <p>
                    {{ notification.body.msg }}
                  </p>
                  <p class="mt-1">{{ notification.body.title }}</p>
                  <p class="mt-1">{{ notification.created_at }}</p>
                </div>
              </a>
            </v-list-item>
          </v-list>
          <v-list v-else>
            <lottie-player
              src="emptynotify.json"
              background="transparent"
              speed="2"
              style="height: 240px"
              loop
              autoplay
            ></lottie-player>
          </v-list>
        </v-menu>
        <v-btn
          icon
          width="37"
          height="37"
          to="/profile"
          class="icons"
          v-if="$vuetify.breakpoint.mdAndUp"
        >
          <v-avatar size="30"
            ><img
              :src="
                userInfo
                  ? userInfo['logo']
                    ? userInfo['logo']
                    : require('../../assets/imgs/user.png')
                  : ''
              "
            />
          </v-avatar>
        </v-btn>
      </v-layout>
    </v-app-bar>
    <v-navigation-drawer
      color="#4FCA9A"
      :width="$vuetify.breakpoint.width < 426 ? '190' : '220'"
      :right="$i18n.locale == 'ar' ? true : false"
      app
      clipped
      v-model="drawer"
      :mini-variant="mini && $vuetify.breakpoint.mdAndUp"
      :temporary="$vuetify.breakpoint.smAndDown"
      :permanent="$vuetify.breakpoint.mdAndUp"
    >
      <v-list-item v-if="$vuetify.breakpoint.smAndDown" two-line to="/profile">
        <v-list-item-avatar class="mr-0">
          <v-img
            :src="
              userInfo
                ? userInfo['logo']
                  ? userInfo['logo']
                  : require('../../assets/imgs/user.png')
                : ''
            "
          ></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="link-title mr-2">{{
            meDetails ? meDetails["name"] : ""
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item-group
        v-model="selectedItem"
        color="white"
        class="pt-5"
        dense
        nav
        dark
      >
        <template v-for="item in filterItems">
          <v-subheader
            v-if="titles.includes(item.title) && mini == false"
            :key="item.path"
            class="link-title d-flex justify-start align-center"
            style="height: 35px"
          >
            {{ getSubHeader(item.title) }}
          </v-subheader>
          <router-link
            :key="item.title"
            :to="{ path: item.path, query: { title: item.title } }"
            :target="
              item.path == '/about-us' || item.path == '/contact-us'
                ? '_blank'
                : ''
            "
            style="text-decoration: none; color: inherit"
          >
            <v-list-item :value="item.title">
              <v-list-item-avatar size="25" tile>
                <v-tooltip left>
                  <template v-slot:activator="{ on }">
                    <v-icon v-if="item.path == '/contact-us'" v-on="on">{{
                      item.icon
                    }}</v-icon>
                    <v-img
                      v-else
                      v-on="on"
                      :src="
                        require(`@/assets/icons/${
                          selectedItem == item.title
                            ? item.activeIcon
                            : item.icon
                        }`)
                      "
                    ></v-img>
                  </template>
                  <span>{{ item.title }}</span>
                </v-tooltip>
              </v-list-item-avatar>
              <v-list-item-content class="pe-3">
                <v-list-item-title class="link-title">{{
                  item.title
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </router-link>
        </template>
      </v-list-item-group>
      <v-divider></v-divider>
      <v-list-item v-if="$vuetify.breakpoint.smAndDown" @click="logout">
        <v-list-item-avatar class="mr-0" size="25">
          <v-icon color="red">logout</v-icon>
        </v-list-item-avatar>
        <v-list-item-content class="pe-3">
          <v-list-item-title class="link-title text-dark">{{
            $t("logout")
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>
  </div>
</template>
<script>
import "@mdi/font/css/materialdesignicons.min.css";
import axios from "axios";
export default {
  data() {
    return {
      meDetails: null,
      userInfo: null,
      notifications: [],
      notReaded: false,
      mini: true,
      drawer: true,
    };
  },
  methods: {
    getData() {
      this.userInfo = JSON.parse(localStorage.getItem("userDetails"));
      this.meDetails = JSON.parse(localStorage.getItem("meDetails"));
      axios
        .get("notifications", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "X-localization": this.$i18n.locale,
          },
        })
        .then((res) => {
          this.notifications = res.data.data;
          for (var i = 0; i < this.notifications.length; i++) {
            if (this.notifications[i]["read_at"] == null) {
              this.notReaded = true;
              return;
            }
          }
        })
        .catch((err) => console.log(err));
    },
    toggleDrawer() {
      if (this.$vuetify.breakpoint.mdAndUp) {
        this.mini = !this.mini;
      } else if (this.$vuetify.breakpoint.smAndDown) {
        this.drawer = !this.drawer;
      }
    },
    switchLanguage() {
      this.$i18n.locale = this.language;
    },
    handleChangeLang(lang) {
      if (lang == "en") this.$i18n.locale = "ar";
      else this.$i18n.locale = "en";
      localStorage.setItem("lang", this.$i18n.locale);
      location.reload();
    },
    showMenu() {},
    getSubHeader(title) {
      if (title == this.$t("addInvoice")) return this.$t("sales");
      else if (title == this.$t("categories")) return this.$t("products");
      else return this.$t("settings");
    },
    logout() {
      this.$store.dispatch("logout");
      location.reload();
    },
  },
  computed: {
    filterItems() {
      if (this.meDetails) {
        if (this.meDetails["user_type"] == 0) {
          if (!this.meDetails["is_subscribed"])
            return this.items.filter((item) => item.path != "/tilers");
          else return this.items;
        } else
          return this.items.filter(
            (item) =>
              item.path != "/users" &&
              item.path != "/subscriptions" &&
              item.path != "/dashboard" &&
              item.path != "/payment-methods" &&
              item.path != "/tax-returns" &&
              item.path != "/products-inventory" &&
              item.path != "/product-movement" &&
              item.path != "/transactions" &&
              (this.meDetails.employee_permissions.includes("tilers-viewAll")
                ? true
                : item.path != "/tilers") &&
              (this.meDetails.employee_permissions.includes("products-reports")
                ? true
                : item.path != "/reports")
          );
      } else return this.items;
    },
    items() {
      return [
        {
          title: this.$t("controlPanel"),
          icon: "dashboard.png",
          activeIcon: "dashboard(1).png",
          path: "/dashboard",
        },
        {
          title: this.$t("addInvoice"),
          icon: "bill.png",
          activeIcon: "bill(1).png",
          path: "/cashier",
        },
        {
          title: this.$t("tilers"),
          icon: "cashier.png",
          activeIcon: "cashier(1).png",
          path: "/tilers",
        },
        {
          title: this.$t("saleInvoice"),
          icon: "invoice.png",
          activeIcon: "invoice(1).png",
          path: "/invoices",
        },
        {
          title: this.$t("refundInvoice"),
          icon: "sale-refund.png",
          activeIcon: "sale-refund(1).png",
          path: "/invoices",
        },
        {
          title: this.$t("clients"),
          icon: "group.png",
          activeIcon: "group(1).png",
          path: "/clients",
        },
        {
          title: this.$t("priceQuote"),
          icon: "wallet.png",
          activeIcon: "wallet(1).png",
          path: "/price_quote",
        },
        {
          title: this.$t("reports"),
          icon: "report.png",
          activeIcon: "report(1).png",
          path: "/reports",
        },
        {
          title: this.$t("taxReturns"),
          icon: "data-analysis.png",
          activeIcon: "data-analysis(1).png",
          path: "/tax-returns",
        },

        {
          title: this.$t("categories"),
          icon: "grid.png",
          activeIcon: "grid(1).png",
          path: "/categories",
        },
        {
          title: this.$t("products"),
          icon: "cubes.png",
          activeIcon: "cubes(1).png",
          path: "/products",
        },
        {
          title: this.$t("purchasesInvoices"),
          icon: "purchases.png",
          activeIcon: "purchases(1).png",
          path: "/purchases-invoices",
        },
        {
          title: this.$t("purchasesRefund"),
          icon: "purchases-refund.png",
          activeIcon: "purchases-refund(1).png",
          path: "/purchases-invoices",
        },
        {
          title: this.$t("suppliers"),
          icon: "suppliers.png",
          activeIcon: "suppliers(1).png",
          path: "/suppliers",
        },
        {
          title: this.$t("productsInventory"),
          icon: "inventory.png",
          activeIcon: "inventory(1).png",
          path: "/products-inventory",
        },
        {
          title: this.$t("storeSetting"),
          icon: "settings.png",
          activeIcon: "settings(1).png",
          path: "/invoice-settings",
        },
        {
          title: this.$t("printSetting"),
          icon: "printer.png",
          activeIcon: "printer(1).png",
          path: "/print-settings",
        },
        {
          title: this.$t("users"),
          icon: "businessman.png",
          activeIcon: "businessman(1).png",
          path: "/users",
        },
        {
          title: this.$t("transactions"),
          icon: "transaction.png",
          activeIcon: "transaction(1).png",
          path: "/transactions",
        },
        {
          title: this.$t("paymentMethods"),
          icon: "debit-card.png",
          activeIcon: "debit-card(1).png",
          path: "/payment-methods",
        },
        {
          title: this.$t("Packedges"),
          icon: "subscription.png",
          activeIcon: "subscription(1).png",
          path: "/subscriptions",
        },
        {
          title: this.$t("aboutUs"),
          icon: "info.png",
          activeIcon: "info(1).png",
          path: "/about-us",
        },
        {
          title: this.$t("contuctUs"),
          icon: "mdi-whatsapp",
          activeIcon: "mdi-whatsapp",
          path: "/contact-us",
        },
      ];
    },
    titles() {
      return [
        this.$t("addInvoice"),
        this.$t("categories"),
        this.$t("storeSetting"),
      ];
    },
    clippedRight() {
      return this.$i18n.locale == "en" ? false : true;
    },
    clippedLeft() {
      return this.$i18n.locale == "en" ? true : false;
    },
    selectedItem: {
      get() {
        return this.$route.query.title;
      },
      set(value) {
        this.$route.query.title = value;
      },
    },
  },
  mounted() {
    this.getData();
    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js";
    document.body.appendChild(script);
  },
};
</script>
<style scoped>
.link-title {
  font-size: 15px !important;
  color: white !important;
}

.icons {
  border: 1px solid rgba(112, 112, 112, 0.23);
  font-weight: 700;
  margin-left: 5px;
}

.icons::v-deep span {
  color: black;
}

.select-lang {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  padding: 0 8px;
  margin-top: 1px;
}

.select-lang:focus {
  outline: none;
}

.icons::before {
  display: none;
}

.not_read {
  background-color: #f6f6f6 !important;
}

.v-menu__content {
  margin-top: 3px !important;
}

.menu-eng {
  width: 500px;
}

.v-badge::v-deep .v-badge__wrapper {
  left: -7px !important;
  top: -6px !important;
}

.v-badge::v-deep .v-badge__badge {
  width: 6px;
  height: 6px;
}

.menu-eng::v-deep .v-menu__content {
  background: red !important;
}

.v-menu__content::v-deep .v-list {
  border-radius: 10px !important;
}

.dropdown .v-list-item {
  position: relative;
  margin-top: 15px;
}

.dropdown .v-list-item::after {
  position: absolute;
  content: "";
  top: 30px;
  left: 0px;
  border-bottom: 1px solid lightgray;
  width: 100%;
}

.dropdown .v-list-item:last-child:after {
  border-bottom: none;
}

.dropdown a {
  text-decoration: none;
  color: black;
}

.dropdown p:first-child {
  font-weight: 700 !important;
  padding-bottom: 5px !important;
}

.dropdown p {
  margin-bottom: 0px;
  padding-right: 10px;
  word-break: break-word;
  font-family: "BahjiiLight";
  font-size: 14px;
  line-height: 1;
}

@media (max-width: 425px) {
  .link-title {
    font-size: 0.8rem !important;
  }

  .v-list-item {
    padding: 0 10px !important;
  }
}
</style>
