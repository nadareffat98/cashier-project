<template>
  <v-container class="mt-5">
    <h2>{{ $t("packedges") }}</h2>
    <v-row
      no-gutters
      class="mt-5"
      justify="center"
      align="center"
      style="gap: 50px"
    >
      <v-col
        cols="12"
        md="3"
        sm="12"
        style="align-self: stretch"
        v-if="selectedSubTitle == $t('freePackage')"
      >
        <v-card
          class="rounded-lg subCardFree d-flex flex-column justify-space-between elevation-0"
          height="100%"
        >
          <div>
            <v-card-title class="cardTitleFree">
              <v-row>
                <v-col cols="12">
                  <div class="subTitle white--text">
                    {{ $t("freePackage") }}
                  </div>
                </v-col>
                <v-col cols="12" style="margin-top: 30px">
                  <div :class="[marginOne, 'subPrice']" style="color: black">
                    <sup>{{ $t("SRmini") }}</sup
                    >0.0<sup class="period"> / {{ $t("perMonth") }}</sup>
                  </div>
                </v-col>
                <v-col cols="12" class="invoiceNum">
                  <p>
                    {{ $t("noOfInvoiceAllowed") + ":" + numberOfBills }}
                    <sub class="d-flex justify-end">
                      {{
                        $t("noOfInvoiceOuted") + ":" + numberOfBillsUsed
                      }}</sub
                    >
                  </p>
                </v-col>
              </v-row>
            </v-card-title>
            <v-progress-linear
              :value="getNumberOfBillsUsed"
              color="#62C83F"
              reverse
            ></v-progress-linear>
          </div>
          <v-card-text class="cardContent">
            <div :class="[marginThree]">
              <v-icon color="#4FCA9A">mdi-checkbox-marked-circle</v-icon>
              {{ $t("noOfUsers") }} : 1
            </div>
            <div :class="[marginThree, 'mt-2']">
              <v-icon color="#4FCA9A">mdi-checkbox-marked-circle</v-icon>
              {{ $t("unlimitedCustomers") }}
            </div>
            <div :class="[marginThree, 'mt-2']">
              <v-icon color="#4FCA9A">mdi-checkbox-marked-circle</v-icon>
              {{ $t("unlimitedProducts") }}
            </div>
          </v-card-text>
          <v-card-actions class="d-flex justify-center align-center">
            <v-btn
              class="rounded-lg mt-5"
              color="#4FCA9A"
              width="90%"
              outlined
              style="background: rgba(79, 202, 154, 0.36)"
            >
              <v-icon class="ml-1">done</v-icon>
              {{ $t("currentPackege") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="3"
        sm="12"
        style="align-self: stretch"
        v-for="(pack, index) in packages"
        :key="pack.id"
      >
        <v-card
          class="rounded-lg subCard d-flex flex-column justify-space-between elevation-0"
          height="100%"
          @click="selectedSubTitle != pack.title ? paymentPage(pack) : ''"
        >
          <v-card-title class="cardTitle">
            <v-row>
              <v-col cols="12">
                <div class="subTitle">{{ pack.title }}</div>
              </v-col>
              <v-col cols="12" style="margin-top: 30px">
                <div :class="[marginOne, 'subPrice']" v-if="index == 0">
                  <sup>{{ $t("SRmini") }}</sup
                  >{{ pack.price
                  }}<sup class="period">
                    / {{ pack.period }} {{ $t("month") }}</sup
                  >
                </div>
                <div
                  v-else
                  class="d-flex flex-column justify-center align-center subPrice"
                >
                  <span class="text-decoration-line-through period">{{
                    pack.list_price + " " + $t("SRmini")
                  }}</span>
                  <p>
                    {{ pack.price }}
                    <sub style="font-size: 23px"
                      >{{ $t("SRmini") }}
                      <sub class="period" style="font-size: 10px"
                        >/ {{ pack.period }} {{ $t("month") }}</sub
                      >
                    </sub>
                  </p>
                </div>
              </v-col>
              <v-col cols="12" class="invoiceNum" v-if="index == 0">
                <p style="color: #2d775a">
                  {{
                    pack.features.length != 0
                      ? pack.features[0].title["ar"]
                      : pack.features
                  }}
                </p>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text class="cardContent">
            <div
              :class="[marginThree, 'mt-2']"
              v-for="(feature, index) in pack.features"
              :key="index"
            >
              <v-icon color="#4FCA9A" v-if="index != 0"
                >mdi-checkbox-marked-circle</v-icon
              >
              {{ index != 0 ? feature.title["ar"] : "" }}
            </div>
          </v-card-text>
          <v-card-actions class="d-flex justify-center align-center">
            <v-btn
              class="rounded-lg"
              color="#4FCA9A"
              width="90%"
              dark
              :style="[
                selectedSubTitle == pack.title
                  ? {
                      background: 'rgba(79, 202, 154, 0.36)',
                      color: '#4FCA9A',
                    }
                  : '',
              ]"
              @click="selectedSubTitle != pack.title ? paymentPage(pack) : ''"
            >
              <v-icon class="ml-1" v-if="selectedSubTitle == pack.title"
                >done</v-icon
              >
              {{
                selectedSubTitle == pack.title
                  ? $t("currentPackege")
                  : $t("startNow")
              }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <alert-dialog v-if="remainingPriceDialog" @close="close" :close="close">
      <template #title>
        <div style="width: 100%">
          <h5 class="d-flex jsutify-center align-center">
            <v-icon color="black">{{
              $i18n.locale == "ar" ? " chevron_left" : " chevron_right"
            }}</v-icon>
            {{
              $t("currentPackege") +
              " " +
              selectedSub.price +
              " " +
              $t("SRmini")
            }}
          </h5>
          <p
            style="font-size: 17px; display: flex; justify-content: flex-start"
            :style="padding30"
            class="mb-0"
          >
            {{ $t("endCurrentPackedge") + " " }}
            <span style="color: red; font-size: 17px">{{
              " " + remainingPackageDetails.months_remain + "  " + $t("month")
            }}</span>
          </p>
          <h5 class="d-flex jsutify-center align-center">
            <v-icon color="black">{{
              $i18n.locale == "ar" ? " chevron_left" : " chevron_right"
            }}</v-icon>
            {{
              $t("packedgeToUpgrade") +
              " : " +
              remainingPackageDetails.new_package_price +
              " " +
              $t("SRmini")
            }}
          </h5>
          <p
            style="
              font-size: 17px;
              display: flex;
              justify-content: flex-start;
              line-height: 1.5;
            "
            :style="padding30"
            :class="$i18n.locale == 'ar' ? 'text-right' : 'text-left'"
          >
            {{
              $t("amountOfDiscount") +
              " " +
              remainingPackageDetails.balance_remain +
              $t("discountDescription")
            }}
          </p>
        </div>
        <div
          style="
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          "
          :style="padding25"
        >
          <h5>{{ $t("amountOfPackedgeUpgrade") }}</h5>
          <p style="line-height: 1">
            {{
              remainingPackageDetails.new_package_price +
              " - " +
              remainingPackageDetails.balance_remain +
              " = "
            }}
            <span style="color: red">{{
              remainingPackageDetails.difference_cost + " " + $t("SRmini")
            }}</span>
          </p>
        </div>
      </template>
      <template #default>
        <v-btn
          color="#62C83F"
          class="rounded-pill mb-4"
          dark
          @click="upgradePackage"
        >
          {{ $t("upgradePackedge") }}
        </v-btn>
      </template>
    </alert-dialog>
  </v-container>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      selectedSubTitle: null,
      selectedSub: null,
      remainingPackageDetails: null,
      newPackage: null,
      packages: [],
      meDetails: null,
      userDetails: null,
      numberOfBills: null,
      numberOfBillsUsed: null,
      remainingPriceDialog: false,
      fromFreePack: false,
    };
  },
  methods: {
    paymentPage(pack) {
      this.newPackage = pack;
      if (this.meDetails["subscription"] == null) {
        this.upgradePackage();
      } else {
        axios
          .get(`upgrade/${pack.id}`, {
            headers: {
              Authorization: "Bearer" + localStorage.getItem("token"),
            },
          })
          .then((res) => {
            this.remainingPackageDetails = res.data.data;
            this.remainingPriceDialog = true;
          })
          .catch((err) => console.log(err));
      }
    },
    upgradePackage() {
      localStorage.setItem("paymentTitle", "buyPackage");
      if (this.newPackage.title !== "free")
        this.$router.push({
          name: "payment",
          params: {
            title: "buyPackage",
            package: this.newPackage,
            remainPackDetails: this.remainingPackageDetails,
          },
        });
    },
    getData() {
      this.$store.dispatch('tax')
      localStorage.removeItem("paymentTitle");
      this.numberOfBills = JSON.parse(localStorage.getItem("userDetails"))[
        "no_of_bills"
      ];
      this.numberOfBillsUsed = JSON.parse(localStorage.getItem("userDetails"))[
        "no_of_bills_now"
      ];
      this.userDetails = JSON.parse(localStorage.getItem("userDetails"));
      this.meDetails = JSON.parse(localStorage.getItem("meDetails"));
      if (this.meDetails) {
        if (!this.meDetails["is_subscribed"])
          this.selectedSubTitle = this.$t("freePackage");
        else {
          this.selectedSub = this.meDetails["subscription"];
          this.selectedSubTitle = this.meDetails["subscription"].title;
          this.packages.push(this.meDetails["subscription"]);
        }
        axios
          .get("upgrade", {
            headers: {
              Authorization: "Bearer" + localStorage.getItem("token"),
            },
          })
          .then((res) => {
            this.packages.push(...res.data.data);
          })
          .catch((err) => {
            if (err.response.data.message == "Unauthenticated.")
              this.$store.dispatch("logout");
          });
      }
    },
    close() {
      this.remainingPriceDialog = false;
    },
  },
  computed: {
    getNumberOfBillsUsed() {
      const perc = 100 - (10 / 3) * this.numberOfBillsUsed;
      if (perc < 0) return 0;
      else return perc;
    },
    marginThree() {
      return this.$i18n.locale == "en" ? "ml-3" : "mr-3";
    },
    marginTwo() {
      return this.$i18n.locale == "en" ? "ml-2" : "mr-2";
    },
    marginOne() {
      return this.$i18n.locale == "en" ? "ml-1" : "mr-1";
    },
    padding30() {
      return this.$i18n.locale == "en"
        ? "padding-left: 30px;"
        : "padding-right: 30px;";
    },
    padding25() {
      return this.$i18n.locale == "en"
        ? "padding-left:25px;"
        : "padding-right:25px;";
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style scoped>
.subCardFree {
  border: 1px solid #707070;
}
.subCard {
  border: 1px solid #4fca9a;
}
.cardTitleFree {
  background-color: rgba(0, 0, 0, 0.2);
}
.cardTitle {
  background-color: rgba(79, 202, 154, 0.19);
}
.subTitle {
  background: rgba(134, 217, 184, 0.61);
  height: 32px;
  border: 1px solid #4fca9a;
  border-radius: 5px;
  text-align: center;
  font-size: 14px;
  float: left;
  padding: 0 5px;
}

.subTitle,
.subPrice,
.invoiceNum,
.v-card__actions >>> button {
  font-family: "BahjiiSemiBold" !important;
}
.subPrice {
  font-size: 35px;
  color: #4fca9a;
}
.subPrice span {
  font-family: "BahjiiLight" !important;
  font-size: 30px;
  letter-spacing: 0;
}
sup {
  font-size: 15px;
  top: -2.3em;
  right: -3px;
}
.period {
  color: rgba(112, 112, 112, 0.71);
}
.cardContent {
  background: white;
  padding: 16px 0px !important;
}
.cardContent div {
  font-family: "BahjiiLight";
  font-size: 17px;
  color: black;
}
.invoiceNum {
  font-size: 12px;
  color: #707070;
}
.invoiceNum p {
  margin-bottom: 0px;
}
.invoiceNum p sub {
  bottom: 0;
  left: 0;
}
.v-card__actions >>> button {
  font-size: 14px !important;
}
</style>
