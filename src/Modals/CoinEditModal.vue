<template>
  <div class="CoinModal-backdrop">
    <div class="CoinModal">
      <header class="CoinModal-header">
        <div class="columnBigger"></div>
        <div class="columnHeaderRight">
          <button type="button" class="btn-close" @click="close">x</button>
        </div>
      </header>
      <section class="CoinModal-body">
        <slot name="body">
          <form novalidate class="md-layout">
            <md-card class="md-layout"
              ><md-card-header class="md-layout-item md-size-95">
                <div class="md-title">{{ $t("NewData") }}</div>
              </md-card-header>
              <md-card-content class="md-size-95">
                <div class="md-layout-item">
                  <md-field>
                    <label for="coin-name">{{ $t("CoinName") }}</label>
                    <md-input
                      name="coin-name"
                      id="coin-name"
                      autocomplete="coin-name"
                      v-model="Coin.coinName"
                    />
                  </md-field>
                </div>
                <div class="md-layout-item md-small-size-100">
                  <md-field>
                    <label for="country">{{ $t("Country") }}</label>
                    <md-select
                      name="country"
                      id="country"
                      v-model="Coin.country"
                    >
                      <md-option></md-option>
                      <md-option
                        v-for="country in CountryList"
                        v-bind:key="country.countryName"
                        :value="country.countryName"
                        >{{ $t(country.countryName) }}</md-option
                      >
                    </md-select>
                  </md-field>
                </div>
                <div class="md-layout-item">
                  <div class="md-layout">
                    <div class="md-layout-item">
                      <md-checkbox class="md-primary" v-model="hasType">
                        {{ $t("HasType") }}
                      </md-checkbox>
                    </div>
                    <div class="md-layout-item" v-if="hasType">
                      <md-field>
                        <label for="coin-name">{{ $t("Type") }}</label>
                        <md-input
                          name="coin-name"
                          id="coin-name"
                          autocomplete="coin-name"
                          v-model="Coin.type"
                        />
                      </md-field>
                    </div>
                  </div>
                </div>
                <div class="md-layout md-gutter">
                  <div class="md-layout-item">
                    <md-field>
                      <label for="denomination">{{ $t("Denomination") }}</label>
                      <md-input
                        type="number"
                        id="Denomination"
                        name="Denomination"
                        autocomplete="Denomination"
                        v-model="Coin.denomination"
                      />
                    </md-field>
                  </div>
                  <div class="md-layout-item">
                    <md-field>
                      <label for="year">{{ $t("Year") }}</label>
                      <md-input
                        type="number"
                        id="year"
                        name="year"
                        autocomplete="year"
                        v-model="Coin.year"
                      />
                    </md-field>
                  </div>
                </div>

                <div class="md-layout-item">
                  <md-field>
                    <label for="value">{{ $t("Value") }}</label>
                    <md-input
                      type="number"
                      id="value"
                      name="value"
                      autocomplete="value"
                      v-model="Coin.value"
                    />
                  </md-field>
                </div>
                <div class="md-layout">
                  <div class="md-layout-item">
                    <img class="imageStyle" :src="photo" alt="" />
                  </div>
                  <div class="md-layout-item center">
                    <!-- <input
                    @change="onFileSelected"
                    type="file"
                    accept="image/jpeg"
                    id="file-input"
                    class="md-primary"
                  /> -->

                    <label for="file-upload" class="custom-file-upload">
                      {{ $t("AddImage") }}
                    </label>
                    <input
                      @change="onFileSelected"
                      accept="image/jpeg"
                      id="file-upload"
                      type="file"
                    />
                  </div>
                </div>

                <div class="md-layout-item">
                  <md-button class="md-raised md-primary" @click="editCoin">{{
                    $t("Edit")
                  }}</md-button>
                </div>
              </md-card-content>
            </md-card>
          </form>
        </slot>
      </section>
    </div>
  </div>
</template>

<script>
//import Axios from 'axios';
import Axios from "axios";
import store from "../store/index";
import Countries from "../_helpers/Countries";
import i18n from "../plugins/i18n";
export default {
  props: {
    Coin: Object,
  },
  data() {
    return {
      error: "",
      photo: null,
      photoByteArray: null,
      CountryList: [],
      hasType: false,
    };
  },
  created() {
    this.getPhoto();
    this.sortCountries();
    if (this.Coin.type != null) {
      this.hasType = true;
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },
    readFileAsync(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    },
    arrayBufferToString(arrayBuffer, decoderType = "utf-8") {
      var decoder = new TextDecoder(decoderType);
      return decoder.decode(arrayBuffer);
    },
    async onFileSelected(event) {
      //-------------
      try {
        var arrayBuffer = await this.readFileAsync(event.target.files[0]);
        this.photoByteArray = btoa(
          new Uint8Array(arrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
      } catch (err) {
        console.log(err);
      }
      //----------------
    },
    uploadPhoto() {},
    getPhoto() {
      Axios.get(this.$urlCore + "/Coin/CoinPhoto?id=" + this.Coin.id).then(
        (Response) => {
          if (Response.data != "") {
            this.photo = "data:image/jpg;base64,".concat(Response.data);
          }
        }
      );
    },
    removePhoto() {
      Axios.delete(
        this.$urlCore + "/Coin/DeletePhoto?id=" + this.Coin.id
      ).then(() => {});
    },
    sortCountries() {
      var selectedLanguage = this.$store.state.selectedLanguage;
      Countries.forEach((element) => {
        this.CountryList.push({
          countryName: element,
          translatedName: i18n.messages[selectedLanguage][element],
        });
        this.CountryList.sort((a, b) =>
          a.translatedName < b.translatedName
            ? -1
            : a.translatedName > b.translatedName
            ? 1
            : 0
        );
      });
    },
    editCoin() {
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + store.state.user.token,
        },
      };
      Axios.put(
        this.$urlCore + "/Coin/" + this.Coin.id,
        {
          Year: this.Coin.year,
          CoinName: this.Coin.coinName,
          Denomination: this.Coin.denomination,
          Country: this.Coin.country,
          Value: this.Coin.value,
          Id: this.Coin.id,
          Type: this.Coin.type,
          Photo: this.photoByteArray,
        },
        options
      )
        .then(() => {
          this.photoByteArray = null;
          this.$emit("close");
        })
        .catch((err) => {
          console.log(err);
          this.error = this.$t("errorBadRequest");
        });
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
  height: 720px;
  border-radius: 20px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
}

.CoinModal-header,
.CoinModal-footer {
  padding: 15px;
  display: flex;
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
.imageStyle {
  width: 125px;
}
input[type="file"] {
  display: none;
}
.custom-file-upload {
  border: 1px solid #ccc;
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
  transition: background-color 1s;
}
.custom-file-upload:hover {
  background-color: rgb(160, 159, 158);
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
.center {
  margin-top: auto;
  margin-bottom: auto;
}
</style>