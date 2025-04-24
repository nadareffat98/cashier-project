<template>
  <v-container class="mt-5">
    <h2>{{ $t("profile") }}</h2>
    <v-expansion-panels class="mt-5">
      <v-expansion-panel>
        <v-expansion-panel-header class="justify-space-between mt-2 header">
          {{ $t("personalInformation") }}
        </v-expansion-panel-header>
        <v-expansion-panel-content :class="[englishContent, 'content', 'mt-4']">
          <v-form>
            <v-row>
              <v-col cols="12" md="12" v-if="errorInfo" class="pb-0">
                <v-alert dense outlined type="error">
                  {{ errorInfo }}
                </v-alert>
              </v-col>
              <v-col cols="12" md="6" class="pt-0">
                <label :class="getLabelMargin"> {{ $t("name") }} : </label>
                <v-text-field
                  v-model="name"
                  type="text"
                  :placeholder="$t('name')"
                  :disabled="userType == 1"
                  color="#d2d2d2"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="pt-0">
                <label :class="getLabelMargin">{{ $t("phone") }}: </label>
                <div
                  class="d-flex justify-content-start align-center"
                  style="gap: 25px"
                >
                  <v-text-field
                    v-model="phone"
                    type="text"
                    :placeholder="$t('phone')"
                    color="#d2d2d2"
                    disabled
                    outlined
                    style="width: 75%"
                  ></v-text-field>
                  <v-text-field
                    value="+966"
                    :placeholder="$t('countryCode')"
                    color="#d2d2d2"
                    :disabled="userType == 1"
                    outlined
                    readonly
                    dir="ltr"
                    style="width: 20%"
                  ></v-text-field>
                </div>
              </v-col>
              <v-col cols="12" md="6" class="pt-0">
                <label :class="getLabelMargin"> {{ $t("emailHint") }} : </label>
                <v-text-field
                  v-model="email"
                  type="text"
                  :placeholder="$t('emailHint')"
                  :disabled="userType == 1"
                  color="#d2d2d2"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="pt-0" v-if="userType == 0">
                <label :class="getLabelMargin"> {{ $t("cities") }} : </label>
                <v-autocomplete
                  :items="cities"
                  v-model="city"
                  item-text="name"
                  outlined
                  hide-details
                  color="#D2D2D2"
                  return-object
                ></v-autocomplete>
              </v-col>
              <v-col
                cols="12"
                md="12"
                class="d-flex justify-center align-center pt-0"
              >
                <v-btn
                  color="#62C83F"
                  width="250"
                  class="rounded-lg"
                  dark
                  @click.prevent="saveEdit"
                  v-if="userType != 1"
                >
                  {{ $t("save") }}</v-btn
                >
              </v-col>
            </v-row>
          </v-form>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-expansion-panels class="mt-2" v-if="guest == 0 && userType == 0">
      <v-expansion-panel>
        <v-expansion-panel-header class="justify-space-between mt-2 header">
          {{ $t("changePassword") }}
        </v-expansion-panel-header>
        <v-expansion-panel-content :class="[englishContent, 'content', 'mt-4']">
          <v-form v-model="valid" ref="form">
            <v-row>
              <v-col cols="12" md="12" v-if="errorPassword" class="pb-0">
                <v-alert dense outlined type="error">
                  {{ errorPassword }}
                </v-alert>
              </v-col>
              <v-col
                cols="12"
                md="6"
                :class="[englishPass, 'pt-0 password']"
                v-if="guest == 0"
              >
                <label :class="getLabelMargin">
                  {{ $t("oldPassword") }} :
                </label>
                <v-text-field
                  v-model="prevPassword"
                  :type="hidePrevPass ? 'password' : 'text'"
                  placeholder="******************"
                  color="#d2d2d2"
                  outlined
                >
                </v-text-field>
                <v-icon @click="hidePrevPass = !hidePrevPass" size="29">{{
                  hidePrevPass ? "mdi-eye" : "mdi-eye-off"
                }}</v-icon>
              </v-col>
              <v-col cols="12" md="6" class="pt-0" v-if="guest == 0"></v-col>
              <v-col cols="12" md="6" :class="[englishPass, 'pt-0 password']">
                <label :class="getLabelMargin">
                  {{ $t("newPassword") }} :
                </label>
                <v-text-field
                  v-model="newPassword"
                  :type="hidePass ? 'password' : 'text'"
                  placeholder="******************"
                  color="#d2d2d2"
                  outlined
                  :rules="passwordRules"
                >
                </v-text-field>
                <v-icon @click="hidePass = !hidePass" size="29">{{
                  hidePass ? "mdi-eye" : "mdi-eye-off"
                }}</v-icon>
              </v-col>
              <v-col
                cols="12"
                md="6"
                :class="[englishPass, 'pt-0 confirm-password']"
              >
                <label :class="getLabelMargin">
                  {{ $t("confirmPassword") }} :
                </label>
                <v-text-field
                  v-model="confirmPassword"
                  :type="hideConfirmPass ? 'password' : 'text'"
                  placeholder="******************"
                  color="#d2d2d2"
                  outlined
                  :rules="confirmRules"
                ></v-text-field>
                <v-icon @click="hideConfirmPass = !hideConfirmPass" size="29">{{
                  hideConfirmPass ? "mdi-eye" : "mdi-eye-off"
                }}</v-icon>
              </v-col>
              <v-col
                cols="12"
                md="12"
                class="d-flex justify-center align-center pt-0"
              >
                <v-btn
                  color="#62C83F"
                  width="250"
                  class="rounded-lg"
                  dark
                  @click.prevent="savePass"
                >
                  {{ $t("save") }}</v-btn
                >
              </v-col>
            </v-row>
          </v-form>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-btn
      class="d-flex justify-space-between align-center mt-5 elevation-1 delete"
      v-if="userType == 0"
      @click="removeAccount"
    >
      <span> {{ $t("deleteAccount") }} </span>
      <v-icon color="#EF0B0B" size="25">delete</v-icon>
    </v-btn>
    <alert-dialog
      v-if="saveDialog"
      :buttonName="$t('done')"
      color="#62C83F"
      @close="close"
      :close="close"
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
      valid: false,
      guest: 0,
      name: "",
      phone: "",
      email: "",
      city: "",
      city_id: "",
      cities: [],
      newPassword: "",
      hidePass: true,
      prevPassword: "",
      hidePrevPass: true,
      confirmPassword: "",
      hideConfirmPass: true,
      confirmRules: [(v) => v == this.newPassword || this.passwordNotMatch],
      passwordRules: [(v) => !!v || this.fieldRequired],
      errorInfo: null,
      errorPassword: null,
      message: null,
      saveDialog: false,
      userType: null,
    };
  },
  methods: {
    saveEdit() {
      if (typeof this.city == "object") this.city_id = this.city.id;
      axios
        .post(
          "edit_owner_profile",
          {
            name: this.name,
            email: this.email,
            city_id: this.city_id,
          },
          {
            headers: {
              Authorization: "Bearer" + localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          this.message = res.data.message;
          this.saveDialog = true;
          this.getData();
        })
        .catch((err) => (this.errorInfo = err.response.data.message));
    },
    savePass() {
      if (!this.$refs.form.validate()) return;
      if (this.guest == 1) {
        axios
          .post(
            "edit_owner_profile",
            {
              password: this.newPassword,
            },
            {
              headers: {
                Authorization: "Bearer" + localStorage.getItem("token"),
              },
            }
          )
          .then((res) => {
            this.message = res.data.message;
            this.saveDialog = true;
          })
          .catch((err) => {
            this.errorPassword = err.response.data.message;
          });
      } else {
        axios
          .post(
            "change-password",
            {
              current_password: this.prevPassword,
              new_password: this.newPassword,
              new_confirm_password: this.confirmPassword,
            },
            {
              headers: {
                Authorization: "Bearer" + localStorage.getItem("token"),
              },
            }
          )
          .then((res) => {
            this.message = res.data.message;
            this.saveDialog = true;
          })
          .catch((err) => (this.errorPassword = err.response.data.message));
      }
    },
    getData() {
      this.errorInfo = this.errorPassword = null;
      this.userType = JSON.parse(localStorage.getItem("meDetails"))[
        "user_type"
      ];
      axios
        .get("me", {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          this.city_id = res.data.city_id;
          this.name = res.data.name;
          this.phone = res.data.phone;
          this.email = res.data.email;
          this.city = res.data.city;
          localStorage.setItem("meDetails", JSON.stringify(res.data));
        })
        .catch((err) => {
          if (err.response.data.message == "Unauthenticated.")
            this.$store.dispatch("logout");
        });

      axios
        .get("cities", {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          this.cities = res.data.data;
        });
    },
    close() {
      if (this.saveDialog == true) {
        this.saveDialog = false;
        location.reload();
      }
    },
    removeAccount() {},
  },
  computed: {
    getLabelMargin() {
      return this.$i18n.locale == "ar" ? "mr-3" : "ml-3";
    },
    englishContent() {
      return this.$i18n.locale == "en" ? "english-content" : "";
    },
    englishPass() {
      return this.$i18n.locale == "en" ? "english-pass" : "";
    },
    passwordNotMatch() {
      return this.$t("passwordNotMatch");
    },
    fieldRequired() {
      return this.$t("fieldRequired");
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style scoped>
.header {
  font-size: 18px;
  font-family: "BahjiiSemiBold";
}

.header :deep(.v-expansion-panel-header__icon) {
  margin-left: 0px !important;
}

.header :deep(i) {
  color: black !important;
  font-size: 30px;
}

.content::v-deep .v-input__slot {
  min-height: 45px !important;
  margin-top: 5px !important;
}

.content label {
  position: relative;
  font-family: "BahjiiLight";
  font-size: 16px;
}

.content label::before {
  position: absolute;
  content: "";
  border-right: 3px solid #4fca9a;
  top: 0px;
  right: -7px;
  height: 90%;
}

.english-content label::before {
  border-right: none;
  border-left: 3px solid #4fca9a;
  left: -7px;
}

.content::v-deep fieldset {
  border: 2px solid #d2d2d2 !important;
  border-radius: 8px !important;
}

.content::v-deep fieldset:focus {
  outline: #d2d2d2 !important;
}

.content::v-deep button {
  font-size: 14px;
  font-family: "BahjiiLight";
}

.delete {
  font-family: "BahjiiSemiBold";
  font-size: 18px;
  width: 100%;
  letter-spacing: 0px;
  background-color: white !important;
  color: #ef0b0b;
}

.delete::before {
  background-color: white !important;
}

.content::v-deep .v-icon {
  padding-bottom: 10px !important;
}

.password,
.confirm-password {
  position: relative;
}

.password::v-deep .v-icon,
.confirm-password::v-deep .v-icon {
  padding-bottom: 0 !important;
  position: absolute;
  left: 25px;
  top: 39px;
}

.english-pass::v-deep .v-icon {
  left: auto !important;
  right: 25px;
}

.v-alert::v-deep .v-alert__wrapper .v-icon {
  margin-left: 10px !important;
  margin-top: 5px !important;
}
</style>
