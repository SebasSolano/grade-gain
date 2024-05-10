<template>

      <!-- Botón para mostrar el popup -->
    
  
      <!-- Popup -->
      <div v-if="showPopup" class="absolute top-0 right-0 m-10 bg-white shadow-lg rounded-lg p-4 border border-gray-200" style="width: 300px;">
        <!-- Mensaje del popup -->
        <div class="flex items-center justify-between">
          <p :class="{ 'text-green-500': isSuccess }">{{ popupMessage }}</p>
          <!-- Botón para cerrar el popup -->

        </div>
        <!-- Barra de progreso -->
        <div class="h-2 bg-gray-200 rounded-md mt-2">
          <div :style="{ width: progress + '%' }" :class="{'bg-green-500': isSuccess }" class="h-full rounded-md"></div>
        </div>
      </div>
 
  </template>

<script setup>
import { ref, watch } from 'vue';
import { defineProps } from 'vue';
import { useRouter } from "vue-router";

  const props = defineProps({
    info: Object,
  });

  // Estado del popup
  const showPopup = ref(false);
  const isSuccess = ref(false);
  const popupMessage = ref("");
  const progress = ref(0);
  const linkRoute = ref("");
  const router = useRouter();


  const closePopup = () => {
    if(isSuccess.value){
        router.push(linkRoute.value);
    }
    showPopup.value = false;
  }

  // Función para iniciar la cuenta regresiva para cerrar el popup
  const startCountdown = () => {
    let remainingTime = 1000; // 1 segundos en milisegundos
    const interval = setInterval(() => {
      remainingTime -= 100;
      progress.value = ((1000 - remainingTime) / 1000) * 100;
      if (remainingTime <= 0) {
        clearInterval(interval);
        closePopup();
      }
    }, 100);
  };

  watch(props.info, (newInfo) => {
    if (newInfo && newInfo.showPopup) {
    showPopup.value = true;
    isSuccess.value = newInfo.success;
    popupMessage.value = newInfo.message;
    linkRoute.value = newInfo.linkRoute
    startCountdown();
  } else {
    showPopup.value = false;
  }
}, { immediate: true, deep: true });


</script>

<style>
  /* Estilos adicionales para el popup */
</style>
