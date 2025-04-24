<template>
  <v-container class="mt-5">
    <div class="d-flex justify-start align-center mb-2">
      <date-picker v-model="dateRange" range :lang="$i18n.locale" class="date-picker-container"
        :class="[$i18n.locale == 'ar' ? 'ar-date-picker' : '', 'date-picker']" format="DD-MM-YYYY"
        @input="formattedDateRange" :disabled-date="disabledDates"></date-picker>
      <v-btn outlined color="#4FCA9A" :class="[marginFour, 'rounded-lg']" height="30" min-width="0" width="10"
        @click="filter" :disabled="searchAvailability ? false : true">
        <v-icon color="#4FCA9A"> mdi-filter </v-icon>
      </v-btn>
    </div>
    <v-list class="dashboard-container">
      <v-list-item-group v-model="selectedItem">
        <v-list-item v-for="(insight, i) in insights" :key="i">
          <template v-slot:default="{ active }" v-if="totals">
            <v-list-item-avatar class="dashboard-avatar" tile>
              <v-img src="../assets/imgs/active.png" v-if="active"></v-img>
              <v-img src="../assets/imgs/notActive.png" v-else></v-img>
            </v-list-item-avatar>
            <v-list-item-content class="dashboard-content pr-5">
              <v-list-item-subtitle :style="active ? 'color:white;' : 'color:#c3c6dd;'" style="font-size: 0.8rem">{{
                insight.title }}</v-list-item-subtitle>
              <v-list-item-subtitle :style="active ? 'color:white;' : 'color:black;'" style="font-size: 0.9rem"
                class="pt-1">
                {{
                  totals[insight.value] + " " + (insight.SR ? $t("SRmini") : "")
                }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <div class="chart-container d-flex justify-space-between align-start mt-4">
      <div :style="$vuetify.breakpoint.width > 850 ? 'width:30%' : 'width:100%'">
        <v-card class="invoice-container" elevation="4">
          <h2>{{ $t('invoices') }}</h2>
          <div v-if="invoiceSeries[0].data.length > 0 && invoiceOptions.xaxis.categories.length > 0">
            <apex-chart width="100%" height="420" type="line" :options="invoiceOptions" :series="invoiceSeries"
              :style="$i18n.locale == 'ar' ? 'direction: ltr;' : 'direction: rlt;'"></apex-chart>
          </div>
        </v-card>
      </div>
      <div :style="$vuetify.breakpoint.width > 850 ? 'width:40%' : 'width:100%'">
        <v-card class="product-container" elevation="4"
          v-if="productSeries[0].data.length > 0 && productOptions.xaxis.categories.length > 0">
          <h2 style="color: #4fca9a">{{ $t('topTenProducts') }}</h2>
          <apex-chart width="100%" height="420" type="bar" :options="productOptions" :series="productSeries"
            :style="$i18n.locale == 'ar' ? 'direction: ltr;' : 'direction: rlt;'"></apex-chart>
        </v-card>
      </div>
      <div class="d-flex flex-column justify-center align-center pie-chart-container"
        :style="$vuetify.breakpoint.width > 850 ? 'width:20%' : 'width:100%'" style="gap:20px">
        <v-card class="client-container" elevation="4"
          :style="$vuetify.breakpoint.width > 850 ? 'width: 100%' : 'width:50%'">
          <h2>{{ $t("invoices") }}</h2>
          <div>
            <apex-chart width="100%" height="220" type="pie" :options="invoicesOptions"
              :series="invoicesSeries"></apex-chart>
          </div>
        </v-card>
        <v-card class="payment-container" elevation="4" :style="$vuetify.breakpoint.width > 850 ? 'width: 100%' : 'width:50%'">
          <h2>{{ $t("paymentMethods") }}</h2>
          <div v-if="paymentMethodsSeries.length > 0 && paymentMethodsOptions.labels.length > 0">
            <apex-chart width="100%" height="220" type="pie" :options="paymentMethodsOptions"
              :series="paymentMethodsSeries"></apex-chart>
          </div>
        </v-card>
      </div>
    </div>
    <alert-dialog v-if="warningDialog" :buttonName="$t('done')" color="#62C83F" :close="() => (warningDialog = false)"
      @close="warningDialog = false">
      <template #title>
        {{ $t("dateAlert") }}
      </template>
    </alert-dialog>
  </v-container>
</template>
<script>
import axios from "axios";
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/locale/ar';
import 'vue2-datepicker/locale/en';
import 'vue2-datepicker/index.css';
export default {
  components: {
    DatePicker
  },
  data() {
    return {
      totals: null,
      selectedItem: 1,
      dateRange: [],
      formattedDate: [],
      searchAvailability: true,
      warningDialog: false,
      params: null,
      invoiceSeries: [{
        data: [],
      }],
      invoiceOptions: {
        xaxis: {
          type: 'category',
          categories: [],
        },
        stroke: {
          curve: 'straight',
          width: 2,
          colors: ['#D9D9D9']
        }
      },
      productSeries: [{
        data: []
      }],
      productOptions: {
        xaxis: {
          categories: [],
        },
        yaxis: {
          title: {
            text: "الكمية المباعه",
            style: {
              fontSize: '16px',
            }
          }
        },
        plotOptions: {
          bar: {
            columnWidth: '40%',
            distributed: true,
          }
        },
        colors: ['#4fca9a', '#5A70E1', '#D9D9D9'],
        legend: {
          show: false
        },
        dataLabels: {
          enabled: false
        },
      },
      invoicesSeries: [],
      invoicesOptions: {
        labels: [this.$t('taxed'), this.$t('untaxed')],
        legend: {
          position: 'bottom',
          fontFamily: "BahjiiSemiBold",
          fontSize: "12px",
        },
        dataLabels: {
          style: {
            fontFamily: 'BahjiiLight',
            fontWeight: 'normal',
            colors: ['#000']
          }
        },
        colors: ["#E3F8EF", "#5AE1AC"],
      },
      paymentMethodsSeries: [],
      paymentMethodsOptions: {
        labels: [],
        legend: {
          position: 'bottom',
          fontFamily: "BahjiiSemiBold",
          fontSize: "12px",
        },
        dataLabels: {
          style: {
            fontFamily: 'BahjiiLight',
            fontWeight: 'normal',
            colors: ['#000']
          }
        },
        colors: ["#E3F8EF", "#D9D9D9", "#5AE1AC", '#D9D9D9']
      },
    };
  },
  methods: {
    getData() {
      axios
        .get("dashboard", {
          params: { ...this.params },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "X-localization": this.$i18n.locale,
          },
        })
        .then((res) => {
          this.totals = res.data;
          this.getAnnualInvoiceRatios(this.totals)
          this.getTopTenProducts(this.totals)
          this.getTaxedUntaxedInvoiceRatios(this.totals)
          this.getPaymentRatios(this.totals)
          this.searchAvailability = true;
        });
    },

    //get invoices last year
    getAnnualInvoiceRatios(totals) {
      for (var i = 0; i < totals.orderCounts.length; i++) {
        const monthName = this.getMonthName(totals.orderCounts[i].month);
        this.invoiceOptions.xaxis.categories.push(monthName);
        this.invoiceSeries[0].data.push(totals.orderCounts[i].count);
      }
    },
    // get top ten products ratio
    getTopTenProducts(totals) {
      const products = totals.topTenProducts;
      console.log(products)
      if (products) {
        for (var i = 0; i < products.length; i++) {
          this.productOptions.xaxis.categories.push(products[i].product_id);
          this.productSeries[0].data.push(products[i].total_quantity_sales)
        }
      }
    },
    // get ratio of taxed and untaxed invoices
    getTaxedUntaxedInvoiceRatios(totals) {
      this.invoicesSeries = [totals.taxed_ratio, totals.untaxed_ratio]
    },
    // get ratio of payment method
    getPaymentRatios(totals) {
      const ratios = totals.ratios;
      var arr = []
      var arrLabels = [];
      for (var i = 0; i < ratios.length; i++) {
        arr.push(ratios[i].ratio * 100);
        arrLabels.push(this.$i18n.locale == 'ar' ? ratios[i].ar : ratios[i].en)
        if (i == ratios.length - 1) {
          this.paymentMethodsSeries = arr;
          this.paymentMethodsOptions.labels = arrLabels
        }
      }
    },
    getMonthName(monthNumber) {
      const date = new Date(Date.UTC(2000, monthNumber, 1));
      return date.toLocaleString(this.$i18n.locale == 'ar' ? "ar-EG" : 'default', { month: 'long' });
    },
    filter() {
      if (this.dateRange.length == 0 || this.dateRange[0] == null || this.dateRange[1] == null) {
        this.warningDialog = true
      }
      else {
        this.searchAvailability = false;
        this.params = {
          date_from: this.formattedDate[0], date_to: this.formattedDate[1]
        }
        this.getData();
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
  },
  computed: {
    insights() {
      return [
        {
          title: this.$t("salesInvoicesNum"),
          value: "orders_count",
          SR: false,
        },
        { title: this.$t("totalSales"), value: "total_amount_order", SR: true },
        {
          title: this.$t("totalRefundSales"),
          value: "total_amount_refund_order",
          SR: true,
        },
        {
          title: this.$t("purchasesInvoicesNum"),
          value: "purchase_count",
          SR: false,
        },
        {
          title: this.$t("totalPurchases"),
          value: "total_amount_purchase",
          SR: true,
        },
        {
          title: this.$t("totalRefundPurchases"),
          value: "total_amount_refund_purchase",
          SR: true,
        },
        {
          title: this.$t("totalProductsNum"),
          value: "total_products_count",
          SR: false,
        },
        {
          title: this.$t("totalPriceQuoteNum"),
          value: "total_quotationPrices_count",
          SR: false,
        },
      ];
    },
    marginFour() {
      return this.$i18n.locale == "en" ? "ml-4" : "mr-4";
    },
  },
  mounted() {
    this.getData();
  },
};
</script>
<style scoped>
.dashboard-container .v-item-group {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.dashboard-container .v-list-item-group .v-list-item--link:before {
  opacity: 0 !important;
}

.dashboard-container .v-list-item-group .v-list-item {
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.15);
  border-radius: 15px;
  background: white;
  font-family: "BahjiiSemiBold";
}

.dashboard-container .v-list-item-group .v-list-item--active {
  border-radius: 15px;
  background: #ff392b;
}

.client-container,
.payment-container,
.invoice-container,
.product-container {
  border-radius: 15px;
  padding: 10px;
}

.pie-chart-container h2 {
  font-size: 1.2rem;
  text-align: center;
  padding: 5px;
}

.chart-container h2 {
  font-size: 1rem;
  padding: 10px;
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

:deep(.apexcharts-legend-text) {
  margin-right: 5px;
}

:deep(.apexcharts-pie-series path:hover) {
  filter: none !important;
}

:deep(.apexcharts-tooltip) {
  color: black !important;
}

@media (max-width:851px) {
  .chart-container {
    flex-direction: column;
    gap:20px;
  }
  .pie-chart-container
  {
    flex-direction: row !important;
  }
  .client-container,
  .payment-container
  {
    height: 245px;
  }
}

@media (max-width:1024px) and (min-width:768px) {
  .dashboard-container .v-item-group {
    grid-template-columns: repeat(3, 1fr);

  }
}

@media (max-width:768px) and (min-width:515px) {
  .dashboard-container .v-item-group {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}

@media (max-width:515px) {
  .dashboard-container .v-item-group {
    grid-template-columns: repeat(1, 1fr);
    gap: 10px;
  }

  .dashboard-container .v-list-item-group .v-list-item {
    height: 55px
  }
}
</style>
