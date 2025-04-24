<template>
  <v-container class="mt-5">
    <h2>{{ $t("transactions") }}</h2>
    <v-data-table
      :headers="headers"
      :items="transactions"
      :items-per-page="itemsPerPage"
      :page.sync="currentPage"
      item-key="id"
      hide-default-footer
      :class="[$i18n.locale == 'en' ? 'eng-table' : '', , 'mt-5 tableStriped']"
    >
      <template slot="no-data">{{ $t("noTransaction") }}</template>
      <template slot="item.amount" slot-scope="{ item }">{{
        item.paid_at && item.amount != null ? item.amount + $t("SRmini") : ""
      }}</template>
      <template slot="item.created_at" slot-scope="{ item }">
        {{ new Date(item.created_at).toLocaleDateString("en-US") }}
      </template>
      <template slot="item.status" slot-scope="{ item }">{{
        item.paid_at == null && item.status == "new_employee"
          ? "فشل في عملية الدفع"
          : item.status
      }}</template>
    </v-data-table>
    <div class="responsive-cards">
      <div v-if="transactions.length == 0" class="no-data-container">
        <p>{{ $t("noTransaction") }}</p>
      </div>
      <template v-else>
        <v-row>
          <v-col
            v-for="transaction in transactions"
            :key="transaction.id"
            cols="12"
            sm="6"
            xs="12"
          >
            <v-card class="mx-auto my-2" outlined>
              <v-card-text>
                <v-row>
                  <v-col
                    v-for="header in headers"
                    :key="header.value"
                    cols="12"
                    md="6"
                    xs="12"
                    class="d-flex justify-start align-center pb-0"
                    style="gap: 5px"
                  >
                    <span>{{ header.text }} :</span>
                    <p>
                      {{ getValue(transaction, header.value) }}
                    </p>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </div>
    <v-pagination
      v-model="currentPage"
      :length="pageCount"
      class="pagination"
      :next-icon="$t('next')"
      :prev-icon="$t('previous')"
    ></v-pagination>
  </v-container>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      transactions: [],
      currentPage: 1,
      itemsPerPage: 10,
      pageCount: null,
    };
  },
  methods: {
    getData() {
      axios
        .get("transactions", {
          params: { page: this.currentPage },
        })
        .then((res) => {
          this.transactions = res.data.data.data;
          this.pageCount = res.data.data.meta.last_page;
        })
        .catch((err) => {
          if (err.response.data.message == "Unauthenticated.")
            this.$store.dispatch("logout");
        });
    },
    getValue(transaction, value) {
      if (value == "created_at")
        return new Date(transaction.created_at).toLocaleDateString("en-US");
      else if (value == "amount") {
        if (transaction.paid_at == null || transaction.amount == null)
          return "";
        else return transaction[value] + this.$t("SRmini");
      } else if (
        value == "status" &&
        transaction.paid_at == null &&
        transaction.status == "new_employee"
      )
        return "فشل في عملية الدفع";
      else {
        return transaction[value];
      }
    },
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t("transactionNumber"),
          align: "center",
          sortable: false,
          value: "subscription_id",
        },
        {
          text: this.$t("transactionDate"),
          align: "center",
          sortable: false,
          value: "created_at",
        },
        {
          text: this.$t("transactionPrice"),
          align: "center",
          sortable: false,
          value: "amount",
        },
        {
          text: this.$t("transactionType"),
          align: "center",
          sortable: false,
          value: "type",
        },
        {
          text: this.$t("status"),
          align: "center",
          sortable: false,
          value: "status",
        },
        {
          text: this.$t("reason"),
          align: "center",
          sortable: false,
          value: "reason",
        },
      ];
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
@import "../assets/styles/style.css";
@media screen and (min-width: 840px) {
  .tableStriped {
    display: block;
  }

  .responsive-cards {
    display: none;
  }
}

@media screen and (max-width: 839px) {
  .tableStriped {
    display: none;
  }

  .responsive-cards {
    display: block;
  }
}
</style>
