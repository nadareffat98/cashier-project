<template>
  <div>
    <div style="padding: 20px 50px 0 20px">
      <v-btn
        dark
        color="#4FCA9A"
        @click="exportToPDF"
        v-if="type != 'print' && buttonShow"
        >{{ $t("download") }}</v-btn
      >
    </div>
    <InvoiceTemplateVue
      v-if="size == 'A4' && template == 1"
      :invoiceDetails="invoiceDetails"
      :userDetail="userDetail"
      :color="newA4.color"
      :font="newA4 ? Number(newA4.font_size) : ''"
      :content="newA4 ? newA4.content : ''"
      :copyRight="copyRight"
      :invoiceType="invoiceType"
      :invoiceName="invoiceName"
    />
    <InvoiceSecondTemplate
      v-else-if="size == 'A4' && template == 2"
      :invoiceDetails="invoiceDetails"
      :userDetail="userDetail"
      :color="newA4.color"
      :font="newA4 ? Number(newA4.font_size) : ''"
      :content="newA4 ? newA4.content : ''"
      :copyRight="copyRight"
      :invoiceType="invoiceType"
      :invoiceName="invoiceName"
    />
    <InvoiceTemplate80
      :invoiceDetails="invoiceDetails"
      :userDetail="userDetail"
      :color="new80mm ? new80mm.color : ''"
      :font="new80mm ? Number(new80mm.font_size) : ''"
      :content="new80mm ? new80mm.content : ''"
      :copyRight="copyRight"
      :invoiceType="invoiceType"
      :invoiceName="invoiceName"
      v-else-if="size == '80mm'"
    />
  </div>
</template>
<script>
import html2pdf from "html2pdf.js";
import InvoiceTemplateVue from "@/components/UI/InvoiceTemplate.vue";
import InvoiceTemplate80 from "@/components/UI/InvoiceTemplate80.vue";
import InvoiceSecondTemplate from "@/components/UI/InvoiceSecondTemplate.vue";
export default {
  components: { InvoiceTemplateVue, InvoiceTemplate80, InvoiceSecondTemplate },
  data() {
    return {
      invoiceDetails: {},
      newA4: null,
      new80mm: null,
      userDetail: null,
      copyRight: null,
      type: null,
      size: null,
      template: null,
      invoiceType: null,
      invoiceName: null,
      buttonShow: true,
      defaultA4: {
        size: "A4",
        font_size: 14,
        template_id: 1,
        color: "#363f4e",
        content: [
          "import_date",
          "product_notes",
          "creator_name",
          "bottom_text",
          "store_logo",
          "payment_method",
          "product_barcode",
        ],
      },
      default80: {
        size: "80mm",
        template_id: 1,
        font_size: 10,
        color: "#363f4e",
        content: [
          "import_date",
          "product_notes",
          "creator_name",
          "upper_text",
          "bottom_text",
          "store_logo",
          "payment_method",
          "product_barcode",
        ],
      },
    };
  },
  methods: {
    getData() {
      this.userDetail = JSON.parse(localStorage.getItem("userDetails"));
      this.invoiceDetails = JSON.parse(localStorage.getItem("invoice"));
      this.copyRight = this.userDetail["copy_rights_visible"];
      this.type = this.$route.params.type;
      this.size = this.$route.params.size ?? "A4";
      this.template = this.$route.params.template ?? 1;
      this.buttonShow = this.$route.params.button;
      this.setPrintSetting();
      this.invoiceNameAndType();
      this.printInvoice();
    },
    setPrintSetting() {
      if (this.invoiceDetails.invoice_meta_data.invoice_settings_json != null) {
        this.newA4 = JSON.parse(
          this.invoiceDetails.invoice_meta_data.invoice_settings_json
        )["A4"];
        this.new80mm = JSON.parse(
          this.invoiceDetails.invoice_meta_data.invoice_settings_json
        )["80mm"];
        if (this.newA4 == null) this.newA4 = this.defaultA4;
        if (!this.new80mm == null) this.new80mm = this.default80;
      } else {
        this.newA4 = this.defaultA4;
        this.new80mm = this.default80;
      }
    },
    invoiceNameAndType() {
      if (this.invoiceDetails.invoice_totals.tax_amount == 0) {
        this.invoiceType = "untaxed_invoice";
        if (
          this.invoiceDetails.invoice_meta_data.invoice_type ==
          "App\\Models\\Order"
        )
          this.invoiceName = this.$t("invoice");
        else if (
          this.invoiceDetails.invoice_meta_data.invoice_type ==
          "App\\Models\\RefundOrder"
        )
          this.invoiceName = this.$t("refundSimpleInvoice");
        else if (
          this.invoiceDetails.invoice_meta_data.invoice_type ==
          "App\\Models\\Purchase"
        )
          this.invoiceName = this.$t("purchasesInvoice");
        else this.invoiceName = this.$t("purchasesRefundInvoice");
      } else {
        this.invoiceType = "tax_invoice";
        if (
          this.invoiceDetails.invoice_meta_data.invoice_type ==
          "App\\Models\\Purchase"
        )
          this.invoiceName = this.$t("taxedPurchaseInvoice");
        else if (
          this.invoiceDetails.invoice_meta_data.invoice_type ==
          "App\\Models\\RefundPurchase"
        )
          this.invoiceName = this.$t("refundTaxedPurchaseInvoice");
        else if (
          this.invoiceDetails.invoice_meta_data.invoice_type ==
          "App\\Models\\Order"
        ) {
          if (this.invoiceDetails.invoice_meta_data.is_simple_invoice) {
            this.invoiceType = "simple_tax_invoice";
            this.invoiceName = this.$t("simpleTaxedInvoice");
          } else this.invoiceName = this.$t("taxedInvoice");
        } else {
          if (this.invoiceDetails.invoice_meta_data.is_simple_invoice) {
            this.invoiceType = "simple_tax_invoice";
            this.invoiceName = this.$t("refundSimpleTaxedInvoice");
          } else this.invoiceName = this.$t("refundTaxedInvoice");
        }
      }
    },
    printInvoice() {
      if (this.type != "show") {
        setTimeout(() => {
          if (this.type == "print") window.print();
        }, 1000);
      }
    },
    exportToPDF() {
      const element = document.getElementById("printArea");
      const options = {
        margin: 0,
        filename:
          this.invoiceDetails["market"]["name"] +
          "." +
          new Date(
            this.invoiceDetails.invoice_meta_data.invoice_created_at
          ).toLocaleDateString("en-US") +
          ".pdf",
        image: { type: ["png", "jpeg"], quality: 1 },
        html2canvas: {
          scale: 1,
          scrollY: 0,
          useCORS: true,
        },
        jsPDF: {
          unit: "in",
          format: "A4",
          orientation: "landscape",
        },
      };
      html2pdf().from(element).set(options).save();
    },
  },
  created() {
    this.getData();
  },
};
</script>
