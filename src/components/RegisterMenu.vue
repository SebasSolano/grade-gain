<script setup>
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  updateProfile, // Importa signOut
} from "firebase/auth";
import { ref } from "vue";
import { Timestamp } from "firebase/firestore";
import { addDataUser } from "../services/user.service";

const name = ref("");
const surname = ref("");
const email = ref("");
const password = ref("");
const ConfirmPassword = ref("");
const isChecked = ref(false);
const msgError = ref("");

const emits = defineEmits(["register"]);
const auth = getAuth();
const register = async () => {
  msgError.value = "";
  if (isChecked.value) {
    if (
      password.value !== "" &&
      ConfirmPassword.value !== "" &&
      name.value !== "" &&
      email.value !== "" &&
      surname.value !== ""
    ) {
      if (ConfirmPassword.value === password.value) {
        createUserWithEmailAndPassword(auth, email.value, password.value)
          .then((data) => {
            console.log("User created!");
            sendEmailVerification(auth.currentUser)
              .then(() => {
                console.log("Email verification sent!");
                localStorage.setItem("uuid", auth.currentUser.uid)
                addDataUser(auth.currentUser.uid, {
                  uuid: auth.currentUser.uid,
                  displayName: `${name.value} ${surname.value}`,
                  email: email.value,
                  photoURL:
                    "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg",
                  bio: "",
                  website: "",
                  location: "",
                  id_subscription: "jcJwJl4Yyw0UURJGr3yz",
                  medals: 0,
                  status: true,
                  id_rol: 103,
                  createAt: Timestamp.now(),
                  updateAt: Timestamp.now(),
                }).then(() => {
                  console.log("Data user add!");
                  updateProfile(auth.currentUser, {
                    displayName: `${name.value} ${surname.value}`,
                    photoURL:
                      "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg",
                  }).then(() => {
                    console.log("Display name updated successfully!");
                    signOut(auth).then(() => {
                      console.log("User signed out after registration.");
                      emits("register", {
                        message:
                          "Successful registration! Please verify your email.",
                        success: true,
                        showPopup: true,
                        linkRoute: "/sing-in",
                      });
                    });
                  });
                });
              })
              .catch((error) => {
                console.log("Error sending email verification:", error);
                msgError.value = "Failed to send email verification.";
              });
          })
          .catch((err) => {
            console.log("Failed to register: ", err.code);
            msgError.value = "Sorry, there was an error registering :(";
          });
      } else {
        msgError.value = "Passwords do not match!";
      }
    } else {
      msgError.value = "You must fill out all the fields!";
    }
  } else {
    msgError.value = "You must accept the terms first!";
  }
};
</script>
<template>
  <aside class="w-full md:w-96 p-5 rounded-2xl">
    <div
      class="flex flex-col items-center justify-center h-full bg-white rounded-2xl p-4"
    >
      <div class="absolute inset-y-14 text-center text-[3.7rem] flex font-bold">
        Grade <span class="text-[#57FE1E]">Gain</span>
      </div>
      <div class="mt-36 z-0">
        <div class="mb-4">
          <label for="name" class="block text-xl font-medium">Name:</label>
          <div class="relative">
            <input
              type="text"
              v-model="name"
              class="mt-1 block w-full h-10 rounded-full bg-[#E8E8E8] border-gray-300 shadow-sm pl-12 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              required
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-gray-400"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M3 4m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v10a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z"
                />
                <path d="M9 10m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M15 8l2 0" />
                <path d="M15 12l2 0" />
                <path d="M7 16l10 0" />
              </svg>
              <span class="text-gray-400 ml-1">|</span>
            </div>
          </div>
        </div>
        <div class="mb-4">
          <label for="name" class="block text-xl font-medium">Surname:</label>
          <div class="relative">
            <input
              type="text"
              v-model="surname"
              class="mt-1 block w-full h-10 rounded-full bg-[#E8E8E8] border-gray-300 shadow-sm pl-12 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              required
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-gray-400"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M3 4m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v10a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z"
                />
                <path d="M9 10m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M15 8l2 0" />
                <path d="M15 12l2 0" />
                <path d="M7 16l10 0" />
              </svg>
              <span class="text-gray-400 ml-1">|</span>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <label for="email" class="block text-xl font-medium">Email:</label>
          <div class="relative">
            <input
              type="email"
              v-model="email"
              class="mt-1 block w-full h-10 rounded-full bg-[#E8E8E8] border-gray-300 shadow-sm pl-12 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              required
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
              <span class="text-gray-400 ml-1">|</span>
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
              required
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
              <span class="text-gray-400 ml-1">|</span>
            </div>
          </div>
        </div>
        <div class="mb-4">
          <label for="password" class="block text-xl font-medium"
            >Confirm Password:</label
          >
          <div class="relative">
            <input
              type="password"
              v-model="ConfirmPassword"
              class="mt-1 block w-full h-10 rounded-full bg-[#E8E8E8] border-gray-300 shadow-sm pl-12 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              required
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
              <span class="text-gray-400 ml-1">|</span>
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-2 my-4">
          <input
            type="checkbox"
            class="rounded-check form-checkbox h-5 w-5"
            v-model="isChecked"
          />
          <label for="checkbox"> I accept the terms and conditions</label>
        </div>
        <div class="flex items-center mb-4 gap-1">
          <p>Do you already have an account?</p>
          <router-link
            to="/sing-in"
            class="text-sm text-green-500 hover:underline"
          >
            click here!</router-link
          >
        </div>
        <div class="text-center">
          <button
            @click="register"
            class="bg-[#AEDB9F] text-xl font-semibold px-4 py-2 rounded-2xl hover:bg-[#9dec82] transition duration-300"
          >
            Register
          </button>
        </div>
        <div class="flex items-center justify-center mb-4">
          <p class="text-lg text-red-500 mt-8">{{ msgError }}</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
input[type="checkbox"].rounded-check {
  border-radius: 100% !important;
}
</style>
