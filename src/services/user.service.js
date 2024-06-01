import { db, storage } from "../firebase";

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  getDocs,
  collection,
  query,
  orderBy,
  limit
} from "firebase/firestore";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";

async function addDataUser(uuid, data) {
  try {
    const userData = doc(db, "users", uuid);
    await setDoc(userData, data);

    console.log("User added successfully with ID: ", uuid);
  } catch (err) {
    console.error("Error adding document: ", err);
  }
}

async function getUserInfo(userId) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    //console.log("User data:", userSnap.data());
    return userSnap.data();
  } else {
    console.log("No such document!");
    return null;
  }
}
async function updateDataUser(uuid, data) {
  const userRef = doc(db, "users", uuid);
  try {
    await updateDoc(userRef, data);
    console.log("User information updated successfully");
  } catch (error) {
    console.error("Error updating user information: ", error);
  }
}

// Función para subir la foto de perfil y actualizar la URL en Firestore
async function updateProfilePicture(uuid, file) {
  const profilePictureRef = ref(storage, `profilePictures/${uuid}.jpg`);
  try {
    await uploadBytes(profilePictureRef, file);
    const profilePictureURL = await getDownloadURL(profilePictureRef);

    // Actualizar la URL de la foto de perfil en Firestore
    const userRef = doc(db, "users", uuid);
    await updateDoc(userRef, { photoURL: profilePictureURL });
    console.log("Profile picture updated successfully");
  } catch (error) {
    console.error("Error updating profile picture: ", error);
  }
}

async function getTopUsersByMedals(limitCount = 100) {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("medals", "desc"), limit(limitCount));
    const usersSnap = await getDocs(q);

    const topUsers = usersSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(topUsers)
    return topUsers;
  } catch (error) {
    console.error("Error retrieving top users by medals:", error);
    throw error;
  }
}

export {
  addDataUser,
  getUserInfo,
  updateDataUser,
  updateProfilePicture,
  getTopUsersByMedals,
};
