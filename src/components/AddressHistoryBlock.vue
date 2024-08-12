<script lang="ts">
import Vue from "vue";
import axios from "axios";

interface Address {
  addressLine1: string;
  postcode: string;
  dateMovedIn: string;
}

export default Vue.extend({
  name: "AddressHistoryBlock",
  data() {
    return {
      addresses: [
        { addressLine1: "", postcode: "", dateMovedIn: "" },
      ] as Address[],
      errorMessage: "",
    };
  },
  computed: {
    canAddMoreAddresses(): boolean {
      return this.addresses.length < 3;
    },
    totalYearsHistory(): number {
      const today = new Date();
      let totalYears = 0;
      this.addresses.forEach((address) => {
        const movedInDate = new Date(address.dateMovedIn);
        totalYears +=
          (today.getTime() - movedInDate.getTime()) /
          (1000 * 3600 * 24 * 365.25);
      });
      return totalYears;
    },
  },
  methods: {
    addAddress() {
      if (this.canAddMoreAddresses) {
        this.addresses.push({
          addressLine1: "",
          postcode: "",
          dateMovedIn: "",
        });
      }
    },
    handleDateChange() {
      if (this.totalYearsHistory >= 3) {
        this.errorMessage = "";
      } else {
        this.errorMessage =
          "Please provide at least 3 years of address history.";
      }
    },
    fetchPostcodeSuggestions(index: number) {
      const postcode = this.addresses[index].postcode;
      if (postcode.length >= 3) {
        axios
          .get("https://api.postcodes.io/postcodes/${postcode}/autocomplete")
          .then((response) => {
            console.log(response.data); // Implement a dropdown for suggestions if needed
          })
          .catch((error) => {
            console.error("Error fetching postcode suggestions:", error);
          });
      }
    },
    validateBlock(): boolean {
      this.errorMessage = "";
      if (this.totalYearsHistory < 3) {
        this.errorMessage =
          "Please provide at least 3 years of address history.";
        return false;
      }
      if (
        this.addresses.some(
          (address) =>
            !address.addressLine1 || !address.postcode || !address.dateMovedIn
        )
      ) {
        this.errorMessage = "All fields are required.";
        return false;
      }
      return true;
    },
  },
});
</script>

<template>
  <div>
    <div v-for="(address, index) in addresses" :key="index" class="mb-3">
      <div class="form-group">
        <label :for="'address-line1-' + index">Address Line 1</label>
        <input
          type="text"
          class="form-control"
          v-model="address.addressLine1"
          :id="'address-line1-' + index"
          required
        />
      </div>
      <div class="form-group">
        <label :for="'postcode-' + index">Postcode</label>
        <input
          type="text"
          class="form-control"
          v-model="address.postcode"
          :id="'postcode-' + index"
          @input="fetchPostcodeSuggestions(index)"
          required
        />
        <!-- Optional: Render postcode suggestions dropdown here -->
      </div>
      <div class="form-group">
        <label :for="'date-moved-in-' + index">Date Moved In</label>
        <input
          type="date"
          class="form-control"
          v-model="address.dateMovedIn"
          :id="'date-moved-in-' + index"
          required
          @change="handleDateChange"
        />
      </div>
    </div>

    <!-- Add Address Button -->
    <button
      v-if="canAddMoreAddresses"
      class="btn btn-secondary"
      @click="addAddress"
    >
      Add Another Address
    </button>

    <!-- Error Messages -->
    <div v-if="errorMessage" class="text-danger my-3">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>
/* Add custom styling here if necessary */
</style>
