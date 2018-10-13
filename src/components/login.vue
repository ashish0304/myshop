<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-layout>
      <v-flex xs12>
        <v-text-field
          type="text"
          label="User Id"
          v-model="userid"
          hide-details>
        </v-text-field>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12>
        <v-text-field
          type="password"
          label="Password"
.          v-model="password"
          hide-details>
        </v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs6>
        <v-checkbox
          label="Remember me"
          v-model="flag">
        </v-checkbox>      
      </v-flex>
      <v-flex xs6>
        <v-btn @click.native="login" primary small block>Login</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      userid: '',
      password: '',
      flag: false
    }
  },
  methods: {
    login () {
      this.$http.post(`/api/login?userid=${this.userid}&password=${this.password}&flag=${this.flag}`, {httpProgress: true}).then((res) => {
        this.$router.push(this.$root.preloginpath)
      })
    }
  }
}
</script>
