<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "App",
  data() {
    return {
      submitting: false,
    };
  },
});
</script>
<template>
  <!-- TODO provide a responsive container for all views so the form renders on mobile and desktop appropriately -->
  <div id="app" class="px-3">
    <router-view :key="$route.path" />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
