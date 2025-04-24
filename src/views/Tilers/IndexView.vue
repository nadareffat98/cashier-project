<template>
  <v-container class="mt-5">
    <h2>{{ $t("tilers") }}</h2>
    <div class="d-flex justify-end align-center my-5">
      <v-btn dark color="#4FCA9A" @click="addTiler" class="add-button">
        <v-icon color="white" size="29" :left="$i18n.locale == 'en'"
          >add_box</v-icon
        >
        <span class="addText">{{ $t("addTiler") }} </span>
      </v-btn>
    </div>
    <v-row>
      <v-col
        cols="12"
        md="3"
        sm="4"
        xs="6"
        v-for="tiler in tilers"
        :key="tiler.id"
      >
        <v-card class="mx-auto tiler-container">
          <v-card-title class="justify-end py-0 px-0">
            <v-menu offset-y class="tiler-menu">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon size="21">mdi-dots-vertical</v-icon></v-btn
                >
              </template>
              <v-list>
                <v-list-item
                  style="
                    min-height: 35px !important;
                    padding: 0 16px !important;
                  "
                  @click="editItem(tiler)"
                  v-if="(is_user && haveEditPermission) || !is_user"
                >
                  <v-list-item-title
                    class="d-flex justify-space-between align-center"
                    >{{ " " + $t("edit") }}
                    <v-btn icon>
                      <v-icon size="20">mdi-pencil-outline</v-icon>
                    </v-btn></v-list-item-title
                  >
                </v-list-item>
                <v-list-item
                  :disabled="
                    meDetails['open_shift'] != null || tiler.status == 'open'
                  "
                  style="
                    min-height: 35px !important;
                    padding: 0 16px !important;
                  "
                  @click="openStartDialog(tiler)"
                >
                  <v-list-item-title
                    class="d-flex justify-space-between align-center"
                    >{{ " " + $t("startShift") }}
                    <v-btn
                      icon
                      :disabled="
                        meDetails['open_shift'] != null ||
                        tiler.status == 'open'
                      "
                    >
                      <v-icon size="20">mdi-arrow-up-bold-outline</v-icon>
                    </v-btn></v-list-item-title
                  >
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-title>
          <v-card-text class="tiler-text">
            <p class="tiler-name mb-2">
              {{ $t("tilerName") }} : {{ tiler.name }}
            </p>
            <v-divider style="width: 100%"></v-divider>
            <span class="tiler-status my-2"
              >{{ $t("status") }} : {{ $t(tiler.status) }}</span
            >
            <v-divider style="width: 100%" v-if="!is_user"></v-divider>

            <span class="tiler-availability my-1" v-if="!is_user"
              >{{ $t("allowedForUse") }} :
              {{ tiler.allowed_for_use ? $t("yes") : $t("no") }}</span
            >
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions
            class="tiler-actions"
            :style="$i18n.locale == 'en' ? 'direction:rtl' : 'direction:ltr'"
            v-if="!is_user"
          >
            <v-btn icon @click="openEmpModal(tiler)">
              <v-icon color="black" size="21"
                >mdi-account-plus-outline</v-icon
              ></v-btn
            >
            <v-switch
              v-model="tiler.allowed_for_use"
              color="success"
              hide-details
              class="mt-0"
              @click="toggleAllowedForUse(tiler)"
              :style="$i18n.locale == 'en' ? 'direction:ltr' : 'direction:rlt'"
            ></v-switch>
            <v-btn icon @click="goToTiler(tiler)">
              <v-icon color="black" size="21">mdi-text-box-outline</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <!------------------- dialog for add or remove employees  ------------------->
    <v-dialog
      v-model="selectEmployeeDialog"
      :max-width="$vuetify.breakpoint.width < 425 ? '100%' : '450px'"
    >
      <v-card
        class="mx-auto"
        :style="
          $vuetify.breakpoint.width < 425
            ? 'padding:0 0.8rem'
            : 'padding: 0 1.5rem'
        "
      >
        <v-card-title
          class="d-flex justify-space-between align-center pb-1 card-title-container"
          >{{ $t("tilerEmployees") }}
          <v-icon color="black" @click="close" size="22"
            >mdi-close</v-icon
          ></v-card-title
        >
        <v-divider></v-divider>
        <v-card-text class="mt-2">
          <v-form
            class="form-container"
            style="gap: 15px"
            @submit.prevent="addOrRemoveEmployees"
          >
            <div v-if="error">
              <v-alert dense outlined type="error">
                {{ error }}
              </v-alert>
            </div>
            <label>{{ $t("employees") }}</label>
            <v-autocomplete
              :items="employeesOfTiler"
              v-model="selectedEmps"
              item-text="name"
              item-value="id"
              outlined
              color="#8F8F8F"
              small-chips
              multiple
              :placeholder="$t('selectEmployee')"
              ref="autocomplete"
              hide-details
            >
              <template #append-item>
                <v-divider></v-divider>
                <div
                  style="width: 100%; padding: 10px 10px 0"
                  class="d-flex justify-center align-center"
                >
                  <v-btn
                    color="#4fca9a"
                    dark
                    @click="$refs.autocomplete.isMenuActive = false"
                    style="width: 80%; height: 30px"
                    >{{ $t("done") }}</v-btn
                  >
                </div>
              </template>
            </v-autocomplete>
            <div class="d-flex justify-center align-center mt-2">
              <v-btn
                color="#4FCA9A"
                width="40%"
                class="white--text"
                @click="addOrRemoveEmployees"
              >
                {{ $t("select") }}
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!------------ add new tiler or edit it   ----------------->
    <v-dialog
      v-model="createOrEditTilerDialog"
      :max-width="$vuetify.breakpoint.width < 425 ? '100%' : '450px'"
    >
      <v-card
        class="mx-auto"
        :style="
          $vuetify.breakpoint.width < 425 ? 'padding:0 ' : 'padding: 0 1.5rem'
        "
      >
        <v-card-title class="justify-center card-title-container">{{
          editedIndex == -1 ? $t("addTiler") : $t("edit")
        }}</v-card-title>
        <v-card-text>
          <div v-if="error">
            <v-alert dense outlined type="error">
              {{ error }}
            </v-alert>
          </div>
          <v-form class="form-container">
            <div>
              <label>{{ $t("tilerNameAr") }}</label>
              <v-text-field
                v-model="editedTiler.name.ar"
                :placeholder="$t('tilerNameAr')"
                color="#8F8F8F"
                outlined
                required
              ></v-text-field>
            </div>
            <div>
              <label>{{ $t("tilerNameEn") }}</label>
              <v-text-field
                v-model="editedTiler.name.en"
                :placeholder="$t('tilerNameEn')"
                color="#8F8F8F"
                outlined
                required
              ></v-text-field>
            </div>
            <div
              v-if="editedIndex == -1"
              class="d-flex justify-space-around align-center"
            >
              <label>{{ $t("allowedForUse") }}</label>
              <v-switch
                v-model="editedTiler.allowed_for_use"
                color="#62C83F"
                class="mt-0 pt-0"
                hide-details
                :style="
                  $i18n.locale == 'en' ? 'direction:rtl' : 'direction:ltr'
                "
              ></v-switch>
            </div>
            <div class="d-flex justify-center align-center mt-2">
              <v-btn
                color="#62C83F"
                class="white--text"
                @click="save"
                height="30"
                width="35%"
              >
                {{ editedIndex == -1 ? $t("addTiler") : $t("edit") }}
              </v-btn>
              <v-btn
                color="#EF0B0B"
                :class="[marginTwo, 'white--text']"
                @click="close"
                height="30"
                width="35%"
              >
                {{ $t("cancel") }}
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-------------------- start shift ------------------>
    <v-dialog
      v-model="shiftDialog"
      :max-width="$vuetify.breakpoint.width < 425 ? '100%' : '450px'"
    >
      <v-card
        class="mx-auto"
        :style="
          $vuetify.breakpoint.width < 425
            ? 'padding:0 0.8rem'
            : 'padding: 0 1.5rem'
        "
      >
        <v-card-title
          class="d-flex justify-space-between align-center pb-1 card-title-container"
          >{{ $t("startShift") }}
          <v-icon color="black" @click="close" size="22"
            >mdi-close</v-icon
          ></v-card-title
        >
        <v-divider></v-divider>
        <v-card-text class="mt-2">
          <v-form
            class="form-container"
            style="gap: 15px"
            @submit.prevent="startShift"
          >
            <div v-if="error">
              <v-alert dense outlined type="error">
                {{ error }}
              </v-alert>
            </div>
            <label>{{ $t("startShiftCash") }}</label>
            <v-text-field
              v-model="startShiftCash"
              outlined
              color="#D2D2D2"
              :placeholder="$t('startShiftCash')"
            ></v-text-field>
            <div class="d-flex justify-center align-center">
              <v-btn
                color="#4FCA9A"
                width="40%"
                class="white--text"
                @click="startShift"
              >
                {{ $t("startShift") }}
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <alert-dialog
      v-if="acceptDialog"
      :buttonName="$t('done')"
      color="#62C83F"
      :close="close"
      @close="close"
    >
      <template #title> {{ message }} </template>
    </alert-dialog>
    <alert-dialog
      v-if="warningDialog"
      :buttonName="$t('done')"
      color="#4fca9a"
      :close="() => (warningDialog = false)"
      @close="warningDialog = false"
    >
      <template #title>
        {{ message }}
      </template>
    </alert-dialog>
  </v-container>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      searchTiler: null,
      meDetails: null,
      tilers: [],
      employeesOfTiler: [],
      selectedEmps: [],
      selectedTiler: null,
      tiler: {
        name: {
          ar: "",
          en: "",
        },
        allowed_for_use: false,
      },
      editedTiler: {
        name: {
          ar: "",
          en: "",
        },
        allowed_for_use: false,
      },
      editedIndex: -1,
      startShiftCash: 0,
      selectEmployeeDialog: false,
      createOrEditTilerDialog: false,
      acceptDialog: false,
      deleteDialog: false,
      shiftDialog: false,
      warningDialog: false,
      message: null,
      error: null,
      is_user: false,
    };
  },
  methods: {
    setData() {
      this.$store.dispatch("employees");
      this.getData();
    },
    getData() {
      this.meDetails = JSON.parse(localStorage.getItem("meDetails"));
      if (this.meDetails["user_type"] == 1) {
        this.is_user = true;
        axios
          .get(`available_tilers`, {
            params: {
              employee_id: [this.meDetails["id"]],
            },
            headers: {
              Authorization: "Bearer" + localStorage.getItem("token"),
              "X-localization": this.$i18n.locale,
            },
          })
          .then((res) => {
            this.tilers = res.data.data;
          })
          .catch((err) => console.log(err));
      } else {
        axios
          .get("tilers", {
            headers: {
              Authorization: "Bearer" + localStorage.getItem("token"),
              "X-localization": this.$i18n.locale,
            },
          })
          .then((res) => {
            this.tilers = res.data.data;
          })
          .catch((err) => console.log(err));
      }
    },
    addTiler() {
      if (
        this.is_user &&
        !this.meDetails.employee_permissions.includes("tilers-add")
      ) {
        this.message = this.$t("haveNoPermissionAddTiler");
        this.warningDialog = true;
        return;
      } else this.createOrEditTilerDialog = true;
    },
    openStartDialog(tiler) {
      this.editedTiler = tiler;
      this.shiftDialog = true;
    },
    // open dialog for edit tiler
    editItem(tiler) {
      this.editedIndex = this.tilers.indexOf(tiler);
      this.editedTiler = Object.assign({}, tiler);
      this.editedTiler.name = tiler.name_json;
      this.createOrEditTilerDialog = true;
    },
    // create or edit tiler
    save() {
      if (this.editedIndex == -1)
        axios
          .post("tilers", this.editedTiler, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "X-localization": this.$i18n.locale,
            },
          })
          .then(() => {
            this.getData();
            this.close();
          })
          .catch((err) => (this.error = err.response.data.message));
      else
        axios
          .put(`tilers/${this.editedTiler.id}`, this.editedTiler, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "X-localization": this.$i18n.locale,
            },
          })
          .then(() => {
            this.getData();
            this.close();
          })
          .catch((err) => (this.error = err.response.data.message));
    },
    startShift() {
      axios
        .post(
          "shifts/start-shift",
          {
            tiler_id: this.editedTiler.id,
            cash_at_check_in: this.startShiftCash,
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "X-localization": this.$i18n.locale,
            },
          }
        )
        .then(() => {
          this.$store.dispatch("meDetail");
        })
        .catch((err) => (this.error = err.response.data.message));
    },
    //open modal to add or remove employees of tiler
    openEmpModal(tiler) {
      axios
        .get(`tilers/${tiler.id}`, {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
            "X-localization": this.$i18n.locale,
          },
        })
        .then((res) => {
          this.employeesOfTiler = this.getEmployees;
          this.selectedEmps = res.data.data.employees;
          this.selectedTiler = tiler;
          this.selectEmployeeDialog = true;
        })
        .catch((err) => console.log(err));
    },
    // add or remove employees from tiler
    addOrRemoveEmployees() {
      if (this.selectedEmps.every((item) => typeof item === "object"))
        this.selectedEmps = this.selectedEmps.map((emp) => emp.id);
      axios
        .put(
          `tilers/${this.selectedTiler.id}/update_allowed_employees`,
          { employee_id: this.selectedEmps },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "X-localization": this.$i18n.locale,
            },
          }
        )
        .then(() => this.close())
        .catch((err) => (this.error = err.response.data.message));
    },
    toggleAllowedForUse(tiler) {
      axios
        .put(
          `tilers/${tiler.id}/toggle_allowed_for_use`,
          {
            allowed_for_use: tiler.allowed_for_use,
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "X-localization": this.$i18n.locale,
            },
          }
        )
        .then(() => {
          this.acceptDialog = true;
          this.message = this.$t("doneSuccessfuly");
          this.getData();
        })
        .catch((err) => {
          this.getData();
          this.acceptDialog = true;
          this.message = err.response.data.message;
        });
    },
    // go to page of information of specific tiler
    goToTiler(tiler) {
      this.$router.push({
        name: "tilersList",
        params: {
          tilerId: tiler.id,
        },
      });
    },
    close() {
      this.acceptDialog = false;
      this.selectEmployeeDialog = false;
      this.createOrEditTilerDialog = false;
      this.shiftDialog = false;
      this.editedTiler = Object.assign({}, this.tiler);
      this.editedIndex = -1;
      this.error = null;
    },
  },
  computed: {
    getEmployees() {
      return this.$store.getters.getEmployees;
    },
    haveEditPermission() {
      return this.meDetails.employee_permissions.includes("tilers-update")
        ? true
        : false;
    },
    marginThree() {
      return this.$i18n.locale == "en" ? "ml-3" : "mr-3";
    },
    marginTwo() {
      return this.$i18n.locale == "en" ? "ml-2" : "mr-2";
    },
  },
  watch: {
    meDetails: {
      handler(newVal) {
        localStorage.setItem("meDetails", JSON.stringify(newVal));
      },
      deep: true,
    },
  },
  mounted() {
    this.setData();
  },
};
</script>
<style scoped>
@import "../../assets/styles/style.css";

.add-button {
  border-radius: 10px;
  width: 200px;
}

.tiler-container .tiler-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: black !important;
  font-size: 15px;
}

.tiler-container .tiler-name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100%;
}

.tiler-container .tiler-status,
.tiler-container .tiler-availability {
  font-family: "BahjiiLight";
}

.tiler-container .tiler-actions {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background: #eeeeee;
}

.cardForm .select-content :deep(.v-autocomplete__content) {
  background: red !important;
  background-color: red !important;
}

.create-edit-container .v-input--switch :deep(.v-input__slot) {
  margin-top: 0 !important;
}

.v-input--switch :deep(.v-input__slot) {
  background: none !important;
}

@media (max-width: 426px) {
  .add-button {
    width: 150px;
  }
}
</style>
