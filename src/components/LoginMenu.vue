<script setup></script>
<template>
  <div
    class="flex flex-col items-center justify-center h-screen bg-[#F5F5F5] rounded-2xl pt-5 py-5"
  >
  <div class="absolute inset-y-14 text-center text-[5rem] flex items-start font-bold ">
      Grade <span class="text-[#57FE1E]">Gain</span>
    </div>
    <form class="w-80">
      <div class="mb-4">
        <label for="email" class="block text-xl font-medium">Email:</label>
        <div class="relative">
          <input
            type="email"
            id="email"
            name="email"
            class="mt-1 block w-full h-10 rounded-full bg-[#E8E8E8] border-gray-300 shadow-sm pl-12 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
          <div class="absolute inset-y-0 left-0 flex items-center pl-3">
            <!-- Icono de correo electrónico -->
            <svg
              class="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 10l-5 5-5-5m10 4v4m0 0h-4m4 0l2.5-2.5m0 0L17 14"
              ></path>
            </svg>
            <span class="text-gray-400 -mt-1 ml-1">|</span>
          </div>
        </div>
      </div>
      <div class="mb-4">
        <label for="password" class="block text-xl font-medium"
          >Password:</label
        >
        <div class="relative">
          <input
            type="password"
            id="password"
            name="password"
            class="mt-1 block w-full h-10 rounded-full bg-[#E8E8E8] border-gray-300 shadow-sm pl-12 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
          <div class="absolute inset-y-0 left-0 flex items-center pl-3">
            <!-- Icono de contraseña -->
            <svg
              class="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <span class="text-gray-400 -mt-1 ml-1">|</span>
          </div>
        </div>
      </div>
      <div class="flex items-center mb-4 gap-1">
        <p>You don't have an account?, </p>
        <router-link to="/register" class="text-sm text-red-500 hover:underline"
          > register here.</router-link
        >
      </div>
      <div class="flex items-center justify-center mb-4">
        <router-link to="#" class="text-sm hover:underline"
          >Did you forget your password?</router-link
        >
      </div>
      <div class="text-center">
        <button
          type="submit"
          class="bg-[#AEDB9F] text-xl font-semibold px-4 py-2 rounded-2xl hover:bg-[#9dec82] transition duration-300"
        >
          Login
        </button>
      </div>
    </form>
  </div>
</template>

<style></style>
