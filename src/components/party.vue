<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-layout row wrap>
      <v-flex xs8>
        <v-autocomplete
          :items="arrParty"
          v-model="txnParty"
          item-text="description"
          item-value="id"
          label="Description"
          placeholder="Description"
          :search-input.sync="searchParty"
          :loading="ldgParty"
          hide-no-data
          return-object
          clearable
          hide-details>
        </v-autocomplete>
      </v-flex>
      <v-flex xs4>
        <v-text-field
          v-model="txnParty.gstn"
          label="GSTN"
          placeholder="GSTN"
          hide-details>
        </v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs8>
        <v-text-field
          v-model="txnParty.description"
          label="Description"
          placeholder="Description"
          hide-details>
        </v-text-field>
      </v-flex>
      <v-flex xs4>
        <v-text-field
          type="number"
          v-model.number="txnParty.balance"
          label="Balance"
          placeholder="Balance"
          hide-details>
        </v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs8>
        <v-text-field
          v-model="txnParty.address"
          placeholder="Address"
          label="Address"
          hide-details>
        </v-text-field>
      </v-flex>
      <v-flex xs4>
        <v-text-field
          v-model="txnParty.chq_amt"
          label="Cheque Amt"
          hide-details>
        </v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12>
        <v-btn
          v-on:click.native="addEditParty"
          :disabled="txnParty.description.length<5"
          color="primary" small block>
          {{ txnParty.id?"Save":"Add" }}
        </v-btn>
      </v-flex>
    </v-layout>
    <v-data-table
      :headers="headItm"
      :items="dataItm"
      hide-actions
      class="elevation-1" >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.type }}</td>
        <td class="text-xs-left">{{ props.item.date | toDate }}</td>
        <td class="text-xs-left">{{ props.item.item }}</td>
        <td class="text-xs-right">{{ props.item.quantity }}</td>
        <td class="text-xs-right">{{ props.item.rate | toAmount }}</td>
        <td class="text-xs-right">{{ props.item.quantity * props.item.rate | toAmount }}</td>
      </template>
    </v-data-table>
    <v-layout row wrap>
      <v-btn v-on:click.native="firstItem" small fab>
        <v-icon>first_page</v-icon>
      </v-btn>
      <v-btn v-on:click.native="prevItem" small fab>
        <v-icon>navigate_before</v-icon>
      </v-btn>
      <v-btn v-on:click.native="nextItem" small fab>
        <v-icon>navigate_next</v-icon>
      </v-btn>
    </v-layout>
    <v-data-table
      :headers="headPmt"
      :items="dataPmt"
      hide-actions
      class="elevation-1" >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.type }}</td>
        <td class="text-xs-left">{{ props.item.date | toDate }}</td>
        <td class="text-xs-left">{{ props.item.account }}</td>
        <td class="text-xs-right">{{ props.item.amount | toAmount }}</td>
      </template>
    </v-data-table>
    <v-layout row wrap>
      <v-btn v-on:click.native="firstPay" small fab>
        <v-icon>first_page</v-icon>
      </v-btn>
      <v-btn v-on:click.native="prevPay" small fab>
        <v-icon>navigate_before</v-icon>
      </v-btn>
      <v-btn v-on:click.native="nextPay" small fab>
        <v-icon>navigate_next</v-icon>
      </v-btn>
    </v-layout>
    <v-layout v-show="txnParty.id" row wrap>
      <v-flex xs4>
        <v-text-field type="date" label="From" v-model="dtFrom" hide-details/>
      </v-flex>
      <v-flex xs4>
        <v-text-field type="date" label="To" v-model="dtTo" hide-details/>
      </v-flex>
      <v-flex xs4>
        <v-btn @click.native="saveData" color="primary" small top>Save As XL Sheet
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import XLSX from 'xlsx'
export default {
  name: 'party',
  props: {
    partyID: Number
  },
  data () {
    return {
      arrParty: [],
      txnParty: {
        id: '',
        description: '',
        address: '',
        gstn: '',
        balance: '',
        chq_amt: ''
      },
      ldgParty: false,
      headItm: [
        { text: 'Type', value: 'type', sortable: false, align: 'left' },
        { text: 'Date', value: 'date', sortable: false, align: 'left' },
        { text: 'Item', value: 'item', sortable: false, align: 'left' },
        { text: 'Qty', value: 'qty', sortable: false, align: 'right' },
        { text: 'Rate', value: 'rate', sortable: false, align: 'right' },
        { text: 'Total', value: 'total', sortable: false, align: 'right' }
      ],
      headPmt: [
        { text: 'Type', value: 'type', sortable: false, align: 'left' },
        { text: 'Date', value: 'date', sortable: false, align: 'left' },
        { text: 'Account', value: 'account', sortable: false, align: 'left' },
        { text: 'Amount', value: 'amount', sortable: false, align: 'right' }
      ],
      dataItm: [],
      itmOffset: 0,
      itmRows: 10,
      dataPmt: [],
      pmtOffset: 0,
      pmtRows: 5,
      searchParty: null,
      dtFrom: '',
      dtTo: ''
    }
  },
  created: function () {
    if (this.partyID > 0) {
      this.getParty(this.partyID)
    } else {
      this.initBlank()
    }
  },
  watch: {
    '$route.params.partyID': function () {
      if (this.partyID) {
        this.getParty(this.partyID)
        this.getTrans(this.partyID)
      } else {
        this.initBlank()
      }
    },
    txnParty () {
      if (!this.txnParty) {
        this.initBlank()
        this.arrParty.splice(0, this.arrParty.length)
        return
      }
      this.getItmTrans(this.txnParty.id)
      this.getPmtTrans(this.txnParty.id)
    },
    searchParty (val) {
      if (this.arrParty.length > 0) { return }
      this.ldgParty = true

      this.$http.get('/api/parties/' + val).then((res) => {
        this.arrParty = res.data
      }).finally(() => (this.ldgParty = false))
    }
  },
  methods: {
    initBlank () {
      this.txnParty = {}
      this.$set(this.txnParty, 'id', 0)
      this.$set(this.txnParty, 'description', '')
      this.$set(this.txnParty, 'address', '')
      this.$set(this.txnParty, 'gstn', '')
      this.$set(this.txnParty, 'balance', 0)
      this.$set(this.txnParty, 'chq_amt', 0)
      this.dataItm.splice(0, this.dataItm.length)
      this.dataPmt.splice(0, this.dataPmt.length)
      this.itmOffset = 0
      this.pmtOffset = 0
    },
    getParty (id) {
      this.$http.get(`/api/party/${id}`, {httpProgress: true}).then((res) => {
        this.txnParty = res.data
        this.arrParty.splice(0, this.arrParty.length)
        this.arrParty.push(this.txnParty)
      })
    },
    getItmTrans (id) {
      if (id < 1) { return }
      this.$http.get(`/api/party/${id}/items?offset=${this.itmOffset}&limit=${this.itmRows}`, {httpProgress: true}).then((restran) => {
        if (restran.data.length > 0) {
          this.dataItm = restran.data
        } else if (this.dataItm.length > 0) {
          this.itmOffset -= this.itmRows
          alert('No more transaction!')
        } else {
          alert('No transaction!')
        }
      })
    },
    firstItem () {
      if (this.itmOffset === 0) { return }
      this.itmOffset = 0
      this.getItmTrans(this.txnParty.id)
    },
    prevItem () {
      if (this.itmOffset < this.itmRows) { return }
      this.itmOffset -= this.itmRows
      this.getItmTrans(this.txnParty.id)
    },
    nextItem () {
      this.itmOffset += this.itmRows
      this.getItmTrans(this.txnParty.id)
    },
    getPmtTrans (id) {
      if (id < 1) { return }
      this.$http.get(`/api/party/${id}/payments?offset=${this.pmtOffset}&limit=${this.pmtRows}`, {httpProgress: true}).then((restran) => {
        if (restran.data.length > 0) {
          this.dataPmt = restran.data
        } else if (this.dataPmt.length > 0) {
          this.pmtOffset -= this.pmtRows
          alert('No more transaction!')
        } else {
          alert('No transaction!')
        }
      })
    },
    saveData () {
      this.$http.get(`/api/partystk/${this.txnParty.id}?&dtfr=${(Date.parse(this.dtFrom) / 1000)}&dtto=${(Date.parse(this.dtTo) / 1000) + 86399}`, {httpProgress: true}).then((res) => {
        let wb = XLSX.utils.book_new()
        let wsSale = {}
        let wsPurchase = {}
        let jsnSale = []
        let jsnPurchase = []
        for (let sl of res.data.sale) {
          jsnSale.push({
            Date: new Date(sl.date * 1000).toLocaleDateString(),
            Description: sl.item,
            Quantity: Number(sl.quantity),
            Rate: Number(sl.rate),
            Amount: Number(sl.quantity * sl.rate)
          })
        }
        for (let pr of res.data.purchase) {
          jsnPurchase.push({
            Date: new Date(pr.date * 1000).toLocaleDateString(),
            Description: pr.item,
            Quantity: Number(pr.quantity),
            Rate: Number(pr.rate),
            Amount: Number(pr.quantity * pr.rate)
          })
        }
        if (jsnSale.length > 0) {
          XLSX.utils.sheet_add_json(wsSale, jsnSale, {origin: 'A3'})
          XLSX.utils.book_append_sheet(wb, wsSale, 'Sales')
        }
        if (jsnPurchase.length > 0) {
          XLSX.utils.sheet_add_json(wsPurchase, jsnPurchase, {origin: 'A3'})
          XLSX.utils.book_append_sheet(wb, wsPurchase, 'Purchase')
        }
        XLSX.writeFile(wb, this.txnParty.description + '-' + this.dtFrom + ' to ' + this.dtTo + '.xlsx')
      })
    },
    firstPay () {
      if (this.pmtOffset === 0) { return }
      this.pmtOffset = 0
      this.getPmtTrans(this.txnParty.id)
    },
    prevPay () {
      if (this.itmOffset < this.pmtRows) { return }
      this.pmtOffset -= this.pmtRows
      this.getPmtTrans(this.txnParty.id)
    },
    nextPay () {
      this.pmtOffset += this.pmtRows
      this.getPmtTrans(this.txnParty.id)
    },
    addEditParty () {
      if (this.txnParty.id > 0) {
        // update party
        this.$http.put('/api/party', this.txnParty, {httpProgress: true}).then((res) => {
          alert('Updated successfully!')
        })
      } else {
        // insert party
        this.$http.post('/api/party', this.txnParty, {httpProgress: true}).then((res) => {
          alert('Added successfully!')
        })
      }
    }
  }
}
</script>
