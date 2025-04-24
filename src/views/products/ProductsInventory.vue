<template>
  <v-container class="mt-5">
    <h2>{{ $t("productsInventory") }}</h2>
    <div class="d-flex justify-space-between align-center my-3">
      <v-text-field prepend-inner-icon="search" color="#4fca9a" hide-details outlined class="search"
        v-model="searchProduct" @input="search(1)" :placeholder="$t('search')">
        <template v-slot:append>
          <v-icon color="#4fca9a">mdi-barcode</v-icon>
        </template>
      </v-text-field>
      <v-btn dark color="#62C83F" height="35px" :class="[marginThree, 'add-btn']" v-if="selectedProducts.length > 1"
        @click="multiInventoryDialog = true">
        {{ $t("productsInventory") }}
      </v-btn>
    </div>
    <v-data-table v-model="selectedProducts" :headers="filterHeaders" :items="products" :items-per-page="itemsPerPage"
      :page.sync="currentPage" item-key="product.id" show-select hide-default-footer
      :class="[$i18n.locale == 'en' ? 'eng-table' : '', , 'mt-5 tableStriped']">
      <template slot="no-data">{{ $t("noProduct") }}</template>
      <template slot="item.product.image" slot-scope="{ item }">
        <td>
          <v-avatar>
            <img :src="item.product.image ? item.product.image : 'imgs/product.png'
              " /></v-avatar>
        </td>
      </template>
      <template slot="item.product.categories" slot-scope="{ item }">
        <td>
          <span v-for="(category, index) in item.product.categories" :key="category.id">
            {{ index != item.product.categories.length - 1 ? "," : ""
            }}{{ category.title }}
          </span>
        </td>
      </template>
      <template slot="item.product.price_before_tax" slot-scope="{ item }">
        <td>
          {{ $RoundingNumber(item.product.price_before_tax, 'product') }}
        </td>
      </template>
      <template slot="item.product.price_after_tax" slot-scope="{ item }">
        <td>
          {{ $RoundingNumber(item.product.price_after_tax, 'product') }}
        </td>
      </template>
      <template slot="item.actions" slot-scope="{ item }">
        <td v-if="selectedProducts.length <= 1">
          <v-btn class="actions rounded-lg" color="#62C83F" dark @click="SingleProductInventory(item)">{{ $t("inventory")
          }}</v-btn>
        </td>
      </template>
    </v-data-table>
    <div class="cards-responsive">
      <div v-if="products.length == 0" class="no-data-container">
        <p>{{ $t("noProducts") }}</p>
      </div>
      <v-row v-else>
        <v-col v-for="product in products" :key="product.id" cols="12" :sm="products.length > 1 ? '6' : '12'" xs="12">
          <v-card class="mx-auto" outlined>
            <v-card-text class="d-flex flex-column" :class="products.length > 1 ? 'button-responsive' : ''">
              <div class="d-flex justify-space-between align-stretch mb-2">
                <div class="d-flex justify-space-between" style="flex-basis: 55%;">
                  <v-checkbox value class="mt-0" @click="addToProducts(product)"></v-checkbox>
                  <div>
                    <v-avatar style="width: 70px; height: 70px;">
                      <img :src="product.product.image ? product.product.image : 'imgs/product.png'
                        " /></v-avatar>
                  </div>
                </div>
                <div v-if="selectedProducts.length <= 1">
                  <v-btn class="actions" color="#62C83F" dark @click="SingleProductInventory(product)">{{
                    $t("inventory")
                  }}</v-btn>
                </div>
              </div>
              <div class="d-flex flex-wrap justify-start align-center invoice-content-responsive" style="gap:10px">
                <div class="d-flex justify-start align-center pb-0" style="gap: 5px">
                  <span>{{ filterHeaders[0].text }} :</span>
                  <p>{{ product.product.name }}</p>
                </div>
                <div class="d-flex justify-start align-center pb-0" style="gap: 5px">
                  <span>{{ filterHeaders[3].text }} :</span>
                  <p>{{ product.product.serial }}</p>
                </div>
                <div class="d-flex justify-start align-center pb-0" style="gap: 5px">
                  <span>{{ filterHeaders[4].text }} :</span>
                  <p>{{ product.product.price_before_tax }}</p>
                </div>
                <div class="d-flex justify-start align-center pb-0" style="gap: 5px" v-if="taxInvoice == 1">
                  <span>{{ filterHeaders[5].text }} :</span>
                  <p>{{ product.product.price_after_tax }}</p>
                </div>
                <div class="d-flex justify-start align-center pb-0" style="gap: 5px">
                  <span>{{ $t('qty') }} :</span>
                  <p>{{ product.product.quantity }}</p>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <v-pagination v-model="currentPage" :length="pageCount" class="pagination" :next-icon="$t('next')"
      :prev-icon="$t('previous')"></v-pagination>
    <v-dialog v-model="productInventoryDialog" :max-width="$vuetify.breakpoint.width < 425 ? '100%' : '450px'"
      @click:outside="close">
      <v-card class="mx-auto" style="padding: 0 1.5rem">
        <v-card-title class="d-flex justify-space-between align-center pb-1 card-title-container"
          v-for="selectedProduct in selectedProducts" :key="selectedProduct.product.id">
          <p class="mb-0">{{
            selectedProduct.product.name
          }} </p><v-icon color="black" @click="close" size="22">mdi-close</v-icon>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-2">
          <v-form class="form-container" style="gap:15px">
            <div v-for="selectedProduct in selectedProducts" :key="selectedProduct.product.id">
              <div>
                <label>{{ $t("predictedAmount") }}</label>
                <v-text-field v-model="selectedProduct.quantity" color="#8F8F8F" outlined readonly></v-text-field>
              </div>
              <div>
                <label>{{ $t("actualAmount") }}</label>
                <v-text-field v-model="selectedProduct.actualAmount" :placeholder="$t('actualAmount')" color="#8F8F8F"
                  outlined></v-text-field>
              </div>
            </div>
            <div class="d-flex justify-center align-center">
              <v-btn color="#62C83F" class="white--text" @click="inventoryProduct" height="30" width="35%">
                {{ $t("adjust") }}
              </v-btn>
              <v-btn color="#707070" :class="[marginTwo, 'white--text']" @click="close" height="30" width="35%">
                {{ $t("cancel") }}
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="multiInventoryDialog" max-width="600px" @click:outside="close">
      <v-card>
        <v-container class="pt-0">
          <v-card-title class="d-flex justify-space-between align-center pb-1">
            {{ $t("productsInventory") }}
            <v-icon color="black" @click="close">mdi-close</v-icon></v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-simple-table :class="[
              $i18n.locale == 'en' ? 'eng-table' : '',
              ,
              'mt-5',
            ]">
              <thead>
                <tr>
                  <th class="text-center">{{ $t("productName") }}</th>
                  <th class="text-center">{{ $t("predictedAmount") }}</th>
                  <th class="text-center">{{ $t("actualAmount") }}</th>
                  <th class="text-center">{{ $t("status") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in selectedProducts" :key="product.product_name" :style="product.quantity != product.actualAmount
                  ? 'background:#e50d0d1a !important'
                  : ''
                  ">
                  <td>{{ product.product_name }}</td>
                  <td>{{ product.quantity + " " + $t("piece") }}</td>
                  <td>
                    <v-text-field v-model="product.actualAmount" color="#8F8F8F" class="ml-2 actual-amount" outlined
                      hide-details>
                    </v-text-field>
                    {{ $t("piece") }}
                  </td>
                  <td>
                    <v-icon :color="product.quantity == product.actualAmount
                      ? 'green'
                      : 'red'
                      ">mdi-checkbox-blank-circle</v-icon>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
          <v-card-actions class="d-flex justify-center align-center">
            <v-btn color="#62C83F" dark class="rounded-lg mr-2" @click="inventoryProduct">{{ $t("adjust") }}</v-btn>
            <v-btn color="#707070" dark :class="[marginTwo, 'rounded-lg']" @click="close">{{ $t("cancel") }}</v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 10,
      pageCount: null,
      selectedProducts: [],
      products: [],
      searchProduct: "",
      actualAmount: 0,
      taxInvoice: "",
      productInventoryDialog: false,
      multiInventoryDialog: false,
    };
  },
  methods: {
    getData() {
      this.meDetails = JSON.parse(localStorage.getItem('meDetails'));
      this.taxInvoice = localStorage.getItem("taxInvoice");
      if (this.meDetails['is_subscribed'] && this.meDetails["subscription"]["stocks"]) {
        axios
          .get("stock", {
            params: { page: this.currentPage },
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
          .then((res) => {
            this.products = res.data.data.products.data.map((item) => {
              return {
                ...item,
                actualAmount: 0,
              };
            });
            this.pageCount = res.data.data.products.meta.last_page;
          })
          .catch((err) => {
            if (err.response.data.message == "Unauthenticated.")
              this.$store.dispatch("logout");
          });
      }
    },
    addToProducts(product) {
      const index = this.selectedProducts.findIndex(item => item.stockId == product.stockId);
      if (index == -1) {
        this.selectedProducts.push({ ...product })
      }
      else {
        this.selectedProducts = this.selectedProducts.filter(item => item.stockId != product.stockId);
      }

    },
    // open dialog for single product inventory
    SingleProductInventory(item) {
      this.selectedProducts = [];
      this.selectedProducts.push({ ...item });
      this.productInventoryDialog = true;
    },
    //update stock products
    inventoryProduct() {
      const products = this.selectedProducts.map(
        ({ stockId: id, actualAmount: quantity }) => ({
          id,
          quantity,
        })
      );
      axios
        .put(
          "update-stock",
          {
            stock: products,
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then(() => this.close())
        .catch((err) => {
          if (err.response.data.message == "Unauthenticated.")
            this.$store.dispatch("logout");
        });
    },
    //search for product
    search(page) {
      axios
        .get("stock", {
          params: { search: this.searchProduct, page: page },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          this.products = res.data.data.products.data;
          this.pageCount = res.data.data.products.meta.last_page;
        })
        .catch((err) => {
          if (err.response.data.message == "Unauthenticated.")
            this.$store.dispatch("logout");
        });
    },
    close() {
      this.productInventoryDialog = this.multiInventoryDialog = false;
      this.getData();
      this.selectedProducts = [];
    },
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t("productName"),
          align: "center",
          sortable: false,
          value: "product.name",
        },
        {
          text: this.$t("icon"),
          align: "center",
          sortable: false,
          value: "product.image",
        },
        {
          text: this.$t("category"),
          align: "center",
          sortable: false,
          value: "product.categories",
        },
        {
          text: this.$t("barcode"),
          align: "center",
          sortable: false,
          value: "product.serial",
        },
        {
          text: this.$t("priceBeforeTax"),
          align: "center",
          sortable: false,
          value: "product.price_before_tax",
        },
        {
          text: this.$t("priceAfterTax"),
          align: "center",
          sortable: false,
          value: "product.price_after_tax",
        },
        {
          text: this.$t("qty"),
          align: "center",
          sortable: false,
          value: "quantity",
        },
        {
          text: this.$t("actions"),
          align: "center",
          sortable: false,
          value: "actions",
        },
      ];
    },
    filterHeaders() {

      return this.headers.filter((item) => {
        if (this.taxInvoice != 1) return item.text !== this.$t("priceAfterTax");
        if (this.selectedProducts.length > 1)
          return item.text !== this.$t("actions");
        return true;
      });
    },
    marginThree() {
      return this.$i18n.locale == "en" ? "ml-3" : "mr-3";
    },
    marginTwo() {
      return this.$i18n.locale == "en" ? "ml-2" : "mr-2";
    },
  },
  watch: {
    currentPage() {
      if (this.searchProduct != '') this.search();
      else this.getData();
    },
  },
  mounted() {
    this.getData();
  },
};
</script>
<style scoped>
@import "../../assets/styles/style.css";

.search.v-input {
  max-width: 30%;
}

.cardForm {
  width: 100% !important;
  padding: 20px !important;
}

.v-data-table::v-deep .mdi-checkbox-marked,
.v-data-table::v-deep .mdi-minus-box,
 :deep(.mdi-minus-box),
 :deep(.mdi-checkbox-marked) {
  color: #4fca9a !important;
}

.v-data-table::v-deep .actual-amount.v-input {
  width: 35%;
  display: inline-block;
}

.v-data-table::v-deep .actual-amount .v-input__slot {
  min-height: 30px !important;
}
</style>
