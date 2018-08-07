<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-layout fluid>
      <v-flex>
        <v-text-field
          type="number"
          v-model.number="fltId"
          label="ID"
          @change="getData"
          hide-details>
        </v-text-field>
      </v-flex>
      <v-flex>
        <v-select
          :items="arrType"
          v-model="fltType"
          label="Type"
          @input="getData"
          clearable
          hide-details>
        </v-select>
      </v-flex>
      <v-flex>
        <v-select
          :items="arrLocation"
          v-model="fltLocation"
          label="Location"
          item-text="description"
          item-value="id"
          return-object
          @input="getData"
          clearable
          hide-details>
        </v-select>
      </v-flex>
    </v-layout>
    <v-data-table
      :headers="head"
      :items="data"
      :total-items="totalrows"
      :pagination.sync="pagination"
      hide-actions>
      <template slot="items" slot-scope="props">
        <td>
          <v-btn class="pa-0 ma-0" @click.native="dialog=true; edit=data[props.index]" small icon>
            <v-icon small>edit</v-icon>
          </v-btn>
        </td>
        <td>{{ props.item.id }}</td>
        <td>{{ props.item.type }}</td>
        <td>{{ props.item.date | toDate}}</td>
        <td>{{ props.item.lcn_id }}</td>
        <td>{{ props.item.prt_id }}</td>
        <td>{{ props.item.itm_id }}</td>
        <td>{{ props.item.quantity }}</td>
        <td class="text-xs-right">{{ props.item.rate | toAmount }}</td>
        <td class="text-xs-right">{{ props.item.value | toAmount }}</td>
        <td class="text-xs-right">{{ props.item.tax | toAmount }}</td>
        <td class="text-xs-right">{{ props.item.cost | toAmount }}</td>
        <td>{{ props.item.usr_id }}</td>
        <td>{{ props.item.flag }}</td>
      </template>
    </v-data-table>
    <v-pagination circle
      v-model="pagination.page"
      :length="pages"
      @input="gotoPage" >
    </v-pagination>
    <v-dialog v-model="dialog" :key="edit.rowid" max-width="500px" scrollable lazy>
      <v-card>
        <v-card-title>
          <span class="headline">Stktran</span>
        </v-card-title>
        <v-card-text style="height: 500px;">
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field
                type="number"
                v-model.number="edit.id"
                label="ID"
                hide-details>
              </v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                v-model="edit.type"
                label="Type"
                hide-details>
              </v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                type="number"
                v-model.number="edit.date"
                label="Date"
                :value="edit.date"
                hide-details>
              </v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                type="number"
                v-model.number="edit.lcn_id"
                label="Location"
                hide-details>
              </v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                type="number"
                v-model.number="edit.prt_id"
                label="Party"
                hide-details>
              </v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                type="number"
                v-model.number="edit.itm_id"
                label="Item"
                hide-details>
              </v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                type="number"
                v-model.number="edit.quantity"
                label="Quantity"
                hide-details>
              </v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                type="number"
                v-model.number="edit.rate"
                label="Rate"
                hide-details>
              </v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                type="number"
                v-model.number="edit.value"
                label="Value"
                hide-details>
              </v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                type="number"
                v-model.number="edit.tax"
                label="Tax"
                hide-details>
              </v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                type="number"
                v-model.number="edit.cost"
                label="Cost"
                hide-details>
              </v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                v-model="edit.usr_id"
                label="User ID"
                hide-details>
              </v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                v-model="edit.flag"
                label="Flag"
                hide-details>
              </v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" small @click.native="dialog = false">Close</v-btn>
          <v-btn color="primary" small @click.native="dialog = false; updateData()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  export default {
    name: 'editstran',
    data () {
      return {
        fltId: '',
        fltType: 'S',
        arrType: [
          {text: 'Sale', value: 'S'},
          {text: 'Purchase', value: 'P'},
          {text: 'Transfer', value: 'T'},
          {text: 'Adjustment', value: 'A'}
        ],
        fltLocation: null,
        arrLocation: [],
        head: [
          { text: '', value: 'rowid' },
          { text: 'id', value: 'id' },
          { text: 'type', value: 'type' },
          { text: 'date', value: 'date' },
          { text: 'lcn_id', value: 'lcn_id' },
          { text: 'prt_id', value: 'prt_id' },
          { text: 'itm_id', value: 'itm_id' },
          { text: 'quantity', value: 'quantity' },
          { text: 'rate', value: 'rate' },
          { text: 'value', value: 'value' },
          { text: 'tax', value: 'tax' },
          { text: 'cost', value: 'cost' },
          { text: 'usr_id', value: 'usr_id' },
          { text: 'flag', value: 'flag' }
        ],
        data: [],
        totalrows: 0,
        pagination: { page: 1, rowsPerPage: 15 },
        dialog: false,
        edit: {}
      }
    },
    created () {
      this.getLocation()
      this.getData()
    },
    methods: {
      getLocation () {
        this.$http.get('/api/location').then((res) => {
          this.arrLocation = res.data
          this.fltLocation = this.arrLocation[0]
        })
      },
      gotoPage () {
        let id = this.fltId ? this.fltId : ''
        let lcn = this.fltLocation ? this.fltLocation.id : ''
        let typ = this.fltType ? this.fltType : ''
        let off = (this.pagination.page - 1) * this.pagination.rowsPerPage
        let lim = this.pagination.rowsPerPage
        this.$http.get(`/api/rawstran?id=${id}&type=${typ}&lcn=${lcn}&offset=${off}&limit=${lim}`).then((res) => {
          this.data = res.data.rows
        })
      },
      getData () {
        let id = this.fltId ? this.fltId : ''
        let lcn = this.fltLocation ? this.fltLocation.id : ''
        let typ = this.fltType ? this.fltType : ''
        let lim = this.pagination.rowsPerPage
        this.$http.get(`/api/rawstran?length=true&id=${id}&type=${typ}&lcn=${lcn}&offset=0&limit=${lim}`).then((res) => {
          this.data = res.data.rows
          this.totalrows = res.data.len
          this.pagination.page = 1
        })
      },
      updateData () {
        this.$http.put('/api/rawstran', this.edit).then((res) => {
          this.dialog = false
        })
      }
    },
    computed: {
      pages () {
        return this.pagination.rowsPerPage ? Math.ceil(this.totalrows / this.pagination.rowsPerPage) : 0
      }
    }
  }
</script>
