<template>
  <v-data-table
    :headers="headers"
    :items="items"
    disable-sort
    height="60vh"
    fixed-header
    hide-default-footer
    mobile-breakpoint="0"
    :class="[
      $i18n.locale == 'en' ? 'eng-table' : '',
      ,
      'mt-5 tableStriped elevation-1',
    ]"
  >
    <template slot="no-data">{{ noItem }}</template>
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>
          <v-icon color="#4FCA9A" size="25" class="icon"> search</v-icon>
          <input
            type="search"
            :placeholder="$t('search')"
            v-model="searchKeyword"
            @input="search"
          />
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn
              dark
              color="#4FCA9A"
              height="35px"
              :class="[marginThree, 'add-btn']"
              v-on="on"
            >
              <v-icon color="white" size="29">add_box</v-icon
              ><span class="addText">{{ $t("addNewClient") }} </span>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.name"
                      label="Dessert name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.calories"
                      label="Calories"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.fat"
                      label="Fat (g)"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.carbs"
                      label="Carbs (g)"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.protein"
                      label="Protein (g)"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
              <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Are you sure you want to delete this item?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template slot="item.actions" slot-scope="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
  </v-data-table>
</template>
<script>
export default {
  props: ["URL", "headers", "noItem"],
  data() {
    return {
      userDetails: null,
      items: [],
      searchKeyword: "",
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: {
        name: "",
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
      defaultItem: {
        name: "",
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
    };
  },
  methods: {
    getData() {
      this.userDetails = JSON.parse(localStorage.getItem("userDetails"));
      if (this.userDetails["market_name"] != null) {
        axios
          .get(this.URL, {
            headers: {
              Authorization: "Bearer" + localStorage.getItem("token"),
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
  },
  mounted() {
    this.getData();
  },
};
</script>
