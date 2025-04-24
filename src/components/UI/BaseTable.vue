<template>
    <v-data-table
      :headers="headers"
      :items="items"
      disable-sort
      height="60vh"
      fixed-header
      hide-default-footer
      mobile-breakpoint="0"
      :class="[$i18n.locale == 'en' ? 'eng-table' : '', 'mt-5 tableStriped']"
    >
      <template slot="no-data">{{ noItem }}</template>
      <template v-slot:top>
        <v-toolbar flat>
          <v-text-field
            prepend-inner-icon="search"
            color="#4fca9a"
            hide-details
            outlined
            class="search"
            v-model="searchKeyword"
            @input="search"
            :placeholder="$t('search')"
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="650px">
            <template v-slot:activator="{ on }">
              <v-btn
                dark
                color="#4FCA9A"
                height="35px"
                :class="[marginThree, 'add-btn']"
                v-on="on"
              >
                <v-icon color="white" size="29">add_box</v-icon
                ><span class="addText">{{ addButton }} </span>
              </v-btn>
            </template>
            <v-card class="d-flex justify-center align-center">
              <v-card-text>
                <v-container>
                  <base-form
                    :saveURL="storeURL"
                    :editURL="updateURL"
                    :items="items"
                    :editedIndex="editedIndex"
                    :editedItem="editedItem"
                    :fields="fields"
                    :refreshData="refreshData"
                    :close="close"
                  >
                    <template #fields>
                      <slot name="fields"></slot>
                    </template>
                  </base-form>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">تاكيد الحذف ؟</v-card-title>
              <v-card-actions>
                <v-btn color="#62C83F" class="rounded-lg white--text"
                  >تاكيد</v-btn
                >
                <v-btn color="#EF0B0B" class="rounded-lg white--text mr-2"
                  >الغاء</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template slot="item.actions">
        <slot name="extraActions"> </slot>
        <v-btn
          class="mr-2 actions rounded-lg"
          color="#2BB3B3"
          height="32"
          width="59"
          dark
          @click="editItem(item)"
          >{{ $t("edit") }}</v-btn
        >
        <v-btn
          class="mr-2 actions rounded-lg"
          color="#707070"
          height="32"
          width="52"
          dark
          @click="removeItem(item)"
          >{{ $t("delete") }}</v-btn
        >
      </template>
    </v-data-table>
</template>
<script>
import axios from "axios";
export default {
  props: [
    "URL",
    "storeURL",
    "updateURL",
    "headers",
    "noItem",
    "addButton",
    "fields",
    "default",
    "edited",
  ],
  data() {
    return {
      userDetails: null,
      searchKeyword: "",
      items: [],
      currentPage: 1,
      itemsPerPage: 10,
      pageCount: null,
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      defaultItem: { ...this.default },
      editedItem: { ...this.edited },
    };
  },
  methods: {
    getData() {
      this.userDetails = JSON.parse(localStorage.getItem("userDetails"));
      if (this.userDetails["market_name"] != null) {
        this.$store.dispatch("tax");
        axios
          .get(this.URL, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
          .then((res) => {
            this.items = res.data.data;
          })
          .catch((err) => {
            if (err.response.data.message == "Unauthenticated.")
              this.$store.dispatch("logout");
          });
      }
    },
    //get Index of editedItem
    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    //close CRUD dialog
    close() {
      this.dialog = false;
      this.dialogDelete = false;
      this.$refs.form.resetValidation();
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    refreshData() {
      this.getData();
      this.close();
      this.error = null;
    },
  },
  watch: {
    currentPage() {
      this.getData();
    },
  },
  created() {
    setTimeout(() => {
      this.getData();
    }, 200);
  },
};
</script>
<style scoped>
@import "../../assets/styles/style.css";
</style>
