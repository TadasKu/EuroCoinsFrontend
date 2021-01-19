<template>
  <div class="CountryList" :key="componentKey">
    <ul class="list">
      <li
        @click="getCoinsByCountry(country.countryName)"
        v-for="(country, index) in Countries"
        v-bind:key="index"
        class="listItem"
      >
        <country-flag
          :country="IsoMap[country.countryName]"
          size="big"
          class="pointer"
        />
        <h3 class="pointer">{{ $t(country.countryName) }}</h3>
        <md-tooltip md-direction="right" v-if="Stats != null"
          ><label v-if="$store.state.user.userId != null">
            {{ $t("CollectedCoinCount") }}: {{ Stats[index].collectedCount }};
            {{ $t("TotalCoinCount") }}: {{ Stats[index].totalCount }}.
          </label>
          <label v-if="$store.state.user.userId == null">
            {{ $t("TotalCoinCount") }}: {{ Stats[index].totalCount }}.
          </label>
        </md-tooltip>
      </li>
    </ul>
  </div>
</template>

<script>
import Axios from "axios";
import router from "../router/index";
import Iso from "../_helpers/IsoReverse";
import i18n from "../plugins/i18n";
// import store from "../store/index";
export default {
  data() {
    return {
      Countries: [],
      IsoMap: Iso,
      Stats: null,
      componentKey: 1,
    };
  },
  methods: {
    getCountryList() {
      Axios.get(this.$urlCore + "/Coin/countries").then((Response) => {
        var selectedLanguage = this.$store.state.selectedLanguage;
        Response.data.forEach((element) => {
          this.Countries.push({
            countryName: element,
            translatedName: i18n.messages[selectedLanguage][element],
          });
          this.Countries.sort((a, b) =>
            a.translatedName < b.translatedName
              ? -1
              : a.translatedName > b.translatedName
              ? 1
              : 0
          );
        });
      });
    },
    getCoinsByCountry(country) {
      this.$store.dispatch("set_CountryAction", country);
      router.push({ name: "CoinList", params: { CountryName: country } });
    },
    GetStats() {
      if (this.$store.state.user.userId != null) {
        Axios.get(
          this.$urlCore +
            "/Collection/GetCollectionStatus/" +
            this.$store.state.user.userId
        ).then((Response) => {
          this.Stats = Response.data;
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
  },
  created() {
    this.getCountryList();
    this.GetStats();
  },
  computed: {
    iso: function (country) {
      return this.ISO[country];
    },
  },
};
</script>

<style>
.list {
  list-style: none;
}

.listItem {
  text-align: left;
  display: flex;
  width: fit-content;
}
ul li h3 {
  margin-top: 8px;
  padding-left: 10px;
}
.pointer {
  cursor: pointer;
}
@media only screen and (max-width: 320px) {
  .list {
    padding-left: 20px;
  }
}
</style>