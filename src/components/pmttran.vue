<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-layout fluid>
      <v-flex>
        <v-select
          v-bind:items="arrType"
          v-model="txnType"
          label="Payment For"
          hide-details>
        </v-select>
      </v-flex>
      <v-flex>
        <v-select
          :items="arrAcc"
          v-model="txnAcc"
          label="Account"
          item-text="description"
          item-value="id"
          return-object
          hide-details>
        </v-select>
      </v-flex>
    </v-layout>
    <v-layout fluid>
      <v-flex v-show="!['W', 'T', 'C', 'D'].includes(txnType)">
        <v-autocomplete
          :items="arrPrt"
          v-model="txnPrt"
          label="Party"
          item-text="description"
          item-value="id"
          placeholder="description"
          :search-input.sync="searchPrt"
          :loading="ldgParty"
          hide-no-data
          clearable
          return-object
          hide-details>
        </v-autocomplete>
      </v-flex>
      <v-flex v-show="txnType=='T'" >
        <v-select
          :items="arrTgtAcc"
          v-model="txnTgtAcc"
          label="From Account"
          item-text="description"
          item-value="id"
          return-object
          hide-details>
        </v-select>
      </v-flex>
      <v-flex>
        <v-text-field
          type="number"
          v-model.number="txnAmount"
          label="Amount"
          :placeholder="txnPrt?txnPrt.balance:null"
          @blur="txnAmount=parseFloat(txnAmount)"
          hide-details>
        </v-text-field>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs8>
        <v-text-field
          v-model="txnComment"
          label="Comment/Bank branch, cheque number"
          hide-details>
        </v-text-field>
      </v-flex>
      <v-flex xs4>
        <v-text-field
          type="date"
          label="Cheque Date"
          v-model="dtCheque"
          hide-details/>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12>
        <v-btn v-on:click.native="submitTrans" color="primary" small block>
          Ok
        </v-btn>
      </v-flex>
    </v-layout>
    <v-data-table
      :headers="head"
      :items="data"
      hide-actions
      class="elevation-1" >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.type }}</td>
        <td class="text-xs-left">{{ props.item.date | toDate }}</td>
        <td class="text-xs-left">{{ props.item.account }}
          <router-link v-if="props.item.party" :to="'/party/'+props.item.prt_id">{{props.item.party}}</router-link>
          <span v-if="props.item.comment">({{ props.item.comment }})</span>
        </td>
        <td class="text-xs-right">{{ props.item.amount | toAmount }}</td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  name: 'pmttran',
  props: {
    tranDate: String
  },
  data () {
    return {
      txnType: 'S',
      arrType: [
        {text: 'Sale', value: 'S'},
        {text: 'Purchase', value: 'P'},
        {text: 'Wages/Rent', value: 'W'},
        {text: 'Transfer/Deposit', value: 'T'},
        {text: 'Service Charges', value: 'C'},
        {text: 'Petty Expenses', value: 'D'},
        {text: 'Petty Loan Taken', value: 'H'},
        {text: 'Petty Loan Given', value: 'G'}
      ],
      txnAcc: null,
      arrAcc: [],
      txnTgtAcc: null,
      arrTgtAcc: [],
      txnPrt: null,
      arrPrt: [],
      ldgParty: false,
      txnAmount: null,
      txnComment: null,
      dtCheque: null,
      searchPrt: null,
      head: [
        { text: 'Type', value: 'type', sortable: false, align: 'left' },
        { text: 'Date', value: 'date', sortable: false, align: 'left' },
        { text: 'Description', value: 'account', sortable: false, align: 'left' },
        { text: 'Amount', value: 'amount', sortable: false }
      ],
      data: [],
      trans: {}
    }
  },
  created () {
    this.getAccount()
    this.getTrans()
  },
  watch: {
    searchPrt (val) {
      if (this.arrPrt.length > 0) { return }
      this.ldgParty = true

      this.$http.get('/api/parties/' + val).then((res) => {
        this.arrPrt = res.data
      }).finally(() => (this.ldgParty = false))
    },
    txnPrt: function () {
      if (!this.txnPrt) {
        this.arrPrt.splice(0, this.arrPrt.length)
      }
    },
    txnAcc () {
      this.arrTgtAcc = this.arrAcc.slice(0)
      let ind = this.arrTgtAcc.findIndex(x => x.id === this.txnAcc.id)
      this.arrTgtAcc.splice(ind, 1)
    }
  },
  methods: {
    submitTrans () {
      this.trans.type = this.txnType
      this.trans.date = Date.parse(this.tranDate + ' ' + new Date().toLocaleTimeString()) / 1000
      this.trans.prt_id = this.txnPrt ? this.txnPrt.id : 0
      this.trans.acc_id = this.txnAcc.id
      this.trans.amount = this.txnAmount
      this.trans.chq_date = Date.parse(this.dtCheque) / 1000
      this.trans.comment = this.txnComment
      this.trans.tgt_acc_id = this.txnTgtAcc ? this.txnTgtAcc.id : 0
      this.$http.post('/api/pmttran', this.trans, {httpProgress: true}).then((res) => {
        this.txnPrt = null
        this.arrPrt.splice(0, this.arrPrt.length)
        this.txnTgtAcc = null
        this.txnAmount = null
        this.txnComment = null
        this.dtCheque = null

        this.getTrans()
        this.tranOffset = 0
      })
    },
    getAccount () {
      this.$http.get('/api/account', {httpProgress: true}).then((res) => {
        this.arrAcc = res.data
        this.txnAcc = this.arrAcc[0]
      })
    },
    getTrans () {
      this.$http.get('/api/payments?limit=25', {httpProgress: true}).then((restran) => {
        this.data = restran.data
      })
    }
  }
}
</script>
