<script setup>
  import Popup from "../components/Popup.vue";
  import RandomShapes from "../components/RandomShapes.vue";
  import { ref } from "vue";
  import RegisterMenu from "../components/RegisterMenu.vue";

  const popupInfo = ref({ message: "", success: false, showPopup: false, linkRoute: "/register" });

  const handleRegister = (info) => {
    popupInfo.value = info;
  };
</script>
<template>
  <div id="app" class="relative h-screen p-2 gap-2 z-1">
    <aside class="[grid-area:aside] flex-col flex overflow-y-auto">
      <RegisterMenu @login="handleRegister" />
    </aside>
    <main
      class="[grid-area:main] rounded-lg bg-[#ffffff90] overflow-hidden w-[87rem] max-w-[87rem]"
    >
      <RandomShapes />
    </main>
  </div>
  <div v-if="popupInfo.showPopup" class="z-0">
    <Popup :info="popupInfo" />
  </div>
</template>
<style></style>
