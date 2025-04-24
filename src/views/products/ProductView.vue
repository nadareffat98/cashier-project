<template>
  <v-container class="mt-5">
    <div class="d-flex justify-space-between align-center">
      <h2>{{ $t("products") }}</h2>
      <div class="d-flex justify-center align-center">
        <v-btn
          outlined
          color="#62C83F"
          height="35px"
          class="add-btn"
          @click="exportProduct"
        >
          <v-icon color="#62C83F" size="29">mdi-microsoft-excel</v-icon
          ><span class="addText">{{ $t("exportProduct") }}</span>
        </v-btn>
        <v-btn
          dark
          color="#62C83F"
          height="35px"
          :class="[marginThree, 'add-btn']"
          @click="openExcelDialog"
        >
          <v-icon color="white" size="29">mdi-microsoft-excel</v-icon
          ><span class="addText">{{ $t("excelFile") }}</span>
        </v-btn>
      </div>
    </div>
    <div class="d-flex justify-space-between align-center my-7">
      <v-icon color="#4FCA9A" size="25" class="icon"> search</v-icon>
      <input
        type="search"
        :placeholder="$t('search')"
        v-model="searchProduct"
        @input="search('')"
      />
      <v-btn
        dark
        color="#4FCA9A"
        height="35px"
        :class="[marginThree, 'add-btn']"
        @click="openModal"
      >
        <v-icon color="white" size="29">add_box</v-icon
        ><span class="addText">{{ $t("addProduct") }}</span>
      </v-btn>
    </div>
    <v-data-table
      :headers="filterHeaders"
      :items="getProducts"
      :items-per-page="itemsPerPage"
      :page.sync="currentPage"
      item-key="id"
      hide-default-footer
      :class="[$i18n.locale == 'en' ? 'eng-table' : '', , 'mt-5 tableStriped']"
    >
      <template slot="no-data">{{ $t("noProduct") }}</template>
      <template slot="item.serial" slot-scope="{ item }">
        <td>
          <a @click="generateBarcode(item.serial)">{{ item.serial }}</a>
        </td>
      </template>
      <template slot="item.price_before_tax" slot-scope="{ item }">
        <td>{{ $RoundingNumber(item.price_before_tax, "product") }}</td>
      </template>
      <template slot="item.price_after_tax" slot-scope="{ item }">
        <td>{{ $RoundingNumber(item.price_after_tax, "product") }}</td>
      </template>
      <template slot="item.categories" slot-scope="{ item }">
        <td>
          <span
            v-for="(category, index) in filterCategory(item.categories)"
            :key="category.id"
          >
            {{ index != filterCategory.length - 1 ? "," : ""
            }}{{ category.title }}
          </span>
        </td>
      </template>
      <template slot="item.image" slot-scope="{ item }">
        <v-avatar>
          <img :src="item.image == null ? 'imgs/product.png' : item.image"
        /></v-avatar>
      </template>
      <template slot="item.actions" slot-scope="{ item }">
        <td>
          <v-btn
            :class="[marginTwo, 'actions rounded-lg']"
            color="#707070"
            dark
            @click="goToMovement(item.id)"
            v-if="meDetails && meDetails['user_type'] == 0"
            >{{ $t("productMovement") }}</v-btn
          >
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
        </td>
      </template>
    </v-data-table>
    <div class="responsive-cards">
      <div v-if="getProducts.length == 0" class="no-data-container">
        <p>{{ $t("noProducts") }}</p>
      </div>
      <template v-else>
        <v-row>
          <v-col
            v-for="product in getProducts"
            :key="product.id"
            cols="12"
            sm="6"
            xs="12"
          >
            <v-card class="mx-auto my-2" outlined>
              <v-card-text>
                <v-row>
                  <template v-for="header in filterHeaders">
                    <v-col
                      cols="12"
                      md="6"
                      xs="12"
                      v-if="header.value != 'actions'"
                      :key="header.value"
                      class="d-flex justify-start align-center pb-0"
                      style="gap: 5px"
                    >
                      <span>{{ header.text }} :</span>
                      <p>
                        {{
                          ["price_after_tax", "price_before_tax"].includes(
                            header.value
                          )
                            ? $RoundingNumber(product[header.value], "product")
                            : product[header.value]
                        }}
                      </p>
                    </v-col>
                    <template v-else>
                      <v-col
                        cols="12"
                        :key="header.value"
                        class="d-flex justify-end align-center pb-1 card-actions"
                      >
                        <v-btn
                          :class="[marginTwo, 'actions rounded-lg']"
                          color="#707070"
                          dark
                          @click="goToMovement(product.id)"
                          v-if="meDetails && meDetails['user_type'] == 0"
                          >{{ $t("productMovement") }}</v-btn
                        >
                        <v-btn
                          :class="[marginTwo, 'actions rounded-lg']"
                          color="#2BB3B3"
                          dark
                          @click="editItem(product)"
                          >{{ $t("edit") }}</v-btn
                        >
                        <v-btn
                          :class="[marginTwo, 'actions rounded-lg']"
                          color="#E50D0D"
                          dark
                          @click="removeItem(product)"
                          >{{ $t("delete") }}</v-btn
                        >
                      </v-col>
                    </template>
                  </template>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </div>
    <v-pagination
      v-model="currentPage"
      :length="getPageCount"
      class="pagination"
      :next-icon="$t('next')"
      :prev-icon="$t('previous')"
    ></v-pagination>
    <v-dialog v-model="barcodeDialog" max-width="400px">
      <v-card>
        <v-container>
          <v-card-text class="text-center pb-0">
            <svg id="barcode"></svg>
          </v-card-text>
          <v-card-actions class="d-flex justify-center">
            <v-btn
              class="actions rounded-lg pt-0"
              color="#4FCA9A"
              dark
              @click="printBarcode"
              >{{ $t("print") }}</v-btn
            >
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
    <iframe id="printFrame" style="display: none"></iframe>
    <v-dialog
      v-model="dialog"
      :max-width="$vuetify.breakpoint.width < 425 ? '100%' : '450px'"
      @click:outside="close"
    >
      <v-card
        class="mx-auto"
        :style="
          $vuetify.breakpoint.width < 425 ? 'padding:0 ' : 'padding: 0 1.5rem'
        "
      >
        <v-card-title class="d-flex flex-column justify-center img-file">
          <label v-ripple for="upload_img">
            <v-file-input
              v-model="editedItem.image"
              style="display: none"
              id="upload_img"
              @change="onFileChange"
              accept="image/png, image/jpeg, image/bmp"
            ></v-file-input>
            <v-avatar width="60" height="60" tile>
              <v-img v-if="selectedImage" :src="selectedImage"></v-img>
              <v-icon v-else>photo_camera</v-icon>
            </v-avatar>
          </label>
          <span style="font-size: 0.75rem"
            >يجب ان يكون حجم الصورة اقل من 2 ميجا</span
          >
        </v-card-title>
        <v-card-text>
          <v-form class="form-container" ref="form" lazy-validation>
            <div v-if="getErrors">
              <v-alert dense outlined type="error">
                {{ getErrors }}
              </v-alert>
            </div>
            <div class="form-row-container">
              <div class="form-col-container">
                <label class="black--text">{{ $t("productNameAr") }}</label>
                <v-text-field
                  v-model="editedItem.name.ar"
                  :placeholder="$t('productNameAr')"
                  color="#8F8F8F"
                  outlined
                  :rules="requiredRule"
                  required
                ></v-text-field>
              </div>
              <div class="form-col-container">
                <label class="black--text">{{ $t("productNameEn") }}</label>
                <v-text-field
                  v-model="editedItem.name.en"
                  :placeholder="$t('productNameEn')"
                  color="#8F8F8F"
                  outlined
                ></v-text-field>
              </div>
            </div>
            <div class="form-row-container">
              <div class="form-col-container">
                <label class="black--text">{{ $t("barcode") }}</label>
                <v-text-field
                  v-model="editedItem.serial"
                  :placeholder="$t('barcode')"
                  color="#8F8F8F"
                  outlined
                  :rules="requiredRule"
                  required
                ></v-text-field>
              </div>
              <div class="form-col-container">
                <label class="black--text">{{ $t("category") }}</label>
                <v-autocomplete
                  :items="categories"
                  v-model="editedItem.categories"
                  item-text="title"
                  item-value="id"
                  small-chips
                  outlined
                  multiple
                ></v-autocomplete>
              </div>
            </div>
            <div>
              <label class="black--text">{{ $t("description") }}</label>
              <v-textarea
                v-model="editedItem.description"
                :placeholder="$t('description')"
                auto-grow
                outlined
                rows="3"
                color="#8F8F8F"
              ></v-textarea>
            </div>
            <div class="form-row-container">
              <div
                :style="
                  $vuetify.breakpoint.width < 425 ? 'width:100%' : 'width: 30%;'
                "
              >
                <label class="black--text">{{
                  $vuetify.breakpoint.width < 520
                    ? $t("pAT")
                    : $t("priceBeforeTax")
                }}</label>
                <v-text-field
                  v-model="price_before_tax"
                  @input="calculatePriceAfterTax(price_before_tax, 'price')"
                  :placeholder="$t('priceBeforeTax')"
                  color="#8F8F8F"
                  outlined
                  :rules="requiredRule"
                  required
                ></v-text-field>
              </div>
              <div
                :style="
                  $vuetify.breakpoint.width < 425 ? 'width:100%' : 'width: 30%;'
                "
              >
                <label class="black--text">{{
                  $vuetify.breakpoint.width < 520
                    ? $t("pAT")
                    : $t("priceAfterTax")
                }}</label>
                <v-text-field
                  v-model="price_after_tax"
                  @input="calculatePriceBeforeTax(price_after_tax)"
                  :placeholder="$t('priceAfterTax')"
                  color="#8F8F8F"
                  outlined
                  :rules="requiredRule"
                  required
                ></v-text-field>
              </div>
              <div
                :style="
                  $vuetify.breakpoint.width < 425 ? 'width:100%' : 'width: 30%;'
                "
              >
                <label class="black--text">{{ $t("cost") }}</label>
                <v-text-field
                  v-model="editedItem.cost_before_tax"
                  :placeholder="$t('cost')"
                  @input="
                    calculatePriceAfterTax(editedItem.cost_before_tax, 'cost')
                  "
                  color="#8F8F8F"
                  :rules="costRule"
                  outlined
                ></v-text-field>
              </div>
            </div>
            <div class="form-row-container">
              <div
                class="d-flex justify-space-between align-center"
                :style="{
                  direction: $i18n.locale == 'en' ? 'rtl' : 'ltr',
                  width:
                    measurable && $vuetify.breakpoint.width > 425
                      ? '50%'
                      : '100%',
                }"
              >
                <v-switch
                  id="measurable"
                  color="success"
                  v-model="measurable"
                  class="mt-0"
                  hide-details
                  :style="
                    $i18n.locale == 'en' ? 'direction:ltr' : 'direction:rlt'
                  "
                ></v-switch>
                <p class="mb-1">
                  {{ $t("Quantifiable") }}
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon color="#4fca9a" v-on="on"
                        >mdi-alert-circle-outline</v-icon
                      >
                    </template>
                    <span>{{ $t("tooltipMsg") }}</span>
                  </v-tooltip>
                </p>
              </div>
              <div v-if="measurable" class="form-col-container">
                <label class="black--text">{{ $t("qty") }}</label>
                <v-text-field
                  v-model="editedItem.quantity"
                  :placeholder="$t('qty')"
                  color="#8F8F8F"
                  outlined
                  :rules="requiredRule"
                  required
                ></v-text-field>
              </div>
            </div>
            <div class="d-flex justify-center align-center pb-5">
              <v-btn
                color="#62C83F"
                class="white--text"
                @click="save"
                height="30"
                width="35%"
              >
                {{ editedIndex == -1 ? $t("addProduct") : $t("edit") }}
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
    <v-dialog v-model="excelDialog" width="550">
      <v-card>
        <v-container class="pt-0">
          <v-card-title class="d-flex justify-space-between align-center pb-1">
            {{ $t("addProductViaExcel") }}
            <v-icon color="black" @click="excelDialog = false"
              >mdi-close</v-icon
            ></v-card-title
          >
          <v-divider></v-divider>
          <v-card-text class="text-start" style="font-family: 'BahjiiBold'">
            <div class="excel-content">
              <p
                :style="
                  $i18n.locale ? 'margin-left:10px;' : 'margin-right:10px;'
                "
              >
                {{ $t("excelUploadHint") }}
              </p>
              <ol :class="[marginThree, 'my-3']">
                <li>
                  {{ $t("excelUploadTip1") }}
                </li>
                <li>{{ $t("excelUploadTip2") }}</li>
                <li>{{ $t("excelUploadTip3") }}</li>
              </ol>
            </div>
            <v-file-input
              ref="fileInputProduct"
              v-model="excelFile"
              style="display: none"
            ></v-file-input>
            <v-btn
              class="actions rounded-lg"
              color="#707070"
              dark
              @click="openFileInput"
              :style="$i18n.locale ? 'margin-left:10px;' : 'margin-right:10px;'"
            >
              {{ $t("uploadExcelFile") }}
            </v-btn>
            <p :class="marginTwo" style="display: inline-block">
              {{ excelFile == null ? $t("noFiles") : excelFile.name }}
            </p>
            <div v-if="error">
              <v-alert dense outlined type="error">
                {{ error }}
              </v-alert>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions
            :class="['d-flex justify-center align-center']"
            style="font-family: 'BahjiiSemiBold'"
          >
            <v-btn
              color="#62C83F"
              dark
              width="auto"
              @click="getExcelFile"
              class="actions rounded-lg"
            >
              {{ $t("sampleExcelFile") }}
            </v-btn>
            <v-btn
              color="#62C83F"
              outlined
              width="auto"
              :class="[marginTwo, 'actions rounded-lg']"
              @click="importFile"
            >
              {{ $t("importProduct") }}
            </v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
    <alert-dialog v-if="dialogDelete" @close="close" :close="close">
      <template #title>{{ $t("areYouSureDeleteProduct") }}</template>
      <template #actions>
        <v-btn
          color="#62C83F"
          class="rounded-lg white--text mb-2 ml-2"
          @click="deleteItemConfirm"
          >{{ $t("accept") }}</v-btn
        >
      </template>
    </alert-dialog>
    <alert-dialog v-if="serviceValidationDialog" @close="close" :close="close">
      <template #title> {{ $t("shouldUpgrade") }} </template>
      <template #default>
        <v-btn
          color="#4FCA9A"
          width="150"
          class="rounded-lg white--text"
          to="/subscriptions"
          >{{ $t("updateNow") }}</v-btn
        >
        <v-btn
          color="#4FCA9A"
          width="150"
          :class="[marginTwo, 'rounded-lg white--text']"
          @click="serviceValidationDialog = false"
          >{{ $t("notNow") }}</v-btn
        >
      </template>
    </alert-dialog>
    <alert-dialog
      v-if="warningDialog"
      :buttonName="$t('done')"
      color="#4fca9a"
      :close="() => (warningDialog = false)"
      @close="warningDialog = false"
    >
      <template #text>
        <p class="mb-2">
          <v-icon color="red" size="12" class="ml-1">emergency</v-icon>
          {{ message }}
        </p>
      </template>
    </alert-dialog>
  </v-container>
</template>
<script>
import axios from "axios";
import JsBarcode from "jsbarcode";
import { saveAs } from "file-saver";

export default {
  data() {
    return {
      userDetails: null,
      meDetails: null,
      userType: null,
      currentPage: 1,
      itemsPerPage: 10,
      dialog: false,
      dialogDelete: false,
      excelDialog: false,
      barcodeDialog: false,
      serviceValidationDialog: false,
      warningDialog: false,
      message: null,
      editedIndex: -1,
      searchProduct: "",
      count: null,
      showInput: false,
      categories: [],
      editedItem: {
        name: {
          ar: "",
          en: "",
        },
        serial: "",
        description: "",
        price_before_tax: 0,
        price_after_tax: 0,
        cost_before_tax: 0,
        cost_after_tax: 0,
        categories: [],
        image: null,
        measurable: "unmeasurable",
        quantity: 0,
      },
      defaultItem: {
        name: {
          ar: "",
          en: "",
        },
        serial: "",
        description: "",
        price_before_tax: 0,
        price_after_tax: 0,
        cost_before_tax: 0,
        cost_after_tax: 0,
        categories: [],
        image: null,
        measurable: "unmeasurable",
        quantity: 0,
      },
      price_before_tax: 0,
      price_after_tax: 0,
      productImage: null,
      selectedImage: null,
      excelFile: null,
      requiredRule: [(v) => !!v || this.$t("fieldRequired")],
      nameArabicRule: [(v) => !!v || this.$t("fieldRequired")],
      costRule: [
        (v) =>
          Number(v) <= Number(this.editedItem.price_before_tax) ||
          "يجب ان تكون التكلفة اقل من سعر المنتج",
      ],
      error: null,
      tax: null,
      measurable: false,
    };
  },
  methods: {
    getData() {
      this.userDetails = JSON.parse(localStorage.getItem("userDetails"));
      this.meDetails = JSON.parse(localStorage.getItem("meDetails"));
      this.userType = this.meDetails.user_type;
      if (this.userDetails["market_name"] != null) {
        this.$store.dispatch("tax");
        this.$store.dispatch("products", this.currentPage);
        this.getCategories();
      }
    },
    onFileChange(e) {
      this.selectedImage = URL.createObjectURL(e);
    },
    getCategories() {
      axios
        .get("categories", {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          this.categories = res.data.categories.data;
        })
        .catch((err) => {
          if (err.response.data.message == "Unauthenticated.")
            this.$store.dispatch("logout");
        });
    },
    exportProduct() {
      if (
        this.meDetails["is_subscribed"] &&
        this.meDetails["subscription"]["product_excel"]
      ) {
        if (
          this.userType == 1 &&
          !this.meDetails.employee_permissions.includes("products-export")
        ) {
          this.message = this.$t("haveNoPermissionExportProd");
          this.warningDialog = true;
          return;
        }
        axios
          .post(
            "exportProduct",
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              responseType: "arraybuffer",
            }
          )
          .then((res) => {
            const data = new Blob([res.data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            saveAs(data, "products_excel_file.xlsx");
          })
          .catch((err) => console.log(err));
      } else {
        this.serviceValidationDialog = true;
      }
    },
    openExcelDialog() {
      if (
        this.meDetails["is_subscribed"] &&
        this.meDetails["subscription"]["product_excel"]
      ) {
        if (
          !this.meDetails.employee_permissions.includes("products-import") &&
          this.userType == 1
        ) {
          this.message = this.$t("haveNoPermissionImprtProd");
          this.warningDialog = true;
          return;
        }
        this.excelDialog = true;
      } else this.serviceValidationDialog = true;
    },
    getExcelFile() {
      axios
        .get("sampleProduct", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          responseType: "arraybuffer",
        })
        .then((res) => {
          const data = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          saveAs(data, "excel_file.xlsx");
        })
        .catch((err) => console.log(err));
    },
    importFile() {
      axios
        .post(
          "importProduct",
          {
            file: this.excelFile,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "content-type": "multipart/form-data",
            },
          }
        )
        .then(() => {
          this.excelDialog = false;
          this.excelFile = null;
          this.getData();
        })
        .catch((err) => {
          this.error = err.response.data.message;
        });
    },
    // search for specific product
    search(page) {
      if (this.searchProduct)
        this.$store.dispatch("searchProduct", {
          page: page,
          searchProduct: this.searchProduct,
        });
      else this.getData();
    },
    generateBarcode(serialNumber) {
      this.barcodeDialog = true;
      this.$nextTick(() => {
        JsBarcode("#barcode", serialNumber, {
          format: "CODE128",
          displayValue: true,
        });
      });
    },
    //print barcode
    printBarcode() {
      const printFrame = document.getElementById("printFrame").contentWindow;
      const barcodeElement = document.getElementById("barcode");
      printFrame.document.open();
      printFrame.document.write(
        `<html><body style="text-align:center;"><svg>${barcodeElement.innerHTML}</svg></body></html>`
      );
      printFrame.document.close();
      printFrame.print();
    },
    // open model for create product
    openModal() {
      if (
        this.userType == 1 &&
        !this.meDetails.employee_permissions.includes("products-add")
      ) {
        this.message = this.$t("haveNoPermissionAddProd");
        this.warningDialog = true;
        return;
      } else {
        this.editedItem["serial"] = Math.floor(Math.random() * 100000000);
        this.dialog = true;
      }
    },
    openFileInput() {
      this.$refs.fileInputProduct.$refs.input.click();
    },

    editItem(item) {
      if (
        this.userType == 1 &&
        !this.meDetails.employee_permissions.includes("products-update")
      ) {
        this.message = this.$t("haveNoPermissionUpdateProd");
        this.warningDialog = true;
        return;
      } else {
        this.editedIndex = this.getProducts.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.price_before_tax = this.editedItem.price_before_tax;
        this.price_after_tax = this.editedItem.price_after_tax;
        if (this.editedItem.measurable == "measurable") this.measurable = true;
        else this.measurable = false;
        this.selectedImage = this.editedItem.image;
        this.editedItem.name = Object.assign({}, item.name_json);
        this.editedItem.image = null;
        this.dialog = true;
      }
    },
    save() {
      if (this.$refs.form.validate()) {
        if (this.editedIndex == -1) {
          this.$store.dispatch("addProduct", {
            ...this.editedItem,
            measurable: this.measurable == true ? "measurable" : "unmeasurable",
          });
        } else {
          if (this.measurable) this.editedItem.measurable = "measurable";
          else {
            this.editedItem.measurable = "unmeasurable";
            this.editedItem.quantity = null;
          }
          if (
            this.editedItem.categories.every((item) => typeof item === "object")
          )
            this.editedItem.categories = this.editedItem.categories.map(
              (category) => category.id
            );
          const productID = this.getProducts[this.editedIndex].id;
          this.$store.dispatch("editProduct", {
            id: productID,
            product: this.editedItem,
          });
        }
        setTimeout(() => {
          if (this.getErrors == null) this.refreshData();
        }, 1000);
      }
    },
    removeItem(item) {
      if (
        this.userType == 1 &&
        !this.meDetails.employee_permissions.includes("products-delete")
      ) {
        this.message = this.$t("haveNoPermissionDeleteProd");
        this.warningDialog = true;
        return;
      } else {
        this.editedIndex = item.id;
        this.dialogDelete = true;
      }
    },
    deleteItemConfirm() {
      this.$store.dispatch("deleteProduct", this.editedIndex);
      setTimeout(() => this.refreshData(), 2000);
    },
    goToMovement(productId) {
      if (
        this.meDetails["is_subscribed"] &&
        this.meDetails["subscription"]["product_movement"]
      )
        this.$router.push({
          name: "product-movement",
          params: {
            productId: productId,
          },
        });
      else this.serviceValidationDialog = true;
    },
    filterCategory(categories) {
      if (categories.length > 1)
        return categories.filter((item) => item.title != "Miscellaneous");
      else return categories;
    },
    calculatePriceAfterTax(val, type) {
      this.editedItem.price_before_tax = this.price_before_tax;
      var key = type == "cost" ? "cost_after_tax" : "price_after_tax";
      if (val == "") this.editedItem[key] = this.price_after_tax = 0;
      else {
        this.editedItem[key] = Number(val) * (1 + this.getTax);
      }
      this.price_after_tax = this.$RoundingNumber(
        this.editedItem["price_after_tax"],
        "product"
      );
    },
    calculatePriceBeforeTax(val) {
      this.editedItem.price_after_tax = this.price_after_tax;
      if (val == "")
        this.editedItem["price_before_tax"] = this.price_before_tax = 0;
      else {
        this.editedItem["price_before_tax"] = Number(val) / (1 + this.getTax);
        this.price_before_tax = this.$RoundingNumber(
          this.editedItem["price_before_tax"],
          "product"
        );
      }
    },
    addProduct(item) {
      localStorage.setItem("product", JSON.stringify(item));
      this.$router.push("/cashier");
    },
    refreshData() {
      this.getData();
      this.close();
    },
    close() {
      this.dialog =
        this.dialogDelete =
        this.measurable =
        this.serviceValidationDialog =
          false;
      this.$refs.form.reset();
      this.editedIndex = -1;
      this.error = null;
      this.openingBalance = 0;
      this.$store.commit("setProductsErrors", null);
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    currentPage(val) {
      if (this.searchProduct) this.search(val);
      else this.getData();
    },
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t("productName"),
          align: "center",
          sortable: false,
          value: "name",
        },
        {
          text: this.$t("barcode"),
          align: "center",
          sortable: false,
          value: "serial",
        },
        {
          text:
            localStorage.getItem("taxInvoice") == 1
              ? this.$t("priceBeforeTax")
              : this.$t("price"),
          align: "center",
          sortable: false,
          value: "price_before_tax",
        },
        {
          text: this.$t("priceAfterTax"),
          align: "center",
          sortable: false,
          value: "price_after_tax",
        },
        {
          text: this.$t("category"),
          align: "center",
          sortable: false,
          value: "categories",
        },
        {
          text: this.$t("icon"),
          align: "center",
          sortable: false,
          value: "image",
        },
        {
          text: this.$t("actions"),
          align: "center",
          sortable: false,
          value: "actions",
        },
      ];
    },
    filterHeaders() {
      const taxInvoice = localStorage.getItem("taxInvoice");
      if (taxInvoice == 1) {
        return this.$vuetify.breakpoint.smAndDown
          ? this.headers.filter(
              (item) => item.value != "image" && item.value != "categories"
            )
          : this.headers;
      } else
        return this.$vuetify.breakpoint.smAndDown
          ? this.headers.filter(
              (item) =>
                item.value != "image" &&
                item.value != "categories" &&
                item.value != "price_after_tax"
            )
          : this.headers.filter((item) => item.value != "price_after_tax");
    },
    getProducts() {
      return this.$store.getters.getProducts
        ? this.$store.getters.getProducts
        : [];
    },
    getPageCount() {
      return this.$store.getters.getPageCount;
    },
    getTax() {
      return this.$store.getters.getTax;
    },
    getErrors() {
      return this.$store.getters.getProductsErrors;
    },
    marginThree() {
      return this.$i18n.locale == "en" ? "ml-3" : "mr-3";
    },
    marginTwo() {
      return this.$i18n.locale == "en" ? "ml-2" : "mr-2";
    },
    marginOne() {
      return this.$i18n.locale == "en" ? "ml-1" : "mr-1";
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style scoped>
@import "../../assets/styles/style.css";

.excel-content {
  font-size: 12px;
}

.actions::v-deep span {
  letter-spacing: 0;
}

.v-input--switch :deep(.v-input__slot) {
  background: none !important;
}

.form-row-container {
  display: flex;
  justify-content: space-between;
  align-content: center;
  gap: 10px;
}

.form-row-container .form-col-container {
  width: 50%;
}

.img-file label {
  cursor: pointer !important;
  border: 1px solid #d2d2d2 !important;
}

@media screen and (min-width: 840px) {
  .tableStriped {
    display: block;
  }

  .responsive-cards {
    display: none;
  }
}

@media screen and (max-width: 839px) {
  .tableStriped {
    display: none;
  }

  .responsive-cards {
    display: block;
  }
}

@media (max-width: 425px) {
  .form-row-container {
    flex-direction: column;
    gap: 0;
  }

  .form-row-container .form-col-container {
    width: 100%;
  }
}
</style>
