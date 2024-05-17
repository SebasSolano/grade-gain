<script setup>
  import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
  import { useRouter } from "vue-router";
  import { ref } from "vue";

  const auth = getAuth();
  const router = useRouter();
  const username = ref("Undefined-User");
  const medals = ref(0);
  const photoURL = ref("");

  const handleSignOut = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        signOut(auth).then(() => {
          router.push("/sing-in");
        });
      }
    });
  };

  onAuthStateChanged(auth, (user) => {
    if (user) {
      username.value = user.displayName || "Undefined-User";
      photoURL.value = user.photoURL || "";
    }
  });
</script>
<template>
  <nav class="flex flex-col flex-1 gap-3 pl-4 pt-3 py-4">
    <div class="bg-[#F5F5F5] rounded-2xl pt-5 py-5">
      <ul>
        <li>
          <div
            class="flex gap-4 items-center py-3 px-5 font-medium transition duration-300"
          >
            <div
              class="relative w-44 h-36 ml-5 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center"
            >
              <img
                :src="photoURL"
                alt="Perfil"
                class="w-28 h-28 object-cover"
              />
            </div>
            <div class="flex flex-col ml-8">
              <span class="text-base font-bold text-center">{{
                username
              }}</span>
              <a href="/" class="text-xs pt-5">Settings</a>
              <span class="text-xs pt-3">{{ medals }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div class="bg-[#F5F5F5] rounded-2xl flex-1 ">
      <ul class="">
        <li class="ml-10">
          <div class="flex gap-4 items-center py-7 ">
            <span><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-home" width="32" height="32" viewBox="0 0 24 24" stroke-width="1.5" stroke="#333333" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
  <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
  <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
</svg></span>
            <router-link
              class="hover:text-[#595959] text-[2rem] transition duration-300"
              to="/"
            >
              HOME
            </router-link>
          </div>
          <div class="flex gap-4 items-center py-7">
            <span><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-align-box-left-top" width="32" height="32" viewBox="0 0 24 24" stroke-width="1.5" stroke="#333333" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
  <path d="M9 13h-2" />
  <path d="M13 10h-6" />
  <path d="M11 7h-4" />
</svg></span>
            <router-link
              class="hover:text-[#595959] text-[2rem] transition duration-300"
              to="/"
            >
              TOP
            </router-link>
          </div>
          <div class="flex gap-4 items-center py-7">
            <span><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-discount-check" width="32" height="32" viewBox="0 0 24 24" stroke-width="1.5" stroke="#333333" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M5 7.2a2.2 2.2 0 0 1 2.2 -2.2h1a2.2 2.2 0 0 0 1.55 -.64l.7 -.7a2.2 2.2 0 0 1 3.12 0l.7 .7c.412 .41 .97 .64 1.55 .64h1a2.2 2.2 0 0 1 2.2 2.2v1c0 .58 .23 1.138 .64 1.55l.7 .7a2.2 2.2 0 0 1 0 3.12l-.7 .7a2.2 2.2 0 0 0 -.64 1.55v1a2.2 2.2 0 0 1 -2.2 2.2h-1a2.2 2.2 0 0 0 -1.55 .64l-.7 .7a2.2 2.2 0 0 1 -3.12 0l-.7 -.7a2.2 2.2 0 0 0 -1.55 -.64h-1a2.2 2.2 0 0 1 -2.2 -2.2v-1a2.2 2.2 0 0 0 -.64 -1.55l-.7 -.7a2.2 2.2 0 0 1 0 -3.12l.7 -.7a2.2 2.2 0 0 0 .64 -1.55v-1" />
  <path d="M9 12l2 2l4 -4" />
</svg></span>
            <router-link
              class="hover:text-[#595959] text-[2rem] transition duration-300"
              to="/"
            >
              SUBSCRIPTION
            </router-link>
          </div>
          <div class="flex gap-4 items-center py-6">
            <span><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-lifebuoy" width="32" height="32" viewBox="0 0 24 24" stroke-width="1.5" stroke="#333333" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
  <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  <path d="M15 15l3.35 3.35" />
  <path d="M9 15l-3.35 3.35" />
  <path d="M5.65 5.65l3.35 3.35" />
  <path d="M18.35 5.65l-3.35 3.35" />
</svg></span>
            <router-link
              class="hover:text-[#595959] text-[2rem] transition duration-300"
              to="/"
            >
              SUPPORT
            </router-link>
          </div>
          <div class="flex gap-4 items-center py-7">
            <span><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-logout" width="32" height="32" viewBox="0 0 24 24" stroke-width="1.5" stroke="#333333" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
  <path d="M9 12h12l-3 -3" />
  <path d="M18 15l3 -3" />
</svg></span>
            <button
              @click="handleSignOut"
              class="hover:text-[#595959] text-[2rem] transition duration-300"
            >
              LOGOUT
            </button>
          </div>
        </li>
        <div class="text-[3rem] flex items-center font-bold justify-center mt-20">
          Grade <span class="text-[#57FE1E]">Gain</span>
        </div>
      </ul>

    </div>
  </nav>
  
</template>
<style></style>
