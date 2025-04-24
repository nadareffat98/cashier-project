<template>
  <v-container class="mt-5">
    <h2>{{ title }}</h2>
    <v-expansion-panels class="mt-5" v-model="panel" multiple>
      <v-expansion-panel>
        <v-expansion-panel-header class="justify-space-between mt-2 header">
          {{ $t("userInf") }}
        </v-expansion-panel-header>
        <v-expansion-panel-content class="content">
          <v-form class="form-container" ref="form" lazy-validation>
            <div v-if="errors">
              <v-alert dense outlined type="error">
                {{ errors }}
              </v-alert>
            </div>
            <div class="d-flex justify-start" style="width: 100%; gap: 15px">
              <div style="width: 40%">
                <label>{{ $t("username") }}</label>
                <v-text-field
                  v-model="editedItem.name"
                  :placeholder="$t('username')"
                  required
                  :rules="requiredRule"
                  color="#8F8F8F"
                  outlined
                ></v-text-field>
              </div>
              <div style="width: 40%">
                <label>{{ $t("Password") }}</label>
                <v-text-field
                  v-model="editedItem.password"
                  color="#8F8F8F"
                  outlined
                  :append-icon="hidePass ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="() => (hidePass = !hidePass)"
                  :type="hidePass ? 'password' : 'text'"
                  placeholder="******************"
                ></v-text-field>
              </div>
            </div>
            <div class="d-flex justify-start" style="width: 100%; gap: 15px">
              <div style="width: 40%">
                <label>{{ $t("phone") }}</label>
                <v-text-field
                  v-model="editedItem.phone"
                  :placeholder="$t('phone')"
                  color="#8F8F8F"
                  outlined
                ></v-text-field>
              </div>
              <div style="width: 40%">
                <label>{{ $t("email") }}</label>
                <v-text-field
                  v-model="editedItem.email"
                  :placeholder="$t('email')"
                  required
                  :rules="requiredRule"
                  color="#8F8F8F"
                  outlined
                ></v-text-field>
              </div>
            </div>
          </v-form>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header class="justify-space-between mt-2 header">
          {{ $t("userPermissions") }}
        </v-expansion-panel-header>
        <v-expansion-panel-content class="content">
          <div class="d-flex justify-start" style="gap: 15px">
            <v-list-group
              v-for="(groupItems, groupName) in groups"
              :key="groupName"
            >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title class="checkbox-title" @click.stop>
                    <v-checkbox
                      :label="$t(groupName)"
                      :value="groupName"
                      @change="selectAll($event,groupName)"
                      color="#4fca9a"
                      hide-details
                    ></v-checkbox>
                  </v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item
                v-for="group in groupItems"
                :key="group"
                class="checkbox-group"
              >
                <v-checkbox
                  :label="$t(group)"
                  :value="group"
                  v-model="selectedPermission"
                  color="#4fca9a"
                  hide-details
                ></v-checkbox>
              </v-list-item>
            </v-list-group>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <div class="d-flex justify-center align-center mt-5">
      <v-btn
        color="#62C83F"
        class="white--text"
        @click="save"
        height="30"
        width="40%"
      >
        {{ userId == -1 ? $t("addNewUser") : $t("edit") }}
      </v-btn>
    </div>
    <alert-dialog
      v-if="successModal"
      @close="emptyErrors"
      :close="emptyErrors"
      :buttonName="$t('done')"
      color="#62C83F"
    >
      <template #title>
        {{ $t("doneSuccessfuly") }}
      </template>
    </alert-dialog>
  </v-container>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      userId: this.$route.params.userId,
      groups: {},
      selectedPermission: [],
      selectedGroup: [],
      panel: [0],
      errors: null,
      editedItem: {
        name: "",
        phone: "",
        email: "",
        password: "",
      },
      defaultItem: {
        name: "",
        phone: "",
        email: "",
      },
      hidePass: true,
      successModal: false,
      requiredRule: [(v) => !!v || this.$t("fieldRequired")],
    };
  },
  methods: {
    getData() {
      this.getPermissions();
      if (this.userId != -1) this.getUser();
    },
    getUser() {
      axios
        .get(`employee/${this.userId}`)
        .then((res) => {
          this.editedItem = res.data.data;
          this.selectedPermission = res.data.data.permissions;
        })
        .catch((err) => console.log(err));
    },
    getPermissions() {
      axios
        .get("employee/available-permissions")
        .then((res) => {
          const permissions = res.data.data.allowed_permissions;
          permissions.forEach((str) => {
            const prefix = str.split("-")[0];
            if (!this.groups[prefix]) {
              this.groups[prefix] = [];
            }
            this.groups[prefix].push(str);
          });
        })
        .catch((err) => {
          if (err.response.data.message == "Unauthenticated.")
            this.$store.dispatch("logout");
        });
    },
    save() {
      if (this.$refs.form.validate()) {
        this.editedItem.permissions = this.selectedPermission;
        if (this.userId == -1) {
          this.addUser();
        } else {
          this.editUser();
        }
      }
    },
    addUser() {
      axios
        .post("employee", this.editedItem)
        .then(() => (this.successModal = true))
        .catch((err) => {
          this.errors = err.response.data.message;
        });
    },
    editUser() {
      axios
        .patch(`employee/${this.userId}`, this.editedItem)
        .then((res) => {
          this.editedItem = res.data.data;
          this.successModal = true;
        })
        .catch((err) => {
          this.errors = err.response.data.message;
        });
      this.successModal = true;
    },
    emptyErrors() {
      if (this.userId == -1) {
        this.$refs.form.reset();
        this.editedItem = { ...this.defaultItem };
        this.selectedPermission = [];
      }
      this.errors = null;
      this.successModal = false;
    },
    selectAll(e,name) {
      if (e) {
        const filteredPermissions = this.groups[name].filter(
          (item) => !this.selectedPermission.includes(item)
        );
        this.selectedPermission =
          this.selectedPermission.concat(filteredPermissions);
      } else {
        this.selectedPermission = this.selectedPermission.filter(
          (item) => !this.groups[name].includes(item)
        );
        console.log(this.selectedPermission);
      }
    },
  },
  computed: {
    title() {
      return this.userId == -1 ? this.$t("addNewUser") : this.$t("editUser");
    },
  },
  mounted() {
    this.getData();
  },
};
</script>
<style scoped>
@import "@/assets/styles/style.css";
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
.form-container :deep(.v-input__append-inner) {
  margin-top: 8px !important;
}

.form-container :deep(.v-input__append-inner button) {
  font-size: 20px !important;
}
.v-input--checkbox {
  margin-top: 4px;
}
.v-input--checkbox :deep(label) {
  font-size: 14px;
}

.checkbox-title .v-input--checkbox {
  margin-top: 0;
  padding-top: 0;
}
.checkbox-title .v-input--checkbox :deep(label) {
  color: #4fca9a;
  font-size: 16px;
  margin-right: 3px;
}
.v-list-group :deep(.v-list-group__items) {
  padding-right: 10px;
}
.v-list-group :deep(.v-list-group__items i::before) {
  font-size: 20px !important;
}
</style>
