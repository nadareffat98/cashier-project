<template>
  <v-container class="mt-5">
    <h2>{{ $t("productMovement") }}</h2>
    <div class="product-info">
      <div>
        {{
          $t("openingBalance") +
          " : " +
          (product.balance == null ? 0 : product.balance)
        }}
      </div>
      <div>
        {{ $t("barcode") + " : " + product.serial }}
      </div>
      <div>
        {{ $t("productName") + " : " + product.name }}
      </div>
    </div>
    <v-data-table
      :headers="headers"
      :items="movements"
      item-key="name"
      height="50vh"
      fixed-header
      disable-pagination
      hide-default-footer
      mobile-breakpoint="0"
      :class="[$i18n.locale == 'en' ? 'eng-table' : '', , 'mt-5 tableStriped']"
    >
      <template slot="no-data">{{ $t("noMovements") }}</template>
      <template slot="item.movementDate" slot-scope="{ item }">
        <td>
          {{ new Date(item.movementDate).toLocaleDateString("en-US") }}
        </td>
      </template>
      <template slot="item.balance" slot-scope="{ index }">
        <td style="direction: ltr !important">{{ calculateBalance(index) }}</td>
      </template>
    </v-data-table>
    <div class="cards-responsive">
      <div v-if="movements.length == 0" class="no-data-container">
        <p>{{ $t("noMovements") }}</p>
      </div>
      <v-row v-else>
        <v-col
          v-for="movement in movements"
          :key="movement.id"
          cols="12"
          :sm="movements.length > 1 ? '6' : '12'"
          xs="12"
        >
          <v-card class="mx-auto" outlined>
            <v-card-text
              class="d-flex flex-wrap justify-start align-center invoice-content-responsive"
              :class="movements.length > 1 ? 'button-responsive' : ''"
              style="gap: 10px"
            >
              <template v-for="(header, index) in headers">
                <div
                  v-if="
                    header.value != 'balance' && header.value != 'movementDate'
                  "
                  :key="header.value"
                  class="d-flex justify-start align-center pb-0"
                  style="gap: 5px"
                >
                  <span>{{ header.text }} :</span>
                  <p>{{ movement[header.value] }}</p>
                </div>
                <div
                  v-else-if="header.value == 'movementDate'"
                  :key="header.value"
                >
                  <span>{{ header.text }} : </span>
                  <p>
                    {{
                      new Date(movement.movementDate).toLocaleDateString(
                        "en-US"
                      )
                    }}
                  </p>
                </div>
                <div
                  v-else
                  class="d-flex justify-start align-center pb-0"
                  style="gap: 5px"
                  :key="header.value"
                >
                  <span>{{ header.text }} : </span>
                  <p>{{ calculateBalance(index) }}</p>
                </div>
              </template>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      productId: this.$route.params.productId,
      product: "",
      movements: [],
    };
  },
  methods: {
    getData() {
      axios
        .get(`movements/${this.productId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          this.product = res.data.data;
          this.movements = this.product.movements.data;
        })
        .catch((err) => console.log(err));
    },
    calculateBalance(index) {
      var balance = this.product["balance"];
      for (var i = 0; i <= index; i++) {
        if (
          this.movements[i]["movementType"] == "order" ||
          this.movements[i]["movementType"] == "refundPurchase"
        )
          balance -= this.movements[i]["quantity"];
        else if (this.movements[i]["movementType"] == "adjusting")
          balance = this.movements[i]["quantity"];
        else {
          if (this.movements[i]["quantity"])
            balance += this.movements[i]["quantity"];
        }
      }
      return balance;
    },
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t("date"),
          align: "center",
          sortable: false,
          value: "movementDate",
        },
        {
          text: this.$t("invoiceNumber"),
          align: "center",
          sortable: false,
          value: "movementNumber",
        },
        {
          text: this.$t("qty"),
          align: "center",
          sortable: false,
          value: "quantity",
        },
        {
          text: this.$t("type"),
          align: "center",
          sortable: false,
          value: "movementType",
        },
        {
          text: this.$t("balance"),
          align: "center",
          sortable: false,
          value: "balance",
        },
      ];
    },
    marginThree() {
      return this.$i18n.locale == "en" ? "ml-3" : "mr-3";
    },
  },
  created() {
    this.getData();
  },
};
</script>
<style scoped>
.product-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
}

.product-info div {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background: #4fca9a;
  padding: 10px;
  max-width: 170px;
  border-radius: 10px;
}

.product-info div:last-child {
  width: auto;
  max-width: none;
}

@media (max-width: 445px) {
  .product-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .product-info div {
    max-width: none;
    width: 100% !important;
    padding: 5px;
  }
}
</style>
