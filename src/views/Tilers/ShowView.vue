<template>
  <v-container class="mt-4">
    <div class="d-flex justify-start align-center mb-3">
      <h2>{{ tilerShifts.length != 0 ? tilerShifts[0].tiler.name : "" }}</h2>
    </div>
    <v-data-table
      :headers="headers"
      :items="tilerShifts"
      height="100vh"
      fixed-header
      disable-pagination
      hide-default-footer
      mobile-breakpoint="0"
      :class="[$i18n.locale == 'en' ? 'eng-table' : '', 'mt-5 tableStriped']"
    >
      <template slot="item.user.name" slot-scope="{ item }">
        <td>{{ item.user == null ? item.employee.name : item.user.name }}</td>
      </template>
      <template slot="item.actions" slot-scope="{ item }">
        <td>
          <v-btn
            class="actions"
            color="#707070"
            dark
            @click="openReport(item)"
            >{{ $t("view") }}</v-btn
          >
          <v-btn
            v-if="item['shift_end_time'] == null"
            :class="[marginTwo, 'actions']"
            color="#E50D0D"
            dark
            @click="endShift(item)"
            >{{ $t("closeShift") }}</v-btn
          >
        </td>
      </template>
    </v-data-table>
    <div class="cards-responsive">
      <div v-if="tilerShifts.length == 0" class="no-data-container">
        <p>{{ $t("noCategories") }}</p>
      </div>
      <v-row v-else>
        <v-col
          v-for="tilerShift in tilerShifts"
          :key="tilerShift.id"
          cols="12"
          :sm="tilerShifts.length > 1 ? '6' : '12'"
          xs="12"
        >
          <v-card class="mx-auto" outlined>
            <v-card-text
              class="d-flex flex-wrap justify-start align-center invoice-content-responsive"
              :class="tilerShifts.length > 1 ? 'button-responsive' : ''"
              style="gap: 10px"
            >
              <template v-for="header in headers">
                <div
                  v-if="header.value != 'actions'"
                  :key="header.value"
                  class="d-flex justify-start align-center pb-0"
                  style="gap: 5px"
                >
                  <span>{{ header.text }} :</span>
                  <p>
                    {{
                      header.text == $t("username")
                        ? tilerShift.user == null
                          ? tilerShift.employee.name
                          : tilerShift.user.name
                        : tilerShift[header.value]
                    }}
                  </p>
                </div>
                <template v-else>
                  <div
                    class="d-flex justify-center"
                    style="width: 100%"
                    :key="header.value"
                  >
                    <v-btn
                      class="actions"
                      color="#707070"
                      dark
                      @click="openReport(tilerShift)"
                      >{{ $t("view") }}</v-btn
                    >
                    <v-btn
                      v-if="tilerShift['shift_end_time'] == null"
                      :class="[marginTwo, 'actions']"
                      color="#E50D0D"
                      dark
                      @click="endShift(tilerShift)"
                      >{{ $t("closeShift") }}</v-btn
                    >
                  </div>
                </template>
              </template>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <shift-report
      v-if="shiftReportDialog"
      @endShift="endShift"
      :close="
        () => {
          this.shiftReportDialog = false;
        }
      "
      title="tiler"
      :shift="selectedShift"
      :userType="userType"
    >
    </shift-report>
  </v-container>
</template>
<script>
import axios from "axios";
import ShiftReport from "../Tilers/ShiftReport.vue";
export default {
  components: {
    ShiftReport,
  },
  data() {
    return {
      tilerId: this.$route.params.tilerId,
      tilerShifts: [],
      selectedShift: null,
      shiftReportDialog: false,
      userType: null,
    };
  },
  methods: {
    getData() {
      axios
        .get(`shifts`, {
          params: { tiler_id: this.tilerId },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "X-localization": this.$i18n.locale,
          },
        })
        .then((res) => {
          this.tilerShifts = res.data.data;
          console.log(this.tilerShifts);
        })
        .catch((err) => console.log(err));
    },
    openReport(shift) {
      if (shift["user"] == null) this.userType = 1;
      else this.userType = 0;
      this.selectedShift = shift;
      this.shiftReportDialog = true;
    },
    endShift(shift) {
      axios
        .post(
          `shifts/${shift.id}/end-shift`,
          {},
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "X-localization": this.$i18n.locale,
            },
          }
        )
        .then(() => {
          this.getData();
        })
        .catch((err) => console.log(err));
    },
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t("startShift"),
          align: "center",
          value: "shift_start_time",
          sortable: false,
        },
        {
          text: this.$t("endShift"),
          align: "center",
          value: "shift_end_time",
          sortable: false,
        },
        {
          text: this.$t("username"),
          align: "center",
          value: "user.name",
          sortable: false,
        },
        {
          text: this.$t("startShiftCash"),
          align: "center",
          value: "cash_at_check_in",
          sortable: false,
        },
        {
          text: this.$t("endShiftCash"),
          align: "center",
          value: "cash_at_check_out",
          sortable: false,
        },
        {
          text: this.$t("actions"),
          align: "center",
          value: "actions",
          sortable: false,
        },
      ];
    },
    marginTwo() {
      return this.$i18n.locale == "en" ? "ml-2" : "mr-2";
    },
  },
  mounted() {
    this.getData();
  },
};
</script>
