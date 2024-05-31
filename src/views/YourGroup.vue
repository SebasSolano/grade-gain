<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const id = ref(null);
const route = useRoute();

onMounted(() => {
  id.value = route.params.id;
});
</script>
<template>Grupo: {{ id }}</template>
<style></style>