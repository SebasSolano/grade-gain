<script setup>
  import { ref, onMounted } from "vue";
  import { expelMemberFromGroup, getUserGroupFiles } from "../services/group.service";
  import { useRoute, useRouter } from "vue-router";
  import Alert from "./Alert.vue";
  import ViewCheckNote from "./viewCheckNote.vue"
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

  const msg = ref("");
  const alert = ref("");

  const member = ref(null);
  const role = ref(null);
  const route = useRoute();
  const router = useRouter();
  const showPopup = ref(false);
  const filesNotes = ref([])

  onMounted(async() => {


    try {

      filesNotes.value = await getUserGroupFiles(route.params.id, props.member.userId);
      console.log(filesNotes.value)
      console.log(filesNotes.value)
      
    } catch (error) {
      console.error(error)
    }


    //console.log(props.groups);
    if (props.groups) {
      member.value = props.member;
      console.log(member.value);
      role.value = props.member.role;
    }
  });

  const deleteMember = async () => {
    console.log("entro 1");
    try {
      await expelMemberFromGroup(route.params.id, props.member.userId);
    } catch (error) {
      alert.value = "Error";
      msg.value = "" + error;
      setTimeout(() => {
        alert.value = "";
        msg.value = "";
      }, 2000);
    } finally {
      alert.value = "Success";
      msg.value = `The member has been expelled: ${props.member.userInfo.displayName} successfully!`;
      setTimeout(() => {
        alert.value = "";
        msg.value = "";
        router.go()
      }, 2000);
    }
  };

  const showEditCheck = () => {
    showPopup.value = !showPopup.value;
  };
</script>
<template>
  <Alert v-if="alert && msg" :alert="alert" :text="msg" />

  <div
    v-if="showPopup"
    class="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-80 z-50"
  >
    <div class="bg-white rounded-lg p-8 w-[70%]">
      <div class="flex justify-end">
        <button
          @click="showEditCheck"
          class="text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          <svg
            class="h-6 w-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>

      <h2 class="text-2xl font-bold mb-4">Validate members notes.</h2>
      <div
            class="grid grid-cols-3 gap-10 max-h-[700px] items-center justify-center p-5 overflow-y-auto"
          >
            <div
              v-for="(files, index) in filesNotes"
              :key="files.fileId"
              class="flex items-center justify-center"
            >
              <ViewCheckNote :files="files" :role="props.role" />
              
            </div>
          </div>
      

    </div>
  </div>

  <div class="flex items-center space-x-4 border border-white p-2 rounded-md">
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
        <div class="text-gray-500">{{ props.member.userInfo.email }}</div>
      </div>
      <div class="flex items-center space-x-2">
        <svg
          v-if="props.member.role === 'admin'"
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
        <button
          v-if="props.member.role === 'member' && props.role === 'admin'"
          @click="deleteMember"
          class="inline-flex items-center justify-center rounded-xl text-sm font-medium hover:bg-red-300 hover:text-accent-foreground h-10 w-10"
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
        </button>
        <button
          v-if="props.member.role === 'member' && props.role === 'admin'"
          @click="showEditCheck"
          class="inline-flex items-center justify-center rounded-xl text-sm font-medium hover:bg-yellow-300 hover:text-accent-foreground h-10 w-10"
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
