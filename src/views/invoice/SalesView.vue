<template>
  <v-container class="mt-5">
    <div class="d-flex justify-space-between align-center">
      <h2>{{ $t("sales") }}</h2>
      <v-btn
        outlined
        color="#62C83F"
        height="35px"
        class="add-btn"
        @click="exportInvoice"
      >
        <v-icon color="#62C83F" size="29">mdi-microsoft-excel</v-icon
        ><span class="addText">{{ $t("exportInvoices") }}</span>
      </v-btn>
    </div>
    <v-btn-toggle class="d-flex justify-center btnGroup">
      <v-btn
        :class="[
          { active: getStatus == 'sales' },
          $i18n.locale == 'en' ? 'rounded-r-0' : 'rounded-l-0',
          'rounded-lg',
        ]"
        color="white"
        @click="changeRoute($t('saleInvoice'))"
        >{{ $t("saleInvoice") }}</v-btn
      >
      <v-btn
        :class="[
          { active: getStatus == 'returns' },
          $i18n.locale == 'en' ? 'rounded-l-0' : 'rounded-r-0',
          'rounded-lg',
        ]"
        color="white"
        @click="changeRoute($t('refundInvoice'))"
        >{{ $t("refundInvoice") }}</v-btn
      >
    </v-btn-toggle>
    <div class="d-flex justify-space-between align-center my-3">
      <div class="d-flex justify-space-between align-center">
        <v-icon color="#4FCA9A" size="25" class="icon"> search</v-icon>
        <input
          type="search"
          :placeholder="$t('searchByInvoiceNumber')"
          v-model="searchInvoice"
          @input="search"
        />
        <v-btn
          color="#4FCA9A"
          height="31"
          width="31"
          style="min-width: 31px !important"
          :class="[marginOne]"
          @click="filterDialog = true"
        >
          <v-icon size="25" color="white">mdi-filter</v-icon>
        </v-btn>
      </div>
      <v-btn
        dark
        color="#4FCA9A"
        class="add-btn"
        @click="goToCashier"
        v-if="getStatus == 'sales'"
      >
        <v-icon color="white" size="26" :left="$i18n.locale == 'en'"
          >add_box</v-icon
        >
        <span class="addText"> {{ $t("addSalesInvoice") }}</span>
      </v-btn>
      <v-btn
        dark
        color="#4FCA9A"
        class="add-btn"
        @click="refundInvoiceDialog = true"
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
      sort-by="[{ key: 'invoice_number', order: 'desc' }]"
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
        {{
          getStatus == "sales"
            ? item.invoice_meta_data.invoice_number
            : item.invoice_meta_data.refund_invoice_number
        }}
      </template>
      <template
        slot="item.invoice_meta_data.invoice_created_at"
        slot-scope="{ item }"
      >
        {{
          new Date(
            item.invoice_meta_data.invoice_created_at
          ).toLocaleDateString("en-US")
        }}
      </template>
      <template slot="item.invoice_totals.tax_amount" slot-scope="{ item }">
        {{ item.invoice_totals.tax_amount == 0 ? $t("untaxed") : $t("taxed") }}
      </template>
      <template slot="item.actions" slot-scope="{ item }">
        <td>
          <v-btn
            class="actions"
            color="#707070"
            dark
            @click="printInvoice(item, 'show')"
            >{{ $t("view") }}</v-btn
          >
          <v-btn
            :class="[marginTwo, ' actions']"
            color="#62C83F"
            dark
            @click="printInvoice(item, 'print')"
            >{{ $t("print") }}</v-btn
          >
          <v-btn
            :class="[marginTwo, ' actions']"
            color="#2BB3B3"
            dark
            @click="printInvoice(item, 'pdf')"
            >{{ $t("download") }}</v-btn
          >
          <v-btn
            :class="[marginTwo, ' actions']"
            color="#E50D0D"
            dark
            v-if="
              getStatus == 'sales' &&
              item.invoice_meta_data.refund_invoice_id == null
            "
            @click="openReturnDialog(item)"
            >{{ $t("refundTheInvoice") }}</v-btn
          >
          <v-btn
            :class="[marginTwo, ' actions']"
            color="#E50D0D"
            dark
            v-if="
              getStatus == 'sales' &&
              item.invoice_meta_data.refund_invoice_id != null
            "
            @click="getRefundInvoice(item)"
            >{{ $t("refund") }}</v-btn
          >
          <v-btn
            :class="[marginTwo, ' actions']"
            color="#E50D0D"
            dark
            v-if="getStatus != 'sales' && havePermission"
            @click="getInvoice(item, 'show')"
            >{{ $t("originaleInvoice") }}</v-btn
          >
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
          <v-card class="mx-auto" outlined>
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
              <div>
                <span>{{ headers[5].text }} :</span>
                <p>
                  {{
                    invoice.invoice_totals.tax_amount == 0
                      ? $t("untaxed")
                      : $t("taxed")
                  }}
                </p>
              </div>
              <div class="d-flex justify-center" style="width: 100%">
                <v-btn
                  class="actions"
                  color="#707070"
                  @click="printInvoice(invoice, 'show')"
                  >{{ $t("view") }}</v-btn
                >
                <v-btn
                  :class="[marginTwo, 'actions']"
                  color="#62C83F"
                  @click="printInvoice(invoice, 'print')"
                  >{{ $t("print") }}</v-btn
                >
                <v-btn
                  :class="[marginTwo, 'actions']"
                  color="#2BB3B3"
                  @click="printInvoice(invoice, 'pdf')"
                  >{{ $t("download") }}</v-btn
                >
                <v-btn
                  :class="[marginTwo, 'actions']"
                  color="#E50D0D"
                  v-if="
                    getStatus == 'sales' &&
                    invoice.invoice_meta_data.refund_invoice_id == null
                  "
                  @click="openReturnDialog(invoice)"
                  >{{ $t("refundTheInvoice") }}</v-btn
                >
                <v-btn
                  :class="[marginTwo, 'actions']"
                  color="#E50D0D"
                  v-if="
                    getStatus == 'sales' &&
                    invoice.invoice_meta_data.refund_invoice_id != null
                  "
                  @click="getRefundInvoice(invoice)"
                  >{{ $t("refund") }}</v-btn
                >
                <v-btn
                  :class="[marginTwo, 'actions']"
                  color="#E50D0D"
                  v-if="getStatus != 'sales'"
                  @click="getInvoice(invoice, 'show')"
                  >{{ $t("originaleInvoice") }}</v-btn
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
      v-model="returnSalesDialog"
      :max-width="$vuetify.breakpoint.width < 425 ? '100%' : '700px'"
    >
      <v-card>
        <!-- -----------------data for products ------------------>
        <v-card-title class="text-h5">{{ $t("products") }} </v-card-title>
        <v-card-text
          :style="$vuetify.breakpoint.width < 500 ? 'padding:0 !important' : ''"
        >
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
            class="mt-5 productTable"
          >
            <template slot="no-data">{{ $t("noProduct") }}</template>
            <template v-slot:item="{ item }">
              <tr @click="decreaseQuantity(item)">
                <td v-if="$vuetify.breakpoint.width > 767">{{ item.name }}</td>
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
                <td colspan="3" v-if="$vuetify.breakpoint.width < 768">
                  {{ item.name }}
                </td>
                <td
                  :colspan="filterProductsHeaders.length"
                  style="text-align: left"
                  @click="refundAllProdcut(item, 'products')"
                >
                  <v-btn color="#4FCA9A" dark>{{ $t("refundAll") }}</v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
          <v-divider></v-divider>
        </v-card-text>
        <!-- ---------------data for returned products ------------>
        <v-card-title class="text-h5 pt-0">{{ $t("refunds") }}</v-card-title>
        <v-card-text
          :style="$vuetify.breakpoint.width < 500 ? 'padding:0 !important' : ''"
        >
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
            class="mt-5 productTable"
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
                  <v-btn color="#4FCA9A" dark>{{ $t("refundAll") }}</v-btn>
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
          <div class="sales-total-price">
            <p class="mr-5">
              {{ is_taxed ? $t("subtotal") : $t("total") }}
              :
            </p>
            <p class="black--text">
              {{ $RoundingNumber(subTotal, "product") + $t("SRmini") }}
            </p>
          </div>
          <v-divider></v-divider>
          <div class="sales-total-price" v-if="showDiscount">
            <p class="mr-5">
              {{ $t("priceAfterDiscount") }}
              :
            </p>
            <p class="black--text">
              {{ $RoundingNumber(total, "product") + $t("SRmini") }}
            </p>
          </div>
          <v-divider v-if="showDiscount"></v-divider>
          <div class="sales-total-price" v-if="is_taxed">
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
          <div class="sales-total-price" v-if="is_taxed">
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
            class="rounded-lg mr-2 mb-2"
            @click="returnSalesDialog = false"
          >
            {{ $t("cancel") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!------------------------------- get Invoice Number to return it ------------------------- -->
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
          <v-icon color="black" @click="close" size="22"
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
    <!---------------------------- filter dialo ----------------------------------->
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
          <v-form class="form-container">
            <div>
              <label class="black--text mr-1">{{ $t("clientName") }}</label>
              <v-autocomplete
                :items="getClients"
                v-model="client"
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
                width="35%"
                class="actions"
                dark
                @click="search"
              >
                {{ $t("search") }}
              </v-btn>
              <v-btn
                color="#62C83F"
                outlined
                width="35%"
                :class="[marginTwo, 'actions']"
                @click="reset"
              >
                {{ $t("reset") }}
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <alert-dialog v-if="sizeInvoiceDialog" @close="close" :close="close">
      <template #title>
        {{ $t("printInvoiceInfo") }}
      </template>
      <template #default>
        <div
          class="d-flex flex-column justify-center align-center"
          style="gap: 10px; width: 100%"
        >
          <v-btn
            color="#62C83F"
            width="80%"
            dark
            class="actions d-flex justify-space-betweeen"
            style="border-radius: 20px !important"
            @click="setSize('A4')"
            ><v-icon right dark> mdi_print </v-icon>{{ $t("printA4") }}
          </v-btn>
          <v-btn
            color="#62C83F"
            width="80%"
            dark
            class="actions d-flex justify-space-betweeen"
            style="border-radius: 20px !important"
            @click="setSize('80mm')"
            ><v-icon right dark>mdi_receipt</v-icon>{{ $t("printMini") }}</v-btn
          >
        </div>
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
import { saveAs } from "file-saver";
export default {
  data() {
    return {
      title: this.$route.query.title,
      meDetails: null,
      invoiceSetting: null,
      userType: null,
      currentPage: 1,
      itemsPerPage: 10,
      pageCount: 0,
      pageSales: 0,
      pageReturnes: 0,
      discountValue: 0,
      discountFixed: true,
      searchInvoice: "",
      searchMode: false,
      invoiceId: "",
      printModal: false,
      refundInvoiceDialog: false,
      returnSalesDialog: false,
      showDiscount: false,
      successDialog: false,
      filterDialog: false,
      sizeInvoiceDialog: false,
      alertDialog: false,
      invoiceNumber: null,
      message: null,
      type: null,
      sales: [],
      returns: [],
      invoices: [],
      products: [],
      client: "",
      menuOpenFrom: false,
      dateFrom: null,
      menuOpenTo: false,
      dateTo: null,
      refundProducts: [],
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
          text: this.is_taxed ? this.$t("pBT") : this.$t("price"),
          align: "center",
          value: "list_amount",
        },
        {
          text: this.$t("pAT"),
          align: "center",
          value: "gross_amount",
        },
        {
          text: this.$t("total"),
          align: "center",
          value: "total_gross_amount",
        },
      ],
      parameter: {},
      is_taxed: false,
    };
  },
  methods: {
    getData() {
      this.meDetails = JSON.parse(localStorage.getItem("meDetails"));
      this.userType = this.meDetails.user_type;
      this.$store.dispatch("tax");
      this.sales = this.returns = [];
      if (this.title == this.$t("saleInvoice")) {
        this.getSalesInvoices();
      } else {
        this.getRefundsInvoices();
      }
      this.$store.dispatch("clients");
    },
    exportInvoice() {
      axios
        .post(
          "exportInvoice",
          {},
          {
            responseType: "arraybuffer",
          }
        )
        .then((res) => {
          const data = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          saveAs(data, "products_excel_file.xlsx");
        })
        .catch((err) => console.log(err));
    },
    getSalesInvoices() {
      axios
        .get("sales", {
          params: { page: this.currentPage },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "X-localization": this.$i18n.locale,
          },
        })
        .then((res) => {
          this.sales = res.data.data.data;
          this.pageSales = res.data.data.meta.last_page;
          this.selectTable("sales");
        })
        .catch((err) => {
          if (err.data.message == "Unauthenticated.")
            this.$store.dispatch("logout");
        });
    },
    getRefundsInvoices() {
      axios
        .get("returnedInvoices", {
          params: { page: this.currentPage },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "X-localization": this.$i18n.locale,
          },
        })
        .then((res) => {
          this.returns = res.data.data.refundOrders.data;
          this.pageReturnes = res.data.data.refundOrders.meta.last_page;
          this.selectTable("returns");
        })
        .catch((err) => {
          if (err.data.message == "Unauthenticated.")
            this.$store.dispatch("logout");
        });
    },
    selectTable(val) {
      if (val == "returns") {
        this.pageCount = this.pageReturnes;
        this.invoices = this.returns;
      } else {
        this.pageCount = this.pageSales;
        this.invoices = this.sales;
      }
    },
    goToCashier() {
      this.$router.push({
        name: "cashier",
        query: { title: this.$t("addInvoice") },
        params: { title: "sales" },
      });
    },
    search() {
      this.filterDialog = false;
      this.searchMode = true;
      this.parameter = {
        client_id: this.client.id,
        date_from: this.dateFrom,
        date_to: this.dateTo,
      };
      if (this.currentPage == 1)
        setTimeout(() => {
          if (this.getStatus == "sales") this.searchForSales();
          else this.searchForReturnedSales();
        }, 500);
      else this.currentPage = 1;
    },
    searchForSales() {
      axios
        .get("sales", {
          params: {
            invoice_number: this.searchInvoice,
            page: this.currentPage,
            ...this.parameter,
          },
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          this.pageCount = res.data.data.meta.last_page;
          this.invoices = res.data.data.data;
        })
        .catch((err) => console.log(err));
    },
    searchForReturnedSales(parameter) {
      axios
        .get("returnedInvoices", {
          params: {
            refund_number: this.searchInvoice,
            ...parameter,
          },
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          this.invoices = res.data.data.refundOrders.data;
        })
        .catch((err) => console.log(err));
    },
    changeRoute(queryTitle) {
      if (this.$route.query.title != queryTitle)
        this.$router.push({ query: { title: queryTitle } });
      else return;
    },
    returnInvoice(invoice) {
      axios
        .post(`refundInvoice/${invoice.id}`, null, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then(() => this.getData())
        .catch((err) => console.log(err));
    },
    printInvoice(invoice, type) {
      const is_user = this.meDetails.user_type;
      var downloadButton = true;
      localStorage.setItem("invoice", JSON.stringify(invoice));
      if (is_user == 1) {
        if (
          type == "print" &&
          !this.meDetails.employee_permissions.includes("invoices-print")
        ) {
          this.alertDialog = true;
          this.message = this.$t("haveNoPermissionPrint");
          return;
        } else if (
          type == "pdf" &&
          !this.meDetails.employee_permissions.includes("invoices-download")
        ) {
          this.alertDialog = true;
          this.message = this.$t("haveNoPermissionDown");
          return;
        } else if (
          type == "show" &&
          !this.meDetails.employee_permissions.includes("download-invoices")
        )
          downloadButton = false;
      }
      if (type == "print") {
        this.sizeInvoiceDialog = true;
        this.type = type;
      } else {
        // const template = JSON.parse(
        //   invoice.invoice_meta_data.invoice_settings_json
        // ).A4;
        this.$router.push({
          name: "print",
          params: {
            type: type,
            size: "A4",
            template: '1',
            button: downloadButton,
          },
        });
      }
    },
    setSize(size) {
      this.$router.push({
        name: "print",
        params: {
          type: this.type,
          size: size,
        },
      });
    },
    openReturnDialog(invoice) {
      if (
        this.userType == 1 &&
        !this.meDetails.employee_permissions.includes("invoices-refund")
      ) {
        this.message = this.$t("haveNoPermissionRefundInvoice");
        this.alertDialog = true;
        return;
      }
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
      this.returnSalesDialog = true;
    },
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
        this.refundProducts.splice(refundProductIndex, 1);
      }
    },
    submitRefund(invoiceId) {
      axios
        .post(
          `refundInvoice/${invoiceId}`,
          {
            products: this.refundProducts.map(({ id, quantity }) => ({
              id,
              quantity,
            })),
            discount_type: this.discountFixed ? "fixed" : "percentage",
            discount: this.discountValue,
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then(() => {
          this.returnSalesDialog = false;
          this.successDialog = true;
        })
        .catch((err) => (this.message = err.response.data.message));
    },
    getInvoice(invoice, type) {
      if (this.invoiceNumber == null && type == "dialog") {
        this.message = this.$t("enterInvoiceNumber");
      } else {
        axios
          .get("sales", {
            params: {
              invoice_number:
                type == "dialog" ? this.invoiceNumber : invoice.invoice_number,
            },
            headers: {
              Authorization: "Bearer" + localStorage.getItem("token"),
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
        .get("returnedInvoices", {
          params: {
            refund_number: invoice.refund_number,
          },
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          const invoice = res.data.data.refundOrders.data[0];
          this.printInvoice(invoice, "show");
        })
        .catch((err) => console.log(err));
    },
    reset() {
      this.client = this.dateFrom = this.dateTo = this.searchInvoice = "";
    },
    close() {
      this.message = this.invoiceNumber = null;
      this.refundInvoiceDialog =
        this.successDialog =
        this.alertDialog =
        this.sizeInvoiceDialog =
          false;
      this.getData();
    },
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t("invoiceNumber"),
          align: "center",
          value: "invoice_meta_data.invoice_number",
          sortable: true,
        },
        {
          text: this.$t("taxNumber"),
          align: "center",
          sortable: false,
          value: "contact.tax_number",
        },
        {
          text: this.$t("clientName"),
          align: "center",
          sortable: false,
          value: "contact.name",
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
          text: this.$t("invoiceType"),
          align: "center",
          sortable: false,
          value: "invoice_totals.tax_amount",
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
      if (this.is_taxed) {
        if (this.$vuetify.breakpoint.width < 768)
          return this.productsHeaders.filter(
            (item) => item.text != this.$t("productName")
          );
        else return this.productsHeaders;
      } else {
        if (this.$vuetify.breakpoint.width < 768)
          return this.productsHeaders.filter(
            (item) =>
              item.text != this.$t("productName") || item.text != this.$t("pAT")
          );
        else
          return this.productsHeaders.filter(
            (item) => item.text != this.$t("pAT")
          );
      }
    },
    getTax() {
      return this.$store.getters.getTax;
    },
    getStatus() {
      return this.title == this.$t("refundInvoice") ? "returns" : "sales";
    },
    getClients() {
      return this.$store.getters.getClients
        ? this.$store.getters.getClients
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
    // calculate price after discount
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
        this.meDetails.employee_permissions.includes("invoices-viewAll")
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
    marginThree() {
      return this.$i18n.locale == "en" ? "ml-3" : "mr-3";
    },
  },
  watch: {
    currentPage() {
      if (this.searchMode) {
        setTimeout(() => {
          if (this.getStatus == "sales") this.searchForSales();
          else this.searchForReturnedSales();
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
  font-size: 16px !important;
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
.productTable::v-deep tr:nth-child(n + 4),
.productTable::v-deep th {
  background-color: rgba(211, 211, 211, 0.2) !important;
}

.productTable td,
.productTable th {
  position: relative !important;
  text-align: center;
}

.productTable td:not(:last-child) {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 120px !important;
}

.productTable td::after,
.productTable th::after {
  position: absolute;
  content: "";
  border-left: 1px solid #d3d3d3;
  height: 20px;
  top: 28%;
  left: 0px;
}

.productTable td:last-child::after,
.productTable th:last-child::after {
  display: none;
}

.sales-total-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: "BahjiiBold";
  font-size: 15px;
  padding: 10px 0;
}

.sales-total-price p {
  margin-bottom: 0px !important;
}

.calendar-container :deep(.v-input__append-inner) {
  margin-top: 8px !important;
}

.calendar-container :deep(.v-input__append-inner button) {
  font-size: 20px !important;
}

/*-----------------------------style for responsive list invoices--------------------------*/
@media (max-width: 500px) {
  .productTable td:not(:last-child) {
    max-width: 70px !important;
  }

  .productTable td {
    font-size: 0.7rem;
  }
}

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
