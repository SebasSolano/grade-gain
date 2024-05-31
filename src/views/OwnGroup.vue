<script setup>
  import { ref, onMounted } from "vue";
  import Menu from "../components/Menu.vue";
  import ContentOwnGroup from "../components/ContentOwnGroup.vue";
  import { useRouter, useRoute } from "vue-router";
  import { getGroupMemberById } from "../services/group.service";

  const route = useRoute();
  const groupId = ref(null);
  const error = ref(null);
  const router = useRouter();
  const uuid = ref(localStorage.getItem("uuid"));

  onMounted(async () => {
    groupId.value = route.params.id;
    try {
      const member = await getGroupMemberById(groupId.value, uuid.value);

      if (!member) {
        error.value = "You are not a member of this group.";
        router.push("/");
        return;
      }

      if (member.role === "member") {
        router.push(`/group/your/${groupId.value}`);
      }
    } catch (err) {
      error.value = "An error occurred while validating group membership.";
      console.error(err);
      router.push("/");
    }
  });
</script>
<template>
  <div class="min-h-screen bg-gray-100 flex flex-col md:flex-row">
    <Menu />
    <ContentOwnGroup />
  </div>
</template>
<style></style>
