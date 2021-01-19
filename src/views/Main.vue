<template>
  <div class="about">
    <div class="md-layout md-gutter">
      <div
        class="md-layout-item md-large-size-33 md-medium-size-33 md-small-size-66 paddingMobile"
      >
        <md-card class="">
          <md-card-header>
            <div class="md-title">
              {{ $t("CountryList") }}
            </div>
          </md-card-header>
          <md-card-content class="zeroPadding">
            <div :key="componentKey">
              <CountryList> </CountryList></div
          ></md-card-content>
        </md-card>
      </div>
      <div class="md-layout-item md-size-50 PaddingToRight">
        <md-card class="test md-small-hide md-alignment-top-center">
          <md-card-content>
            <div :key="componentKey">
              <transition name="fade" mode="out-in">
                <div class="tooltip" v-if="HoveredCountry.Name != null">
                  <label>
                    <b>{{ $t(HoveredCountry.Name) }}</b></label
                  >
                  <div class="countryStats" v-if="HoveredCountry.HasEuros">
                    <p v-if="$store.state.user.userId != null">
                      <b>{{ $t("CollectedCoinCount") }}: </b
                      >{{ HoveredCountry.CollectedCount }}
                    </p>
                    <p>
                      <b>{{ $t("TotalCoinCount") }}: </b>
                      {{ HoveredCountry.TotalCount }}
                    </p>
                  </div>
                  <div class="noStats" v-if="!HoveredCountry.HasEuros">
                    <label for="">{{ $t("CountryDoesNotHaveEuros") }}</label>
                  </div>
                </div>
              </transition>
              <WorldMapVue
                :countryData="allCountries"
                @click="redirectToCoinList"
                @mouseenter="onMouseEnterMapCountry"
                @mouseleave="onMouseLeaveMapCountry"
              ></WorldMapVue></div
          ></md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>
<script>
import store from "../store/index";
import WorldMapVue from "../plugins/world-map-vue";
import CountryList from "@/components/CountryList.vue";
import router from "../router/index";
import Iso from "../_helpers/Iso.js";
import IsoReverse from "../_helpers/IsoReverse.js";
import AllCountries from "../_helpers/AllCountries";
import AllCountriesIso from "../_helpers/AllCountriesIso";

import Axios from "axios";
export default {
  components: { WorldMapVue, CountryList },
  data() {
    return {
      user: {},
      componentKey: 0,
      map: null,
      allCountries: null,
      Stats: null,
      HoveredCountry: {
        Name: null,
        HasEuros: false,
        TotalCount: 0,
        CollectedCount: 0,
      },
    };
  },
  created() {
    this.user = store.getters.user;
    this.makeMap();
    this.GetStats();
  },
  methods: {
    redirectToCoinList(country) {
      if (this.map[country] != null) {
        this.$store.dispatch("set_CountryAction", this.map[country]);
        router.push({
          name: "CoinList",
          params: { CountryName: this.map[country] },
        });
      }
    },
    GetStats() {
      if (this.$store.state.user.userId != null) {
        Axios.get(
          this.$urlCore +
            "/Collection/GetCollectionStatus/" +
            this.$store.state.user.userId
        ).then((Response) => {
          this.Stats = Response.data;
          this.makeMap();
        });
      } else {
        this.GetTotalCount();
      }
    },
    GetTotalCount() {
      Axios.get(this.$urlCore + "/Collection/GetTotalCoinsCount/").then(
        (Response) => {
          this.Stats = Response.data;
        }
      );
    },
    onMouseEnterMapCountry(data) {
      if (Iso[data] != null) {
        var hoveredCountry = Iso[data];
        this.HoveredCountry.Name = hoveredCountry;
        this.HoveredCountry.HasEuros = true;
        var HoveredCoinStats = this.Stats.filter(
          (item) => item.countryName == hoveredCountry
        );
        if (HoveredCoinStats[0] != null) {
          this.HoveredCountry.TotalCount = HoveredCoinStats[0].totalCount;
          if (this.$store.state.user.userId != null) {
            this.HoveredCountry.CollectedCount =
              HoveredCoinStats[0].collectedCount;
          }
        }
      } else {
        hoveredCountry = AllCountriesIso[data];
        this.HoveredCountry.Name = hoveredCountry;
        this.HoveredCountry.HasEuros = false;
      }
    },
    onMouseLeaveMapCountry() {
      this.HoveredCountry.Name = null;
      this.HoveredCountry.TotalCount = 0;
      this.HoveredCountry.CollectedCount = 0;
      this.HoveredCountry.HasEuros = false;
    },
    makeMap() {
      this.map = Iso;
      this.allCountries = AllCountries;
      if (this.Stats != null) {
        this.Stats.forEach((element) => {
          if (element.countPercentage == 0) {
            this.allCountries[IsoReverse[element.countryName]] = "grey";
          }
          if (element.countPercentage > 0 && element.countPercentage <= 10) {
            this.allCountries[IsoReverse[element.countryName]] = "red";
          }
          if (element.countPercentage > 10 && element.countPercentage <= 80) {
            this.allCountries[IsoReverse[element.countryName]] = "yellow";
          }
          if (element.countPercentage > 80) {
            this.allCountries[IsoReverse[element.countryName]] = "green";
          }
        });
      }
      this.componentKey++;
    },
  },
};
</script>
<style scoped>
.about {
  padding: 20px;
}
.zeroPadding {
  padding-left: 0;
}
.PaddingToRight {
  margin-left: 8%;
}
@media only screen and (max-width: 960px) {
  .paddingMobile {
    margin-left: auto;
    margin-right: auto;
  }
}
.tooltip {
  width: 40%;
  height: 25%;
  background-color: #5c6774;
  background: linear-gradient(
    0deg,
    rgba(92, 103, 116, 1) 11%,
    rgba(133, 148, 152, 1) 87%
  );
  color: white;
  position: absolute;
  z-index: 3;
  border-radius: 10px;
  padding-top: 1em;
}
.tooltip > label {
  font-size: 18px;
}
.countryStats {
  text-align: left;
  margin-left: 15px;
}
.noStats {
  text-align: center;
  margin-top: 2em;
  font-size: 16px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
@media only screen and (min-width: 1279px) {
  .tooltip {
    width: 25%;
    height: 15%;
    padding-top: 0.5em;
  }
  .countryStats {
    margin-top: -1em;
  }
  .noStats {
    margin-top: 1em;
  }
}
</style>
