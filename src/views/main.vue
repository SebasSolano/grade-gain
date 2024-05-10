<script setup>
import Menu from "../components/Menu.vue";
</script>
<template>
  <div id="app" class="relative h-screen p-2 gap-2">
    <aside class="[grid-area:aside] flex-col flex overflow-y-auto">
      <Menu />
    </aside>
    <main
      class="[grid-area:main] rounded-lg bg-[#E8E8E8] overflow-y-auto w-full"
    ></main>
  </div>
</template>
<style></style>
