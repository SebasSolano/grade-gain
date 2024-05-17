<script setup>
  import { ref } from "vue";
  import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


  const email = ref("");
  const password = ref("");
  const errMsg = ref();
  const validateReset = ref(false);
  const emits = defineEmits(["login", "reset"]);

  const resetPass = () => {
    validateReset.value = true;
    console.log(validateReset.value)
    emits("reset", validateReset.value);
  };

  const login = () => {
    errMsg.value = "";
    const auth = getAuth();

    if (email.value != "" || password.value != "") {
      // Se necesita .value por el uso de ref()
      signInWithEmailAndPassword(auth, email.value, password.value)
        .then((data) => {
          console.log("Successfully singed in!");
          console.log(auth.currentUser);
          emits("login", {
            message: "Successfully singed in!",
            success: true,
            showPopup: true,
            linkRoute: "/",
          });
        })
        .catch((err) => {
          /*
        firebase auth errors code:

        auth/invalid-email
        auth/user-not-found
        auth/wrong-password
        auth/user-disabled

        */
          console.log("Failed to register: ", err.code);
          switch (err.code) {
            case "auth/invalid-email":
              errMsg.value = "Invalid Email";
              break;
            case "auth/user-not-found":
              errMsg.value = "No account with that email was found";
              break;
            case "auth/wrong-password":
              errMsg.value = "Incorrect password";
              break;
            case "auth/user-disabled":
              errMsg.value = "User is Banned";
              break;
            default:
              errMsg.value = "Email or password was incorrect";
              break;
          }
        });
    } else {
      errMsg.value = "You must fill out all the fields!";
    }
  };
</script>
<template>
  <div
    class="flex flex-col items-center justify-center h-screen bg-[#F5F5F5] rounded-2xl pt-5 py-5"
  >
    <div
      class="absolute inset-y-14 text-center text-[5rem] flex items-start font-bold"
    >
      Grade <span class="text-[#57FE1E]">Gain</span>
    </div>
    <div class="w-80 z-0">
      <div class="mb-4">
        <label for="email" class="block text-xl font-medium">Email:</label>
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
      <div class="mb-4">
        <label for="password" class="block text-xl font-medium"
          >Password:</label
        >
        <div class="relative">
          <input
            type="password"
            v-model="password"
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
                d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z"
              />
              <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
              <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
            </svg>
            <span class="text-gray-400 -mt-1 ml-1">|</span>
          </div>
        </div>
      </div>
      <div class="flex items-center mb-4 gap-1">
        <p>You don't have an account?,</p>
        <router-link
          to="/register"
          class="text-sm text-red-500 hover:underline"
        >
          register here.</router-link
        >
      </div>
      <div class="flex items-center justify-center mb-4">
        <a @click="resetPass" class="text-sm hover:underline"
          >Did you forget your password?</a
        >
      </div>
      <div class="text-center">
        <button
          @click="login"
          class="bg-[#AEDB9F] text-xl font-semibold px-4 py-2 rounded-2xl hover:bg-[#9dec82] transition duration-300"
        >
          Login
        </button>
      </div>
      <div class="flex items-center justify-center mb-4">
        <p class="text-lg text-red-500 mt-8">{{ errMsg }}</p>
      </div>
    </div>
  </div>
</template>

<style></style>
