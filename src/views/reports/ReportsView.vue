<template>
  <v-container>
    <v-row align="center" justify="center" class="py-5 mt-3">
      <v-col
        cols="12"
        sm="4"
        xs="12"
        v-for="(reportType, index) in filterReportsType"
        :key="index"
      >
        <v-btn
          :outlined="activeButtonIndex == index ? false : true"
          :dark="activeButtonIndex == index ? true : false"
          color="#4fca9a"
          class="mb-2 py-4 report-type-button"
          height="45"
          @click="selectReportType(index, reportType)"
        >
          <v-icon>{{ reportType.icon }}</v-icon>
          <span class="mr-2">{{ reportType.name }}</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row align="center" justify="start" class="py-5 mt-0">
      <v-col v-for="(report, i) in filterReports" :key="i" cols="12" md="4">
        <v-card class="mx-auto" @click="goToReportList(report)">
          <div class="mb-1 px-3 py-2" style="font-size: 1rem !important">
            {{ report.name }}
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      reportTypes: [
        { name: this.$t("sales"), icon: "mdi-receipt-text-outline" },
        { name: this.$t("purchases"), icon: "mdi-cart-outline" },
      ],
      reports: [
        {
          name: this.$t("salesReport"),
          role: "sales",
          reportType: this.$t("sales"),
        },
        {
          name: this.$t("refundSalesReport"),
          role: "refund-sales",
          reportType: this.$t("sales"),
        },
        {
          name: this.$t("paymentMethodSales"),
          role: "payment-method-sales",
          reportType: this.$t("sales"),
        },
        {
          name: this.$t("employeeSalesReport"),
          role: "employee-sales",
          reportType: this.$t("sales"),
        },
        {
          name: this.$t("clientSalesReport"),
          role: "client-sales",
          reportType: this.$t("sales"),
        },
        {
          name: this.$t("tilerSalesReport"),
          role: "sales-channel",
          reportType: this.$t("sales"),
        },
        {
          name: this.$t("productSalesReport"),
          role: "sales-product",
          reportType: this.$t("sales"),
        },
        {
          name: this.$t("purchasesReport"),
          role: "purchases",
          reportType: this.$t("purchases"),
        },
        {
          name: this.$t("refundPurchasesReport"),
          role: "refund-purchases",
          reportType: this.$t("purchases"),
        },
        {
          name: this.$t("supplierPurchasesReport"),
          role: "supplier-purchases",
          reportType: this.$t("purchases"),
        },
      ],
      activeButtonIndex: 0,
      activeReportType: this.$t("sales"),
      userType: JSON.parse(localStorage.getItem("meDetails")).user_type,
    };
  },
  methods: {
    selectReportType(index, reportType) {
      this.activeButtonIndex = index;
      this.activeReportType = reportType.name;
    },
    goToReportList(report) {
      localStorage.setItem("report", JSON.stringify(report));
      const reportRole = report.role;
      this.$router.push({
        name: "reportsList",
        params: { reportRole, report },
      });
    },
  },
  computed: {
    filterReportsType() {
      return this.userType == 0
        ? this.reportTypes
        : this.reportTypes.filter((item) => item.name != this.$t("purchases"));
    },
    filterReports() {
      return this.userType == 0
        ? this.reports.filter((item) => {
            return item.reportType == this.activeReportType;
          })
        : this.reports.filter(
            (item) => item.name == this.$t("productSalesReport")
          );
    },
  },
};
</script>
<style scoped>
@import "../../assets/styles/style.css";

.report-type-button {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 8px;
  width: 90%;
  font-family: "BahjiiSemiBold";
  font-size: 16px;
}
</style>
