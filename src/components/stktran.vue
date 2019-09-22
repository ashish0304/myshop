<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-layout fluid>
      <v-flex>
        <v-select
              :items="arrType"
              v-model="txnType"
              label="Type"
              hide-details>
        </v-select>
      </v-flex>
      <v-flex>
        <v-select
              :items="arrLocation"
              v-model="txnLocation"
              label="Location"
              item-text="description"
              item-value="id"
              return-object
              hide-details>
        </v-select>
      </v-flex>
      <v-flex v-show="txnType=='S' || txnType=='P'">
        <v-autocomplete
              :items="arrParty"
              v-model="txnParty"
              label="Party"
              item-text="description"
              item-value="id"
              placeholder="CASH"
              :search-input.sync="searchParty"
              :loading="ldgParty"
              clearable
              return-object
              hide-no-data
              hide-details>
        </v-autocomplete>
      </v-flex>
    </v-layout>
    <v-layout fluid>
      <v-flex v-show="txnType=='T' || (txnLocation.dummy && (txnType=='S' || txnType=='P'))">
        <v-select
              :items="arrTgtLocation"
              v-model="txnTgtLocation"
              label="Source Location"
              item-text="description"
              item-value="id"
              placeholder="Location"
              return-object
              hide-details>
        </v-select>
      </v-flex>
      <v-flex v-show="txnType=='S' || txnType=='P'">
        <v-text-field
              type="number"
              v-model.number="txnExpense"
              label="Expenses"
              hide-details>
        </v-text-field>
      </v-flex>
      <v-flex v-show="(txnType=='S' || txnType=='P') && txnParty && txnParty.id>0">
        <v-text-field
              type="number"
              v-model.number="txnPrtExp"
              label="Exp. By Party"
              hide-details>
        </v-text-field>
      </v-flex>
    </v-layout row wrap>
    <v-layout row wrap>
      <v-flex xs4 v-show="txnLocation.dummy">
        <v-checkbox label="Update cost" v-model="flgCost" hide-details/>
      </v-flex>
      <v-flex xs4 v-show="txnLocation.dummy">
        <v-checkbox label="Merge trans" v-model="flgMerge" hide-details/>
      </v-flex>
      <v-flex xs4 v-show="txnLocation.dummy">
        <v-checkbox label="Update total" v-model="flgTotal" hide-details/>
      </v-flex>
    </v-layout>
    <v-layout fluid>
      <v-flex>
        <v-autocomplete
              :items="arrItem"
              v-model="txnItem"
              label="Description"
              item-text="description"
              item-value="id"
              placeholder="Description"
              :search-input.sync="searchItem"
              :loading="ldgItem"
              clearable
              return-object
              hide-no-data
              hide-details>
        </v-autocomplete>
      </v-flex>
      <v-flex>
        <v-text-field
              type="number"
              v-model="txnQuantity"
              label="Quantity"
              :placeholder="itemQOH"
              @blur="txnQuantity=txnQuantity?Math.floor(txnQuantity):''"
              hide-details>
        </v-text-field>
      </v-flex>
      <v-flex v-show="txnType=='S' || txnType=='P'">
        <v-text-field
              type="number"
              v-model.number="txnRate"
              label="Rate"
              :placeholder="txnItem?txnItem.cost.toFixed(2):''"
              hide-details>
        </v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs6>
        <v-btn :disabled="!((((txnType=='S' || txnType=='P') && txnRate > 0) || (txnType=='T' || txnType=='A')) && (txnItem && txnQuantity != 0))" v-on:click.native="addItem" color="primary" small block>Add Item</v-btn>
      </v-flex>
      <v-flex xs6>
        <v-btn :disabled="!stock.length" v-on:click.native="submitTrans" color="primary" small block>Submit Stocks</v-btn>
      </v-flex>
    </v-layout>
    <v-data-table
      :headers="head"
      :items="stock"
      :pagination.sync="pagination"
      hide-actions
      class="elevation-1" >
      <template slot="headers" slot-scope="props">
        <th v-for="header in props.headers"
         :key="header.text"
         :class="[ 'column sortable', header.value , header.align === 'left' ? 'text-xs-left' : '']">
        {{header.text}}
        </th>
      </template>
      <template slot="items" slot-scope="props">
        <td><v-btn class="pa-0 ma-0" @click.native="stock.splice(props.index, 1)" small icon><v-icon>delete</v-icon></v-btn></td>
        <td><router-link :to="'/item/'+props.item.id">{{ props.item.desc }}<div v-if="props.item.gst>0">({{props.item.gst}}%)</div></router-link></td>
        <td class="text-xs-right">
          <v-edit-dialog>{{ props.item.qty }}
            <v-text-field slot="input" label="Quantity" :value="props.item.qty"
              @blur="updateQtyRate(props.index, $event.target.value, props.item.rate)"
              single-line>
            </v-text-field>
          </v-edit-dialog>
        </td>
        <td class="text-xs-right">
          <v-edit-dialog>{{ props.item.rate | toAmount }}
            <v-text-field slot="input" label="Rate" :value="props.item.rate"
              @blur="updateQtyRate(props.index, props.item.qty, $event.target.value)"
              single-line>
            </v-text-field>
          </v-edit-dialog>
        </td>
        <td class="text-xs-right">{{ props.item.val | toAmount }}</td>
      </template>
      <template slot="footer">
        <th colspan="3" class="text-xs-left">
        Tax: {{ tax | toAmount }} Value: {{ val | toAmount }}
        </th>
        <th class="text-xs-right">Total</th>
        <th class="text-xs-right">{{ tax + val | toAmount }}</th>
      </template>
    </v-data-table>
    <v-pagination circle v-model="pagination.page" :length="pages">
    </v-pagination>
    <v-snackbar v-model="tranInfo" bottom>
      {{ infoText }}
    </v-snackbar>
  </v-container>
</template>

<script>
  export default {
    name: 'stktran',
    props: {
      tranDate: String
    },
    data () {
      return {
        pagination: { rowsPerPage: 10 },
        txnType: 'S',
        arrType: [
          {text: 'Sale', value: 'S'},
          {text: 'Purchase', value: 'P'},
          {text: 'Transfer', value: 'T'},
          {text: 'Adjustment', value: 'A'}
        ],
        txnLocation: null,
        arrLocation: [],
        txnTgtLocation: null,
        arrTgtLocation: [],
        txnParty: null,
        arrParty: [],
        ldgParyty: false,
        searchParty: null,
        txnItem: null,
        arrItem: [],
        ldgItem: false,
        searchItem: null,
        itemQOH: null,
        txnQuantity: null,
        txnRate: null,
        txnExpense: 0,
        txnPrtExp: 0,
        flgCost: false,
        flgMerge: false,
        flgTotal: false,
        head: [
          { text: ' ', sortable: false },
          { text: 'Description', value: 'desc', sortable: false, align: 'left' },
          { text: 'Qty', value: 'qty', sortable: false },
          { text: 'Rate', value: 'rate', sortable: false },
          { text: 'Value', value: 'val', sortable: false }
        ],
        stock: [],
        tranStock: null,
        tranInfo: false,
        infoText: '',
        timerId: null
      }
    },
    beforeCreate () {
      this.getLocation()
    },
    activated () {
      if (!this.txnLocation) {
        this.getLocation()
      }
    },
    watch: {
      searchParty (val) {
        if (!val) { return }
        clearTimeout(this.timerId)

        this.timerId = setTimeout(() => {
          this.ldgParty = true

          this.$http.get(`/api/partyacc/${val}`).then((res) => {
            this.arrParty = res.data
          }).finally(() => (this.ldgParty = false))
        }, 500)
      },
      searchItem (val) {
        if (!val) { return }
        clearTimeout(this.timerId)

        this.timerId = setTimeout(() => {
          this.ldgItem = true

          this.$http.get(`/api/items?desc=${val}`).then((res) => {
            this.arrItem = res.data
          }).finally(() => (this.ldgItem = false))
        }, 500)
      },
      txnParty: function () {
        if (!this.txnParty) {
          this.arrParty.splice(0, this.arrParty.length)
        } else {
          this.tranInfo = true
          this.infoText = `${this.txnParty.description}, Balance: ${this.txnParty.balance.toFixed(2)}`
        }
      },
      txnItem: function () {
        if (!this.txnItem) {
          this.itemQOH = null
          this.arrItem.splice(0, this.arrItem.length)
          return
        }
        this.$http.get(`/api/stock/${this.txnLocation.id}/${this.txnItem.id}`).then((res) => {
          this.itemQOH = res.data[0].quantity
        }).catch(error => { error = null; this.itemQOH = null })
      },
      txnType: function () {
        this.fillTgtLocation()
      },
      txnLocation: function () {
        this.fillTgtLocation()
      }
    },
    methods: {
      updateQtyRate (i, q, r) {
        let qt = Math.floor(q)
        let rt = Number(r)
        i = ((this.pagination.page - 1) * this.pagination.rowsPerPage) + i
        if (qt === 0 || !qt || rt <= 0 || !rt) { return }
        this.stock[i].cost = qt * (this.stock[i].cost / this.stock[i].qty)
        this.stock[i].qty = qt
        this.stock[i].rate = rt
        this.stock[i].val = qt * rt
        if (this.stock[i].gst > 0) {
          this.stock[i].val /= this.stock[i].gst + 100
          this.stock[i].val *= 100
          this.stock[i].tax = (qt * rt) - this.stock[i].val
        }
      },
      getLocation () {
        this.$http.get('/api/location', {httpProgress: true}).then((res) => {
          this.arrLocation = res.data
          this.txnLocation = this.arrLocation[0]
        })
      },
      fillTgtLocation () {
        this.arrTgtLocation = this.arrLocation.slice(0)
        let ind = this.arrTgtLocation.findIndex(x => x.id === this.txnLocation.id)
        this.arrTgtLocation.splice(ind, 1)
      },
      addItem () {
        let tx = 0
        let qt = this.txnQuantity
        let rt = this.txnRate
        let tr = this.txnItem.tax
        let vl = qt * rt
        if (this.txnItem.tax > 0) {
          vl /= tr + 100
          vl *= 100
          tx = (qt * rt) - vl
        }
        this.stock.push({
          value: false,
          id: this.txnItem.id,
          desc: this.txnItem.description,
          gst: tr,
          qty: qt,
          rate: rt,
          tax: tx,
          val: vl,
          cost: qt * this.txnItem.cost
        })
        this.txnItem = null
        this.txnQuantity = null
        this.txnRate = null
      },
      submitTrans () {
        var inv
        if (this.txnLocation.dummy) {
          inv = prompt('Please enter invoice number').trim()
          if (inv === null || inv === '') { return }
        } else {
          if (!confirm('Are you sure?')) { return }
        }
        let stTran = []
        for (let st of this.stock) {
          stTran.push({
            itm_id: st.id,
            quantity: Number(st.qty),
            rate: Number(st.rate),
            tax: st.tax,
            value: st.val,
            cost: st.cost
          })
        }
        this.tranStock = {
          type: this.txnType,
          date: Date.parse(this.tranDate + ' ' + new Date().toLocaleTimeString()) / 1000,
          invoice: inv,
          lcn_id: this.txnLocation.id,
          prt_id: this.txnParty ? this.txnParty.id : 0,
          tgt_lcn_id: this.txnTgtLocation ? this.txnTgtLocation.id : 0,
          expense: this.txnExpense,
          prt_exp: this.txnPrtExp,
          total: this.tax + this.val,
          flg_cost: this.flgCost,
          flg_merge: this.flgMerge,
          flg_total: this.flgTotal,
          stocks: JSON.parse(JSON.stringify(stTran))
        }
        this.$http.post('/api/stktran', this.tranStock, {httpProgress: true}).then((res) => {
          this.txnTgtLocation = null
          this.txnParty = null
          this.txnExpense = 0
          this.txnPrtExp = 0
          this.flgCost = false
          this.flgMerge = false
          this.flgTotal = false
          this.stock.splice(0, this.stock.length)
          this.tranStock.stocks = null
          this.tranStock = null
        })
      }
    },
    computed: {
      pages () {
        return this.pagination.rowsPerPage ? Math.ceil(this.stock.length / this.pagination.rowsPerPage) : 0
      },
      tax: function () {
        return this.stock.reduce(function (a, b) {
          return a + b.tax
        }, 0)
      },
      val: function () {
        return this.stock.reduce(function (a, b) {
          return a + b.val
        }, 0)
      }
    }
  }
</script>
