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
      postcodeSuggestions: [] as string[],
      suggestionVisible: [] as boolean[],
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
    fetchPostcodeSuggestions(index: number, code: string) {
      const postcode = code.trim();
      if (postcode.length >= 3) {
        axios
          .get(`https://api.postcodes.io/postcodes/${postcode}/autocomplete`)
          .then((response) => {
            this.$set(
              this.postcodeSuggestions,
              index,
              response.data.result || []
            );
            this.showSuggestions(index);
          })
          .catch((error) => {
            console.error("Error fetching postcode suggestions:", error);
            this.hideSuggestions(index);
          });
      } else {
        this.$set(this.postcodeSuggestions, index, []); // Clear suggestions if postcode is too short
        this.hideSuggestions(index);
      }
    },
    showSuggestions(index: number) {
      this.$set(this.suggestionVisible, index, true);
    },
    hideSuggestions(index: number) {
      this.$set(this.suggestionVisible, index, false);
    },
    selectSuggestion(index: number, suggestion: string) {
      this.addresses[index].postcode = suggestion;
      this.hideSuggestions(index);
    },
    onBlur(index: number) {
      // Delay hiding the suggestions to allow the click event to register
      setTimeout(() => {
        this.hideSuggestions(index);
      }, 20);
    },
    validateBlock(): boolean {
      this.errorMessage = "";

      // Check total address history duration
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

      for (const address of this.addresses) {
        if (
          address.dateMovedOut &&
          new Date(address.dateMovedOut) <= new Date(address.dateMovedIn)
        ) {
          this.errorMessage =
            "The moved out date  must be after the moved in date.";
          return false;
        }
      }

      return true;
    },
    getAddressData() {
      return this.addresses;
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
          <div class="form-group position-relative">
            <label :for="'postcode-' + index">Postcode</label>
            <input
              type="text"
              class="form-control"
              v-model="address.postcode"
              :id="'postcode-' + index"
              @input="fetchPostcodeSuggestions(index, address.postcode)"
              @focus="showSuggestions(index)"
              @blur="onBlur(index)"
              required
            />
            <!-- Postcode suggestions dropdown -->
            <div
              class="list-group position-absolute w-100 postcode-dropdown"
              :style="{ top: '100%', zIndex: 1000 }"
              v-if="
                postcodeSuggestions[index] &&
                postcodeSuggestions[index].length &&
                suggestionVisible[index]
              "
            >
              <a
                href="#"
                class="list-group-item list-group-item-action"
                v-for="suggestion in postcodeSuggestions[index]"
                :key="suggestion"
                @mousedown="selectSuggestion(index, suggestion)"
              >
                {{ suggestion }}</a
              >
            </div>
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

<style scoped>
.postcode-dropdown {
  max-height: 200px;
  overflow-y: auto;
}
</style>
