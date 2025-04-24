<template>
  <v-container class="mt-5">
    <h2>{{ $t("clients") }}</h2>
    <div class="d-flex justify-space-between align-center my-3">
      <v-icon color="#4FCA9A" size="25" class="icon"> search</v-icon>
      <input type="search" :placeholder="$t('search')" v-model="searchCustomer" @input="search" />
      <v-btn dark color="#4FCA9A" :class="[marginThree, 'add-btn']" @click="dialog = true">
        <v-icon color="white" size="29" :left="$i18n.locale == 'en'">add_box</v-icon><span class="addText">{{
          $t("addNewClient") }} </span>
      </v-btn>
    </div>
    <v-data-table :headers="headers" :items="customers" disable-sort height="70vh" fixed-header disable-pagination
      hide-default-footer :class="[$i18n.locale == 'en' ? 'eng-table' : '', , 'mt-5 tableStriped']">
      <template slot="no-data">{{ $t("noClients") }}</template>
      <template slot="item.actions" slot-scope="{ item }">
        <v-btn class="actions" color="#2BB3B3" dark @click="editItem(item)">{{ $t("edit")
        }}</v-btn>
        <v-btn :class="[marginTwo, 'actions']" color="#E50D0D" dark @click="removeItem(item)">{{ $t("delete")
        }}</v-btn>
      </template>
    </v-data-table>
    <div class="cards-responsive">
      <div v-if="customers.length == 0" class="no-data-container">
        <p>{{ $t("noClients") }}</p>
      </div>
      <v-row v-else>
        <v-col v-for="customer in customers" :key="customer.id" cols="12" :sm="customers.length > 1 ? '6' : '12'" xs="12">
          <v-card class="mx-auto" outlined>
            <v-card-text class="d-flex flex-wrap justify-start align-center invoice-content-responsive"
              :class="customers.length > 1 ? 'button-responsive' : ''" style="gap:10px">
              <template v-for="header in headers">
                <div v-if="header.value != 'actions'" :key="header.value" class="d-flex justify-start align-center pb-0"
                  style="gap: 5px">
                  <span>{{ header.text }} :</span>
                  <p>{{ customer[header.value] }}</p>
                </div>
                <div v-else class="d-flex justify-center" style="width: 100%;" :key="header.value">
                  <v-btn class="actions" color="#2BB3B3" @click="editItem(customer)">{{
                    $t("edit") }}</v-btn>
                  <v-btn :class="[marginTwo, 'actions']" color="#E50D0D" @click="removeItem(customer)">{{
                    $t("delete") }}</v-btn>
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
          editedIndex == -1 ? $t("addClient") : $t("edit")
        }}</v-card-title>
        <v-card-text>
          <v-form class="form-container" ref="form" lazy-validation>
            <div>
              <label>{{ $t("clientNameAr") }}</label>
              <v-text-field v-model="editedItem.name.ar" :placeholder="$t('clientNameAr')" :rules="requiredRule"
                color="#8F8F8F" outlined required></v-text-field>
            </div>
            <div>
              <label>{{ $t("clientNameEn") }}</label>
              <v-text-field v-model="editedItem.name.en" :placeholder="$t('clientNameEn')" color="#8F8F8F"
                outlined></v-text-field>
            </div>
            <div>
              <label>{{ $t("phone") }}</label>
              <v-text-field v-model="editedItem.phone" :placeholder="$t('phone')" color="#8F8F8F" outlined
                :rules="[phoneRule]"></v-text-field>
            </div>
            <div>
              <label>{{ $t("address") }}</label>
              <v-text-field v-model="editedItem['address']" :placeholder="$t('address')" color="#8F8F8F"
                outlined></v-text-field>
            </div>
            <div>
              <label>{{ $t("taxNumber") }} </label>
              <v-text-field v-model="editedItem['tax_number']" :placeholder="$t('taxNumber')" :rules="[taxNumber]"
                color="#8F8F8F" outlined></v-text-field>
            </div>
            <div class="d-flex justify-center align-center">
              <v-btn color="#62C83F" class="white--text" @click="save" height="30" width="35%">
                {{ editedIndex == -1 ? $t("addClient") : $t("edit") }}
              </v-btn>
              <v-btn color="#EF0B0B" :class="[marginTwo, 'white--text']" @click="close" height="30" width="35%">
                {{ $t("cancel") }}
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <alert-dialog v-if="successModal" @close="close" :close="close" :buttonName="$t('done')" color="#62C83F">
      <template #title>
        {{ $t("doneSuccessfuly") }}
      </template>
    </alert-dialog>
    <alert-dialog v-if="dialogDelete" @close="close" :close="close">
      <template #title> {{ $t("areYouSureDeleteClient") }} </template>
      <template #actions>
        <v-btn color="#62C83F" dark width="35%" class="actions mb-2 ml-2" @click="deleteItemConfirm">{{
          $t("accept")
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
      dialog: false,
      dialogDelete: false,
      successModal: false,
      searchCustomer: "",
      editedIndex: -1,
      customers: [],
      editedItem: {
        name: {
          ar: "",
          en: "",
        },
        phone: "",
        address: "",
        tax_number: "",
      },
      taxNumber: (v) => {
        if ((!v && v.length == 0) || (v && v.length === 15)) return true;
        return this.$t("taxNumberValidation");
      },
      phoneRule: (v) => {
        if (v) {
          if (v.length >= 9 && v.length <= 11) return true;
          else
            return this.$t("phoneValidation");
        }
      },
      requiredRule: [(v) => !!v || this.$t("fieldRequired")],
      error: null,
    };
  },
  methods: {
    search() {
      axios
        .get("getClient", {
          params: { search: this.searchCustomer },
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
            "X-localization": this.$i18n.locale,
          },
        })
        .then((res) => {
          const customers = res.data.data;
          if (customers) {
            this.customers = customers;
          } else {
            this.getData();
          }
        })
        .catch((err) => console.log(err));
    },
    editItem(item) {
      this.editedIndex = this.customers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      delete this.editedItem.name;
      this.editedItem.name = Object.assign({}, item.name_json);
      this.dialog = true;
    },
    removeItem(item) {
      console.log(item.id)
      this.editedIndex = item.id;
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      axios
        .delete(`destroyClient/${this.editedIndex}`, {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
            "X-localization": this.$i18n.locale,
          },
        })
        .then(() => {
          this.getData();
          this.close();
        })
        .catch((err) => console.log(err));
    },
    close() {
      this.dialog = this.dialogDelete = this.successModal = false;
      this.$refs.form.reset();
      this.editedIndex = -1;
    },
    save() {
      if (this.$refs.form.validate()) {
        if (this.editedIndex == -1) {
          axios
            .post("setClient", this.editedItem, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "X-localization": this.$i18n.locale,
              },
            })
            .then(() => {
              this.getData();
              this.close();
              this.successModal = true;
            })
            .catch((err) => (this.error = err.response.data.message));
          this.value = "add";
        } else {
          const customerID = this.customers[this.editedIndex].id;
          axios
            .put(
              `editClient/${customerID}`,
              {
                phone: this.editedItem.phone,
                name: this.editedItem.name,
                address: this.editedItem.address,
                tax_number: this.editedItem.tax_number,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                  "X-localization": this.$i18n.locale,
                },
              }
            )
            .then(() => {
              this.getData();
              this.close();
              this.successModal = true;
            })
            .catch((err) => console.log(err));
          this.value = "edit";
        }
      }
    },
    getData() {
      this.userDetails = JSON.parse(localStorage.getItem("userDetails"));
      if (this.userDetails["market_name"] != null) {
        axios
          .get("getClient", {
            headers: {
              Authorization: "Bearer" + localStorage.getItem("token"),
              "X-localization": this.$i18n.locale,
            },
          })
          .then((res) => {
            this.customers = res.data.data;
          })
          .catch((err) => {
            if (err.response.data.message == "Unauthenticated.")
              this.$store.dispatch("logout");
          });
      }
    },
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t("clientName"),
          align: "center",
          value: "name",
        },
        {
          text: this.$t("phone"),
          align: "center",
          value: "phone",
        },
        {
          text: this.$t("address"),
          align: "center",
          value: "address",
        },
        {
          text: this.$t("taxNumber"),
          align: "center",
          value: "tax_number",
        },
        {
          text: this.$t("actions"),
          align: "center",
          value: "actions",
        },
      ];
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
<style scoped>
@import "../assets/styles/style.css";
</style>
