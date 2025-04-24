<template>
  <div @click="reload">
    <v-snackbar
      v-model="snackbar"
      :right="true"
      :timeout="4000"
      multi-line
      dir="ltr"
    >
      <template v-slot:action="{ attrs }">
        <v-btn v-bind="attrs" icon @click="reload">
          <v-icon center>mdi-close</v-icon>
        </v-btn>
      </template>
      <p class="text-subtitle-1 mb-0">{{ title }}</p>
      <p class="mb-0">{{ body }}</p>
    </v-snackbar>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/messaging";
export default {
  data() {
    return {
      title: "",
      body: "",
      snackbar: false,
      messaging: firebase.messaging(),
    };
  },
  methods: {
    receiveMessage() {
      try {
        this.messaging.onMessage((payload) => {
          // debugger
          this.setNotificationBoxForm(
            payload.notification.body,
            payload.notification.title
          );
          this.snackbar = true;
        });
      } catch (e) {
        console.log(e);
      }
    },

    setNotificationBoxForm(body, title) {
      this.body = body;
      this.title = title;
    },
    reload() {
      this.snackbar = false;
      location.reload();
    },
  },
  created() {
    this.receiveMessage();
  },
};
</script>
<style scoped>
.v-snack::v-deep .v-snack__wrapper {
 direction: rtl !important;
}
.v-snack::v-deep .v-snack__action 
{
  margin-right: 0px !important;
  margin-left: 8px;
}
</style>
