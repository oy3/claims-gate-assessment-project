<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "SubmitComponent",
});
</script>

<template>
  <b-button id="submitBtn" variant="primary" @click="$emit('validate')"
    >Submit</b-button
  >
</template>
