<script setup>
  import { ref, onMounted } from "vue";
  import { getUserInfo } from "../services/user.service"; // Asegúrate de importar tu función de API
  import { useRouter } from "vue-router";
  import { getGroupMemberById } from "../services/group.service";
  // Props
  const props = defineProps({
    groups: {
      type: Object,
      required: true,
    },
  });

  const router = useRouter();
  const groupMember = ref(null);
  // State
  const authorName = ref("");

  // Fetch user info on component mount
  onMounted(async () => {
    //console.log(props.groups);
    if (props.groups.owner) {
      try {
        const userInfo = await getUserInfo(props.groups.owner);
        authorName.value = userInfo.displayName;
        groupMember.value = await getGroupMemberById(props.groups.id, props.groups.owner);
        //console.log(groupMember.value)
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    }
  });

  const navigateToGroup = (groupId) => {
    if (groupMember.value.role === "admin") {
      router.push(`/group/own/${groupId}`);
    } else if (groupMember.value.role === "member") {
      router.push(`/group/your/${groupId}`);
    }
  };
</script>

<template>
  <div
    class="transition-all hover:cursor-pointer hover:scale-105 duration-700 border text-card-foreground shadow-sm bg-[#E8E8E8] rounded-3xl overflow-hidden relative group w-96 max-w-96 min-w-80"
    data-v0-t="card"
  >
    <img
      :alt="groups.name"
      class="p-5 rounded-3xl w-full h-52 object-cover"
      :src="groups.imgURL"
    />
    <div class="p-4">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold">{{ groups.name }}</h3>
        <button
          @click="navigateToGroup(groups.id)"
          class="inline-flex items-center text-lg h-14 w-14 p-4 justify-between rounded-full bg-white hover:bg-gray-300 text-gray-500 transition-all duration-300 opacity-0 group-hover:opacity-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class=""
          >
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </button>
      </div>
      <p class="text-sm text-gray-500">{{ authorName }}</p>
    </div>
  </div>
</template>

<style>
  /* Puedes agregar estilos personalizados aquí si es necesario */
</style>
