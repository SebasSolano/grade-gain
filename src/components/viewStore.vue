<script setup>
  import { useRoute, useRouter } from "vue-router";
  import {
    deleteStoreItem,
    getGroupById,
    getGroupMemberById,
    updateGroupMemberById,
    updateGroup
  } from "../services/group.service";
  import { getUserInfo } from "../services/user.service";
  import jsPDF from "jspdf";
  import { ref, onMounted } from "vue";
  import Alert from "./Alert.vue";

  const props = defineProps({
    item: {
      type: Object,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  });

  const route = useRoute();
  const router = useRouter();
  const uuid = ref(localStorage.getItem("uuid"));
  const groupInfo = ref([]);
  const userInfo = ref([]);
  const userOwnerInfo = ref([]);
  const groupMember = ref([]);

  const msg = ref("");
  const alert = ref("");

  onMounted(async () => {
    try {
      groupInfo.value = await getGroupById(route.params.id);
      console.log(groupInfo.value);
      userInfo.value = await getUserInfo(uuid.value);
      //console.log(userInfo.value);
      userOwnerInfo.value = await getUserInfo(groupInfo.value.owner);
      console.log(userOwnerInfo.value);
      groupMember.value = await getGroupMemberById(
        groupInfo.value.code,
        uuid.value
      );
      console.log(groupMember.value)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });
  const generateCertificate = async () => {
    if (groupMember.value.points >= props.item.price) {
      try {
        // Obtener datos necesarios
        await updateGroupMemberById(
          groupMember.value.id,
          groupInfo.value.code,
          {
            points: groupMember.value.points - props.item.price,
          }
        );
        // Create a new PDF document
        const doc = new jsPDF();

        // PDF decoration
        doc.setFillColor("#E8E8E8");
        doc.rect(0, 0, 210, 297, "F");

        // Header
        doc.setFontSize(26);
        doc.setTextColor("#000000");
        doc.text("Purchase Certificate", 105, 30, null, null, "center");
        doc.setFillColor("#AEDB9F");
        doc.rect(15, 40, 180, 0.5, "F");

        // Page Title
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.setTextColor("#000000");
        doc.text("Grade", 85, 50);
        doc.setTextColor("#57FE1E");
        doc.text("Gain", 108, 50);

        doc.setFillColor("#AEDB9F");
        doc.rect(15, 70, 180, 0.5, "F");

        // Certificate Information
        doc.setFontSize(16);
        doc.setTextColor("#595959");
        doc.text(`Group ID: ${route.params.id}`, 20, 80);
        doc.text(
          `Group Owner Name: ${userOwnerInfo.value.displayName}`,
          20,
          90
        );
        doc.text(`User Name: ${userInfo.value.displayName}`, 20, 100);
        doc.text(`Purchased Note: ${props.item.extra_note}`, 20, 110);

        // Additional information to validate the certificate
        doc.setFontSize(12);
        doc.setTextColor("#000000");
        doc.text(
          "This certificate is used to validate the purchase of an extra note:",
          20,
          130
        );
        doc.setTextColor("#595959");
        doc.text(`Issuance Date: ${new Date().toLocaleDateString()}`, 20, 140);
        doc.text(`Certificate ID: ${new Date().getTime()}`, 20, 150);

        doc.setFillColor("#AEDB9F");
        doc.rect(15, 170, 180, 0.5, "F");

        // Save the PDF
        doc.save(`Certificate_${uuid.value}_${route.params.id}.pdf`);
      } catch (error) {
        alert.value = "Error";
        msg.value = error;
        setTimeout(() => {
          alert.value = "";
          msg.value = "";
        }, 2000);
      } finally {
        alert.value = "Success";
        msg.value = "Item purchased successfully!";
        setTimeout(() => {
          alert.value = "";
          msg.value = "";
        }, 2000);
      }
    } else {
      alert.value = "Error";
      msg.value = "You do not have enough money to purchase this item";
      setTimeout(() => {
        alert.value = "";
        msg.value = "";
      }, 2000);
    }
  };

  const deleteItem = async (groupId, itemId) => {
    try {
      await deleteStoreItem(groupId, itemId);
      await updateGroup(groupId, {
        items_store: groupInfo.value.items_store - 1
      })
    } catch (error) {
      console.error(error);
    } finally {
      router.go();
    }
  };
</script>

<template>
  <Alert v-if="alert && msg" :alert="alert" :text="msg" />
  <div
    class="bg-gray-100 p-4 rounded-lg flex flex-col justify-between items-center w-full sm:w-80 h-80 sm:h-80 max-h-full sm:max-h-80 max-w-full sm:max-w-80 shadow"
  >
    <div class="flex flex-col items-center space-y-4">
      <div class="text-3xl font-semibold">
        Points Cost: {{ props.item.price }}
      </div>
      <div class="text-5xl text-gray-500">↓</div>
      <div class="bg-[#FFF3CD] px-3 py-1 text-3xl rounded-full shadow-md">
        Extra note: {{ props.item.extra_note }}
      </div>
    </div>
    <button
      v-if="props.role === 'member'"
      @click="generateCertificate"
      class="bg-[#CAFAE1] text-md font-semibold px-4 py-2 rounded-full hover:bg-[#c1e8fc] transition duration-300 flex items-center mt-auto ml-auto"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="icon icon-tabler icon-tabler-receipt"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="#000000"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path
          d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16l-3 -2l-2 2l-2 -2l-2 2l-2 -2l-3 2m4 -14h6m-6 4h6m-2 4h2"
        />
      </svg>
      <span class="ml-1">Redeem</span>
    </button>
    <button
      v-if="props.role === 'admin'"
      @click="deleteItem(route.params.id, props.item.id)"
      class="bg-red-400 text-md font-semibold px-4 py-2 rounded-full hover:bg-red-500 transition duration-300 flex items-center mt-auto ml-auto"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="icon icon-tabler icon-tabler-trash-x"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="#000000"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M4 7h16" />
        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
        <path d="M10 12l4 4m0 -4l-4 4" />
      </svg>
      <span class="ml-1">Delete</span>
    </button>
  </div>
</template>

<style scoped>
  /* Tailwind CSS styles are applied directly in the template */
</style>
