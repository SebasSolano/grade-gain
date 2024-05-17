<script setup>
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import VerifyEmail from "../components/VerifyEmail.vue";
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  const router = useRouter();

  const currentUser = ref(null);


  onMounted(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      currentUser.value = user;

      if(user.emailVerified) router.push("/");
    });
  });
</script>
<template>
    <VerifyEmail />
</template>
