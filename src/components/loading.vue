<template>
  <v-layout row justify-center>
    <v-dialog v-model="value" persistent content content-class="centered-dialog">
      <v-container fill-height>
        <v-layout column justify-center align-center>
          <v-progress-circular indeterminate :size="50" :width="5" :color="progressColor">
          </v-progress-circular>
        </v-layout>
      </v-container>
    </v-dialog>
  </v-layout>
</template>
<script>
  export default {
    name: 'loading',
    data: function () {
      return {}
    },
    props: {
      value: {type: Boolean, default: false},
      progressColor: {type: String, default: 'purple'}
    }
  }
</script>
<style>
  .dialog.centered-dialog,
  .v-dialog.centered-dialog {
    background: #282c2dad;
    box-shadow: none;
    border-radius: 6px;
    width: auto;
    color: whitesmoke;
  }
</style>
