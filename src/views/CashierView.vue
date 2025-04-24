<template>
  <v-container fluid style="padding: 0; height: calc(100vh - 64px)">
    <div style="height: 100%; display: flex; align-items: stretch">
      <div class="right-side">
        <div class="scroll-x categories-container px-1" v-if="categories">
          <v-btn
            :outlined="activeButtonIndex == -1 ? false : true"
            :dark="activeButtonIndex == -1 ? true : false"
            color="#4fca9a"
            @click="selectCategory(-1, null)"
            :class="$i18n.locale == 'ar' ? 'mr-0' : ''"
          >
            <span>{{ $t("all") }}</span>
          </v-btn>
          <v-btn
            v-for="(category, index) in categories"
            :key="index"
            :outlined="activeButtonIndex == index ? false : true"
            :dark="activeButtonIndex == index ? true : false"
            color="#4fca9a"
            @click="selectCategory(index, category.id)"
          >
            <span>{{ category.title }}</span>
          </v-btn>
        </div>
        <div
          class="product-container d-flex justify-space-between align-center px-1"
        >
          <div class="product-search-container">
            <v-text-field
              color="#4fca9a"
              hide-details
              outlined
              v-model="searchProduct"
              @input="search('input')"
              :placeholder="$t('search')"
              append-icon="mdi-barcode"
              prepend-inner-icon="search"
            >
            </v-text-field>
          </div>
          <div
            class="shift-container d-flex justify-space-between align-center px-2"
            style="width: 20%"
            v-if="hasAShift"
          >
            <div class="d-flex justify-center align-center" style="gap: 5px">
              <v-avatar size="30" tile
                ><img src="@/assets/icons/cashier-machine.png"
              /></v-avatar>
              <p>
                {{ meDetails["open_shift"]["tiler"]["name"] }}
              </p>
            </div>
            <v-btn icon @click="shiftReportDialog = true">
              <v-icon size="25" color="red">mdi-logout</v-icon>
            </v-btn>
          </div>
          <v-btn
            color="#4fca9a"
            class="add-btn-product"
            outlined
            @click="openDialog('product')"
          >
            <v-icon
              :left="$i18n.locale == 'en'"
              :right="$i18n.locale == 'ar'"
              size="22"
              >add_circle_outline</v-icon
            >
            <span class="addText">{{ $t("addNewProduct") }}</span></v-btn
          >
        </div>
        <v-row
          no-gutters
          class="mt-4 product-list-container"
          v-if="products.length != 0"
        >
          <v-col
            v-for="(product, index) in products"
            :key="index"
            cols="4"
            lg="2"
            md="3"
          >
            <div
              class="product-details"
              @click.prevent="addProduct(product, 'Existing')"
            >
              <div class="product-image">
                <div
                  :style="product.image == null ? '' : 'width:100%;height:100%'"
                >
                  <v-img
                    :src="
                      product.image == null ? 'imgs/product.png' : product.image
                    "
                    :style="
                      product.image == null
                        ? 'width:55px;height:55px'
                        : 'width:100%;height:100%'
                    "
                  ></v-img>
                </div>
                <div class="product-price">
                  {{
                    $RoundingNumber(product[getPriceValue], "product") +
                    " " +
                    $t("SRmini")
                  }}
                </div>
              </div>
              <div
                class="product-inf d-flex justify-space-around align-center"
                style="width: 100%"
              >
                <v-icon color="#4fca9a">toc</v-icon>
                <p class="product-name">{{ product.name }}</p>
              </div>
            </div>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col cols="12" class="d-flex justify-center mt-10">
            <h3>{{ $t("noProduct") }}</h3>
          </v-col>
        </v-row>
        <div
          class="total-responsive"
          v-if="$vuetify.breakpoint.width < 769"
          @click="openInvoiceDialog = true"
        >
          <span> {{ $t("total") }}</span>
          <span class="d-flex justify-start align-center">
            {{
              $RoundingNumber(
                taxInvoice == 1
                  ? totalPriceAfterTax
                  : discountValue != 0
                  ? totalPriceAfterDiscount
                  : totalPriceBeforeTax,
                "total"
              ) + $t("SRmini")
            }}
            <v-icon color="white"> mdi-chevron-left</v-icon>
          </span>
        </div>
      </div>
      <div class="left-side" v-if="$vuetify.breakpoint.width > 768">
        <div
          class="px-2 invoice-details-container"
          :style="
            panelExpanded == 0
              ? discountValue == 0
                ? 'height:65%'
                : 'height:55%'
              : 'height:85%'
          "
        >
          <div
            class="top-input-container invoice-checkbox"
            style="width: 100%"
            v-if="taxInvoice == 1 && title == 'sales'"
          >
            <v-checkbox
              v-model="taxInvoiceCheck"
              @change="changeCheck('tax')"
              :label="$t('taxedInvoice')"
              color="#4fca9a"
              class="mt-0"
              hide-details
            ></v-checkbox>
            <v-checkbox
              v-model="simpleTaxInvoiceCheck"
              @change="changeCheck('simple')"
              :label="$t('simpleTaxedInvoice')"
              color="#4fca9a"
              class="mt-0 mr-0"
              hide-details
            ></v-checkbox>
          </div>
          <h3 v-else>
            {{ cashierTitle }}
          </h3>
          <div
            :class="['top-input-container', title == 'purchases' ? '' : 'mt-2']"
          >
            <div class="top-input-container static-content" style="gap: 0">
              <v-icon color="rgba(0,0,0,.87)" size="20">{{
                $i18n.locale == "en" ? "chevron_right" : "chevron_left"
              }}</v-icon>
              <label>
                {{ $t("invoiceNumber") + ":" }}
                <span style="color: rgba(0, 0, 0, 0.6)">{{
                  $t("automatic")
                }}</span>
              </label>
            </div>
            <div
              class="top-input-container static-content"
              v-if="title != 'purchases'"
              style="gap: 0"
            >
              <v-icon color="rgba(0,0,0,.87)" size="20">{{
                $i18n.locale == "en" ? "chevron_right" : "chevron_left"
              }}</v-icon>
              <label>
                {{
                  title == "priceQuote"
                    ? $t("quotationDate")
                    : $t("invoiceDate")
                }}
                :<span style="color: rgba(0, 0, 0, 0.6)">{{
                  new Date().toLocaleDateString()
                }}</span>
              </label>
            </div>
            <div
              class="top-input-container input-number"
              v-if="title == 'purchases'"
              style="width: 60%"
            >
              <label>
                {{ $t("supplierInvoiceNum") }}
                :</label
              >
              <v-text-field
                outlined
                hide-details
                :placeholder="$t('supplierInvoiceNum')"
                color="#d2d2d2"
                v-model="supplierInvoiceNum"
                style="width: 30%"
              ></v-text-field>
            </div>
          </div>
          <div class="top-input-container">
            <div class="input-supplier" v-if="title == 'purchases'">
              <v-autocomplete
                :items="getSuppliers"
                v-model="supplier"
                item-text="name"
                outlined
                hide-details
                color="#D2D2D2"
                :placeholder="$t('supplierName')"
                return-object
              ></v-autocomplete>
              <v-btn
                dark
                color="#4FCA9A"
                height="30px"
                width="25"
                class="add-btn"
                @click="openDialog('supplier')"
              >
                <v-icon color="white" size="25">add_box</v-icon>
              </v-btn>
            </div>
            <div class="input-customer" v-else>
              <label> {{ $t("client") }}:</label>
              <v-autocomplete
                :items="getClients"
                v-model="client"
                item-text="name"
                outlined
                hide-details
                color="#D2D2D2"
                :placeholder="$t('client')"
                return-object
              >
                <template v-slot:item="{ item }">
                  <div class="client-item">
                    <div class="client-name font-weight-bold">
                      {{ item.name }}
                    </div>
                    <div
                      class="client-tax-number"
                      v-if="item.tax_number != null"
                    >
                      {{ item.tax_number }}
                    </div>
                  </div>
                </template>
              </v-autocomplete>
              <v-btn
                dark
                color="#4FCA9A"
                height="30px"
                width="20"
                class="add-btn"
                @click="openDialog('customer')"
              >
                <v-icon color="white" size="25">add_box</v-icon>
              </v-btn>
            </div>
            <div class="input-image mr-2" v-if="title == 'purchases'">
              <v-file-input
                ref="fileInput"
                v-model="supplierInvoiceImg"
                outlined
                color="#D2D2D2"
                class="fileInput"
                :placeholder="$t('supplierInvoiceImage')"
                hide-details
              >
              </v-file-input>
              <v-btn
                dark
                color="#4FCA9A"
                height="30px"
                width="25"
                class="add-btn"
                @click="openFileInput"
              >
                <v-icon color="white" size="25">mdi-image-multiple</v-icon>
              </v-btn>
            </div>
          </div>
          <div class="top-input-container">
            <div
              class="input-supplier"
              v-if="taxInvoiceCheck && title == 'sales'"
            >
              <label> {{ $t("importDate") }}:</label>
              <v-text-field
                type="date"
                v-model="supplyDate"
                outlined
                hide-details
                color="#D2D2D2"
              ></v-text-field>
            </div>
          </div>
          <v-divider></v-divider>
          <v-expansion-panels multiple class="mt-2 product-panels">
            <v-expansion-panel
              v-for="(product, index) in tableProducts"
              :key="product.id"
              class="list-product-container mt-2"
            >
              <v-expansion-panel-header class="justify-space-between header">
                <span
                  :style="
                    $i18n.locale == 'ar' ? 'direction:rtl;' : 'direction:ltrl'
                  "
                >
                  {{
                    taxInvoice == 1
                      ? $RoundingNumber(
                          product[valueAfterTax] * product.quantity,
                          "product"
                        )
                      : $RoundingNumber(
                          product[valueBeforeTax] * product.quantity,
                          "product"
                        )
                  }}
                  {{ $t("SRmini") }}
                </span>
                <template #actions>
                  <div class="d-flex justify-start align-center">
                    <div>
                      <span>{{ product["name"] }}</span>
                      <span class="mx-2">X</span>
                      <span>{{ product["quantity"] }}</span>
                    </div>
                    <v-icon> mdi-chevron-down</v-icon>
                  </div>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div class="list-product-inf-container" style="gap: 5px">
                  <div class="list-product-inf">
                    <label>{{ $t("qty") }}</label>
                    <v-text-field
                      v-model="product.quantity"
                      @input="validateQty(index)"
                      color="#d2d2d2"
                      outlined
                      hide-details
                      :placeholder="$t('qty')"
                    ></v-text-field>
                  </div>
                  <div class="list-product-inf">
                    <label>{{
                      title == "purchases"
                        ? $t("cost")
                        : taxInvoice == 1
                        ? $t("pBT")
                        : $t("price")
                    }}</label>
                    <v-text-field
                      v-model="product[valueBeforeTax]"
                      color="#d2d2d2"
                      outlined
                      hide-details
                      @input="
                        calculatePriceAfterTax(
                          product[valueBeforeTax],
                          index,
                          valueAfterTax
                        )
                      "
                    ></v-text-field>
                  </div>
                  <div class="list-product-inf" v-if="taxInvoice == 1">
                    <label>{{ title == "purchases"
                      ? $t("costAfterTax")
                      : $t("pAT"), }}</label>
                    <v-text-field
                      v-model="product[valueAfterTax]"
                      @input="
                        calculatePriceBeforeTax(product[valueAfterTax], index)
                      "
                      color="#d2d2d2"
                      outlined
                      hide-details
                    ></v-text-field>
                  </div>
                  <div class="list-product-inf">
                    <label>{{ $t("total") }}</label>
                    <v-text-field
                      :value="
                        taxInvoice == 1
                          ? $RoundingNumber(
                              product[valueAfterTax] * product.quantity,
                              'product'
                            )
                          : $RoundingNumber(
                              product[valueBeforeTax] * product.quantity,
                              'product'
                            )
                      "
                      readonly
                      color="#d2d2d2"
                      outlined
                      hide-details
                    ></v-text-field>
                  </div>
                  <div class="list-product-inf">
                    <v-icon
                      @click.stop="product.makeNote = !product.makeNote"
                      color="primary"
                    >
                      edit_document
                    </v-icon>
                    <v-icon @click.stop="removeRow(product)" color="red"
                      >delete</v-icon
                    >
                  </div>
                </div>
                <div
                  v-if="product.makeNote"
                  class="list-product-inf mt-1"
                  style="direction: ltr"
                >
                  <v-text-field
                    v-model="product.description"
                    :placeholder="$t('addNote')"
                    hide-details
                    color="#d2d2d2"
                    outlined
                  ></v-text-field>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
        <div class="bottom-side">
          <v-expansion-panels v-model="panelExpanded">
            <v-expansion-panel>
              <v-expansion-panel-header class="justify-space-between header">
                {{ $t("total") }}
                <template #actions>
                  <div class="d-flex justify-start align-center">
                    {{
                      $RoundingNumber(
                        taxInvoice == 1
                          ? totalPriceAfterTax
                          : discountValue != 0
                          ? totalPriceAfterDiscount
                          : totalPriceBeforeTax,
                        "total"
                      ) + $t("SRmini")
                    }}
                    <v-icon> mdi-chevron-down</v-icon>
                  </div>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div class="panel-content">
                  <p>{{ taxInvoice == 1 ? $t("subtotal") : $t("total") }} :</p>
                  <p>
                    {{
                      $RoundingNumber(totalPriceBeforeTax, "product") +
                      " " +
                      $t("SRmini")
                    }}
                  </p>
                </div>
                <div class="panel-content" v-if="discountValue != 0">
                  <p>
                    {{ $t("discountValue") }}
                    :
                  </p>
                  <p>
                    {{
                      (discountValue ? discountValue : 0) +
                      " " +
                      (this.discountFixed ? $t("SRmini") : "%")
                    }}
                  </p>
                </div>
                <div class="panel-content" v-if="discountValue != 0">
                  <p>
                    {{ $t("priceAfterDiscount") }}
                    :
                  </p>
                  <p>
                    {{
                      $RoundingNumber(this.totalPriceAfterDiscount, "product") +
                      " " +
                      $t("SRmini")
                    }}
                  </p>
                </div>
                <div class="panel-content" v-if="taxInvoice == 1">
                  <p>{{ $t("AddedTax") }} :</p>
                  <p>
                    {{
                      $RoundingNumber(addedTax, "product") + " " + $t("SRmini")
                    }}
                  </p>
                </div>
                <div class="panel-content" v-if="taxInvoice == 1">
                  <p>{{ $t("totalWithTax") }} :</p>
                  <p>
                    {{
                      $RoundingNumber(totalPriceAfterTax, "total") +
                      " " +
                      $t("SRmini")
                    }}
                  </p>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <div class="btn-container">
            <v-btn
              color="#4FCA9A "
              class="rounded-0"
              dark
              @click="
                () => {
                  message = null;
                  discountDialog = true;
                }
              "
            >
              <v-icon
                :right="$i18n.locale == 'ar'"
                :left="$i18n.locale == 'en'"
              >
                mdi-plus
              </v-icon>
              {{ $t("addDiscount") }}
            </v-btn>

            <v-btn
              color="#4FCA9A "
              class="rounded-0"
              outlined
              @click="printInvoice('print')"
            >
              <v-icon
                :right="$i18n.locale == 'ar'"
                :left="$i18n.locale == 'en'"
              >
                mdi-plus
              </v-icon>
              {{
                title == "priceQuote"
                  ? $t("createPriceQuote")
                  : $t("createInvoice")
              }}
            </v-btn>

            <v-btn
              color="#4FCA9A"
              class="rounded-0"
              dark
              v-if="title == 'sales'"
              @click="alertCancelDialog = true"
            >
              <v-icon
                :right="$i18n.locale == 'ar'"
                :left="$i18n.locale == 'en'"
              >
                mdi-plus
              </v-icon>
              {{ $t("cancel") }}
            </v-btn>
          </div>
        </div>
      </div>
    </div>
    <alert-dialog v-if="sizeInvoiceDialog" @close="cancelInvoice" :close="cancelInvoice">
      <template #title>
        {{ $t("printInvoiceInfo") }}
      </template>
      <template #default>
        <div
          class="d-flex flex-column justify-center align-center"
          style="gap: 10px; width: 100%"
        >
          <v-btn
            color="#62C83F"
            width="80%"
            dark
            class="actions d-flex justify-space-betweeen"
            style="border-radius: 20px !important"
            @click="setSize('A4')"
            ><v-icon right dark> mdi_print </v-icon>{{ $t("printA4") }}
          </v-btn>
          <v-btn
            color="#62C83F"
            width="80%"
            dark
            class="actions d-flex justify-space-betweeen"
            style="border-radius: 20px !important"
            @click="setSize('80mm')"
            ><v-icon right dark>mdi_receipt</v-icon>{{ $t("printMini") }}</v-btn
          >
        </div>
      </template>
    </alert-dialog>
    <alert-dialog v-if="alertCancelDialog" @close="close" :close="close">
      <template #title> {{ $t("areYouSureCancel") }} </template>
      <template #actions>
        <v-btn
          color="#62C83F"
          class="rounded-lg white--text mb-2 ml-2"
          @click="cancelInvoice"
          >{{ $t("accept") }}</v-btn
        >
      </template>
    </alert-dialog>
    <alert-dialog v-if="alertDialog" @close="close" :close="close">
      <template #title> {{ $t("plsAddProduct") }} </template>
    </alert-dialog>
    <alert-dialog v-if="alertShiftDialog" :close="close">
      <template #title>عليك بدأ وردية لإنشاء فاتورة </template>
      <template #default>
        <div class="d-flex flex-column justify-center align-center">
          <v-btn
            color="#4FCA9A"
            class="rounded-lg white--text font-weight-bold text-subtitle-1"
            @click="() => $router.push({ name: 'tilers' })"
            >اختر صندوق
          </v-btn>
          <v-btn
            color="#4FCA9A"
            class="rounded-lg white--text mt-5 font-weight-bold text-subtitle-1"
            @click="close"
            >{{ $t("notNow") }}</v-btn
          >
        </div>
      </template>
    </alert-dialog>
    <alert-dialog v-if="alertInvoiceDialog" :close="close">
      <template #title> {{ $t("alertAvailableInvoice") }} </template>
      <template #default>
        <div class="d-flex flex-column justify-center align-center">
          <v-btn
            color="#4FCA9A"
            class="rounded-lg white--text font-weight-bold text-subtitle-1"
            @click="() => $router.push({ name: 'subscriptions' })"
            >{{ $t("upgradePackedge") }}</v-btn
          >
          <v-btn
            color="#4FCA9A"
            class="rounded-lg white--text mt-5 font-weight-bold text-subtitle-1"
            @click="close"
            >{{ $t("notNow") }}</v-btn
          >
        </div>
      </template>
    </alert-dialog>
    <alert-dialog
      v-if="validationDialog"
      @close="close"
      :close="close"
      :buttonName="$t('accept')"
      color="#62C83F"
    >
      <template #title>
        {{ $t("shouldEnterValidData") }}
      </template>
      <template #text>
        <p
          class="mb-2"
          v-if="
            (client == null || Object.keys(client).length == 0) &&
            (taxInvoiceCheck == true || title == 'priceQuote')
          "
        >
          <v-icon color="red" size="12" class="ml-1">emergency</v-icon>
          {{ $t("addClientValidation") }}
        </p>
        <p
          class="mb-2"
          v-else-if="client['tax_number'] == null && taxInvoiceCheck == true"
        >
          <v-icon color="red" size="12" class="ml-1">emergency</v-icon>
          {{ $t("addClientTaxNumValidation") }}
        </p>
        <p class="mb-2" v-if="userDetails['address'] == null">
          <v-icon color="red" size="12" class="ml-1">emergency</v-icon>
          {{ $t("addClientAddressValidation") }}
        </p>
        <p class="mb-2" v-if="invoiceError != null">
          <v-icon color="red" size="12" class="ml-1">emergency</v-icon>
          {{ invoiceError }}
        </p>
        <p class="mb-2" v-if="supplierInvoiceNum == '' && title == 'purchases'">
          <v-icon color="red" size="12" class="ml-1">emergency</v-icon>
          {{ $t("supplierInvoiceNumValidation") }}
        </p>
        <p
          class="mb-2"
          v-if="
            title == 'purchases' &&
            (supplier == null || Object.keys(supplier).length == 0)
          "
        >
          <v-icon color="red" size="12" class="ml-1">emergency</v-icon>
          {{ $t("addSupplierValidation") }}
        </p>
      </template>
    </alert-dialog>
    <alert-dialog
      v-if="paymentDialog"
      :close="close"
      customClass="payment-dialog"
    >
      <template #title>{{ $t("choosePaymentMethod") }}</template>
      <template #text>
        <v-radio-group
          v-model="paymentMethodSelected"
          class="mt-0 d-inline-block"
          style="width: 100%"
        >
          <v-radio
            v-for="paymentMet in getPaymentMethods"
            :key="paymentMet.name"
            :value="paymentMet"
            color="#4FCA9A"
            class="payment-method"
          >
            <template v-slot:label>
              {{ paymentMet["name"] }}
              <div>
                <v-img
                  :src="
                    paymentMet['is_default']
                      ? require(`../assets/imgs/${paymentMet['name_json']['en']}.png`)
                      : require('../assets/imgs/payment-method.png')
                  "
                  width="30"
                  height="30"
                ></v-img>
              </div>
            </template>
          </v-radio>
        </v-radio-group>
      </template>
      <template #default>
        <v-btn
          @click="paymentMethod"
          dark
          color="#62C83F"
          class="mt-0 mb-1 payment-button"
          :disabled="paymentButtonDisable"
        >
          {{ $t("accept") }}
        </v-btn>
      </template>
    </alert-dialog>
    <v-dialog
      v-model="priceQuoteDialog"
      :max-width="$vuetify.breakpoint.width < 425 ? '100%' : '450px'"
    >
      <v-card
        class="mx-auto"
        :style="
          $vuetify.breakpoint.width < 425 ? 'padding:0 ' : 'padding: 0 1.5rem'
        "
      >
        <v-card-title class="justify-center card-title-container">{{
          $t("priceQuoteDetails")
        }}</v-card-title>
        <v-card-text>
          <v-form class="form-container" ref="form" lazy-validation>
            <div v-if="error != null">
              <v-alert type="error" dense outlined>{{ error }}</v-alert>
            </div>
            <div>
              <label>مقدمة عرض السعر</label>
              <v-textarea
                v-model="priceQuote['introduction']"
                auto-grow
                outlined
                rows="2"
                color="#8F8F8F"
              ></v-textarea>
            </div>
            <div>
              <label>{{ $t("paymentMethod") }}</label>
              <v-text-field
                v-model="priceQuote['payment_info']"
                :placeholder="$t('paymentMethod')"
                :rules="requiredRule"
                required
                color="#8F8F8F"
                outlined
              ></v-text-field>
            </div>
            <div>
              <label>{{ $t("priceQuoteExpire") }}</label>
              <v-text-field
                v-model="priceQuote['expire_date']"
                :placeholder="$t('priceQuoteExpire')"
                type="date"
                :rules="requiredRule"
                required
                color="#8F8F8F"
                outlined
              ></v-text-field>
            </div>
            <div>
              <label>{{ $t("notes") }}</label>
              <v-textarea
                v-model="priceQuote['note']"
                auto-grow
                outlined
                rows="2"
                color="#8F8F8F"
              ></v-textarea>
            </div>
            <div>
              <label>{{ $t("description") }}</label>
              <v-textarea
                v-model="priceQuote['description']"
                auto-grow
                outlined
                rows="3"
                color="#8F8F8F"
              ></v-textarea>
            </div>
            <div class="d-flex justify-center align-center">
              <v-btn
                color="#62C83F"
                class="white--text"
                @click="createPriceQuote"
                height="30"
                width="35%"
              >
                {{ $t("createPriceQuote") }}
              </v-btn>
              <v-btn
                color="#EF0B0B"
                :class="[marginTwo, 'white--text']"
                @click="priceQuoteDialog = false"
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
    <v-dialog
      v-model="addCustomerDialog"
      :max-width="$vuetify.breakpoint.width < 425 ? '100%' : '450px'"
    >
      <v-card
        class="mx-auto"
        :style="
          $vuetify.breakpoint.width < 425 ? 'padding:0 ' : 'padding: 0 1.5rem'
        "
      >
        <v-card-title class="justify-center card-title-container">{{
          addSupplierDialog ? $t("addSupplier") : $t("addClient")
        }}</v-card-title>
        <v-card-text>
          <v-form class="form-container">
            <div>
              <label>{{ nameArValue }}</label>
              <v-text-field
                v-model="editedItem.name.ar"
                :placeholder="nameArValue"
                :error-messages="customerNameErrors"
                @input="$v.editedItem['name']['ar'].$touch()"
                @blur="$v.editedItem['name']['ar'].$touch()"
                required
                color="#8F8F8F"
                outlined
              ></v-text-field>
            </div>
            <div>
              <label>{{ nameEnValue }}</label>
              <v-text-field
                v-model="editedItem.name.en"
                :placeholder="nameEnValue"
                color="#8F8F8F"
                outlined
              ></v-text-field>
            </div>
            <div>
              <label>{{ $t("phone") }}</label>
              <v-text-field
                v-model="editedItem.phone"
                :placeholder="$t('phone')"
                color="#8F8F8F"
                outlined
              ></v-text-field>
            </div>
            <div>
              <label>{{ $t("address") }}</label>
              <v-text-field
                v-model="editedItem['address']"
                :placeholder="$t('address')"
                color="#8F8F8F"
                outlined
              ></v-text-field>
            </div>
            <div>
              <label>{{ $t("taxNumber") }} </label>
              <v-text-field
                v-model="editedItem['tax_number']"
                :rules="[taxNumber]"
                :placeholder="$t('taxNumber')"
                color="#8F8F8F"
                :maxlength="15"
                outlined
              ></v-text-field>
            </div>
            <div class="d-flex justify-center align-center">
              <v-btn
                color="#62C83F"
                class="white--text"
                @click="addCustomer"
                height="30"
                width="35%"
              >
                {{ addSupplierDialog ? $t("addNewSupplier") : $t("addClient") }}
              </v-btn>
              <v-btn
                color="#EF0B0B"
                :class="[marginTwo, 'white--text']"
                @click="addCustomerDialog = false"
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
    <v-dialog
      v-model="addProductDialog"
      :max-width="$vuetify.breakpoint.width < 425 ? '100%' : '500px'"
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
              v-model="product.image"
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
        <v-card-text style="padding: 0">
          <v-form class="form-container">
            <div v-if="error">
              <v-alert dense outlined type="error">
                {{ error }}
              </v-alert>
            </div>
            <div class="form-row-container">
              <div style="width: 50%">
                <label class="black--text">{{ $t("productNameAr") }}</label>
                <v-text-field
                  v-model="product.name.ar"
                  :placeholder="$t('productNameAr')"
                  color="#8F8F8F"
                  outlined
                  :rules="requiredRule"
                  required
                ></v-text-field>
              </div>
              <div style="width: 50%">
                <label class="black--text">{{ $t("productNameEn") }}</label>
                <v-text-field
                  v-model="product.name.en"
                  :placeholder="$t('productNameEn')"
                  color="#8F8F8F"
                  outlined
                ></v-text-field>
              </div>
            </div>
            <div class="form-row-container">
              <div style="width: 50%">
                <label class="black--text">{{ $t("barcode") }}</label>
                <v-text-field
                  v-model="product.serial"
                  :placeholder="$t('barcode')"
                  color="#8F8F8F"
                  outlined
                  :rules="requiredRule"
                  required
                ></v-text-field>
              </div>
              <div style="width: 50%">
                <label class="black--text">{{ $t("category") }}</label>
                <v-autocomplete
                  :items="categories"
                  v-model="product.categories"
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
                v-model="product.description"
                :placeholder="$t('description')"
                auto-grow
                outlined
                rows="2"
                color="#8F8F8F"
              ></v-textarea>
            </div>
            <div class="form-row-container">
              <div style="width: 30%">
                <label class="black--text">{{ $t("priceBeforeTax") }}</label>
                <v-text-field
                  v-model="product.price_before_tax"
                  @input="
                    calculatePriceAfterTax(
                      product.price_before_tax,
                      -1,
                      'price_after_tax'
                    )
                  "
                  :placeholder="$t('priceBeforeTax')"
                  color="#8F8F8F"
                  outlined
                  :rules="requiredRule"
                  required
                ></v-text-field>
              </div>
              <div style="width: 30%">
                <label class="black--text">{{ $t("priceAfterTax") }}</label>
                <v-text-field
                  v-model="product.price_after_tax"
                  @input="calculatePriceBeforeTax(product.price_after_tax, -1)"
                  :placeholder="$t('priceAfterTax')"
                  color="#8F8F8F"
                  outlined
                  :rules="requiredRule"
                  required
                ></v-text-field>
              </div>
              <div style="width: 30%">
                <label class="black--text">{{ $t("cost") }}</label>
                <v-text-field
                  v-model="product.cost_before_tax"
                  @input="
                    calculatePriceAfterTax(
                      product.cost_before_tax,
                      -1,
                      'cost_after_tax'
                    )
                  "
                  :placeholder="$t('cost')"
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
                  width: measurable ? '50%' : '100%',
                }"
              >
                <v-switch
                  id="measurable"
                  color="success"
                  v-model="measurable"
                  class="mt-0"
                  hide-details
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
              <div v-if="measurable" style="width: 50%">
                <label class="black--text">{{ $t("qty") }}</label>
                <v-text-field
                  v-model="product.quantity"
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
                @click="saveProduct"
                height="30"
                width="35%"
              >
                {{ $t("addProduct") }}
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
    <v-dialog
      v-model="discountDialog"
      :max-width="$vuetify.breakpoint.width < 425 ? '100%' : '450px'"
    >
      <v-card
        class="mx-auto"
        :style="
          $vuetify.breakpoint.width < 425 ? 'padding:0 ' : 'padding: 0 1.5rem'
        "
      >
        <v-card-title
          class="d-flex justify-space-between align-center pb-1 card-title-container"
          >{{ $t("addDiscount") }}
          <v-icon color="black" @click="close" size="22"
            >mdi-close</v-icon
          ></v-card-title
        >
        <v-divider></v-divider>
        <v-card-text class="mt-2">
          <div v-if="message != null">
            <v-alert type="error" dense outlined>{{ message }}</v-alert>
          </div>
          <v-form
            class="form-container"
            style="gap: 15px"
            @submit.prevent="getTotal"
          >
            <label
              :style="discountValue == '' ? 'opacity:0.5' : 'opacity:1'"
              class="black--text"
            >
              {{ $t("value") }}
              :</label
            >
            <div class="mb-2 d-flex justify-space-between align-center">
              <v-text-field
                v-model="discountValue"
                :placeholder="$t('discountValue')"
                hide-details
                color="#8F8F8F"
                outlined
              >
              </v-text-field>
              <v-btn-toggle
                class="d-flex justify-center align-center btnGroup mr-2"
              >
                <v-btn
                  :class="[
                    { active: discountFixed },
                    $i18n.locale == 'en' ? 'rounded-r-0' : 'rounded-l-0',
                    'rounded-lg',
                  ]"
                  color="white"
                  @click="discountFixed = true"
                  >{{ $t("SRmini") }}</v-btn
                >
                <v-btn
                  :class="[
                    { active: !discountFixed },
                    $i18n.locale == 'en' ? 'rounded-l-0' : 'rounded-r-0',
                    'rounded-lg',
                  ]"
                  color="white"
                  @click="discountFixed = false"
                  >%</v-btn
                >
              </v-btn-toggle>
            </div>
            <div class="d-flex justify-center align-center">
              <v-btn color="#62C83F" class="white--text" @click="getTotal">
                {{ $t("addDiscount") }}
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="openInvoiceDialog"
      max-width="100%"
      v-if="$vuetify.breakpoint.width < 769"
    >
      <v-card class="mx-auto" style="padding: 0">
        <v-card-title
          class="d-flex justify-space-between align-center pb-1 px-1 card-title-container"
        >
          <div class="px-2 invoice-details-container">
            <div
              class="top-input-container invoice-checkbox"
              style="width: 100%"
              v-if="taxInvoice == 1 && title == 'sales'"
            >
              <v-checkbox
                v-model="taxInvoiceCheck"
                @change="changeCheck('tax')"
                :label="$t('taxedInvoice')"
                color="#4fca9a"
                class="mt-0"
                hide-details
              ></v-checkbox>
              <v-checkbox
                v-model="simpleTaxInvoiceCheck"
                @change="changeCheck('simple')"
                :label="$t('simpleTaxedInvoice')"
                color="#4fca9a"
                class="mt-0 mr-0"
                hide-details
              ></v-checkbox>
            </div>
            <h3 v-else>
              {{ cashierTitle }}
            </h3>
            <div
              :class="[
                'top-input-container static-content-container',
                title == 'purchases' ? 'top-input-container-purchases' : 'mt-1',
              ]"
            >
              <div class="top-input-container static-content" style="gap: 0">
                <v-icon
                  color="rgba(0,0,0,.87)"
                  :size="$vuetify.breakpoint.width < 375 ? '15' : '20'"
                  >{{
                    $i18n.locale == "en" ? "chevron_right" : "chevron_left"
                  }}</v-icon
                >
                <label>
                  {{ $t("invoiceNumber") + ":" }}
                  <span style="color: rgba(0, 0, 0, 0.6)">{{
                    $t("automatic")
                  }}</span>
                </label>
              </div>
              <div
                class="top-input-container static-content"
                v-if="title != 'purchases'"
                style="gap: 0"
              >
                <v-icon
                  color="rgba(0,0,0,.87)"
                  :size="$vuetify.breakpoint.width < 375 ? '15' : '20'"
                  >{{
                    $i18n.locale == "en" ? "chevron_right" : "chevron_left"
                  }}</v-icon
                >
                <label>
                  {{ title == "priceQuote" ? $t("date") : $t("invoiceDate") }}
                  :<span style="color: rgba(0, 0, 0, 0.6)">{{
                    new Date().toLocaleDateString()
                  }}</span>
                </label>
              </div>
              <div
                class="top-input-container input-number"
                v-if="title == 'purchases'"
              >
                <label>
                  {{ $t("supplierInvoiceNum") }}
                  :</label
                >
                <v-text-field
                  outlined
                  hide-details
                  :placeholder="$t('supplierInvoiceNum')"
                  color="#d2d2d2"
                  v-model="supplierInvoiceNum"
                  style="width: 20%"
                ></v-text-field>
              </div>
            </div>
            <div
              :class="[
                'top-input-container',
                title == 'purchases' ? 'top-input-container-purchases' : '',
              ]"
            >
              <div class="input-supplier" v-if="title == 'purchases'">
                <v-autocomplete
                  :items="getSuppliers"
                  v-model="supplier"
                  item-text="name"
                  outlined
                  hide-details
                  color="#D2D2D2"
                  :placeholder="$t('supplierName')"
                  return-object
                ></v-autocomplete>
                <v-btn
                  dark
                  color="#4FCA9A"
                  height="30px"
                  width="25"
                  class="add-btn"
                  @click="openDialog('supplier')"
                >
                  <v-icon color="white" size="25">add_box</v-icon>
                </v-btn>
              </div>
              <div class="input-customer" v-else>
                <label v-if="$vuetify.breakpoint.width > 375">
                  {{ $t("client") }}:</label
                >
                <v-autocomplete
                  :placeholder="$t('client')"
                  :items="getClients"
                  v-model="client"
                  item-text="name"
                  outlined
                  hide-details
                  color="#D2D2D2"
                  return-object
                >
                  <template v-slot:item="{ item }">
                    <div class="client-item">
                      <div class="client-name font-weight-bold">
                        {{ item.name }}
                      </div>
                      <div
                        class="client-tax-number"
                        v-if="item.tax_number != null"
                      >
                        {{ item.tax_number }}
                      </div>
                    </div>
                  </template>
                </v-autocomplete>
                <v-btn
                  dark
                  color="#4FCA9A"
                  height="30px"
                  width="20"
                  class="add-btn"
                  @click="openDialog('customer')"
                >
                  <v-icon color="white" size="25">add_box</v-icon>
                </v-btn>
              </div>
              <div class="input-image" v-if="title == 'purchases'">
                <v-file-input
                  ref="fileInput"
                  v-model="supplierInvoiceImg"
                  outlined
                  color="#D2D2D2"
                  class="fileInput"
                  :placeholder="$t('supplierInvoiceImage')"
                  hide-details
                >
                </v-file-input>
                <v-btn
                  dark
                  color="#4FCA9A"
                  height="30px"
                  width="25"
                  class="add-btn"
                  @click="openFileInput"
                >
                  <v-icon color="white" size="25">mdi-image-multiple</v-icon>
                </v-btn>
              </div>
            </div>
            <div class="top-input-container">
              <div
                class="input-supplier"
                v-if="taxInvoiceCheck && title == 'sales'"
              >
                <label> {{ $t("importDate") }}:</label>
                <v-text-field
                  type="date"
                  v-model="supplyDate"
                  outlined
                  hide-details
                  color="#D2D2D2"
                ></v-text-field>
              </div>
            </div>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-2 pb-0 invoice-details-container">
          <v-expansion-panels multiple class="mt-2 product-panels">
            <v-expansion-panel
              v-for="(product, index) in tableProducts"
              :key="product.id"
              class="list-product-container mt-2"
            >
              <v-expansion-panel-header class="justify-space-between header">
                <span
                  :style="
                    $i18n.locale == 'ar' ? 'direction:rtl;' : 'direction:ltrl'
                  "
                >
                  {{
                    taxInvoice == 1
                      ? $RoundingNumber(
                          product[valueAfterTax] * product.quantity,
                          "product"
                        )
                      : $RoundingNumber(
                          product[valueBeforeTax] * product.quantity,
                          "product"
                        )
                  }}
                  {{ $t("SRmini") }}
                </span>
                <template #actions>
                  <div class="d-flex justify-start align-center">
                    <div>
                      <span>{{ product["name"] }}</span>
                      <span class="mx-2">X</span>
                      <span>{{ product["quantity"] }}</span>
                    </div>
                    <v-icon> mdi-chevron-down</v-icon>
                  </div>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div class="list-product-inf-container" style="gap: 5px">
                  <div class="list-product-inf">
                    <label>{{ $t("qty") }}</label>
                    <v-text-field
                      v-model="product.quantity"
                      @input="validateQty(index)"
                      color="#d2d2d2"
                      outlined
                      hide-details
                      :placeholder="$t('qty')"
                    ></v-text-field>
                  </div>
                  <div class="list-product-inf">
                    <label>{{
                      title == "purchases"
                        ? $t("cost")
                        : taxInvoice == 1
                        ? $t("pBT")
                        : $t("price")
                    }}</label>
                    <v-text-field
                      v-model="product[valueBeforeTax]"
                      color="#d2d2d2"
                      outlined
                      hide-details
                      @input="
                        calculatePriceAfterTax(
                          product[valueBeforeTax],
                          index,
                          valueAfterTax
                        )
                      "
                    ></v-text-field>
                  </div>
                  <div class="list-product-inf" v-if="taxInvoice == 1">
                    <label>{{ title == "purchases"
                      ? $t("costAfterTax")
                      : $t("pAT"), }}</label>
                    <v-text-field
                      v-model="product[valueAfterTax]"
                      @input="
                        calculatePriceBeforeTax(product[valueAfterTax], index)
                      "
                      color="#d2d2d2"
                      outlined
                      hide-details
                    ></v-text-field>
                  </div>
                  <div class="list-product-inf">
                    <label>{{ $t("total") }}</label>
                    <v-text-field
                      :value="
                        taxInvoice == 1
                          ? $RoundingNumber(
                              product[valueAfterTax] * product.quantity,
                              'product'
                            )
                          : $RoundingNumber(
                              product[valueBeforeTax] * product.quantity,
                              'product'
                            )
                      "
                      readonly
                      color="#d2d2d2"
                      outlined
                      hide-details
                    ></v-text-field>
                  </div>
                  <div class="list-product-inf">
                    <v-icon
                      @click.stop="product.makeNote = !product.makeNote"
                      color="primary"
                      size="15"
                    >
                      edit_document
                    </v-icon>
                    <v-icon
                      @click.stop="removeRow(product)"
                      color="red"
                      size="15"
                      >delete</v-icon
                    >
                  </div>
                </div>
                <div
                  v-if="product.makeNote"
                  class="list-product-inf mt-1"
                  style="direction: ltr"
                >
                  <v-text-field
                    v-model="product.description"
                    :placeholder="$t('addNote')"
                    hide-details
                    color="#d2d2d2"
                    outlined
                  ></v-text-field>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-divider class="mt-2"></v-divider>
          <div class="bottom-side">
            <div class="panel-content">
              <p>{{ taxInvoice == 1 ? $t("subtotal") : $t("total") }} :</p>
              <p>
                {{
                  $RoundingNumber(totalPriceBeforeTax, "product") +
                  " " +
                  $t("SRmini")
                }}
              </p>
            </div>
            <div class="panel-content" v-if="discountValue != 0">
              <p>
                {{ $t("discountValue") }}
                :
              </p>
              <p>
                {{
                  (discountValue ? discountValue : 0) +
                  " " +
                  (this.discountFixed ? $t("SRmini") : "%")
                }}
              </p>
            </div>
            <div class="panel-content" v-if="discountValue != 0">
              <p>
                {{ $t("priceAfterDiscount") }}
                :
              </p>
              <p>
                {{
                  $RoundingNumber(this.totalPriceAfterDiscount, "product") +
                  " " +
                  $t("SRmini")
                }}
              </p>
            </div>
            <div class="panel-content" v-if="taxInvoice == 1">
              <p>{{ $t("AddedTax") }} :</p>
              <p>
                {{ $RoundingNumber(addedTax, "product") + " " + $t("SRmini") }}
              </p>
            </div>
            <div class="panel-content" v-if="taxInvoice == 1">
              <p>{{ $t("totalWithTax") }} :</p>
              <p>
                {{
                  $RoundingNumber(totalPriceAfterTax, "total") +
                  " " +
                  $t("SRmini")
                }}
              </p>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="btn-container buttons-responsive pt-0">
          <v-btn
            color="#4FCA9A "
            class="rounded-0"
            dark
            @click="
              () => {
                message = null;
                discountDialog = true;
              }
            "
          >
            <v-icon :right="$i18n.locale == 'ar'" :left="$i18n.locale == 'en'">
              mdi-plus
            </v-icon>
            {{ $t("addDiscount") }}
          </v-btn>

          <v-btn
            color="#4FCA9A "
            class="rounded-0 ml-0"
            outlined
            @click="printInvoice('print')"
          >
            <v-icon :right="$i18n.locale == 'ar'" :left="$i18n.locale == 'en'">
              mdi-plus
            </v-icon>
            {{
              title == "priceQuote"
                ? $t("createPriceQuote")
                : $t("createInvoice")
            }}
          </v-btn>

          <v-btn
            color="#4FCA9A"
            class="rounded-0 ml-0"
            dark
            v-if="title == 'sales'"
            @click="alertCancelDialog = true"
          >
            <v-icon :right="$i18n.locale == 'ar'" :left="$i18n.locale == 'en'">
              mdi-plus
            </v-icon>
            {{ $t("cancel") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <shift-report
      v-if="shiftReportDialog"
      @endShift="endShift"
      :close="close"
      title="cashier"
      :shift="meDetails['open_shift']"
      :user_type="meDetails['user_type']"
    >
    </shift-report>
  </v-container>
</template>
<script>
import axios from "axios";
import { Howl } from "howler";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import ShiftReport from "./Tilers/ShiftReport.vue";
export default {
  mixins: [validationMixin],
  validations: {
    editedItem: {
      name: { ar: { required } },
    },
  },
  components: {
    ShiftReport,
  },
  data() {
    return {
      paymentMethodSelected: "",
      title: null,
      valid: true,
      alertDialog: false,
      alertInvoiceDialog: false,
      paymentDialog: false,
      priceQuoteDialog: false,
      addCustomerDialog: false,
      addSupplierDialog: false,
      validationDialog: false,
      shiftReportDialog: false,
      alertShiftDialog: false,
      discountDialog: false,
      returnSalesDialog: false,
      discountAlertDialog: false,
      alertCancelDialog: false,
      openInvoiceDialog: false,
      sizeInvoiceDialog: false,
      paymentButtonDisable: false,
      size: "A4",
      panelExpanded: null,
      invoiceNumber: "",
      note: null,
      alertMessage: "",
      taxInvoiceCheck: false,
      simpleTaxInvoiceCheck: false,
      products: [],
      searchProduct: "",
      categoryID: null,
      activeButtonIndex: -1,
      tax: "",
      supplyDate: "",
      totalPriceBeforeTax: 0,
      totalPriceAfterDiscount: 0,
      addedTax: 0,
      totalPriceAfterTax: 0,
      invoiceNum: "",
      discountValue: 0,
      discountFixed: true,
      productQuantity: "",
      status: true,
      userDetails: {},
      meDetails: null,
      taxInvoice: null,
      clients: [],
      client: {},
      supplier: {},
      tableProducts: [],
      product: {
        name: {
          ar: "",
          en: "",
        },
        serial: Math.floor(Math.random() * 100000000).toString(),
        description: "",
        price_before_tax: 0,
        price_after_tax: 0,
        cost: 0,
        cost_before_tax: 0,
        cost_after_tax: 0,
        categories: [],
        image: null,
        quantity: 0,
      },
      selectedImage: null,
      measurable: false,
      editedItem: {
        name: {
          ar: "",
          en: "",
        },
        phone: "",
        address: "",
        tax_number: "",
      },
      priceQuote: {
        client_id: null,
        introduction: "",
        quotation_number: "",
        description: "",
        payment_info: "",
        note: "",
        expire_date: "",
        is_taxed: 0,
        products: [],
      },
      selectedCategories: [],
      phoneRule: (v) => {
        if (v.length >= 9 && v.length <= 11) return true;
        return this.$t("phoneValidation");
      },
      taxNumber: (v) => {
        if (v.length == 15) return true;
        return this.$t("taxNumberValidation");
      },
      costRule: [
        (v) =>
          Number(v) <= Number(this.product.price_before_tax) ||
          "يجب ان تكون التكلفة اقل من سعر المنتج",
      ],
      requiredRule: [(v) => !!v || this.$t("fieldRequired")],
      categories: null,
      error: null,
      invoiceError: null,
      message: null,
      type: "",
      addproductSound: null,
      supplierInvoiceImg: null,
      supplierInvoiceNum: "",
      hasAShift: false,
      errors: null,
      addProductDialog: false,
      showDiscount: false,
    };
  },
  methods: {
    cancelInvoice() {
      this.client = {};
      this.supplyDate = "";
      this.tableProducts = [];
      this.discountValue = 0;
      this.discountFixed = true;
      this.getTotal();
      this.close();
    },
    validateQty(index) {
      if (this.tableProducts[index]["quantity"] == "")
        this.tableProducts[index]["quantity"] = 1;
      else {
        this.tableProducts[index]["quantity"] = this.tableProducts[index][
          "quantity"
        ].replace(/-/g, "");
      }
      this.getTotal();
    },
    onFileChange(e) {
      this.selectedImage = URL.createObjectURL(e);
    },
    getData() {
      this.setData();
      this.error = null;
      this.products = [];
      if (this.userDetails["market_name"] != null) {
        axios
          .get("getProduct", {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "X-localization": this.$i18n.locale,
            },
          })
          .then((res) => {
            var pageCount = res.data.data.meta.last_page;
            this.getTotalProducts(pageCount);
            this.$store.dispatch("clients");
            this.$store.dispatch("tax");
          })
          .catch((err) => {
            if (err.response.data.message == "Unauthenticated.")
              this.$store.dispatch("logout");
          });
        this.$store.dispatch("paymentMethods", { lang: this.$i18n.locale });
        this.$store.dispatch("suppliers");
        this.getCategories();
      }
    },
    setData() {
      this.userDetails = JSON.parse(localStorage.getItem("userDetails"));
      this.meDetails = JSON.parse(localStorage.getItem("meDetails"));
      this.taxInvoice = this.userDetails["tax_on_of"];
      this.title = this.$route.params.title;
      this.addproductSound = JSON.parse(
        localStorage.getItem("addProductSound")
      );
      if (this.taxInvoice == 1) this.priceQuote["is_taxed"] = 1;
      if (typeof this.title == "undefined" || this.title == "sales") {
        this.title = "sales";
        if (this.taxInvoice == 1) {
          this.simpleTaxInvoiceCheck = true;
        }
      }
      if (this.meDetails["open_shift"] == null) this.hasAShift = false;
      else this.hasAShift = true;
    },
    async getTotalProducts(pageCount) {
      for (var i = 1; i < pageCount + 1; i++) {
        await axios
          .get("getProduct", {
            params: { page: i },
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "X-localization": this.$i18n.locale,
            },
          })
          .then((res) => this.products.push(...res.data.data.data));
      }
    },
    openFileInput() {
      this.$refs.fileInput.$el
        .querySelector("input[type=file]")
        .dispatchEvent(new MouseEvent("click"));
    },
    selectCategory(index, categoryID) {
      this.activeButtonIndex = index;
      this.categoryID = categoryID;
      if (this.categoryID == null) this.getData();
      else this.search();
    },
    createPriceQuote() {
      if (this.$refs.form.validate()) {
        this.priceQuote["products"] = this.tableProducts.map(
          ({ id, quantity, price_after_tax, price_before_tax }) => ({
            id,
            quantity,
            price_after_tax,
            price_before_tax,
          })
        );
        axios
          .post(
            "quotations",
            {
              ...this.priceQuote,
              discount_type: this.discountFixed ? "fixed" : "percentage",
              discount: this.discountValue,
            },
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "X-localization": this.$i18n.locale,
              },
            }
          )
          .then((res) => this.downloadPriceQuote(res.data.data))
          .catch((err) => (this.error = err.response.data.message));
      }
    },
    downloadPriceQuote(priceQuoteDetails) {
      this.$router.push({
        name: "show-price-quote",
        params: {
          priceQuoteDetails: priceQuoteDetails,
          type: this.type,
        },
      });
    },
    close() {
      this.alertShiftDialog = false;
      this.alertDialog = false;
      this.alertInvoiceDialog = false;
      this.validationDialog = false;
      this.paymentDialog = false;
      this.shiftReportDialog = false;
      this.addProductDialog = false;
      this.discountDialog = false;
      this.alertCancelDialog = false;
      this.sizeInvoiceDialog = false;
      this.message = "";
    },
    getCategories() {
      axios
        .get("categories", {
          headers: {
            Authorization: "Bearer" + localStorage.getItem("token"),
            "X-localization": this.$i18n.locale,
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
    search(type) {
      if (this.searchProduct == "" && this.categoryID == null) this.getData();
      else {
        axios
          .post(
            "searchProduct",
            {
              search: this.searchProduct,
              category_id: this.categoryID,
            },
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "X-localization": this.$i18n.locale,
              },
            }
          )
          .then((res) => {
            const products = res.data.data.data;
            // var pageCount = res.data.data.meta.last_page;
            if (products) {
              this.products = products;
              if (type == "barcode" && this.products.length == 1)
                this.addProduct(this.products[0], "Existing");
            } else {
              this.getData();
            }
          })
          .catch((err) => console.log(err));
      }
    },
    openDialog(dialogName) {
      if (this.taxInvoice == 1 && this.userDetails["tax_number"] == null)
        this.$router.push("/invoice-settings");
      else {
        if (dialogName == "customer") this.addCustomerDialog = true;
        else if (dialogName == "supplier") {
          this.addCustomerDialog = true;
          this.addSupplierDialog = true;
        } else {
          const keysToEmpty = [
            "description",
            "price_before_tax",
            "price_after_tax",
            "cost",
            "categories",
            "image",
            "quantity",
          ];
          keysToEmpty.forEach((key) => {
            this.product[key] = Array.isArray(this.product[key])
              ? []
              : typeof this.product[key] === "object"
              ? null
              : "";
          });
          this.product.name.ar = this.product.name.en = "";
          this.addProductDialog = true;
        }
      }
    },
    addCustomer() {
      this.$v.editedItem["name"].$touch();
      if (this.$v.editedItem["name"].$invalid) return;
      if (this.addSupplierDialog) {
        axios
          .post("suppliers", this.editedItem, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "X-localization": this.$i18n.locale,
            },
          })
          .then((res) => {
            this.addCustomerDialog = false;
            this.addSupplierDialog = false;
            this.$store.dispatch("suppliers");
            this.supplier = res.data.data;
          })
          .catch((err) => (this.errors = err.response.data.message));
      } else
        axios
          .post("setClient", this.editedItem, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "X-localization": this.$i18n.locale,
            },
          })
          .then((res) => {
            this.addCustomerDialog = false;
            this.$store.dispatch("clients");
            this.client = res.data.data;
          })
          .catch((err) => (this.errors = err.response.data.message));
    },
    addProduct(product, type) {
      if (
        this.meDetails["user_type"] == 1 &&
        this.meDetails["open_shift"] == null
      ) {
        this.alertShiftDialog = true;
        return;
      }
      if (this.addproductSound == true) {
        const sound = new Howl({
          src: require("@/assets/barcode-scan.mp3"),
        });
        sound.play();
      }
      const productIndex = this.tableProducts.findIndex(
        (item) => item.id == product.id
      );
      var newProduct = Object.assign({}, product);
      newProduct.makeNote = false;
      if (type == "new") {
        newProduct.quantity = 1;
        this.tableProducts.push(newProduct);
        this.getTotal();
      } else {
        if (productIndex == -1) {
          newProduct.quantity = 1;
          newProduct[this.valueAfterTax] = this.$RoundingNumber(
            newProduct[this.valueAfterTax],
            "product"
          );
          this.tableProducts.push(newProduct);
          this.getTotal();
        } else {
          this.increaseQuantity(productIndex);
        }
      }
      this.searchProduct = "";
    },
    removeRow(product) {
      const index = this.tableProducts.indexOf(product);
      this.tableProducts.splice(index, 1);
      this.getTotal();
    },
    saveProduct() {
      if (this.measurable) this.product.measurable = "measurable";
      else {
        this.product.measurable = "unmeasurable";
        this.product.quantity = null;
      }
      axios
        .post("setProduct", this.product, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "X-localization": this.$i18n.locale,
            "content-type": "multipart/form-data",
          },
        })
        .then((res) => {
          this.getData();
          this.addProduct(res.data.data, "new");
          this.addProductDialog = false;
        })
        .catch((err) => {
          this.error = err.response.data.message;
        });
    },
    increaseQuantity(index) {
      this.tableProducts[index].quantity++;
      this.getTotal();
    },
    decreaseQuantity(product) {
      if (product.quantity == 1) {
        product.quantity--;
        const index = this.tableProducts.indexOf(product);
        this.updateTableProducts = this.tableProducts.splice(index, 1);
        this.getTotal();
      } else {
        this.updateTableProducts = this.tableProducts.map((item) => {
          if (item.id == product.id) {
            item.quantity--;
            this.getTotal();
          }
        });
      }
    },
    calculatePriceAfterTax(val, index, key) {
      const tax = Number(val) * this.getTax;
      if (index == -1) {
        this.product[key] = Number(val) + tax;
      } else {
        if (val == "") this.tableProducts[index][key] = 0;
        else {
          this.tableProducts[index][key] = Number(val) + tax;
          this.tableProducts[index]["cost"] = val;
        }
        this.getTotal();
      }
    },
    calculatePriceBeforeTax(val, index) {
      if (index == -1) {
        this.product["price_before_tax"] = Number(val) / (1 + this.getTax);
      } else {
        if (val == "") this.tableProducts[index][this.valueBeforeTax] = 0;
        else
          this.tableProducts[index][this.valueBeforeTax] =
            Number(val) / (1 + this.getTax);

        this.getTotal();
      }
    },
    //calcukate total price
    getTotal() {
      var length = this.tableProducts.length;
      this.totalPriceBeforeTax = this.totalPriceAfterTax = 0;
      for (var i = 0; i < length; i++) {
        this.totalPriceAfterTax +=
          this.tableProducts[i][this.valueAfterTax] *
          this.tableProducts[i].quantity;
        this.totalPriceBeforeTax +=
          this.tableProducts[i][this.valueBeforeTax] *
          this.tableProducts[i].quantity;
      }
      // total price after discount
      if (!this.discountFixed) {
        this.totalPriceAfterDiscount =
          this.totalPriceBeforeTax -
          this.totalPriceBeforeTax * (Number(this.discountValue) / 100);
      } else {
        this.totalPriceAfterDiscount =
          this.totalPriceBeforeTax - Number(this.discountValue);
      }
      if (this.totalPriceAfterDiscount < 0) {
        this.message = " يجب ان يكون الخصم أقل من او يساوي الإجمالي ";
        return;
      }
      // added tax
      if (this.discountValue != 0) {
        this.totalPriceAfterTax = this.totalPriceAfterDiscount * 1.15;
      }
      this.addedTax = this.totalPriceAfterTax - this.totalPriceAfterDiscount;
      this.discountDialog = false;
    },
    printInvoice(type) {
      if (this.tableProducts.length == 0) {
        this.alertDialog = true;
      } else {
        if (this.title == "sales") {
          if (
            this.meDetails["is_subscribed"] == false &&
            this.userDetails["no_of_bills_now"] == 30
          ) {
            this.alertInvoiceDialog = true;
            return;
          } else if (this.taxInvoiceCheck == true) {
            if (
              this.client == null ||
              Object.keys(this.client).length == 0 ||
              this.client["tax_number"] == null ||
              this.userDetails["address"] == null
            ) {
              this.validationDialog = true;
              return;
            }
          }
        } else if (this.title == "priceQuote") {
          if (this.client == null || Object.keys(this.client).length == 0) {
            this.validationDialog = true;
            return;
          }
          this.type = type;
          this.priceQuoteDialog = true;
          return;
        } else {
          if (
            this.supplierInvoiceNum == "" ||
            this.supplier == null ||
            Object.keys(this.supplier).length == 0
          ) {
            this.validationDialog = true;
            return;
          }
        }
        this.type = type;
        this.paymentDialog = true;
      }
    },
    paymentMethod() {
      if (this.paymentMethodSelected == "") return;
      else {
        this.paymentButtonDisable = true;
        if (this.title == "sales") {
          this.createSalesInvoice(
            this.tableProducts,
            this.paymentMethodSelected
          );
        } else {
          this.createPurchasesInvoice(
            this.tableProducts,
            this.paymentMethodSelected
          );
        }
      }
    },
    setSize(size) {
      this.size = size;
      this.goToPrintPage();
    },
    //create invoice of sales
    createSalesInvoice(products, paymentMethod) {
      products.forEach((product) => delete product.cost);
      var parameter = {
        invoice_number: this.invoiceNum,
        invoice_type: this.taxInvoiceCheck == true ? 1 : 0,
        payment_method_id: paymentMethod.id,
        phone: Object.keys(this.client).length == 0 ? "" : this.client["phone"],
        client_id: Object.keys(this.client).length == 0 ? 1 : this.client["id"],
        product: products,
        discount_type: this.discountFixed ? "fixed" : "percentage",
        discount: this.discountValue,
      };
      if (this.taxInvoiceCheck && this.supplyDate)
        parameter.date_of_import = this.supplyDate;
      axios
        .post(
          "invoice",
          {
            ...parameter,
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "X-localization": this.$i18n.locale,
            },
          }
        )
        .then((res) => {
          this.invoiceDetails = res.data.data;
          localStorage.setItem("invoice", JSON.stringify(this.invoiceDetails));
          this.$store.dispatch("userDetail");
          this.paymentDialog = false;
          this.sizeInvoiceDialog = true;
          this.paymentButtonDisable = false;
        })
        .catch((err) => {
          this.invoiceError = err.response.data.message;
          this.paymentDialog = false;
          this.validationDialog = true;
          this.paymentButtonDisable = false;
        });
    },
    //create invoice of purchases
    createPurchasesInvoice(products, paymentMethod) {
      axios
        .post(
          "purchases",
          {
            supplier_id: this.supplier["id"],
            supplier_invoice_number: this.supplierInvoiceNum,
            tprice_before_tax: this.totalPriceBeforeTax,
            payment_method_id: paymentMethod.id,
            products: products,
            discount_type: this.discountFixed ? "fixed" : "percentage",
            discount: this.discountValue,
            image: this.supplierInvoiceImg,
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "X-localization": this.$i18n.locale,
              "content-type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          localStorage.setItem("invoice", JSON.stringify(res.data.data));
          this.$store.dispatch("userDetail");
          this.paymentDialog = false;
          this.sizeInvoiceDialog = true;
          this.paymentButtonDisable = false;
        })
        .catch((err) => {
          if (err.response.data.message == "Unauthenticated.")
            this.$store.dispatch("logout");
          else {
            this.paymentDialog = false;
            this.invoiceError = err.response.data.message;
            this.validationDialog = true;
          }
          this.paymentButtonDisable = false;
        });
    },
    //go to print page
    goToPrintPage() {
      const template = JSON.parse(
        this.invoiceDetails.invoice_meta_data.invoice_settings_json
      ).A4;
      this.$router.push({
        name: "print",
        params: {
          type: this.type,
          size: this.size,
          template: template.id,
        },
      });
    },
    changeCheck(type) {
      if (type == "simple") {
        this.taxInvoiceCheck = false;
      } else this.simpleTaxInvoiceCheck = false;
    },
    onBarcodeScanned(barcode) {
      if (barcode.length > 3) {
        this.searchProduct = barcode;
        setTimeout(() => {
          this.search("barcode");
        }, 70);
      }
    },
    endShift() {
      axios
        .post(
          `shifts/${this.meDetails["open_shift"]["id"]}/end-shift`,
          {},
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "X-localization": this.$i18n.locale,
            },
          }
        )
        .then(() => {
          setTimeout(() => {
            this.$store.dispatch("meDetail");
          }, 1000);
        })
        .catch((err) => console.log(err));
    },
  },
  computed: {
    customerNameErrors() {
      const errors = [];
      if (!this.$v.editedItem["name"]["ar"].$dirty) return errors;
      !this.$v.editedItem["name"]["ar"].required &&
        errors.push(this.$t("fieldRequired"));
      return errors;
    },
    getDiscountValue() {
      if (this.subTotal == 0) return 0 + this.$t("SRmini");
      else
        return (
          Number(this.discountValue) +
          (this.discountFixed == true ? this.$t("SRmini") : "%")
        );
    },
    total() {
      var total = 0;
      if (this.subTotal == 0) return 0;
      if (this.discountFixed == true)
        total = this.subTotal - Number(this.discountValue);
      else if (this.discountFixed == false)
        total =
          this.subTotal - this.subTotal * (Number(this.discountValue) / 100);
      else total = this.subTotal;
      return total;
    },
    getClients() {
      return this.$store.getters.getClients;
    },
    getPaymentMethods() {
      return this.$store.getters.getPaymentMethods
        ? this.$store.getters.getPaymentMethods
        : [];
    },
    getSuppliers() {
      return this.$store.getters.getSuppliers
        ? this.$store.getters.getSuppliers
        : [];
    },
    getTax() {
      return this.$store.getters.getTax;
    },
    getPriceValue() {
      return this.title == "purchases"
        ? this.taxInvoice == 1
          ? "cost_after_tax"
          : "cost_before_tax"
        : this.taxInvoice == 1
        ? "price_after_tax"
        : "price_before_tax";
    },
    cashierTitle() {
      if (this.title == "priceQuote") return this.$t("priceQuote");
      else if (this.title == "purchases") return this.$t("purchaseInvoice");
      else {
        return this.$t("simpleInvoice");
      }
    },
    valueBeforeTax() {
      return this.title == "purchases" ? "cost_before_tax" : "price_before_tax";
    },
    valueAfterTax() {
      return this.title == "purchases" ? "cost_after_tax" : "price_after_tax";
    },
    numberLabel() {
      if (this.title == "priceQuote") return this.$t("quotationNum");
      else return this.$t("invoiceNumber");
    },
    cashName() {
      return this.title == "sales" ? "cash" : "fixed";
    },
    nameArValue() {
      return this.addSupplierDialog
        ? this.$t("supplierNameAr")
        : this.$t("clientNameAr");
    },
    nameEnValue() {
      return this.addSupplierDialog
        ? this.$t("supplierNameEn")
        : this.$t("clientNameEn");
    },
    marginFive() {
      return this.$i18n.locale == "en" ? "ml-5" : "mr-5";
    },
    marginFour() {
      return this.$i18n.locale == "en" ? "ml-5" : "mr-4";
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
    leftMarginTwo() {
      return this.$i18n.locale == "en" ? "mr-2" : "ml-2";
    },
  },
  watch: {
    client(val) {
      this.priceQuote["client_id"] = val.id;
    },
  },
  mounted() {
    this.$barcodeScanner.init(this.onBarcodeScanned);
    this.getData();
  },
};
</script>
<style scoped>
@import "../assets/styles/style.css";
@import "../assets/styles/cashier.css";

.payment-button.v-btn.v-btn--disabled.v-btn--has-bg {
  background: #62c83f !important;
  opacity: 0.5;
  color: white !important;
}
.v-input--switch :deep(.v-input__slot) {
  background: none !important;
}

.fileInput :deep(.v-input__append-inner) {
  margin-top: 9px !important;
}

.fileInput :deep(.mdi-paperclip::before) {
  font-size: 1.5rem !important;
}

.invoice-details div {
  width: 100%;
}

.invoice-details .v-text-field,
.invoice-details .v-autocomplete {
  padding-top: 5px;
  width: 50%;
}

.invoice-details .v-text-field::v-deep .v-input__slot {
  width: 100%;
}

.tableStriped tr {
  line-height: 2;
}

.tableStriped tr td {
  max-width: 130px !important;
}

.height-35 :deep(.v-data-table__wrapper) {
  max-height: 35vh;
}

.height-30 :deep(.v-data-table__wrapper) {
  max-height: 30vh;
}

.payment-method {
  background-color: rgba(211, 211, 211, 0.3);
  padding: 10px;
  border: 1px solid #d3d3d3;
  border-radius: 15px;
}

.payment-method::v-deep .v-label {
  display: flex !important;
  justify-content: space-between;
  align-items: center;
  padding: 0 5px;
  font-family: "BahjiiSemiBold";
}

.client-tax-number {
  color: #cac7c7;
  font-size: 15px;
}

.shift-container p {
  font-size: 1rem;
}

.btnGroup button {
  border-left-width: 1px !important;
  font-family: "BahjiiLight";
  font-size: 16px !important;
  color: hsl(0, 0%, 40%);
  height: 40px !important;
  letter-spacing: 0;
}

.active {
  background: #4fca9a !important;
  color: white !important;
  border: none !important;
  font-family: "BahjiiSemiBold" !important;
}

@media (max-width: 767px) {
  .invoice-details {
    flex-wrap: wrap;
  }

  .invoice-buttons {
    flex-wrap: wrap;
  }

  .btn {
    width: auto !important;
  }
}

@media (max-width: 991px) {
  .left-side {
    margin-right: 0 !important;
  }
}

.add-btn {
  min-width: 43px !important;
  background: rgba(79, 202, 154, 0.6) !important;
}
</style>
