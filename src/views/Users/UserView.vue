<template>
  <v-container class="mt-5">
    <div
      class="d-flex justify-space-between align-center user-container mb-2"
      v-if="meDetails && meDetails['subscription'] != null"
    >
      <p class="mb-0">
        {{ $t("primaryUser") }} :
        <span> {{ meDetails["subscription"]["package_employee_count"] }} </span>
      </p>
      <p class="mb-0">
        {{ $t("addedUser") }} :
        <span>{{ meDetails["subscription"]["extra_employee_count"] }}</span>
      </p>
    </div>
    <h2>{{ $t("users") }}</h2>
    <div class="d-flex justify-space-between align-center my-3">
      <v-icon color="#4FCA9A" size="25" class="icon"> search</v-icon>
      <input
        type="search"
        :placeholder="$t('search')"
        v-model="searchUser"
        @input="search"
      />
      <v-btn
        dark
        color="#4FCA9A"
        height="35px"
        :class="[marginThree, 'add-btn']"
        @click="goToPermission(-1)"
      >
        <v-icon
          color="white"
          size="29"
          :left="$i18n.locale == 'en' && $vuetify.breakpoint.width > 766"
          >add_box</v-icon
        >
        <span class="addText">{{ $t("addUser") }} </span>
      </v-btn>
    </div>
    <v-data-table
      :headers="headers"
      :items="users"
      height="60vh"
      fixed-header
      hide-default-footer
      mobile-breakpoint="0"
      :class="[$i18n.locale == 'en' ? 'eng-table' : '', , 'mt-5 tableStriped']"
    >
      <template slot="no-data"> {{ $t("noUsers") }}</template>
      <template slot="item.actions" slot-scope="{ item }">
        <v-btn
          :class="[marginTwo, 'actions']"
          color="#2BB3B3"
          height="32"
          width="59"
          dark
          @click="goToPermission(item.id)"
          >{{ $t("edit") }}</v-btn
        >
        <v-btn
          :class="[marginTwo, 'actions']"
          color="#E50D0D"
          dark
          @click="removeItem(item)"
          >{{ $t("delete") }}</v-btn
        >
      </template>
    </v-data-table>
    <div class="cards-responsive">
      <div v-if="users.length == 0" class="no-data-container">
        <p>{{ $t("noUsers") }}</p>
      </div>
      <v-row v-else>
        <v-col
          v-for="user in users"
          :key="user.id"
          cols="12"
          :sm="users.length > 1 ? '6' : '12'"
          xs="12"
        >
          <v-card class="mx-auto" outlined>
            <v-card-text
              class="d-flex flex-wrap justify-start align-center invoice-content-responsive"
              :class="users.length > 1 ? 'button-responsive' : ''"
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
                  <p>{{ user[header.value] }}</p>
                </div>
                <template v-else>
                  <div
                    class="d-flex justify-center"
                    style="width: 100%"
                    :key="header.value"
                  >
                    <v-btn
                      :class="[marginTwo, 'actions']"
                      color="#707070"
                      dark
                      @click="goToPermission(user.id)"
                      >{{ $t("permissions") }}</v-btn
                    >
                    <v-btn
                      :class="[marginTwo, 'actions']"
                      color="#2BB3B3"
                      dark
                      @click="goToPermission(user.id)"
                      >{{ $t("edit") }}</v-btn
                    >
                    <v-btn
                      :class="[marginTwo, 'actions']"
                      color="#E50D0D"
                      dark
                      @click="removeItem(user)"
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
    <alert-dialog v-if="dialogDelete" @close="close" :close="close">
      <template #title> {{ $t("areYouSureDeleteUser") }} </template>
      <template #actions>
        <v-btn
          color="#62C83F"
          dark
          class="actions mb-2 ml-2"
          width="35%"
          @click="deleteItemConfirm"
          >{{ $t("accept") }}</v-btn
        >
      </template>
    </alert-dialog>
    <alert-dialog v-if="warningAddDialog" :close="close">
      <template #title v-if="warningMessage">
        {{ warningMessage }}
      </template>
      <template #default>
        <div class="d-flex flex-column justify-center align-center">
          <v-btn
            color="#4FCA9A"
            width="200"
            class="rounded-lg white--text"
            to="/subscriptions"
            v-if="updateButton"
            >{{ $t("upgradePackedge") }}</v-btn
          >
          <v-btn
            color="#4FCA9A"
            class="rounded-lg white--text mt-5"
            @click="purchaseNewUser"
            v-if="addButton && meDetails && meDetails['subscription'] != null"
            >{{ $t("buyNewUser") }}</v-btn
          >
        </div>
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
      meDetails: null,
      dialog: false,
      dialogDelete: false,
      warningAddDialog: false,
      permissionsDialog: false,
      updateButton: true,
      addButton: true,
      hidePass: true,
      editedIndex: -1,
      searchUser: "",
      errors: null,
      users: [],
    };
  },
  methods: {
    getData() {
      localStorage.removeItem("paymentTitle");
      this.meDetails = JSON.parse(localStorage.getItem("meDetails"));
      this.userDetails = JSON.parse(localStorage.getItem("userDetails"));
      if (this.userDetails["market_name"] != null) {
        this.getEmployess();
      }
    },
    getEmployess() {
      axios
        .get("employee")
        .then((res) => {
          this.users = res.data.employees;
          console.log(this.users);
          this.$store.dispatch("tax");
        })
        .catch((err) => {
          if (err.response.data.message == "Unauthenticated.")
            this.$store.dispatch("logout");
        });
    },
    search() {
      axios
        .get("employee", {
          params: { search: this.searchUser },
        })
        .then((res) => {
          const users = res.data.employees;
          if (users) {
            this.users = users;
          } else {
            this.getData();
          }
        })
        .catch((err) => console.log(err));
    },
    removeItem(item) {
      this.editedIndex = item.id;
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      axios
        .delete(`employee/${this.editedIndex}`)
        .then(() => this.emptyErrors())
        .catch((err) => console.log(err));
    },
    goToPermission(userId) {
      if (userId == -1) {
        if (this.meDetails["is_subscribed"] == true) {
          if (
            this.users.length >=
              this.meDetails["subscription"]["employee_count"] ||
            this.meDetails["subscription"]["employee_count"] == 0
          ) {
            if (this.meDetails["higher_packages"] == 0)
              this.updateButton = false;
            else this.updateButton = true;
            this.warningAddDialog = true;
          } else this.goToRoute(userId);
        } else if (this.meDetails["subscription"] == null)
          this.warningAddDialog = true;
        else this.goToRoute(userId);
      } else {
        this.goToRoute(userId);
      }
    },
    goToRoute(userId) {
      this.$router.push({
        name: "add-edit-user",
        params: {
          userId: userId,
        },
      });
    },
    emptyErrors() {
      this.getData();
      this.close();
      this.errors = null;
    },
    close() {
      this.dialog = false;
      this.dialogDelete = false;
      this.warningAddDialog = false;
      this.permissionsDialog = false;
      this.$refs.form.reset();
      this.editedIndex = -1;
    },
    purchaseNewUser() {
      localStorage.setItem("paymentTitle", "buyUser");
      this.$router.push({
        name: "payment",
        params: {
          title: "buyUser",
        },
      });
    },
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t("username"),
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
          text: this.$t("emailHint"),
          align: "center",
          sortable: false,
          value: "email",
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
    getUserPrice() {
      return this.$store.getters.getUserPrice;
    },
    warningMessage() {
      if (this.meDetails != null) {
        if (this.meDetails["subscription"] == null) return this.$t("subscribe");
        else if (this.meDetails["higher_packages"] == 0)
          return (
            this.$t("addEmployeeLimit") + this.getUserPrice + this.$t("SRmini")
          );
        else
          return (
            this.$t("newEmplyeesLimit") + this.getUserPrice + this.$t("SRmini")
          );
      } else return "";
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
@import "@/assets/styles/style.css";

.user-container p {
  font-family: "BahjiiBold";
}

.user-container span {
  font-family: "BahjiiSemiBold";
}

.form-container :deep(.v-input__append-inner) {
  margin-top: 8px !important;
}

.form-container :deep(.v-input__append-inner button) {
  font-size: 20px !important;
}

@media (min-width: 1024px) {
  .tableStriped {
    display: block;
  }

  .user-responsive {
    display: none;
  }
}

@media (max-width: 1023px) {
  .tableStriped {
    display: none;
  }

  .user-responsive {
    display: block;
  }
}

@media (max-width: 330px) {
  .user-container {
    flex-direction: column !important;
  }

  :deep(.v-pagination) {
    flex-wrap: wrap;
  }

  :deep(.v-pagination__navigation) {
    width: 50px !important;
  }
}
</style>
