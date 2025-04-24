<template>
  <v-container>
    <div class="d-flex justify-space-between align-center my-3">
      <h2>{{ reportName }}</h2>
      <v-btn
        outlined
        color="#62C83F"
        class="btn"
        @click="printReports"
        :icon="$vuetify.breakpoint.width < 321"
        v-if="reports.length != 0"
      >
        <span v-if="$vuetify.breakpoint.width > 321">{{
          $t("exportReport")
        }}</span>
        <v-icon v-else>picture_as_pdf</v-icon>
      </v-btn>
    </div>
    <div class="d-flex justify-start align-center mb-3">
      <div v-if="selectOption">
        <v-autocomplete
          :items="items"
          v-model="item"
          item-text="name"
          outlined
          hide-details
          color="#4fca9a"
          class="select-content"
          return-object
          :placeholder="placeholderName"
        ></v-autocomplete>
      </div>
      <div v-else>
        <date-picker
          v-model="dateRange"
          range
          :lang="$i18n.locale"
          class="date-picker-container"
          :class="[$i18n.locale == 'ar' ? 'ar-date-picker' : '', 'date-picker']"
          format="DD-MM-YYYY"
          @input="formattedDateRange"
          :disabled-date="disabledDates"
        ></date-picker>
      </div>
      <div>
        <v-btn
          outlined
          color="#4FCA9A"
          :class="[marginFour, 'rounded-lg']"
          height="30"
          min-width="0"
          width="10"
          @click="search"
          :disabled="searchAvailability ? false : true"
        >
          <v-icon color="grey"> search </v-icon>
        </v-btn>
      </div>
    </div>
    <v-data-table
      :headers="filterHeaders"
      :items="reports"
      sort-by="created_at"
      :sort-desc="true"
      height="70vh"
      fixed-header
      disable-pagination
      hide-default-footer
      mobile-breakpoint="0"
      :class="[$i18n.locale == 'en' ? 'eng-table' : '', 'mt-0 tableStriped']"
    >
      <template slot="no-data">{{ $t("noReport") }}</template>
      <!----------------------------------- another headers -------------------------->
      <template
        slot="item.created_at"
        slot-scope="{ item }"
        v-if="isAnotherHeaders"
      >
        <td>
          {{ new Date(item.created_at).toLocaleDateString("en-US") }}
        </td>
      </template>
      <template
        slot="item.tprice_before_tax"
        slot-scope="{ item }"
        v-if="isAnotherHeaders"
      >
        <td>
          {{
            $RoundingNumber(item.tprice_before_tax, "product") +
            " " +
            $t("SRmini")
          }}
        </td>
      </template>
      <template
        slot="item.tprice_after_tax"
        slot-scope="{ item }"
        v-if="isAnotherHeaders"
      >
        <td>
          {{
            $RoundingNumber(item.tprice_after_tax, "total") + " " + $t("SRmini")
          }}
        </td>
      </template>
      <!-------------------------------------- original headers ------------------------------->
      <template
        slot="item.invoice_meta_data.invoice_created_at"
        slot-scope="{ item }"
        v-if="!isAnotherHeaders"
      >
        <td>
          {{
            new Date(
              item.invoice_meta_data.invoice_created_at
            ).toLocaleDateString("en-US")
          }}
        </td>
      </template>
      <template
        slot="item.invoice_totals.list_total"
        slot-scope="{ item }"
        v-if="!isAnotherHeaders"
      >
        <td>
          {{
            $RoundingNumber(item.invoice_totals.list_total, "product") +
            " " +
            $t("SRmini")
          }}
        </td>
      </template>
      <template
        slot="item.invoice_totals.final_total"
        slot-scope="{ item }"
        v-if="!isAnotherHeaders"
      >
        <td>
          {{
            $RoundingNumber(item.invoice_totals.final_total, "total") +
            " " +
            $t("SRmini")
          }}
        </td>
      </template>
      <template slot="item.actions" slot-scope="{ item }">
        <v-btn class="actions" color="#707070" dark @click="getInvoice(item)">{{
          $t("view")
        }}</v-btn>
      </template>
    </v-data-table>
    <div class="invoice-responsive">
      <div v-if="reports.length == 0" class="no-data-container">
        <p>{{ $t("noReport") }}</p>
      </div>
      <v-row v-else>
        <v-col
          v-for="report in reports"
          :key="report.id"
          cols="12"
          :sm="reports.length > 1 ? '6' : '12'"
          xs="12"
        >
          <v-card class="mx-auto" outlined>
            <v-card-text
              class="d-flex flex-wrap justify-start align-center invoice-content-responsive"
              :class="reports.length > 1 ? 'button-responsive' : ''"
              style="gap: 10px"
            >
              <div>
                <span>{{ filterHeaders[0].text }} :</span>
                <p>
                  {{
                    new Date(
                      isAnotherHeaders
                        ? report.created_at
                        : report.invoice_meta_data.invoice_created_at
                    ).toLocaleDateString("en-US")
                  }}
                </p>
              </div>
              <div>
                <span>{{ filterHeaders[1].text }} :</span>
                <p>
                  {{
                    isAnotherHeaders
                      ? report.invoice_number
                      : report.invoice_meta_data.invoice_number
                  }}
                </p>
              </div>
              <div>
                <span>{{ filterHeaders[2].text }} :</span>
                <p>
                  {{
                    $RoundingNumber(
                      isAnotherHeaders
                        ? report.tprice_before_tax
                        : report.invoice_totals.list_total,
                      "product"
                    ) +
                    " " +
                    $t("SRmini")
                  }}
                </p>
              </div>
              <div>
                <span>{{ filterHeaders[3].text }} :</span>
                <p>
                  {{
                    $RoundingNumber(
                      isAnotherHeaders
                        ? report.tprice_after_tax
                        : report.invoice_totals.final_total,
                      "product"
                    ) +
                    " " +
                    $t("SRmini")
                  }}
                </p>
              </div>
              <div class="d-flex justify-center" style="width: 100%">
                <v-btn
                  class="actions"
                  color="#707070"
                  @click="getInvoice(report)"
                  >{{ $t("view") }}</v-btn
                >
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <v-expansion-panels
      class="mt-2"
      v-if="
        reportRole != 'refund-sales' &&
        reportRole != 'refund-purchases' &&
        reportRole != 'supplier-purchases'
      "
    >
      <v-expansion-panel>
        <v-expansion-panel-header class="justify-space-between mt-2 header">
          {{ reportName }}
        </v-expansion-panel-header>
        <v-expansion-panel-content class="content">
          <div class="d-flex justify-space-between">
            <p>
              {{
                reportRole == "sales"
                  ? $t("subtotalSales")
                  : reportRole == "purchases"
                  ? $t("subtotalPurchases")
                  : $t("totalSales")
              }}
            </p>
            <span>{{
              $RoundingNumber(totalSalesTaxed) + " " + $t("SRmini")
            }}</span>
          </div>
          <div class="d-flex justify-space-between">
            <p>{{ $t("totalTax") }}</p>
            <span>{{ $RoundingNumber(totalTax) + " " + $t("SRmini") }}</span>
          </div>
          <div
            class="d-flex justify-space-between"
            v-if="reportRole == 'sales' || reportRole == 'purchases'"
          >
            <p>
              {{
                reportRole == "sales"
                  ? $t("subtotalUnTaxedSales")
                  : $t("subtotalUnTaxedPurchases")
              }}
            </p>
            <span>{{
              $RoundingNumber(totalSalesUntaxed) + " " + $t("SRmini")
            }}</span>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-expansion-panels
      class="mt-2"
      v-if="reportRole == 'refund-sales' || reportRole == 'refund-purchases'"
    >
      <v-expansion-panel>
        <v-expansion-panel-header class="justify-space-between mt-2 header">
          {{ reportName }}
        </v-expansion-panel-header>
        <v-expansion-panel-content class="content mt-4">
          <div class="d-flex justify-space-between">
            <p>{{ $t("subtotalRefundSales") }}</p>
            <span>{{
              $RoundingNumber(totalRefundsTaxed) + " " + $t("SRmini")
            }}</span>
          </div>
          <div class="d-flex justify-space-between">
            <p>{{ $t("totalTax") }}</p>
            <span>{{
              $RoundingNumber(totalRefundTax) + " " + $t("SRmini")
            }}</span>
          </div>
          <div class="d-flex justify-space-between">
            <p>{{ $t("subtotalUnTaxedRefundSales") }}</p>
            <span>{{
              $RoundingNumber(totalRefundsUntaxed) + " " + $t("SRmini")
            }}</span>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <alert-dialog v-if="alertDialog">
      <template #title> {{ $t("shouldUpgrade") }} </template>
      <template #default>
        <v-btn
          color="#4FCA9A"
          width="150"
          class="rounded-lg white--text"
          to="/subscriptions"
          >{{ $t("updateNow") }}</v-btn
        >
        <v-btn
          color="#4FCA9A"
          width="150"
          :class="[marginTwo, 'rounded-lg white--text']"
          @click="alertDialog = false"
          >{{ $t("notNow") }}</v-btn
        >
      </template>
    </alert-dialog>
    <alert-dialog
      v-if="warningDialog"
      :buttonName="$t('done')"
      color="#62C83F"
      :close="() => (warningDialog = false)"
      @close="warningDialog = false"
    >
      <template #title>
        {{ message }}
      </template>
    </alert-dialog>
  </v-container>
</template>
<script>
import axios from "axios";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/locale/ar";
import "vue2-datepicker/locale/en";
import "vue2-datepicker/index.css";
export default {
  components: {
    DatePicker,
  },
  data() {
    return {
      reports: [],
      reportType: "",
      userDetails: null,
      reportsOn: null,
      reportRole: null,
      baseUrl: null,
      dateRange: [],
      formattedDate: [],
      searchAvailability: true,
      selectOption: false,
      item: {},
      params: {},
      totalSalesUntaxed: 0,
      totalTax: 0,
      totalSalesTaxed: 0,
      totalRefundsUntaxed: 0,
      totalRefundTax: 0,
      totalRefundsTaxed: 0,
      alertDialog: false,
      warningDialog: false,
      message: null,
      status: null,
      isAnotherHeaders: false,
    };
  },
  methods: {
    formattedDateRange(event) {
      if (event.length != 0 && event[0] != null && event[1] != null) {
        this.formattedDate = [...event];
        var day = [];
        var month = [];
        var year = [];
        for (var i = 0; i < event.length; i++) {
          this.formattedDate[i] = new Date(event[i]);
          day[i] = event[i].getDate();
          month[i] = event[i].getMonth() + 1;
          year[i] = event[i].getFullYear();
          this.formattedDate[i] = `${day[i]}-${month[i]}-${year[i]}`;
        }
      }
    },
    disabledDates(date) {
      const today = new Date();
      return date > today;
    },
    setData() {
      this.reportRole = this.$route.params.reportRole;
      this.userDetails = JSON.parse(localStorage.getItem("userDetails"));
      this.reportsOn = JSON.parse(localStorage.getItem("reports_on"));
      this.reportType = JSON.parse(localStorage.getItem("report")).reportType;
      this.$store.dispatch("employees");
      this.$store.dispatch("products");
      this.$store.dispatch("clients");
      this.$store.dispatch("suppliers");
      this.$store.dispatch("tilers");
      this.$store.dispatch("paymentMethods", { lang: this.$i18n.locale });
      if (
        this.reportRole == "employee-sales" ||
        this.reportRole == "payment-method-sales" ||
        this.reportRole == "sales-product" ||
        this.reportRole == "client-sales" ||
        this.reportRole == "supplier-purchases" ||
        this.reportRole == "sales-channel"
      )
        this.selectOption = true;
      this.getUrl();
    },
    getUrl() {
      if (this.reportRole == "sales" || this.reportRole == "refund-sales") {
        this.baseUrl = "orders_reports";
        this.isAnotherHeaders = true;
      } else if (
        this.reportRole == "purchases" ||
        this.reportRole == "refund-purchases"
      ) {
        this.baseUrl = "invoices-reports";
        this.isAnotherHeaders = true;
      } else if (
        this.reportRole == "employee-sales" ||
        this.reportRole == "payment-method-sales" ||
        this.reportRole == "client-sales" ||
        this.reportRole == "sales-channel"
      )
        this.baseUrl = "sales";
      else if (this.reportRole == "sales-product") {
        this.baseUrl = "getProductOrder";
        this.isAnotherHeaders = true;
      } else if (this.reportRole == "supplier-purchases") {
        this.baseUrl = "purchases";
      }
    },
    printReports() {
      if (this.reportsOn) {
        this.$router.push({
          name: "reports_pdf",
          params: {
            reports: this.reports,
            totalSalesUntaxed: this.totalSalesUntaxed,
            totalTax: this.totalTax,
            totalSalesTaxed: this.totalSalesTaxed,
            totalRefundsUntaxed: this.totalRefundsUntaxed,
            totalRefundTax: this.totalRefundTax,
            totalRefundsTaxed: this.totalRefundsTaxed,
            reportRole: this.reportRole,
          },
        });
      } else this.alertDialog = true;
    },
    open(type) {
      if (this.reportsOn == true) {
        if (type == "from") this.menuOpenFrom = true;
        else this.menuOpenTo = true;
      } else {
        this.alertDialog = true;
      }
    },
    search() {
      if (this.reportsOn == true) {
        if (this.reportRole == "payment-method-sales")
          if (Object.keys(this.item).length == 0) {
            this.message = this.$t("paymentMethodAlert");
            this.warningDialog = true;
          } else {
            this.params = { payment_method_id: this.item.id };
          }
        else if (this.reportRole == "employee-sales")
          if (Object.keys(this.item).length == 0) {
            this.message = this.$t("employeeAlert");
            this.warningDialog = true;
          } else this.params = { employee_id: this.item.id };
        else if (this.reportRole == "sales-product")
          if (Object.keys(this.item).length == 0) {
            this.message = this.$t("productAlert");
            this.warningDialog = true;
          } else this.params = { product_id: this.item.id };
        else if (this.reportRole == "client-sales")
          if (Object.keys(this.item).length == 0) {
            this.message = this.$t("clientAlert");
            this.warningDialog = true;
          } else this.params = { client_id: this.item.id };
        else if (this.reportRole == "supplier-purchases")
          if (Object.keys(this.item).length == 0) {
            this.message = this.$t("supplierAlert");
            this.warningDialog = true;
          } else this.params = { supplier_id: this.item.id };
        else if (this.reportRole == "sales-channel")
          if (Object.keys(this.item).length == 0) {
            this.message = this.$t("channelAlert");
            this.warningDialog = true;
          } else this.params = { tiler_id: this.item.id };
        else {
          if (
            this.dateRange.length == 0 ||
            this.dateRange[0] == null ||
            this.dateRange[1] == null
          ) {
            this.message = this.$t("dateAlert");
            this.warningDialog = true;
          } else
            this.params = {
              date_from: this.formattedDate[0],
              date_to: this.formattedDate[1],
            };
        }
        if (this.warningDialog) return;
        else {
          this.searchAvailability = false;
          axios
            .get(this.baseUrl, {
              params: { ...this.params },
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
            .then((res) => {
              var reports = [];
              reports = res.data.data.data;
              const totalPages = res.data.data.meta.last_page;
              if (reports) {
                this.getTotalSearch(totalPages);
              }
            })
            .catch((err) => {
              if (err.response.data.message == "Unauthenticated.")
                this.$store.dispatch("logout");
            });
        }
      } else this.alertDialog = true;
    },

    // search for sales or purchases
    async getTotalSearch(totalPages) {
      this.reports = [];
      var reports = [];
      for (var i = 1; i < totalPages + 1; i++) {
        try {
          const response = await axios.get(this.baseUrl, {
            params: { ...this.params, page: i },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          reports.push(...response.data.data.data);
          if (i === totalPages) {
            this.filterReports(reports);
            if (this.reportRole == "sales" || this.reportRole == "refund-sales")
              this.getTotal(
                response.data.total_untaxed,
                response.data.total_tax,
                response.data.total_taxed,
                response.data.total_refund_untaxed,
                response.data.total_refund_tax,
                response.data.total_refund_taxed
              );
            else if (
              this.reportRole == "purchases" ||
              this.reportRole == "refund-purchases"
            )
              this.getTotal(
                response.data.total_untaxed_purchases,
                response.data.total_purchase_tax,
                response.data.total_purchase_after_tax,
                response.data.total_untaxed_refund_purchases,
                response.data.total_refund_tax,
                response.data.total_refund_after_tax
              );
            else
              this.getTotal(
                null,
                response.data.total_tax,
                response.data.total_sales,
                null,
                null,
                null
              );
          }
        } catch (err) {
          console.log(err);
        }
      }
    },

    // filter report refund or not
    filterReports(reports) {
      if (
        this.reportRole == "refund-sales" ||
        this.reportRole == "refund-purchases"
      )
        this.reports = reports.filter((item) => {
          return item.refund_id != null;
        });
      else if (this.reportRole == "sales" || this.reportRole == "purchases")
        this.reports = reports.filter((item) => {
          return item.refund_id == null;
        });
      else this.reports = reports;
    },
    // calculate total price for sales or purchases
    getTotal(
      untaxedTotal,
      totalTax,
      taxedTotal,
      refundUntaxedTotal,
      refundTotalTax,
      refundTaxedTotal
    ) {
      this.totalSalesUntaxed = untaxedTotal;
      this.totalTax = totalTax;
      this.totalSalesTaxed = taxedTotal;
      this.totalRefundsUntaxed = refundUntaxedTotal;
      this.totalRefundTax = refundTotalTax;
      this.totalRefundsTaxed = refundTaxedTotal;
      this.searchAvailability = true;
    },
    getInvoice(invoice) {
      var baseURL = "";
      if (
        this.reportRole == "refund-sales" ||
        this.reportRole == "refund-purchases"
      )
        this.status = "refund";
      else this.status = "originale";
      if (this.reportType == this.$t("sales")) {
        if (this.reportRole == "sales-product" || this.reportRole == "sales")
          baseURL = `invoice/${invoice.id}`;
        else if (this.status == "originale")
          baseURL = `invoice/${invoice.invoice_meta_data.invoice_id}`;
        else baseURL = `returnedInvoices/${invoice.refund_id}`;
      } else {
        if (this.reportRole == "supplier-purchases")
          baseURL = `purchases/${invoice.invoice_meta_data.invoice_id}`;
        else if (this.status == "originale")
          baseURL = `purchases/${invoice.id}`;
        else baseURL = `refundPurchases/${invoice.refund_id}`;
      }
      axios
        .get(`${baseURL}`, {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          this.showInvoice(res.data.data);
        })
        .catch((err) => console.log(err));
    },
    // go to page of invoice
    showInvoice(invoice) {
      localStorage.setItem("invoice", JSON.stringify(invoice));
      this.$router.push({
        name: "print",
        params: {
          type: "show",
        },
      });
    },
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t("createDate"),
          align: "center",
          value: "invoice_meta_data.invoice_created_at",
          sortable: false,
        },
        {
          text: this.$t("invoiceNumber"),
          align: "center",
          value: "invoice_meta_data.invoice_number",
          sortable: false,
        },
        {
          text: this.$t("beforTax"),
          align: "center",
          value: "invoice_totals.list_total",
          sortable: false,
        },
        {
          text: this.$t("afterTax"),
          align: "center",
          value: "invoice_totals.final_total",
          sortable: false,
        },
        {
          text: this.$t("actions"),
          align: "center",
          value: "actions",
          sortable: false,
        },
      ];
    },
    anotherHeaders() {
      return [
        {
          text: this.$t("createDate"),
          align: "center",
          value: "created_at",
          sortable: false,
        },
        {
          text: this.$t("invoiceNumber"),
          align: "center",
          value: "invoice_number",
          sortable: false,
        },
        {
          text: this.$t("beforTax"),
          align: "center",
          value: "tprice_before_tax",
          sortable: false,
        },
        {
          text: this.$t("afterTax"),
          align: "center",
          value: "tprice_after_tax",
          sortable: false,
        },
        {
          text: this.$t("actions"),
          align: "center",
          value: "actions",
          sortable: false,
        },
      ];
    },
    filterHeaders() {
      return this.isAnotherHeaders ? this.anotherHeaders : this.headers;
    },
    priceBeforeTax() {
      return this.isAnotherHeaders
        ? "tprice_before_tax"
        : "invoice_totals.list_total";
    },
    priceAfterTax() {
      return this.isAnotherHeaders
        ? "tprice_after_tax"
        : "invoice_totals.final_total";
    },
    items() {
      if (this.reportRole == "payment-method-sales")
        return this.getPaymentMethods;
      else if (this.reportRole == "employee-sales") return this.getEmployees;
      else if (this.reportRole == "client-sales") return this.getClients;
      else if (this.reportRole == "supplier-purchases")
        return this.getSuppliers;
      else if (this.reportRole == "sales-channel") return this.getTilers;
      else return this.getProducts;
    },
    reportName() {
      if (this.reportRole == "sales") return this.$t("salesReport");
      else if (this.reportRole == "refund-sales")
        return this.$t("refundSalesReport");
      else if (this.reportRole == "purchases")
        return this.$t("purchasesReport");
      else if (this.reportRole == "refund-purchases")
        return this.$t("refundPurchasesReport");
      else if (this.reportRole == "payment-method-sales")
        return this.$t("paymentMethodSales");
      else if (this.reportRole == "employee-sales")
        return this.$t("employeeSalesReport");
      else if (this.reportRole == "client-sales")
        return this.$t("clientSalesReport");
      else if (this.reportRole == "supplier-purchases")
        return this.$t("supplierPurchasesReport");
      else if (this.reportRole == "sales-channel")
        return this.$t("tilerSalesReport");
      else return this.$t("productSalesReport");
    },
    placeholderName() {
      if (this.reportRole == "payment-method-sales")
        return this.$t("selectPaymentMet");
      else if (this.reportRole == "employee-sales")
        return this.$t("selectEmployee");
      else if (this.reportRole == "client-sales")
        return this.$t("selectClient");
      else if (this.reportRole == "supplier-purchases")
        return this.$t("selectSupplier");
      else if (this.reportRole == "sales-channel")
        return this.$t("selectTiler");
      else return this.$t("selectProduct");
    },
    getEmployees() {
      return this.$store.getters.getEmployees;
    },
    getProducts() {
      return this.$store.getters.getProducts;
    },
    getClients() {
      return this.$store.getters.getClients;
    },
    getSuppliers() {
      return this.$store.getters.getSuppliers;
    },
    getTilers() {
      return this.$store.getters.getTilers;
    },
    getPaymentMethods() {
      return this.$store.getters.getPaymentMethods;
    },
    marginOne() {
      return this.$i18n.locale == "en" ? "ml-1" : "mr-1";
    },
    marginTwo() {
      return this.$i18n.locale == "en" ? "ml-2" : "mr-2";
    },
    marginThree() {
      return this.$i18n.locale == "en" ? "ml-3" : "mr-3";
    },
    marginFour() {
      return this.$i18n.locale == "en" ? "ml-4" : "mr-4";
    },
  },
  mounted() {
    this.setData();
  },
};
</script>
<style>
@import "../../assets/styles/style.css";

.btn {
  border-radius: 8px;
  height: 34px !important;
}

.select-content .v-input__slot {
  width: 100%;
  height: 35px;
  min-height: 35px !important;
  cursor: pointer !important;
}

.select-content fieldset {
  border: 1px solid #4fca9a;
  border-radius: 12px;
}

.select-content fieldset:focus {
  border-color: #4fca9a !important;
  outline: none !important;
  outline-color: #4fca9a !important;
}

.select-content .v-icon {
  top: -10px;
  color: #4fca9a;
}

.tableStriped {
  margin-top: 50px !important;
}

.v-data-table tr {
  cursor: pointer;
}

.content {
  padding: 0 5% !important;
}

.content div p,
.tax p {
  font-size: 0.9rem;
}

.content div span,
.tax span {
  font-family: "BahjiiBold";
}

.header {
  font-size: 18px;
  font-family: "BahjiiSemiBold";
}

.header .v-expansion-panel-header__icon {
  margin-left: 0px !important;
}

.header i {
  color: black !important;
  font-size: 30px;
}

input::-webkit-inner-spin-button,
input::-webkit-clear-button {
  display: block !important;
}

.date-picker input {
  border-radius: 12px;
  border-color: #4fca9a;
  box-shadow: none;
}

.date-picker input:hover,
.date-picker input:focus-visible {
  border-color: #4fca9a;
}

.date-picker i {
  color: #4fca9a;
}

.ar-date-picker input {
  direction: ltr;
  padding-left: 30px !important;
}

.ar-date-picker i {
  left: 8px;
  right: auto !important;
}

.mx-calendar-header .mx-btn-icon-double-left,
.mx-calendar-header .mx-btn-icon-double-right {
  display: none !important;
}

@media (max-width: 320px) {
  .btn {
    height: 30px !important;
    border-width: 2px !important;
  }
}

@media (max-width: 375px) {
  .v-expansion-panel-content__wrap {
    padding: 0 0 16px;
  }
}
</style>
