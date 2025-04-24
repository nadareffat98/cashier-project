<template>
  <v-container class="mt-5">
    <div class="d-flex justify-space-between align-center my-3">
      <h2>{{ $t("taxReturns") }}</h2>
      <v-btn outlined color="#62C83F" class="btn" @click="download('pdf')" :icon="$vuetify.breakpoint.width < 321"
        v-if="$route.params.type == 'show'">
        <span v-if="$vuetify.breakpoint.width > 321">{{ $t("exportReport") }}</span>
        <v-icon v-else>picture_as_pdf</v-icon>
      </v-btn>
    </div>
    <div class="d-flex justify-start align-center date-search-container mb-3">
      <date-picker v-model="dateRange" range :lang="$i18n.locale" class="date-picker-container"
        :class="[$i18n.locale == 'ar' ? 'ar-date-picker' : '', 'date-picker']" format="DD-MM-YYYY"
        @input="formattedDateRange" :disabled-date="disabledDates"></date-picker>
      <v-btn outlined color="#4FCA9A" :class="[marginFour, 'rounded-lg']" height="30" min-width="0" width="10"
        @click="search">
        <v-icon color="grey"> search </v-icon>
      </v-btn>
    </div>
    <v-row no-gutters>
      <v-expansion-panels class="mt-2">
        <v-expansion-panel>
          <v-expansion-panel-header class="justify-space-between mt-2 header">
            {{ $t("salesReport") }}
          </v-expansion-panel-header>
          <v-expansion-panel-content class="content">
            <div class="above-sales-content rounded-lg rounded-b-0">
              <p>{{ $t("taxableSales") }} :</p>
              <span>{{
                $RoundingNumber(taxReturn["sales"]) + " " + $t("SRmini")
              }}</span>
            </div>
            <div class="above-sales-content">
              <p>{{ $t("salesTax") }} :</p>
              <span>{{
                $RoundingNumber(taxReturn["sales_tax"]) + " " + $t("SRmini")
              }}</span>
            </div>
            <div class="above-sales-content">
              <p>{{ $t("refundInvoice") }} :</p>
              <span>{{
                $RoundingNumber(taxReturn["sales_refund"]) + " " + $t("SRmini")
              }}</span>
            </div>
            <div class="above-sales-content rounded-lg rounded-t-0">
              <p>{{ $t("salesReundTax") }} :</p>
              <span>{{
                $RoundingNumber(taxReturn["sales_refund_tax"]) +
                " " +
                $t("SRmini")
              }}</span>
            </div>
            <div class="footer-sales-content mt-2 rounded-lg rounded-b-0">
              <p>{{ $t("totalSales") }} :</p>
              <span>{{
                $RoundingNumber(totalSales) + " " + $t("SRmini")
              }}</span>
            </div>
            <div class="footer-sales-content rounded-lg rounded-t-0">
              <p>{{ $t("totalSalesTax") }} :</p>
              <span>{{
                $RoundingNumber(totalSalesTax) + " " + $t("SRmini")
              }}</span>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-expansion-panels class="mt-2">
        <v-expansion-panel>
          <v-expansion-panel-header class="justify-space-between mt-2 header">
            {{ $t("purchasesReports") }}
          </v-expansion-panel-header>
          <v-expansion-panel-content class="content mt-4">
            <div class="above-purchases-content rounded-lg rounded-b-0">
              <p>{{ $t("taxablePurchases") }} :</p>
              <v-text-field v-if="meDetails && !meDetails['subscription']['purchase_invoices'] &&
                $route.params.type == 'add'
                " v-model="taxReturn.purchases" @input="calculatePurchase" type="number" maxlength="4" color="#d2d2d2"
                outlined hide-details style="max-width: 15%">
              </v-text-field>
              <span v-else>{{ taxReturn.purchases + " " + $t("SRmini") }}</span>
            </div>
            <div class="above-purchases-content">
              <p>{{ $t("purchaseTax") }} :</p>
              <span>{{ taxReturn.purchases_tax + " " + $t("SRmini") }}</span>
            </div>
            <div class="above-purchases-content">
              <p>{{ $t("purchaseRefunds") }} :</p>
              <v-text-field v-if="meDetails && !meDetails['subscription']['purchase_invoices'] &&
                $route.params.type == 'add'
                " v-model="taxReturn.purchases_refund" @input="calculatePurchase" type="number" maxlength="4"
                color="#d2d2d2" outlined hide-details style="max-width: 15%">
              </v-text-field>
              <span v-else>{{
                taxReturn.purchases_refund + " " + $t("SRmini")
              }}</span>
            </div>
            <div class="above-purchases-content">
              <p>{{ $t("purchaseRefundsTax") }} :</p>
              <span>{{
                taxReturn.purchases_refund_tax + " " + $t("SRmini")
              }}</span>
            </div>
            <div class="footer-purchases-content mt-2 rounded-lg rounded-b-0">
              <p>{{ $t("totalPurchases") }} :</p>
              <span>{{
                $RoundingNumber(totalPurchases) + " " + $t("SRmini")
              }}</span>
            </div>
            <div class="footer-purchases-content rounded-lg rounded-t-0">
              <p>{{ $t("totalPurchaseTax") }} :</p>
              <span>{{
                $RoundingNumber(totalPurchaseTax) + " " + $t("SRmini")
              }}</span>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-col cols="12" md="12" class="mt-5 mb-3">
        <div class="d-flex justify-space-between tax">
          <p>{{ $t("valueOfTaxDue") }} :</p>
          <span>{{ valueOfTaxDue + " " + $t("SRmini") }} </span>
        </div>
      </v-col>
      <v-col cols="12" md="12" class="mt-5 mb-3" align="center">
        <v-btn @click="createTexReturn" v-if="$route.params.type == 'add'" dark color="#4FCA9A" class="actions">
          {{ $t("addTaxReturn") }}
        </v-btn>
      </v-col>
    </v-row>
    <alert-dialog v-if="warningDialog" :buttonName="$t('done')" color="#62C83F" :close="close" @close="close">
      <template #title>
        {{ warningMessage }}
      </template>
    </alert-dialog>
    <alert-dialog v-if="successfulDialog" :buttonName="$t('done')" color="#62C83F" :close="close" @close="close">
      <template #title> {{ $t("doneSuccessfuly") }} </template>
      <template #default>
        <div class="d-flex flex-column justify-center align-center">
          <v-btn color="#4FCA9A" class="rounded-lg font-weight-bold text-subtitle-1 px-1" dark @click="returnToTaxReturn">
            {{ $t("backToTaxReturn") }}
          </v-btn>
          <v-btn color="#4FCA9A" class="rounded-lg font-weight-bold text-subtitle-1 mt-5" dark @click="download('print')">
            {{ $t("printReport") }}
          </v-btn>
          <v-btn color="#4FCA9A" class="rounded-lg font-weight-bold text-subtitle-1 mt-5" dark @click="download('pdf')">
            {{ $t("exportReport") }}
          </v-btn>
        </div>
      </template>
    </alert-dialog>
  </v-container>
</template>
<script>
import axios from "axios";
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import 'vue2-datepicker/locale/ar';
import 'vue2-datepicker/locale/en';
export default {
  components: {
    DatePicker
  },
  data() {
    return {
      meDetails: null,
      taxReturn: {
        sales: 0,
        sales_tax: 0,
        sales_refund: 0,
        sales_refund_tax: 0,
        purchases: 0,
        purchases_tax: 0,
        purchases_refund: 0,
        purchases_refund_tax: 0,
      },
      tax: 0,
      dateRange: [],
      formattedDate: [],
      successfulDialog: false,
      warningDialog: false,
      warningMessage: "",
      addTaxReturn: false,
    };
  },
  methods: {
    getData() {
      this.meDetails = JSON.parse(localStorage.getItem("meDetails"));
      this.$store.dispatch("tax");
      if (this.$route.params.type == "show") {
        axios
          .get(`tax-returns/${this.$route.params.id}`, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
          .then((res) => {
            this.taxReturn = res.data.data;
            this.calculateTotal();
          })
          .catch((err) => {
            if (err.response.data.message == "Unauthenticated.")
              this.$store.dispatch("logout");
          });
      }
    },
    // search for tax return at specific date
    search() {
      if (this.dateRange.length == 0 || this.dateRange[0] == null || this.dateRange[1] == null) {
        this.warningMessage = this.$t("dateTaxReturnAlert");
        this.warningDialog = true;
      } else {
        axios
          .get("tax-returns/create", {
            params: {
              date_from: this.formattedDate[0],
              date_to: this.formattedDate[1],
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            this.taxReturn = res.data.data;
            if (!this.meDetails["subscription"]["purchase_invoices"])
              this.taxReturn["purchases"] =
                this.taxReturn["purchases_tax"] =
                this.taxReturn["purchases_refund"] =
                this.taxReturn["purchases_refund_tax"] =
                0;
            this.addTaxReturn = true;
          })
          .catch((err) => {
            if (err.response.data.message == "Unauthenticated.")
              this.$store.dispatch("logout");
          });
      }
    },
    calculatePurchase() {
      this.taxReturn.purchases_tax = this.$RoundingNumber(
        this.taxReturn.purchases * this.getTax
      );
      this.taxReturn.purchases_refund_tax = this.$RoundingNumber(
        this.taxReturn.purchases_refund * this.getTax
      );
    },
    // to download tax return as pdf
    download(type) {
      this.$router.push({
        name: "print-tax-return",
        params: {
          taxReturnDetails: this.taxReturn,
          type: type,
        },
      });
    },
    createTexReturn() {
      if (!this.addTaxReturn) {
        this.warningMessage = this.$t("dateTaxReturnAlert");
        this.warningDialog = true;
      }
      else {
        axios
          .post(
            "tax-returns",
            {
              purchases: this.taxReturn.purchases,
              purchases_tax: this.taxReturn.purchases_tax,
              purchases_refund: this.taxReturn.purchases_refund,
              purchases_refund_tax: this.taxReturn.purchases_refund_tax,
              date_from: this.formattedDate[0],
              date_to: this.formattedDate[1],
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then((res) => {
            this.taxReturn = res.data.data;
            this.successfulDialog = true;
          })
          .catch((err) => {
            this.warningMessage = err.response.data.message;
            this.warningDialog = true;
          });
      }
    },
    formattedDateRange(event) {
      if (event.length != 0 && event[0] != null && event[1] != null) {
        this.formattedDate = [...event];
        var day = [];
        var month = [];
        var year = []
        for (var i = 0; i < event.length; i++) {
          this.formattedDate[i] = new Date(event[i]);
          day[i] = event[i].getDate();
          month[i] = event[i].getMonth() + 1;
          year[i] = event[i].getFullYear();
          this.formattedDate[i] = `${day[i]}-${month[i]}-${year[i]}`
        }
      }
    },
    disabledDates(date) {
      const today = new Date();
      return date > today;
    },
    // return to tax returns page
    returnToTaxReturn() {
      this.$router.push({ name: "tax-returns" });
    },
    close() {
      this.successfulDialog = false;
      this.warningDialog = false;
    },
  },
  computed: {
    getTax() {
      return this.$store.getters.getTax;
    },
    totalSales() {
      return this.taxReturn.sales - this.taxReturn.sales_refund;
    },
    totalSalesTax() {
      return this.totalSales * this.getTax;
    },
    totalPurchases() {
      return this.taxReturn.purchases - this.taxReturn.purchases_refund;
    },
    totalPurchaseTax() {
      return this.taxReturn.purchases_tax - this.taxReturn.purchases_refund_tax;
    },
    valueOfTaxDue() {
      return this.$RoundingNumber(this.totalSalesTax - this.totalPurchaseTax);
    },
    marginFour() {
      return this.$i18n.locale == "en" ? "ml-5" : "mr-4";
    },
    marginThree() {
      return this.$i18n.locale == "en" ? "ml-3" : "mr-3";
    },
  },
  mounted() {
    this.getData();
  },
};
</script>
<style scoped>
@import "../../assets/styles/style.css";

.btn {
  font-size: 14px;
  border-width: 3px !important;
  letter-spacing: 0px;
}

.header {
  font-size: 1.125rem;
}

.header::v-deep .v-expansion-panel-header__icon {
  margin-left: 0px !important;
}

.header::v-deep i {
  color: black !important;
  font-size: 30px;
}

.content div {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content div p,
.tax p {
  font-size: 1rem;
}

.content div span,
.tax span {
  font-size: 0.9rem;
}

.above-sales-content,
.above-purchases-content {
  background: #d8ead2;
  padding: 10px 15px;
  border-bottom: 1px solid #c1d0bd;
}

.footer-sales-content,
.footer-purchases-content {
  background: #f4cccc;
  padding: 10px 15px;
  border-bottom: 1px solid #c1d0bd;
}

.above-sales-content:nth-of-type(4),
.above-purchases-content:nth-of-type(4),
.footer-sales-content:last-of-type,
.footer-purchases-content:last-of-type {
  border-bottom: none;
}

.tax {
  background: #4fca9b;
  border-radius: 10px;
  padding: 10px 15px;
  color: white;
}

.v-text-field :deep(.v-input__slot) {
  min-height: 38px !important;
}

.date-picker :deep(input) {
  border-radius: 12px;
  border-color: #4fca9a;
  box-shadow: none;
}

.date-picker :deep(input:hover),
.date-picker :deep(input:focus-visible) {
  border-color: #4fca9a;
}

.date-picker :deep(i) {
  color: #4fca9a;
}

.ar-date-picker :deep(input) {
  direction: ltr;
  padding-left: 30px !important;
}

.ar-date-picker :deep(i) {
  left: 8px;
  right: auto !important;
}

@media (min-width:1024px) {
  .date-search-container {
    width: 40%;
  }
}

@media (max-width:425px) {

  .content div p,
  .tax p {
    font-size: 0.8rem;
  }

  .header {
    font-size: 0.9rem;
  }

  .v-expansion-panel--active>.v-expansion-panel-header {
    min-height: 55px;
  }
}
</style>
