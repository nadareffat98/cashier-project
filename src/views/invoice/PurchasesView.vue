<template>
  <v-container class="mt-5">
    <h2>{{ $t("purchases") }}</h2>
    <v-btn-toggle class="d-flex justify-center btnGroup">
      <v-btn
        :class="[
          { active: getStatus == 'purchases' },
          $i18n.locale == 'en' ? 'rounded-r-0' : 'rounded-l-0',
          'rounded-lg',
        ]"
        color="white"
        @click="changeRoute($t('purchasesInvoices'))"
        >{{ $t("purchasesInvoices") }}</v-btn
      >
      <v-btn
        :class="[
          { active: getStatus == 'returns' },
          $i18n.locale == 'en' ? 'rounded-l-0' : 'rounded-r-0',
          'rounded-lg',
        ]"
        color="white"
        @click="changeRoute($t('purchasesRefund'))"
        >{{ $t("purchasesRefund") }}</v-btn
      >
    </v-btn-toggle>
    <div class="d-flex justify-space-between align-center my-3">
      <div class="d-flex justify-space-between align-center">
        <v-icon color="#4FCA9A" size="25" class="icon"> search</v-icon>
        <input
          v-model="searchInvoice"
          type="search"
          :placeholder="$t('searchByInvoiceNumber')"
          @input="search"
        />
        <v-btn
          :class="[marginOne]"
          height="31"
          width="31"
          color="#4FCA9A"
          style="min-width: 31px !important"
          @click="openFilter"
        >
          <v-icon size="25" color="white">mdi-filter</v-icon>
        </v-btn>
      </div>
      <v-btn
        dark
        color="#4FCA9A"
        class="add-btn"
        height="34px"
        @click="goToCashier"
        v-if="getStatus == 'purchases'"
      >
        <v-icon color="white" size="26" :left="$i18n.locale == 'en'"
          >add_box</v-icon
        >
        <span class="addText"> {{ $t("addPurchasesInvoice") }}</span>
      </v-btn>
      <v-btn
        dark
        color="#4FCA9A"
        class="add-btn"
        height="35px"
        @click="openRefundDialog"
        v-else
      >
        <v-icon color="white" size="26" :left="$i18n.locale == 'en'"
          >add_box</v-icon
        >
        <span class="addText"> {{ $t("addRefundIvoice") }}</span>
      </v-btn>
    </div>
    <v-data-table
      :headers="headers"
      :items="invoices"
      :page.sync="currentPage"
      :items-per-page="itemsPerPage"
      hide-default-footer
      :class="[$i18n.locale == 'en' ? 'eng-table' : '', 'mt-5 tableStriped']"
    >
      <template slot="no-data">{{ $t("noInvoices") }}</template>
      <template
        slot="item.invoice_meta_data.invoice_number"
        slot-scope="{ item }"
      >
        <td>
          {{
            getStatus == "purchases"
              ? item.invoice_meta_data.invoice_number
              : item.invoice_meta_data.refund_invoice_number
          }}
        </td>
      </template>
      <template
        slot="item.invoice_meta_data.invoice_created_at"
        slot-scope="{ item }"
      >
        <td>
          {{
            new Date(
              item.invoice_meta_data.invoice_created_at
            ).toLocaleDateString("en-US")
          }}
        </td>
      </template>
      <template slot="item.actions" slot-scope="{ item }">
        <td>
          <div class="d-flex justify-center align-center" style="gap: 5px">
            <v-btn
              class="actions"
              color="#707070"
              dark
              @click="printInvoice(item, 'show')"
              >{{ $t("view") }}</v-btn
            >
            <v-btn
              class="actions"
              color="#62C83F"
              dark
              @click="printInvoice(item, 'print')"
              >{{ $t("print") }}</v-btn
            >
            <v-btn
              class="actions"
              color="#2BB3B3"
              dark
              @click="printInvoice(item, 'pdf')"
              >{{ $t("download") }}</v-btn
            >
            <v-btn
              class="actions"
              color="#E50D0D"
              dark
              v-if="
                getStatus == 'purchases' &&
                item.invoice_meta_data.refund_invoice_id == null
              "
              @click="openReturnDialog(item)"
              >{{ $t("refundTheInvoice") }}</v-btn
            >
            <v-btn
              class="actions"
              color="#E50D0D"
              dark
              v-if="
                getStatus == 'purchases' &&
                item.invoice_meta_data.refund_invoice_id != null
              "
              @click="getRefundInvoice(item)"
              >{{ $t("refund") }}</v-btn
            >
            <v-btn
              class="actions"
              :width="$i18n.locale == 'en' ? '125' : '100'"
              color="#E50D0D"
              dark
              v-if="getStatus != 'purchases' && havePermission"
              @click="getInvoice(item, 'show')"
              >{{ $t("originaleInvoice") }}</v-btn
            >
            <v-btn
              icon
              class="actions"
              color="black"
              @click="openImage(item)"
              v-if="getStatus == 'purchases' && item.image != null"
              ><v-icon size="25">mdi-eye-outline</v-icon></v-btn
            >
          </div>
        </td>
      </template>
    </v-data-table>
    <div class="invoice-responsive">
      <div v-if="invoices.length == 0" class="no-data-container">
        <p>{{ $t("noInvoices") }}</p>
      </div>
      <v-row v-else>
        <v-col
          v-for="invoice in invoices"
          :key="invoice.id"
          cols="12"
          :sm="invoices.length > 1 ? '6' : '12'"
          xs="12"
        >
          <v-card class="mx-auto d-flex" style="height: 100%" outlined>
            <v-card-text
              class="d-flex flex-wrap justify-start align-center invoice-content-responsive"
              :class="invoices.length > 1 ? 'button-responsive' : ''"
              style="gap: 10px"
            >
              <div>
                <span>{{ headers[0].text }} :</span>
                <p>{{ invoice.invoice_meta_data.invoice_number }}</p>
              </div>
              <div>
                <span>{{ headers[1].text }} :</span>
                <p>{{ invoice.contact.tax_number }}</p>
              </div>
              <div>
                <span>{{ headers[2].text }} :</span>
                <p>{{ invoice.contact.name }}</p>
              </div>
              <div>
                <span>{{ headers[3].text }} :</span>
                <p>
                  {{
                    new Date(
                      invoice.invoice_meta_data.invoice_created_at
                    ).toLocaleDateString("en-US")
                  }}
                </p>
              </div>
              <div>
                <span>{{ headers[4].text }} :</span>
                <p>{{ invoice.invoice_totals.final_total }}</p>
              </div>
              <div class="d-flex justify-center" style="width: 100%">
                <v-btn
                  class="actions"
                  color="#707070"
                  dark
                  @click="printInvoice(invoiceId, 'show')"
                  >{{ $t("view") }}</v-btn
                >
                <v-btn
                  :class="[marginTwo, 'actions']"
                  color="#62C83F"
                  dark
                  @click="printInvoice(invoiceId, 'print')"
                  >{{ $t("print") }}</v-btn
                >
                <v-btn
                  :class="[marginTwo, 'actions']"
                  color="#2BB3B3"
                  dark
                  @click="printInvoice(invoiceId, 'pdf')"
                  >{{ $t("download") }}</v-btn
                >
                <v-btn
                  :class="[marginTwo, 'actions']"
                  color="#E50D0D"
                  dark
                  v-if="
                    getStatus == 'purchases' &&
                    invoice.invoice_meta_data.refund_invoice_id == null
                  "
                  @click="openReturnDialog(invoice)"
                  >{{ $t("refundTheInvoice") }}</v-btn
                >
                <v-btn
                  :class="[marginTwo, 'actions']"
                  color="#E50D0D"
                  dark
                  v-if="
                    getStatus == 'purchases' &&
                    invoice.invoice_meta_data.refund_invoice_id != null
                  "
                  @click="getRefundInvoice(invoice)"
                  >{{ $t("refund") }}</v-btn
                >
                <v-btn
                  :class="[marginTwo, 'actions']"
                  color=" #E50D0D"
                  dark
                  v-if="getStatus != 'purchases'"
                  @click="getInvoice(invoice, 'show')"
                  >{{ $t("originaleInvoice") }}</v-btn
                >
                <v-btn
                  icon
                  class="actions"
                  color="black"
                  v-if="getStatus == 'purchases' && invoice.image != null"
                  @click="openImage(invoice)"
                  ><v-icon size="25">mdi-eye-outline</v-icon></v-btn
                >
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <v-pagination
      v-model="currentPage"
      :length="pageCount"
      class="pagination"
      :next-icon="$t('next')"
      :prev-icon="$t('previous')"
    ></v-pagination>
    <v-dialog
      v-model="returnPurchasesDialog"
      max-width="700px"
      @click:outside="close"
    >
      <v-card>
        <!-- -----------------data for products ------------------>
        <v-card-title class="text-h5">{{ $t("products") }} </v-card-title>
        <v-card-text>
          <div v-if="message">
            <v-alert dense outlined type="error">
              {{ message }}
            </v-alert>
          </div>
          <v-data-table
            :headers="filterProductsHeaders"
            :items="products"
            fixed-header
            height="auto"
            max-height="30vh"
            disable-pagination
            disable-sort
            hide-default-footer
            mobile-breakpoint="0"
            class="mt-5 tableStriped productTable"
          >
            <template slot="no-data">{{ $t("noProduct") }}</template>
            <template v-slot:item="{ item }">
              <tr @click="decreaseQuantity(item)">
                <td>{{ item.name }}</td>
                <td>{{ item.serial }}</td>
                <td>
                  <v-btn
                    min-width="10"
                    width="30"
                    min-height="30"
                    height="30"
                    >{{ item.quantity }}</v-btn
                  >
                  <v-icon color="#4FCA9A" @click.stop="decreaseQuantity(item)"
                    >mdi-chevron-down</v-icon
                  >
                </td>
                <td>
                  {{ item.list_amount }}
                </td>
                <td v-if="is_taxed">
                  {{ item.gross_amount }}
                </td>
                <td>
                  {{
                    is_taxed
                      ? item.gross_amount * item.quantity
                      : item.list_amount * item.quantity
                  }}
                </td>
              </tr>
              <tr>
                <td
                  :colspan="filterProductsHeaders.length"
                  style="text-align: left"
                  @click="refundAllProdcut(item, 'products')"
                >
                  <v-btn color="#4FCA9A" dark> {{ $t("refundAll") }}</v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
          <v-divider></v-divider>
        </v-card-text>
        <!-- ---------------data for returned products ------------>
        <v-card-title class="text-h5 pt-0">{{ $t("refunds") }}</v-card-title>
        <v-card-text>
          <v-data-table
            :headers="filterProductsHeaders"
            :items="refundProducts"
            fixed-header
            height="auto"
            max-height="30vh"
            disable-pagination
            disable-sort
            hide-default-footer
            mobile-breakpoint="0"
            class="mt-5 tableStriped productTable"
          >
            <template slot="no-data">{{ $t("noRefunds") }}</template>

            <template v-slot:item="{ item }">
              <tr>
                <td>{{ item.name }}</td>
                <td>{{ item.serial }}</td>
                <td>
                  <v-btn
                    min-width="10"
                    width="30"
                    min-height="30"
                    height="30"
                    >{{ item.quantity }}</v-btn
                  >
                  <v-icon color="#4FCA9A" @click="increaseQuantity(item)"
                    >mdi-chevron-up</v-icon
                  >
                </td>
                <td>
                  {{ item.list_amount }}
                </td>
                <td v-if="is_taxed">
                  {{ item.gross_amount }}
                </td>
                <td>
                  {{
                    is_taxed
                      ? item.gross_amount * item.quantity
                      : item.list_amount * item.quantity
                  }}
                </td>
              </tr>
              <tr>
                <td
                  :colspan="filterProductsHeaders.length"
                  style="text-align: left"
                  @click="refundAllProdcut(item, 'refunds')"
                >
                  <v-btn color="#4FCA9A" dark> {{ $t("refundAll") }}</v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
          <div
            class="d-flex justify-space-between align-center cardForm"
            style="width: 100% !important"
            v-if="showDiscount"
          >
            <v-text-field
              v-model="discountValue"
              :placeholder="$t('discountValue')"
              hide-details
              color="#8F8F8F"
              outlined
            >
            </v-text-field>
            <v-btn-toggle
              class="d-flex justify-center align-center btnGroup mr-2"
            >
              <v-btn
                :class="[
                  { active: discountFixed },
                  $i18n.locale == 'en' ? 'rounded-r-0' : 'rounded-l-0',
                  'rounded-lg mt-2',
                ]"
                color="white"
                @click="discountFixed = true"
                >{{ $t("SRmini") }}</v-btn
              >
              <v-btn
                :class="[
                  { active: !discountFixed },
                  $i18n.locale == 'en' ? 'rounded-l-0' : 'rounded-r-0',
                  'rounded-lg mt-2',
                ]"
                color="white"
                @click="discountFixed = false"
                >%</v-btn
              >
            </v-btn-toggle>
          </div>
        </v-card-text>
        <!-- ------------------total cost------------------------->
        <v-card-text>
          <div class="total-cost">
            <p class="mr-5">
              {{ is_taxed ? $t("subtotal") : $t("total") }}
              :
            </p>
            <p class="black--text">
              {{ $RoundingNumber(subTotal, "product") + $t("SRmini") }}
            </p>
          </div>
          <v-divider></v-divider>
          <div class="total-cost" v-if="discountValue != 0">
            <p class="mr-5">
              {{ $t("priceAfterDiscount") }}
              :
            </p>
            <p class="black--text">
              {{ $RoundingNumber(total, "product") + $t("SRmini") }}
            </p>
          </div>
          <v-divider v-if="discountValue != 0"></v-divider>
          <div class="total-cost" v-if="is_taxed">
            <p class="mr-5">
              {{ $t("AddedTax") }}
              :
            </p>
            <p class="black--text">
              {{
                $RoundingNumber(totalPrice - total, "product") + $t("SRmini")
              }}
            </p>
          </div>
          <v-divider v-if="is_taxed"></v-divider>
          <div class="total-cost" v-if="is_taxed">
            <p class="mr-5">
              {{ $t("total") }}
              :
            </p>
            <p class="black--text">
              {{ totalPrice + $t("SRmini") }}
            </p>
          </div>
          <v-divider v-if="is_taxed"></v-divider>
        </v-card-text>
        <v-card-actions
          class="d-flex justify-center align-center pb-3"
          style="font-family: 'BahjiiSemiBold'"
        >
          <v-btn
            dark
            color="#62C83F"
            class="rounded-lg mb-2"
            @click="submitRefund(invoiceId)"
          >
            {{ $t("confirmRefund") }}
          </v-btn>

          <v-btn
            dark
            color="#EF0B0B"
            :class="[marginTwo, 'rounded-lg mb-2']"
            @click="close"
          >
            {{ $t("cancel") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="refundInvoiceDialog"
      :max-width="$vuetify.breakpoint.width < 425 ? '100%' : '450px'"
    >
      <v-card
        class="mx-auto"
        :style="
          $vuetify.breakpoint.width < 425
            ? 'padding:0 0.8rem'
            : 'padding: 0 1.5rem'
        "
      >
        <v-card-title
          class="d-flex justify-space-between align-center pb-1 card-title-container"
          >{{ $t("refund") }}
          <v-icon color="black" @click="refundInvoiceDialog = false" size="22"
            >mdi-close</v-icon
          ></v-card-title
        >
        <v-divider></v-divider>
        <v-card-text class="mt-2">
          <v-form
            class="form-container"
            style="gap: 15px"
            @submit.prevent="getInvoice(null, 'dialog')"
          >
            <p
              class="mb-3"
              v-if="message"
              style="color: red; padding-right: 15px"
            >
              <v-icon color="red" size="12" class="ml-1">emergency</v-icon>
              {{ message }}
            </p>
            <label>{{ $t("invoiceNumber") }}</label>
            <v-text-field
              v-model="invoiceNumber"
              :placeholder="$t('invoiceNumber')"
              color="#8F8F8F"
              outlined
            ></v-text-field>
            <div class="d-flex justify-center align-center">
              <v-btn
                color="#4FCA9A"
                width="40%"
                height="30"
                dark
                @click="getInvoice(null, 'dialog')"
              >
                {{ $t("refund") }}
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="filterDialog"
      :max-width="$vuetify.breakpoint.width < 425 ? '100%' : '450px'"
    >
      <v-card
        class="mx-auto"
        :style="
          $vuetify.breakpoint.width < 425
            ? 'padding:0 0.8rem'
            : 'padding: 0 1.5rem'
        "
      >
        <v-card-title
          class="d-flex justify-space-between align-center pb-1 card-title-container"
          >{{ $t("searchForInvoice") }}
          <v-icon color="black" @click="filterDialog = false" size="22"
            >mdi-close</v-icon
          ></v-card-title
        >
        <v-divider></v-divider>
        <v-card-text class="mt-2">
          <v-form
            class="form-container"
            style="gap: 15px"
            @submit.prevent="getInvoice(null, 'dialog')"
          >
            <div>
              <label>{{ $t("supplierName") }}</label>
              <v-autocomplete
                :items="getSuppliers"
                v-model="supplier"
                item-text="name"
                return-object
                outlined
              ></v-autocomplete>
            </div>
            <div>
              <label>{{ $t("invoiceDate") }}</label>
              <div
                class="d-flex justif-space-between calendar-container"
                style="gap: 10px"
              >
                <v-menu
                  v-model="menuOpenFrom"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="dateFrom"
                  ref="menuFrom"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="from"
                      append-icon="mdi-calendar-month"
                      @click:append="menuOpenFrom = true"
                      :placeholder="$t('from')"
                      outlined
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dateFrom"
                    @input="$refs.menuFrom.save(dateFrom)"
                    no-title
                    scrollable
                    style="direction: ltr"
                  >
                  </v-date-picker>
                </v-menu>
                <v-menu
                  v-model="menuOpenTo"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="dateTo"
                  ref="menuTo"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="to"
                      append-icon="mdi-calendar-month"
                      @click:append="menuOpenTo = true"
                      :placeholder="$t('to')"
                      outlined
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dateTo"
                    @input="$refs.menuTo.save(dateTo)"
                    no-title
                    scrollable
                    style="direction: ltr"
                  >
                  </v-date-picker>
                </v-menu>
              </div>
            </div>
            <div class="d-flex justify-center align-center">
              <v-btn
                color="#62C83F"
                height="30"
                width="35%"
                dark
                @click="search"
              >
                {{ $t("search") }}
              </v-btn>
              <v-btn
                color="#62C83F"
                outlined
                height="30"
                width="35%"
                :class="marginTwo"
                @click="reset"
              >
                {{ $t("reset") }}
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="openImageDialog"
      max-width="500"
      @click:outside="openImageDialog = false"
      style="height: 500px"
    >
      <v-card>
        <v-img :src="invoiceImage" contain></v-img>
      </v-card>
    </v-dialog>
    <alert-dialog v-if="serviceValidationDialog" @close="close" :close="close">
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
          @click="close"
          >{{ $t("notNow") }}</v-btn
        >
      </template>
    </alert-dialog>
    <alert-dialog
      v-if="successDialog"
      :buttonName="$t('done')"
      color="#62C83F"
      :close="close"
      @close="close"
    >
      <template #title> {{ $t("refundedSuccessfully") }} </template>
    </alert-dialog>
    <alert-dialog
      v-if="alertDialog"
      @close="close"
      :close="close"
      :buttonName="$t('accept')"
      color="#62C83F"
    >
      <template #text>
        <p class="mb-2">
          <v-icon color="red" size="12" class="ml-1">emergency</v-icon>
          {{ message }}
        </p>
      </template>
    </alert-dialog>
  </v-container>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      meDetails: null,
      userType: null,
      title: this.$route.query.title,
      returnPurchasesDialog: false,
      refundInvoiceDialog: false,
      serviceValidationDialog: false,
      openImageDialog: false,
      showDiscount: false,
      successDialog: false,
      filterDialog: false,
      alertDialog: false,
      searchMode: false,
      parameter: {},
      discountValue: "",
      discountFixed: true,
      currentPage: 1,
      itemsPerPage: 10,
      pageCount: 0,
      invoiceNumber: null,
      searchInvoice: "",
      pagePurchases: 0,
      pageReturnes: 0,
      isRefund: null,
      type: null,
      purchases: [],
      returns: [],
      invoices: [],
      products: [],
      supplier: "",
      menuOpenFrom: false,
      dateFrom: null,
      menuOpenTo: false,
      dateTo: null,
      refundProducts: [],
      invoiceId: null,
      productsHeaders: [
        {
          text: this.$t("productName"),
          align: "center",
          value: "name",
        },
        {
          text: this.$t("barcode"),
          align: "center",
          value: "serial",
        },
        {
          text: this.$t("qty"),
          align: "center",
          value: "quantity",
        },
        {
          text: this.is_taxed ? this.$t("costBeforeTax") : this.$t("cost"),
          align: "center",
          value: "cost_before_tax",
        },
        {
          text: this.$t("costAfterTax"),
          align: "center",
          value: "cost_after_tax",
        },
        {
          text: this.$t("total"),
          align: "center",
          value: "total_cost_after",
        },
      ],
      message: null,
      invoiceImage: null,
      is_taxed: false,
    };
  },
  methods: {
    getData() {
      this.meDetails = JSON.parse(localStorage.getItem("meDetails"));
      this.userType = this.meDetails.user_type;
      this.$store.dispatch("tax");
      this.purchases = this.returns = [];
      if (
        this.meDetails["is_subscribed"] &&
        this.meDetails["subscription"]["purchase_invoices"]
      ) {
        if (this.getStatus == "purchases") this.getPurchases();
        else this.getRefundPurchases();
        this.$store.dispatch("suppliers");
      }
    },
    getPurchases() {
      axios
        .get("purchases", {
          params: { page: this.currentPage },
        })
        .then((res) => {
          this.purchases = res.data.data.data;
          this.pagePurchases = res.data.data.meta.last_page;
          this.selectTable("purchases");
        })
        .catch((err) => {
          if (err.response.data.message == "Unauthenticated.")
            this.$store.dispatch("logout");
        });
    },
    getRefundPurchases() {
      axios
        .get("refundPurchases", {
          params: { page: this.currentPage },
        })
        .then((res) => {
          this.returns = res.data.data.refundPurchase.data;
          this.pageReturnes = res.data.data.refundPurchase.meta.last_page;
          this.selectTable("returns");
        })
        .catch((err) => {
          if (err.response.data.message == "Unauthenticated.")
            this.$store.dispatch("logout");
        });
    },
    selectTable(val) {
      if (val == "returns") {
        this.pageCount = this.pageReturnes;
        this.invoices = this.returns;
      } else {
        this.pageCount = this.pagePurchases;
        this.invoices = this.purchases;
      }
    },
    openImage(invoice) {
      this.invoiceImage = invoice.invoice_meta_data.supplier_invoice_image;
      this.openImageDialog = true;
    },
    // go to cashier
    goToCashier() {
      if (
        this.meDetails["is_subscribed"] &&
        this.meDetails["subscription"]["purchase_invoices"]
      )
        this.$router.push({
          name: "cashier",
          query: { title: this.$t("addInvoice") },
          params: { title: "purchases", keepAlive: false },
        });
      else this.serviceValidationDialog = true;
    },
    openFilter() {
      if (
        this.meDetails["is_subscribed"] &&
        this.meDetails["subscription"]["purchase_invoices"]
      )
        this.filterDialog = true;
      else this.serviceValidationDialog = true;
    },
    search() {
      this.filterDialog = false;
      this.searchMode = true;
      this.parameter = {
        supplier_id: this.supplier.id,
        date_from: this.dateFrom,
        date_to: this.dateTo,
      };
      if (this.currentPage == 1)
        setTimeout(() => {
          if (this.getStatus == "purchases") this.searchForPurchases();
          else this.searchForReturnedPurchases();
        }, 500);
      else this.currentPage = 1;
    },
    searchForPurchases() {
      axios
        .get("purchases", {
          params: {
            invoice_number: this.searchInvoice,
            page: this.currentPage,
            ...this.parameter,
          },
        })
        .then((res) => {
          this.pageCount = res.data.data.meta.last_page;
          this.invoices = res.data.data.data;
        })
        .catch((err) => console.log(err));
    },
    searchForReturnedPurchases(parameter) {
      axios
        .get("refundPurchases", {
          params: {
            refund_number: this.searchInvoice,
            page: this.currentPage,
            ...parameter,
          },
        })
        .then((res) => {
          this.invoices = res.data.data.refundPurchase.data;
          this.pageCount = res.data.data.refundPurchase.meta.last_page;
        })
        .catch((err) => console.log(err));
    },
    // open dialog to enter invoice number to return it
    openRefundDialog() {
      if (
        this.meDetails["is_subscribed"] &&
        this.meDetails["subscription"]["refund_purchase"]
      )
        this.refundInvoiceDialog = true;
      else this.serviceValidationDialog = true;
    },
    // get original invoice to print it or return it
    getInvoice(invoice, type) {
      if (this.invoiceNumber == null && type == "dialog") {
        this.message = this.$t("enterInvoiceNumber");
      } else {
        axios
          .get("purchases", {
            params: {
              invoice_number:
                type == "dialog" ? this.invoiceNumber : invoice.invoice_number,
            },
          })
          .then((res) => {
            const invoices = res.data.data.data;
            if (invoices.length != 0) {
              this.message = null;
              if (type == "show") this.printInvoice(invoices[0], "show");
              else {
                if (invoices[0].invoice_meta_data.refund_invoice_id == null)
                  this.openReturnDialog(invoices[0]);
                else this.message = this.$t("refundInvoiceErr");
              }
            } else {
              this.message = this.$t("noInvoices");
            }
          })
          .catch((err) => console.log(err));
      }
    },
    getRefundInvoice(invoice) {
      axios
        .get("refundPurchases", {
          params: {
            refund_number: invoice.refund_number,
          },
        })
        .then((res) => {
          const invoice = res.data.data.refundPurchase.data[0];
          this.printInvoice(invoice, "show");
        })
        .catch((err) => console.log(err));
    },
    // go to print or show page of purchase invoice
    printInvoice(invoice, type) {
      const is_user = this.meDetails.user_type;
      var downloadButton = true;
      localStorage.setItem("invoice", JSON.stringify(invoice));
      if (is_user == 1) {
        if (
          type == "print" &&
          !this.meDetails.employee_permissions.includes("purchases-print")
        ) {
          this.alertDialog = true;
          this.message = this.$t("haveNoPermissionPrint");
          return;
        } else if (
          type == "pdf" &&
          !this.meDetails.employee_permissions.includes("purchases-download")
        ) {
          this.alertDialog = true;
          this.message = this.$t("haveNoPermissionDown");
          return;
        } else if (
          type == "show" &&
          !this.meDetails.employee_permissions.includes("purchases-download")
        )
          downloadButton = false;
      }
      this.$router.push({
        name: "print",
        params: {
          type: type,
          button: downloadButton,
        },
      });
    },
    reset() {
      this.supplier = "";
      this.dateFrom = "";
      this.dateTo = "";
      this.searchInvoice = "";
      this.filterDialog = false;
      this.getData();
    },

    openReturnDialog(invoice) {
      if (
        this.userType == 1 &&
        !this.meDetails.employee_permissions.includes("purchases-refund")
      ) {
        console.log("kskn");
        this.message = this.$t("haveNoPermissionRefundPurchase");
        this.alertDialog = true;
        return;
      }
      if (
        this.meDetails["is_subscribed"] &&
        this.meDetails["subscription"]["refund_purchase"]
      ) {
        this.invoiceId = invoice.invoice_meta_data.invoice_id;
        if (invoice.invoice_totals.tax_amount == 0) this.is_taxed = false;
        else this.is_taxed = true;
        this.products = invoice["products"].map((item) =>
          Object.assign({}, item)
        );
        this.refundProducts = [];
        if (invoice.invoice_totals.discount_amount == 0)
          this.showDiscount = false;
        else {
          this.showDiscount = true;
          this.discountValue =
            invoice.invoice_totals.discount_percentage == 0
              ? invoice.invoice_totals.discount_amount
              : invoice.invoice_totals.discount_percentage;
          this.discountFixed =
            invoice.invoice_totals.discount_percentage == 0 ? true : false;
        }
        this.returnPurchasesDialog = true;
      } else this.serviceValidationDialog = true;
    },
    //increase quantity of product and decreasse quantity of refund product
    increaseQuantity(product) {
      var refundProductIndex = this.refundProducts.findIndex(
        (item) => item.id == product.id
      );
      var productIndex = this.products.findIndex(
        (item) => item.id == product.id
      );
      if (productIndex == -1) {
        var Product = Object.assign({}, product);
        Product.quantity = 1;
        this.products.push(Product);
        this.refundProducts[refundProductIndex].quantity--;
      } else {
        this.products[productIndex].quantity++;
        this.refundProducts[refundProductIndex].quantity--;
      }
      if (this.refundProducts[refundProductIndex].quantity == 0)
        this.refundProducts.splice(refundProductIndex, 1);
    },
    //decrease quantity of product and increase quantity of refund product
    decreaseQuantity(product) {
      const refundProductIndex = this.refundProducts.findIndex(
        (item) => item.id == product.id
      );
      const productIndex = this.products.findIndex(
        (item) => item.id == product.id
      );
      if (refundProductIndex == -1) {
        var refundProduct = Object.assign({}, product);
        refundProduct.quantity = 1;
        this.refundProducts.push(refundProduct);
        this.products[productIndex].quantity--;
      } else {
        this.refundProducts[refundProductIndex].quantity++;
        this.products[productIndex].quantity--;
      }
      if (this.products[productIndex].quantity == 0)
        this.products.splice(productIndex, 1);
    },
    // refund all product
    refundAllProdcut(product, type) {
      const refundProductIndex = this.refundProducts.findIndex(
        (item) => item.id == product.id
      );
      const productIndex = this.products.findIndex(
        (item) => item.id == product.id
      );
      var refundProduct = Object.assign({}, product);

      // return all quantity to refund products
      if (type == "products") {
        if (refundProductIndex == -1) {
          this.refundProducts.push(refundProduct);
        } else {
          this.refundProducts[refundProductIndex].quantity += product.quantity;
        }
        this.products.splice(productIndex, 1);
      }

      // return all quantity to products
      else {
        if (productIndex == -1) {
          this.products.push(refundProduct);
        } else {
          this.products[productIndex].quantity += product.quantity;
        }
        this.refundProducts.splice(productIndex, 1);
      }
    },

    //return purchase invoice
    submitRefund(invoiceId) {
      axios
        .post(`${invoiceId}/refundPurchases`, {
          products: this.refundProducts.map(({ id, quantity }) => ({
            id,
            quantity,
          })),
          discount: this.discountValue,
          discount_type: this.discountFixed ? "fixed" : "percentage",
        })
        .then(() => {
          this.returnPurchasesDialog = false;
          this.successDialog = true;
        })
        .catch((err) => (this.message = err.response.data.message));
    },
    close() {
      this.returnPurchasesDialog =
        this.serviceValidationDialog =
        this.successDialog =
        this.alertDialog =
          false;
      this.discountValue = "";
      this.discountFixed = true;
      this.getData();
    },
    changeRoute(queryTitle) {
      if (this.$route.query.title != queryTitle)
        this.$router.push({ query: { title: queryTitle } });
      else return;
    },
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t("invoiceNumber"),
          align: "center",
          sortable: false,
          value: "invoice_meta_data.invoice_number",
        },
        {
          text: this.$t("supplierName"),
          align: "center",
          sortable: false,
          value: "contact.name",
        },
        {
          text: this.$t("supplierInvoice"),
          align: "center",
          sortable: false,
          value: "invoice_meta_data.supplier_invoice_number",
        },
        {
          text: this.$t("date"),
          align: "center",
          sortable: false,
          value: "invoice_meta_data.invoice_created_at",
        },
        {
          text: this.$t("total"),
          align: "center",
          sortable: false,
          value: "invoice_totals.final_total",
        },
        {
          text: this.$t("actions"),
          sortable: false,
          align: "center",
          value: "actions",
        },
      ];
    },
    filterProductsHeaders() {
      if (this.is_taxed) return this.productsHeaders;
      else
        return this.productsHeaders.filter(
          (item) => item.text != this.$t("costAfterTax")
        );
    },
    getTax() {
      return this.$store.getters.getTax;
    },
    getStatus() {
      return this.title == this.$t("purchasesRefund") ? "returns" : "purchases";
    },
    getSuppliers() {
      return this.$store.getters.getSuppliers
        ? this.$store.getters.getSuppliers
        : [];
    },
    subTotal() {
      var subTotal = 0;
      if (this.refundProducts == []) return subTotal;
      else {
        for (var i = 0; i < this.refundProducts.length; i++) {
          subTotal +=
            this.refundProducts[i]["list_amount"] *
            this.refundProducts[i].quantity;
        }
        return subTotal;
      }
    },
    total() {
      var total = 0;
      if (this.subTotal == 0) return 0;
      if (this.discountFixed == true)
        total = this.subTotal - Number(this.discountValue);
      else if (this.discountFixed == false)
        total =
          this.subTotal - this.subTotal * (Number(this.discountValue) / 100);
      else total = this.subTotal;
      return total;
    },
    totalPrice() {
      var totalPrice = 0;
      if (this.refundProducts == []) return totalPrice;
      else {
        if (this.discountValue != 0) {
          return this.$RoundingNumber(this.total * 1.15, "total");
        } else {
          for (var i = 0; i < this.refundProducts.length; i++) {
            totalPrice +=
              this.refundProducts[i]["gross_amount"] *
              this.refundProducts[i].quantity;
          }
          return this.$RoundingNumber(totalPrice, "total");
        }
      }
    },
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
    havePermission() {
      if (this.userType == 0) return true;
      else if (
        this.userType == 1 &&
        this.meDetails.employee_permissions.includes("purchases-viewAll")
      )
        return true;
      else return false;
    },
    marginOne() {
      return this.$i18n.locale == "en" ? "ml-1" : "mr-1";
    },
    marginTwo() {
      return this.$i18n.locale == "en" ? "ml-2" : "mr-2";
    },
  },
  watch: {
    currentPage() {
      if (this.searchMode) {
        setTimeout(() => {
          if (this.getStatus == "sales") this.searchForPurchases();
          else this.searchForReturnedPurchases();
        }, 500);
      } else this.getData();
    },
    "$route.query.title"(newValue) {
      this.invoices = [];
      this.title = newValue;
      if (this.currentPage == 1) this.getData();
      else this.currentPage = 1;
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style scoped>
@import "../../assets/styles/style.css";

.btnGroup button {
  border-left-width: 1px !important;
  font-family: "BahjiiLight";
  margin-top: 25px;
  color: #666666;
  height: 53px !important;
  letter-spacing: 0;
}

.active {
  background: #4fca9a !important;
  color: white !important;
  border: none !important;
  font-family: "BahjiiSemiBold" !important;
}

.productTable::v-deep tr {
  line-height: 2 !important;
}

.productTable::v-deep tr:nth-child(n + 1),
.productTable::v-deep tr:nth-child(n + 2) {
  background-color: white !important;
}

.productTable::v-deep tr:nth-child(n + 3),
.productTable::v-deep tr:nth-child(n + 4) {
  background-color: rgba(211, 211, 211, 0.2) !important;
}

.total-cost {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: "BahjiiBold";
  font-size: 15px;
  padding: 10px 0;
}

.total-cost p {
  margin-bottom: 0px !important;
}

.calendar-container :deep(.v-input__append-inner) {
  margin-top: 8px !important;
}

.calendar-container :deep(.v-input__append-inner button) {
  font-size: 20px !important;
}

/*-----------------------------style for responsive list invoices--------------------------*/

@media (min-width: 1024px) {
  .tableStriped button:not(:last-child) {
    width: 20%;
  }
}

@media (min-width: 600px) and (max-width: 651px) {
  .button-responsive button {
    width: 22%;
  }
}

@media (max-width: 1023px) {
  .invoice-responsive button:not(:last-child) {
    width: 18%;
  }
}

@media (max-width: 376px) {
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
