<template>
  <v-container class="mt-5">
    <h2>{{ $t("priceQuote") }}</h2>
    <div class="d-flex justify-space-between align-center my-3">
      <div class="d-flex justify-space-between align-center">
        <v-icon color="#4FCA9A" size="25" class="icon"> search</v-icon>
        <input type="search" :placeholder="$t('search')" v-model="searchPriceQuote" @input="search" />
        <v-btn color="#4FCA9A" height="35" width="35" :class="[marginOne]"
          style="min-width: 31px !important; border-radius: 12px !important" @click="openFilterDialog">
          <v-icon size="25" color="white">mdi-filter</v-icon>
        </v-btn>
      </div>
      <v-btn dark color="#4FCA9A" class="add-btn" @click="goToCashier">
        <v-icon color="white" size="29" :left="$i18n.locale == 'en'">add_box</v-icon><span class="addText">{{
          $t("addPriceQuote") }}</span>
      </v-btn>
    </div>
    <v-data-table :headers="headers" :items="priceQuotes" :items-per-page="itemsPerPage" :page.sync="currentPage"
      item-key="name" hide-default-footer :class="[$i18n.locale == 'en' ? 'eng-table' : '', 'mt-5 tableStriped']"
      :sort-by="['created_at', 'quotation_number']" :sort-desc="true">
      <template slot="no-data">{{ $t("noPriceQuotes") }}</template>
      <template slot="item.created_at" slot-scope="{ item }">
        {{ new Date(item.created_at).toLocaleDateString("en-US") }}
      </template>
      <template slot="item.actions" slot-scope="{ item }">
        <td>
          <div class="d-flex justify-center align-center">
            <v-btn class="actions" color="#707070" dark @click="show(item, 'show')">{{ $t("show") }}</v-btn>
            <v-btn :class="[marginTwo, 'actions']" color="#62C83F" dark @click="show(item, 'print')">{{
              $t("print")
            }}</v-btn>
            <v-btn :class="[marginTwo, 'actions']" color="#2BB3B3" dark @click="show(item, 'pdf')">{{
              $t("saveAsPdf") }}</v-btn>
          </div>
        </td>
      </template>
    </v-data-table>
    <div class="invoice-responsive">
      <div v-if="priceQuotes.length == 0" class="no-data-container">
        <p>{{ $t("noPriceQuotes") }}</p>
      </div>
      <v-row v-else>
        <v-col v-for="priceQuote in priceQuotes" :key="priceQuote.id" cols="12" :sm="priceQuotes.length > 1 ? '6' : '12'"
          xs="12">
          <v-card class="mx-auto my-2" outlined>
            <v-card-text class="d-flex flex-wrap justify-start align-center invoice-content-responsive"
              :class="priceQuotes.length > 1 ? 'button-responsive' : ''" style="gap:10px">
              <template v-for="header in headers">
                <div v-if="header.value != 'actions'" :key="header.value">
                  <span>{{ header.text }} :</span>
                  <p>{{ header.value == 'created_at' ? new Date(priceQuote[header.value]).toLocaleDateString("en-US") :
                    priceQuote[header.value] }}</p>
                </div>
                <div v-else :key="header.value" class="d-flex justify-center" style="width: 100%;">
                  <v-btn class="actions" color="#707070" @click="show(priceQuote, 'show')">{{ $t("show")
                  }}</v-btn>
                  <v-btn :class="[marginTwo, 'actions']" color="#62C83F" @click="show(priceQuote, 'print')">{{
                    $t("print") }}</v-btn>
                  <v-btn :class="[marginTwo, 'actions']" color="#2BB3B3" @click="show(priceQuote, 'pdf')">{{
                    $t("saveAsPdf") }}</v-btn>
                </div>
              </template>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <v-pagination v-model="currentPage" :length="pageCount" class="pagination" :next-icon="$t('next')"
      :prev-icon="$t('previous')"></v-pagination>
    <!----------------------------- filter price quote  ----------------------------------->
    <v-dialog v-model="filterDialog" :max-width="$vuetify.breakpoint.width < 425 ? '100%' : '450px'">
      <v-card class="mx-auto" :style="$vuetify.breakpoint.width < 425 ? 'padding:0 0.8rem' : 'padding: 0 1.5rem'">
        <v-card-title class="d-flex justify-space-between align-center pb-1 card-title-container">{{
          $t("searchForPriceQuote")
        }} <v-icon color="black" @click="filterDialog = false" size="22">mdi-close</v-icon></v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-2">
          <v-form class="form-container">
            <div>
              <label class="black--text mr-1">{{ $t("clientName") }}</label>
              <v-autocomplete :items="clients" v-model="client" item-text="name" return-object outlined></v-autocomplete>
            </div>
            <div>
              <label>{{ $t("quoteDate") }}</label>
              <div class="d-flex justif-space-between calendar-container" style="gap: 10px;">
                <v-menu v-model="menuOpenFrom" :close-on-content-click="false" :nudge-right="40"
                  :return-value.sync="dateFrom" ref="menuFrom">
                  <template v-slot:activator="{ on }">
                    <v-text-field v-model="from" append-icon="calendar_month" @click:append="menuOpenFrom = true"
                      :placeholder="$t('from')" outlined readonly v-on="on"></v-text-field>
                  </template>
                  <v-date-picker v-model="dateFrom" @input="$refs.menuFrom.save(dateFrom)" no-title scrollable>
                  </v-date-picker>
                </v-menu>
                <v-menu v-model="menuOpenTo" :close-on-content-click="false" :nudge-right="40" :return-value.sync="dateTo"
                  ref="menuTo">
                  <template v-slot:activator="{ on }">
                    <v-text-field v-model="to" append-icon="calendar_month" @click:append="menuOpenTo = true"
                      :placeholder="$t('to')" outlined readonly v-on="on"></v-text-field>
                  </template>
                  <v-date-picker v-model="dateTo" @input="$refs.menuTo.save(dateTo)" no-title scrollable>
                  </v-date-picker>
                </v-menu>
              </div>
            </div>
            <div class="d-flex justify-center align-center">
              <v-btn color="#62C83F" dark width="35%" @click="search" class="actions">
                {{ $t("search") }}
              </v-btn>
              <v-btn color="#62C83F" outlined width="35%" :class="[marginTwo, 'actions']" @click="reset">
                {{ $t("reset") }}
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <alert-dialog v-if="serviceValidationDialog" @close="close" :close="close">
      <template #title> {{ $t("shouldUpgrade") }} </template>
      <template #default>
        <v-btn color="#4FCA9A" width="150" dark to="/subscriptions">{{ $t("updateNow")
        }}</v-btn>
        <v-btn color="#4FCA9A" width="150" dark :class="marginTwo" @click="serviceValidationDialog = false">{{
          $t("notNow") }}</v-btn>
      </template>
    </alert-dialog>
  </v-container>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      headers: [
        {
          text: this.$t("quotationNum"),
          value: "quotation_number",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("client"),
          value: "client",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("date"),
          value: "created_at",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("priceQuoteExpire"),
          value: "expire_date",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("total"),
          value: "total",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("actions"),
          value: "actions",
          sortable: false,
          align: "center",
        },
      ],
      filterDialog: false,
      serviceValidationDialog: false,
      priceQuotes: [],
      clients: [],
      client: "",
      menuOpenFrom: false,
      dateFrom: null,
      menuOpenTo: false,
      dateTo: null,
      itemsPerPage: 10,
      currentPage: 1,
      pageCount: null,
      searchPriceQuote: "",
      meDetails: null,
    };
  },
  methods: {
    getData() {
      this.meDetails = JSON.parse(localStorage.getItem("meDetails"));
      axios
        .get("quotations", {
          params: { page: this.currentPage },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          this.priceQuotes = res.data.data.quotations.data;
          this.pageCount = res.data.data.quotations.meta.last_page;
          this.getClients();
        })
        .catch((err) => {
          if (err.response.data.message == "Unauthenticated.")
            this.$store.dispatch("logout");
        });
    },
    getClients() {
      axios
        .get("getClient", {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          this.clients = res.data.data;
        })
        .catch((err) => {
          if (err.response.data.message == "Unauthenticated.")
            this.$store.dispatch("logout");
        });
    },
    openFilterDialog() {
      if (this.meDetails['is_subscribed'] && this.meDetails["subscription"]["price_quotation"])
        this.filterDialog = true
      else
        this.serviceValidationDialog = true;
    },
    search() {
      this.filterDialog = false;
      axios
        .get("quotations", {
          params: {
            search: this.searchPriceQuote,
            client_id: this.client.id,
            date_from: this.dateFrom,
            date_to: this.dateTo,
            page: this.currentPage,
          },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          this.priceQuotes = res.data.data.quotations.data;
          this.pageCount = res.data.data.quotations.meta.last_page;
        })
        .catch((err) => {
          if (err.response.data.message == "Unauthenticated.")
            this.$store.dispatch("logout");
        });
    },
    goToCashier() {
      if (this.meDetails['is_subscribed'] && this.meDetails["subscription"]["price_quotation"])
        this.$router.push({
          name: "cashier",
          params: {
            title: "priceQuote",
          },
          query: {
            title: this.$t("addInvoice"),
          },
        });
      else this.serviceValidationDialog = true;
    },
    show(priceQuoteDetails, type) {
      this.$router.push({
        name: "show-price-quote",
        params: {
          priceQuoteDetails: priceQuoteDetails,
          type: type,
        },
      });
    },
    reset() {
      this.client = "";
      this.dateFrom = "";
      this.dateTo = "";
      (this.searchPriceQuote = ""), (this.filterDialog = false);
      this.getData();
    },
    close() {
      this.serviceValidationDialog = false;
    }
  },
  computed: {
    from: {
      get() {
        return this.dateFrom;
      },
      set(value) {
        this.dateFrom = value;
      },
    },
    to: {
      get() {
        return this.dateTo;
      },
      set(value) {
        this.dateTo = value;
      },
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

.calendar-container :deep(.v-input__append-inner) {
  margin-top: 8px !important;
}

.calendar-container :deep(.v-input__append-inner button) {
  font-size: 20px !important;
}

/*----------------style for responsive------------------ */
@media (min-width:1024px) {
  .tableStriped {
    display: block;
  }

  .invoice-responsive {
    display: none;
  }
}

@media (max-width:1023px) {
  .tableStriped {
    display: none;
  }

  .invoice-responsive {
    display: block;
  }
}

@media (max-width:330px) {

  :deep(.v-pagination) {
    flex-wrap: wrap;
  }

  :deep(.v-pagination__navigation) {
    width: 50px !important;
  }
}

@media (max-width:376px) {
  .calendar-container {
    flex-direction: column;
  }

  .calendar-container :deep(.v-input__append-inner) {
    margin-top: 5px !important;
  }

  .v-menu__content {
    left: 40px !important;
  }

  .v-menu__content :deep(.v-picker__body) {
    width: 100% !important;
  }
}
</style>
