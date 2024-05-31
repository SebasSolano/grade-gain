import { db, storage } from "../firebase";

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  Timestamp,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { getSubscriptionInfo } from "./subscription.service";
import { getUserInfo, updateDataUser } from "./user.service";

function generateGroupCode() {
  return Math.random().toString(36).substring(2, 16).toUpperCase();
}

function getFutureDate() {
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + 4);
  return currentDate;
}

async function createGroup(uuid, name, file) {
  const code = generateGroupCode();
  const groupPictureRef = ref(storage, `groups/${code}/img/${code}.jpg`);

  try {
    // Obtener información del usuario
    const userInfo = await getUserInfo(uuid);
    if (!userInfo) throw new Error("User not found");

    console.log(userInfo.id_subscription);
    // Obtener detalles de la suscripción
    const subscriptionInfo = await getSubscriptionInfo(
      userInfo.id_subscription
    );
    if (!subscriptionInfo) throw new Error("Subscription not found");

    if (userInfo.groups_created >= subscriptionInfo.maxGroup)
      throw new Error("You cannot create more groups");

    // Subir la imagen del grupo
    await uploadBytes(groupPictureRef, file);
    const groupPictureURL = await getDownloadURL(groupPictureRef);

    // Configurar datos del grupo
    const groupRef = doc(db, `groups/${code}`);
    const groupData = {
      name: name,
      name_lowercase: name.toLowerCase(),
      owner: uuid,
      imgURL: groupPictureURL,
      joined_members: 0,
      items_store: 0,
      settings: {
        maxMembers: subscriptionInfo.maxMembers,
        maxItemShop: subscriptionInfo.maxItemShop,
        minNote: 0,
        maxNote: 0,
        percentile: 0,
      },
      finished: getFutureDate(),
      createdAt: Timestamp.now(),
      updateAt: Timestamp.now(),
    };

    // Crear documento del grupo en Firestore
    await setDoc(groupRef, groupData);

    // Añadir el dueño del grupo como miembro
    await addMemberToGroup(code, uuid, "admin");
    // Actualizar el contador de grupos creados por el usuario
    await updateDataUser(uuid, {
      groups_created: userInfo.groups_created + 1,
      updateAt: Timestamp.now(),
    });

    console.log("The group has been created successfully!");
    return code;
  } catch (error) {
    console.error("Error creating a group: ", error);
  }
}

// Función para añadir un miembro a un grupo
async function addMemberToGroup(groupId, userId, role) {
  const groupRef = doc(db, `groups/${groupId}`);
  const groupSnap = await getDoc(groupRef);

  if (!groupSnap.exists()) {
    throw new Error("Group not found");
  }

  const groupData = groupSnap.data();

  // Verificar si el usuario ya está en el grupo
  const memberRef = doc(db, `groups/${groupId}/members/${userId}`);
  const memberSnap = await getDoc(memberRef);

  if (memberSnap.exists()) {
    throw new Error("User is already a member of this group");
  }

  // Verificar el número máximo de miembros en el grupo
  if (groupData.joined_members <= groupData.settings.maxMembers) {
    throw new Error("Group has reached the maximum number of members");
  }

  // Obtener información del usuario
  const userInfo = await getUserInfo(userId);
  if (!userInfo) throw new Error("User not found");

  // Obtener detalles de la suscripción
  const subscriptionInfo = await getSubscriptionInfo(userInfo.id_subscription);
  if (!subscriptionInfo) throw new Error("Subscription not found");

  // Verificar el número máximo de grupos a los que puede unirse
  const userGroupsRef = collection(db, `users/${userId}/groups`);
  const userGroupsSnap = await getDocs(userGroupsRef);
  const userGroupsCount = userGroupsSnap.size;

  if (userGroupsCount >= subscriptionInfo.maxGroupJoin) {
    throw new Error(
      "User has reached the maximum number of groups they can join"
    );
  }

  // Añadir el miembro al grupo
  const newMemberData = {
    userId: userId,
    points: 0,
    total_points: 0,
    role: role,
    joinedAt: Timestamp.now(),
  };

  await setDoc(memberRef, newMemberData);
  console.log("Member added to group successfully:", groupId);

  // Actualizar el contador de miembros en el grupo
  await updateDoc(groupRef, {
    joined_members: groupData.joined_members + 1,
    updateAt: Timestamp.now(),
  });

  // Añadir referencia del grupo en el documento del usuario
  const userGroupRef = doc(db, `users/${userId}/groups/${groupId}`);
  await setDoc(userGroupRef, { joinedAt: Timestamp.now() });

  await updateDataUser(userInfo.uuid, {
    entered_groups: userInfo.entered_groups + 1,
    updateAt: Timestamp.now(),
  });

  console.log("Group reference added to user document:", userId);
}

async function addShopToGroup(groupId, extra_note, price) {
  const shopRef = doc(collection(db, `groups/${groupId}/store`));
  
  const shopData = {
    id: shopRef.id,
    extra_note: extra_note,
    price: price,
    createdAt: Timestamp.now(),
  }

  await setDoc(shopRef, shopData);
  console.log("Miembro añadido al grupo con éxito:", shopRef.id);
}

async function getStoreItems(groupId) {
  try {
    const storeItemsRef = collection(db, `groups/${groupId}/store`);
    const storeItemsSnap = await getDocs(storeItemsRef);

    const storeItems = storeItemsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log("Store items retrieved successfully:", storeItems);
    return storeItems;
  } catch (error) {
    console.error("Error retrieving store items:", error);
    throw error;
  }
}

async function deleteStoreItem(groupId, itemId) {
  try {
    const itemRef = doc(db, `groups/${groupId}/store`, itemId);
    await deleteDoc(itemRef);
    console.log("Item deleted successfully:", itemId);
  } catch (error) {
    console.error("Error deleting store item:", error);
    throw error;
  }
}

async function uploadGroupFile(uuid, groupId, file, note) {
  const groupFileRef = ref(
    storage,
    `groups/${groupId}/files/${uuid}/${file.name}`
  );
  await uploadBytes(groupFileRef, file);

  // Obtener la URL de descarga
  const fileURL = await getDownloadURL(groupFileRef);

  // Guardar información del archivo en Firestore
  const fileRef = doc(db, `groups/${groupId}/files/${uuid}/${file.name}`);
  const fileData = {
    userId: uuid,
    filename: file.name,
    url: fileURL,
    note: note,
    status: false,
    uploadedAt: Timestamp.now(),
  };

  await setDoc(fileRef, fileData);
  console.log("Archivo subido al grupo con éxito");
}

// Función para obtener los grupos de un usuario
async function getUserGroups(userId) {
  try {
    const userGroupsRef = collection(db, `users/${userId}/groups`);
    const createdGroupsRef = collection(db, "groups");

    // Consultar los grupos a los que está unido el usuario
    const userGroupsSnap = await getDocs(userGroupsRef);
    const joinedGroups = await Promise.all(
      userGroupsSnap.docs.map(async (docSnap) => {
        const groupId = docSnap.id;
        const groupDoc = await getDoc(doc(db, "groups", groupId));
        return { id: groupId, ...groupDoc.data() };
      })
    );
    console.log(joinedGroups);

    // Consultar los grupos creados por el usuario
    const createdGroupsQuery = query(
      createdGroupsRef,
      where("owner", "==", userId)
    );
    const createdGroupsSnap = await getDocs(createdGroupsQuery);
    const createdGroups = createdGroupsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      joinedGroups: joinedGroups,
      createdGroups: createdGroups,
    };
  } catch (error) {
    console.error("Error getting user groups:", error);
    return {
      joinedGroups: [],
      createdGroups: [],
    };
  }
}

// Función para obtener un miembro de un grupo por su ID
async function getGroupMemberById(groupId, memberId) {
  try {
    const groupMemberRef = doc(db, `groups/${groupId}/members/${memberId}`);
    const memberSnap = await getDoc(groupMemberRef);

    if (memberSnap.exists()) {
      return { id: memberId, ...memberSnap.data() };
    } else {
      console.log("Member not found in group:", memberId);
      return null;
    }
  } catch (error) {
    console.error("Error getting group member:", error);
    return null;
  }
}

// Función para obtener la información de un grupo por su ID
async function getGroupById(groupId) {
  // console.log(groupId);
  try {
    const groupRef = doc(db, `groups/${groupId}`);
    const groupSnap = await getDoc(groupRef);

    if (groupSnap.exists()) {
      return groupSnap.data();
    } else {
      console.log("Group not found:", groupId);
      return null;
    }
  } catch (error) {
    console.error("Error getting group:", error);
    return null;
  }
}

// Función para obtener todos los miembros de un grupo
async function getGroupMembers(groupId) {
  try {
    const membersRef = collection(db, `groups/${groupId}/members`);
    const membersSnap = await getDocs(membersRef);

    const members = membersSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return members;
  } catch (error) {
    console.error("Error getting group members:", error);
    return [];
  }
}

async function getGroupMembersByRole(groupId) {
  try {
    const membersRef = collection(db, `groups/${groupId}/members`);
    const membersSnap = await getDocs(membersRef);

    const members = membersSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Obtener información de los usuarios y organizarlos por rol
    const membersWithUserInfo = await Promise.all(
      members.map(async (member) => {
        const userInfo = await getUserInfo(member.userId);
        return { ...member, userInfo };
      })
    );

    // Organizar miembros por rol (admin primero)
    const sortedMembers = membersWithUserInfo.sort((a, b) =>
      a.role === "admin" ? -1 : 1
    );

    return sortedMembers;
  } catch (error) {
    console.error("Error getting group members by role:", error);
    return [];
  }
}

// Función para obtener los miembros con rol 'member' ordenados por puntos
async function getTopMembersByPoints(groupId) {
  try {
    const membersRef = collection(db, `groups/${groupId}/members`);
    const membersSnap = await getDocs(membersRef);

    const members = membersSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Obtener información de los usuarios y filtrar por rol 'member'
    const membersWithUserInfo = await Promise.all(
      members.map(async (member) => {
        const userInfo = await getUserInfo(member.userId);
        return { ...member, userInfo };
      })
    );

    // Filtrar solo los miembros con rol 'member' y ordenar por total_points
    const topMembers = membersWithUserInfo
      .filter((member) => member.role === "member")
      .sort((a, b) => b.total_points - a.total_points);

    return topMembers;
  } catch (error) {
    console.error("Error getting top members by points:", error);
    return [];
  }
}


async function updateDataSettings(groupId, data) {
  const groupRef = doc(db, `groups/${groupId}`);
  try {
    await updateDoc(groupRef, data);
    console.log("Settings information updated successfully");
  } catch (error) {
    console.error("Error updating settings information: ", error);
  }
}

export {
  createGroup,
  addMemberToGroup,
  uploadGroupFile,
  getUserGroups,
  getGroupMemberById,
  getGroupById,
  getGroupMembers,
  getGroupMembersByRole,
  getTopMembersByPoints,
  updateDataSettings,
  addShopToGroup,
  getStoreItems,
  deleteStoreItem
};
