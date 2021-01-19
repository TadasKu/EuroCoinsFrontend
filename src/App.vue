<template>
  <div id="app" v-bind:key="selectedLanguage">
    <div id="nav">
      <router-link to="/">{{ $t("Main") }}</router-link>
      <label> | </label>
      <router-link to="/login" v-if="user.token == null">{{
        $t("Login")
      }}</router-link>
      <router-link
        to="/adminPage"
        v-if="user.role == 'Admin' || user.role == 'Viewer'"
        >{{ $t("AdminPage") }}</router-link
      >
      <label v-if="user.role == 'Admin' || user.role == 'Viewer'"> | </label>
      <router-link to="/settings" v-if="user.token != null">{{
        $t("Settings")
      }}</router-link>

      <label v-if="user.token != null"> | </label>
      <a href="/" v-if="user.token != null" @click="Logout"
        >{{ $t("Logout") }}
      </a>
    </div>
    <router-view />

    <footer class="md-layout md-gutter md-alignment-top-center">
      <md-card class="md-layout-item md-size-95 zeroPadding">
        <md-card-content class="zeroTopMargin">
          <div id="languageBar">
            <a href="" @click="changeLanguage('en')"
              ><div class="flagIcon" @click="changeLanguage('en')">
                <country-flag :country="'GB'" size="small" class="pointer" />
              </div>
              {{ $t("English") }}
            </a>

            |
            <a href="" @click="changeLanguage('lt')"
              ><div class="flagIcon" @click="changeLanguage('lt')">
                <country-flag :country="'LT'" size="small" class="pointer" />
              </div>
              {{ $t("Lithuanian") }}</a
            >
          </div>

          <div class="footerMain">
            <div class="row">
              <div class="column">
                <div class="logo md-xsmall-hide">
                  <img src="../public/2euro.svg" alt="noPhoto" />
                </div>
              </div>
              <div class="columnBigger">
                <div class="aboutColumn">
                  <p>{{ $t("AboutPage") }}</p>
                  <p>© Tadas Kuprys, 2020</p>
                </div>
                <div class="linkedin-logo">
                  <img
                    @click="pushToLinkedin"
                    src="..\public\linkedin.png"
                    alt="noPhoto"
                  />
                </div>
                <div class="fb-logo">
                  <img
                    @click="pushToFb"
                    src="..\public\fb-logo.png"
                    alt="noPhoto"
                  />
                </div>
                <div @click="scrollToTop" class="scrollToTopBtn">
                  <img src="..\public\scrollToTop.png" alt="noPhoto" />
                </div>
              </div>
            </div>

            <br />
          </div>
        </md-card-content>
      </md-card>
    </footer>
  </div>
</template>
<script>
import store from "./store/index";
// import Iso from "./_helpers/IsoReverse";
export default {
  data() {
    return {
      user: {},
      selectedLanguage: null,
    };
  },
  created() {
    this.user = store.getters.user;
  },
  methods: {
    Logout() {
      this.$store.dispatch("delete_UserAction");
    },
    changeLanguage(language) {
      this.$store.dispatch("change_LanguageAction", language);
      this.selectedLanguage = language;
    },
    scrollToTop: function () {
      window.scrollTo(0, 0);
    },
    pushToFb() {
      window.open("https://www.facebook.com/tadas.kuprys");
    },
    pushToLinkedin() {
      window.open("https://www.linkedin.com/in/tadas-kuprys-228833151");
    },
  },
};
</script>
<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
#languageBar {
  background-color: #f1f1f1;
  border: 1px solid rgba(0, 0, 0, 0.2);
  height: 30px;
  padding-top: 0.5em;
}
#languageBar a {
  font-weight: bold;
  color: #2c3e50;
}
#languageBar a:hover {
  color: #42b983;
}
footer {
  margin-top: 5em;
}
.footerMain {
  height: 10em;
  background-color: #5c6774;
  background: linear-gradient(
    0deg,
    rgba(92, 103, 116, 1) 11%,
    rgba(133, 148, 152, 1) 87%
  );
  width: 100%;
  padding: 10px;
}
.zeroTopMargin {
  padding-top: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  padding-bottom: 0 !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  margin-bottom: 0 !important;
}
.zeroPadding {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
.logo {
  width: 125px;
  position: absolute;
}
/* .aboutPage {
  display: inline;
  width: 15%;
  padding-top: 5em;
} */
.scrollToTopBtn {
  top: 0;
  right: 0;
  position: absolute;
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255);
  float: right;
  transition: border 10ms;
  cursor: pointer;
}
.scrollToTopBtn:hover {
  border: 4px solid rgba(255, 255, 255);
}
.row {
  display: inline;
}
.column {
  float: left;
  max-width: 33%;
}
.columnBigger {
  margin-left: auto;
  margin-right: auto;
  position: relative;
}
.columnBigger p {
  line-height: 10px;
  right: 40px;
}
.aboutColumn {
  margin-top: 6em;
}
.fb-logo {
  width: 40px;
  top: 0;
  right: 55px;
  position: absolute;
  cursor: pointer;
}
.linkedin-logo {
  background: white;
  border-radius: 10px;
  width: 40px;
  top: 0;
  right: 100px;
  position: absolute;
  cursor: pointer;
}
@media only screen and (max-width: 599px) {
  @media only screen and (max-height: 320px) {
    .aboutColumn {
      margin-top: 2em;
      /* width: 60%; */
    }
    .fb-logo {
      margin-top: 3.5em !important;
    }
    .scrollToTopBtn {
      margin-top: 3.5em !important;
    }
    .linkedin-logo {
      margin-top: 3.5em !important;
    }
  }
  .aboutColumn {
    margin-top: 3em;
    /* width: 60%; */
  }
  .fb-logo {
    margin-top: 3em;
  }
  .scrollToTopBtn {
    margin-top: 3em;
  }
  .linkedin-logo {
    margin-top: 3em;
  }
}
@media only screen and (max-width: 320px) {
}
@media only screen and (max-width: 320px) {
  .aboutColumn {
    margin-top: 2em;
    /* width: 60%; */
  }

  .fb-logo {
    display: none;
  }
  .linkedin-logo {
    display: none;
  }
  .scrollToTopBtn {
    margin-top: 2em;
  }
}
.flagIcon {
  width: 15;
  display: inline;
}
</style>
