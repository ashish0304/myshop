<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-data-table
      :headers="head"
      :items="dataR"
      :pagination.sync="pageR"
      hide-actions
      class="elevation-1" >
      <template slot="items" slot-scope="props">
        <td>
          <v-btn class="pa-0 ma-0" @click.native="honor(props.item)" small icon>
            <v-icon size="14">check</v-icon>
          </v-btn>
        </td>
        <td>
          <v-btn class="pa-0 ma-0" @click.native="cancel(props.item)" small icon>
            <v-icon size="14">cancel</v-icon>
          </v-btn>
        </td>
        <td class="text-xs-left"><router-link :to="'/account/'+props.item.acc_id">{{ props.item.account }}</router-link></td>
        <td class="text-xs-left"><router-link :to="'/party/'+props.item.prt_id">{{ props.item.party }}</router-link></td>
        <td class="text-xs-left">{{ props.item.description }}</td>
        <td class="text-xs-left">{{ props.item.date | toDate }}</td>
        <td class="text-xs-right">{{ props.item.amount | toAmount }}</td>
      </template>
    </v-data-table>
    <v-pagination v-model="pageR.page" :length="pages(pageR, dataR)" circle>
    </v-pagination>
    <v-data-table
      :headers="head"
      :items="dataP"
      :pagination.sync="pageP"
      hide-actions
      class="elevation-1" >
      <template slot="items" slot-scope="props">
        <td>
          <v-btn class="pa-0 ma-0" @click.native="honor(props.item)" small icon>
            <v-icon size="14">check</v-icon>
          </v-btn>
        </td>
        <td>
          <v-btn class="pa-0 ma-0" @click.native="cancel(props.item)" small icon>
            <v-icon size="14">cancel</v-icon>
          </v-btn>
        </td>
        <td class="text-xs-left"><router-link :to="'/account/'+props.item.acc_id">{{ props.item.account }}</router-link></td>
        <td class="text-xs-left"><router-link :to="'/party/'+props.item.prt_id">{{ props.item.party }}</router-link></td>
        <td class="text-xs-left">{{ props.item.description }}</td>
        <td class="text-xs-left">{{ props.item.date | toDate }}</td>
        <td class="text-xs-right">{{ props.item.amount * -1 | toAmount }}</td>
      </template>
    </v-data-table>
    <v-pagination v-model="pageP.page" :length="pages(pageP, dataP)" circle>
    </v-pagination>
  </v-container>
</template>

<script>
export default {
  name: 'cheques',
  props: {
    tranDate: String
  },
  data () {
    return {
      dataR: [],
      dataP: [],
      head: [
        { text: '', value: '', sortable: false },
        { text: '', value: '', sortable: false },
        { text: 'Account', value: 'account', sortable: false, align: 'left' },
        { text: 'Party', value: 'party', sortable: false, align: 'left' },
        { text: 'Description', value: 'description', sortable: false, align: 'left' },
        { text: 'Date', value: 'date', sortable: false, align: 'left' },
        { text: 'Amount', value: 'amount', sortable: false, align: 'right' }
      ],
      pageR: { page: 1, rowsPerPage: 10 },
      pageP: { page: 1, rowsPerPage: 10 }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.$http.get('/api/cheques', {httpProgress: true}).then((res) => {
        this.dataR = res.data.R
        this.dataP = res.data.P
      })
    },
    pages (p, d) {
      return p.rowsPerPage ? Math.ceil(d.length / p.rowsPerPage) : 0
    },
    honor (d) {
      if (!confirm('Are you sure?')) { return }
      let dt = Date.parse(this.tranDate + ' ' + new Date().toLocaleTimeString()) / 1000
      this.$http.put(`/api/chequehonor?date=${dt}`, d, {httpProgress: true}).then((res) => {
        this.getData()
      })
    },
    cancel (d) {
      if (!confirm('Are you sure to cancel the cheque?')) { return }
      this.$http.put('/api/chequecancel', d, {httpProgress: true}).then((res) => {
        this.getData()
      })
    }
  }
}
</script>
