<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <template v-for="field in fields">
      <label :key="field.label" class="black--text">{{ field.label }}</label>
      <v-text-field
        :key="field.name"
        v-model="formData[field.name]"
        :placeholder="field.placeholder"
        color="#8F8F8F"
        outlined
        :rules="field.rules"
        required
      >
      </v-text-field>
    </template>
    <slot name="fields"></slot>
    <slot name="actions">
      <div class="d-flex justify-center align-center">
        <v-btn
          color="#62C83F"
          width="200"
          height="42"
          class="rounded-lg white--text"
          @click="save"
        >
          {{ editOrAdd }}
        </v-btn>

        <v-btn
          color="#EF0B0B"
          width="200"
          height="42"
          class="rounded-lg white--text mr-2"
          @click="closeForm"
        >
          {{ $t("cancel") }}
        </v-btn>
      </div>
    </slot>
  </v-form>
</template>
<script>
import axios from "axios";
export default {
  props: [
    "saveURL",
    "editURL",
    "items",
    "fields",
    "editedIndex",
    "editedItem",
    "refreshData",
    "close",
  ],
  data() {
    return {
      formData: {},
      valid: true,
    };
  },
  methods: {
    getData() {
      for (var i = 0; i < this.fields.length; i++) {
        this.formData[this.fields[i].name]="";
      }
    },
    save() {
      this.$refs.form.validate()
      if (this.editedIndex == -1) {
        this.add();
      } else {
        this.edit();
      }
    },
    // edit item
    edit() {
      const itemId = this.items[this.editedIndex].id;
      axios
        .patch(`${this.editURL}/${itemId}`, this.editedItem, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then(() => {
          this.refreshData();
        })
        .catch((err) => (this.error = err.response.data.message));
    },
    // add item
    add() {
      axios
        .post(this.saveURL, this.editedItem, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then(() => {
          this.refreshData();
        })
        .catch((err) => (this.error = err.response.data.message));
    },
    closeForm(){
      this.$refs.form.resetValidation();
      this.close();
    }
  },
  computed: {
    editOrAdd() {
      {
        return this.editedIndex == -1 ? this.$t("addNewUser") : this.$t("edit");
      }
    },
  },
  created() {
    this.getData();
  },
};
</script>
