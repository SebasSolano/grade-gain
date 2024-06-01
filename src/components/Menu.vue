<script setup>
  import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
  import { useRouter } from "vue-router";
  import { ref, onMounted } from "vue";
  import { getUserInfo } from "../services/user.service";

  const auth = getAuth();
  const router = useRouter();
  const username = ref("");
  const medals = ref(0);
  const photoURL = ref("");
  const dataUser = ref([]);
  const userId = ref(localStorage.getItem("uuid"));

  const handleSignOut = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        signOut(auth).then(() => {
          localStorage.removeItem("uuid");
          router.go("/sing-in");
        });
      }
    });
  };

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      //console.log(user)
      username.value = user.displayName;
      photoURL.value = user.photoURL;
    }
  });

  onMounted(async () => {
    //console.log(userId.value)
    dataUser.value = await getUserInfo(userId.value);
    medals.value = dataUser.value.medals;
    console.log(dataUser.value)
  });
</script>
<template>
  <aside class="w-full md:w-96 p-6 rounded-2xl">
    <div
      class="bg-white flex flex-col md:flex-row items-center space-x-4 mb-5 rounded-lg p-5"
    >
      <span
        class="relative flex shrink-0 overflow-hidden rounded-full w-32 h-32"
      >
        <img :src="photoURL" class="aspect-square h-full w-full" />
      </span>

      <div class="flex flex-col items-center space-y-2">
        <div class="text-lg text-center">
          <div class="flex item-cente">
            <span>{{ username }}</span>

            <span
              v-if="dataUser.id_subscription === '8akRdUExYTUkk4akiAtY'"
              class="m-auto"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-discount-check-filled"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#00abfb"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"
                  stroke-width="0"
                  fill="currentColor"
                /></svg
            ></span>
          </div>

          <span
            v-if="dataUser.id_rol === 100"
            class="transition-all duration-300 bg-yellow-300 p-1 rounded-md text-gray-600 hover:cursor-pointer"
            >DEV</span
          >
          <span
            v-if="dataUser.id_rol === 101"
            class="bg-red-300 p-1 rounded-md text-gray-600 hover:cursor-pointer"
            >ADMIN</span
          >
          <span
            v-if="dataUser.id_rol === 102"
            class="bg-green-300 p-1 rounded-md text-gray-600 hover:cursor-pointer"
            >MOD</span
          >
        </div>
        <div class="flex items-center space-x-2 hover:underline">
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
            class=""
          >
            <path d="m12 14 4-4"></path>
            <path d="M3.34 19a10 10 0 1 1 17.32 0"></path>
          </svg>
          <router-link to="/settings">
            <span class="text-sm text-gray-500">Settings</span>
          </router-link>
        </div>
        <div class="flex items-center space-x-2 hover:cursor-pointer">
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
            <path d="M12 18v-2h-.5"></path>
          </svg>
          <span class="text-sm text-gray-500">{{ medals }} Medals</span>
        </div>
      </div>
    </div>
    <div class="space-y-20 bg-white rounded-lg p-5 pt-10">
      <router-link
        to="/"
        class="inline-flex items-center whitespace-nowrap hover:text-[#595959] text-[2rem] font-medium ring-offset-background transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 justify-start w-full text-left rounded-lg p-7"
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
          class="mr-4"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        HOME
      </router-link>
      <router-link
        to="/top"
        class="inline-flex items-center whitespace-nowrap hover:text-[#595959] text-[2rem] font-medium ring-offset-background transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 justify-start w-full text-left rounded-lg p-7"
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
          class="mr-4"
        >
          <line x1="5" x2="19" y1="9" y2="9"></line>
          <line x1="5" x2="19" y1="15" y2="15"></line>
        </svg>
        TOP
      </router-link>
      <button
        class="inline-flex items-center whitespace-nowrap hover:text-[#595959] text-[2rem] font-medium ring-offset-background transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 justify-start w-full text-left rounded-lg p-7"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="mr-4"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="#000000"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path
            d="M5 7.2a2.2 2.2 0 0 1 2.2 -2.2h1a2.2 2.2 0 0 0 1.55 -.64l.7 -.7a2.2 2.2 0 0 1 3.12 0l.7 .7c.412 .41 .97 .64 1.55 .64h1a2.2 2.2 0 0 1 2.2 2.2v1c0 .58 .23 1.138 .64 1.55l.7 .7a2.2 2.2 0 0 1 0 3.12l-.7 .7a2.2 2.2 0 0 0 -.64 1.55v1a2.2 2.2 0 0 1 -2.2 2.2h-1a2.2 2.2 0 0 0 -1.55 .64l-.7 .7a2.2 2.2 0 0 1 -3.12 0l-.7 -.7a2.2 2.2 0 0 0 -1.55 -.64h-1a2.2 2.2 0 0 1 -2.2 -2.2v-1a2.2 2.2 0 0 0 -.64 -1.55l-.7 -.7a2.2 2.2 0 0 1 0 -3.12l.7 -.7a2.2 2.2 0 0 0 .64 -1.55v-1"
          />
          <path d="M9 12l2 2l4 -4" />
        </svg>
        PLANS
      </button>
      <button
        class="inline-flex items-center whitespace-nowrap hover:text-[#595959] text-[2rem] font-medium ring-offset-background transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 justify-start w-full text-left rounded-lg p-7"
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
          class="mr-4"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="m4.93 4.93 4.24 4.24"></path>
          <path d="m14.83 9.17 4.24-4.24"></path>
          <path d="m14.83 14.83 4.24 4.24"></path>
          <path d="m9.17 14.83-4.24 4.24"></path>
          <circle cx="12" cy="12" r="4"></circle>
        </svg>
        SUPPORT
      </button>
      <button
        @click="handleSignOut"
        class="inline-flex items-center whitespace-nowrap hover:text-[#595959] text-[2rem] font-medium ring-offset-background transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 justify-start w-full text-left rounded-lg p-7"
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
          class="mr-4"
        >
          <path d="M5 12h14"></path>
          <path d="m12 5 7 7-7 7"></path>
        </svg>
        LOGOUT
      </button>
      <div class="pt-48 text-[3rem] font-bold flex justify-center">
        Grade <span class="text-[#57FE1E]">Gain</span>
      </div>
    </div>
  </aside>
</template>
<style></style>
