import { db, storage } from "../firebase";

import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";

async function getSubscriptionInfo(subscriptionId) {
  const subscriptionRef = doc(db, "subscription", subscriptionId);
  const subscriptionSnap = await getDoc(subscriptionRef);

  if (subscriptionSnap.exists()) {
    //console.log("Subscription data:", subscriptionSnap.data());
    return subscriptionSnap.data();
  } else {
    console.log("No such document!");
    return null;
  }
}

export { getSubscriptionInfo };
