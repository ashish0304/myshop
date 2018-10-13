<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-layout fluid>
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
          :items="arrAccount"
          v-model="fltAccount"
          label="Account"
          item-text="description"
          item-value="id"
          @input="getData"
          clearable
          return-object
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
        <td>{{ props.item.type }}</td>
        <td>{{ props.item.date | toDate }}</td>
        <td>{{ props.item.prt_id }}</td>
        <td>{{ props.item.txn_id }}</td>
        <td>{{ props.item.acc_id }}</td>
        <td class="text-xs-right">{{ props.item.amount | toAmount }}</td>
        <td>{{ props.item.comment }}</td>
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
          <span class="headline">Pmttran</span>
        </v-card-title>
        <v-card-text style="height: 500px;">
        <v-container grid-list-md>
          <v-layout wrap>
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
                v-model.number="edit.prt_id"
                label="Party"
                hide-details>
              </v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                type="number"
                v-model.number="edit.txn_id"
                label="Transaction"
                hide-details>
              </v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                type="number"
                v-model.number="edit.acc_id"
                label="Account"
                hide-details>
              </v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                type="number"
                v-model.number="edit.amount"
                label="Amount"
                hide-details>
              </v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                v-model="edit.comment"
                label="Comment"
                hide-details>
              </v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                type="number"
                v-model.number="edit.usr_id"
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
    name: 'editptran',
    data () {
      return {
        fltType: 'S',
        arrType: [
          {text: 'Sale', value: 'S'},
          {text: 'Purchase', value: 'P'},
          {text: 'Bus/Transport', value: 'B'},
          {text: 'Wages/Rent', value: 'W'},
          {text: 'Transfer/Deposit', value: 'T'},
          {text: 'Service Charges', value: 'C'},
          {text: 'Petty Expenses', value: 'D'},
          {text: 'Petty Loan Taken', value: 'H'},
          {text: 'Petty Loan Given', value: 'G'}
        ],
        fltAccount: null,
        arrAccount: [],
        head: [
          { text: '', value: 'rowid' },
          { text: 'type', value: 'type' },
          { text: 'date', value: 'date' },
          { text: 'prt_id', value: 'prt_id' },
          { text: 'txn_id', value: 'txn_id' },
          { text: 'acc_id', value: 'acc_id' },
          { text: 'amount', value: 'amount' },
          { text: 'comment', value: 'comment' },
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
      this.getAccount()
      this.getData()
    },
    methods: {
      getAccount () {
        this.$http.get('/api/account').then((res) => {
          this.$store.state.httpProgress = true
          this.arrAccount = res.data
        }).catch(err => {
          alert(err.response.data)
        }).then(() => {
          this.$store.state.httpProgress = false
        })
      },
      gotoPage () {
        let acc = this.fltAccount ? this.fltAccount.id : ''
        let typ = this.fltType ? this.fltType : ''
        let off = (this.pagination.page - 1) * this.pagination.rowsPerPage
        let lim = this.pagination.rowsPerPage
        this.$http.get(`/api/rawptran?type=${typ}&acc=${acc}&offset=${off}&limit=${lim}`).then((res) => {
          this.data = res.data.rows
        })
      },
      getData () {
        let acc = this.fltAccount ? this.fltAccount.id : ''
        let typ = this.fltType ? this.fltType : ''
        let lim = this.pagination.rowsPerPage
        this.$http.get(`/api/rawptran?length=true&type=${typ}&acc=${acc}&offset=0&limit=${lim}`).then((res) => {
          this.$store.state.httpProgress = true
          this.data = res.data.rows
          this.totalrows = res.data.len
          this.pagination.page = 1
        }).catch(err => {
          alert(err.response.data)
        }).then(() => {
          this.$store.state.httpProgress = false
        })
      },
      updateData () {
        this.$http.put('/api/rawptran', this.edit).then((res) => {
          this.dialog = false
          this.$store.state.httpProgress = true
        }).catch(err => {
          alert(err.response.data)
        }).then(() => {
          this.$store.state.httpProgress = false
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
