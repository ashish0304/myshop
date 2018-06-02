<template>
  <v-app dark class="ma-0 pa-0">
    <v-toolbar height="30px">
      <v-btn to="/stktran" small flat class="ma-0 pa-0" style="min-width: 50px;">
        Stocks
      </v-btn>
      <v-btn to="/pmttran" small flat class="ma-0 pa-0" style="min-width: 50px;">
        Payments
      </v-btn>
      <v-menu offset-y>
        <v-btn class="ma-0 pa-0" slot="activator" small flat style="min-width: 50px;">
          Reports<v-icon>arrow_drop_down</v-icon>
        </v-btn>
        <v-list dense>
          <v-list-tile to="/repstock">
            Stocks Available
          </v-list-tile>
          <v-list-tile to="/repprtbal">
            Party Balance
          </v-list-tile>
          <v-list-tile to="/repdattran">
            Datewise Transactions
          </v-list-tile>
          <v-list-tile to="/account">
            Accounts Info
          </v-list-tile>
          <v-list-tile to="/replocn">
            Locationwise Details
          </v-list-tile>
        </v-list>
      </v-menu>
      <input type="date" class="ma-0 pa-0" v-model="tranDate" style="width:105px;" />
      <v-menu offset-y>
        <v-btn class="ma-0 pa-0" slot="activator" small flat icon>
          <v-icon>account_circle</v-icon>
        </v-btn>
        <v-list dense>
          <v-list-tile to="/item">
            Item Details
          </v-list-tile>
          <v-list-tile to="/party">
            Party Details
          </v-list-tile>
          <v-list-tile to="/inventory">
            Inventory
          </v-list-tile>
          <v-list-tile @click.native="logout">
            Logout
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
  
    <v-content>
      <keep-alive include="stktran">
      <router-view :tranDate="tranDate">
        <v-container fluid></v-container>
      </router-view>
      </keep-alive>
    </v-content>
  </v-app>
</template>

<script>
  import replocn from '@/components/replocn'
  export default {
    name: 'App',
    data: () => ({
      tranDate: null
    }),
    components: {
      replocn
    },
    created () {
      this.tranDate = new Date().toJSON().slice(0, 10)
    },
    watch: {
      tranDate () {
        if (this.tranDate.length < 10) {
          this.tranDate = new Date().toJSON().slice(0, 10)
        }
      }
    },
    methods: {
      logout () {
        this.$http.get('/api/logout')
      }
    }
  }
</script>

<style>
  table, th, tr, td{
    height: .5em !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  table, td{
    border-left: 1px solid black;
    border-right: 1px solid black;
  }
</style>
