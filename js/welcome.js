import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
import { set, get, getDatabase, query, ref, update, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";


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
      const oldGuestId = getCookie("liveChatUserId");
      let newGuest = null;

      // when no guest account exist then create a new one
      if (!oldGuestId) {
         newGuest = getGuestId();
         setCookie("liveChatUserId", newGuest.id, 30);
      }

      // database reference
      const dbRefInfo = ref(db, `users_data/info/${oldGuestId || newGuest.id}`);
      const dbRefStatus = ref(db, `users_data/status/${oldGuestId || newGuest.id}`);

      try {
         const user = await get(dbRefInfo);

         if (!user.exists()) { // create new guest
            await set(dbRefInfo, {
               userId: newGuest.id,
               date: newGuest.date,
               friends: 0
            }).then(async () => {
               await set(dbRefStatus, {
                  lastOnline: Date.now(),
                  lastProfileUpdated: null
               }).then(() => {
                  console.log("Data sended successfully");
                  location.replace("./html/home.html");
               })
            }).catch((error) => {
               alert(error.message);
            });

         } else { // continue old guest
            await set(dbRefStatus, {
               lastOnline: Date.now(),
               lastProfileUpdated: null
            }).then(() => {
               console.log("Data sended successfully");
               location.replace("./html/home.html");
            })
         }
      } catch (error) {
         console.log(error);
      }

   });
}