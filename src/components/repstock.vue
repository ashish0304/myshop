<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-layout row wrap>
      <v-flex xs6>
        <v-select
              :items="arrLocation"
              v-model="repLocation"
              label="Location"
              item-text="description"
              item-value="id"
              hide-details>
        </v-select>
      </v-flex>
      <v-flex xs6>
        <v-select
              :items="arrTax"
              v-model="repTax"
              label="Tax Slab"
              hide-details>
        </v-select>
      </v-flex>
    </v-layout>
    <v-data-table
      :headers="head"
      :items="data"
      :pagination.sync="pagination"
      hide-actions
      class="elevation-1" >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left col1"><router-link :to="'/item/'+props.item.itm_id">{{ props.item.description }}</router-link></td>
        <td class="text-xs-left col2">{{ props.item.hsn }}</td>
        <td class="text-xs-right col1">{{ props.item.quantity }}</td>
        <td class="text-xs-right col2">{{ props.item.cost | toAmount }}</td>
        <td class="text-xs-right col1">{{ props.item.quantity * props.item.cost | toAmount }}</td>
      </template>
      <template slot="footer">
        <td colspan="4" class="text-xs-right">Total</td>
        <td class="text-xs-right">{{ total | toAmount }}</td>
      </template>
    </v-data-table>
    <v-pagination v-model="pagination.page" :length="pages" circle>
    </v-pagination>
    <v-layout row wrap>
      <v-flex>
        <v-btn color="primary" v-on:click.native="exportData" small block>Save As XL Sheet
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import XLSX from 'xlsx'
export default {
  name: 'repstock',
  data () {
    return {
      repLocation: 1,
      arrLocation: [],
      repTax: null,
      arrTax: [
        { text: 'All', value: null },
        { text: 'Zero', value: 0 },
        { text: '5%', value: 5 },
        { text: '12%', value: 12 },
        { text: '18%', value: 18 },
        { text: '28%', value: 28 }
      ],
      data: [],
      head: [
        { text: 'Description', value: 'description', sortable: false, align: 'left' },
        { text: 'HSN', value: 'hsn', sortable: false, align: 'left' },
        { text: 'Qty', value: 'quantity', sortable: false },
        { text: 'Cost', value: 'cost', sortable: false },
        { text: 'Value', value: 'val', sortable: false }
      ],
      pagination: { rowsPerPage: 25 }
    }
  },
  created () {
    this.getLocation()
    this.getStock()
  },
  watch: {
    repLocation: function () {
      this.getStock()
    },
    repTax: function () {
      this.getStock()
    }
  },
  methods: {
    getLocation () {
      this.$http.get('/api/location', {httpProgress: true}).then((res) => {
        this.arrLocation = res.data
      })
    },
    getStock () {
      this.$http.get(`/api/stocks/${this.repLocation}/${this.repTax}`, {httpProgress: true}).then((res) => {
        this.data = res.data
      })
    },
    exportData () {
      let wsStock = XLSX.utils.json_to_sheet(this.data)
      let wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, wsStock, 'Stock')
      XLSX.writeFile(wb, 'stock.xlsx')
    }
  },
  computed: {
    pages () {
      return this.pagination.rowsPerPage ? Math.ceil(this.data.length / this.pagination.rowsPerPage) : 0
    },
    total: function () {
      return this.data.reduce(function (a, b) {
        return a + (b.quantity * b.cost)
      }, 0)
    }
  }
}
</script>
