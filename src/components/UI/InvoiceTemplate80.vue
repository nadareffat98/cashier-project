<template>
    <v-container id="printArea" class="print-area" :style="`${$i18n.locale == 'en' ? 'direction:ltr;' : 'direction:rtl;'}`">
        <div v-if="elementInArray('upper_text') && upperTextCondition" class="qr-container">
            <p style="word-break: break-all;">
                {{ invoiceDetails ? invoiceDetails.market.upper_text : $t('invoiceHeader') }}
            </p>
        </div>
        <div class="user-details">
            <div :class="invoiceDetails && invoiceDetails.market.logo != null ? 'img-container' : 'logo-container'"
                v-if="elementInArray('store_logo')">
                <img v-if="invoiceDetails && invoiceDetails.market.logo != null" :src="invoiceDetails.market.logo"
                    style="width: 80px; height: 80px" />
                <p v-else>
                    store logo
                </p>
            </div>
            <h3>{{ invoiceDetails ? invoiceDetails.market.name : $t('storeName') }}</h3>
            <p v-if="invoiceType != 'untaxed_invoice'">
                <span>{{ $t("taxNumberStore") + " : " }}</span>{{ (invoiceDetails ? invoiceDetails.market.tax_number : '')
                }}
            </p>
            <p>
                {{ $t("storeAddress") + " : " + (invoiceDetails ? invoiceDetails.market.address : '') }}
            </p>
            <p>
                {{ $t('phone') + " : " + (userDetail ? userDetail['phone'] : '') }}
            </p>
        </div>
        <div class="invoice-details">
            <h3 class="invoice-name">{{ invoiceDetails ? invoiceName : $t('invoiceType') }}</h3>
            <p>
                <span>{{ $t("invoiceNumber") + " : " }}</span>
                {{ invoiceDetails ? invoiceDetails.invoice_meta_data.invoice_number : '' }}
            </p>
            <p v-if="purchaseInvoice">
                <span>{{ $t("supplierInvoiceNum") + " : " }}</span>
                {{
                    invoiceDetails ? invoiceDetails.invoice_meta_data.supplier_invoice_number : ''
                }}
            </p>
            <p v-if="invoiceDetails == null || invoiceDetails['refund_id'] != null">
                <span>{{ $t("invoiceNumberRefund") + " : " }}</span>
                {{
                    invoiceDetails ? invoiceDetails.invoice_meta_data.refund_invoice_number : ''
                }}
            </p>
            <p v-if="elementInArray('creator_name')" style="word-break: break-all;">
                <span>{{ $t("invoice") +
                    " " +
                    $t("by") +
                    " : " }}</span>
                {{

                    invoiceDetails ? invoiceDetails.invoice_meta_data.creator_name : ''
                }}
            </p>
        </div>
        <div class="client-details">
            <p>
                <span>{{ clientOrSupplier + " : " }}</span>
                {{ invoiceDetails ? invoiceDetails.contact.name : '' }}
            </p>
            <p v-if="contactPhoneCondition">
                <span>{{ $t("phone") + " : " }}</span>
                {{ invoiceDetails ? invoiceDetails.contact.phone : '' }}
            </p>
            <p v-if="contactTaxNumberCondition">
                <span>{{ $t("taxNumber") + " : " }}</span>
                {{
                    invoiceDetails ? invoiceDetails.contact.tax_number : ''
                }}
            </p>
            <p v-if="contactAddressCondition" style="word-break: break-all;">
                <span>{{ $t("address") + " : " }}</span>
                {{ invoiceDetails ? invoiceDetails.contact.address : '' }}
            </p>
        </div>
        <div class="date-details">
            <p style="white-space: nowrap;">
                <span>{{ $t("date") + " : " }}</span>
                {{ invoiceDetails ? getTimeDate : '' }}
            </p>
            <p style="white-space: nowrap;" v-if="elementInArray('import_date') && importDateCondition">
                <span>{{ $t("importDate") +
                    " : " }}</span>
                {{
                    invoiceDetails ? getImportDate : ''
                }}
            </p>
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>{{ $t("num") }}</th>
                        <th>{{ $t("product") }}</th>
                        <th>{{ $t("qty") }}</th>
                        <th>{{ priceName }}</th>
                        <th>{{ $t("total") }}</th>
                    </tr>
                </thead>
                <tbody v-if="invoiceDetails">
                    <template v-for="(product, index) in invoiceDetails['products']">
                        <tr :key="index">
                            <td>{{ index + 1 }}</td>
                            <td>
                                {{ product.name }}
                            </td>
                            <td>{{ product.quantity }}</td>
                            <td>
                                {{ product.gross_amount }}
                            </td>
                            <td>{{ product.total_gross_amount }}</td>
                        </tr>
                        <tr :key="index" class="second-row">
                            <td colspan="4">
                                <p v-if="elementInArray('product_barcode')">{{ product.serial }}</p>
                                <p v-if="elementInArray('product_notes') && product.description">{{ product.description
                                }}</p>
                            </td>
                        </tr>
                    </template>
                </tbody>
                <tbody v-else>
                    <template v-for="(product, index) in 2">
                        <tr :key="index">
                            <td>{{ index + 1 }}</td>
                            <td>
                                {{ $t('productName') }}
                            </td>
                            <td>{{ $t("qty") }}</td>
                            <td>{{ priceName }}</td>
                            <td>{{ $t("total") }}</td>
                        </tr>
                        <tr :key="index" class="second-row">
                            <td colspan="4">
                                <p v-if="elementInArray('product_barcode')">{{ $t('barcode') }}</p>
                                <p v-if="elementInArray('product_notes')">{{ $t('notes') }}</p>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
        <div class="total-container">
            <div>
                <p>{{ totalName }}</p>
                <p v-if="invoiceDetails">{{ invoiceDetails.invoice_totals.list_total + (invoiceType ==
                    'untaxed_invoice' ?
                    $t('SRmini') : '') }}
                </p>
            </div>
            <div v-if="discountCondition">
                <p>{{ $t("discountValue") }} {{ invoiceDetails ? ((invoiceDetails.invoice_totals.discount_percentage
                    != 0) ? "(" +
                    $RoundingNumber(invoiceDetails.invoice_totals.discount_percentage, 'total') + "% )" : "") : ''
                }}
                </p>
                <p v-if="invoiceDetails">
                    {{
                        invoiceDetails.invoice_totals.discount_amount
                    }}
                </p>
            </div>
            <div v-if="priceAfterDiscountCondition">
                <p>
                    {{ $t("priceAfterDiscount") }}
                </p>
                <p v-if="invoiceDetails">
                    {{ invoiceDetails.invoice_totals.sub_total }}
                </p>
            </div>
            <div>
                <p v-if="invoiceType != 'untaxed_invoice'">
                    {{ $t("AddedTax") }} %15
                </p>
                <p v-if="invoiceDetails && invoiceType != 'untaxed_invoice'">
                    {{ invoiceDetails.invoice_totals.tax_amount }}
                </p>
            </div>
            <div>
                <p v-if="invoiceType != 'untaxed_invoice'">
                    {{ $t("totalWithTax") }}
                </p>
                <p v-if="invoiceDetails && invoiceType != 'untaxed_invoice'">
                    {{ invoiceDetails.invoice_totals.final_total + " " + $t("SRmini") }}
                </p>
            </div>
            <div v-if="elementInArray('payment_method')">
                <p>{{ $t("paymentMethod") }}</p>
                <p>{{ invoiceDetails ? invoiceDetails.invoice_meta_data.payment_method : '' }}</p>
            </div>
        </div>
        <div class="qr-container">
            <div v-if="!purchaseInvoice">
                <img :src="invoiceDetails ? invoiceDetails.invoice_meta_data.qr_img : require('../../assets/imgs/qr-code.png')"
                    width="90" height="90" />
            </div>
            <div>
                <p>{{ $t("website") + ":" + ((invoiceDetails && invoiceDetails.market.url) ? invoiceDetails.market.url :
                    'www.efatorh.com')
                }}</p>
            </div>
            <div>
                <p v-if="copyRight == '0'">{{ $t("by") }} efatorh.com</p>
            </div>
            <div v-if="elementInArray('bottom_text') && bottomTextCondition">
                <p style="word-break: break-all;">
                    {{ invoiceDetails ? invoiceDetails.market.bottom_text : $t('invoiceFooter') }}
                </p>
            </div>
        </div>
    </v-container>
</template>
<script>
export default {
    props: {
        invoiceDetails: {
            type: Object,
            default: null
        },
        userDetail: {
            type: Object,
            default: null
        },
        color: {
            type: String
        },
        font: {
            type: Number
        },
        content: {
            type: Array
        },
        copyRight: {
            type: Number,
            default: null
        },
        invoiceType: {
            type: String,
            default: null
        },
        invoiceName: {
            type: String,
            default: null
        }
    },
    methods: {
        getData() {
            document.documentElement.style.setProperty('--font-color-80', this.color);
            document.documentElement.style.setProperty('--font-size-80', this.font + 'px');
            document.documentElement.style.setProperty('--font-size-80-2', (this.font + 2) + 'px');
            document.documentElement.style.setProperty('--font-size-80-4', (this.font + 4) + 'px');
            document.documentElement.style.setProperty('--print-size', '80mm');

        },
        elementInArray(value) {
            return this.content.includes(value);
        }
    },
    computed: {
        // show client name or supplier name 
        clientOrSupplier() {
            if (!this.purchaseInvoice)
                return this.$t("clientName")
            else return this.$t('supplierName')
        },
        contactPhoneCondition() {
            if (this.invoiceDetails == null) return true
            else if (this.invoiceDetails.contact.id != 1 && this.invoiceDetails.contact.phone) return true
            else return false
        },
        contactTaxNumberCondition() {
            if (this.invoiceDetails == null) return true
            else if (this.clientCondition && this.invoiceDetails.contact.tax_number) return true
            else return false
        },
        contactAddressCondition() {
            if (this.invoiceDetails == null) return true
            else if (this.clientCondition && this.invoiceDetails.contact.address) return true
            else return false
        },
        importDateCondition() {
            if (this.invoiceDetails == null) return true
            else if (this.invoiceDetails.invoice_meta_data.date_of_import && this.invoiceType == 'tax_invoice') return true
            else return false
        },
        // show client or not in sales invoice
        clientCondition() {
            if (this.invoiceDetails.contact.id != 1 &&
                this.invoiceType != 'simple_tax_invoice')
                return true
            else return false
        },
        getTimeDate() {
            const date = new Date(this.invoiceDetails.invoice_meta_data.invoice_created_at);

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
            return new Date(this.invoiceDetails.invoice_meta_data.date_of_import).toLocaleDateString(
                "en-US"
            )
        },
        priceName() {
            return this.purchaseInvoice ? this.$t('cost') : this.$t("price");
        },
        bottomTextCondition() {
            if (this.invoiceDetails == null) return true
            else if (this.invoiceDetails.market.bottom_text != null) return true
            else return false
        },
        upperTextCondition() {
            if (this.invoiceDetails == null) return true
            else if (this.invoiceDetails.market.upper_text != null) return true
            else return false
        },
        totalName() {
            return this.invoiceType == "untaxed_invoice"
                ? this.$t("total")
                : this.$t("subtotal");
        },
        discountCondition() {
            if (this.invoiceDetails == null) return true
            else if (this.invoiceDetails.invoice_totals.discount_amount != 0) return true
            else return false
        },
        priceAfterDiscountCondition() {
            if (this.invoiceDetails == null) return true
            else if (this.invoiceDetails.invoice_totals.discount_amount != 0 || this.invoiceDetails.invoice_totals.discount_percentage != 0) return true
            else return false
        },
        purchaseInvoice() {
            if (this.invoiceDetails == null) return false
            else if (this.invoiceDetails.invoice_meta_data.invoice_type == 'App\\Models\\Order' || this.invoiceDetails.invoice_meta_data.invoice_type == 'App\\Models\\RefundOrder')
                return false
            else return true
        },
    },
    watch: {
        color(value) {
            document.documentElement.style.setProperty('--font-color-80', value);
        },
        font(value) {
            document.documentElement.style.setProperty('--font-size-80', value + 'px');
            document.documentElement.style.setProperty('--font-size-80-2', (value + 2) + 'px');
            document.documentElement.style.setProperty('--font-size-80-4', (value + 4) + 'px');
        }
    },
    created() {
        this.getData()
    }
}
</script>
<style scoped>
:root {
    --font-color-80: #363f4e;
    --font-size-80: 12px;
    --font-size-80-2: 14px;
    --font-size-80-4: 16px;
}

p,
span {
    font-size: var(--font-size-80);
}

.print-area {
    color: var(--font-color-80) !important;
    display: flex;
    flex-direction: column;
    width: 80mm;
}

.user-details,
.invoice-details,
.client-details,
.qr-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    border-bottom: 1px dashed var(--font-color-80);
    padding: 7px;
}

.invoice-details .invoice-name,
.user-details h3 {
    font-family: 'BahjiiBold';
    font-size: var(--font-size-80-4);
}

.user-details .img-container {
    width: 90px;
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.user-details .logo-container p {
    margin-bottom: 0px !important;
    border: 1px solid var(--font-color-80);
    border-radius: 50%;
    padding: 15px;
    text-align: center;
}

.date-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed var(--font-color-80);
    padding: 7px;
}

.table-container,
.total-container {
    border-bottom: 1px dashed var(--font-color-80);
    padding: 7px 0;
    display: flex;
    flex-direction: column;
}

.table-container table {
    width: 100%;
    border-collapse: collapse;
}

.table-container table thead tr {
    border-bottom: 1px dashed var(--font-color-80);
}

.table-container table td,
.table-container table th {
    font-size: var(--font-size-80);
    text-align: center;
    max-width: 30px;
    overflow: hidden;
    white-space: initial;
    text-overflow: ellipsis;
}

.table-container table .second-row td {
    text-align: right;
}

.total-container div {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
}

.total-container p {
    font-family: 'BahjiiBold';
    font-size: var(--font-size-80-2);
}
</style>