<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-data-table
      :headers="head"
      :items="dataR"
      :pagination.sync="paginationR"
      hide-actions
      class="elevation-1" >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">
          <span style="float: left;">
            <router-link :to="'/party/'+props.item.id">{{ props.item.description }}</router-link>
          </span>
          <span v-show="props.item.chq_amt>0" style="float: right;">
            Cheque:{{ props.item.chq_amt | toAmount }}
          </span>
        </td>
        <td class="text-xs-right">{{ props.item.balance | toAmount }}</td>
      </template>
      <template slot="footer">
        <td class="text-xs-right">Total</td>
        <td class="text-xs-right">{{ totalR | toAmount }}</td>
      </template>
    </v-data-table>
    <v-pagination v-model="paginationR.page" :length="pagesR" circle>
    </v-pagination>
    <v-data-table
      :headers="head"
      :items="dataP"
      :pagination.sync="paginationP"
      hide-actions
      class="elevation-1" >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">
          <span style="float: left;">
            <router-link :to="'/party/'+props.item.id">{{ props.item.description }}</router-link>
          </span>
          <span v-show="props.item.chq_amt>0" style="float: right;">
            Cheque:{{ props.item.chq_amt | toAmount }}
          </span>
        </td>
        <td class="text-xs-right">{{ props.item.balance | toAmount }}</td>
      </template>
      <template slot="footer">
        <td class="text-xs-right">Total</td>
        <td class="text-xs-right">{{ totalP | toAmount }}</td>
      </template>
    </v-data-table>
    <v-pagination v-model="paginationP.page" :length="pagesP" circle>
    </v-pagination>
  </v-container>
</template>

<script>
export default {
  name: 'repprtbal',
  data () {
    return {
      dataR: [],
      dataP: [],
      head: [
        { text: 'Party', value: 'description', sortable: false, align: 'left' },
        { text: 'Balance', value: 'balance', sortable: false, align: 'right' }
      ],
      paginationR: { rowsPerPage: 15 },
      paginationP: { rowsPerPage: 15 }
    }
  },
  created () {
    this.$http.get('/api/partiesbal', {httpProgress: true}).then((res) => {
      this.dataR = res.data.R
      this.dataP = res.data.P
    })
  },
  computed: {
    pagesR () {
      return this.paginationR.rowsPerPage ? Math.ceil(this.dataR.length / this.paginationR.rowsPerPage) : 0
    },
    totalR () {
      return this.dataR.reduce(function (a, b) {
        return a + b.balance
      }, 0)
    },
    pagesP () {
      return this.paginationP.rowsPerPage ? Math.ceil(this.dataP.length / this.paginationP.rowsPerPage) : 0
    },
    totalP () {
      return this.dataP.reduce(function (a, b) {
        return a + b.balance
      }, 0)
    }
  }
}
</script>
