<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-layout row wrap>
      <v-flex xs4>
        <v-text-field type="date" label="From" v-model="dtFrom" hide-details/>
      </v-flex>
      <v-flex xs4>
        <v-text-field type="date" label="To" v-model="dtTo" hide-details/>
      </v-flex>
      <v-flex xs4>
        <v-select
              :items="arrLocation"
              v-model="repLocation"
              label="Location"
              item-text="description"
              item-value="id"
              hide-details>
        </v-select>
      </v-flex>
    </v-layout>

    <div v-if="dataCsSale.length>0">
    <h4 class="cyan">Cash Sales</h4>
    <v-data-table
      :headers="headItm"
      :items="dataCsSale"
      :pagination.sync="pgnCsSale"
      hide-actions
      class="elevation-1" >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.date | toDate }}</td>
        <td class="text-xs-left"><router-link :to="'/item/'+props.item.itm_id">{{ props.item.description }}</router-link></td>
        <td class="text-xs-right">{{ props.item.quantity }}</td>
        <td class="text-xs-right">{{ props.item.rate | toAmount }}</td>
        <td class="text-xs-right">{{ props.item.quantity * props.item.rate | toAmount }}</td>
      </template>
      <template slot="footer">
        <td colspan="4" class="text-xs-right">Total(Cost: {{ totalCost(dataCsSale) | toAmount }})</td>
        <td class="text-xs-right">{{ totalItem(dataCsSale) | toAmount }}</td>
      </template>
    </v-data-table>
    <v-pagination v-model="pgnCsSale.page" :length="pages(pgnCsSale, dataCsSale)" circle>
    </v-pagination>
    </div>

    <div v-if="dataCrSale.length>0">
    <h4 class="cyan">Credit Sales</h4>
    <v-data-table
      :headers="headItm"
      :items="dataCrSale"
      :pagination.sync="pgnCrSale"
      hide-actions
      class="elevation-1" >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.date | toDate }}</td>
        <td class="text-xs-left"><router-link :to="'/item/'+props.item.itm_id">{{ props.item.description }}</router-link></td>
        <td class="text-xs-right">{{ props.item.quantity }}</td>
        <td class="text-xs-right">{{ props.item.rate | toAmount }}</td>
        <td class="text-xs-right">{{ props.item.quantity * props.item.rate | toAmount }}</td>
      </template>
      <template slot="footer">
        <td colspan="4" class="text-xs-right">Total(Cost: {{ totalCost(dataCrSale) | toAmount }})</td>
        <td class="text-xs-right">{{ totalItem(dataCrSale) | toAmount }}</td>
      </template>
    </v-data-table>
    <v-pagination v-model="pgnCrSale.page" :length="pages(pgnCrSale, dataCrSale)" circle>
    </v-pagination>
    </div>

    <div v-if="dataCsPurc.length>0">
    <h4 class="cyan">Cash Purchases</h4>
    <v-data-table
      :headers="headItm"
      :items="dataCsPurc"
      :pagination.sync="pgnCsPurc"
      hide-actions
      class="elevation-1" >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.date | toDate }}</td>
        <td class="text-xs-left"><router-link :to="'/item/'+props.item.itm_id">{{ props.item.description }}</router-link></td>
        <td class="text-xs-right">{{ props.item.quantity }}</td>
        <td class="text-xs-right">{{ props.item.rate | toAmount }}</td>
        <td class="text-xs-right">{{ props.item.quantity * props.item.rate | toAmount }}</td>
      </template>
      <template slot="footer">
        <td colspan="4" class="text-xs-right">Total</td>
        <td class="text-xs-right">{{ totalItem(dataCsPurc) | toAmount }}</td>
      </template>
    </v-data-table>
    <v-pagination v-model="pgnCsPurc.page" :length="pages(pgnCsPurc, dataCsPurc)" circle>
    </v-pagination>
    </div>

    <div v-if="dataCrPurc.length>0">
    <h4 class="cyan">Credit Purchases</h4>
    <v-data-table
      :headers="headItm"
      :items="dataCrPurc"
      :pagination.sync="pgnCrPurc"
      hide-actions
      class="elevation-1" >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.date | toDate }}</td>
        <td class="text-xs-left"><router-link :to="'/item/'+props.item.itm_id">{{ props.item.description }}</router-link></td>
        <td class="text-xs-right">{{ props.item.quantity }}</td>
        <td class="text-xs-right">{{ props.item.rate | toAmount }}</td>
        <td class="text-xs-right">{{ props.item.quantity * props.item.rate | toAmount }}</td>
      </template>
      <template slot="footer">
        <td colspan="4" class="text-xs-right">Total</td>
        <td class="text-xs-right">{{ totalItem(dataCrPurc) | toAmount }}</td>
      </template>
    </v-data-table>
    <v-pagination v-model="pgnCrPurc.page" :length="pages(pgnCrPurc, dataCrPurc)" circle>
    </v-pagination>
    </div>

    <div v-if="dataTsfr.length>0">
    <h4 class="cyan">Stocks Transfers</h4>
    <v-data-table
      :headers="headItm"
      :items="dataTsfr"
      :pagination.sync="pgnTsfr"
      hide-actions
      class="elevation-1" >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.date | toDate }}</td>
        <td class="text-xs-left"><router-link :to="'/item/'+props.item.itm_id">{{ props.item.description }}</router-link></td>
        <td class="text-xs-right">{{ props.item.quantity }}</td>
        <td class="text-xs-right">{{ props.item.rate | toAmount }}</td>
        <td class="text-xs-right">{{ props.item.quantity * props.item.rate | toAmount }}</td>
      </template>
    </v-data-table>
    <v-pagination v-model="pgnTsfr.page" :length="pages(pgnTsfr, dataTsfr)" circle>
    </v-pagination>
    </div>

    <div v-if="dataAdjt.length>0">
    <h4 class="cyan">Stock Adjustments</h4>
    <v-data-table
      :headers="headItm"
      :items="dataAdjt"
      :pagination.sync="pgnAdjt"
      hide-actions
      class="elevation-1" >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.date | toDate }}</td>
        <td class="text-xs-left"><router-link :to="'/item/'+props.item.itm_id">{{ props.item.description }}</router-link></td>
        <td class="text-xs-right">{{ props.item.quantity }}</td>
        <td class="text-xs-right">{{ props.item.rate | toAmount }}</td>
        <td class="text-xs-right">{{ props.item.quantity * props.item.rate | toAmount }}</td>
      </template>
    </v-data-table>
    <v-pagination v-model="pgnAdjt.page" :length="pages(pgnAdjt, dataAdjt)" circle>
    </v-pagination>
    </div>

    <div v-if="dataAmPaid.length>0">
    <h4 class="cyan">Amount Paid</h4>
    <v-data-table
      :headers="headPmt"
      :items="dataAmPaid"
      :pagination.sync="pgnAmPaid"
      hide-actions
      class="elevation-1" >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.date | toDate }}</td>
        <td class="text-xs-left">{{ props.item.type }}
          <router-link :to="'/account/'+props.item.acc_id">{{ props.item.account }}</router-link>
          <router-link :to="'/party/'+props.item.prt_id">{{ props.item.party }}</router-link>
          {{ props.item.comment }}
        </td>
        <td class="text-xs-right">{{ props.item.amount | toAmount }}</td>
      </template>
      <template slot="footer">
        <td colspan="2" class="text-xs-right">Total</td>
        <td class="text-xs-right">{{ totalPmt(dataAmPaid) | toAmount }}</td>
      </template>
    </v-data-table>
    <v-pagination v-model="pgnAmPaid.page" :length="pages(pgnAmPaid, dataAmPaid)" circle>
    </v-pagination>
    </div>

    <div v-if="dataAmRecd.length>0">
    <h4 class="cyan">Amount Received</h4>
    <v-data-table
      :headers="headPmt"
      :items="dataAmRecd"
      :pagination.sync="pgnAmRecd"
      hide-actions
      class="elevation-1" >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.date | toDate }}</td>
        <td class="text-xs-left">{{ props.item.type }}
          <router-link :to="'/account/'+props.item.acc_id">{{ props.item.account }}</router-link>
          <router-link :to="'/party/'+props.item.prt_id">{{ props.item.party }}</router-link>
          {{ props.item.comment }}
        </td>
        <td class="text-xs-right">{{ props.item.amount | toAmount }}</td>
      </template>
      <template slot="footer">
        <td colspan="2" class="text-xs-right">Total</td>
        <td class="text-xs-right">{{ totalPmt(dataAmRecd) | toAmount }}</td>
      </template>
    </v-data-table>
    <v-pagination v-model="pgnAmRecd.page" :length="pages(pgnAmRecd, dataAmRecd)" circle>
    </v-pagination>
    </div>
    <div>
      <v-btn @click.native="exportData" color="primary" small block>Export to XLSX
      </v-btn>
    </div>
  </v-container>
</template>

<script>
import XLSX from 'xlsx'
export default {
  name: 'repdattran',
  props: {
    tranDate: String
  },
  data () {
    return {
      dtFrom: null,
      dtTo: null,
      arrLocation: [],
      repLocation: null,
      headItm: [
        { text: 'Date', value: 'date', sortable: false, align: 'left' },
        { text: 'Item', value: 'description', sortable: false, align: 'left' },
        { text: 'Qty', value: 'quantity', sortable: false, align: 'right' },
        { text: 'Rate', value: 'rate', sortable: false, align: 'right' },
        { text: 'Value', value: 'value', sortable: false, align: 'right' }
      ],
      headPmt: [
        { text: 'Date', value: 'date', sortable: false, align: 'left' },
        { text: 'Description', value: 'description', sortable: false, align: 'left' },
        { text: 'Amount', value: 'amount', sortable: false, align: 'right' }
      ],
      dataCsSale: [],
      dataCrSale: [],
      dataCsPurc: [],
      dataCrPurc: [],
      dataTsfr: [],
      dataAdjt: [],
      dataAmPaid: [],
      dataAmRecd: [],
      pgnCsSale: { rowsPerPage: 5, page: 1 },
      pgnCrSale: { rowsPerPage: 5, page: 1 },
      pgnCsPurc: { rowsPerPage: 5, page: 1 },
      pgnCrPurc: { rowsPerPage: 5, page: 1 },
      pgnTsfr: { rowsPerPage: 5, page: 1 },
      pgnAdjt: { rowsPerPage: 5, page: 1 },
      pgnAmPaid: { rowsPerPage: 5, page: 1 },
      pgnAmRecd: { rowsPerPage: 5, page: 1 }
    }
  },
  created () {
    this.dtFrom = String(this.tranDate)
    this.dtTo = String(this.tranDate)
    this.$http.get('/api/location', {httpProgress: true}).then((res) => {
      this.arrLocation = res.data
    })
  },
  watch: {
    repLocation () {
      this.$http.get(`/api/repdateitm?id=${this.repLocation}&dtfr=${(Date.parse(this.dtFrom) / 1000)}&dtto=${(Date.parse(this.dtTo) / 1000) + 86399}`, {httpProgress: true}).then((res) => {
        this.dataCsSale = res.data.cssale
        this.dataCrSale = res.data.crsale
        this.dataCsPurc = res.data.cspurc
        this.dataCrPurc = res.data.crpurc
        this.dataTsfr = res.data.tsfr
        this.dataAdjt = res.data.adjt
        this.dataAmPaid = res.data.ampaid
        this.dataAmRecd = res.data.amrecd
      })
    },
    dtFrom () {
      if (this.dtFrom.length < 10) {
        this.dtFrom = this.tranDate
      }
    },
    dtTo () {
      if (this.dtTo.length < 10) {
        this.dtTo = this.tranDate
      }
    }
  },
  methods: {
    exportData () {
      this.$http.get(`/api/gstrep?locn=${this.repLocation}&dtfr=${(Date.parse(this.dtFrom) / 1000)}&dtto=${(Date.parse(this.dtTo) / 1000) + 86399}`, {httpProgress: true}).then((res) => {
        let wb = XLSX.utils.book_new()
        let wsSale = {}
        let wsPurchase = {}
        let jsnSale = []
        let jsnPurchase = []
        for (let sl of res.data.sales) {
          jsnSale.push({
            Date: new Date(sl.date * 1000).toLocaleDateString(),
            'Invoice No.': sl.invoice,
            'Party Name': sl.party,
            GSTN: sl.gstn,
            HSN: sl.hsn,
            'GST Rate': sl.trate,
            Amount: sl.amount,
            Tax: sl.tax,
            Total: Number(sl.amount + sl.tax)
          })
        }
        for (let pr of res.data.purchase) {
          jsnPurchase.push({
            Date: new Date(pr.date * 1000).toLocaleDateString(),
            'Invoice No.': pr.invoice,
            'Party Name': pr.party,
            GSTN: pr.gstn,
            HSN: pr.hsn,
            'GST Rate': pr.trate,
            Amount: pr.amount,
            Tax: pr.tax,
            Total: Number(pr.amount + pr.tax)
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
        XLSX.writeFile(wb, this.dtFrom + ' to ' + this.dtTo + '.xlsx')
      })
    },
    pages (p, d) {
      return p.rowsPerPage ? Math.ceil(d.length / p.rowsPerPage) : 0
    },
    totalItem (d) {
      return d.reduce(function (a, b) {
        return a + (b.quantity * b.rate)
      }, 0)
    },
    totalCost (d) {
      return d.reduce(function (a, b) {
        return a + b.cost
      }, 0)
    },
    totalPmt (d) {
      return d.reduce(function (a, b) {
        return a + b.amount
      }, 0)
    }
  }
}
</script>
