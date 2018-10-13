// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import colors from 'vuetify/es5/util/colors'

import App from './App'
import router from './router'
import Axios from 'axios'

Vue.prototype.$http = Axios
Vue.use(Vuetify)
Vue.use(Vuex)
Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
    httpProgress: false
  }
})

const theme = {
  primary: colors.green.base,
  secondary: colors.green.lighten3,
  accent: colors.blue.lighten1,
  error: colors.red.base,
  warning: colors.lime.base,
  info: colors.orange.lighten3,
  success: colors.lightGreen.accent3
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App },
  data () {
    return {
      preloginpath: '/'
    }
  },
  beforeCreate: function () {
    this.$http.interceptors.request.use((config) => {
      this.$store.state.httpProgress = config.httpProgress
      return config
    }, err => {
      this.$store.state.httpProgress = false
      return Promise.reject(err)
    })

    this.$http.interceptors.response.use((res) => {
      res.preloginpath = this.$route.path
      this.$store.state.httpProgress = false
      return res
    }, err => {
      if (err.response.status === 401) {
        if (this.$route.path !== '/login') {
          this.preloginpath = this.$route.path
        }
        router.replace('/login')
      }
      if (err.response.data) {
        alert(err.response.data)
      }
      this.$store.state.httpProgress = false
      return Promise.reject(err)
    })
  },
  created () {
    this.$vuetify.theme = theme
  }
})

Vue.filter('toAmount', function (value) {
  return Number(value).toFixed(2)
})

Vue.filter('toDate', function (value) {
  return new Date(value * 1000).toLocaleDateString()
})
