<template>
  <v-container class="mt-5">
    <h2>{{ $t("paymentMethods") }}</h2>
    <div class="d-flex justify-space-between align-center my-3">
      <v-btn color="#4FCA9A" :class="marginThree" style="border-radius: 10px;height: 34px;color:white" @click="openModal">
        <v-icon color="white" size="29" :left="$i18n.locale == 'en'">add_box</v-icon>
        <span class="addText">{{ $t("addPaymentMethod") }} </span>
      </v-btn>
    </div>
    <v-data-table :headers="headers" :items="getPaymentMethods" height="60vh" fixed-header hide-default-footer
      mobile-breakpoint="0" :class="[$i18n.locale == 'en' ? 'eng-table' : '', 'mt-3 tableStriped']">
      <template slot="no-data"> {{ $t("noPaymentMethods") }}</template>
      <template slot="item.actions" slot-scope="{ item }">
        <td v-if="!item.is_default">
          <v-btn class="actions" color="#2BB3B3" dark @click="editItem(item)">{{ $t("edit")
          }}</v-btn>
          <v-btn :class="[marginTwo, 'actions']" color="#E50D0D" dark @click="removeItem(item)">{{ $t("delete")
          }}</v-btn>
        </td>
        <td v-else>{{ $t("nonEditable") }}</td>
      </template>
    </v-data-table>
    <div class="cards-responsive">
      <div v-if="getPaymentMethods.length == 0" class="no-data-container">
        <p>{{ $t("noPaymentMethods") }}</p>
      </div>
      <v-row v-else>
        <v-col v-for="getPaymentMethod in getPaymentMethods" :key="getPaymentMethod.id" cols="12"
          :sm="getPaymentMethods.length > 1 ? '6' : '12'" xs="12">
          <v-card class="mx-auto" outlined>
            <v-card-text class="d-flex flex-wrap justify-start align-center invoice-content-responsive"
              :class="getPaymentMethods.length > 1 ? 'button-responsive' : ''" style="gap:10px">
              <template v-for="header in headers">
                <div v-if="header.value != 'actions'" :key="header.value" class="d-flex justify-start align-center pb-0"
                  style="gap: 5px">
                  <span>{{ header.text }} :</span>
                  <p>{{ getPaymentMethod[header.value] }}</p>
                </div>
                <div v-else class="d-flex justify-center" style="width: 100%;" :key="header.value">
                  <template v-if="!getPaymentMethod.is_default">
                    <v-btn class="actions" color="#2BB3B3" @click="editItem(getPaymentMethod)">{{
                      $t("edit")
                    }}</v-btn>
                    <v-btn :class="[marginTwo, 'actions']" color="#E50D0D" @click="removeItem(getPaymentMethod)">{{
                      $t("delete")
                    }}</v-btn>
                  </template>
                  <template v-else>{{ $t("nonEditable") }}</template>
                </div>
              </template>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <v-dialog v-model="dialog" :max-width="$vuetify.breakpoint.width < 425 ? '100%' : '450px'" @click:outside="close">
      <v-card class="mx-auto" :style="$vuetify.breakpoint.width < 425 ? 'padding:0 ' : 'padding: 0 1.5rem'">
        <v-card-title class="justify-center card-title-container">{{
          editedIndex == -1 ? $t("addPaymentMethod") : $t("edit")
        }}</v-card-title>
        <v-card-text>
          <v-form class="form-container">
            <div v-if="errors">
              <v-alert dense outlined type="error">
                {{ errors }}
              </v-alert>
            </div>
            <div>
              <label>{{ $t("paymentMethodNameAr") }}</label>
              <v-text-field v-model="editedItem.name.ar" :placeholder="$t('paymentMethodNameAr')" color="#8F8F8F"
                outlined></v-text-field>
            </div>
            <div>
              <label>{{ $t("paymentMethodNameEn") }}</label>
              <v-text-field v-model="editedItem.name.en" :placeholder="$t('paymentMethodNameEn')" color="#8F8F8F"
                outlined></v-text-field>
            </div>
            <div class="d-flex justify-center align-center">
              <v-btn color="#62C83F" class="white--text" @click="save" height="30" width="40%">
                {{ editedIndex == -1 ? $t("addPaymentMethod") : $t("edit") }}
              </v-btn>
              <v-btn color="#EF0B0B" :class="[marginTwo, 'white--text']" @click="close" height="30" width="40%">
                {{ $t("cancel") }}
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <alert-dialog v-if="dialogDelete" @close="close" :close="close">
      <template #title> {{ $t("areYouSureDeletePayment") }} </template>
      <template #actions>
        <v-btn color="#62C83F" dark class="actions mb-2 ml-2" width="35%" @click="deleteItemConfirm">{{ $t("accept")
        }}</v-btn>
      </template>
    </alert-dialog>
  </v-container>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      userDetails: null,
      errors: null,
      editedItem: {
        name: {
          ar: "",
          en: "",
        },
      },
      paymentMethod: {
        name: {
          ar: "",
          en: "",
        },
      },
      editedIndex: -1,
      dialog: false,
      dialogDelete: false,
    };
  },
  methods: {
    getData() {
      this.userDetails = JSON.parse(localStorage.getItem("userDetails"));
      if (this.userDetails["market_name"] != null) {
        this.$store.dispatch("paymentMethods", { lang: this.$i18n.locale });
      }
    },
    editItem(item) {
      this.editedIndex = this.getPaymentMethods.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedItem.name = Object.assign({}, item.name_json);
      this.dialog = true;
    },
    save() {
      if (this.editedIndex == -1) {
        axios
          .post("payment_methods", this.editedItem, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "X-localization": this.$i18n.locale,
            },
          })
          .then(() => {
            this.emptyErrors();
          })
          .catch((err) => {
            this.errors = err.response.data.message;
          });
      } else {
        axios
          .put(`payment_methods/${this.editedItem.id}`, this.editedItem, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "X-localization": this.$i18n.locale,
            },
          })
          .then(() => {
            this.emptyErrors();
          })
          .catch((err) => {
            this.errors = err.response.data.message;
          });
      }
    },
    removeItem(item) {
      this.editedIndex = item.id;
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      axios
        .delete(`payment_methods/${this.editedIndex}`, {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
            "X-localization": this.$i18n.locale,
          },
        })
        .then(() => this.emptyErrors())
        .catch((err) => console.log(err));
    },
    openModal() {
      if (this.userDetails["tax_number"] == null)
        this.$router.push("/invoice-settings");
      else this.dialog = true;
    },
    emptyErrors() {
      this.close();
      this.getData();
      this.errors = null;
    },
    close() {
      this.dialog = this.dialogDelete = false;
      this.editedItem = Object.assign({}, this.paymentMethod);
      this.editedIndex = -1;
    },
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t("paymentMethod"),
          align: "center",
          sortable: false,
          value: "name",
        },
        {
          text: this.$t("actions"),
          align: "center",
          sortable: false,
          value: "actions",
        },
      ];
    },
    getPaymentMethods() {
      if (this.$store.getters.getPaymentMethods)
        return this.$store.getters.getPaymentMethods;
      else return [];
    },
    marginThree() {
      return this.$i18n.locale == "en" ? "ml-3" : "mr-3";
    },
    marginTwo() {
      return this.$i18n.locale == "en" ? "ml-2" : "mr-2";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  mounted() {
    this.getData();
  },
};
</script>