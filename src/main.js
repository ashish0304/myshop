// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import colors from 'vuetify/es5/util/colors'

import App from './App'
import router from './router'
import Axios from 'axios'

Vue.prototype.$http = Axios
Vue.use(Vuetify)
Vue.config.productionTip = false

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
  router,
  template: '<App/>',
  components: { App },
  data () {
    return {
      preloginpath: '/'
    }
  },
  beforeCreate: function () {
    this.$http.interceptors.response.use((res) => { res.preloginpath = this.$route.path; return res }, (err) => {
      if (err.response.status === 401) {
        if (this.$route.path !== '/login') {
          this.preloginpath = this.$route.path
        }
        router.replace('/login')
      } else {
        alert(err.response.statusText)
      }
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
