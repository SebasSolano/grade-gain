<script setup>
  import {
    getAuth,
    sendEmailVerification,
    onAuthStateChanged,
  } from "firebase/auth";
  import { useRouter } from "vue-router";
  import { ref } from "vue";

  const showPopup = ref(true);
  const secondsToWait = ref(60);
  const activatedWait = ref(false);
  const errMsg = ref("");
  const router = useRouter();

  const closePopup = () => {
    showPopup.value = false;
    router.go("/");
  };

  const auth = getAuth();
  const handleSubmit = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        console.log("Email verification sent.");
        errMsg.value = "Email verification sent.";
        activatedWait.value = true;
        startCountdown(); // Iniciar el contador al enviar el correo
      })
      .catch((error) => {
        console.error("Error sending email verification:", error);
        (errMsg.value = "Error sending email verification:"), error;
      });
  };

  const startCountdown = () => {
    let seconds = 60;
    const interval = setInterval(() => {
      secondsToWait.value = seconds;
      seconds--;
      if (seconds < 0) {
        clearInterval(interval);
        secondsToWait.value = 60; // Restablecer secondsToWait a su estado predeterminado
        activatedWait.value = false;
        errMsg.value = "";
      }
    }, 1000);
  };
</script>

<template>
  <div
    v-if="showPopup"
    class="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-70 z-50"
  >
    <div class="bg-white rounded-lg p-8 w-96">
      <div class="flex justify-end">
        <button
          @click="closePopup"
          class="text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          <svg
            class="h-6 w-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>

      <h2 class="text-2xl font-bold mb-4">Send validation</h2>

      <div class="mb-4">
        <p class="block text-xl font-medium mb-2">
          To access our app, it is necessary to validate your email.
        </p>
        <p class="block text-xl font-medium mb-2">
          Please, validate the email!
        </p>
      </div>
      <p class="text-red-500">{{ errMsg }}</p>
      <p v-if="activatedWait">
        {{
          secondsToWait > 0
            ? `Wait ${secondsToWait} seconds before sending`
            : ""
        }}
      </p>
      <div class="flex justify-end">
        <button
          @click="handleSubmit"
          :disabled="secondsToWait < 60"
          :class="{
            'bg-gray-400 ': activatedWait,
            'bg-[#AEDB9F] hover:bg-[#76cc59]': !activatedWait,
          }"
          class="text-lg font-semibold px-4 py-2 rounded-2xl transition duration-300"
        >
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<style></style>
