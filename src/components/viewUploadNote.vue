<script setup>
  import { ref, onMounted } from "vue";
  import Alert from "./Alert.vue";
  import { useRoute, useRouter } from "vue-router";
  import { uploadGroupFile } from "../services/group.service";

  const titleInfo = ref("");
  const note = ref(0);
  const isChecked = ref(false);
  const errMsg = ref("");
  const typeError = ref("");
  const fileInputRef = ref(null);
  const file = ref(null);
  const uuid = ref(localStorage.getItem("uuid"));

  const route = useRoute();
  const router = useRouter();

  const triggerFileInput = () => {
    fileInputRef.value.click();
  };

  const handleFile = (event) => {
    file.value = event.target.files[0];
  };

  const saveFileNote = async () => {
    if (isChecked && titleInfo.value !== "" && note.value > 0 && file.value) {
      try {
        await uploadGroupFile(
          uuid.value,
          route.params.id,
          file.value,
          note.value,
          titleInfo.value
        );
      } catch (error) {
        errMsg.value = error;
        typeError.value = "Error";
        setTimeout(() => {
          errMsg.value = "";
          typeError.value = "";
        }, 3000);
      } finally {
        errMsg.value = "File uploaded successfully!";
        typeError.value = "Success";
        setTimeout(() => {
          errMsg.value = "";
          typeError.value = "";
          router.go();
        }, 3000);
      }
    } else {
      errMsg.value = "You must fill in the fields and accept the terms!";
      typeError.value = "Error";
      setTimeout(() => {
        errMsg.value = "";
        typeError.value = "";
      }, 3000);
    }
  };
</script>
<template>
  <Alert v-if="typeError || errMsg" :alert="typeError" :text="errMsg" />
  <div class="flex items-center justify-center">
    <input
      type="file"
      ref="fileInputRef"
      class="hidden"
      @change="handleFile"
      accept="image/*, .pdf"
    />
    <button
      @click="triggerFileInput"
      class="flex items-center justify-center transition-all duration-700 bg-green-400 rounded-full w-52 h-52 shadow-md hover:shadow-xl hover:scale-105 hover:bg-green-500"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="icon icon-tabler icon-tabler-cloud-upload"
        width="44"
        height="44"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="#000000"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path
          d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1"
        />
        <path d="M9 15l3 -3l3 3" />
        <path d="M12 12l0 9" />
      </svg>
    </button>
  </div>
  <div class="flex flex-col items-center justify-center">
    <div class="mb-4">
      <label for="email" class="block text-xl font-medium mb-2"
        >Activity, Quiz or Partial:</label
      >
      <div class="relative">
        <input
          type="text"
          v-model="titleInfo"
          class="mt-1 block w-96 h-10 rounded-full bg-white border-gray-300 shadow-md pl-5 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        />
      </div>
    </div>
    <div class="mb-4">
      <label for="email" class="block text-xl font-medium mb-2">Note:</label>
      <div class="relative">
        <input
          type="number"
          v-model="note"
          class="mt-1 block w-96 h-10 rounded-full bg-white border-gray-300 shadow-md pl-5 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        />
      </div>
    </div>
    <div class="flex items-center space-x-2 my-4">
      <input
        type="checkbox"
        class="rounded-3xl form-checkbox h-5 w-5"
        v-model="isChecked"
      />
      <label for="checkbox"> Valid that the note you put is correct?</label>
    </div>
    <button
      @click="saveFileNote"
      class="bg-[#CAFAE1] text-md font-semibold px-4 py-2 rounded-full hover:bg-[#c1e8fc] transition duration-300"
    >
      Save note
    </button>
  </div>
</template>
<style scoped>
  .hidden {
    display: none;
  }
</style>
