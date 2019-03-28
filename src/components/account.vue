<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-layout row wrap>
      <v-flex>
        <v-select
          :items="arrAccount"
          v-model="txnAccount"
          item-text="description"
          item-value="id"
          label="Description"
          placeholder="Description"
          return-object
          hide-details>
        </v-select>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs8>
        <v-text-field
          v-model="txnAccount.description"
          label="Description"
          placeholder="Description"
          hide-details>
        </v-text-field>
      </v-flex>
      <v-flex xs4>
        <v-text-field
          type="number"
          v-model.number="txnAccount.balance"
          label="Balance"
          hide-details>
        </v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12>
        <v-btn
          v-on:click.native="addEditAcc"
          :disabled="!txnAccount.description || txnAccount.description.length<4"
          color="primary" small block>
          {{ txnAccount.id?"Save":"Add" }}
        </v-btn>
      </v-flex>
    </v-layout>
    <v-data-table
      :headers="head"
      :items="data"
      :pagination.sync="pagination"
      hide-actions
      class="elevation-1" >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.date | toDate }}</td>
        <td class="text-xs-left">{{ props.item.type }}
          <span v-if="props.item.prt_id>0"><router-link :to="'/party/'+props.item.prt_id">{{ props.item.party }}</router-link></span>
          <span v-if="props.item.comment">{{ props.item.comment }}</span>
        </td>
        <td class="text-xs-right">{{ props.item.amount | toAmount }}</td>
      </template>
    </v-data-table>
    <v-pagination v-model="pagination.page" :length="pages" circle>
    </v-pagination>
  </v-container>
</template>

<script>
export default {
  name: 'account',
  props: {
    id: Number
  },
  data () {
    return {
      arrAccount: [],
      txnAccount: {
        id: null,
        description: null,
        balance: null
      },
      head: [
        { text: 'Date', value: 'date', sortable: false, align: 'left' },
        { text: 'Description', value: 'desc', sortable: false, align: 'left' },
        { text: 'Amount', value: 'amount', sortable: false, align: 'right' }
      ],
      data: [],
      pagination: { rowsPerPage: 25 }
    }
  },
  created: function () {
    this.getAccounts()
    if (this.id > 0) {
      this.txnAccount = this.arrAccount[this.id]
    } else {
      this.initBlank()
    }
  },
  watch: {
    '$route.params.id': function () {
      if (this.id) {
        this.txnAccount = this.arrAccount[this.id]
        this.getTrans()
      } else {
        this.initBlank()
      }
    },
    'pagination.page': function () {
      this.getTrans(this.txnAccount.id)
    },
    'txnAccount.id' () {
      if (!this.txnAccount || this.txnAccount.id === 0) {
        this.initBlank()
        return
      }
      this.getTrans()
    }
  },
  methods: {
    initBlank () {
      this.txnAccount = {}
      this.$set(this.txnAccount, 'id', null)
      this.$set(this.txnAccount, 'description', null)
      this.$set(this.txnAccount, 'balance', null)
      this.data.splice(0, this.data.length)
    },
    getAccounts () {
      this.$http.get('/api/account', {httpProgress: true}).then((res) => {
        this.arrAccount = res.data
        this.txnAccount = this.arrAccount[0]
      })
    },
    getTrans () {
      if (this.txnAccount.id < 1) { return }
      this.$http.get(`/api/acctrans?acc=${this.txnAccount.id}`, {httpProgress: true}).then((res) => {
        this.data = res.data
      })
    },
    addEditAcc () {
      if (this.txnAccount.id) {
        // update account
        this.$http.put('/api/account', this.txnAccount, {httpProgress: true}).then((res) => {
          alert('Updated successfully!')
        })
      } else {
        // insert account
        this.$http.post('/api/account', this.txnAccount, {httpProgress: true}).then((res) => {
          alert('Added successfully!')
        })
      }
    }
  },
  computed: {
    pages () {
      return this.pagination.rowsPerPage ? Math.ceil(this.data.length / this.pagination.rowsPerPage) : 0
    }
  }
}
</script>
