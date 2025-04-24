<template>
  <v-dialog max-width="450px" v-model="show" @click:outside="close">
    <v-card>
      <v-container class="pt-0">
        <v-card-title class="d-flex justify-space-between align-center pb-1">
          {{ $t("shiftReport") }}
          <v-icon color="black" @click="close">mdi-close</v-icon></v-card-title
        >
        <v-divider></v-divider>
        <v-card-text v-if="shiftReportDetails">
          <div
            class="shift-time d-flex justify-center align-center"
            style="gap: 15px"
          >
            <p>
              <b>{{ $t("from") + " : " }}</b
              >{{ shiftReportDetails["shift"]["shift_start_time"] }}
            </p>
            <p>
              <b>{{ $t("to") + " : " }}</b
              >{{ shiftReportDetails["shift"]["shift_end_time"] }}
            </p>
          </div>
          <div
            class="tiler-details d-flex flex-column justify-center align-center"
          >
            <p>
              <b>{{ $t("username") + " : " }}</b>
              {{
                userType == 1
                  ? shiftReportDetails["shift"]["employee"]["name"]
                  : shiftReportDetails["shift"]["name"]
              }}
            </p>
            <p>
              <b>{{ $t("tilerName") + " : " }}</b>
              {{ shiftReportDetails["tiler"]["name"] }}
            </p>
            <p>
              <b>{{ $t("startShiftCash") + " : " }}</b>
              {{ shiftReportDetails["shift"]["cash_at_check_in"] }}
            </p>
          </div>
          <v-divider></v-divider>
          <div
            class="tiler-sales-container d-flex flex-column justify-center align-start mt-2"
          >
            <p>
              <b>{{ $t("subtotalSales") + " : " }}</b>
              {{ shiftReportDetails["taxed_orders_total"] }}
            </p>
            <p>
              <b>{{ $t("subtotalUnTaxedSales") + " : " }}</b>
              {{ shiftReportDetails["untaxed_orders_total"] }}
            </p>
            <p>
              <b>{{ $t("salesTax") + " : " }}</b>
              {{ shiftReportDetails["orders_tax"] }}
            </p>
            <p>
              <b>{{ $t("salesInvoicesNum") + " : " }}</b>
              {{ shiftReportDetails["orders_count"] }}
            </p>
            <p>
              <b>{{ $t("subtotalTaxedRefundSales") + " : " }}</b>
              {{ shiftReportDetails["taxed_refund_orders_total"] }}
            </p>
            <p>
              <b>{{ $t("subtotalUnTaxedRefundSale") + " : " }}</b>
              {{ shiftReportDetails["untaxed_refund_orders_total"] }}
            </p>
            <p>
              <b>{{ $t("salesReundTax") + " : " }}</b>
              {{ shiftReportDetails["refund_orders_tax"] }}
            </p>
            <p>
              <b>{{ $t("salesRefundInvoicesNum") + " : " }}</b>
              {{ shiftReportDetails["refund_orders_count"] }}
            </p>
          </div>
          <v-divider></v-divider>
          <div class="payment-method-tiler mt-2" v-if="shiftReportDetails">
            <!-- <p>
              <b>{{ $t("totalPaymentCash") + " : " }}</b>
              {{ shiftReportDetails["total_cash"] }}
            </p>
            <p>
              <b>{{ $t("totalPaymentTransfer") + " : " }}</b>
              {{ shiftReportDetails["total_transfer"] }}
            </p>
            <p>
              <b>{{ $t("totalPaymentVisa") + " : " }}</b>
              {{ shiftReportDetails["total_visa"] }}
            </p> -->
            <p>
              <b>{{ $t("totalDiscount") + " : " }}</b>
              {{ shiftReportDetails["total_discount"] }}
            </p>
          </div>
          <v-divider></v-divider>
          <div class="total-tiler" v-if="shiftReportDetails">
            <p>
              <b>{{ $t("totalTax") + " : " }}</b>
              {{ shiftReportDetails["total_tax"] }}
            </p>
            <p>
              <b>{{ $t("totalPrice") + " : " }}</b>
              {{ shiftReportDetails["total_amount"] }}
            </p>
          </div>
        </v-card-text>
        <v-card-actions class="justify-center" v-if="title == 'cashier'">
          <v-btn
            color="#EF0B0B"
            class="rounded-lg white--text mb-2"
            max-width="200"
            @click="handleEndShift"
            >{{ $t("closeShift") }}</v-btn
          >
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      show: true,
      shiftReportDetails: null,
    };
  },
  methods: {
    setData() {
      console.log("shift")
      axios
        .get(`shifts/${this.shift.id}/report`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "X-localization": this.$i18n.locale,
          },
        })
        .then((res) => {
          this.shiftReportDetails = res.data.data;
        })
        .catch((err) => console.log(err));
    },
    handleEndShift() {
      this.$emit("endShift");
    },
  },
  props: {
    close: Function,
    title: String,
    shift: Object,
    userType:Number
  },
  mounted() {
    this.setData();
  },
};
</script>
<style scoped>
.v-card__text {
  color: black !important;
  font-family: "BahjiiLight" !important;
}
.v-card__text .tiler-sales-container p,
.v-card__text .payment-method-tiler p,
.v-card__text .total-tiler p {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 10px;
  margin-bottom: 10px !important;
}
</style>
