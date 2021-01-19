<template>
  <div>
    <h1>{{ $t("AdminPage") }}</h1>
    <br />
    <h2></h2>
    <md-card class="UserList">
      <md-card-header>
        <h2 class="md-title">{{ $t("UserList") }}</h2>
        <div>
          <label for="">{{ $t("SearchByEmail") }}</label>
          <input
            class="Input"
            v-model="search"
            @input="Search(search)"
            :placeholder="$t('Email')"
          />
        </div>
      </md-card-header>
      <md-card-content>
        <md-table>
          <md-table-row>
            <md-table-head class="md-table-head-container-a">Id</md-table-head>
            <md-table-head class="md-table-head-container-a">{{
              $t("UserName")
            }}</md-table-head>
            <md-table-head class="md-table-head-container-a">{{
              $t("Email")
            }}</md-table-head>
            <md-table-head class="md-table-head-container-a">{{
              $t("Role")
            }}</md-table-head>
            <md-table-head class="md-table-head-container-a">{{
              $t("Actions")
            }}</md-table-head>
          </md-table-row>
          <md-table-row v-for="user in UsersPerPage" v-bind:key="user.id">
            <md-table-cell>{{ user.id }}</md-table-cell>
            <md-table-cell>{{ user.userName }}</md-table-cell>
            <md-table-cell>{{ user.email }}</md-table-cell>
            <md-table-cell>
              <select
                class="Input"
                v-model="user.role"
                name=""
                id=""
                @change="ChangeUserRole(user)"
              >
                <option value="Admin">{{ $t("Admin") }}</option>
                <option value="User">{{ $t("User") }}</option>
                <option value="Viewer">{{ $t("Viewer") }}</option>
              </select></md-table-cell
            >
            <md-table-cell
              ><button class="Btn" @click="DeleteUser(user.id)">
                X
              </button></md-table-cell
            >
          </md-table-row>
        </md-table>
        <div class="paginationBar">
          <paginate
            :page-count="UserPageCount"
            :click-handler="ChangeUserPage"
            :prev-text="$t('Prev')"
            :next-text="$t('Next')"
            :active-class="'active'"
            :container-class="'pagination'"
          >
          </paginate>
        </div>
      </md-card-content>
    </md-card>
    <md-card class="CoinList">
      <md-card-header
        ><h2 class="md-title">{{ $t("CoinList") }}</h2>
        <div>
          <label for="">{{ $t("SearchByCountry") }}</label>
          <input
            class="Input"
            v-model="searchCoin"
            @input="SearchCoin(searchCoin)"
            :placeholder="$t('Country')"
          />
          <button class="Btn AddBtn" @click="PushAddModal">
            {{ $t("AddCoin") }}
          </button>
        </div>
      </md-card-header>
      <md-card-content class="content"
        ><md-table>
          <md-table-row>
            <md-table-head class="md-table-head-container-a">{{
              $t("CoinName")
            }}</md-table-head>
            <md-table-head class="md-table-head-container-a">{{
              $t("Type")
            }}</md-table-head>
            <md-table-head class="md-table-head-container-a">{{
              $t("Country")
            }}</md-table-head>
            <md-table-head class="md-table-head-container-a">{{
              $t("Year")
            }}</md-table-head>
            <md-table-head class="md-table-head-container-a">{{
              $t("Value")
            }}</md-table-head>
            <md-table-head class="md-table-head-container-a">{{
              $t("Actions")
            }}</md-table-head>
          </md-table-row>
          <md-table-row v-for="item in CoinsPerPage" v-bind:key="item.Coin.id">
            <md-table-cell>{{ item.Coin.coinName }}</md-table-cell>
            <md-table-cell>{{ item.Coin.type }}</md-table-cell>
            <md-table-cell>{{ $t(item.Coin.country) }}</md-table-cell>
            <md-table-cell>{{ item.Coin.year }}</md-table-cell>
            <md-table-cell>{{ item.Coin.value }}</md-table-cell>
            <md-table-cell
              ><button class="Btn" @click="deleteCoin(item.Coin.id)">X</button>
              <button class="Btn" @click="PushEditModal(item.Coin)">
                {{ $t("Edit") }}
              </button></md-table-cell
            >
          </md-table-row>
        </md-table>
        <div class="paginationBar">
          <paginate
            :page-count="CoinPageCount"
            :value="selectedCoinPage"
            :click-handler="ChangeCoinPage"
            :prev-text="$t('Prev')"
            :next-text="$t('Next')"
            :active-class="'active'"
            :container-class="'pagination'"
          >
          </paginate>
        </div>
      </md-card-content>
    </md-card>

    <coin-add-modal
      v-if="isCoinAddModalVisible == true"
      @close="closeAddModal"
    ></coin-add-modal>
    <coin-edit-modal
      v-if="isCoinEditModalVisible == true"
      @close="closeEditModal"
      :Coin="selectedCoin"
    ></coin-edit-modal>
  </div>
</template>

<script>
import Axios from "axios";
import store from "../store/index";
import CoinAddModal from "../Modals/CoinAddModal";
import CoinEditModal from "../Modals/CoinEditModal";
import i18n from "../plugins/i18n";
import Paginate from "vuejs-paginate";
export default {
  components: {
    CoinAddModal,
    CoinEditModal,
    Paginate,
  },
  data() {
    return {
      UserPageCount: 1,
      CoinPageCount: 1,
      selectedCoinPage: 1,
      user: {
        userName: "",
        password: "",
        email: "",
      },
      Users: [],
      SearchedUsers: [],
      SearchedCoins: [],
      UsersPerPage: [],
      CoinsPerPage: [],
      search: "",
      searchCoin: "",
      Coins: [],
      isCoinAddModalVisible: false,
      isCoinEditModalVisible: false,
      selectedCoin: null,
      ItemsPerPage: 10,
    };
  },
  methods: {
    ChangeUserPage(pageNum) {
      if (this.UserPageCount == 1) {
        this.UsersPerPage = this.SearchedUsers.slice(0, this.ItemsPerPage);
      } else {
        this.UsersPerPage = this.SearchedUsers.slice(
          (pageNum - 1) * this.ItemsPerPage,
          (pageNum - 1) * this.ItemsPerPage + this.ItemsPerPage
        );
      }
    },
    ChangeCoinPage(pageNum) {
      this.selectedCoinPage = pageNum;
      if (this.CoinPageCount == 1) {
        this.CoinsPerPage = this.SearchedCoins.slice(0, this.ItemsPerPage);
      } else {
        this.CoinsPerPage = this.SearchedCoins.slice(
          (pageNum - 1) * this.ItemsPerPage,
          (pageNum - 1) * this.ItemsPerPage + this.ItemsPerPage
        );
      }
    },
    scrollToTop: function () {
      window.scrollTo(0, 0);
    },
    getUsers() {
      Axios.get(this.$urlCore + "/User/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + store.state.user.token,
        },
      }).then((Response) => {
        this.Users = Response.data;
        this.SearchedUsers = this.Users;
        this.GetUserPageCount();
      });
    },
    getCoins() {
      var selectedLanguage = this.$store.state.selectedLanguage;
      Axios.get(this.$urlCore + "/Coin", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + store.state.user.token,
        },
      }).then((Response) => {
        this.Coins = [];
        Response.data.forEach((element) => {
          this.Coins.push({
            Coin: element,
            translatedCountry: i18n.messages[selectedLanguage][element.country],
          });
        });
        this.SearchedCoins = this.Coins;
        this.GetCoinPageCount();
      });
    },
    deleteCoin(id) {
      Axios.delete(this.$urlCore + "/Coin/" + id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + store.state.user.token,
        },
      }).then(() => {
        this.getCoins();
      });
    },
    PushAddModal() {
      this.isCoinAddModalVisible = true;
    },
    PushEditModal(id) {
      this.selectedCoin = id;
      this.isCoinEditModalVisible = true;
    },
    closeAddModal() {
      this.isCoinAddModalVisible = false;
      this.getCoins();
    },
    closeEditModal() {
      this.isCoinEditModalVisible = false;
      this.getCoins();
    },
    Search(item) {
      this.SearchedUsers = this.Users.filter((user) =>
        user.email.toLowerCase().includes(item.toString().toLowerCase())
      );
      this.GetUserPageCount();
    },
    SearchCoin(item) {
      this.SearchedCoins = this.Coins.filter((coin) =>
        coin.translatedCountry.toLowerCase().includes(item.toLowerCase())
      );
      this.GetCoinPageCount();
    },
    ChangeUserRole(user) {
      Axios.patch(this.$urlCore + "/User/" + user.id, user, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + store.state.user.token,
        },
      }).then(() => {
        this.getUsers();
      });
    },
    DeleteUser(id) {
      Axios.delete(this.$urlCore + "/User/" + id, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + store.state.user.token,
        },
      }).then(() => {
        this.getUsers();
      });
    },
    GetUserPageCount() {
      this.UserPageCount = Math.ceil(
        this.SearchedUsers.length / this.ItemsPerPage
      );
      this.ChangeUserPage(1);
    },
    GetCoinPageCount() {
      this.CoinPageCount = Math.ceil(
        this.SearchedCoins.length / this.ItemsPerPage
      );
      this.ChangeCoinPage(1);
    },
  },
  created() {
    this.getUsers();
    this.getCoins();
  },
};
</script>

<style >
html {
  scroll-behavior: smooth;
}

#svg {
  max-width: 20px;
  margin: 0 auto;
}
.svgText {
  color: black;
  transition: color 2s;
}
.svgText:hover {
  color: red;
}
.CoinList {
  margin: 10px;
}
.UserList {
  margin: 10px;
}
.md-table-head-container-a {
  text-align: center;
}
.searchBar {
  float: right;
}

.pagination li a {
  color: black !important;
}
.pagination li {
  float: left;
  padding: 8px 16px;
  text-decoration: none;
  list-style: none;
  border: 1px solid #ddd;
  color: white;
  background-color: white;
  font-size: 1em;
}

.pagination li:hover {
  background-color: rgb(139, 139, 138);
}
.active {
  background-color: #448aff !important  ;
}
.pagination li a:focus {
  outline: 0 !important;
}
.paginationBar {
  margin-left: auto;
  margin-right: auto;
  width: 500px;
  height: 40px;
}
.Btn {
  margin-top: 5px;
  border: 1px solid #ccc;
  display: inline-block;
  background-color: white;
  padding: 6px 12px;
  cursor: pointer;
  transition: background-color 1s;
}
.Btn:hover {
  background-color: rgb(160, 159, 158);
}
.AddBtn {
  margin-left: 3px;
}
.Input {
  border: 1px solid #ccc;
  display: inline-block;
  background-color: white;
  padding: 6px 12px;
  cursor: pointer;
}
@media only screen and (max-width: 599px) {
  @media only screen and (max-height: 450px) {
    .paginationBar {
      width: 500px;
    }
  }
}
@media only screen and (max-width: 450px) {
  .paginationBar {
    width: 320px;
    margin-left: -3em;
  }
  .content {
    padding-bottom: 60px !important;
  }
}
</style>