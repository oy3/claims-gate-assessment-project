import Vue from "vue";
import Vuex from "vuex";
import { User } from "@/types";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null as User | null,
  },
  getters: {},
  mutations: {
    setUser(state, user: User) {
      state.user = user;
    },
  },
  actions: {
    submitForm({ state }) {
      // TODO: Handle form submission
      console.log("Form submitted", state.user);
    },
  },
  modules: {},
});
