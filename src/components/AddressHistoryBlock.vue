<script lang="ts">
import Vue from "vue";
import axios from "axios";

interface Address {
  addressLine1: string;
  postcode: string;
  addressLine2: string;
  city: string;
  state: string;
  dateMovedIn: string;
  dateMovedOut: string;
  isStillLivingHere: boolean;
}

export default Vue.extend({
  name: "AddressHistoryBlock",
  data() {
    return {
      addresses: [
        {
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          postcode: "",
          dateMovedIn: "",
          isStillLivingHere: false,
        },
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
          addressLine2: "",
          city: "",
          state: "",
          postcode: "",
          dateMovedIn: "",
          dateMovedOut: "",
          isStillLivingHere: false,
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
    <!-- Error Messages -->
    <div v-if="errorMessage" class="text-danger my-3">
      {{ errorMessage }}
    </div>

    <div v-for="(address, index) in addresses" :key="index" class="mt-5 mb-3">
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

      <div class="form-group mt-3">
        <label :for="'address-line2-' + index">Address Line 2 (optional)</label>
        <input
          type="text"
          class="form-control"
          v-model="address.addressLine2"
          :id="'address-line2-' + index"
        />
      </div>

      <div class="row g-3 mt-1">
        <div class="col-sm-7">
          <div class="form-group">
            <label :for="'city-' + index">City</label>
            <input
              type="text"
              class="form-control"
              v-model="address.city"
              :id="'city-' + index"
              required
            />
          </div>
        </div>

        <div class="col-sm">
          <div class="form-group">
            <label :for="'state-' + index">State</label>
            <input
              type="text"
              class="form-control"
              v-model="address.state"
              :id="'state-' + index"
              required
            />
          </div>
        </div>

        <div class="col-sm">
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
        </div>
      </div>

      <div class="row mt-3">
        <div class="col">
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

        <div class="col">
          <div class="form-group">
            <label :for="'date-moved-out-' + index">Date Moved Out</label>
            <div class="input-group mb-3">
              <div class="input-group-text">
                <input
                  class="form-check-input mt-0"
                  type="checkbox"
                  v-model="address.isStillLivingHere"
                  value=""
                  aria-label="Checkbox for following text input"
                />
              </div>
              <input
                type="date"
                class="form-control"
                v-model="address.dateMovedOut"
                :disabled="address.isStillLivingHere"
                :id="'date-moved-out-' + index"
                required
                @change="handleDateChange"
              />
            </div>
            <div id="passwordHelpBlock" class="form-text text-start">
              Check box if still living at this address
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Address Button -->
    <button
      v-if="canAddMoreAddresses"
      class="btn btn-secondary my-3"
      @click="addAddress"
    >
      Add Another Address
    </button>
  </div>
</template>

<style scoped></style>
