<script setup>
  import { ref, onMounted } from "vue";

  const props = defineProps({
    member: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  });

  const getMemberClass = (index) => {
    if (index === 0) return "bg-yellow-300";
    if (index === 1) return "bg-stone-200";
    if (index === 2) return "bg-orange-400";
    return "";
  };
</script>
<template>
  <div class="flex items-center space-x-4">
    <span>{{ props.index + 1 }}. </span>
    <span class="relative flex shrink-0 overflow-hidden rounded-full w-12 h-12">
      <img
        class="aspect-square h-full w-full"
        alt="User profile"
        :src="props.member.photoURL"
      />
    </span>
    <div class="flex items-center justify-between w-full">
      <div>
        <div class="text-base font-semibold">
          {{ props.member.displayName }}
        </div>
      </div>

      <span :class="getMemberClass(props.index)" class="flex items-center gap-3 ml-5 rounded-md p-2"
        >{{ member.medals }}
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
          class="w-5 h-5 text-yellow-500"
        >
          <path
            d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"
          ></path>
          <path d="M11 12 5.12 2.2"></path>
          <path d="m13 12 5.88-9.8"></path>
          <path d="M8 7h8"></path>
          <circle cx="12" cy="17" r="5"></circle>
          <path d="M12 18v-2h-.5"></path></svg
      ></span>
    </div>
  </div>
</template>
<style></style>
