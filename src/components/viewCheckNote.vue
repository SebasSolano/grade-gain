<script setup>
  import {
    getGroupById,
    updateGroupFileInfo,
    getUserGroupFiles,
    updateGroupMemberById,
    getGroupMemberById,
  } from "../services/group.service";
  import { useRoute, useRouter } from "vue-router";
  import { ref, onMounted } from "vue";

  const props = defineProps({
    files: {
      type: Object,
      required: true,
    },
    role: {
      type: String,
      required: false,
    },
  });

  const route = useRoute();
  const router = useRouter();
  const status = ref(false);
  const group = ref([]);
  const pointsFile = ref(0);



  onMounted(async () => {

    status.value = props.files.status;
  pointsFile.value = props.files.points;

    try {
      group.value = await getGroupById(route.params.id);
      console.log(group.value);
    } catch (error) {}
  });

  function calculatePoints(newNote, maxNote, minNote, percentile) {
    if (newNote > maxNote || newNote < minNote) {
      return 0;
    }
    const range = maxNote - minNote;
    const points = Math.round(((newNote - minNote) / range) * 100 * percentile);
    return points;
  }

  function calculatePoints2(newNote, maxNote, minNote, percentile) {
    if (newNote > maxNote || newNote < minNote) {
      return 0;
    }
    const range = maxNote - minNote;
    let points = Math.round(((newNote - minNote) / range) * 10 * percentile);

    if (newNote == maxNote) {
      points += 1;
    } else if (newNote == minNote) {
      points -= 1;
    }

    return points;
  }

  const changeNote = async () => {
    let points
    try {
      status.value = true;
      points = calculatePoints(
        props.files.note,
        group.value.settings.maxNote,
        group.value.settings.minNote,
        group.value.settings.percentile
      );
      console.log(points);
      await updateGroupFileInfo(
        props.files.uuid,
        route.params.id,
        props.files.id,
        {
          points: props.files.points + points,
          status: status.value,
        }
      );

      const member = await getGroupMemberById(
        route.params.id,
        props.files.uuid
      );

      await updateGroupMemberById(props.files.uuid, route.params.id, {
        points: member.points + points,
        total_points: member.total_points + points,
      });
    } catch (error) {
      console.log(error);
    } finally {

      pointsFile.value = points;
    }
  };
</script>
<template>
  <div
    class="bg-gray-100 p-4 rounded-lg flex flex-col justify-between items-center w-full sm:w-80 h-80 sm:h-80 max-h-full sm:max-h-80 max-w-full sm:max-w-80 shadow"
  >
    <div class="flex flex-col items-center space-y-4">
      <div class="text-3xl font-semibold">
        {{ props.files.title }}
      </div>
      <div class="px-3 py-1 text-xl rounded-lg">
        Note: {{ props.files.note }}
      </div>
      <div v-if="pointsFile > 0" class="px-3 py-1 text-xl rounded-lg">
        Points given: {{ pointsFile }}
      </div>
      <div
        class="flex items-center justify-center p-3 bg-yellow-200 rounded-md shadow-md text-xl"
        :class="{
          'bg-green-400': status && pointsFile > 0,
          'bg-red-400 text-3xl': !status && pointsFile > 0,
        }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon icon-tabler icon-tabler-check"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="#000000"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          v-if="status && pointsFile > 0"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M5 12l5 5l10 -10" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon icon-tabler icon-tabler-x"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="#000000"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          v-else-if="!status && pointsFile > 0"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        <span v-if="status && pointsFile > 0">Validated</span>
        <span v-else-if="!status && pointsFile > 0">Not Validated</span>
        <span v-else>Status: Pending</span>
      </div>
    </div>
    <div class="flex px-12 justify-between items-center">
      <label v-if="props.role === 'admin'" class="switch mr-20">
        <input @click="changeNote" type="checkbox" :checked="status" :disabled="status"/>
        <span class="slider round"></span>
      </label>

      <a
        :href="props.files.url"
        target="_blank"
        class="bg-[#AEDB9F] text-md font-semibold p-2 w-28 rounded-full hover:bg-[#9dec82] transition duration-300 flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon icon-tabler icon-tabler-eye"
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
          <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
          <path
            d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"
          />
        </svg>

        <span class="ml-1">View File</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
  /* The switch - the box around the slider */
  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }

  /* Hide default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  input:checked + .slider {
    background-color: rgb(33, 243, 180);
  }

  input:disabled + .slider {
    background-color: rgb(156, 156, 156);
  }

  input:focus + .slider {
    box-shadow: 0 0 1px rgb(33, 243, 180);
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
</style>
