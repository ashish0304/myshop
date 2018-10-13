<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-layout row wrap>
      <v-flex xs6>
        <v-text-field type="month" label="Month" v-model="repMonth" hide-details/>
      </v-flex>
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
    </v-layout>
    <v-data-table
      :headers="head"
      :items="data"
      :pagination.sync="pagination"
      hide-actions
      class="elevation-1" >
      <template slot="items" slot-scope="props">
        <tr :class="[props.item.type==='Total'?'accent':'']">
        <td class="text-xs-left">{{ props.item.type }}</td>
        <td class="text-xs-right">{{ props.item.amount | toAmount }}</td>
        <td class="text-xs-right">{{ props.item.tax | toAmount }}</td>
        <td class="text-xs-right">{{ props.item.amount + props.item.tax | toAmount }}</td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  name: 'replocn',
  props: {
    tranDate: String
  },
  data () {
    return {
      tranDate: '',
      repMonth: null,
      repLocation: 1,
      arrLocation: [],
      head: [
        { text: 'Type', value: 'type', sortable: false, align: 'left' },
        { text: 'Amount', value: 'amount', sortable: false, align: 'right' },
        { text: 'Tax', value: 'tax', sortable: false, align: 'right' },
        { text: 'Total', value: 'total', sortable: false, align: 'right' }
      ],
      data: [],
      pagination: { rowsPerPage: 15 }
    }
  },
  created () {
    // alert(this.tranDate)
    this.repMonth = this.tranDate.substring(0, 7)
    this.$http.get('/api/location', {httpProgress: true}).then((res) => {
      this.arrLocation = res.data
      this.getData()
    })
  },
  watch: {
    repMonth () {
      // alert(this.tranDate)
      if (this.repMonth.length !== 7) {
        this.repMonth = this.tranDate.substring(0, 7)
      } else {
        this.getData()
      }
    },
    repLocation () {
      this.getData()
    }
  },
  methods: {
    getData () {
      this.$http.get(`/api/replcnstat?locn=${this.repLocation}&month=${this.repMonth}`, {httpProgress: true}).then((res) => {
        this.data.splice(0, this.data.length)
        if (!res.data.length) {
          return
        }
        let last = res.data[0].type.substring(0, 1)
        let totalA = 0
        let totalX = 0
        let totalT = 0
        for (let i = 0; i < res.data.length; i++) {
          if (last === res.data[i].type.substring(0, 1)) {
            totalA += res.data[i].amount
            totalX += res.data[i].tax
            totalT += res.data[i].amount + res.data[i].tax
          } else {
            last = res.data[i].type.substring(0, 1)
            this.data.push({type: 'Total', amount: totalA, tax: totalX, total: totalT})
            totalA = res.data[i].amount
            totalX = res.data[i].tax
            totalT = res.data[i].amount + res.data[i].tax
          }
          this.data.push(res.data[i])
        }
        this.data.push({type: 'Total', amount: totalA, tax: totalX, total: totalT})
      })
    }
  }
}
</script>
