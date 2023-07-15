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

   guestBtn.addEventListener('click', async () => {
      const oldGuestId = getCookie("liveChatGuestId");
      let newGuest = null;

      // when no guest account exist then create a new one
      if (!oldGuestId) {
         newGuest = getGuestId();
         setCookie("liveChatGuestId", newGuest.id, 30);
      }

      // database reference
      const dbRef = ref(db, `users_data/info/${oldGuestId || newGuest.id}`);

      
      if (!oldGuestId) { // create new guest
         await set(dbRef, {
            userId: newGuest.id,
            date: newGuest.date,
            friends: 0
         }).then(() => {
            console.log("Data sended successfully");
            location.replace("./html/home.html");
         }).catch((error) => {
            alert(error.message);
         });

      } else { // continue old guest
         await get(dbRef).then((snapshot) => {
            if (snapshot.exists()) {
               location.replace("./html/home.html");
            } else {
               console.log("No data available");
            }
         }).catch((error) => {
            alert(error.message);
         });

      }

   })
}