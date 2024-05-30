<script setup>
import Popup from "../components/Popup.vue";
import RandomShapes from "../components/RandomShapes.vue";
import { ref } from "vue";
import RegisterMenu from "../components/RegisterMenu.vue";

const popupInfo = ref({
  message: "",
  success: false,
  showPopup: false,
  linkRoute: "/register",
});

const handleRegister = (info) => {
  popupInfo.value = info;
};
</script>
<template>
<div class="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <RegisterMenu @register="handleRegister" />
      <RandomShapes />
  </div>
  <div v-if="popupInfo.showPopup" class="z-0">
    <Popup :info="popupInfo" />
  </div>
</template>
<style></style>
