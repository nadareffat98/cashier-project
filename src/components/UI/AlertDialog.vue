<template>
  <v-dialog :max-width="$vuetify.breakpoint.width < 425 ? '100%' : '450px'" v-model="show" @click:outside="close">
    <v-card :class="customClass">
      <v-card-title class="text-h6 d-flex flex-column justify-center" style="
          word-break: break-word;
          text-align: center;
          letter-spacing: 0px !important;
        ">
        <v-avatar class="mb-2" size="80" tile>
          <img class="logo" src="../../assets/imgs/splash_logo.png" />
        </v-avatar>
        <slot name="title"></slot>
      </v-card-title>
      <v-card-text style="padding-bottom: 0px; padding-right: 100px; color: red">
        <slot name="text"></slot>
      </v-card-text>
      <v-card-actions class="justify-center">
        <slot name="actions"></slot>
        <slot name="default">
          <v-btn :color="color ? color : '#EF0B0B'" width="35%" dark class="mb-2 actions" @click="$emit('close')">{{
            buttonName ? buttonName : $t("cancel") }}</v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data() {
    return {
      show: true,
    };
  },
  props: {
    buttonName: String,
    color: String,
    close: Function,
    customClass: {
      type: String,
      default: "",
    },
  },
  emits: ["close"],
};
</script>
