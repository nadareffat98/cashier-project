<template>
  <v-container class="mt-5">
    <v-row class="mt-2">
      <v-col cols="12" md="6" sm="12">
        <h3>{{ $t("newAccount") }}</h3>
        <v-form class="register_form mt-5" lazy-validation>
          <v-row>
            <v-col cols="12" v-if="getErrors" class="pb-0">
              <v-alert dense outlined type="error">
                {{ getErrors }}
              </v-alert>
            </v-col>
            <v-col cols="12" class="pb-0">
              <label for="name">{{ $t("username") }}</label>
              <v-text-field v-model="newUser['name']" :error-messages="nameErrors" @input="$v.newUser['name'].$touch()"
                @blur="$v.newUser['name'].$touch()" required id="name" :placeholder="$t('username')" color="#d2d2d2"
                outlined></v-text-field>
            </v-col>
            <v-col cols="12" class="pt-0 pb-0">
              <label for="email">{{ $t("emailHint") }}</label>
              <v-text-field v-model="newUser['email']" :error-messages="emailErrors" required
                @input="$v.newUser['email'].$touch()" @blur="$v.newUser['email'].$touch()" id="email"
                :placeholder="$t('emailHint')" color="#d2d2d2" outlined></v-text-field>
            </v-col>
            <v-col cols="8" class="pt-0 pb-0">
              <label for="phone">{{ $t("phone") }}</label>
              <v-text-field v-model="newUser['phone']" :error-messages="phoneErrors" required
                @input="$v.newUser['phone'].$touch()" @blur="$v.newUser['phone'].$touch()" id="phone"
                :placeholder="$t('phone')" color="#d2d2d2" outlined></v-text-field>
            </v-col>
            <v-col cols="12" md="4" class="pt-0 pb-0">
              <label for="countryCode">{{ $t("countryCode") }}</label>
              <v-text-field value="+966" :placeholder="$t('countryCode')" id="countryCode" color="#d2d2d2" outlined
                readonly class="text-right" dir="ltr"></v-text-field>
            </v-col>
            <v-col cols="12" class="pt-0 pb-0">
              <label for="city"> {{ $t("cities") }} : </label>
              <v-autocomplete id="city" :items="cities" v-model="newUser['city_id']" item-text="name" outlined
                color="#D2D2D2" item-value="id"></v-autocomplete>
            </v-col>
            <v-col cols="12" class="pt-0 pb-0">
              <label for="password">{{ $t("Password") }}</label>
              <v-text-field v-model="newUser['password']" :error-messages="passwordErrors"
                @input="$v.newUser['password'].$touch()" @blur="$v.newUser['password'].$touch()" required id="password"
                :type="hidePass ? 'password' : 'text'" :append-icon="hidePass ? 'visibility' : 'visibility_off'"
                @click:append="hidePass = !hidePass" :placeholder="$t('Password')" color="#d2d2d2"
                outlined></v-text-field>
            </v-col>
            <v-col cols="12" class="pt-0 pb-0">
              <label for="confirmPass">{{ $t("confirmPassword") }}</label>
              <v-text-field v-model="confirmPass" id="confirmPass" :type="hideConfirmPass ? 'password' : 'text'"
                :append-icon="hideConfirmPass ? 'visibility' : 'visibility_off'"
                @click:append="hideConfirmPass = !hideConfirmPass" :error-messages="passwordMatchErrors" required
                @input="$v.confirmPass.$touch()" @blur="$v.confirmPass.$touch()" :placeholder="$t('confirmPassword')"
                color="#d2d2d2" outlined></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="d-flex justify-start pt-0">
              <v-checkbox v-model="agree" hide-details class="mt-0 pt-0"></v-checkbox>
              <a class="pr-2 mt-3" style="font-size: 15px" :href="`${VUE_APP_API_BASE}/terms_conditions#terms-conditions`"
                target="_blank">
                {{ $t("acceptTerms") }}
              </a>
            </v-col>
            <v-col cols="12" md="6" align="end" class="pt-0">
              <v-btn @click.prevent="handleSubmit" color="#4FCA9A" class="rounded-lg mt-1" style="color: white"
                :disabled="!agree">
                {{ $t("registerText") }}</v-btn>
            </v-col>
            <v-col cols="12" align="center" class="pb-7">
              <router-link to="/login" style="color: #4fca9a; font-size: 14px">
                {{ $t("haveAccount") }}
              </router-link>
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
import axios from "axios";
import { validationMixin } from "vuelidate";
import { required, email, numeric, sameAs } from "vuelidate/lib/validators";
export default {
  mixins: [validationMixin],

  validations: {
    newUser: {
      name: { required },
      email: { required, email },
      phone: { required, numeric },
      password: { required },
    },
    confirmPass: {
      required,
      sameAsPassword: sameAs(function () {
        return this.newUser.password;
      }),
    },
  },
  data() {
    return {
      VUE_APP_API_BASE: process.env.VUE_APP_API_BASE,
      newUser: {
        name: "",
        email: "",
        password: "",
        phone: "",
        country_code: "966",
        city_id: ""
      },
      cities: [],
      confirmPass: "",
      errors: {},
      disabled: true,
      hideConfirmPass: true,
      hidePass: true,
      agree: false,
    };
  },
  methods: {
    handleSubmit() {
      this.$store.dispatch("signUp", this.newUser);
    },
    getCities() {
      axios
        .get("cities", {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          this.cities = res.data.data;
        })
    }
  },
  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.newUser["name"].$dirty) return errors;
      !this.$v.newUser["name"].required && errors.push("الاسم مطلوب");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.newUser["email"].$dirty) return errors;
      !this.$v.newUser["email"].email &&
        errors.push("البريد الالكتروني غير صحيح");
      !this.$v.newUser["email"].required &&
        errors.push("البريد الالكتروني مطلوب");
      return errors;
    },
    phoneErrors() {
      const errors = [];
      if (!this.$v.newUser["phone"].$dirty) return errors;
      !this.$v.newUser["phone"].required && errors.push("رقم الجوال مطلوب ");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.newUser["password"].$dirty) return errors;
      !this.$v.newUser["password"].required &&
        errors.push("كلمة المرور مطلوبة");
      return errors;
    },
    passwordMatchErrors() {
      const errors = [];
      if (!this.$v.confirmPass.$dirty) return errors;
      !this.$v.confirmPass.required && errors.push("تاكيد كلمة المرور مطلوبة");
      !this.$v.confirmPass.sameAsPassword &&
        errors.push("كلمة المرور غير متطابقه");
      return errors;
    },
    getErrors() {
      return this.$store.getters.getErrors;
    },
  },
  mounted() {
    this.getCities();
    this.$store.commit("setErrors", null);
  },
};
</script>
<style scoped>
h3 {
  font-family: "BahjiiSemiBold";
  font-size: 30px;
}

.v-alert::v-deep .v-icon {
  margin-left: 18px !important;
  margin-top: -3px !important;
}

.register_form::v-deep .v-input__slot {
  min-height: 35px !important;
  margin-top: 5px !important;
}

.register_form label {
  font-family: "BahjiiLight";
  font-size: 16px;
  margin-right: 10px;
}

.register_form::v-deep fieldset {
  border: 2px solid #d2d2d2 !important;
  border-radius: 8px !important;
}

.register_form::v-deep fieldset:focus {
  outline: #d2d2d2 !important;
}

.register_form::v-deep .v-icon {
  margin-top: -14px;
}

.register_form a {
  font-family: "BahjiiLight";
  font-size: 12px;
  color: #707070;
  text-decoration: none;
}

.register_form::v-deep .v-input--selection-controls__input .v-icon {
  margin-top: 0px !important;
}

.register_form::v-deep .v-input--selection-controls__input .v-label {
  margin-right: 15px !important;
}
</style>
