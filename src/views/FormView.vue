<script lang="ts">
import Vue from "vue";
import axios from "axios";
import FormComponent from "@/components/form.vue";
import TextComponent from "@/components/text.vue";
import SubmitComponent from "@/components/submit.vue";
import AddressHistoryBlock from "@/components/AddressHistoryBlock.vue";
import { mapState } from "vuex";
import { User } from "@/types";
import { createClaim } from "@/core/createClaim";

export default Vue.extend({
  name: "FormView",
  components: {
    FormComponent,
    TextComponent,
    SubmitComponent,
    AddressHistoryBlock,
  },
  computed: {
    ...mapState<User>({
      user: (state: { user: User }) => state.user,
    }),
  },
  methods: {
    async getIpAddress(): Promise<string | null> {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        return response.data.ip;
      } catch (error) {
        console.error("Failed to get IP address:", error);
        return null;
      }
    },
    async validateForm() {
      const submitComponent = this.$refs.submitComponent as Vue & {
        startLoading: () => void;
        stopLoading: () => void;
      };

      const addressHistoryBlock = this.$refs.addressHistoryBlock as Vue & {
        validateBlock: () => boolean;
        getAddressData: () => any;
      };

      submitComponent.startLoading();

      if (addressHistoryBlock && addressHistoryBlock.validateBlock()) {
        // Create a claim or submit the form

        const claimData = addressHistoryBlock.getAddressData();

        const ipAddress = await this.getIpAddress();

        if (!ipAddress) {
          submitComponent.stopLoading();
          alert("Unable to retrieve IP address. Please try again.");
          return;
        }

        // Call createClaim
        const [claim, error] = await createClaim(
          this.$store.state.user.id,
          ipAddress,
          claimData
        );

        if (error) {
          submitComponent.stopLoading();
          console.error("Error creating claim:", error);
          alert(
            "An error occurred while creating the claim. Please try again."
          );
        } else if (claim) {
          console.log("Claim created successfully:", claim);
          alert("Your claim has been submitted successfully.");
          console.log(
            "Form is valid and ready to be submitted.",
            addressHistoryBlock
          );

          // Optionally, reset the form or redirect the user
          window.location.reload();
        }
      } else {
        submitComponent.stopLoading();
        console.log("Form validation failed.");
      }
    },
  },
});
</script>

<template>
  <div
    class="container card py-3 px-3 px-sm-5 shadow mb-5 w-100 w-lg-50 w-md-65 mx-lg-auto"
  >
    <FormComponent v-if="user && Object.keys(user).length > 0">
      <template v-slot:title>
        <TextComponent
          :text="user ? `Welcome Back ${user.firstName}` : `Hello and welcome`"
          type="h3"
          classes="mt-4 mb-2"
        />
      </template>
      <template v-slot:subtitle>
        <TextComponent
          text="Please provide your address history for the past 3 years"
          type="h6"
          classes="mb-4"
        />
      </template>
      <template v-slot:question>
        <AddressHistoryBlock ref="addressHistoryBlock" />
      </template>
      <template v-slot:submit>
        <SubmitComponent ref="submitComponent" @validate="validateForm" />
      </template>
    </FormComponent>

    <div v-else>User do not exist</div>
  </div>
</template>

<style scoped>
@media (min-width: 992px) {
  .w-lg-50 {
    width: 50% !important;
  }
}

@media (min-width: 768px) {
  .w-md-65 {
    width: 65% !important;
  }
}
</style>
