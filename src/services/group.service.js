import { db, storage } from "../firebase";

import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { getSubscriptionInfo } from "./subscription.service";
import { getUserInfo } from "./user.service";

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

    // Obtener detalles de la suscripción
    const subscriptionInfo = await getSubscriptionInfo(
      userInfo.id_subscription
    );
    if (!subscriptionInfo) throw new Error("Subscription not found");

    // Subir la imagen del grupo
    await uploadBytes(groupPictureRef, file);
    const groupPictureURL = await getDownloadURL(groupPictureRef);

    // Configurar datos del grupo
    const groupRef = doc(db, `groups/${code}`);
    const groupData = {
      name: name,
      code: code,
      owner: uuid,
      imgURL: groupPictureURL,
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

    console.log("The group has been created successfully!");
    return code;
  } catch (error) {
    console.error("Error creating a group: ", error);
  }
}

// Función para añadir un miembro a un grupo
async function addMemberToGroup(groupId, userId, rol) {
  const memberRef = doc(db, `groups/${groupId}/members/${userId}`);

  const memberData = {
    userId: userId,
    points: 0,
    rol: rol,
    joinedAt: Timestamp.now(),
  };

  await setDoc(memberRef, memberData);
  console.log("Miembro añadido al grupo con éxito:", groupId);
}

async function addShopToGroup(groupId) {
  const shopRef = doc(collection(db, `groups/${groupId}/store`));
  const shopData = {
    id: shopRef.id,
    extra_note: 0,
    price: 0,
    createdAt: Timestamp.now(),
  };

  await setDoc(shopRef, shopData);
  console.log("Miembro añadido al grupo con éxito:", shopRef.id);
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
