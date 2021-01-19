<template>
  <div class="CoinModal-backdrop">
    <div class="CoinModal">
      <header class="CoinModal-header">
        <div class="columnBigger">
          <label for="">{{ $t("NewCoin") }}</label>
        </div>
        <div class="columnHeaderRight">
          <button type="button" class="btn-close" @click="close">x</button>
        </div>
      </header>
      <section class="CoinModal-body">
        <slot name="body">
          <form novalidate class="md-layout">
            <md-card class="md-layout"
              ><md-card-header class="md-layout-item md-size-95">
                <div class="md-title">{{ $t("NewCoinData") }}</div>
              </md-card-header>
              <md-card-content class="md-size-95">
                <div class="md-layout-item">
                  <md-field>
                    <label for="coin-name">{{ $t("CoinName") }}</label>
                    <md-input
                      name="coin-name"
                      id="coin-name"
                      autocomplete="coin-name"
                      v-model="postBody.coinName"
                    />
                  </md-field>
                </div>
                <div class="md-layout-item md-small-size-100">
                  <md-field>
                    <label for="country">{{ $t("Country") }}</label>
                    <md-select
                      name="country"
                      id="country"
                      v-model="postBody.country"
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
                      <md-checkbox
                        class="md-primary"
                        v-model="postBody.hasType"
                      >
                        {{ $t("HasType") }}
                      </md-checkbox>
                    </div>
                    <div class="md-layout-item" v-if="postBody.hasType">
                      <md-field>
                        <label for="coin-name">{{ $t("Type") }}</label>
                        <md-input
                          name="coin-name"
                          id="coin-name"
                          autocomplete="coin-name"
                          v-model="postBody.type"
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
                        v-model="postBody.denomination"
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
                        v-model="postBody.year"
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
                      v-model="postBody.value"
                    />
                  </md-field>
                </div>
                <transition name="errorShowUp">
                  <p class="error" v-if="error != ''">{{ $t(error) }}</p>
                </transition>
                <div class="md-layout-item">
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
                <div class="md-layout-item">
                  <md-button class="md-raised md-primary" @click="addCoin">{{
                    $t("AddCoin")
                  }}</md-button>
                </div>
              </md-card-content>
            </md-card>
          </form>
          <!-- <div class="inputBody">
            <div class="md-layout"></div>
            <label>{{ $t(error) }}</label>
          </div> -->
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
  data() {
    return {
      postBody: {
        coinName: null,
        country: null,
        denomination: null,
        value: null,
        year: null,
        hasType: false,
        type: null,
      },
      error: "",
      photo: null,
      photoByteArray: null,
      CountryList: [],
    };
  },
  created() {
    this.sortCountries();
  },
  methods: {
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
        //var test = this.arrayBufferToString(arrayBuffer)
        //var test = new Uint8Array(arrayBuffer);

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
    addCoin() {
      this.error = "";
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + store.state.user.token,
        },
      };
      if (this.photoByteArray != null) {
        Axios.post(
          this.$urlCore + "/Coin/AddCoin?type=" + this.postBody.type,
          {
            Year: this.postBody.year,
            CoinName: this.postBody.coinName,
            Denomination: this.postBody.denomination,
            Country: this.postBody.country,
            Value: this.postBody.value,
            Photo: this.photoByteArray,
            Type: this.postBody.type,
          },
          options
        )
          .then(() => {
            this.$emit("close");
          })
          .catch((err) => {
            console.log(err);
            this.error = "ErrorBadRequest";
          });
      } else {
        this.error = "ErrorNoPhoto";
      }
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
  height: 650px;
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
.inputBody {
  margin-left: 10%;
}
/* .AddBtn {
  display: grid;
  margin-left: -3.5vh;
} */
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
.error {
  color: red;
  margin-right: 10px;
}

.errorShowUp-enter-active,
.errorShowUp-leave-active {
  margin-right: 25px;
  transition: margin-right 0.5s;
}
.errorShowUp-enter, .errorShowUp-leave-to /* .fade-leave-active below version 2.1.8 */ {
  margin-right: 10px;
}
</style>