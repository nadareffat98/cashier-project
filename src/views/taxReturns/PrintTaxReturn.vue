<template>
  <v-container>
    <v-btn
      dark
      color="#4FCA9A"
      height="35px"
      :class="$i18n.locale == 'en' ? 'ml-3' : 'mr-3'"
      @click="download"
      v-if="type != 'print'"
    >
      {{ $t("download") }}
    </v-btn>
    <div
      ref="printTaxReturn"
      style="text-align: center; padding-bottom: 10px"
      :style="$i18n.locale == 'en' ? 'direction:ltr;' : 'direction:rtl'"
    >
      <div
        class="title-content"
        style="
          border: 3px solid #f3f5f0;
          width: 30%;
          margin: auto;
          padding: 10px 0;
          border-radius: 10px;
        "
      >
        <h3 style="font-size: 1rem">{{ $t("taxReturn") }}</h3>
        <div
          style="
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            margin-top: 7px;
          "
        >
          <p>
            {{ $t("from") }} : <span>{{ taxReturnDetails.date_from }}</span>
          </p>
          <p>
            {{ $t("to") }} : <span>{{ taxReturnDetails.date_to }}</span>
          </p>
        </div>
      </div>
      <div class="sales-container">
        <div class="title">
          <div class="vertical-title">{{ $t("sales") }}</div>
        </div>
        <div class="content">
          <div>
            <p>{{ $t("taxableSales") }}</p>
            <div class="input-container">
              <v-text-field
                :value="
                  $RoundingNumber(taxReturnDetails.sales) + ' ' + $t('SRmini')
                "
                color="#8F8F8F"
                outlined
                hide-details
                readonly
              ></v-text-field>
            </div>
          </div>
          <div>
            <p>{{ $t("salesTax") }}</p>
            <div class="input-container">
              <v-text-field
                :value="
                  $RoundingNumber(taxReturnDetails.sales_tax) +
                  ' ' +
                  $t('SRmini')
                "
                color="#8F8F8F"
                outlined
                hide-details
                readonly
              ></v-text-field>
            </div>
          </div>
          <div>
            <p>{{ $t("refundInvoice") }}</p>
            <div class="input-container">
              <v-text-field
                :value="
                  $RoundingNumber(taxReturnDetails.sales_refund) +
                  ' ' +
                  $t('SRmini')
                "
                color="#8F8F8F"
                outlined
                hide-details
                readonly
              ></v-text-field>
            </div>
          </div>
          <div>
            <p>{{ $t("salesReundTax") }}</p>
            <div class="input-container">
              <v-text-field
                :value="
                  $RoundingNumber(taxReturnDetails.sales_refund_tax) +
                  ' ' +
                  $t('SRmini')
                "
                color="#8F8F8F"
                outlined
                hide-details
                readonly
              ></v-text-field>
            </div>
          </div>
          <div>
            <p>{{ $t("totalSales") }}</p>
            <div class="input-container">
              <v-text-field
                :value="$RoundingNumber(totalSales) + ' ' + $t('SRmini')"
                color="#8F8F8F"
                outlined
                hide-details
                readonly
              ></v-text-field>
            </div>
          </div>
          <div>
            <p>{{ $t("totalSalesTax") }}</p>
            <div class="input-container">
              <v-text-field
                :value="$RoundingNumber(totalSalesTax) + ' ' + $t('SRmini')"
                color="#8F8F8F"
                outlined
                hide-details
                readonly
              ></v-text-field>
            </div>
          </div>
        </div>
      </div>
      <div class="purchase-container">
        <div class="title">
          <div class="vertical-title">{{ $t("purchases") }}</div>
        </div>
        <div class="content">
          <div>
            <p>{{ $t("taxablePurchases") }}</p>
            <div class="input-container">
              <v-text-field
                :value="
                  $RoundingNumber(taxReturnDetails.purchases) +
                  ' ' +
                  $t('SRmini')
                "
                color="#8F8F8F"
                outlined
                hide-details
                readonly
              ></v-text-field>
            </div>
          </div>
          <div>
            <p>{{ $t("purchaseTax") }}</p>
            <div class="input-container">
              <v-text-field
                :value="
                  $RoundingNumber(taxReturnDetails.purchases_tax) +
                  ' ' +
                  $t('SRmini')
                "
                color="#8F8F8F"
                outlined
                hide-details
                readonly
              ></v-text-field>
            </div>
          </div>
          <div>
            <p>{{ $t("purchaseRefunds") }}</p>
            <div class="input-container">
              <v-text-field
                :value="
                  $RoundingNumber(taxReturnDetails.purchases_refund) +
                  ' ' +
                  $t('SRmini')
                "
                color="#8F8F8F"
                outlined
                hide-details
                readonly
              ></v-text-field>
            </div>
          </div>
          <div>
            <p>{{ $t("purchaseRefundsTax") }}</p>
            <div class="input-container">
              <v-text-field
                :value="
                  $RoundingNumber(taxReturnDetails.purchases_refund) +
                  ' ' +
                  $t('SRmini')
                "
                color="#8F8F8F"
                outlined
                hide-details
                readonly
              ></v-text-field>
            </div>
          </div>
          <div>
            <p>{{ $t("totalPurchases") }}</p>
            <div class="input-container">
              <v-text-field
                :value="$RoundingNumber(totalPurchases) + ' ' + $t('SRmini')"
                color="#8F8F8F"
                outlined
                hide-details
                readonly
              ></v-text-field>
            </div>
          </div>
          <div>
            <p>{{ $t("totalPurchaseTax") }}</p>
            <div class="input-container">
              <v-text-field
                :value="$RoundingNumber(totalPurchaseTax) + ' ' + $t('SRmini')"
                color="#8F8F8F"
                outlined
                hide-details
                readonly
              ></v-text-field>
            </div>
          </div>
        </div>
      </div>
      <div class="tax">
        <div class="tax-content">
          <p>{{ $t("valueOfTaxDue") }}</p>
          <p>{{ valueOfTaxDue }} {{ $t("SRmini") }}</p>
        </div>
      </div>
    </div>
    <!-- <div style="
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 15px;
          margin-top: 7px;
        ">
        <p>
          {{ $t("from") }} : <span>{{ taxReturnDetails.date_from }}</span>
        </p>
        <p>
          {{ $t("to") }} : <span>{{ taxReturnDetails.date_to }}</span>
        </p>
      </div>
      <h3>{{ $t("refunds") }}</h3>
      <div class="purchase-container">
        <div>
          <p>{{ $t("taxablePurchases") }} :</p>
          <p>
            <span> {{ this.$RoundingNumber(taxReturnDetails.purchases) }} </span>{{ " " + $t("SRmini") }}
          </p>
        </div>
        <div>
          <p>{{ $t("purchaseTax") }} :</p>
          <p>
            <span>
              {{ this.$RoundingNumber(taxReturnDetails.purchases_tax) }} </span>{{ " " + $t("SRmini") }}
          </p>
        </div>
        <div>
          <p>{{ $t("purchaseRefunds") }} :</p>
          <p>
            <span>{{
              this.$RoundingNumber(taxReturnDetails.purchases_refund)
            }}</span>{{ " " + $t("SRmini") }}
          </p>
        </div>
        <div>
          <p>{{ $t("purchaseRefundsTax") }} :</p>
          <p>
            <span>{{
              this.$RoundingNumber(taxReturnDetails.purchases_refund_tax)
            }}</span>
            {{ " " + $t("SRmini") }}
          </p>
        </div>
        <div>
          <p>{{ $t("totalPurchases") }} :</p>
          <p>
            <span>{{ this.$RoundingNumber(totalPurchases) }}</span>{{ " " + $t("SRmini") }}
          </p>
        </div>
        <div>
          <p>{{ $t("totalPurchaseTax") }} :</p>
          <p>
            <span>{{ this.$RoundingNumber(totalPurchaseTax) }}</span>{{ " " + $t("SRmini") }}
          </p>
        </div>
      </div>
      <div class="tax">
        <p>{{ $t("valueOfTaxDue") }} :</p>
        <p>
          <span>{{ valueOfTaxDue }}</span>{{ " " + $t("SRmini") }}
        </p>
      </div>
    </div> -->
  </v-container>
</template>
<script>
import html2pdf from "html2pdf.js";

export default {
  data() {
    return {
      taxReturnDetails: this.$route.params.taxReturnDetails,
      type: this.$route.params.type,
    };
  },
  methods: {
    print() {
      setTimeout(() => {
        window.print();
      }, 1000);
    },
    download() {
      html2pdf(this.$refs.printTaxReturn, {
        margin: 0,
        filename: "tax-return.pdf",
        image: { type: ["png", "jpeg"] },
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
      });
    },
  },
  computed: {
    getTax() {
      return this.$store.getters.getTax;
    },
    totalSales() {
      return this.taxReturnDetails.sales - this.taxReturnDetails.sales_refund;
    },
    totalSalesTax() {
      return this.totalSales * this.getTax;
    },
    totalPurchases() {
      return (
        this.taxReturnDetails.purchases - this.taxReturnDetails.purchases_refund
      );
    },
    totalPurchaseTax() {
      return this.totalPurchases * this.getTax;
    },
    valueOfTaxDue() {
      return this.$RoundingNumber(this.totalSalesTax - this.totalPurchaseTax);
    },
  },
  mounted() {
    this.$store.dispatch("tax");
    if (this.type == "print") {
      this.print();
    }
  },
};
</script>
<style scoped>
.sales-container,
.purchase-container,
.tax {
  display: flex;
  justify-content: center;
  align-items: stretch;
  margin-top: 10px;
}

.sales-container .content,
.purchase-container .content {
  flex-basis: 60%;
  padding: 15px;
}

.sales-container .content,
.tax .tax-content {
  background: #f3f5f0;
}

.purchase-container .content {
  border: 3px solid #f3f5f0;
}

.content div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}

.content p {
  flex-basis: 40%;
  font-size: 0.9rem;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 0;
}

.content .input-container {
  flex-basis: 20%;
}

.sales-container .title,
.purchase-container .title {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-basis: 5%;
}

.sales-container .title {
  border: 3px solid #f3f5f0;
}

.purchase-container .title {
  background: #f3f5f0;
}

.vertical-title {
  writing-mode: vertical-lr;
  text-orientation: mixed;
  white-space: nowrap;
  font-size: 1rem;
}

.sales-container :deep(.v-input__slot) {
  background: white !important;
  min-height: 25px !important;
  height: 25px !important;
}

.purchase-container :deep(.v-input__slot) {
  background: #f3f5f0 !important;
  min-height: 25px !important;
  height: 25px !important;
}

:deep(fieldset) {
  border: none;
}

:deep(.v-text-field--outlined fieldset) {
  border-width: 1px;
}

:deep(input) {
  font-size: 0.9rem !important;
  text-align: center;
}

.tax-content {
  border: 3px solid #f3f5f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  width: 65%;
}
</style>
