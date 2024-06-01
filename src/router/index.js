import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
    {
      path: "/settings",
      component: () => import("../views/Settings.vue"),
      meta: {
        requireAuth: true,
      },
    },
    {
      path: "/top",
      component: () => import("../views/Top.vue"),
      meta: {
        requireAuth: true,
      },
    },
    {
      path: "/support",
      component: () => import("../views/Support.vue"),
      meta: {
        requireAuth: true,
      },
    },
    {
      path: "/plans",
      component: () => import("../views/Plans.vue"),
      meta: {
        requireAuth: true,
      },
    },
    {
      path: "/group/own/:id",
      component: () => import("../views/OwnGroup.vue"),
      meta: {
        requireAuth: true,
      },
    },
    {
      path: "/group/your/:id",
      component: () => import("../views/YourGroup.vue"),
      meta: {
        requireAuth: true,
      },
    },
    {
      path: "/validate-user",
      component: () => import("../views/ValidateUser.vue"),
    },
    {
      path: "/sing-in",
      component: () => import("../views/SingIn.vue"),
      meta: { guestOnly: true },
    },
    {
      path: "/register",
      component: () => import("../views/Register.vue"),
      meta: { guestOnly: true },
    },
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
  const user = await getCurrentUser();
  if (to.matched.some((record) => record.meta.requireAuth)) {
    if (!user) {
      next("/sing-in");
    } else if (!user.emailVerified) {
      next("/validate-user"); // Redirige a una página para verificar el correo electrónico
    } else {
      next();
    }
  } else if (to.matched.some((record) => record.meta.guestOnly)) {
    if (user) {
      next("/");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
