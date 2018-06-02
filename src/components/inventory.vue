<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-layout fluid>
      <v-flex>
        <v-btn @click.native="clearStk" small primary block>Clear Stock</v-btn>
      </v-flex>
      <v-flex>
        <v-btn @click.native="exportInv"small primary block>Export Inventory</v-btn>
      </v-flex>
      <v-flex>
        <v-btn @click.native="clearInv" small primary block>Clear Inventory</v-btn>
      </v-flex>
    </v-layout fluid>
    <v-layout fluid>
      <v-flex>
        <v-select
          :items="arrInv"
          v-model="txnInv"
          label="Inventory"
          placeholder="Inventory"
          combobox
          clearable
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
    </v-layout>
    <v-data-table
      :headers="header"
      :items="data"
      hide-actions
      class="elevation-1" >
      <template slot="items" slot-scope="props">
        <td>
          <v-btn class="pa-0 ma-0" @click.native="deleteInv(props.index)" small icon>
            <v-icon>delete</v-icon>
          </v-btn>
        </td>
        <td class="text-xs-left">{{ props.item.description }}</td>
        <td class="text-xs-right">{{ props.item.quantity }}</td>
      </template>
    </v-data-table>
    <v-layout fluid>
      <v-flex xs6>
        <v-select
              :items="arrItem"
              v-model="txnItem"
              label="Item"
              item-text="description"
              item-value="id"
              placeholder="Item"
              :search-input.sync="searchItem"
              autocomplete
              clearable
              return-object
              hide-details>
        </v-select>
      </v-flex>
      <v-flex xs3>
        <v-text-field
              type="number"
              v-model.number="txnQuantity"
              label="Quantity"
              :placeholder="itemQOH"
              @blur="txnQuantity=isNaN(txnQuantity)?0:Math.floor(txnQuantity)"
              hide-details>
        </v-text-field>
      </v-flex>
      <v-flex xs3>
        <v-btn :disabled="!txnInv || txnInv.length<8 || !txnLocation || !txnItem || txnQuantity==0" @click.native="addItem" color="primary" small top>Add</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
// import axios from 'axios'
export default {
  name: 'inventory',
  data () {
    return {
      arrInv: [],
      txnInv: null,
      arrLocation: [],
      txnLocation: null,
      arrItem: [],
      txnItem: null,
      txnQuantity: 0,
      header: [
        { text: '', value: '', sortable: false },
        { text: 'Item', value: 'description', sortable: false, align: 'left' },
        { text: 'Quantity', value: 'quantity', sortable: false, align: 'right' }
      ],
      data: [],
      searchItem: null
    }
  },
  created () {
    this.getLocation()
    this.getInvs()
  },
  watch: {
    txnInv () {
      // alert(this.txnInv)
      this.$http.get(`/api/inventory?inv_id=${this.txnInv}&lcn_id=${this.txnLocation.id}`).then((res) => {
        // alert(JSON.stringify(res.data))
        this.data = res.data
      })
    },
    txnLocation () {
      this.$http.get(`/api/inventory?inv_id=${this.txnInv}&lcn_id=${this.txnLocation.id}`).then((res) => {
        this.data = res.data
      })
    },
    searchItem (val) {
      if (val.length < 3) { return }
      this.$http.get(`/api/items?desc=${val}`).then((res) => {
        this.arrItem = res.data
      })
    }
  },
  methods: {
    getLocation () {
      this.$http.get('/api/location').then((res) => {
        this.arrLocation = res.data
        this.txnLocation = this.arrLocation[0]
      })
    },
    getInvs () {
      this.$http.get('/api/inventory').then((res) => {
        this.arrInv = res.data.map(a => a.id)
        this.txnInv = this.arrInv[0]
      })
    },
    addItem () {
      let dt = {id: this.txnInv,
        lcn_id: this.txnLocation.id,
        itm_id: this.txnItem.id,
        description: this.txnItem.description,
        quantity: this.txnQuantity}
      this.$http.post('/api/inventory', dt).then((res) => {
        if (res.data.length) {
          this.data = res.data
        } else {
          this.data.push(dt)
        }
        this.txnItem = null
        this.arrItem = []
        this.txnQuantity = 0
      })
      // alert(JSON.stringify(this.data))
    },
    deleteInv (i) {
      this.$http.put('/api/inventory', this.data[i]).then((res) => {
        this.data.splice(i, 1)
      })
    },
    clearStk () {
      if (!confirm('Are you sure, you want')) { return }
      this.$http.put(`/api/clrstk?lcn_id=${this.txnLocation.id}`).then((res) => {
        alert('Successfully deleted stock from selected location')
      })
    },
    exportInv () {
      this.$http.put(`/api/expinv?inv_id=${this.txnInv}&lcn_id=${this.txnLocation.id}`).then((res) => {
        alert('Selected inventory exported Successfully to stock')
      })
    },
    clearInv () {
      this.$http.put(`/api/clrinv?inv_id=${this.txnInv}&lcn_id=${this.txnLocation.id}`).then((res) => {
        this.data.splice(0, this.data.length)
      })
    }
  }
}
</script>


