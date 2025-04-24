<template style="box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);">
  <v-container
    id="printArea"
    class="print-area"
    :style="`${$i18n.locale == 'en' ? 'direction:ltr;' : 'direction:rtl;'}`"
  >
    <div class="top-div" style="border: none !important; padding: 15px 0">
      <div
        class="user-details"
        :style="invoiceDetails == null ? 'gap:0px !important' : ''"
      >
        <h3>
          {{ invoiceDetails ? invoiceDetails.market.name : $t("storeName") }}
        </h3>
        <p v-if="invoiceType != 'untaxed_invoice'">
          <span>{{ $t("taxNumberStore") + " : " }}</span
          >{{
            invoiceDetails
              ? invoiceDetails.market.tax_number
              : "12164164613164646"
          }}
        </p>
        <p>
          <span>{{ $t("storeAddress") + " : " }}</span>
          {{ invoiceDetails ? invoiceDetails.market.address : "" }}
        </p>
      </div>
      <div>
        <div
          :class="
            invoiceDetails && invoiceDetails.market.logo != null
              ? 'img-container'
              : 'logo-container'
          "
          v-if="elementInArray('store_logo')"
        >
          <img
            v-if="invoiceDetails && invoiceDetails.market.logo != null"
            :src="invoiceDetails.market.logo"
            style="width: 80px; height: 80px"
          />
          <img
            v-else
            :src="userDetails['logo']"
            style="width: 80px; height: 80px"
          />
        </div>
      </div>
    </div>
    <div class="client-details">
      <p>
        <span>{{ clientOrSupplier + " : " }}</span>
        {{ invoiceDetails ? invoiceDetails.contact.name : "عميل افتراضي" }}
      </p>
      <p v-if="contactPhoneCondition">
        <span>{{ $t("phone") + " : " }}</span>
        {{ invoiceDetails ? invoiceDetails.contact.phone : "010245368741" }}
      </p>
      <p v-if="contactTaxNumberCondition">
        <span>{{ $t("taxNumber") + " : " }}</span>
        {{
          invoiceDetails
            ? invoiceDetails.contact.tax_number
            : "12345678925142365"
        }}
      </p>
      <p v-if="contactAddressCondition" style="word-break: break-all">
        <span>{{ $t("address") + " : " }}</span>
        {{ invoiceDetails ? invoiceDetails.contact.address : "" }}
      </p>
    </div>
    <div class="invoice-information">
      <div class="invoice-name">
        <h3>
          {{ invoiceDetails ? invoiceName : $t("invoiceType") }}
        </h3>
      </div>
      <div class="invoice-inf-container">
        <p>{{ $t("invoiceNumber") }}</p>
        <p>
          {{
            invoiceDetails
              ? invoiceDetails.invoice_meta_data.invoice_number
              : "1"
          }}
        </p>
      </div>
      <div class="invoice-inf-container" v-if="elementInArray('creator_name')">
        <p>{{ $t("invoice") + " " + $t("by") }}</p>
        <p>
          {{
            invoiceDetails
              ? invoiceDetails.invoice_meta_data.creator_name
              : "مدير النظام"
          }}
        </p>
      </div>
      <div class="invoice-inf-container">
        <p>{{ $t("date") }}</p>
        <p>
          {{ invoiceDetails ? getTimeDate : "16:20 2024-01-24" }}
        </p>
      </div>
      <div
        class="invoice-inf-container"
        v-if="elementInArray('import_date') && importDateCondition"
      >
        <p>{{ $t("importDate") }}</p>
        <p>
          {{ invoiceDetails ? getImportDate : "16:20 2024-01-24" }}
        </p>
      </div>
      <div class="invoice-inf-container" v-if="purchaseInvoice">
        <p>{{ $t("supplierInvoiceNum") }}</p>
        <p>
          {{
            invoiceDetails
              ? invoiceDetails.invoice_meta_data.supplier_invoice_number
              : "2"
          }}
        </p>
      </div>
      <div
        class="invoice-inf-container"
        v-if="invoiceDetails == null || invoiceDetails['refund_id'] != null"
      >
        <p>{{ $t("invoiceNumberRefund") }}</p>
        <p>
          {{
            invoiceDetails
              ? invoiceDetails.invoice_meta_data.refund_invoice_number
              : "2"
          }}
        </p>
      </div>
    </div>
    <div class="table-contaier">
      <table>
        <thead>
          <tr>
            <th style="width: 30px">{{ $t("num") }}</th>
            <th style="width: 40%">{{ $t("product") }}</th>
            <th>{{ $t("qty") }}</th>
            <th>{{ priceName }}</th>
            <th v-if="invoiceType != 'untaxed_invoice'">
              {{ $t("taxShort") }}
            </th>
            <th v-if="invoiceType != 'untaxed_invoice'">
              {{ purchaseInvoice ? $t("costAfterTax") : $t("priceAfterTax") }}
            </th>
            <th>{{ $t("total") }}</th>
          </tr>
        </thead>
        <tbody v-if="invoiceDetails">
          <template v-for="(product, index) in invoiceDetails['products']">
            <tr :key="product.id" class="product-row">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="product-name-container">
                  <span class="product-name"> {{ product.name }}</span>
                  <span v-if="elementInArray('product_barcode')">{{
                    product.serial
                  }}</span>
                  <span
                    class="product-description"
                    v-if="
                      elementInArray('product_notes') && product.description
                    "
                    >{{ product.description }}</span
                  >
                </div>
              </td>
              <td>{{ product.quantity }}</td>
              <td>{{ product.list_amount }}</td>
              <td v-if="invoiceType != 'untaxed_invoice'">
                {{ product.total_tax_amount }}
              </td>
              <td v-if="invoiceType != 'untaxed_invoice'">
                {{ product.gross_amount }}
              </td>
              <td>
                {{
                  invoiceType == "untaxed_invoice"
                    ? product.total_list_amount
                    : product.total_gross_amount
                }}
              </td>
            </tr>
          </template>
        </tbody>
        <tbody v-else>
          <template v-for="(product, index) in 2">
            <tr class="product-row" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="product-name-container">
                  <span class="product-name"> {{ $t("productName") }}</span>
                  <span v-if="elementInArray('product_barcode')">{{
                    $t("barcode")
                  }}</span>
                  <span
                    class="product-description"
                    v-if="elementInArray('product_notes')"
                    >{{ $t("description") }}</span
                  >
                </div>
              </td>
              <td>{{ $t("qty") }}</td>
              <td>{{ priceName }}</td>
              <td v-if="invoiceType != 'untaxed_invoice'">
                {{ $t("taxShort") }}
              </td>
              <td v-if="invoiceType != 'untaxed_invoice'">
                {{ purchaseInvoice ? $t("costAfterTax") : $t("priceAfterTax") }}
              </td>
              <td>{{ $t("total") }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div class="footer-div" style="margin-top: 10px">
      <div class="footer-top-side">
        <div class="footer-right-side">
          <div
            v-if="elementInArray('bottom_text') && bottomTextCondition"
            style="flex-basis: 50%"
          >
            <p style="word-break: break-all">
              {{
                invoiceDetails
                  ? invoiceDetails.market.bottom_text
                  : $t("invoiceFooter")
              }}
            </p>
          </div>
          <div
            style="text-align: center; flex-basis: 50%"
            v-if="!purchaseInvoice"
          >
            <img
              :src="
                invoiceDetails
                  ? invoiceDetails.invoice_meta_data.qr_img
                  : require('../../assets/imgs/qr-code.png')
              "
              width="150"
              height="150"
            />
          </div>
        </div>
        <div class="total-container">
          <div>
            <span>{{ totalName }}</span>
            <p v-if="invoiceDetails">
              {{
                invoiceDetails.invoice_totals.list_total +
                (invoiceType == "untaxed_invoice" ? $t("SRmini") : "")
              }}
            </p>
          </div>
          <div v-if="discountCondition">
            <span>
              {{ $t("discountValue") }}
              {{
                invoiceDetails
                  ? invoiceDetails.invoice_totals.discount_percentage != 0
                    ? "(" +
                      $RoundingNumber(
                        invoiceDetails.invoice_totals.discount_percentage,
                        "total"
                      ) +
                      "% )"
                    : ""
                  : ""
              }}
            </span>
            <p v-if="invoiceDetails">
              {{ invoiceDetails.invoice_totals.discount_amount }}
            </p>
          </div>
          <div v-if="priceAfterDiscountCondition">
            <span>
              {{ $t("priceAfterDiscount") }}
            </span>
            <p v-if="invoiceDetails">
              {{ invoiceDetails.invoice_totals.sub_total }}
            </p>
          </div>
          <div>
            <span v-if="invoiceType != 'untaxed_invoice'">
              {{ $t("AddedTax") }} %15
            </span>
            <p v-if="invoiceDetails && invoiceType != 'untaxed_invoice'">
              {{ invoiceDetails.invoice_totals.tax_amount }}
            </p>
          </div>
          <div v-if="elementInArray('payment_method')" class="payment-method">
            <span>{{ $t("paymentMethod") }}</span>
            <p>
              {{
                invoiceDetails
                  ? invoiceDetails.invoice_meta_data.payment_method
                  : ""
              }}
            </p>
          </div>
          <div class="total-tax-container">
            <span v-if="invoiceType != 'untaxed_invoice'">
              {{ $t("totalWithTax") }}
            </span>
            <p v-if="invoiceDetails && invoiceType != 'untaxed_invoice'">
              {{
                invoiceDetails.invoice_totals.final_total + " " + $t("SRmini")
              }}
            </p>
          </div>
        </div>
      </div>
      <div class="website-container">
        <p>
          <span>{{ $t("phone") + " : " }}</span
          >{{ userDetail ? userDetail["phone"] : "" }}
        </p>
        <p>
          {{
            $t("website") +
            ":" +
            (invoiceDetails && invoiceDetails.market.url
              ? invoiceDetails.market.url
              : "www.efatorh.com")
          }}
        </p>
        <p v-if="copyRight == '0'">{{ $t("by") }} efatorh.com</p>
      </div>
    </div>
  </v-container>
</template>
<script>
export default {
  props: {
    invoiceDetails: {
      type: Object,
      default: null,
    },
    userDetail: {
      type: Object,
      default: null,
    },
    color: {
      type: String,
    },
    font: {
      type: Number,
    },
    content: {
      type: Array,
    },
    copyRight: {
      type: Number,
      default: null,
    },
    invoiceType: {
      type: String,
      default: null,
    },
    invoiceName: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      userDetails: null,
    };
  },
  methods: {
    getData() {
      this.userDetails = JSON.parse(localStorage.getItem("userDetails"));
      document.documentElement.style.setProperty("--font-color", this.color);
      document.documentElement.style.setProperty(
        "--font-size",
        this.font + "px"
      );
      document.documentElement.style.setProperty(
        "--font-size-2",
        this.font + 2 + "px"
      );
      document.documentElement.style.setProperty(
        "--font-size-4",
        this.font + 4 + "px"
      );
      document.documentElement.style.setProperty("--print-size", "A4");
    },
    elementInArray(value) {
      return this.content.includes(value);
    },
  },
  computed: {
    // show client name or supplier name
    clientOrSupplier() {
      if (!this.purchaseInvoice) return this.$t("clientName");
      else return this.$t("supplierName");
    },
    contactPhoneCondition() {
      if (this.invoiceDetails == null) return true;
      else if (
        this.invoiceDetails.contact.id != 1 &&
        this.invoiceDetails.contact.phone
      )
        return true;
      else return false;
    },
    contactTaxNumberCondition() {
      if (this.invoiceDetails == null) return true;
      else if (this.clientCondition && this.invoiceDetails.contact.tax_number)
        return true;
      else return false;
    },
    contactAddressCondition() {
      if (this.invoiceDetails == null) return true;
      else if (this.clientCondition && this.invoiceDetails.contact.address)
        return true;
      else return false;
    },
    importDateCondition() {
      if (this.invoiceDetails == null) return true;
      else if (
        this.invoiceDetails.invoice_meta_data.date_of_import &&
        this.invoiceType == "tax_invoice"
      )
        return true;
      else return false;
    },
    // show client or not in sales invoice
    clientCondition() {
      if (
        this.invoiceDetails.contact.id != 1 &&
        this.invoiceType != "simple_tax_invoice"
      )
        return true;
      else return false;
    },
    getTimeDate() {
      const date = new Date(
        this.invoiceDetails.invoice_meta_data.invoice_created_at
      );

      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const formattedTime = date.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      return `${formattedTime} ${formattedDate}`;
    },
    getImportDate() {
      return new Date(
        this.invoiceDetails.invoice_meta_data.date_of_import
      ).toLocaleDateString("en-US");
    },
    priceName() {
      return this.invoiceType == "untaxed_invoice"
        ? this.purchaseInvoice
          ? this.$t("cost")
          : this.$t("pBT")
        : this.purchaseInvoice
        ? this.$t("cBT")
        : this.$t("pAT");
    },
    bottomTextCondition() {
      if (this.invoiceDetails == null) return true;
      else if (this.invoiceDetails.market.bottom_text != null) return true;
      else return false;
    },
    totalName() {
      return this.invoiceType == "untaxed_invoice"
        ? this.$t("total")
        : this.$t("subtotal");
    },
    discountCondition() {
      if (this.invoiceDetails == null) return true;
      else if (this.invoiceDetails.invoice_totals.discount_amount != 0)
        return true;
      else return false;
    },
    priceAfterDiscountCondition() {
      if (this.invoiceDetails == null) return true;
      else if (
        this.invoiceDetails.invoice_totals.discount_amount != 0 ||
        this.invoiceDetails.invoice_totals.discount_percentage != 0
      )
        return true;
      else return false;
    },
    purchaseInvoice() {
      if (this.invoiceDetails == null) return false;
      else if (
        this.invoiceDetails.invoice_meta_data.invoice_type ==
          "App\\Models\\Order" ||
        this.invoiceDetails.invoice_meta_data.invoice_type ==
          "App\\Models\\RefundOrder"
      )
        return false;
      else return true;
    },
  },
  watch: {
    color(value) {
      document.documentElement.style.setProperty("--font-color", value);
    },
    font(value) {
      document.documentElement.style.setProperty("--font-size", value + "px");
      document.documentElement.style.setProperty(
        "--font-size-2",
        value + 2 + "px"
      );
      document.documentElement.style.setProperty(
        "--font-size-4",
        value + 4 + "px"
      );
    },
  },
  created() {
    console.log(this.color);
    this.getData();
  },
};
</script>
<style scoped>
@import "../../assets/styles/invoice-template.css";
.client-details {
  gap: 2px;
}
.client-details p {
  display: flex;
  width: 100%;
  gap: 5px;
}
.client-details span {
  background-color: #f0f2ed !important;
  flex-basis: 20%;
  padding: 2px 7px;
}
.invoice-information {
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  gap: 3px;
  margin-top: 10px;
}
.invoice-information .invoice-name,
.invoice-information p {
  background-color: #f0f2ed !important;
}
.invoice-information .invoice-name {
  padding: 19px;
  flex: 1;
}
.invoice-inf-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 3px;
  flex-basis: 15%;
  padding: 3px;
  flex: 1;
}
.invoice-inf-container p {
  width: 100%;
  text-align: center;
  font-family: "BahjiiBold";
  padding: 5px;
}
.table-contaier table {
  width: 100%;
  text-align: center;
  border-collapse: collapse;
  margin-top: 20px;
  margin-bottom: 10px;
}
.table-contaier table td,
.table-contaier table th {
  color: var(--font-color) !important;
  font-size: var(--font-size) !important;
  padding: 5px 10px;
}
.table-contaier table td {
  border-bottom: 1px solid black;
}
.table-contaier table thead th {
  background-color: #f0f2ed;
  padding: 10px;
  margin-right: 2px;
  border-bottom: 2px solid black;
  border-left: 2px solid white;
}
.total-container {
  background-color: white !important;
}
.total-container div {
  border-bottom: 1px solid black;
  padding: 0px;
}
.total-container .payment-method {
  border-bottom: none !important;
}
.total-container .total-tax-container {
  border-bottom: none !important;
  background-color: #f0f2ed;
  width: 100% !important;
}
.website-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px 0 20px;
  margin-top: 8px;
  border-top: 2px solid black;
}
</style>
