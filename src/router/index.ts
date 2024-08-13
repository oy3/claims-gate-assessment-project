import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import FormView from "@/views/FormView.vue";
import { getUserDataById } from "@/core/getUserDataById";
import store from "@/store";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/:userId",
    name: "form",
    component: FormView,
    beforeEnter: async (to, from, next) => {
      // TODO load the user data from getUserDataById and store it with VueX
      const userId = to.params.userId as string;
      const [user, error] = await getUserDataById(userId);
      if (error || !user) {
        next({ path: "/" }); // Redirect if user not found
      } else {
        store.commit("setUser", user); // Store user data
        next();
      }
    },
  },
  {
    path: "/",
    name: "index",
    component: FormView,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
