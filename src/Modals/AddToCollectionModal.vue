<template>
  <div class="CoinModal-backdrop">
    <div class="CoinModal">
      <header class="CoinModal-header">
        <div class="columnBigger">
          <label>{{ Coin.coinName }}</label>
        </div>
        <div class="columnHeaderRight">
          <button type="button" class="btn-close" @click="close">x</button>
        </div>
      </header>
      <section class="CoinModal-body">
        <slot name="body">
          <md-card>
            <md-card-content>
              <div class="md-layout md-gutter">
                <div class="md-layout-item">
                  <table class="coinInfo">
                    <tr>
                      <th>{{ $t("Country") }}</th>
                      <td>{{ $t(Coin.country) }}</td>
                    </tr>
                    <tr>
                      <th>{{ $t("Type") }}</th>
                      <td>{{ Coin.type }}</td>
                    </tr>
                    <tr>
                      <th>{{ $t("Year") }}</th>
                      <td>{{ Coin.year }}</td>
                    </tr>
                    <tr>
                      <th>{{ $t("Denomination") }}</th>
                      <td>{{ Coin.denomination }}</td>
                    </tr>
                    <tr>
                      <th>{{ $t("Value") }}</th>
                      <td>{{ Coin.value }}</td>
                    </tr>
                  </table>
                </div>
                <div class="md-layout-item md-breakpoint-xsmall">
                  <img :src="photo" alt="no photo" />
                </div>
              </div>

              <label>{{ error }}</label
              ><br />
              <md-button
                v-if="Color != '#4caf50' && userId != null"
                @click="addToCollection()"
                class="md-raised md-primary"
                >{{ $t("AddToCollection") }}</md-button
              >
              <md-button
                v-if="Color != '#f1f1f1' && userId != null"
                @click="removeFromCollection()"
                class="md-raised md-accent"
                >{{ $t("Remove") }}</md-button
              >
            </md-card-content>
          </md-card>
        </slot>
      </section>
    </div>
  </div>
</template>

<script>
import Axios from "axios";
export default {
  props: {
    CoinId: String,
    Color: String,
  },
  data() {
    return {
      Coin: {
        id: "",
        coinName: "",
        country: "",
        denimonation: 0,
        value: 0,
        year: 0,
      },
      photo: null,
      error: null,
      userId: null,
    };
  },
  created() {
    this.userId = this.$store.state.user.userId;
    this.getCoin();
    this.getCoinPhoto();
  },
  methods: {
    close() {
      this.$emit("close");
    },
    getCoin() {
      Axios.get(this.$urlCore + "/Coin/" + this.CoinId).then((Response) => {
        this.Coin = Response.data;
      });
    },
    addToCollection() {
      Axios.post(
        this.$urlCore +
          "/Collection/AddToCollection?coinId=" +
          this.CoinId +
          "&userId=" +
          this.$store.state.user.userId
      ).then(() => {
        this.close();
      });
    },
    removeFromCollection() {
      Axios.delete(
        this.$urlCore +
          "/Collection/RemoveFromCollection?coinId=" +
          this.CoinId +
          "&userId=" +
          this.$store.state.user.userId
      ).then(() => {
        this.close();
      });
    },
    getCoinPhoto() {
      Axios.get(this.$urlCore + "/Coin/CoinPhoto?id=" + this.CoinId).then(
        (Response) => {
          if (Response.data != "") {
            this.photo = "data:image/jpg;base64,".concat(Response.data);
          }
        }
      );
    },
  },
};
</script>

<style scoped>
.CoinModal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

.CoinModal {
  background: #ffffff;
  box-shadow: 2px 2px 20px 1px;
  width: 500px;
  height: 460px;
  border-radius: 20px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  z-index: 10;
}

.CoinModal-header,
.CoinModal-footer {
  padding: 15px;
  display: flex;
  font-size: 18px;
}

.CoinModal-header {
  opacity: 1 !important;
  background: #448aff;
  border: 1px solid #448aff;
  color: #ffffff;
  border-radius: 20px;
  justify-content: space-between;
}

.CoinModal-footer {
  border-top: 1px solid #eeeeee;
  justify-content: flex-end;
}

.CoinModal-body {
  position: relative;
  padding: 20px 10px;
}
.btn-close {
  border-radius: 8px;
  border: 1px solid white;
  background-color: #ffffff;
  transition: background-color 2s;
}
.btn-close:hover {
  background-color: rgb(181, 181, 181);
  border: 1px solid rgb(181, 181, 181);
}

.coinInfo table {
  color: black;
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
  outline: 1px solid #e1e1e1;
}

.coinInfo td,
th {
  border: 1px solid black;

  text-align: left;
  padding: 8px;
}

.coinInfo tr:nth-child(even) {
  background-color: #dddddd;
}
</style>