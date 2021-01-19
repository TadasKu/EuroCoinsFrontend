<template>
  <div class="md-layout md-gutter md-alignment-top-center">
    <div class="md-layout-item md-size-66">
      <md-card>
        <md-card-header>
          <div class="md-title">{{ $t("UserSettings") }}</div>
        </md-card-header>
        <md-card-content>
          <form
            novalidate
            class="md-alignment-top-center"
            @submit.prevent="changeData()"
          >
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-100">
                <md-field>
                  <label for="Email"> {{ $t("Email") }}</label>
                  <md-input
                    name="email"
                    id="email"
                    autocomplete="given-name"
                    type="email"
                    v-model="User.email"
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
                    id="username"
                    autocomplete="given-name"
                    v-model="User.userName"
                    type="text"
                  />
                </md-field>
              </div>
            </div>
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-100">
                <md-field>
                  <label for="oldPassword"> {{ $t("OldPassword") }}</label>
                  <md-input
                    name="text"
                    id="oldpass"
                    autocomplete="given-name"
                    v-model="postBody.oldPassword"
                    type="password"
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
                    v-model="postBody.repeatPassword"
                    type="password"
                  />
                </md-field>
              </div>
            </div>
            <md-card-actions>
              <md-button type="submit" class="md-primary md-raised">{{
                $t("Save")
              }}</md-button>
            </md-card-actions>
          </form>
        </md-card-content>
      </md-card>
    </div>
  </div>
</template>

<script>
import Axios from "axios";
export default {
  name: "Home",
  components: {},
  data() {
    return {
      User: {},
      postBody: {
        oldPassword: null,
        password: null,
        repeatPassword: null,
      },
    };
  },
  methods: {
    getUserData() {
      Axios.get(
        this.$urlCore + "/User/GetOwnData/" + this.$store.state.user.userId,
        {
          headers: {
            Authorization: "Bearer " + this.$store.state.user.token,
          },
        }
      ).then((Response) => {
        this.User = Response.data;
      });
    },
    changeData() {
      if (this.postBody.password == this.postBody.repeatPassword) {
        Axios.patch(
          this.$urlCore +
            "/User/UpdateOwnData/" +
            this.$store.state.user.userId,
          {
            UserName: this.User.userName,
            Email: this.User.email,
            OldPassword: this.postBody.oldPassword,
            NewPassword: this.postBody.password,
          },
          {
            headers: {
              Authorization: "Bearer " + this.$store.state.user.token,
            },
          }
        );
      }
    },
  },
  created() {
    this.getUserData();
  },
};
</script>
