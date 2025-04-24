<template>
  <v-container class="mt-5">
    <h2>{{ $t("categories") }}</h2>
    <div class="d-flex justify-space-between align-center my-3">
      <v-icon color="#4FCA9A" size="25" class="icon"> search</v-icon>
      <input
        type="search"
        :placeholder="$t('search')"
        v-model="searchCategory"
        @input="search"
      />
      <v-btn
        dark
        color="#4FCA9A"
        :class="[marginThree, 'add-btn']"
        @click="dialog = true"
      >
        <v-icon color="white" size="29" :left="$i18n.locale == 'en'"
          >add_box</v-icon
        >
        <span class="addText">{{ $t("addCategory") }} </span>
      </v-btn>
    </div>
    <v-data-table
      :headers="headers"
      :items="categories"
      height="60vh"
      fixed-header
      hide-default-footer
      mobile-breakpoint="0"
      :class="[$i18n.locale == 'en' ? 'eng-table' : '', 'mt-3 tableStriped']"
    >
      <template slot="no-data"> {{ $t("noCategories") }}</template>
      <template slot="item.actions" slot-scope="{ item }">
        <v-btn
          :class="[marginTwo, 'actions rounded-lg']"
          color="#2BB3B3"
          dark
          @click="editItem(item)"
          >{{ $t("edit") }}</v-btn
        >
        <v-btn
          :class="[marginTwo, 'actions rounded-lg']"
          color="#E50D0D"
          dark
          @click="removeItem(item)"
          >{{ $t("delete") }}</v-btn
        >
      </template>
    </v-data-table>
    <div class="cards-responsive">
      <div v-if="categories.length == 0" class="no-data-container">
        <p>{{ $t("noCategories") }}</p>
      </div>
      <v-row v-else>
        <v-col
          v-for="category in categories"
          :key="category.id"
          cols="12"
          :sm="categories.length > 1 ? '6' : '12'"
          xs="12"
        >
          <v-card class="mx-auto" outlined>
            <v-card-text
              class="d-flex flex-wrap justify-start align-center invoice-content-responsive"
              :class="categories.length > 1 ? 'button-responsive' : ''"
              style="gap: 10px"
            >
              <template v-for="header in headers">
                <div
                  v-if="header.value != 'actions'"
                  :key="header.value"
                  class="d-flex justify-start align-center pb-0"
                  style="gap: 5px"
                >
                  <span>{{ header.text }} :</span>
                  <p>{{ category[header.value] }}</p>
                </div>
                <template v-else>
                  <div
                    class="d-flex justify-center"
                    style="width: 100%"
                    :key="header.value"
                  >
                    <v-btn
                      class="actions"
                      color="#2BB3B3"
                      @click="editItem(category)"
                      >{{ $t("edit") }}</v-btn
                    >
                    <v-btn
                      :class="[marginTwo, 'actions']"
                      color="#E50D0D"
                      @click="removeItem(category)"
                      >{{ $t("delete") }}</v-btn
                    >
                  </div>
                </template>
              </template>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <v-dialog
      v-model="dialog"
      :max-width="$vuetify.breakpoint.width < 425 ? '100%' : '450px'"
    >
      <v-card
        class="mx-auto"
        :style="
          $vuetify.breakpoint.width < 425 ? 'padding:0 ' : 'padding: 0 1.5rem'
        "
      >
        <v-card-title class="justify-center card-title-container">{{
          editedIndex == -1 ? $t("addCategory") : $t("edit")
        }}</v-card-title>
        <v-card-text>
          <div v-if="errors">
            <v-alert dense outlined type="error">
              {{ errors }}
            </v-alert>
          </div>
          <v-form class="form-container" lazy-validation ref="form">
            <div>
              <label>{{ $t("categoryNameAr") }}</label>
              <v-text-field
                v-model="editedItem.title.ar"
                :placeholder="$t('categoryNameAr')"
                color="#8F8F8F"
                outlined
                :rules="titleRules"
                required
              ></v-text-field>
            </div>
            <div>
              <label>{{ $t("categoryNameEn") }}</label>
              <v-text-field
                v-model="editedItem.title.en"
                :placeholder="$t('categoryNameEn')"
                color="#8F8F8F"
                outlined
              ></v-text-field>
            </div>
            <div>
              <label>{{ $t("description") }}</label>
              <v-text-field
                v-model="editedItem.description"
                :placeholder="$t('description')"
                color="#8F8F8F"
                outlined
              ></v-text-field>
            </div>
            <div class="d-flex justify-center align-center">
              <v-btn
                color="#62C83F"
                class="white--text"
                @click="save"
                height="30"
                width="40%"
              >
                {{ editedIndex == -1 ? $t("addNewCategory") : $t("edit") }}
              </v-btn>
              <v-btn
                color="#EF0B0B"
                :class="[marginTwo, 'white--text']"
                @click="close"
                height="30"
                width="40%"
              >
                {{ $t("cancel") }}
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <alert-dialog v-if="dialogDelete" @close="close" :close="close">
      <template #title> {{ $t("areYouSureDeleteCategory") }} </template>
      <template #actions>
        <v-btn
          color="#62C83F"
          width="35%"
          class="actions mb-2 ml-2"
          dark
          @click="deleteItemConfirm"
          >{{ $t("accept") }}</v-btn
        >
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
      searchCategory: "",
      categories: [],
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      errors: null,
      editedItem: {
        title: {
          ar: "",
          en: "",
        },
        description: "",
      },
      defaultItem: {
        title: {
          ar: "",
          en: "",
        },
        description: "",
      },
      titleRules: [(v) => !!v || this.$t("fieldRequired")],
    };
  },
  methods: {
    getData() {
      this.userDetails = JSON.parse(localStorage.getItem("userDetails"));
      if (this.userDetails["market_name"] != null) {
        axios
          .get("categories", {
            headers: {
              Authorization: "Bearer" + localStorage.getItem("token"),
              "X-localization": this.$i18n.locale,
            },
          })
          .then((res) => (this.categories = res.data.categories.data))
          .catch((err) => {
            if (err.response.data.message == "Unauthenticated.")
              this.$store.dispatch("logout");
          });
      }
    },
    search() {
      axios
        .get("categories", {
          params: { search: this.searchCategory },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "X-localization": this.$i18n.locale,
          },
        })
        .then((res) => {
          const searchCategories = res.data.categories.data;
          if (searchCategories) {
            this.categories = searchCategories;
          } else {
            this.getData();
          }
        })
        .catch((err) => console.log(err));
    },
    save() {
      if (this.$refs.form.validate()) {
        if (this.editedIndex == -1) {
          axios
            .post("categories", this.editedItem, {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "X-localization": this.$i18n.locale,
              },
            })
            .then(() => this.emptyErrors())
            .catch((err) => {
              this.errors = err.response.data.message;
            });
        } else {
          const categoryID = this.categories[this.editedIndex].id;
          axios
            .post(`categories/${categoryID}`, this.editedItem, {
              params: { _method: "patch" },
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "X-localization": this.$i18n.locale,
                "content-type": "multipart/form-data",
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
    editItem(item) {
      this.editedIndex = this.categories.indexOf(item);
      this.editedItem = Object.assign({}, item);
      delete this.editedItem.title;
      this.editedItem.title = this.editedItem.title_json;
      this.dialog = true;
    },
    removeItem(item) {
      this.editedIndex = item.id;
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      axios
        .delete(`categories/${this.editedIndex}`, {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
            "X-localization": this.$i18n.locale,
          },
        })
        .then(() => this.emptyErrors())
        .catch((err) => console.log(err));
    },
    emptyErrors() {
      this.close();
      this.getData();
      this.errors = null;
    },
    close() {
      this.dialog = false;
      this.dialogDelete = false;
      this.$refs.form.reset();
      this.editedIndex = -1;
    },
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t("categoryName"),
          align: "center",
          sortable: false,
          value: "title",
        },
        {
          text: this.$t("description"),
          align: "center",
          sortable: false,
          value: "description",
        },
        {
          text: this.$t("actions"),
          align: "center",
          sortable: false,
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
