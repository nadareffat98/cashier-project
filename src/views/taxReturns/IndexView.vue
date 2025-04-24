<template>
  <v-container class="mt-5">
    <div class="d-flex justify-space-between align-center my-3">
      <h2>{{ $t("taxReturns") }}</h2>
      <v-btn dark color="#4FCA9A" class="add-btn" @click="createOrShow('add')">
        <v-icon color="white" size="29" :left="$i18n.locale == 'en'">add_box</v-icon><span class="addText">{{
          $t("addTaxReturn") }}</span>
      </v-btn>
    </div>
    <div class="d-flex justify-start align-center date-search-container mb-3">
      <date-picker v-model="dateRange" range :lang="$i18n.locale" class="date-picker-container"
        :class="[$i18n.locale == 'ar' ? 'ar-date-picker' : '', 'date-picker']" format="DD-MM-YYYY"
        @input="formattedDateRange" :disabled-date="disabledDates"></date-picker>
      <v-btn outlined color="#4FCA9A" :class="[marginThree, 'rounded-lg']" height="30" min-width="0" width="10"
        @click="search">
        <v-icon color="grey"> search </v-icon>
      </v-btn>
      <v-btn outlined color="#4FCA9A" :class="[marginOne, 'rounded-lg']" height="30" min-width="0" width="10"
        @click="refresh">
        <v-icon color="#707070" size="23"> replay </v-icon>
      </v-btn>
    </div>
    <v-data-table :headers="headers" :items="taxReturns" :items-per-page="itemsPerPage" :page.sync="currentPage"
      item-key="name" hide-default-footer :class="[$i18n.locale == 'en' ? 'eng-table' : '', 'mt-5 tableStriped']">
      <template slot="no-data">{{ $t("noTaxReturns") }}</template>
      <template slot="item.sales_tax" slot-scope="{ item }">
        {{ $RoundingNumber(((item.sales - item.sales_refund) * getTax), 'total') }}
      </template>
      <template slot="item.purchases_tax" slot-scope="{ item }">
        {{ $RoundingNumber((item.purchases - item.purchases_refund) * getTax) }}
      </template>
      <template slot="item.actions" slot-scope="{ item }">
        <v-btn class="actions" color="#707070" dark @click="createOrShow('show', item.id)">{{
          $t("show") }}</v-btn>
        <v-btn :class="[marginTwo, 'actions']" color="#62C83F" dark @click="download(item, 'print')">{{
          $t("print") }}</v-btn>
        <v-btn :class="[marginOne, 'actions']" color="#2BB3B3" dark @click="download(item, 'share')">{{
          $t("download") }}</v-btn>
      </template>
    </v-data-table>
    <div class="cards-responsive">
      <div v-if="taxReturns.length == 0" class="no-data-container">
        <p>{{ $t("noPaymentMethods") }}</p>
      </div>
      <v-row v-else>
        <v-col v-for="taxReturn in taxReturns" :key="taxReturn.id" cols="12" :sm="taxReturns.length > 1 ? '6' : '12'"
          xs="12">
          <v-card class="mx-auto" outlined>
            <v-card-text class="d-flex flex-wrap justify-start align-center invoice-content-responsive"
              :class="taxReturns.length > 1 ? 'button-responsive' : ''" style="gap:10px">
              <template v-for="header in headers">
                <div v-if="header.value != 'actions'" :key="header.value"
                  class="d-flex justify-start align-center pb-0" style="gap: 5px">
                  <span>{{ header.text }} :</span>
                  <p>{{ taxReturn[header.value] }}</p>
                </div>
                <div v-else class="d-flex justify-center" style="width: 100%;" :key="header.value">
                  <v-btn class="actions" color="#707070" dark @click="createOrShow('show', taxReturn.id)">{{
                    $t("show") }}</v-btn>
                  <v-btn :class="[marginTwo, 'actions']" color="#62C83F" dark @click="download(taxReturn, 'print')">{{
                    $t("print") }}</v-btn>
                  <v-btn :class="[marginOne, 'actions']" color="#2BB3B3" dark @click="download(taxReturn, 'share')">{{
                    $t("download") }}</v-btn>
                </div>
              </template>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <v-pagination v-model="currentPage" :length="pageCount" class="pagination" :next-icon="$t('next')"
      :prev-icon="$t('previous')"></v-pagination>
    <alert-dialog v-if="warningDialog" :buttonName="$t('done')" color="#62C83F" :close="() => (warningDialog = false)"
      @close="warningDialog = false">
      <template #title>
        {{ $t("dateTaxReturnAlert") }}
      </template>
    </alert-dialog>
    <alert-dialog v-if="alertDialog">
      <template #title> {{ $t("shouldUpgrade") }} </template>
      <template #default>
        <v-btn color="#4FCA9A" width="150" class="rounded-lg white--text" to="/subscriptions">{{ $t("updateNow")
        }}</v-btn>
        <v-btn color="#4FCA9A" width="150" :class="[marginTwo, 'rounded-lg white--text']" @click="alertDialog = false">{{
          $t("notNow") }}</v-btn>
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
      userDetails: null,
      meDetails: null,
      taxReturns: [],
      currentPage: 1,
      itemsPerPage: 10,
      pageCount: 0,
      dateRange: [],
      formattedDate: [],
      warningDialog: false,
      alertDialog: false,
    };
  },
  methods: {
    getData() {
      this.$store.dispatch("tax");
      this.userDetails = JSON.parse(localStorage.getItem("userDetails"));
      this.meDetails = JSON.parse(localStorage.getItem('meDetails'))
      axios
        .get("tax-returns", {
          params: { page: this.currentPage },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          this.taxReturns = res.data.data.data;
          this.pageCount = res.data.data.meta.last_page;
        })
        .catch((err) => {
          if (err.response.data.message == "Unauthenticated.")
            this.$store.dispatch("logout");
        });
    },
    search() {
      if (this.meDetails['is_subscribed']) {
        if (this.dateRange.length == 0 || this.dateRange[0] == null || this.dateRange[1] == null) this.warningDialog = true;
        else
          axios
            .get("tax-returns", {
              params: {
                date_from: this.formattedDate[0],
                date_to: this.formattedDate[1],
              },
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })
            .then((res) => {
              console.log(res);
              this.taxReturns = res.data.data.data;
            })
            .catch((err) => {
              if (err.response.data.message == "Unauthenticated.")
                this.$store.dispatch("logout");
            });
      }
      else this.alertDialog = true;
    },
    refresh() {
      location.reload();
    },
    createOrShow(type, id = 0) {
      if (this.meDetails['is_subscribed'])
        this.$router.push({
          name: "create-show",
          params: {
            type: type,
            id: id,
          },
        });
      else
        this.alertDialog = true
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
    download(taxReturn, type) {
      this.$router.push({
        name: "print-tax-return",
        params: {
          taxReturnDetails: taxReturn,
          type: type,
        },
      });
    },
  },
  computed: {
    getTax() {
      return this.$store.getters.getTax;
    },
    headers() {
      return [
        {
          text: this.$t("reportNumber"),
          align: "center",
          sortable: false,
          value: "id",
        },
        {
          text: this.$t("from"),
          align: "center",
          sortable: false,
          value: "date_from",
        },
        {
          text: this.$t("to"),
          align: "center",
          sortable: false,
          value: "date_to",
        },
        {
          text: this.$t("salesTax"),
          align: "center",
          sortable: false,
          value: "sales_tax",
        },
        {
          text: this.$t("purchaseTax"),
          align: "center",
          sortable: false,
          value: "purchases_tax",
        },
        {
          text: this.$t("taxDue"),
          align: "center",
          sortable: false,
          value: "tax_return_total",
        },
        {
          text: this.$t("actions"),
          align: "center",
          sortable: false,
          value: "actions",
        },
      ];
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
  },
  watch: {
    currentPage() {
      this.getData();
    },
  },
  mounted() {
    this.getData();
  },
};
</script>
<style scoped>
@import "../../assets/styles/style.css";

.date-picker :deep(input) {
  border-radius: 12px;
  border-color: #4fca9a;
  box-shadow: none;
}

.date-picker :deep(input:hover),
.date-picker :deep(input:focus-visible) {
  border-color: #4fca9a;
}

.ar-date-picker :deep(input) {
  direction: ltr;
  padding-left: 30px !important;
}

.date-picker :deep(i) {
  color: #4fca9a;
}

.ar-date-picker :deep(i) {
  left: 8px;
  right: auto !important;
}

@media (min-width:1024px) {
  .date-search-container {
    width:40%;
  }
}
</style>
