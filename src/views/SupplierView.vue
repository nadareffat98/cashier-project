<template>
  <v-container class="mt-5">
    <h2>{{ $t("suppliers") }}</h2>
    <div class="d-flex justify-space-between align-center my-3">
      <v-icon color="#4FCA9A" size="25" class="icon"> search</v-icon>
      <input type="search" :placeholder="$t('search')" v-model="searchSupplier" @input="search" />
      <v-btn dark color="#4FCA9A" :class="[marginThree, 'add-btn']" @click="openModal">
        <v-icon color="white" size="29" :left="$i18n.locale == 'en'">add_box</v-icon>
        <span class="addText">{{ $t("addSupplier") }} </span>
      </v-btn>
    </div>
    <v-data-table :headers="headers" :items="suppliers" height="60vh" fixed-header hide-default-footer
      mobile-breakpoint="0" :class="[$i18n.locale == 'en' ? 'eng-table' : '', , 'mt-5 tableStriped']">
      <template slot="no-data"> {{ $t("noSuppliers") }}</template>
      <template slot="item.actions" slot-scope="{ item }">
        <v-btn class="actions" color="#2BB3B3" dark @click="editItem(item)">{{ $t("edit")
        }}</v-btn>
        <v-btn :class="[marginTwo, 'actions']" color="#E50D0D" dark @click="removeItem(item)" v-if="userType == 0">{{
          $t("delete") }}</v-btn>
      </template>
    </v-data-table>
    <div class="cards-responsive">
      <div v-if="suppliers.length == 0" class="no-data-container">
        <p>{{ $t("noSuppliers") }}</p>
      </div>
      <v-row v-else>
        <v-col v-for="supplier in suppliers" :key="supplier.id" cols="12" :sm="suppliers.length > 1 ? '6' : '12'" xs="12">
          <v-card class="mx-auto" outlined>
            <v-card-text class="d-flex flex-wrap justify-start align-center invoice-content-responsive"
              :class="suppliers.length > 1 ? 'button-responsive' : ''" style="gap:10px">
              <template v-for="header in headers">
                <div v-if="header.value != 'actions'" :key="header.value"
                  class="d-flex justify-start align-center pb-0" style="gap: 5px">
                  <span>{{ header.text }} :</span>
                  <p>{{ supplier[header.value] }}</p>
                </div>
                <div v-else class="d-flex justify-center" style="width: 100%;" :key="header.value">
                  <v-btn class="actions" color="#2BB3B3" @click="editItem(supplier)">{{ $t("edit")
                  }}</v-btn>
                  <v-btn :class="[marginTwo, 'actions']" color="#E50D0D" @click="removeItem(supplier)" v-if="userType == 0">{{
                    $t("delete") }}</v-btn>
                </div>
              </template>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <v-dialog v-model="dialog"  :max-width="$vuetify.breakpoint.width < 425 ? '100%' : '450px'" @click:outside="close">
      <v-card class="mx-auto" :style="$vuetify.breakpoint.width < 425 ? 'padding:0 ' : 'padding: 0 1.5rem'">
        <v-card-title class="justify-center card-title-container">{{
          editedIndex == -1 ? $t("addSupplier") : $t("edit")
        }}</v-card-title>
        <v-card-text>
          <v-form class="form-container" ref="form" lazy-validation>
            <div v-if="errors">
              <v-alert dense outlined type="error">
                {{ errors }}
              </v-alert>
            </div>
            <div>
              <label>{{ $t("supplierNameAr") }}</label>
              <v-text-field v-model="editedItem.name.ar" :placeholder="$t('supplierNameAr')" required
                :rules="requiredRule" color="#8F8F8F" outlined></v-text-field>
            </div>
            <div>
              <label>{{ $t("supplierNameEn") }}</label>
              <v-text-field v-model="editedItem.name.en" :placeholder="$t('supplierNameEn')" color="#8F8F8F"
                outlined></v-text-field>
            </div>
            <div>
              <label>{{ $t("phone") }}</label>
              <v-text-field v-model="editedItem.phone" :placeholder="$t('phone')" color="#8F8F8F" outlined
                :rules="[phoneRule]"></v-text-field>
            </div>
            <div>
              <label>{{ $t("taxNumber") }}</label>
              <v-text-field v-model="editedItem.tax_number" :placeholder="$t('taxNumber')" outlined
                color="#8F8F8F"></v-text-field>
            </div>
            <div>
              <label>{{ $t("address") }}</label>
              <v-text-field v-model="editedItem.address" :placeholder="$t('address')" outlined
                color="#8F8F8F"></v-text-field>
            </div>
            <div class="d-flex justify-center align-center">
              <v-btn color="#62C83F" dark @click="save" height="30" width="39%">
                {{ editedIndex == -1 ? $t("addNewSupplier") : $t("edit") }}
              </v-btn>
              <v-btn color="#EF0B0B" dark :class="marginTwo" @click="close" height="30" width="35%">
                {{ $t("cancel") }}
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <alert-dialog v-if="dialogDelete" @close="close" :close="close">
      <template #title> {{ $t("areYouSureDeleteSupplier") }} </template>
      <template #actions>
        <v-btn color="#62C83F" dark class="actions mb-2 ml-2" width="35%" @click="deleteItemConfirm">{{ $t("accept")
        }}</v-btn>
      </template>
    </alert-dialog>
    <alert-dialog v-if="serviceValidationDialog" @close="close" :close="close">
      <template #title> {{ $t("shouldUpgrade") }} </template>
      <template #default>
        <v-btn color="#4FCA9A" width="150" class="rounded-lg white--text" to="/subscriptions">{{ $t("updateNow")
        }}</v-btn>
        <v-btn color="#4FCA9A" width="150" :class="[marginTwo, 'rounded-lg white--text']" @click="close">{{ $t("notNow")
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
      dialog: false,
      dialogDelete: false,
      serviceValidationDialog: false,
      userType: "",
      meDetails: null,
      hidePass: true,
      editedIndex: -1,
      searchSupplier: "",
      errors: null,
      suppliers: [],
      editedItem: {
        name: {
          ar: "",
          en: "",
        },
        phone: "",
        tax_number: "",
        address: "",
      },
      requiredRule: [(v) => !!v || this.$t("fieldRequired")],
      phoneRule: (v) => {
        if (v && v.length >= 9 && v.length <= 11) return true;
        else
          return this.$t("phoneValidation");
      },
    };
  },
  methods: {
    search() {
      axios
        .get("suppliers", {
          params: { search: this.searchSupplier },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "X-localization": this.$i18n.locale,
          },
        })
        .then((res) => {
          const suppliers = res.data.suppliers;
          if (suppliers) {
            this.suppliers = suppliers;
          } else {
            this.getData();
          }
        })
        .catch((err) => console.log(err));
    },
    editItem(item) {
      this.editedIndex = this.suppliers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      delete this.editedItem.name;
      this.editedItem.name = Object.assign({}, item.name_json);
      this.dialog = true;
    },
    removeItem(item) {
      this.editedIndex = item.id;
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      axios
        .delete(`suppliers/${this.editedIndex}`, {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
            "X-localization": this.$i18n.locale,
          },
        })
        .then(() => this.emptyErrors())
        .catch((err) => console.log(err));
    },
    close() {
      this.dialog = this.dialogDelete = this.serviceValidationDialog = false;
      this.$refs.form.reset();
      this.editedIndex = -1;
    },
    save() {
      if (this.$refs.form.validate()) {
        if (this.editedIndex == -1) {
          axios
            .post("suppliers", this.editedItem, {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "X-localization": this.$i18n.locale,
              },
            })
            .then(() =>
              this.emptyErrors()
            )
            .catch((err) => {
              this.errors = err.response.data.message;
            });
        } else {
          const supplierID = this.suppliers[this.editedIndex].id;
          axios
            .put(`suppliers/${supplierID}`, this.editedItem, {
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
      }
    },
    openModal() {
      if (this.meDetails['is_subscribed'] && this.meDetails["subscription"]["suppliers"])
        this.dialog = true;
      else
        this.serviceValidationDialog = true;
    },
    getData() {
      this.meDetails = JSON.parse(localStorage.getItem('meDetails'))
      this.userType = this.meDetails['user_type']
      axios
        .get("suppliers", {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
            "X-localization": this.$i18n.locale,
          },
        })
        .then((res) => {
          this.suppliers = res.data.suppliers;
        })
        .catch((err) => {
          if (err.response.data.message == "Unauthenticated.")
            this.$store.dispatch("logout");
        });
    },
    emptyErrors() {
      this.close();
      this.getData();
      this.errors = null;
    },
  },
  mounted() {
    this.getData();
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t("supplierName"),
          align: "center",
          sortable: false,
          value: "name",
        },
        {
          text: this.$t("phone"),
          align: "center",
          sortable: false,
          value: "phone",
        },
        {
          text: this.$t("taxNumber"),
          align: "center",
          sortable: false,
          value: "tax_number",
        },
        {
          text: this.$t("address"),
          align: "center",
          sortable: false,
          value: "address",
        },
        {
          text: this.$t("actions"),
          align: "center",
          sortable: false,
          value: "actions",
        },
      ];
    },
    headersFilter() {
      return this.headers.filter((item) => {
        return item.value !== "actions";
      });
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
};
</script>
<style scoped>
@import "../assets/styles/style.css";
</style>
