<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "FormComponent",
});
</script>

<template>
  <!-- TODO Use bootstrap classes to ensure the form reders appropriately on mobile, and each element has appropriate vertical spacing -->
  <div class="form-group">
    <slot name="title"></slot>
    <slot name="subtitle"></slot>
    <slot name="question"></slot>

    <slot name="submit"></slot>
  </div>
</template>
