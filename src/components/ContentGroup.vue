<script setup>
  import ContentBar from "./ContentBar.vue";
  import { ref, onMounted } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import {
    getGroupById,
    getGroupMembersByRole,
    getTopMembersByPoints,
    getGroupMemberById,
    updateDataSettings,
    addShopToGroup,
    getStoreItems,
    getUserGroupFiles,
    getTopMembersAndUpdateMedals,
    deleteGroup
  } from "../services/group.service";
  import Loading from "../components/Loading.vue";
  import viewMember from "../components/viewMember.vue";
  import { getSubscriptionInfo } from "../services/subscription.service";
  import { Timestamp } from "firebase/firestore";
  import viewTop from "../components/viewTop.vue";
  import viewStore from "../components/viewStore.vue";
  import viewUploadNote from "../components/viewUploadNote.vue";
  import ViewCheckNote from "./viewCheckNote.vue";
  import Alert from "./Alert.vue";

  const uuid = ref(localStorage.getItem("uuid"));

  const route = useRoute();
  const router = useRouter();
  const groupId = ref(null);

  const group = ref(null);
  const sortedMembers = ref([]);
  const topMembers = ref([]);
  const itemsStore = ref([]);
  const filesNotes = ref([]);
  const role = ref([]);
  const formattedDate = ref(null);
  const subscriptionInfo = ref(null);

  const loading = ref(true);
  const errMsg = ref("");
  const alert = ref("");

  // Data Group
  const joined_members = ref(0);
  const name = ref(null);

  //Views
  const showMembers = ref(true);
  const showTop = ref(false);
  const showStore = ref(false);
  const showSettings = ref(false);
  const showPopup = ref(false);
  const showUploadNote = ref(false);
  const showCheckNote = ref(false);

  //Settings
  const maxMembers = ref(0);
  const maxNote = ref(0);
  const minNote = ref(0);
  const percentile = ref(0);

  //add item store
  const pricePoints = ref(0);
  const extraNotes = ref(0);

  onMounted(async () => {
    groupId.value = route.params.id;
    try {
      let adminSubscriptionId = null;

      role.value = await getGroupMemberById(groupId.value, uuid.value);
      //console.log(role.value);
      group.value = await getGroupById(groupId.value);
      maxMembers.value = group.value.settings.maxMembers;
      maxNote.value = group.value.settings.maxNote;
      minNote.value = group.value.settings.minNote;
      percentile.value = group.value.settings.percentile;
      joined_members.value = group.value.joined_members;
      name.value = group.value.name;
      sortedMembers.value = await getGroupMembersByRole(groupId.value);
      sortedMembers.value.forEach((member) => {
        if (member.role === "admin") {
          adminSubscriptionId = member.userInfo.id_subscription;
          //console.log("Admin Subscription ID:", adminSubscriptionId);
        }
      });
      subscriptionInfo.value = await getSubscriptionInfo(adminSubscriptionId);
      itemsStore.value = await getStoreItems(groupId.value);
      //console.log(itemsStore.value);
      filesNotes.value = await getUserGroupFiles(groupId.value, uuid.value);
      //console.log(filesNotes.value);
      topMembers.value = await getTopMembersByPoints(groupId.value);
      const finishedDate = new Date(group.value.finished.toDate());
      formattedDate.value = `${finishedDate.getDate()}-${
        finishedDate.getMonth() + 1
      }-${finishedDate.getFullYear()}`;
      //console.log(group.value.items_store);
      //console.log(subscriptionInfo.value.maxItemShop);
      //console.log(topMembers.value);
    } catch (error) {
      console.error("Error loading group details or members:", error);
      router.push("/");
    } finally {
      loading.value = false;
    }
  });

  const viewMembers = () => {
    showMembers.value = true;
    showStore.value = false;
    showTop.value = false;
    showUploadNote.value = false;
    showCheckNote.value = false;
  };

  const viewTops = () => {
    showTop.value = true;
    showMembers.value = false;
    showStore.value = false;
    showUploadNote.value = false;
    showCheckNote.value = false;
  };

  const viewStores = () => {
    showStore.value = true;
    showTop.value = false;
    showMembers.value = false;
    showUploadNote.value = false;
    showCheckNote.value = false;
  };

  const viewUploads = () => {
    showStore.value = false;
    showTop.value = false;
    showMembers.value = false;
    showUploadNote.value = true;
    showCheckNote.value = false;
  };

  const viewChecks = () => {
    showStore.value = false;
    showTop.value = false;
    showMembers.value = false;
    showUploadNote.value = false;
    showCheckNote.value = true;
  };
  const toggleSettings = () => {
    showSettings.value = !showSettings.value;
  };

  const copyPromptToClipboard = (value) => {
    let newGroupId = value.toString();
    navigator.clipboard
      .writeText(value)
      .then(() => {
        console.log("Prompt copied to clipboard!");
        groupId.value = "COPIED ✔️";
        setTimeout(() => {
          groupId.value = newGroupId;
        }, 1000);
      })
      .catch((err) => {
        console.error("Could not copy prompt: ", err);
      });
  };

  const saveConfigGroup = async () => {
    if (maxMembers.value > group.value.joined_members) {
      if (
        maxMembers.value > 0 &&
        maxMembers.value <= group.value.settings.maxMembers
      ) {
        if (maxNote.value > 0) {
          if (minNote.value > 0) {
            if (percentile.value >= 0 && percentile.value <= 1) {
              try {
                await updateDataSettings(groupId.value, {
                  settings: {
                    maxMembers: maxMembers.value,
                    maxNote: maxNote.value,
                    minNote: minNote.value,
                    percentile: percentile.value,
                  },
                  updateAt: Timestamp.now(),
                });
              } catch (error) {
                (errMsg.value = "Error updating"), error;
              } finally {
                errMsg.value = "Group updated successfully";
                setTimeout(() => {
                  errMsg.value = "";
                  router.go();
                }, 2000);
              }
            } else {
              errMsg.value =
                "You must enter a number greater than or equal to 0 and less than or equal to 1.";
            }
          } else {
            errMsg.value = "You must enter a number greater than 0.";
          }
        } else {
          errMsg.value = "You must enter a number greater than 0.";
        }
      } else {
        errMsg.value = `You have a ${subscriptionInfo.value.type} subscription with a maximum of ${subscriptionInfo.value.maxMembers} members, please enter an appropriate value!`;
      }
    } else {
      errMsg.value = `You cannot set that limit because you have: ${group.value.joined_members} members.`;
    }
  };

  const showAddItem = () => {
    showPopup.value = !showPopup.value;
  };

  const handleCreateItem = async () => {
    if (group.value.items_store < subscriptionInfo.value.maxItemShop) {
      if (pricePoints.value > 0 && extraNotes.value > 0) {
        try {
          await addShopToGroup(
            groupId.value,
            extraNotes.value,
            pricePoints.value
          );
          await updateDataSettings(groupId.value, {
            items_store: group.value.items_store + 1,
            updateAt: Timestamp.now(),
          });
        } catch (error) {
          errMsg.value = "Error adding an item to the store " + error.message;
        } finally {
          errMsg.value = "Item added successfully";
          setTimeout(() => {
            errMsg.value = "";
            showPopup.value = !showPopup.value;
            router.go();
          }, 2000);
        }
      } else {
        errMsg.value = "You must add a value greater than 0";
      }
    } else {
      errMsg.value = `You have reached the limit of adding an item to the store with a maximum of: ${subscriptionInfo.value.maxItemShop} `;
    }
  };

  const finishedNote = async () => {
    try {
      await getTopMembersAndUpdateMedals(groupId.value);
      await deleteGroup(groupId.value)
    } catch (error) {
      alert.value = "Error";
      errMsg.value = error;
      setTimeout(() => {
        alert.value = "";
        errMsg.value = "";
      }, 2000);
    } finally {
      alert.value = "Success";
      errMsg.value = "The group has been successfully finished!";
      setTimeout(() => {
        alert.value = "";
        errMsg.value = "";
        router.push("/")
      }, 2000);
    }
  };
</script>
<template>
  <Loading v-if="loading" />
  <Alert v-if="alert && errMsg" :alert="alert" :text="errMsg" />
  <div
    v-if="showPopup"
    class="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-80 z-50"
  >
    <div class="bg-white rounded-lg p-8 w-96">
      <div class="flex justify-end">
        <button
          @click="showAddItem"
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

      <h2 class="text-2xl font-bold mb-4">Create a new item for the store</h2>

      <div class="mb-4">
        <label for="groupName" class="block text-xl font-medium mb-2"
          >Points price:</label
        >
        <div class="relative">
          <input
            type="number"
            v-model="pricePoints"
            class="mt-1 ml-2 block w-full h-10 rounded-full bg-[#E8E8E8] border-gray-300 shadow-sm pl-12 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
          <div class="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-medal"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#333333"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 4v3m-4 -3v6m8 -6v6" />
              <path
                d="M12 18.5l-3 1.5l.5 -3.5l-2 -2l3 -.5l1.5 -3l1.5 3l3 .5l-2 2l.5 3.5z"
              />
            </svg>

            <span class="text-gray-400 ml-1">|</span>
          </div>
        </div>
        <label for="groupName" class="block text-xl font-medium mb-2"
          >Extra note:</label
        >
        <div class="relative">
          <input
            type="number"
            v-model="extraNotes"
            class="mt-1 ml-2 block w-full h-10 rounded-full bg-[#E8E8E8] border-gray-300 shadow-sm pl-12 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
          <div class="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-notes"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#333333"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z"
              />
              <path d="M9 7l6 0" />
              <path d="M9 11l6 0" />
              <path d="M9 15l4 0" />
            </svg>

            <span class="text-gray-400 ml-1">|</span>
          </div>
        </div>
      </div>
      <p class="text-red-500 text-center p-5">{{ errMsg }}</p>
      <div class="flex justify-end">
        <button
          @click="handleCreateItem"
          class="text-lg bg-[#AEDB9F] hover:bg-[#76cc59] font-semibold px-4 py-2 rounded-2xl transition duration-300"
        >
          Add
        </button>
      </div>
    </div>
  </div>

  <main v-if="!loading" class="flex-1 p-8 bg-white rounded-xl mt-6 mr-3 mb-6">
    <ContentBar />
    <section class="mb-6">
      <div class="grid gap-6">
        <div class="flex items-center justify-between">
          <h2 v-if="role.role === 'admin'" class="text-3xl font-bold">
            Own Groups
          </h2>
          <h2 v-if="role.role === 'member'" class="text-3xl font-bold">
            Your Groups -
            <span class="text-green-200">{{ role.points }} </span> Points
          </h2>
          <div class="flex items-center space-x-2">
            <div>
              <span class="text-xl">{{ name }} - #</span>
              <span
                @click="copyPromptToClipboard(groupId)"
                class="text-gray-500 transition-all duration-500 hover:p-3 hover:cursor-pointer hover:bg-gray-100 hover:rounded-md hover:text-green-500"
              >
                {{ groupId }}</span
              >
            </div>
            <div v-if="role.role === 'admin'" class="relative">
              <button
                @click="toggleSettings"
                class="transition-all duration-1000 inline-flex items-center justify-center rounded-full text-sm font-medium border border-input p-2 hover:bg-gray-200"
              >
                <svg
                  v-if="showSettings"
                  xmlns="http://www.w3.org/2000/svg"
                  class="transition-all duration-1000 icon icon-tabler icon-tabler-settings-x"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="#595959"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path
                    d="M13.675 19.683c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.66 1.66 0 0 0 -.324 .114"
                  />
                  <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                  <path d="M22 22l-5 -5" />
                  <path d="M17 22l5 -5" />
                </svg>
                <svg
                  v-if="!showSettings"
                  xmlns="http://www.w3.org/2000/svg"
                  class="transition-all duration-1000 icon icon-tabler icon-tabler-settings"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="#595959"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path
                    d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"
                  />
                  <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                </svg>
              </button>
              <div
                v-if="showSettings"
                class="transition-all duration-1000 absolute right-0 mt-2 bg-white shadow-lg rounded-3xl p-6 w-96 max-w-md"
              >
                <h3 class="text-2xl font-bold mb-4">Group Configuration</h3>
                <div class="grid grid-cols-1 gap-0">
                  <div class="flex items-center justify-between pb-2">
                    <label class="text-gray-700">Maximum members:</label>
                    <input
                      type="number"
                      v-model="maxMembers"
                      class="ml-3 pl-3 h-10 w-14 text-md rounded-full bg-[#E8E8E8] border-gray-300 shadow-sm focus:border-gray-300 focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                    />
                  </div>
                  <div class="flex items-center justify-between pb-2">
                    <label class="text-gray-700">Maximum Grade:</label>
                    <input
                      type="number"
                      v-model="maxNote"
                      class="ml-3 pl-3 h-10 w-14 text-md rounded-full bg-[#E8E8E8] border-gray-300 shadow-sm focus:border-gray-300 focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                    />
                  </div>
                  <div class="flex items-center justify-between pb-2">
                    <label class="text-gray-700">Minimum Grade:</label>
                    <input
                      type="number"
                      v-model="minNote"
                      class="ml-3 pl-3 h-10 w-14 text-md rounded-full bg-[#E8E8E8] border-gray-300 shadow-sm focus:border-gray-300 focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                    />
                  </div>
                  <div class="flex items-center justify-between pb-2">
                    <label class="text-gray-700">Percentage (0-1):</label>
                    <input
                      type="number"
                      v-model="percentile"
                      class="ml-3 pl-3 h-10 w-14 text-md rounded-full bg-[#E8E8E8] border-gray-300 shadow-sm focus:border-gray-300 focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                    />
                  </div>
                  <div class="flex items-center justify-between pb-2">
                    <label class="text-gray-700"
                      >Time to finish the group:</label
                    >
                    <label class="text-red-500">{{ formattedDate }}</label>
                  </div>
                </div>
                <p class="text-red-500 text-center p-5">{{ errMsg }}</p>
                <div class="flex mt-10 items-center justify-end">
                  <button
                    @click="finishedNote"
                    class="transition duration-300 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full mr-2"
                  >
                    Finish group
                  </button>
                  <button
                    @click="saveConfigGroup"
                    class="bg-[#CAFAE1] text-md font-semibold px-4 py-2 rounded-full hover:bg-[#c1e8fc] transition duration-300"
                  >
                    Save information
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          data-orientation="horizontal"
          role="none"
          class="shrink-0 bg-gray-100 h-[1px] w-full border-t-[20px] rounded-full border-gray-200"
        ></div>
        <div class="flex items-center justify-between">
          <button
            @click="viewMembers"
            :class="{
              'bg-[#595959] text-white': showMembers,
              'bg-[#E8E8E8]': !showMembers,
            }"
            class="flex items-center whitespace-nowrap rounded-3xl text-2xl font-medium transition-all duration-300 hover:bg-[#595959] hover:text-white h-10 w-56 py-10 justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="mr-2"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Members
            <span class="ml-3 text-gray-400">{{ joined_members }}</span>
          </button>
          <button
            @click="viewTops"
            :class="{
              'bg-[#595959] text-white': showTop,
              'bg-[#E8E8E8]': !showTop,
            }"
            class="flex items-center whitespace-nowrap rounded-3xl text-2xl font-medium transition-all duration-300 hover:bg-[#595959] hover:text-white h-10 w-56 py-10 justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="mr-2"
            >
              <line x1="5" x2="19" y1="9" y2="9"></line>
              <line x1="5" x2="19" y1="15" y2="15"></line>
            </svg>
            TOP
          </button>
          <button
            @click="viewStores"
            :class="{
              'bg-[#595959] text-white': showStore,
              'bg-[#E8E8E8]': !showStore,
            }"
            class="flex items-center whitespace-nowrap rounded-3xl text-2xl font-medium transition-all duration-300 hover:bg-[#595959] hover:text-white h-10 w-56 py-10 justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="mr-2"
            >
              <path
                d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"
              ></path>
              <path d="M3 6h18"></path>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            STORE
          </button>
          <button
            v-if="role.role === 'member'"
            @click="viewUploads"
            :class="{
              'bg-[#595959] text-white': showUploadNote,
              'bg-[#E8E8E8]': !showUploadNote,
            }"
            class="flex items-center whitespace-nowrap rounded-3xl text-2xl font-medium transition-all duration-300 hover:bg-[#595959] hover:text-white h-10 w-56 py-10 justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="mr-2"
            >
              <path
                d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"
              ></path>
              <path d="M3 6h18"></path>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            UPLOAD NOTE
          </button>
          <button
            v-if="role.role === 'member'"
            @click="viewChecks"
            :class="{
              'bg-[#595959] text-white': showCheckNote,
              'bg-[#E8E8E8]': !showCheckNote,
            }"
            class="flex items-center whitespace-nowrap rounded-3xl text-2xl font-medium transition-all duration-300 hover:bg-[#595959] hover:text-white h-10 w-56 py-10 justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="mr-2"
            >
              <path
                d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"
              ></path>
              <path d="M3 6h18"></path>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            CHECK NOTE
          </button>
        </div>
        <div
          data-orientation="horizontal"
          role="none"
          class="shrink-0 bg-gray-100 h-[1px] w-full border-t-[20px] rounded-full border-gray-200"
        ></div>

        <div
          v-if="showMembers"
          class="border text-card-foreground shadow-sm bg-[#E8E8E8] rounded-2xl p-6"
          data-v0-t="card"
        >
          <div class="grid gap-4">
            <div
              v-for="member in sortedMembers"
              :key="member.id"
              class="grid grid-cols-3 gap-4 max-h-[700px] overflow-y-auto"
            >
              <viewMember :member="member" :role="role.role" />
            </div>
          </div>
        </div>
        <div
          v-if="showTop"
          class="border text-card-foreground shadow-sm bg-[#E8E8E8] rounded-2xl p-6"
          data-v0-t="card"
        >
          <div class="grid gap-4 justify-center">
            <div
              v-for="(member, index) in topMembers"
              :key="member.id"
              class="grid grid-cols-1 gap-4 max-h-[700px] overflow-y-auto"
            >
              <viewTop :member="member" :index="index" />
            </div>
          </div>
        </div>
        <div
          v-if="showStore"
          class="border text-card-foreground shadow-sm bg-[#E8E8E8] rounded-2xl p-6"
          data-v0-t="card"
        >
          <div
            class="grid grid-cols-3 gap-10 max-h-[700px] items-center justify-center p-5 overflow-y-auto"
          >
            <div
              v-for="(item, index) in itemsStore"
              :key="item.id"
              class="flex items-center justify-center"
            >
              <viewStore v-if="showStore" :item="item" :role="role.role" />
            </div>
            <div class="flex items-center justify-center">
              <button
                v-if="role.role === 'admin'"
                @click="showAddItem"
                class="flex items-center justify-center transition-all duration-700 bg-green-400 rounded-full w-28 h-28 shadow-md hover:shadow-xl hover:scale-105 hover:bg-green-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon icon-tabler icon-tabler-plus"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="#000000"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 5l0 14" />
                  <path d="M5 12l14 0" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div
          v-if="showUploadNote && role.role === 'member'"
          class="border text-card-foreground shadow-sm bg-[#E8E8E8] rounded-2xl p-6"
          data-v0-t="card"
        >
          <div
            class="grid grid-cols-2 gap-1 max-h-[700px] items-center justify-center p-10 overflow-y-auto"
          >
            <viewUploadNote />
          </div>
        </div>
        <div
          v-if="showCheckNote && role.role === 'member'"
          class="border text-card-foreground shadow-sm bg-[#E8E8E8] rounded-2xl p-6"
          data-v0-t="card"
        >
          <div
            class="grid grid-cols-4 gap-10 max-h-[700px] items-center justify-center p-5 overflow-y-auto"
          >
            <div
              v-for="(files, index) in filesNotes"
              :key="files.fileId"
              class="flex items-center justify-center"
            >
              <ViewCheckNote :files="files" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
<style></style>
