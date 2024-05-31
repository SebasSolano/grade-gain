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
        :src="props.member.userInfo.photoURL"
      />
    </span>
    <div class="flex items-center justify-between w-full">
      <div>
        <div class="text-base font-semibold">
          {{ props.member.userInfo.displayName }}
        </div>
      </div>

      <span :class="getMemberClass(props.index)" class="ml-5 rounded-md p-2">{{ props.member.total_points }} Points</span>
    </div>
  </div>
</template>
<style></style>
