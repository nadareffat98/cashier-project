<template>
  <v-container class="mt-5">
    <v-row>
      <v-col cols="12" md="12">
        <label v-ripple for="upload_img" class="cursor-pointer uploadImg">
          <v-file-input
            v-model="logo"
            style="display: none"
            id="upload_img"
            @change="onFileChange"
            accept="image/png, image/jpeg, image/bmp"
            placeholder="Pick an avatar"
            label="Avatar"
          ></v-file-input>
          <v-avatar :size="photoSize">
            <v-img
              v-if="selectedImg"
              :src="selectedImg"
              alt="view.username"
            ></v-img>
            <v-img
              v-else-if="imgView"
              :src="require(`@/assets/imgs/${imgView}`)"
            ></v-img>
            <v-img v-else-if="userInfo['logo']" :src="userInfo['logo']"></v-img>
            <p v-else style="margin-bottom: 0px !important; font-weight: bold">
              {{ $t("storeLogo") }}
            </p>
          </v-avatar>
        </label>
      </v-col>
    </v-row>
    <v-form ref="form" class="form-container" lazy-validation>
      <v-row
        :class="[$i18n.locale == 'en' ? 'eng-formData' : '', 'formData']"
        align="end"
      >
        <div v-if="errors">
          <v-alert dense outlined type="error">
            {{ errors }}
          </v-alert>
        </div>
        <v-col cols="12" md="6" class="addAvatar pb-0">
          <p>{{ $t("defaultLogo") }}</p>
          <v-avatar
            v-for="img in 5"
            :key="img"
            :size="multiPhotoSize"
            :class="[marginTwo, 'mb-3']"
          >
            <img
              :src="require(`@/assets/imgs/${img}.png`)"
              :id="img"
              @click="changeImg(img)"
            />
          </v-avatar>
          <br />
          <div class="file-upload">
            <label for="upload" class="file-upload__label">
              {{ $t("addPhoto") }}
              <v-file-input
                v-model="logo"
                class="file-upload__input"
                id="upload"
                accept="image/png, image/jpeg, image/bmp"
                @change="onFileChange"
              ></v-file-input>
            </label>
          </div>
        </v-col>
        <v-col cols="12" md="6" class="pb-0">
          <label :class="[marginThree]"> {{ $t("organization") }}: </label>
          <v-text-field
            v-model="userInfo['market_name']"
            :rules="nameRules"
            :placeholder="$t('organization')"
            color="#d2d2d2"
            outlined
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6" class="pb-0 pt-0">
          <label :class="[marginThree]"> {{ $t("phone") }} : </label>
          <v-text-field
            v-model="userInfo['phone']"
            :placeholder="$t('phone')"
            color="#d2d2d2"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6" v-if="taxInvoice" class="pb-0 pt-0">
          <label :class="[marginThree]"> {{ $t("taxNumber") }} : </label>
          <v-text-field
            v-model="userInfo['tax_number']"
            :rules="taxNumberRules"
            :maxlength="15"
            :placeholder="$t('taxNumber')"
            color="#d2d2d2"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6" class="pb-0 pt-0">
          <label :class="[marginThree]"> {{ $t("address") }}: </label>
          <v-text-field
            v-model="userInfo['address']"
            :placeholder="$t('address')"
            color="#d2d2d2"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6" class="pb-0 pt-0" v-if="showCopyRight">
          <label :class="[marginThree]">{{ $t("website") }} : </label>
          <v-text-field
            v-model="userInfo['store_url']"
            :placeholder="$t('website')"
            color="#d2d2d2"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="12" class="pb-0 pt-0">
          <label :class="[marginThree]">{{ $t("invoiceHeader") }}: </label>
          <v-text-field
            v-model="userInfo['upper_text']"
            :placeholder="$t('invoiceHeader')"
            color="#d2d2d2"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="12" class="pb-0 pt-0">
          <label :class="[marginThree]"> {{ $t("invoiceFooter") }}: </label>
          <v-text-field
            v-model="userInfo['bottom_text']"
            :placeholder="$t('invoiceFooter')"
            color="#d2d2d2"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="12" class="pb-0 pt-0 round-setting">
          <fieldset>
            <legend class="px-2">{{ $t("roundSetting") }}</legend>
            <div class="d-flex flex-column align-center justify-start">
              <div
                class="d-flex justify-center align-start"
                style="width: 80%; gap: 15px"
              >
                <div style="flex-basis: 40%">
                  <label>{{ $t("roundType") }}</label>
                  <v-radio-group v-model="roundType" @change="handleCellNum">
                    <v-radio
                      v-for="roundType in roundTypes"
                      :key="roundType"
                      :label="roundType.name"
                      :value="roundType.value"
                      color="#4fca9a"
                    ></v-radio>
                  </v-radio-group>
                </div>
                <div style="flex-basis: 40%">
                  <label>{{ $t("cellsNum") }}</label>
                  <v-autocomplete
                    :items="cellsNum"
                    v-model="cellNum"
                    outlined
                    hide-details
                    color="#D2D2D2"
                    @change="handleCellNum"
                  ></v-autocomplete>
                </div>
              </div>
              <b class="pt-2">{{ $t("before") + ":" + " 10.1278" }} - {{$t("after") + ":" +  example }}</b>
            </div>
          </fieldset>
        </v-col>
      </v-row>
      <v-row
        class="d-flex justify-center align-center tax pt-0 mt-0"
        :style="$i18n.locale == 'en' ? 'direction:rtl' : 'direction:ltr'"
      >
        <v-col
          cols="12"
          md="8"
          class="d-flex justify-space-between align-center pt-0 pb-0"
        >
          <v-switch
            id="productSound"
            color="success"
            v-model="addProductSound"
            :style="$i18n.locale == 'en' ? 'direction:ltr' : 'direction:rlt'"
          ></v-switch>
          <label for="productSound">{{ $t("productSound") }}</label>
        </v-col>
        <v-col
          cols="12"
          md="8"
          class="d-flex justify-space-between align-center pt-0 pb-0"
        >
          <v-switch
            id="tax"
            color="success"
            v-model="taxInvoice"
            :style="$i18n.locale == 'en' ? 'direction:ltr' : 'direction:rlt'"
          ></v-switch>
          <label for="tax">{{ $t("taxedInvoice") }}</label>
        </v-col>
        <v-col
          cols="12"
          md="8"
          class="d-flex justify-space-between align-center pt-0"
        >
          <v-switch
            id="tax"
            color="success"
            v-model="showCopyRight"
            @click="openCopyRightsDialog"
            :style="$i18n.locale == 'en' ? 'direction:ltr' : 'direction:rlt'"
          ></v-switch>
          <label for="tax">{{ $t("hideCopyWrite") }}</label>
        </v-col>
        <v-col
          cols="12"
          md="12"
          class="d-flex justify-center align-center pt-0"
        >
          <v-btn
            color="#EF0B0B"
            width="18%"
            :class="[marginTwo, 'rounded-lg']"
            dark
            @click="getData"
            >{{ $t("cancel") }}</v-btn
          >
          <v-btn
            color="#62C83F"
            width="18%"
            class="rounded-lg"
            dark
            @click.prevent="handleSubmit"
            >{{ $t("save") }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <alert-dialog
      v-if="warningDialog"
      :buttonName="$t('done')"
      color="#4FCA9A"
      :close="close"
      @close="close"
    >
      <template #text>
        <p class="mb-2">
          <v-icon color="red" size="12" class="ml-1">emergency</v-icon>
          {{ warningMessage }}
        </p>
      </template>
    </alert-dialog>
    <alert-dialog
      v-if="acceptDialog"
      :buttonName="$t('done')"
      color="#62C83F"
      :close="closeAcceptDialog"
      @close="closeAcceptDialog"
    >
      <template #title> {{ $t("doneSuccessfuly") }} </template>
    </alert-dialog>
    <alert-dialog
      v-if="copyRightsDialog"
      :buttonName="$t('notNow')"
      color="#4FCA9A"
      :close="close"
      @close="close"
    >
      <template #title>{{ $t("shouldUpgrade") }} </template>
      <template #actions>
        <v-btn
          color="#4FCA9A"
          width="200"
          class="rounded-lg white--text ml-2 mb-2"
          to="/subscriptions"
          >{{ $t("updateNow") }}</v-btn
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
      addProductSound: null,
      taxInvoice: null,
      acceptDialog: false,
      copyRightsDialog: false,
      warningDialog: false,
      copyRightsVisible: null,
      showCopyRight: false,
      logo: null,
      imgView: null,
      selectedImg: null,
      valid: false,
      userInfo: {},
      meDetails: {},
      userType: null,
      nameRules: [(v) => !!v || this.$t("fieldRequired")],
      taxNumberRules: [(v) => !!v || this.$t("storeTaxNumValidfation")],
      roundTypes: [
        { name: this.$t("cutWithoutRound"), value: 1 },
        { name: this.$t("cutWithRound"), value: 0 },
      ],
      roundType: null,
      cellsNum: [1, 2, 3, 4],
      cellNum: null,
      example: 10.1278,
      errors: null,
    };
  },
  methods: {
    getData() {
      this.userInfo = JSON.parse(localStorage.getItem("userDetails"));
      this.meDetails = JSON.parse(localStorage.getItem("meDetails"));
      this.roundType = this.userInfo.cut_val;
      this.cellNum = this.userInfo.precision;
      this.handleCellNum();
      this.userType = this.meDetails.user_type;
      this.taxInvoice = this.userInfo["tax_on_of"] == 1 ? true : false;
      if (this.meDetails["subscription"] != null)
        this.copyRightsVisible =
          this.meDetails["subscription"]["copy_rights_visible"];
      else this.copyRightsVisible = false;
      if (this.copyRightsVisible)
        this.showCopyRight =
          this.userInfo["copy_rights_visible"] == 1 ? true : false;
      this.addProductSound = JSON.parse(
        localStorage.getItem("addProductSound")
      );
      if (this.taxInvoice && this.userInfo["tax_number"] == null)
        this.warningDialog = true;
    },
    async changeImg(img) {
      this.imgView = img + ".png";
      const src = document.getElementById(img).src;
      fetch(src)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], this.imgView, blob);
          this.logo = file;
        });
    },
    onFileChange(e) {
      this.selectedImg = URL.createObjectURL(e);
    },
    openCopyRightsDialog() {
      if (!this.copyRightsVisible) {
        this.copyRightsDialog = true;
      }
    },
    handleRoundType() {
      if (this.cellNum) {
        this.handleCellNum();
      } else console.log("ga");
    },
    handleCellNum() {
      console.log(this.roundType, this.cellNum);
      if (this.roundType == 1) {
        if (this.cellNum == 1) this.example = 10.1;
        else if (this.cellNum == 2) this.example = 10.12;
        else if (this.cellNum == 3) this.example = 10.127;
        else this.example = 10.1278;
      } else {
        console.log("ksnk", this.cellNum);
        if (this.cellNum == 1) this.example = 10.1;
        else if (this.cellNum == 2) this.example = 10.13;
        else if (this.cellNum == 3) this.example = 10.128;
        else this.example = 10.1278;
      }
    },
    handleSubmit() {
      if (this.$refs.form.validate()) {
        if (
          this.userType == 1 &&
          !this.meDetails.employee_permissions.includes("userDetails-update")
        ) {
          this.warningDialog = true;
          return;
        } else {
          axios
            .post(
              "user-detail/update",
              {
                address: this.userInfo["address"],
                store_url: this.userInfo["store_url"],
                market_name: this.userInfo["market_name"],
                phone: this.userInfo["phone"],
                tax_number: this.userInfo["tax_number"],
                hot_line: this.userInfo["hot_line"],
                upper_text: this.userInfo["upper_text"],
                bottom_text: this.userInfo["bottom_text"],
                tax_on_of: this.taxInvoice == true ? 1 : 0,
                logo: this.logo,
                copy_rights_visible: this.showCopyRight ? 1 : 0,
                cut_val: this.roundType,
                precision: this.cellNum,
              },
              {
                headers: {
                  "content-type": "multipart/form-data",
                },
              }
            )
            .then((res) => {
              localStorage.setItem("taxInvoice", res.data.data.tax_on_of);
              this.acceptDialog = true;
            })
            .catch((err) => {
              this.errors = err.response.data.message;
            });
        }
      }
    },
    close() {
      this.copyRightsDialog = false;
      this.warningDialog = false;
    },
    closeAcceptDialog() {
      this.acceptDialog = false;
      this.$store.dispatch("userDetail");
      this.$store.dispatch("meDetail");
    },
  },
  computed: {
    getUser() {
      return this.$store.getters.getUser;
    },
    warningMessage() {
      if (this.userInfo != null && this.userInfo["tax_number"] == null) {
        return this.$t("storeTaxNumValidfation");
      } else if (
        this.userType == 1 &&
        !this.meDetails.employee_permissions.includes("userDetails-update")
      )
        return this.$t("haveNoPermissionUpdateSett");
      else return "";
    },
    photoSize() {
      if (this.$vuetify.breakpoint.width > 768) return "100";
      else return "80";
    },
    multiPhotoSize() {
      if (this.$vuetify.breakpoint.width > 768) return "70";
      else return "50";
    },
    marginThree() {
      return this.$i18n.locale == "en" ? "ml-3" : "mr-3";
    },
    marginTwo() {
      return this.$i18n.locale == "en" ? "ml-2" : "mr-2";
    },
  },
  watch: {
    addProductSound(val) {
      localStorage.setItem("addProductSound", val);
    },
  },
  mounted() {
    setTimeout(() => {
      this.getData();
    }, 200);
  },
};
</script>
<style scoped>

:deep(.v-input--radio-group__input)
{
  background: white !important;
}
fieldset {
  border: 2px solid #d2d2d2;
  border-radius: 5px 10px;
  padding: 10px;
}

.uploadImg .v-avatar {
  border: 1px solid rgba(112, 112, 112, 0.23);
}

.formData p {
  font-family: "BahjiiLight";
  font-size: 0.9rem;
  color: #515151;
  margin-bottom: 5px !important;
}

.addAvatar::v-deep .v-avatar {
  border: 1px dashed #4fca9a;
}

.file-upload {
  position: relative;
  display: inline-block;
  text-align: center;
  margin-bottom: 10px;
}

.file-upload__label {
  display: block;
  color: #fff;
  background: #62c83f;
  padding: 4px 16px;
  border-radius: 10px;
}

.file-upload__label:hover {
  cursor: pointer;
}

.file-upload__label::before {
  border-right: none !important;
}

.eng-formData .file-upload__label::before {
  border-left: none !important;
}

.file-upload__input {
  position: absolute;
  left: 0;
  top: 0;
  font-size: 1;
  width: 0;
  height: 100%;
  opacity: 0;
}

.formData :deep(.v-input__slot) {
  min-height: 45px !important;
  margin-top: 5px !important;
}
.formData label {
  position: relative;
}

.formData label::before {
  position: absolute;
  content: "";
  border-right: 3px solid #4fca9a;
  top: 0px;
  right: -5px;
  height: 90%;
}

.eng-formData label::before {
  border-right: none;
  border-left: 3px solid #4fca9a;
  left: -6px;
}
.round-setting label::before {
  border: none !important;
}
:deep(.v-input--switch .v-input__slot) {
  background: none !important;
}
.tax :deep(.v-input__slot) {
  min-height: 35px !important;
}
@media (max-width: 768px) {
  .form-container label {
    font-size: 0.8rem;
  }
}
</style>
