<template>
  <div class="Registration">
    <form
      novalidate
      class="md-layout md-alignment-top-center"
      @submit.prevent="signUp"
    >
      <md-card class="md-layout-item md-size-50 md-small-size-100">
        <md-card-header>
          <div class="md-title">{{ $t("Registration") }}</div>
          <h3 class="successfulNotification">{{ $t(notification) }}</h3>
        </md-card-header>
        <md-card-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="Email"> {{ $t("Email") }}</label>
                <md-input
                  name="email"
                  id="email"
                  autocomplete="given-name"
                  v-model="postBody.email"
                  type="email"
                />
              </md-field>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="Username"> {{ $t("UserName") }}</label>
                <md-input
                  name="text"
                  id="text"
                  autocomplete="given-name"
                  v-model="postBody.userName"
                  type="text"
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
                  v-model="postBody.password"
                  type="password"
                />
              </md-field>
            </div>
          </div>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="Password"> {{ $t("PasswordRepeat") }}</label>
                <md-input
                  name="passwordRepeat"
                  id="passwordRepeat"
                  autocomplete="given-name"
                  v-model="postBody.passwordRepeat"
                  type="password"
                />
              </md-field>
            </div>
          </div>
          <md-card-actions>
            <transition name="errorShowUp">
              <p class="error" v-if="error != ''">{{ $t(error) }}</p>
            </transition>
            <md-button type="submit" class="md-primary md-raised">{{
              $t("Register")
            }}</md-button>
          </md-card-actions>
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
      postBody: {
        userName: null,
        password: null,
        passwordRepeat: null,
        email: null,
      },
      error: "",
      notification: "",
    };
  },
  methods: {
    signUp() {
      this.error = "";
      if (this.postBody.password.length <= 6) {
        this.error = "ErrorPasswordTooShort";
        return;
      }
      if (this.postBody.password == this.postBody.passwordRepeat) {
        Axios.post(this.$urlCore + "/User/signup", {
          Username: this.postBody.userName,
          Email: this.postBody.email,
          Password: this.postBody.password,
        })
          .then((Response) => {
            this.notification = "RegistratrionSuccessful";
            console.log(Response);
            this.$router.push("/login");
          })
          .catch((err) => {
            this.error = err.response.data.message;
          });
      } else {
        this.error = "ErrorPasswordsDontMatch";
      }
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
.successfulNotification {
  color: green;
}
</style>