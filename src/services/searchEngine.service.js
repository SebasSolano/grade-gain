import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";


const searchGroups = async (queryText) => {
    if (queryText.trim() === "") {
      return [];
    }
  
    const groupsCol = collection(db, "groups");
    const q = query(groupsCol, where("name", ">=", queryText), where("name", "<=", queryText + "\uf8ff"));
    const querySnapshot = await getDocs(q);
  
    return querySnapshot.docs.map(doc => doc.data());
  };

export {searchGroups}