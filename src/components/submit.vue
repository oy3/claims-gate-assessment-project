<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "SubmitComponent",
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    startLoading() {
      this.loading = true;
    },
    stopLoading() {
      this.loading = false;
    },
  },
});
</script>

<template>
  <b-button
    :disabled="loading"
    id="submitBtn"
    variant="primary"
    @click="$emit('validate')"
  >
    <span v-if="loading">
      <b-spinner small type="border" class="mr-2"></b-spinner>
      Submitting...
    </span>
    <span v-else>Submit</span></b-button
  >
</template>
