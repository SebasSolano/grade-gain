<script setup>
  const props = defineProps({
    alert: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  });
</script>
<template>
  <div
    class="absolute z-0 top-10 right-10 p-5 m-4 text-xl rounded-lg bg-[#E8E8E8] "
    :class="props.alert === 'Success' ? 'text-green-800' : 'text-red-800'"
    role="alert"
  >
    <span class="font-medium">{{ props.alert }} alert!</span> {{ props.text }}
  </div>
</template>
<style></style>
