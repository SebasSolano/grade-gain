import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const searchGroups = async (queryText) => {
  if (queryText.trim() === "") {
    return [];
  }

  const lowerCaseQueryText = queryText.toLowerCase();
  const groupsCol = collection(db, "groups");
  const q = query(groupsCol, where("name_lowercase", ">=", lowerCaseQueryText), where("name_lowercase", "<=", lowerCaseQueryText + "\uf8ff"));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export { searchGroups };
