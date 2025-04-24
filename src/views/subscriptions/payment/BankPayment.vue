<template>
  <v-container class="mt-5">
    <div class="d-flex justify-center align-center" style="gap: 30px">
      <v-card class="d-flex flex-column justify-center align-center pt-2">
        <v-img src="../../../assets/imgs/elAhly.png" alt="" width="107px" height="45px" class="elevation-0"></v-img>
        <v-card-text class="text-center">
          <p>{{ $t("companyName") }}</p>
          <p>
            <span style="color: #2bb3b3">رقم الحساب </span> 12367262000108
          </p>
          <p>
           SA9610000012367262000108  <span style="color: #2bb3b3">IBAN</span> 
          </p>
        </v-card-text>
      </v-card>
    </div>
    <v-form class="d-flex justify-center align-center mt-5" ref="form" v-model="valid">
      <v-row class="bank-payment">
        <v-col cols="12" md="12" :class="[marginFive, 'pb-0']">
          <label :class="marginOne">{{ $t("clientName") }}</label>
          <v-text-field v-model="client_name" color="#d2d2d2" :rules="required" outlined
            :placeholder="$t('clientName')"></v-text-field>
        </v-col>
        <v-col cols="12" md="12" :class="[marginFive, 'pb-0 pt-0']">
          <label :class="marginOne">{{ $t("IBANnumber") }}</label>
          <v-text-field v-model="account" color="#d2d2d2" :rules="required" outlined
            :placeholder="$t('IBANnumber')"></v-text-field>
        </v-col>
        <v-col cols="12" md="12" :class="[marginFive, 'pb-0 pt-0']">
          <label :class="marginOne">{{ $t("accountNumber") }}</label>
          <v-text-field v-model="accountNum" color="#d2d2d2" :rules="required" outlined
            :placeholder="$t('accountNumber')"></v-text-field>
        </v-col>
        <v-col cols="12" md="12" :class="[marginFive, 'pb-0 pt-0']">
          <label :class="marginOne">{{ $t("accontName") }}</label>
          <v-text-field v-model="paidAccountName" color="#d2d2d2" :rules="required" outlined
            :placeholder="$t('accontName')"></v-text-field>
        </v-col>
        <v-col cols="12" md="12" :class="[marginFive, 'pb-0 pt-0']">
          <label :class="marginOne"> {{ $t("paymentAmount") }}</label>
          <v-text-field v-model="paymentAmount" color="#d2d2d2" :rules="required" outlined
            :placeholder="$t('paymentAmount')"></v-text-field>
        </v-col>
        <v-col cols="12" md="12" class="text-center img-file">
          <p>{{ $t("transferImage") }}</p>
          <label v-ripple for="upload_img" class="cursor-pointer">
            <v-file-input v-model="image" style="display: none" id="upload_img" @change="onFileChange"
              accept="image/png, image/jpeg, image/bmp"></v-file-input>
            <v-avatar width="60" height="60" tile>
              <v-img v-if="selectedImg" :src="selectedImg"></v-img>
              <v-icon v-else>photo_camera</v-icon>
            </v-avatar>
          </label>
        </v-col>
        <v-col cols="12" md="12" :class="[marginFive, 'mt-3']">
          <v-btn color="#4FCA9A" width="90%" dark @click="handlePayment">{{ $t('send') }}</v-btn>
        </v-col>
      </v-row>
    </v-form>
    <alert-dialog v-if="successDialog" @close="close" :close="close">
      <template #title>
        {{ message }}
      </template>
      <template #default>
        <v-btn color="#62C83F" class="rounded-lg white--text" width="200" to="/cashier">{{ $t("done") }}</v-btn>
      </template>
    </alert-dialog>
  </v-container>
</template>
<script>
import axios from "axios";
import AlertDialog from "@/components/UI/AlertDialog.vue";
export default {
  components: { AlertDialog },
  props: ["pay_id"],
  data() {
    return {
      client_name: "",
      account: "",
      accountNum: "",
      paidAccountName: "",
      paymentAmount: "",
      selectedImg: null,
      image: {},
      successDialog: false,
      message: null,
      valid: false,
      required: [(v) => !!v || this.$t("fieldRequired")],
    };
  },
  methods: {
    onFileChange(e) {
      this.selectedImg = URL.createObjectURL(e);
    },
    handlePayment() {
      if (!this.$refs.form.validate()) return;
      axios
        .post(
          "checkout/bank-transfer",
          {
            bank_data: {
              pay_id: this.pay_id,
              name: this.client_name,
              account: this.account,
              account_number: this.accountNum,
              paid_account_name: this.paidAccountName,
              amount: this.paymentAmount,
              image: this.image,
            },
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "content-type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          this.openSuccessDialog(res.data.message);
        })
        .catch((err) => console.log(err.response.data.errors));
    },
    openSuccessDialog(message) {
      this.message = message;
      this.successDialog = true;
    },
    close() {
      this.successDialog = false;
      this.$store.dispatch("meDetail");
    },
  },
  computed: {
    marginFive() {
      return this.$i18n.locale == "en" ? "ml-5" : "mr-5";
    },
    marginOne() {
      return this.$i18n.locale == "en" ? "ml-1" : "mr-1";
    },
  },
};
</script>
<style scoped>
.v-card__text p {
  font: 0.75rem "BahjiiBold";
  color: black;
}

.bank-payment label {
  font-family: "BahjiiLight";
  font-size: 16px;
  letter-spacing: 0;
}

.bank-payment>>>.v-input {
  width: 90%;
}

.bank-payment>>>.v-input__slot {
  min-height: 45px !important;
  padding: 0px 10px !important;
  margin-top: 5px;
}

.bank-payment>>>fieldset {
  border: 1px solid #d2d2d2 !important;
  border-radius: 10px;
}

.bank-payment>>>fieldset:focus {
  outline: #d2d2d2;
}

.file-upload__input {
  position: absolute;
  left: 0;
  top: 0;
  font-size: 1;
  width: 0;
  height: 100%;
  opacity: 0;
}

.file-upload {
  position: relative;
  display: inline-block;
  text-align: center;
}

.img-file label {
  cursor: pointer !important;
  border: 1px solid #d2d2d2 !important;
  padding: 30px 15px !important;
}

.file-upload__label:hover {
  cursor: pointer;
}

p {
  font-family: "BahjiiBold";
  font-size: 18px;
  margin-bottom: 25px;
}
</style>
