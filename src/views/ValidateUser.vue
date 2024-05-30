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
      console.log(currentUser.value)
      console.log(currentUser.value.reloadUserInfo.emailVerified)
      if(currentUser.value.reloadUserInfo.emailVerified) router.push("/");
    });
  });
</script>
<template>
    <VerifyEmail />
</template>
