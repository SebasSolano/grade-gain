<script setup>
  import { getAuth, sendPasswordResetEmail } from "firebase/auth";
  import { ref, watchEffect} from "vue";
  import { useRouter } from "vue-router";

  const props = defineProps({
    resetPopup: Boolean,
  });

 


  const showPopup = ref(false);
  const email = ref("");
  const secondsToWait = ref(60);
  const activatedWait = ref(false);
  const errMsg = ref("");
  const router = useRouter();

  const closePopup = () => {
    showPopup.value = false;
    router.go("/sing-in")
  };


  const auth = getAuth();

  const handleSubmit = () => {
    if(email.value !== "") {
      sendPasswordResetEmail(auth, email.value)
      .then(() => {
        console.log("Password reset email sent.");
        errMsg.value = "Password reset email sent."
        activatedWait.value = true;
        startCountdown(); // Iniciar el contador al enviar el correo
      })
      .catch((error) => {
        console.error("Error sending password reset email:", error);
        errMsg.value = "Error sending password reset email:", error
      });
    }

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
        errMsg.value = ""
      }

    }, 1000);
  };


  watchEffect(() => {
    if (props.resetPopup) {
      showPopup.value = true;
    } else {
      showPopup.value = false;
    }
  });
</script>

<template>
  <div
    v-if="showPopup"
    class="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
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

      <h2 class="text-2xl font-bold mb-4">Change password</h2>

      <div class="mb-4">
        <label for="email" class="block text-xl font-medium mb-2">Email:</label>
        <div class="relative">
          <input
            type="email"
            v-model="email"
            class="mt-1 block w-full h-10 rounded-full bg-[#E8E8E8] border-gray-300 shadow-sm pl-12 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
          <div class="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-gray-400"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z"
              />
              <path d="M3 7l9 6l9 -6" />
            </svg>
            <span class="text-gray-400 -mt-1 ml-1">|</span>
          </div>
        </div>
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
        :class="{ 'bg-gray-400 ': activatedWait, 'bg-[#AEDB9F] hover:bg-[#76cc59]': !activatedWait }"
        class="text-lg font-semibold px-4 py-2 rounded-2xl transition duration-300"
      >
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<style></style>
