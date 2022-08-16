import Vue from "vue";
import VueRouter from "vue-router";

import Dashboard from "./dashboard";
import Store from "@/store/index";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
    ...Dashboard,

    {
      path: "/",
      name: "Home",

      component: () => import("@/views/home/newPage.vue"),

      meta: {
        requiresAuth: true,
        pageTitle: "Home",
        breadcrumb: [
          {
            text: "This is home",
            active: true,
          },
        ],
      },
    },

    // !inventory

    {
      path: "/login",
      name: "login",
      component: () => import("@/views/authentication/login.vue"),
      meta: {
        layout: "full",
      },
    },
    {
      path: "/error-404",
      name: "error-404",
      component: () => import("@/views/error/Error404.vue"),
      meta: {
        requiresAuth: true,
        layout: "full",
      },
    },
    {
      path: "*",
      redirect: "error-404",
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    let x = Store.getters["Auth/authenticationStatus"];
    debugger;
    if (x) {
      next();
      return;
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById("loading-bg");
  // debugger;
  if (appLoading) {
    appLoading.style.display = "none";
  }
});

export default router;
