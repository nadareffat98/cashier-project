<template>
  <v-container
    class="mt-2 container"
    id="printArea"
    :style="$i18n.locale == 'en' ? 'direction:ltr' : 'direction:rtl'"
  >
    <h1>{{ $t("storeReport") }}</h1>
    <table :class="$i18n.locale == 'en' ? 'eng-table' : ''">
      <thead>
        <tr>
          <th v-for="header in headers" :key="header">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="report in $route.params.reports" :key="report.id">
          <td
            v-if="
              reportRole == 'payment-method-sales' ||
              reportRole == 'employee-sales' ||
              reportRole == 'client-sales' ||
              reportRole == 'supplier-purchases' ||
              reportRole == 'sales-channel'
            "
          >
            {{ new Date(report.invoice_date).toLocaleDateString("en-US") }}
          </td>
          <td v-else>
            {{ new Date(report.created_at).toLocaleDateString("en-US") }}
          </td>
          <td>{{ report.invoice_number }}</td>
          <td>{{ $RoundingNumber(report.tprice_before_tax,'product') }}</td>
          <td>{{ $RoundingNumber(report.tprice_after_tax,'product') }}</td>
          <td>{{ report.refund_id == null ? $t("sale") : $t("refund") }}</td>
        </tr>
      </tbody>
    </table>
    <div
      class="content"
      v-if="reportRole == 'sales' || reportRole == 'purchases'"
    >
      <!-- <h1 style="margin-top: 10px">
        {{ reportRole == "sales" ? $t("sales") : $t("purchases") }}
      </h1> -->
      <div>
        <p>{{ $t("subtotalUnTaxedSales") }}</p>
        <span>{{
          $RoundingNumber($route.params.totalSalesUntaxed,'total') + " " + $t("SRmini")
        }}</span>
      </div>
      <div>
        <p>{{ $t("totalTax") }}</p>
        <span>{{
          $RoundingNumber($route.params.totalTax,'total') + " " + $t("SRmini")
        }}</span>
      </div>
      <div>
        <p>{{ $t("subtotalSales") }}</p>
        <span>{{
          $RoundingNumber($route.params.totalSalesTaxed,'total') + " " + $t("SRmini")
        }}</span>
      </div>
    </div>
    <div
      class="content"
      v-if="reportRole == 'refund-sales' || reportRole == 'refund-purchases'"
    >
      <!-- <h1 style="margin-top: 10px">{{ reportRole == "refund-sales" ? $t("sales") : $t("purchases") $t("refunds") }}</h1> -->
      <div>
        <p>{{ $t("subtotalUnTaxedRefundSales") }}</p>
        <span>{{
          $RoundingNumber($route.params.totalRefundsUntaxed,'total') +
          " " +
          $t("SRmini")
        }}</span>
      </div>
      <div>
        <p>{{ $t("totalTax") }}</p>
        <span>{{
          $RoundingNumber($route.params.totalRefundTax,'total') + " " + $t("SRmini")
        }}</span>
      </div>
      <div style="border-bottom: 1px solid black">
        <p>{{ $t("subtotalRefundSales") }}</p>
        <span>{{
          $RoundingNumber($route.params.totalRefundsTaxed,'total') + " " + $t("SRmini")
        }}</span>
      </div>
    </div>
  </v-container>
</template>
<script>
import html2pdf from "html2pdf.js";
export default {
  data() {
    return {
      headers: [
        this.$t("createDate"),
        this.$t("invoiceNumber"),
        this.$t("priceBeforeTax"),
        this.$t("priceAfterTax"),
        this.$t("invoiceType"),
      ],
      reportRole: null,
    };
  },
  methods: {
    printReport() {
      html2pdf(document.getElementById("printArea"), {
        margin: 0,
        filename: "reports.pdf",
        image: { type: ["png", "jpeg"] },
        html2canvas: {
          scale: 1,
          scrollY: 0,
          useCORS: true,
        },
        jsPDF: {
          unit: "in",
          orientation: "landscape",
        },
      });
    },
  },
  mounted() {
    this.reportRole = this.$route.params.reportRole;
    this.printReport();
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
h1 {
  font-size: 25px;
  font-family: "BahjiiSemiBold";
}
table {
  border-radius: 0.5em;
  border: 3px solid rgba(211, 211, 211, 1);
  /* border-spacing: 0; */
  border-collapse: separate;
  font-size: 20px;
  font-weight: bold;
  margin-top: 20px;
  width: 80%;
  text-align: center;
}
tr:not(:last-child) td,
tr th {
  border-bottom: 3px solid rgba(211, 211, 211, 1);
}
tbody tr:nth-child(odd) {
  background-color: #f2f2f2;
}
td,
th {
  padding: 8px;
}
th:not(:last-child),
td:not(:last-child) {
  border-left: 3px solid rgba(211, 211, 211, 1);
}
.eng-table th:not(:last-child),
.eng-table td:not(:last-child) {
  border-left: none;
  border-right: 3px solid rgba(211, 211, 211, 1);
}
.content {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
.content div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 60%;
  margin-top: 10px;
}
.content div p,
.content div span {
  font-family: "BahjiiBold";
  font-size: 20px;
  margin-bottom: 0px;
  letter-spacing: 0 !important;
}
</style>
