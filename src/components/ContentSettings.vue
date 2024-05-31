<script setup>
  import ContentBar from "./ContentBar.vue";
  import { ref, onMounted } from "vue";
  import {
    getUserInfo,
    updateDataUser,
    updateProfilePicture,
  } from "../services/user.service";
  import { getAuth, updateProfile, onAuthStateChanged } from "firebase/auth";
  import Popup from "./Popup.vue";
  import RequestMail from "../components/RequestMail.vue";
  import { useRouter } from "vue-router";
  import Loading from "../components/Loading.vue";

  const auth = getAuth();
  const router = useRouter();
  const username = ref("");
  const photoURL = ref(null);
  const dataUser = ref({});
  const userId = ref(localStorage.getItem("uuid"));
  const bio = ref("");
  const website = ref("");
  const location = ref("");
  const errMsg = ref("");
  const popupInfo = ref({
    message: "",
    success: false,
    showPopup: false,
    linkRoute: "/sign-in",
  });
  const showMenu = ref(false);
  const loading = ref(true);
  const fileInputRef = ref(null); // Ref para el input file

  onMounted(async () => {
    try {
      dataUser.value = await getUserInfo(userId.value);
      username.value = dataUser.value.displayName;
      bio.value = dataUser.value.bio;
      website.value = dataUser.value.website;
      location.value = dataUser.value.location;
      photoURL.value = dataUser.value.photoURL;
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      loading.value = false;
    }
  });

  const updateUser = () => {
    console.log(username.value, bio.value, website.value, location.value);
    if (username.value !== "") {
      updateDataUser(userId.value, {
        username: username.value,
        bio: bio.value,
        website: website.value,
        location: location.value,
      }).then(() => {
        popupInfo.value = {
          message: "Update completed!",
          success: true,
          showPopup: true,
          linkRoute: "/settings",
        };
      });
    } else {
      errMsg.value = "Error: You must at least fill in the Username field!";
    }
  };

  const resetPass = () => {
    showMenu.value = true;
  };

  // Función para manejar la selección del archivo
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        await updateProfilePicture(userId.value, file);
        // Actualizar la foto de perfil en la UI
        const userData = await getUserInfo(userId.value);
        photoURL.value = userData.photoURL;
      } catch (error) {
        console.error("Error updating profile picture:", error);
      } finally {
        updateProfile(auth.currentUser, {
          photoURL: photoURL.value,
        }).then(() => {
          router.go("/settings");
        });
      }
    }
  };

  // Función para disparar el click del input file
  const triggerFileInput = () => {
    fileInputRef.value.click();
  };
</script>
<template>
  <RequestMail :resetPopup="showMenu" />
  <div v-if="popupInfo.showPopup" class="z-0">
    <Popup :info="popupInfo" />
  </div>
  <main class="flex-1 p-8 bg-white rounded-xl mt-6 mr-3 mb-6">
    <ContentBar />
    <section class="mb-6">
      <div class="grid gap-6">
        <div
          class="border text-card-foreground shadow-sm bg-[#E8E8E8] rounded-2xl p-10"
          data-v0-t="card"
        >
          <div class="flex items-center justify-between pb-10">
            <h2 class="text-2xl font-bold">Settings</h2>
            <button
              @click="resetPass"
              class="bg-[#AEDB9F] text-xl font-semibold px-4 py-2 rounded-2xl hover:bg-[#9dec82] transition duration-300"
            >
              Change Password
            </button>
          </div>
            <Loading v-if="loading" />
          <div v-else class="mt-6 grid gap-4">
            <div class="flex items-center space-x-4 pb-10">
              <span
                class="relative flex bg-slate-500 overflow-hidden rounded-full w-24 h-24"
              >
                <img
                  class="aspect-square h-full w-full"
                  alt="User profile"
                  :src="photoURL"
                />
              </span>
              <div>
                <div class="text-lg font-semibold">
                  {{ dataUser.displayName }}
                </div>
                <div class="text-gray-500">{{ dataUser.email }}</div>
              </div>
              <input
                type="file"
                ref="fileInputRef"
                class="hidden"
                @change="handleFileChange"
                accept="image/*"
              />
              <button
                @click="triggerFileInput"
                class="inline-flex items-center justify-center rounded-2xl bg-[#CAFAE1] text-xl font-semibold hover:bg-[#c1e8fc] transition duration-300 h-10 px-4 py-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="mr-2 h-4 w-4"
                >
                  <path
                    d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"
                  ></path>
                  <circle cx="12" cy="13" r="3"></circle>
                </svg>
                Change Photo
              </button>
            </div>
            <div class="grid gap-2">
              <label
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                for="username"
              >
                Username
              </label>
              <input
                class="mt-1 block w-full h-10 rounded-full bg-white border-gray-300 shadow-sm pl-5 focus:border-gray-300 focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                v-model="username"
                id="username"
                type="text"
              />
            </div>
            <div class="grid gap-2">
              <label
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                for="bio"
              >
                Bio
              </label>
              <textarea
                class="min-h-[80px] mt-1 block w-full h-10 rounded-2xl bg-white border-gray-300 shadow-sm pl-5 pt-2 focus:border-gray-300 focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                v-model="bio"
                id="bio"
                placeholder="Write a short bio..."
                rows="3"
              ></textarea>
            </div>
            <div class="grid gap-2">
              <label
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                for="website"
              >
                Website
              </label>
              <input
                class="mt-1 block w-full h-10 rounded-full bg-white border-gray-300 shadow-sm pl-5 focus:border-gray-300 focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                v-model="website"
                id="website"
                type="text"
                placeholder="https://example.com"
              />
            </div>
            <div class="grid gap-2">
              <label
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                for="location"
              >
                Location
              </label>
              <input
                class="mt-1 block w-full h-10 rounded-full bg-white border-gray-300 shadow-sm pl-5 focus:border-gray-300 focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                v-model="location"
                placeholder="San Francisco, CA"
                type="text"
              />
            </div>
            <div class="grid gap-2">
              <button
                @click="updateUser"
                type="submit"
                class="inline-flex items-center justify-center whitespace-nowrap rounded-2xl bg-[#AEDB9F] text-xl font-semibold hover:bg-[#9dec82] transition duration-300 h-10 px-4 py-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="mr-2"
                >
                  <path d="m12 14 4-4"></path>
                  <path d="M3.34 19a10 10 0 1 1 17.32 0"></path>
                </svg>
                Edit Profile
              </button>
            </div>
            <div class="flex items-center justify-center mb-4">
              <p class="text-lg text-red-500 mt-8">{{ errMsg }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
  .hidden {
    display: none;
  }
</style>
