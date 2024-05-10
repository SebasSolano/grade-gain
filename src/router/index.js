import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged} from "firebase/auth";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("../views/main.vue"),
      meta: {
        requireAuth: true,
      },
    },
    { path: "/sing-in", component: () => import("../views/SingIn.vue") },
    { path: "/register", component: () => import("../views/Register.vue") },

  ],
});

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
};

router.beforeEach(async (to, from, next) => {
  console.log("Checking authentication for route:", to.path);
  if (to.matched.some((record) => record.meta.requireAuth)) {
    console.log("Route requires authentication");
    try {
      const user = await getCurrentUser();
      console.log("User from getCurrentUser:", user);
      if (user) {
        next();
      } else {
        console.log("No user found, redirecting to /sing-in");
        next("/sing-in");
      }
    } catch (error) {
      console.log("Error in authentication:", error);
      next("/sing-in");
    }
  } else {
    next();
  }
});


export default router;
