<template>
  <v-container
    class="d-flex justify-space-between align-stretch mt-5"
    style="gap: 35px"
  >
    <div class="right-side">
      <div class="inner-container">
        <p>{{ $t("invoiceTemplate") }}</p>
        <div class="options-container">
          <div
            v-for="template in templates"
            :key="template.id"
            @click="setActiveTemplate(template)"
            :class="activeTemplate == template.template_id ? 'active' : ''"
            style="cursor: pointer"
          >
            <v-img
              :src="require(`../assets/imgs/${template.image}`)"
              width="100"
              height="100"
            ></v-img>
          </div>
        </div>
      </div>
      <div class="inner-container mt-5">
        <p>{{ $t("invoiceSize") }}</p>
        <div class="options-container">
          <div
            v-for="size in sizes"
            :key="size"
            @click="setActiveSize(size)"
            :class="activeSize == size ? 'active-size' : ''"
            class="size-container elevation-3"
          >
            {{ size }}
          </div>
        </div>
      </div>
      <div class="inner-container mt-5">
        <p>{{ $t("fontSize") }}</p>
        <div class="options-container">
          <div
            v-for="font in fonts"
            :key="font.id"
            @click="setActiveFont(font)"
            :class="activeFont == font.value ? 'active-size' : ''"
            class="size-container elevation-3"
          >
            {{ font.name }}
          </div>
        </div>
      </div>
      <div class="inner-container mt-5">
        <p>{{ $t("invoiceContent") }}</p>
        <div class="options-container form-container" style="width: 100%">
          <v-autocomplete
            chips
            deletable-chips
            multiple
            small-chips
            v-model="values"
            :items="items"
            outlined
            hide-details
            color="#D2D2D2"
          ></v-autocomplete>
        </div>
      </div>
      <div
        class="d-flex justify-space-between align-center mt-5"
        style="width: 100%"
      >
        <p>{{ $t("mainColor") }}</p>
        <div>
          <input type="color" v-model="color" />
        </div>
      </div>
      <div class="d-flex justify-center align-center mt-5">
        <v-btn color="#4fca9a" dark class="elevation-4" @click="save">{{
          $t("savePrintSetting")
        }}</v-btn>
      </div>
    </div>
    <div class="left-side" :style="activeSize == 'A4' ? 'flex-basis:80%' : ''">
      <InvoiceTemplate
        :content="values"
        :color="color"
        :font="Number(activeFont)"
        v-if="activeSize == 'A4' && activeTemplate == 1"
      />
      <InvoiceSecondTemplate
        :content="values"
        :color="color"
        :font="Number(activeFont)"
        v-else-if="activeSize == 'A4' && activeTemplate == 2"
      />
      <InvoiceTemplate80
        :content="values"
        :color="color"
        :font="Number(activeFont)"
        v-if="activeSize == '80mm'"
      />
    </div>
    <alert-dialog
      v-if="successAlert"
      @close="close"
      :close="close"
      :buttonName="$t('done')"
      color="#62C83F"
    >
      <template #title>
        {{ $t("doneSuccessfuly") }}
      </template>
    </alert-dialog>
  </v-container>
</template>
<script>
import InvoiceTemplate from "@/components/UI/InvoiceTemplate.vue";
import InvoiceTemplate80 from "@/components/UI/InvoiceTemplate80.vue";
import InvoiceSecondTemplate from "@/components/UI/InvoiceSecondTemplate.vue";
import axios from "axios";
export default {
  components: { InvoiceTemplate, InvoiceTemplate80, InvoiceSecondTemplate },
  data() {
    return {
      userDetails: null,
      sizes: ["A4", "80mm"],
      newA4: null,
      new80mm: null,
      activeSize: "A4",
      activeTemplate: null,
      activeFont: null,
      color: null,
      values: [],
      items: [
        "import_date",
        "product_notes",
        "creator_name",
        "bottom_text",
        "store_logo",
        "payment_method",
        "product_barcode",
      ],
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
      successAlert: false,
    };
  },
  methods: {
    setData() {
      this.userDetails = JSON.parse(localStorage.getItem("userDetails"));
      if (this.userDetails.invoice_settings_json != null) {
        this.newA4 = JSON.parse(this.userDetails.invoice_settings_json)["A4"];
        this.new80mm = JSON.parse(this.userDetails.invoice_settings_json)[
          "80mm"
        ];
        if (this.new80mm == null) this.new80mm = this.default80;
        if (this.newA4 == null) this.newA4 = this.defaultA4;
      } else {
        this.new80mm = this.default80;
        this.newA4 = this.defaultA4;
      }
      this.setA4Data();
    },
    setA4Data() {
      this.activeFont = this.newA4.font_size;
      this.color = this.newA4.color;
      this.values = this.newA4.content;
      this.activeTemplate = this.newA4.template_id;
    },
    set80Data() {
      this.activeFont = this.new80mm.font_size;
      this.color = this.new80mm.color;
      this.values = this.new80mm.content;
      this.activeTemplate = this.new80mm.template_id;
    },
    setActiveTemplate(template) {
      this.activeTemplate = template.template_id;
      if (this.activeSize == "A4") this.newA4.id = this.activeTemplate;
    },
    setActiveSize(size) {
      this.activeSize = size;
    },
    setActiveFont(font) {
      this.activeFont = font.value;
      this.activeSize == "A4"
        ? (this.newA4.font_size = this.activeFont)
        : (this.new80mm.font_size = this.activeFont);
    },
    save() {
      axios
        .post("user-detail/update", {
          market_name: this.userDetails["market_name"],
          phone: this.userDetails["phone"],
          tax_number: this.userDetails["tax_number"],
          tax_on_of: this.userDetails["tax_on_of"],
          precision: this.userDetails["precision"],
          cut_val:this.userDetails["cut_val"],
          invoice_settings_json: JSON.stringify({
            "A4": this.newA4,
            "80mm": this.new80mm,
          }),
        })
        .then(() => (this.successAlert = true));
    },
    close() {
      this.successAlert = false;
      this.$store.dispatch("userDetail");
    },
  },
  computed: {
    templates() {
      if (this.activeSize == "A4")
        return [
          { template_id: 1, name: "Template 1", image: "a4.png" },
          {
            template_id: 2,
            name: "Template 2",
            image: "secondTemplate.jpeg",
          },
        ];
      else return [{ template_id: 1, name: "Template 1", image: "80mm.png" }];
    },
    fonts() {
      if (this.activeSize == "A4")
        return [
          { name: "12px", value: 12 },
          { name: "14px", value: 14 },
          { name: "16px", value: 16 },
        ];
      else
        return [
          { name: "10px", value: 10 },
          { name: "12px", value: 12 },
          { name: "14px", value: 14 },
        ];
    },
  },
  watch: {
    activeSize(value) {
      if (value == "A4") this.setA4Data("first");
      else this.set80Data();
    },
    values(val) {
      if (this.activeSize == "A4") this.newA4.content = val;
      else this.new80mm.content = val;
    },
    color(val) {
      if (this.activeSize == "A4") this.newA4.color = val;
      else this.new80mm.color = val;
    },
  },
  mounted() {
    this.setData();
  },
};
</script>

<style scoped>
.right-side {
  flex-basis: 35%;
}

.inner-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
}

.inner-container p {
  font-size: 0.9rem;
}

.options-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 15px;
}

.options-container .active {
  border: 2px solid #4fca9a;
}

.options-container .size-container {
  width: 70px;
  height: 70px;
  border-radius: 10px;
  font-size: 1rem;
  font-family: "BahjiiBold";
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.options-container .active-size {
  background: #4fca9a;
  color: white;
}

.options-container :deep(.v-input__append-inner) {
  cursor: pointer;
}

.options-container :deep(.v-chip--select) {
  border: 1px solid #4fca9a;
  background: rgba(79, 202, 154, 0.2);
}

.options-container :deep(.v-chip__content) {
  direction: ltr;
  color: #4fca9a;
}

.options-container :deep(.v-chip__content button::before) {
  color: #4fca9a;
}

:deep(.color-input) {
  display: none !important;
}

:deep(.current-color) {
  border-radius: 50% !important;
}

.v-autocomplete__content.v-menu__content :deep(.v-list .v-list-item--active) {
  background: #4fca9a !important;
}
</style>
