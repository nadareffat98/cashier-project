<template>
  <v-container
    id="printArea"
    class="print-area"
    :style="`${$i18n.locale == 'en' ? 'direction:ltr;' : 'direction:rtl;'}`"
  >
    <div class="invoice-name">
      <h3>{{ invoiceDetails ? invoiceName : $t("invoiceType") }}</h3>
      <h3>{{ purchaseInvoice ? $t("purchases") : $t("sale") }}</h3>
    </div>
    <div class="top-div">
      <div class="right-side">
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
          <p v-else>store logo</p>
        </div>
        <h3>
          {{ invoiceDetails ? invoiceDetails.market.name : $t("storeName") }}
        </h3>
      </div>
      <div
        class="user-details"
        :style="invoiceDetails == null ? 'gap:0px !important' : ''"
      >
        <p v-if="invoiceType != 'untaxed_invoice'">
          <span>{{ $t("taxNumberStore") + " : " }}</span
          >{{ invoiceDetails ? invoiceDetails.market.tax_number : "" }}
        </p>
        <p>
          <span>{{ $t("storeAddress") + " : " }}</span>
          {{ invoiceDetails ? invoiceDetails.market.address : "" }}
        </p>
        <p>
          <span>{{ $t("phone") + " : " }}</span
          >{{ userDetail ? userDetail["phone"] : "" }}
        </p>
      </div>
    </div>
    <div class="top-div">
      <div
        class="client-details"
        :style="invoiceDetails == null ? 'gap:0px !important' : ''"
      >
        <p>
          <span>{{ clientOrSupplier + " : " }}</span>
          {{ invoiceDetails ? invoiceDetails.contact.name : "" }}
        </p>
        <p v-if="contactPhoneCondition">
          <span>{{ $t("phone") + " : " }}</span>
          {{ invoiceDetails ? invoiceDetails.contact.phone : "" }}
        </p>
        <p v-if="contactTaxNumberCondition">
          <span>{{ $t("taxNumber") + " : " }}</span>
          {{ invoiceDetails ? invoiceDetails.contact.tax_number : "" }}
        </p>
        <p v-if="contactAddressCondition" style="word-break: break-all">
          <span>{{ $t("address") + " : " }}</span>
          {{ invoiceDetails ? invoiceDetails.contact.address : "" }}
        </p>
        <p v-if="elementInArray('creator_name')" style="word-break: break-all">
          <span>{{ $t("invoice") + " " + $t("by") + " : " }}</span>
          {{
            invoiceDetails ? invoiceDetails.invoice_meta_data.creator_name : ""
          }}
        </p>
      </div>
      <div
        class="invoice-details"
        :style="invoiceDetails == null ? 'gap:0px !important' : ''"
      >
        <p style="white-space: nowrap">
          <span>{{ $t("date") + " : " }}</span>
          {{ invoiceDetails ? getTimeDate : "" }}
        </p>
        <p>
          <span>{{ $t("invoiceNumber") + " : " }}</span>
          {{
            invoiceDetails
              ? invoiceDetails.invoice_meta_data.invoice_number
              : ""
          }}
        </p>
        <p
          style="white-space: nowrap"
          v-if="elementInArray('import_date') && importDateCondition"
        >
          <span>{{ $t("importDate") + " : " }}</span>
          {{ invoiceDetails ? getImportDate : "" }}
        </p>
        <p v-if="purchaseInvoice">
          <span>{{ $t("supplierInvoiceNum") + " : " }}</span>
          {{
            invoiceDetails
              ? invoiceDetails.invoice_meta_data.supplier_invoice_number
              : ""
          }}
        </p>
        <p v-if="invoiceDetails == null || invoiceDetails['refund_id'] != null">
          <span>{{ $t("invoiceNumberRefund") + " : " }}</span>
          {{
            invoiceDetails
              ? invoiceDetails.invoice_meta_data.refund_invoice_number
              : ""
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
    <div class="footer-div">
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
            <p>{{ totalName }}</p>
            <p v-if="invoiceDetails">
              {{ invoiceDetails.invoice_totals.list_total + $t("SRmini") }}
            </p>
          </div>
          <div v-if="discountCondition">
            <p>
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
            </p>
            <p v-if="invoiceDetails">
              {{ invoiceDetails.invoice_totals.discount_amount + $t("SRmini") }}
            </p>
          </div>
          <div v-if="priceAfterDiscountCondition">
            <p>
              {{ $t("priceAfterDiscount") }}
            </p>
            <p v-if="invoiceDetails">
              {{ invoiceDetails.invoice_totals.sub_total + $t("SRmini") }}
            </p>
          </div>
          <div>
            <p v-if="invoiceType != 'untaxed_invoice'">
              {{ $t("AddedTax") }} %15
            </p>
            <p v-if="invoiceDetails && invoiceType != 'untaxed_invoice'">
              {{ invoiceDetails.invoice_totals.tax_amount + $t("SRmini") }}
            </p>
          </div>
          <div class="total-tax-container">
            <p v-if="invoiceType != 'untaxed_invoice'">
              {{ $t("totalWithTax") }}
            </p>
            <p v-if="invoiceDetails && invoiceType != 'untaxed_invoice'">
              {{
                invoiceDetails.invoice_totals.final_total + " " + $t("SRmini")
              }}
            </p>
          </div>
          <div
            class="payment-container"
            v-if="elementInArray('payment_method')"
          >
            <p>{{ $t("paymentMethod") }}</p>
            <p>
              {{
                invoiceDetails
                  ? invoiceDetails.invoice_meta_data.payment_method
                  : ""
              }}
            </p>
          </div>
        </div>
      </div>
      <div class="website-container">
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
  methods: {
    getData() {
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
          : this.$t("price")
        : this.purchaseInvoice
        ? this.$t("cBT")
        : this.$t("priceBeforeTax");
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
    this.getData();
  },
};
</script>
<style scoped>
:root {
  --font-color: #363f4e;
  --font-size: 12px;
  --font-size-2: 14px;
  --font-size-4: 16px;
}
body {
  font-family: "BahjiiLight";
}

p {
  font-size: var(--font-size);
}

.print-area {
  color: var(--font-color) !important;
  display: flex;
  flex-direction: column;
}

.invoice-name h3 {
  font-family: "BahjiiBold" !important;
  font-size: var(--font-size-4);
  text-align: center;
}

.top-div {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 3px solid #f0f2ed;
  border-radius: 12px;
  padding: 10px 30px;
  margin-top: 10px;
  gap: 10px;
}

.top-div .right-side {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
}

.top-div .img-container {
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.top-div .logo-container p {
  margin-bottom: 0px !important;
  border: 1px solid var(--font-color);
  border-radius: 50%;
  padding: 15px;
  text-align: center;
}

.top-div h3 {
  font-family: "BahjiiBold" !important;
  font-size: var(--font-size-2) !important;
}

.user-details,
.client-details,
.invoice-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 5px;
}

.client-details {
  flex-basis: 50%;
}

.user-details span,
.client-details span,
.invoice-details span {
  font-family: "BahjiiBold" !important;
  font-size: var(--font-size) !important;
}

.user-details p {
  margin-bottom: 0;
}

.client-details p {
  margin-bottom: 5px;
}
.table-contaier tr td:first-child,
.table-contaier table th {
  font-family: "BahjiiBold" !important;
}
.table-contaier table td,
.table-contaier table td span {
  font-family: "BahjiiLight";
  font-size: var(--font-size) !important;
}
.footer-div .footer-top-side {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-div .footer-right-side {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  flex-basis: 60%;
}

.total-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 5px;
  background-color: #f0f2ed;
  border-radius: 12px;
  flex-basis: 40%;
  padding: 20px 0;
}

.total-container div {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0 20px;
  width: 100%;
}

.total-container p {
  font-family: "BahjiiBold";
  font-size: var(--font-size-2);
}

.total-tax-container {
  background: white;
  border-radius: 12px;
  padding: 8px !important;
  margin: 0 auto;
  width: 90% !important;
}

.payment-container {
  border-top: 1px solid white;
  margin-top: 5px;
  padding: 20px 20px 0 20px;
}

.table-contaier table {
  width: 100%;
  text-align: center;
  border: 1px solid #f0f2ed;
  border-collapse: collapse;
  margin-top: 20px;
  margin-bottom: 10px;
}

.table-contaier table td,
.table-contaier table th {
  border: 1px solid #f0f2ed;
  height: 82px;
  color: var(--font-color) !important;
  font-size: var(--font-size) !important;
  padding: 0 10px;
}

.table-contaier thead tr,
.table-contaier tbody tr:nth-child(even),
.table-contaier tr td:last-child {
  background-color: #f0f2ed !important;
}

.table-contaier .product-name-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  margin-right: 10px;
}

.table-contaier .product-name,
.table-contaier .product-description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.footer-div .footer-top-side {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-div .footer-right-side {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  flex-basis: 60%;
}

.total-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 5px;
  background-color: #f0f2ed;
  border-radius: 12px;
  flex-basis: 40%;
  padding: 20px 0;
}

.total-container div {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0 20px;
  width: 100%;
}

.total-container p {
  font-family: "BahjiiBold";
  font-size: var(--font-size-2);
}

.total-tax-container {
  background: white;
  border-radius: 12px;
  padding: 8px !important;
  margin: 0 auto;
  width: 90% !important;
}

.payment-container {
  border-top: 1px solid white;
  margin-top: 5px;
  padding: 20px 20px 0 20px;
}

.website-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px 20px 0 20px;
  margin-top: 5px;
  border-top: 1px solid #f0f2ed;
  border-color: black !important;
}
</style>
