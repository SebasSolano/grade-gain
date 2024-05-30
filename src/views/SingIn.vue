<script setup>
import LoginMenu from "../components/LoginMenu.vue";
import Popup from "../components/Popup.vue";
import RandomShapes from "../components/RandomShapes.vue";
import { ref } from "vue";
import RequestMail from "../components/RequestMail.vue";

const popupInfo = ref({
  message: "",
  success: false,
  showPopup: false,
  linkRoute: "/sing-in",
});

const showMenu = ref(false);

const handleShow = (info) => {
  showMenu.value = info;
  //console.log(showMenu.value)
};

const handleLogin = (info) => {
  popupInfo.value = info;
};
</script>
<template>
  <div class="min-h-screen bg-gray-100 flex flex-col md:flex-row">
    <LoginMenu @login="handleLogin" @reset="handleShow" />

    <RandomShapes />
  </div>
  <div v-if="popupInfo.showPopup" class="z-0">
    <Popup :info="popupInfo" />
  </div>
  <RequestMail :resetPopup="showMenu" />
</template>
<style></style>
