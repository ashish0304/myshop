<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-layout row wrap>
      <v-flex xs8>
        <v-autocomplete
          :items="arrItem"
          v-model="txnItem"
          item-text="description"
          item-value="id"
          label="Description"
          placeholder="Description"
          :search-input.sync="searchItem"
          :loading="ldgItem"
          hide-no-data
          return-object
          clearable
          hide-details>
        </v-autocomplete>
      </v-flex>
      <v-flex xs4>
        <v-text-field
          v-model="txnItem.hsn"
          label="HSN Code"
          placeholder="HSN Code"
          hide-details>
        </v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs8>
        <v-text-field
          v-model="txnItem.description"
          label="Description"
          placeholder="Description"
          hide-details>
        </v-text-field>
      </v-flex>
      <v-flex xs4>
        <v-text-field
          type="number"
          v-model.number="txnItem.tax"
          label="GST %"
          placeholder="GST %(>0)"
          @blur="txnItem.tax=Number(txnItem.tax)"
          hide-details>
        </v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs6>
        <v-text-field
          type="number"
          v-model.number="txnItem.cost"
          placeholder="Cost"
          label="Cost"
          @blur="txnItem.cost=Number(txnItem.cost)"
          hide-details>
        </v-text-field>
      </v-flex>
      <v-flex xs6>
        <v-text-field
          type="number"
          v-model.number="txnItem.price"
          label="Price"
          placeholder="Price"
          @blur="txnItem.price=Number(txnItem.price)"
          hide-details>
        </v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12>
        <v-btn
          v-on:click.native="addEditItem"
          :disabled="txnItem.description.length<5"
          primary small block>
          {{ txnItem.id?"Save":"Add" }}
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
  </v-container>
</template>

<script>
export default {
  name: 'item',
  props: {
    itemID: Number
  },
  data () {
    return {
      arrItem: [],
      txnItem: {
        id: 0,
        description: '',
        hsn: '',
        tax: 0,
        cost: 0,
        price: 0
      },
      head: [
        { text: 'Type', value: 'type', sortable: false, align: 'left' },
        { text: 'Date', value: 'date', sortable: false, align: 'left' },
        { text: 'Qty', value: 'quantity', sortable: false, align: 'right' },
        { text: 'Rate', value: 'rate', sortable: false, align: 'right' },
        { text: 'Total', value: 'total', sortable: false, align: 'right' }
      ],
      ldgItem: false,
      data: [],
      itmOffset: 0,
      searchItem: null
    }
  },
  created: function () {
    if (this.itemID > 0) {
      this.getItem(this.itemID)
    } else {
      this.initBlank()
    }
  },
  watch: {
    '$route.params.itemID': function () {
      if (this.itemID) {
        this.getItem(this.itemID)
        this.getTrans(this.itemID)
      } else {
        this.initBlank()
      }
    },
    txnItem () {
      if (!this.txnItem) {
        this.initBlank()
        return
      }
      this.getTrans(this.txnItem.id)
    },
    searchItem (val) {
      if (this.arrItem.length > 0) { return }
      this.ldgItem = true

      this.$http.get(`/api/items?desc=${val}`).then((res) => {
        this.arrItem = res.data
      }).finally(() => (this.ldgItem = false))
    }
  },
  methods: {
    initBlank () {
      this.txnItem = {}
      this.$set(this.txnItem, 'id', 0)
      this.$set(this.txnItem, 'description', '')
      this.$set(this.txnItem, 'hsn', '')
      this.$set(this.txnItem, 'tax', 0)
      this.$set(this.txnItem, 'cost', 0)
      this.$set(this.txnItem, 'price', 0)
      this.data.splice(0, this.data.length)
      this.itmOffset = 0
    },
    getItem (id) {
      this.$http.get(`/api/item/${id}`).then((res) => {
        this.txnItem = res.data
        this.arrItem.splice(0, this.arrItem.length)
        this.arrItem.push(this.txnItem)
      })
    },
    getTrans (id) {
      if (id < 1) { return }
      this.$http.get(`/api/item/${id}/trans?offset=${this.itmOffset}&limit=10`).then((restran) => {
        if (restran.data.length > 0) {
          this.data = restran.data
        } else if (this.data.length > 0) {
          this.itmOffset -= 10
          alert('No more transaction!')
        } else {
          alert('No transaction!')
        }
      })
    },
    firstItem () {
      if (this.itmOffset === 0) { return }
      this.itmOffset = 0
      this.getTrans(this.txnItem.id)
    },
    prevItem () {
      if (this.itmOffset < 10) { return }
      this.itmOffset -= 10
      this.getTrans(this.txnItem.id)
    },
    nextItem () {
      this.itmOffset += 10
      this.getTrans(this.txnItem.id)
    },
    addEditItem () {
      if (this.txnItem.id > 0) {
        // update item
        this.$http.put('/api/item', this.txnItem).then((res) => {
          alert('Updated successfully!')
        })
      } else {
        // insert item
        this.$http.post('/api/item', this.txnItem).then((res) => {
          alert('Added successfully!')
        })
      }
    }
  }
}
</script>
