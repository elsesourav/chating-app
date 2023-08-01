import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
import { set, get, getDatabase, OnDisconnect, query, ref, child, update, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";


window.onload = () => {
   // Initialize Firebase
   const app = initializeApp(firebaseConfig);
   const analytics = getAnalytics(app);
   const auth = getAuth();
   const db = getDatabase();

   // setDataFromLocalStorage()
   pageLoad.classList.remove("active");

   // pointer events for mobile devices
   if (isMobile) {
      document.head.append(`<style>* { pointer-events: none; }</style>`)
   }

   guestBtn.addEventListener('click', async () => {
      const userId = getCookie("liveChatUserId");
      let newGuest = null;

      // when no guest account exist then create a new one
      if (!userId) {
         newGuest = getGuestId();
         setCookie("liveChatUserId", newGuest.id, 30);
      }
      try {
         // database reference
         const dbRefInfo = ref(db, `users/${userId || newGuest.id}`);

         const user = await get(dbRefInfo);

         if (!user.exists()) { // create new guest

            const datas = {
               info: {
                  id: newGuest.id,
                  creationDate: newGuest.date,
                  name: "",
                  aboue: "",
                  password: "",
                  online: false,
               },
               images: {
                  high: "",
                  low: ""
               },
               chats: {
                  receive: {},
                  seved: {}
               },
               friends: {}
            }

            await set(dbRefInfo, datas);

            date = datas;
            updateLocalStorage();

            console.log("Data sended successfully");
            location.replace("./html/home.html");

         } else { // continue old guest
            console.log("Continue with ols account");
            location.replace("./html/home.html");
         }
      } catch (error) {
         console.log(error);
      }
   });
}