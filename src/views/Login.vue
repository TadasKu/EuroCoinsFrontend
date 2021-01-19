<template>
  <div>
    <form
      novalidate
      class="md-layout md-alignment-top-center"
      @submit.prevent="Login"
    >
      <md-card class="md-layout-item md-size-50 md-small-size-100">
        <md-card-header>
          <div class="md-title">{{ $t("Login") }}</div>
        </md-card-header>
        <md-card-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="Email"> {{ $t("Email") }}</label>
                <md-input
                  name="email"
                  id="email"
                  type="email"
                  autocomplete="given-name"
                  v-model="user.email"
                />
              </md-field>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="Password"> {{ $t("Password") }}</label>
                <md-input
                  name="password"
                  id="password"
                  autocomplete="given-name"
                  v-model="user.password"
                  type="password"
                />
              </md-field>
            </div>
          </div>
          <md-card-actions>
            <transition name="errorShowUp">
              <p class="error" v-if="error != ''">{{ $t(error) }}</p>
            </transition>
            <!-- <div class="error">
              <label>{{ $t(error) }}</label>
            </div> -->

            <md-button type="submit" class="md-primary md-raised">{{
              $t("Login")
            }}</md-button>
          </md-card-actions>
          <a href="/register">{{ $t("CreateNewUser") }}</a>
        </md-card-content>
      </md-card>
    </form>
  </div>
</template>

<script>
import Axios from "axios";
export default {
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
      error: "",
    };
  },
  methods: {
    Login() {
      this.error = "";
      Axios.post(this.$urlCore + "/User/login", {
        Email: this.user.email,
        password: this.user.password,
      })
        .then((Response) => {
          if (Response.status === 200) {
            var token = Response.data;
            this.$store.dispatch("set_UserAction", token);
            this.$router.push("/");
          }
        })
        .catch(() => {
          this.error = "ErrorInvalidLoginData";
        });
    },
  },
};
</script>

<style scoped>
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