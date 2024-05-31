<script setup>
  import { ref, onMounted } from "vue";
  // Props
  const props = defineProps({
    member: {
      type: Object,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  });

  const member = ref(null);
  const role = ref(null);

  onMounted(() => {
    //console.log(props.groups);
    if (props.groups) {
      member.value = props.member;
      console.log(member.value);
      role.value = props.member.role;
    }
  });
</script>
<template>
  <div class="flex items-center space-x-4">
    <span class="relative flex shrink-0 overflow-hidden rounded-full w-12 h-12">
      <img class="aspect-square h-full w-full" alt="User profile" :src="props.member.userInfo.photoURL" />
    </span>
    <div class="flex items-center justify-between w-full">
      <div>
        <div class="text-base font-semibold">{{ props.member.userInfo.displayName }}</div>
        <div class="text-gray-500">{{ props.member.userInfo.email }}</div>
      </div>
      <div class="flex items-center space-x-2">
        <svg v-if="props.member.role === 'admin'"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-green-500"
        >
          <path
            d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
          ></path>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
        <button v-if="props.member.role === 'member' && props.role === 'admin'"
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
        >
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
            class="h-4 w-4"
          >
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
          <span class="sr-only">Expulsar</span>
        </button>
        <button v-if="props.member.role === 'member' && props.role === 'admin'"
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
        >
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
            class="h-4 w-4"
          >
            <path d="M2 6h4"></path>
            <path d="M2 10h4"></path>
            <path d="M2 14h4"></path>
            <path d="M2 18h4"></path>
            <rect width="16" height="20" x="4" y="2" rx="2"></rect>
            <path d="M16 2v20"></path>
          </svg>
          <span class="sr-only">Ver nota</span>
        </button>
      </div>
    </div>
  </div>
</template>
<style></style>
