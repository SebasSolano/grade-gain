<script setup>
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "vue-router";
import { ref } from "vue";

const auth = getAuth();
const router = useRouter();
const username = ref("Undefined-User")
const medals = ref(0)

const handleSignOut = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      signOut(auth).then(() => {
        router.push("/sing-in");
      });
    } else {
      alert("Como te vas a desloguear si no estas logueado weba");
    }
  });
};
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
              class="relative w-40 h-40 ml-5 rounded-full overflow-hidden bg-gray-300"
            >
              <img src="" alt="Perfil" class="w-36 h-36 object-cover" />
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

    <div class="bg-[#F5F5F5] rounded-2xl flex-1">
      <ul>
        <li class="ml-10">
          <div class="flex gap-4 items-center py-3">
            <span>@</span>
            <router-link
              class="hover:text-[#595959] text-[2rem] transition duration-300"
              to="/"
            >
              HOME
            </router-link>
          </div>
          <div class="flex gap-4 items-center py-3">
            <span>@</span>
            <router-link
              class="hover:text-[#595959] text-[2rem] transition duration-300"
              to="/"
            >
              TOP
            </router-link>
          </div>
          <div class="flex gap-4 items-center py-3">
            <span>@</span>
            <router-link
              class="hover:text-[#595959] text-[2rem] transition duration-300"
              to="/"
            >
              SUBSCRIPTION
            </router-link>
          </div>
          <div class="flex gap-4 items-center py-3">
            <span>@</span>
            <router-link
              class="hover:text-[#595959] text-[2rem] transition duration-300"
              to="/"
            >
              SUPPORT
            </router-link>
          </div>
          <div class="flex gap-4 items-center py-3">
            <span>@</span>
            <button
              @click="handleSignOut"
              class="hover:text-[#595959] text-[2rem] transition duration-300"
            >
              LOGOUT
            </button>
          </div>
        </li>
        <div class="text-[3rem] flex items-center font-bold justify-center">
          Grade <span class="text-[#57FE1E]">Gain</span>
        </div>
      </ul>
    </div>
  </nav>
</template>
<style></style>
