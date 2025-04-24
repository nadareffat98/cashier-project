<template>
  <v-container>
    <v-btn
      dark
      color="#4FCA9A"
      height="35px"
      :class="[marginFive, 'mb-3']"
      @click="download"
      v-if="type == 'show'"
    >
      {{ $t("download") }}
    </v-btn>
    <div
      id="print-price-quote"
      :style="$i18n.locale == 'en' ? 'direction:ltr' : 'direction:rtl'"
      style="margin-top: 25px"
    >
      <h3 style="margin-bottom: 10px; text-align: center">
        {{ $t("priceQuote") }}
      </h3>
      <div
        style="
          display: flex;
          justify-content: space-around;
          align-items: center;
          gap: 50px;
        "
      >
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: start;
            flex-basis: 25%;
          "
          class="user-details"
        >
          <p>{{ priceQuoteDetails.user_details.market_name }}</p>
          <p>{{ $t("phone") }} : {{ priceQuoteDetails.user_details.phone }}</p>
          <p>
            {{ $t("address") }} : {{ priceQuoteDetails.user_details.address }}
          </p>
          <p>
            {{ $t("date") }} :
            {{
              new Date(priceQuoteDetails.created_at).toLocaleDateString("en-US")
            }}
          </p>
          <p>
            {{ $t("quotationNum") }} : {{ priceQuoteDetails.quotation_number }}
          </p>
        </div>
        <div class="parent-column-div" style="flex-basis: 15%">
          <p>{{ $t("clientName") }} : {{ priceQuoteDetails.client }}</p>
        </div>
        <div
          class="parent-div"
          style="
            flex-basis: 25%;
            display: flex;
            justify-content: end;
            align-items: center;
          "
        >
          <div>
            <v-img
              v-if="logo != null"
              :src="logo"
              style="width: 100px; height: 100px"
            ></v-img>
          </div>
        </div>
      </div>
      <div class="parent-row-div mb-2">
        <p style="width: 90%; text-align: center">
          {{ priceQuoteDetails.introduction }}
        </p>
      </div>
      <div class="parent-row-div mb-2">
        <h3>{{ $t("quoteDetails") }}</h3>
      </div>
      <div class="parent-row-div">
        <table style="width: 90%">
          <thead>
            <th>{{ $t("id") }}</th>
            <th style="width:50%">{{ $t("product") }}</th>
            <th>{{ $t("qty") }}</th>
            <th>{{ $t("pBT") }}</th>
            <th>{{ $t("taxShort") }}</th>
            <th>{{ $t("pAT") }}</th>
            <th>{{ $t("total") }}</th>
          </thead>
          <tbody>
            <tr
              v-for="(product, index) in priceQuoteDetails.products"
              :key="index"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ product.name }}</td>
              <td>{{ product.quantity }}</td>
              <td>
                {{ $RoundingNumber(product.price_before_tax, "product") }}
              </td>
              <td>
                {{
                  $RoundingNumber(
                    product.price_after_tax - product.price_before_tax,
                    "total"
                  )
                }}
              </td>
              <td>{{ $RoundingNumber(product.price_after_tax, "product") }}</td>
              <td>{{ product.total_price }}</td>
            </tr>
            <tr>
              <td colspan="2"   :class="$i18n.locale == 'en' ? 'empty-en' : 'empty-ar'"></td>
              <td colspan="3">{{ $t("subtotal") }}</td>
              <td colspan="2">
                {{
                  $RoundingNumber(priceQuoteDetails.sub_total) + $t("SRmini")
                }}
              </td>
            </tr>
            <tr v-if="priceQuoteDetails.discount != null">
              <td colspan="2" :class="$i18n.locale == 'en' ? 'empty-en' : 'empty-ar'"></td>
              <td colspan="3">{{ $t("discountValue") }}</td>
              <td colspan="2">
                {{
                  priceQuoteDetails.discount +
                  (priceQuoteDetails.discount_type == "fixed"
                    ? $t("SRmini")
                    : "%")
                }}
              </td>
            </tr>
            <tr v-if="priceQuoteDetails.discount != null">
              <td colspan="2" :class="$i18n.locale == 'en' ? 'empty-en' : 'empty-ar'"></td>
              <td colspan="3">{{ $t("priceAfterDiscount") }}</td>
              <td colspan="2">
                {{ priceAfterDiscount + $t("SRmini") }}
              </td>
            </tr>
            <tr>
              <td colspan="2" :class="$i18n.locale == 'en' ? 'empty-en' : 'empty-ar'"></td>
              <td colspan="3">{{ $t("AddedTax") }} %15</td>
              <td colspan="2">
                {{ $RoundingNumber(priceQuoteDetails.tax,"product") + $t("SRmini") }}
              </td>
            </tr>
            <tr>
              <td colspan="2" :class="$i18n.locale == 'en' ? 'empty-en' : 'empty-ar'"></td>
              <td colspan="3">{{ $t("totalWithTax") }}</td>
              <td colspan="2">
                {{ priceQuoteDetails.total + $t("SRmini") }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="parent-column-div" style="padding-top:15px">
        <p>{{ $t("quoteIsValide") }} {{ priceQuoteDetails.expire_date }}</p>
        <p
          style="
            border-bottom: 2px solid black;
            width: 90%;
            text-align: center;
            padding-bottom:10px;
          "
        >
          {{ $t("paymentMethod") }} : {{ priceQuoteDetails.payment_info }}
        </p>
      </div>
      <div class="parent-column-div pt-5" v-if="priceQuoteDetails.note != null">
        <h3>{{ $t("notes") }}</h3>
        <p style="width: 90%; text-align: center">
          {{ priceQuoteDetails.note }}
        </p>
      </div>
    </div>
  </v-container>
</template>
<script>
import html2pdf from "html2pdf.js";
export default {
  data() {
    return {
      priceQuoteDetails: this.$route.params.priceQuoteDetails,
      logo: JSON.parse(localStorage.getItem("userDetails"))["logo"],
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
      html2pdf(document.getElementById("print-price-quote"), {
        margin: 0,
        filename:
          this.priceQuoteDetails.user_details.market_name +
          "." +
          new Date(
            this.priceQuoteDetails.user_details.created_at
          ).toLocaleDateString("en-US") +
          ".pdf",
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
    marginFive() {
      return this.$i18n.locale == "en" ? "ml-5" : "mr-5";
    },
    priceAfterDiscount() {
      if (this.priceQuoteDetails.discount_type == "fixed") {
        return this.$RoundingNumber(
          this.priceQuoteDetails.sub_total - this.priceQuoteDetails.discount,
          "total"
        );
      } else {
        return (
          this.priceQuoteDetails.sub_total -
          this.$RoundingNumber(
            this.priceQuoteDetails.sub_total *
              (Number(this.priceQuoteDetails.discount) / 100),
            "total"
          )
        );
      }
    },
  },
  mounted() {
    document.documentElement.style.setProperty("--print-size", "A4");
    if (this.type == "print") this.print();
  },
};
</script>

<style scoped>
p {
  margin-bottom: 0;
}
.user-details p {
  margin-bottom: 3px;
}
table,
th,
td {
  border: 2px solid black;
  border-collapse: collapse;
  text-align: center;
  padding: 8px;
}
table tr td.empty-ar {
  border-right-color: white;
  border-bottom-color: white;
}
table tr td.empty-en {
  border-left-color: white;
  border-bottom-color: white;
}
.parent-row-div {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 15px;
}
.parent-column-div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
