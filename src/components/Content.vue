<script setup>
  import { ref, onMounted } from "vue";
  import ContentBar from "./ContentBar.vue";
  import GroupsCard from "./GroupsCard.vue";
  import { getUserGroups } from "../services/group.service";
  import Loading from "./Loading.vue";

  const joinedGroups = ref([]);
  const createdGroups = ref([]);
  const uuid = ref(localStorage.getItem("uuid"));
  const loading = ref(true);

  onMounted(async () => {
    try {
      const groups = await getUserGroups(uuid.value);
      joinedGroups.value = groups.joinedGroups;
      createdGroups.value = groups.createdGroups;
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
  <main class="flex-1 p-8 bg-white rounded-xl mt-6 mr-3 mb-6">
    <ContentBar />

    <section class="mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-1">
        <h2 v-if="createdGroups" class="text-3xl font-bold mb-5 p-5">
          OWN GROUPS
        </h2>
        <div
          class="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-8"
        >
        <div
        v-for="group in createdGroups"
          :key="group"
            class="flex items-center justify-center flex-cols-1 sm:flex-cols-1"
          >
          <GroupsCard :groups="group" />
          </div>
          
        </div>
        <div
          data-orientation="horizontal"
          role="none"
          class="shrink-0 bg-gray-100 h-[1px] w-full my-6 border-t-[20px] rounded-full border-gray-200"
        ></div>
        <h2 class="text-3xl font-bold mb-5 p-5">YOUR GROUPS</h2>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <div
            v-for="group in joinedGroups"
            :key="group"
            class="flex items-center justify-center"
          >
            <GroupsCard v-if="group.owner !== uuid" :groups="group" />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
<style></style>
