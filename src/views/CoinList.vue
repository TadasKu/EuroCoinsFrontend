<template>
  <div class="coinList">
    <md-card>
      <md-card-header>
        <div class="md-title">{{ $t(SelectedCountry) }}</div>
      </md-card-header>
      <md-card-content>
        <table
          class="column"
          v-if="coinTypes[0] != null || coinTypes.length > 1"
        >
          <tr>
            <td
              v-for="(type, index) in coinTypes"
              v-bind:key="index"
              @click="sortedCoinsByType(type)"
            >
              {{ type }}
            </td>
          </tr>
        </table>
        <br />
        <table>
          <tr>
            <th>{{ $t("Year") }}</th>
            <th>{{ $t("CoinName") }}</th>
            <th>{{ $t("Value") }}</th>
          </tr>
          <tr
            v-bind:style="{ 'background-color': coin.isCollectedCoinColor }"
            v-for="coin in SortedCoins"
            v-bind:key="coin.coin.id"
            v-on:click="PushAddModal(coin.coin.id, coin.isCollectedCoinColor)"
          >
            <td>{{ coin.coin.year }}</td>
            <td>{{ coin.coin.coinName }}</td>
            <td>{{ coin.coin.value }}</td>
          </tr>
        </table>
      </md-card-content>
    </md-card>

    <coin-modal
      v-if="isCoinSelected == true"
      @close="closeModal"
      :CoinId="coinId"
      :Color="color"
    ></coin-modal>
  </div>
</template>

<script>
import Axios from "axios";
import CoinModal from "../Modals/AddToCollectionModal";
export default {
  props: {
    CountryName: String,
  },
  components: {
    CoinModal,
  },
  data() {
    return {
      Coins: [],
      SortedCoins: [],
      isCoinSelected: false,
      coinId: null,
      color: null,
      SelectedCountry: null,
      coinTypes: [],
    };
  },
  created() {
    this.getAllCountryCoins();
  },
  methods: {
    getAllCountryCoins() {
      if (this.CountryName != null) {
        this.SelectedCountry = this.CountryName;
      } else {
        this.SelectedCountry = this.$store.state.selectedCountry;
      }
      Axios.get(
        this.$urlCore +
          "/Coin/coinsByCountry?country=" +
          this.SelectedCountry +
          "&id=" +
          this.$store.state.user.userId
      ).then((Response) => {
        var unsortedCoins = Response.data;

        unsortedCoins.sort((a, b) =>
          Number(a.coin.year) < Number(b.coin.year)
            ? -1
            : Number(a.coin.year) > Number(b.coin.year)
            ? 1
            : 0
        );
        this.Coins = unsortedCoins;
        this.getCoinTypes();
      });
    },
    PushAddModal(id, color) {
      this.coinId = id;
      this.color = color;
      this.isCoinSelected = true;
    },
    closeModal() {
      this.coinId = null;
      this.isCoinSelected = false;
      this.color = null;
      this.getAllCountryCoins();
    },
    getCoinTypes() {
      this.Coins.forEach((element) => {
        if (!this.coinTypes.includes(element.coin.type)) {
          this.coinTypes.push(element.coin.type);
        }
      });
      this.sortedCoinsByType(this.coinTypes[0]);
    },
    sortedCoinsByType(type) {
      this.SortedCoins = this.Coins.filter(
        (element) => element.coin.type == type
      );
    },
  },
  computed: {},
};
</script>

<style scoped>
table {
  color: black;
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid black;
  text-align: left;
  padding: 8px;
}
td {
  cursor: pointer;
}
tr:nth-child(even) {
  background-color: #dddddd;
}
.column {
  margin-left: auto;
  margin-right: auto;
  width: 30%;
}
</style>