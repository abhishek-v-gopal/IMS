<template>
  <router-view></router-view>
</template>

<script>
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";

export default {
  name: 'App',
  data() {
    return {
      isLoggedIn: false,
      userName: "",
      userRole: "",
      userId: ""
    };
  },
  created() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.isLoggedIn = true;
        this.userName = user.displayName || "User";
        this.userId = user.uid;

        // Fetch user role from Firestore
        const userDoc = await import("firebase/firestore").then(({ doc, getDoc }) =>
          getDoc(doc(import("./firebase/config").db, "users", user.uid))
        );
        this.userRole = userDoc.exists() ? userDoc.data().role : "user";
      } else {
        this.isLoggedIn = false;
        this.userName = "";
        this.userRole = "";
        this.userId = "";
      }
    });
  },
};
</script>