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
    { path: "/sing-in", component: () => import("../views/SingIn.vue"), meta: { guestOnly: true } },
    { path: "/register", component: () => import("../views/Register.vue"), meta: { guestOnly: true } },
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
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (!user) {
      next("/sing-in");
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.guestOnly)) {
    if (user) {
      next("/"); // Redirige a la página principal si el usuario ya está autenticado
    } else {
      next();
    }
  } else {
    next(); // asegura que siempre se llame a next()!
  }
});

export default router;