<template>
  <v-container>
    <v-row class="mt-5">
      <v-col cols="12" md="6" sm="12" v-if="loginForm" class="mt-8">
        <h3>{{ $t("loginNow") }}</h3>
        <v-form class="login_form mt-8" @submit.prevent="handleSubmit">
          <v-row>
            <v-col cols="12" v-if="getErrors" class="pb-0">
              <v-alert dense outlined type="error">
                {{ getErrors.message }}
              </v-alert>
            </v-col>
            <v-col cols="12">
              <label for="name">{{ $t("emailHint") }}</label>
              <v-text-field v-model="user['email']" id="name" :placeholder="$t('emailHint')" color="#d2d2d2" outlined
                :error-messages="emailErrors" @input="$v.user['email'].$touch()" @blur="$v.user['email'].$touch()"
                required></v-text-field>
            </v-col>
            <v-col cols="12" class="pb-0">
              <label for="password">{{ $t("Password") }}</label>
              <v-text-field v-model="user['password']" id="password" :type="hidePass ? 'password' : 'text'"
                :append-icon="hidePass ? 'visibility' : 'visibility_off'" @click:append="hidePass = !hidePass"
                placeholder=" ******************* " color="#d2d2d2" outlined :error-messages="passwordErrors"
                @input="$v.user['password'].$touch()" @blur="$v.user['password'].$touch()" required></v-text-field>
            </v-col>
            <v-col cols="12" align="end" class="pt-0 pb-0">
              <a href="#" @click.prevent="forgetPass">{{
                $t("forgetPassword")
              }}</a>
            </v-col>
            <v-col cols="12" md="6" sm="6" class="pb-0">
              <v-checkbox v-model="rememberMe" :label="$t('rememberMe')" hide-details class="mt-0 pt-0"></v-checkbox>
            </v-col>
            <v-col cols="12" md="6" sm="6" class="pb-0" align="end">
              <v-btn type="submit" color="#4FCA9A" class="rounded-lg mt-2" dark>
                {{ $t("login") }}</v-btn>
            </v-col>
            <v-col cols="12" align="center" class="pb-0 pt-6">
              <p>
                {{ $t("noAccount") }}
                <router-link to="/register" style="color: #4fca9a">{{
                  $t("newAccount")
                }}</router-link>
              </p>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
      <v-col cols="12" md="6" sm="12" v-else-if="forgetPasswordForm" class="mt-8">
        <h3>{{ $t("reassignPassword") }}</h3>
        <v-form class="login_form mt-5" @submit.prevent="sendCode" v-if="sendPassCode">
          <v-row>
            <v-col cols="12" v-if="getNewPassErrors" class="pb-0">
              <v-alert dense outlined type="error">
                {{ getNewPassErrors }}
              </v-alert>
            </v-col>
            <v-col cols="12" md="12" class="pb-0">
              <label>{{ $t("emailHint") }}</label>
              <v-text-field v-model="user['email']" :placeholder="$t('emailHint')" color="#d2d2d2" outlined
                :error-messages="emailErrors" @input="$v.user['email'].$touch()" @blur="$v.user['email'].$touch()"
                required></v-text-field>
            </v-col>
            <v-col cols="12" md="12" align="center" class="pt-0 pb-0">
              <h4>{{ $t("or") }}</h4>
            </v-col>
            <v-col cols="12" md="8">
              <label>{{ $t("phone") }}</label>
              <v-text-field v-model="phoneDetails.phone" :placeholder="$t('phone')" color="#d2d2d2" outlined
                :error-messages="phoneErrors" @input="$v.phoneDetails.phone.$touch()"
                @blur="$v.phoneDetails.phone.$touch()" required></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <label>{{ $t("countryCode") }}</label>
              <v-text-field value="+966" :placeholder="$t('countryCode')" id="countryCode" color="#d2d2d2" outlined
                readonly class="text-right" dir="ltr"></v-text-field>
            </v-col>
            <v-col cols="12" md="12">
              <v-btn color="#4FCA9A" class="rounded-lg" dark type="submit">{{
                $t("reassignPassword")
              }}</v-btn>
            </v-col>
            <v-col cols="12" md="12" align="center">
              <a @click="backToLogin">
                <span>{{ $t("backToLogin") }}</span>
                <v-icon class="mt-1 mr-2">arrow_back</v-icon>
              </a>
            </v-col>
          </v-row>
        </v-form>
        <v-form class="login_form mt-5" @submit.prevent="savePassword" v-else>
          <v-row>
            <v-col cols="12" v-if="getNewPassErrors" class="pb-0">
              <v-alert dense outlined type="error">
                {{ getNewPassErrors }}
              </v-alert>
            </v-col>
            <v-col cols="12" md="12">
              <label>{{ $t("codeSentOnMail") }}</label>
              <v-text-field v-model="token" :placeholder="$t('codeSentOnMail')" color="#d2d2d2" outlined
                :error-messages="tokenErrors" @input="$v.token.$touch()" @blur="$v.token.$touch()"
                required></v-text-field>
            </v-col>
            <v-col cols="12" md="12">
              <label>{{ $t("newPassword") }}</label>
              <v-text-field v-model="newPass" :type="hidePass ? 'password' : 'text'"
                :append-icon="hidePass ? 'visibility' : 'visibility_off'" @click:append="hidePass = !hidePass"
                :placeholder="$t('newPassword')" color="#d2d2d2" outlined :error-messages="newPassErrors"
                @input="$v.newPass.$touch()" @blur="$v.newPass.$touch()"></v-text-field>
            </v-col>
            <v-col cols="12" md="12">
              <label>{{ $t("confirmPassword") }}</label>
              <v-text-field v-model="confirmNewPass" :type="hideConfirmPass ? 'password' : 'text'"
                :append-icon="hideConfirmPass ? 'visibility' : 'visibility_off'"
                @click:append="hideConfirmPass = !hideConfirmPass" :error-messages="confirmPasswordErrors"
                @input="$v.confirmNewPass.$touch()" @blur="$v.confirmNewPass.$touch()"
                :placeholder="$t('confirmPassword')" color="#d2d2d2" outlined></v-text-field>
            </v-col>
            <v-col cols="12" md="12">
              <v-btn type="submit" color="#4FCA9A" class="rounded-lg mt-2" dark>
                {{ $t("save") }}</v-btn>
            </v-col>
            <v-col>
              <v-col cols="12" md="12" align="center">
                <a @click="backToLogin">
                  <span>{{ $t("backToLogin") }}</span>
                  <v-icon class="mt-1 mr-2">arrow_back</v-icon>
                </a>
              </v-col>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
      <v-col cols="12" md="6" sm="12" v-else-if="optVerificationForm" class="mt-8">
        <h3>{{ $t("verifyAccoutn") }}</h3>
        <v-form class="login_form mt-5" @submit.prevent="sendOtp" v-if="sendOtpCode">
          <v-row>
            <v-col cols="12" v-if="getVisitErrors" class="pb-0">
              <v-alert dense outlined type="error">
                {{ getVisitErrors }}
              </v-alert>
            </v-col>
            <v-col cols="12" class="pb-0 mb-0">
              <label>{{ phoneHint }}</label></v-col>
            <v-col cols="12" md="8">
              <v-text-field v-model="phoneDetails.phone" :placeholder="$t('phone')" color="#d2d2d2" outlined
                :error-messages="phoneErrors" @input="$v.phoneDetails.phone.$touch()"
                @blur="$v.phoneDetails.phone.$touch()" required></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field value="+966" :placeholder="$t('countryCode')" id="countryCode" color="#d2d2d2" outlined
                readonly class="text-right" dir="ltr"></v-text-field>
              <!-- <v-text-field
                v-model="phoneDetails.country_code"
                :placeholder="$t('countryCode')"
                color="#d2d2d2"
                outlined
                readonly
                dir="ltr"
              ></v-text-field> -->
            </v-col>
            <v-col cols="12" md="12">
              <v-btn color="#4FCA9A" class="rounded-lg" dark type="submit">{{ $t("send") }}
              </v-btn>
            </v-col>
            <v-col cols="12" md="12" align="center">
              <a @click="backToLogin">
                <span>{{ $t("backToLogin") }}</span>
                <v-icon class="mt-1 mr-2">arrow_back</v-icon>
              </a>
            </v-col>
          </v-row>
        </v-form>
        <v-form class="login_form mt-5" @submit.prevent="verifyOtp" v-else>
          <v-row>
            <v-col cols="12" v-if="getVisitErrors" class="pb-0">
              <v-alert dense outlined type="error">
                {{ getVisitErrors }}
              </v-alert>
            </v-col>
            <v-col cols="12" md="12">
              <label>{{ $t("confirmCodeRequired") }}</label>
              <v-text-field v-model="otp" :placeholder="$t('confirmCodeRequired')" color="#d2d2d2" outlined
                :error-messages="otpErrors" @input="$v.otp.$touch()" @blur="$v.otp.$touch()" required></v-text-field>
            </v-col>
            <v-col cols="12" md="12">
              <v-btn color="#4FCA9A" class="rounded-lg" dark type="submit">{{ $t("send") }}
              </v-btn>
            </v-col>
            <v-col cols="12" md="12" align="center">
              <a @click="backToLogin">
                <span>{{ $t("backToLogin") }}</span>
                <v-icon class="mt-1 mr-2">arrow_back</v-icon>
              </a>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
      <v-col cols="12" md="6" sm="12" class="mt-8" align="center">
        <v-img src="imgs/image.png" class="mt-7"></v-img>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { validationMixin } from "vuelidate";
import { required, sameAs, numeric } from "vuelidate/lib/validators";
import firebase from "firebase/app";
import "firebase/messaging";
import axios from "axios";
export default {
  mixins: [validationMixin],

  validations: {
    user: {
      email: { required },
      password: { required },
    },
    token: { required },
    newPass: { required },
    confirmNewPass: {
      sameAsPassword: sameAs(function () {
        return this.newPass;
      }),
    },
    phoneDetails: {
      phone: { required, numeric },
    },
    otp: {
      required,
    },
  },
  data() {
    return {
      loginForm: false,
      forgetPasswordForm: false,
      optVerificationForm: false,
      sendPassCode: true,
      sendOtpCode: true,
      user: {
        email: "",
        password: "",
        device_token: "",
      },
      phoneDetails: {
        country_code: "966",
        phone: null,
      },
      error: "",
      rememberMe: false,
      hidePass: true,
      hideConfirmPass: true,
      newPass: null,
      confirmNewPass: null,
      token: null,
      otp: null,
      matchPassword: [],
      getNewPassErrors: null,
      getVisitErrors: null,
      getOtpErrors: null,
    };
  },
  methods: {
    handleSubmit() {
      this.$v.user["email"].$touch() || this.$v.user["password"].$touch();
      if (this.$v.user["email"].$invalid || this.$v.user["password"].$invalid)
        return;
      this.$store.dispatch("login", this.user);
    },
    verification() {
      this.loginForm = false;
      this.optVerificationForm = true;
    },
    forgetPass() {
      this.loginForm = false;
      this.forgetPasswordForm = true;
    },
    // send otp to user if login or visit
    sendOtp() {
      this.getVisitErrors = null;
      this.$v.phoneDetails.phone.$touch();
      if (this.$v.phoneDetails.phone.$invalid) return;
      if (this.optVerificationForm) this.sendOtpToLogin();
    },
    sendOtpToLogin() {
      axios
        .post("send-otp", this.phoneDetails)
        .then(() => {
          this.sendOtpCode = false;
        })
        .catch((err) => (this.getVisitErrors = err.response.data.message));
    },
    // verify otp
    verifyOtp() {
      this.getVisitErrors = null;
      this.$v.otp.$touch();
      if (this.$v.otp.$invalid) return;
      if (this.optVerificationForm) this.verifyOtpToLogin();
    },
    verifyOtpToLogin() {
      axios
        .post("verify-otp", {
          ...this.phoneDetails,
          otp: this.otp,
        }, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then(() => {
          localStorage.setItem("PhoneVerified", JSON.stringify(true))
          this.$store.dispatch("userDetail");
          setTimeout(() => {
            this.$store.dispatch("meDetail");
          }, 200);
        })
        .catch((err) => (this.getVisitErrors = err.response.data.message));
    },
    // send code to reset password
    sendCode() {
      axios
        .post("forgot-password-send-otp", {
          ...(this.user["email"]
            ? { email: this.user["email"] }
            : this.phoneDetails),
        })
        .then(() => {
          this.sendPassCode = false;
        })
        .catch((err) => (this.getNewPassErrors = err.response.data.message));
    },
    // reset password
    savePassword() {
      this.getNewPassErrors = null;
      this.$v.token.$touch() ||
        this.$v.newPass.$touch() ||
        this.$v.confirmNewPass.$touch();
      if (
        this.$v.token.$invalid ||
        this.$v.newPass.$invalid ||
        this.$v.confirmNewPass.$invalid
      )
        return;
      axios
        .post("new-password-with-otp", {
          ...(this.user["email"]
            ? { email: this.user["email"] }
            : this.phoneDetails),
          otp: this.token,
          password: this.newPass,
          password_confirmation: this.confirmNewPass,
        })
        .then(() => {
          this.forgetPasswordForm = false;
          this.sendPassCode = true;
          this.loginForm = true;
          this.$store.commit("setErrors", null);
        })
        .catch((err) => (this.getNewPassErrors = err.response.data.message));
    },
    backToLogin() {
      location.reload();
    },
    registerFirebase() {
      try {
        firebase
          .messaging()
          .requestPermission()
          .then(() => {
            return firebase
              .messaging()
              .getToken()
              .then((token) => {
                this.user["device_token"] = token;
              });
          })
          .catch(() => {
            console.log("unable to get token");
          });
      } catch (e) {
        console.log(e);
      }
    },
  },
  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.user["email"].$dirty) return errors;
      !this.$v.user["email"].required && errors.push(this.$t("fieldRequired"));
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.user["password"].$dirty) return errors;
      !this.$v.user["password"].required &&
        errors.push(this.$t("fieldRequired"));
      return errors;
    },
    tokenErrors() {
      const errors = [];
      if (!this.$v.token.$dirty) return errors;
      !this.$v.token.required && errors.push(this.$t("fieldRequired"));
      return errors;
    },
    newPassErrors() {
      const errors = [];
      if (!this.$v.newPass.$dirty) return errors;
      !this.$v.newPass.required && errors.push(this.$t("fieldRequired"));
      return errors;
    },
    confirmPasswordErrors() {
      const errors = [];
      if (!this.$v.confirmNewPass.$dirty) return errors;
      !this.$v.confirmNewPass.sameAsPassword &&
        errors.push(this.$t("passwordNotMatch"));
      return errors;
    },
    phoneErrors() {
      const errors = [];
      if (!this.$v.phoneDetails.phone.$dirty) return errors;
      !this.$v.phoneDetails.phone.required &&
        errors.push(this.$t("fieldRequired"));
      !this.$v.phoneDetails.phone.numeric &&
        errors.push(this.$t("phoneInvalid"));
      return errors;
    },
    otpErrors() {
      const errors = [];
      if (!this.$v.otp.$dirty) return errors;
      !this.$v.otp.required && errors.push(this.$t("fieldRequired"));
      return errors;
    },
    getErrors() {
      return this.$store.getters.getErrors;
    },
    phoneHint() {
      return this.visitForm ? this.$t("phone") : this.$t("mobileVerification");
    },
  },
  watch: {
    "$store.getters.getPhoneNum": {
      immediate: true, // Trigger the watcher immediately when the component is mounted
      handler(phoneNum) {
        if (phoneNum != null) {
          this.phoneDetails.phone = phoneNum;
          this.verification();
        } else {
          this.loginForm = true;
        }
      },
    },
  },
  mounted() {
    this.$store.commit("setErrors", null);
    this.registerFirebase();
  },
};
</script>
<style scoped>
h3 {
  font-family: "BahjiiSemiBold";
  font-size: 30px;
}

.login_form::v-deep .v-input__slot {
  min-height: 35px !important;
  margin-top: 5px !important;
}

.login_form::v-deep .v-input__slot .v-input__append-inner {
  margin-top: 8px;
}

.login_form label {
  font-family: "BahjiiLight";
  font-size: 16px;
  margin-right: 10px;
}

.login_form::v-deep fieldset {
  border: 2px solid #d2d2d2 !important;
  border-radius: 8px !important;
}

.login_form::v-deep fieldset:focus {
  outline: #d2d2d2 !important;
}

.login_form::v-deep .v-icon {
  margin-top: -3px;
  margin-left: 10px;
}

.login_form a {
  font-family: "BahjiiLight";
  font-size: 12px;
  color: #707070;
  text-decoration: none;
}

.login_form::v-deep .v-input--selection-controls__input .v-icon {
  margin-top: 0px !important;
}

.login_form::v-deep .v-input--selection-controls__input .v-label {
  margin-right: 15px !important;
}
</style>
