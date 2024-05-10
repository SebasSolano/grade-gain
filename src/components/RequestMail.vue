<script setup>
  import { ref } from "vue";

  const showPopup = ref(false);
  const email = ref("");

  const closePopup = () => {
    showPopup.value = false;
  };

  const handleSubmit = () => {
    sendPasswordResetEmail(auth, email.value)
      .then(() => {
        console.log("Correo de restablecimiento enviado.");
        closePopup();
      })
      .catch((error) => {
        console.error("Error al enviar correo de restablecimiento:", error);
      });
  };
</script>

<template>
  <div
    v-if="showPopup"
    class="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
  >
    <div class="bg-white rounded-lg p-8">
      <button
        @click="closePopup"
        class="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
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
      <h2 class="text-2xl font-bold mb-4">Cambiar contraseña</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="email" class="block text-gray-700 font-medium"
            >Correo electrónico:</label
          >
          <input
            type="email"
            id="email"
            v-model="email"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
        <div class="flex justify-end">
          <button
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style></style>
