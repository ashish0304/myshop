<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-layout row wrap>
      <v-flex xs7>
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
      <v-flex xs5>
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
          :disabled="!txnParty.description || txnParty.description.length<5"
          color="primary" small block>
          {{ txnParty.id?"Save":"Add" }}
        </v-btn>
      </v-flex>
    </v-layout>
    <v-data-table v-if="dataSumry.length>0"
      :headers="headSumry"
      :items="dataSumry"
      item-key="id"
      :pagination.sync="pagSumry"
      :expand="expand"
      hide-actions
      class="elevation-1" >
      <template v-slot:items="props">
        <tr @click="props.expanded=!props.expanded;getItmTrans(props.item.type, props.item.date, props.item.lcn_id)">
          <td class="text-xs-left">{{ props.item.locn }}</td>
          <td class="text-xs-left">{{ props.item.type }}</td>
          <td class="text-xs-left"><span v-show="props.item.invoice">{{props.item.invoice}} dt. </span>{{ props.item.date | toDate }}</td>
          <td class="text-xs-right">{{ props.item.amount | toAmount }}</td>
        </tr>
      </template>
      <template v-slot:expand="props">
        <v-card class="elevation-10">
          <v-card-text>
            <v-data-table
              :headers="headItm"
              :items="dataItm"
              hide-actions
              class="elevation-10">
              <template v-slot:items="props">
                <td class="text-xs-left">{{ props.item.description }}</td>
                <td class="text-xs-right">{{ props.item.quantity }}</td>
                <td class="text-xs-right">{{ props.item.rate | toAmount }}</td>
                <td class="text-xs-right">{{ props.item.quantity * props.item.rate | toAmount }}</td>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </template>
    </v-data-table>
    <v-pagination v-model="pagSumry.page" :length="sumryPages" v-if="dataSumry.length>0" circle>
    </v-pagination>
    <v-data-table v-if="dataPmt.length>0"
      :headers="headPmt"
      :items="dataPmt"
      :pagination.sync="pagPmt"
      hide-actions
      class="elevation-1" >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.type }}</td>
        <td class="text-xs-left">{{ props.item.date | toDate }}</td>
        <td class="text-xs-left">{{ props.item.account }}</td>
        <td class="text-xs-right">{{ props.item.amount | toAmount }}</td>
      </template>
    </v-data-table>
    <v-pagination v-model="pagPmt.page" :length="pmtPages" v-if="dataPmt.length>0" circle>
    </v-pagination>
    <v-layout v-if="txnParty.id" row wrap>
      <v-flex>
        <v-text-field type="date" label="From" v-model="dtFrom" hide-details/>
      </v-flex>
      <v-flex>
        <v-text-field type="date" label="To" v-model="dtTo" hide-details/>
      </v-flex>
      <v-flex>
        <v-btn @click.native="saveData" color="primary" small top>Save As XL Sheet</v-btn>
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
        id: null,
        description: null,
        address: null,
        gstn: null,
        balance: null,
        chq_amt: null
      },
      ldgParty: false,
      headSumry: [
        { text: 'Location', value: 'locn', sortable: false, align: 'left' },
        { text: 'Type', value: 'type', sortable: false, align: 'left' },
        { text: 'Inv. Date', value: 'date', sortable: false, align: 'left' },
        { text: 'Amount', value: 'amount', sortable: false, align: 'right' }
      ],
      headItm: [
        { text: 'Description', value: 'description', sortable: false, align: 'left' },
        { text: 'Qty', value: 'quantity', sortable: false, align: 'right' },
        { text: 'Rate', value: 'rate', sortable: false, align: 'right' },
        { text: 'Total', value: 'total', sortable: false, align: 'right' }
      ],
      headPmt: [
        { text: 'Type', value: 'type', sortable: false, align: 'left' },
        { text: 'Date', value: 'date', sortable: false, align: 'left' },
        { text: 'Account', value: 'account', sortable: false, align: 'left' },
        { text: 'Amount', value: 'amount', sortable: false, align: 'right' }
      ],
      expand: false,
      dataSumry: [],
      dataItm: [],
      dataPmt: [],
      pagSumry: { page: 1, rowsPerPage: 10 },
      pagPmt: { page: 1, rowsPerPage: 5 },
      searchParty: null,
      dtFrom: '',
      dtTo: '',
      timerId: null
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
        this.getPartySumry(this.partyID)
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
      this.getPartySumry(this.txnParty.id)
    },
    searchParty (val) {
      if (!val) { return }
      clearTimeout(this.timerId)

      this.timerId = setTimeout(() => {
        this.ldgParty = true

        this.$http.get('/api/parties/' + val).then((res) => {
          this.arrParty = res.data
        }).finally(() => (this.ldgParty = false))
      }, 500)
    }
  },
  methods: {
    initBlank () {
      this.txnParty = {}
      this.$set(this.txnParty, 'id', null)
      this.$set(this.txnParty, 'description', null)
      this.$set(this.txnParty, 'address', null)
      this.$set(this.txnParty, 'gstn', null)
      this.$set(this.txnParty, 'balance', null)
      this.$set(this.txnParty, 'chq_amt', null)
      this.dataSumry.splice(0, this.dataSumry.length)
      this.dataPmt.splice(0, this.dataPmt.length)
    },
    getParty (id) {
      this.$http.get(`/api/party/${id}`, {httpProgress: true}).then((res) => {
        this.txnParty = res.data
        this.arrParty.splice(0, this.arrParty.length)
        this.arrParty.push(this.txnParty)
      })
    },
    getPartySumry (id) {
      if (id < 1) { return }
      this.$http.get(`/api/party/${id}/summary`, {httpProgress: true}).then((res) => {
        this.dataSumry = res.data
      })
      this.$http.get(`/api/party/${id}/payments`, {httpProgress: true}).then((res) => {
        this.dataPmt = res.data
      })
    },
    getItmTrans (type, date, lcn) {
      if (!lcn) { return }
      this.$http.get(`/api/party/${this.txnParty.id}/items?type=${type}&date=${date}&locn=${lcn}`, {httpProgress: true}).then((res) => {
        this.dataItm = res.data
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
            Description: sl.description,
            Quantity: Number(sl.quantity),
            Rate: Number(sl.rate),
            Amount: Number(sl.quantity * sl.rate)
          })
        }
        for (let pr of res.data.purchase) {
          jsnPurchase.push({
            Date: new Date(pr.date * 1000).toLocaleDateString(),
            Description: pr.description,
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
  },
  computed: {
    sumryPages () {
      return this.pagSumry.rowsPerPage ? Math.ceil(this.dataSumry.length / this.pagSumry.rowsPerPage) : 0
    },
    pmtPages () {
      return this.pagPmt.rowsPerPage ? Math.ceil(this.dataPmt.length / this.pagPmt.rowsPerPage) : 0
    }
  }
}
</script>
