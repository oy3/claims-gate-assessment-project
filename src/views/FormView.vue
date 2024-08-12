<script lang="ts">
import Vue from "vue";
import FormComponent from "@/components/form.vue";
import TextComponent from "@/components/text.vue";
import SubmitComponent from "@/components/submit.vue";
import AddressHistoryBlock from "@/components/AddressHistoryBlock.vue";
import { mapState } from "vuex";
import { User } from "@/types";

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
      user: (state: User) => state.user,
    }),
  },
  methods: {
    validateForm() {
      const addressHistoryBlock = this.$refs.addressHistoryBlock as Vue & {
        validateBlock: () => boolean;
      };

      if (addressHistoryBlock && addressHistoryBlock.validateBlock()) {
        // Proceed to create a claim or submit the form (createClaim.ts)
        console.log("Form is valid and ready to be submitted.");
        // Your form submission logic goes here
      } else {
        console.log("Form validation failed.");
      }
    },
  },
});
</script>

<template>
  <div class="container">
    <FormComponent>
      <template v-slot:title>
        <TextComponent
          :text="user ? `Welcome Back ${user.firstName}` : `Hello and welcome`"
          type="h1"
          classes="mt-4 mb-2"
        />
      </template>
      <template v-slot:subtitle>
        <TextComponent
          text="Please provide your address history for the past 3 years"
          type="h4"
          classes="mb-4"
        />
      </template>
      <template v-slot:question>
        <AddressHistoryBlock ref="addressHistoryBlock" />
      </template>
      <template v-slot:submit>
        <SubmitComponent @validate="validateForm" />
      </template>
    </FormComponent>
  </div>
</template>
