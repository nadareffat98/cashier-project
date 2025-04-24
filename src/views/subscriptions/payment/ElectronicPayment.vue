<template>
  <v-container class="mt-5 el">
    <!-- <v-row class="iframe">
      <iframe :src="externalUrl" frameborder="0" style="width: 150px;height: 150px;"></iframe>
    </v-row> -->
    <v-row>
      <v-col cols="12" md="12" class="mt-2" v-if="errors">
        <v-alert type="error" dense outlined>{{ errors }}</v-alert>
      </v-col>
      <v-col
        cols="12"
        md="12"
        :class="[$i18n.locale == 'en' ? 'ml-1' : 'mr-1', 'pb-0 pt-0']"
        :dir="$i18n.locale == 'en' ? 'rtl' : 'ltr'"
      >
        <v-credit-card
          @change="onInputChanged"
          :acceptBusinessCard="false"
          :showValidMark="true"
          :noCard="true"
          ref="vueCreditCard"
        />
      </v-col>
      <v-col cols="12" md="12" class="pb-0 d-flex align-center justify-center">
        <div class="d-flex justify-space-between align-center total">
          <div>
            <p class="mb-2">{{ $t("total") }}</p>
            <p>{{ $t("totalWithTax") }}</p>
          </div>
          <div>
            <h3>
              {{ title == "buyPackage" ? packagePrice : getUserPrice }}
              <sub>{{ $t("SRmini") }}</sub>
            </h3>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="12" class="d-flex justify-center">
        <v-btn color="#4FCA9A" width="60%" dark @click="processPayment">{{
          $t("checkout")
        }}</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import axios from "axios";
export default {
  props: ["packagePrice", "pay_id", "title"],
  data() {
    return {
      valid: false,
      paymentForm: null,
      name: "",
      cardNumber: "",
      expiration: "",
      security: "",
      errors: null,
      requiredRules: [(v) => !!v || this.$t("fieldRequired")],
    };
  },
  methods: {
    changeLabel() {
      document.getElementById("labelName").textContent =
        document.getElementById("name").placeholder = this.$t("nameOnCard");
      document.getElementById("cardNumber").placeholder =
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
      document.getElementById("labelCardNumber").textContent =
        this.$t("creditCartData");
      document.getElementById("securityCode").placeholder = this.$t("Cvv");
    },
    onInputChanged(values) {
      for (const key in values) {
        this[key] = values[key];
      }
    },
    styleVueCreditCard() {
      const inputFields =
        this.$refs.vueCreditCard.$el.querySelectorAll("input");
      if (this.$i18n.locale == "en") {
        inputFields.forEach((input) => {
          input.style.direction = "ltr";
          input.style.textAlign = "left !important";
          console.log(input);
        });
      }
    },
    processPayment() {
      this.errors = null;
      this.cardNumber = this.cardNumber.replace(/\s/g, "");
      if (
        this.name == "" ||
        this.cardNumber == "" ||
        this.expiration == "" ||
        this.security == ""
      ) {
        this.errors = this.$t("completeData");
        return;
      } else if (this.expireDate) {
        this.errors = this.$t("wrongEndedDate");
        return;
      }
      axios
        .post("https://api.moyasar.com/v1/payments", {
          publishable_api_key:localStorage.getItem("publishable_key"),
          amount:
            this.title == "buyPackage"
              ? this.packagePrice * 100
              : this.getUserPrice * 100,
          currency: "SAR",
          description: "باقة تجريبية",
          callback_url: process.env.VUE_APP_API_BASE + "/rollback-subscribe",
          metadata: {
            pay_id: this.pay_id,
          },
          source: {
            number: this.cardNumber,
            type: "creditcard",
            name: this.name,
            cvc: this.security,
            month: this.expiration.split("/")[0],
            year: this.expiration.split("/")[1],
          },
        })
        .then((res) => {
          // this.externalUrl=res.data.source.transaction_url
          window.open(res.data.source.transaction_url, "_blank");
          // setTimeout(() => {
          //   fetch('https://dev.efatorh.com/rollback-subscribe')
          //     .then((res) => console.log(res))
          //     .catch(() => console.log("error"));
          // }, 2000);
        })
        .then((res) => console.log(res))
        .catch((err) => (this.errors = err.response.data.errors));
    },
  },
  computed: {
    expireDate() {
      const [month, year] = this.expiration.split("/");
      const newDate = new Date(`20${year}`, month - 1, 1);
      if (newDate < new Date()) return true;
      else return false;
    },
    getUserPrice() {
      return this.$store.getters.getUserPrice;
    },
  },
  mounted() {
    this.changeLabel();
    this.styleVueCreditCard();
    // console.log(this.$refs.vueCreditCard.$el.querySelectorAll('input').style)
  },
};
</script>
<style scoped>
.vue-credit-card::v-deep input::placeholder {
  text-align: right !important;
}
.vue-credit-card::v-deep .success {
  background: none !important;
}
.vue-credit-card::v-deep label {
  font-family: "BahjiiLight";
  font-size: 16px;
  margin-right: 6px;
}
.vue-credit-card::v-deep input:focus {
  outline: #d2d2d2 !important;
}
.vue-credit-card::v-deep .field {
  align-items: flex-end !important;
}
.vue-credit-card::v-deep .credit-card-form div:nth-child(2) {
  margin-bottom: 0px !important;
}
.vue-credit-card::v-deep .field-group .field label {
  display: none;
}
.vue-credit-card::v-deep .field-group .field input {
  margin-top: 0px;
}
.vue-credit-card::v-deep .field-group .field {
  margin-right: 0px !important;
  margin-top: 0px !important;
}
.vue-credit-card::v-deep .field-group svg {
  top: 25% !important;
}
.total {
  max-width: 400px;
  width: 300px;
}
.total p:first-child,
button {
  font: 14px "BahjiiSemiBold";
}
.total p:last-child {
  font: 14px "BahjiiLight";
}
.total h3 {
  font: 30px "BahjiiSemiBold";
  color: #4fca9a;
}
.total h3 sub {
  font-size: 20px;
}
</style>
