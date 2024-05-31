<script setup>
import { ref, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { searchGroups } from "../services/searchEngine.service";
import { createGroup } from "../services/group.service";

const searchQuery = ref("");
const searchResults = ref([]);
const showPopup = ref(false);
const groupName = ref("");
const fileInputRef = ref(null);
const errMsg = ref("");
const uuid = ref(localStorage.getItem("uuid"));
const group = ref(null);
const file = ref(null);

watch(searchQuery, async (newQuery) => {
  searchResults.value = await searchGroups(newQuery);
});

const router = useRouter();
const route = useRoute();

const back = () => {
  router.go(-1);
};

const showButton = computed(() => {
  return route.path !== "/";
});

const openPopup = () => {
  showPopup.value = true;
};

const closePopup = () => {
  showPopup.value = false;
};

const triggerFileInput = () => {
  fileInputRef.value.click();
};

const handleCreateGroup = async () => {
  if (groupName.value !== "" && file.value) {
    try {
      group.value = await createGroup(uuid.value, groupName.value, file.value);
    } catch (error) {
      errMsg.value = "Error creating the group: " + error.message;
      setTimeout(() => {
        errMsg.value = "";
      }, 2000);
    } finally {
      setTimeout(() => {
        showPopup.value = false;
        group.value = null;
        router.go("/");
      }, 3000);
    }
  } else {
    errMsg.value = "You must add a name or an image.";
    setTimeout(() => {
      errMsg.value = "";
    }, 2000);
  }
};

const handleGroup = (event) => {
  file.value = event.target.files[0];
};

const navigateToGroup = (groupId) => {
  router.push(`/group/own/${groupId}`);
};
</script>

<template>
  <div
    v-if="showPopup"
    class="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-80 z-50"
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

      <h2 class="text-2xl font-bold mb-4">Create a group</h2>

      <div class="mb-4">
        <label for="groupName" class="block text-xl font-medium mb-2"
          >Group Name:</label
        >
        <div class="relative">
          <input
            type="text"
            v-model="groupName"
            class="mt-1 block w-full h-10 rounded-full bg-[#E8E8E8] border-gray-300 shadow-sm pl-12 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
          <div class="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-gray-400"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#333333"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
              <path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1" />
              <path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
              <path d="M17 10h2a2 2 0 0 1 2 2v1" />
              <path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
              <path d="M3 13v-1a2 2 0 0 1 2 -2h2" />
            </svg>

            <span class="text-gray-400 ml-1">|</span>
          </div>
        </div>
        <label for="groupName" class="block text-xl font-medium pt-10 pb-5"
          >Add an image for the thumbnail:</label
        >
        <div class="pt-1 text-center">
          <input
            type="file"
            ref="fileInputRef"
            class="hidden"
            @change="handleGroup"
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
            Add image
          </button>
        </div>
      </div>
      <p class="text-red-500 text-center p-5">{{ errMsg }}</p>
      <div class="flex justify-end">
        <button
          @click="handleCreateGroup"
          class="text-lg bg-[#AEDB9F] hover:bg-[#76cc59] font-semibold px-4 py-2 rounded-2xl transition duration-300"
        >
          Create
        </button>
      </div>
    </div>
  </div>

  <div
    class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4"
  >
    <div class="flex items-center space-x-2 w-full md:w-1/2">
      <button
        v-if="showButton"
        @click="back"
        class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors h-10 px-4 py-2 rounded-lg"
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
          <path d="m12 19-7-7 7-7"></path>
          <path d="M19 12H5"></path>
        </svg>
        Back
      </button>
      <div class="relative">
        <input
          v-model="searchQuery"
          class="block h-10 w-96 pl-12 text-md rounded-full bg-[#E8E8E8] border-gray-300 shadow-sm focus:border-gray-300 focus:ring focus:ring-gray-300 focus:ring-opacity-50 flex-1"
          placeholder="Search groups..."
        />
        <div class="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon icon-tabler icon-tabler-search"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#333333"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
            <path d="M21 21l-6 -6" />
          </svg>
        </div>
        <ul
          v-if="searchResults.length"
          class="absolute bg-white border border-gray-300 rounded-md mt-2 w-full max-h-60 overflow-y-auto"
        >
          <li
            v-for="group in searchResults"
            :key="group.id"
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            @click="navigateToGroup(group.id)"
          >
            {{ group.name }}
          </li>
        </ul>
      </div>
    </div>
    <div class="flex space-x-2">
      <button
        class="bg-[#CAFAE1] text-md font-semibold px-4 py-2 rounded-full hover:bg-[#c1e8fc] transition duration-300"
      >
        Join
      </button>
      <button
        @click="openPopup"
        class="bg-[#AEDB9F] text-md font-semibold px-4 py-2 rounded-full hover:bg-[#9dec82] transition duration-300"
      >
        Create
      </button>
    </div>
  </div>
</template>

<style scoped>
  .hidden {
    display: none;
  }
</style>
