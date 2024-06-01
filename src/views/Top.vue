<script setup>
  import { ref, onMounted } from "vue";
  import ContentBar from "../components/ContentBar.vue";
  import Menu from "../components/Menu.vue";
  import Loading from "../components/Loading.vue";
  import ViewTopGlobal from "../components/viewTopGlobal.vue";
  import {getTopUsersByMedals} from "../services/user.service"

  const topUsers = ref([]);
  const uuid = ref(localStorage.getItem("uuid"));
  const loading = ref(true);

  onMounted(async () => {
    try {

        topUsers.value = await getTopUsersByMedals()
        console.log(topUsers.value)
      //console.log(joinedGroups.value)
      //console.log(createdGroups.value)
    } catch (error) {
    } finally {
      loading.value = false;
    }
  });
</script>
<template>
  <Loading v-if="loading" />
  <div class="min-h-screen bg-gray-100 flex flex-col md:flex-row">
    <Menu />

    <main class="flex-1 p-8 bg-white rounded-xl mt-6 mr-3 mb-6">
      <ContentBar />

      <section class="mb-6">
        <div
          data-orientation="horizontal"
          role="none"
          class="shrink-0 bg-gray-100 h-[1px] w-full my-6 border-t-[20px] rounded-full border-gray-200"
        ></div>
        <h2 class="text-3xl font-bold mb-5 p-5 text-center">TOP GLOBAL</h2>
        <div class="grid gap-4 justify-center">
          <div
            v-for="(member, index) in topUsers"
            :key="member.id"
            class="grid grid-cols-1 gap-4 max-h-[700px] overflow-y-auto"
          >
            <ViewTopGlobal :member="member" :index="index" />
          </div>
        </div>
        <div
          data-orientation="horizontal"
          role="none"
          class="shrink-0 bg-gray-100 h-[1px] w-full my-6 border-t-[20px] rounded-full border-gray-200"
        ></div>
      </section>
    </main>
  </div>
</template>
<style></style>
