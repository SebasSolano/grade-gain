<script setup>
  import { deleteStoreItem } from "../services/group.service";
  import { useRoute, useRouter } from "vue-router";

  const props = defineProps({
    item: {
      type: Object,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  });

  const route = useRoute();
  const router = useRouter();

  const deleteItem = async (groupId, itemId) => {
    try {
        await deleteStoreItem(groupId, itemId)
    } catch (error) {
        console.error(error)
    }finally{
        router.go()
    }
  };
</script>
<template>
  <div
    class="bg-gray-100 p-4 rounded-lg flex flex-col justify-between items-center w-full sm:w-80 h-80 sm:h-80 max-h-full sm:max-h-80 max-w-full sm:max-w-80 shadow"
  >
    <div class="flex flex-col items-center space-y-4">
      <div class="text-3xl font-semibold">
        Points Cost: {{ props.item.price }}
      </div>
      <div class="text-5xl text-gray-500">↓</div>
      <div class="bg-[#FFF3CD] px-3 py-1 text-3xl rounded-full shadow-md">
        Extra note: {{ props.item.extra_note }}
      </div>
    </div>
    <button
      v-if="props.role === 'member'"
      class="bg-[#CAFAE1] text-md font-semibold px-4 py-2 rounded-full hover:bg-[#c1e8fc] transition duration-300 flex items-center mt-auto ml-auto"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="icon icon-tabler icon-tabler-receipt"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="#000000"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path
          d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16l-3 -2l-2 2l-2 -2l-2 2l-2 -2l-3 2m4 -14h6m-6 4h6m-2 4h2"
        />
      </svg>

      <span class="ml-1">Redeem</span>
    </button>
    <button
      v-if="props.role === 'admin'"
      @click="deleteItem(route.params.id, props.item.id)"
      class="bg-red-400 text-md font-semibold px-4 py-2 rounded-full hover:bg-red-500 transition duration-300 flex items-center mt-auto ml-auto"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="icon icon-tabler icon-tabler-trash-x"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="#000000"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M4 7h16" />
        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
        <path d="M10 12l4 4m0 -4l-4 4" />
      </svg>

      <span class="ml-1">Delete</span>
    </button>
  </div>
</template>

<style scoped></style>
