<template>
  <v-container class="mt-5">
    <v-row no-gutters>
      <v-col cols="12" md="6" class="mt-5">
        <h2>{{ $t("payment") }}</h2>
        <v-btn-toggle
          class="d-flex flex-column align-center justify-start mt-5"
          v-if="title == 'buyPackage'"
        >
          <v-btn
            class="rounded-lg pt-5 pr-5 btn"
            width="100%"
            color="white"
            min-height="150"
            style="border-left-width: 1px"
            v-for="pack in packages"
            :key="pack.id"
            :class="[
              pack.price == '115' ? 'rounded-b-0' : 'rounded-t-0',
              subSelected.id == pack.id ? 'btnActive' : '',
            ]"
          >
            <div class="content">
              <p>12 {{ $t("month") }}</p>
              <h3 :style="subSelected.id == pack.id ? 'color:#4fca9a' : ''">
                {{ pack.price }} <sub>{{ $t("SRmini") }}</sub>
              </h3>
              <p>{{ $t("cancelSubscription") }}</p>
            </div>
            <v-icon color="#4fca9a" v-if="subSelected.id == pack.id"
              >radio_button_unchecked</v-icon
            >
          </v-btn>
        </v-btn-toggle>
        <v-img
          src="imgs/credit.png"
          :class="[$i18n.locale == 'en' ? 'ml-0' : 'mr-0', 'ma-8']"
          width="400"
          v-else
        ></v-img>
      </v-col>
      <v-col cols="12" md="6" class="mt-5">
        <div class="d-flex justify-space-around aliggn-center">
          <v-btn-toggle class="btnGroup" tile>
            <v-btn color="white" @click="selectedComp = 'electronic-payment'">
              {{ $t("ePayment") }}
            </v-btn>
            <v-btn color="white" @click="selectedComp = 'bank-payment'">
              {{ $t("wireTransfer") }}
            </v-btn>
          </v-btn-toggle>
        </div>
        <keep-alive>
          <component
            :is="selectedComp"
            :packagePrice="
              $route.params.remainPackDetails != null
                ? $route.params.remainPackDetails.difference_cost
                : subSelected.price
            "
            :pay_id="pay_id"
            :title="title"
          ></component>
        </keep-alive>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import ElectronicPayment from "./ElectronicPayment.vue";
import BankPayment from "./BankPayment.vue";
import axios from "axios";
export default {
  components: {
    ElectronicPayment,
    BankPayment,
  },
  data() {
    return {
      subSelected: {},
      selectedComp: "electronic-payment",
      packages: [],
      pay_id: null,
      title: null,
    };
  },
  methods: {
    selectPackage(pack) {
      this.subSelected = pack;
      this.getPayId(pack.id);
    },
    getPayId(id) {
      axios
        .get(`checkout/package/${id}`, {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          this.pay_id = res.data.pay_id;
        })
        .catch((err) => console.log(err));
    },
  },
  mounted() {
    this.title = localStorage.getItem("paymentTitle");
    if (this.title == "buyPackage") {
      axios
        .get("upgrade", {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          {
            this.packages = res.data.data;
            this.subSelected = this.$route.params.package;
            this.getPayId(this.subSelected.id);
          }
        });
    } else if (this.title == "buyUser") {
      axios
        .get("checkout/employee", {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          this.pay_id = res.data.result["pay_id"];
        })
        .catch((err) => console.log(err));
    }
  },
};
</script>

<style scoped>
.btnGroup button {
  border-left-width: 1px !important;
  font: 14px "BahjiiSemiBold";
  color: #666666;
  height: 39px !important;
  width: 150px;
  letter-spacing: 0;
}
.btn::v-deep .v-btn__content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  letter-spacing: 0;
}
.btn::v-deep .v-btn__content .content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.btn p:first-child {
  opacity: 0.42;
  color: #707070;
  font-family: "BahjiiSemiBold";
  font-size: 17px;
  margin-bottom: 0px;
}
.btn p:last-child {
  color: #707070;
  font: 14px "BahjiiSemiBold";
}
.btn h3 {
  font: 45px "BahjiiSemiBold";
}
.btn h3 sub {
  font-size: 20px;
}
</style>
