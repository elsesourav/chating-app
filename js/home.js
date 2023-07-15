import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import {
   getAuth,
   signInWithEmailAndPassword,
   createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
import { set, get, getDatabase, query, ref, update, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";

const userId = getCookie("liveChatGuestId");
if (isMobile) cssRoot.style.setProperty("--cursor", "auto");

let info, friends;

window.onload = async () => {
   // Initialize Firebase
   const app = initializeApp(firebaseConfig);
   const analytics = getAnalytics(app);
   const auth = getAuth();
   const db = getDatabase();

   const dbRefInfo = ref(db, `users_data/info/${userId}`);
   const dbRefStatus = ref(db, `users_data/status/${userId}`);
   const dbRefFriends = ref(db, `users_data/friends/${userId}`);

   // await get(dbRefInfo).then((snapshot) => {
   //    if (snapshot.exists()) {
   //       info = snapshot.val();
   //    } else {
   //       location.reload();
   //    }
   // })
   // await get(dbRefFriends).then((snapshot) => {
   //    if (snapshot.exists()) {
   //       friends = snapshot.val();
   //    } else if (info.friends == 0) {
   //       friends = null;
   //    } else {
   //       location.reload();
   //    }
   // })

   // console.log(info, friends);

   pageLoad.classList.remove("active");

   const toggleCancleNewBtn = ID("toggle-cancle-new-btn");
   const indexHeader = ID("index-header");
   const scrollBox = ID("scroll-box");
   const profileBack = ID("profile-back");
   const wrapContacts = ID("wrap-contacts");
   const profileBtn = ID("profile-btn");


   toggleCancleNewBtn.on(() => {
      indexHeader.classList.toggle("active");
   })

   // defualt chat open off
   let bodyMaxScroll = scrollBox.scrollHeight - scrollBox.clientHeight
   document.body.classList.remove("active")

   function setContacts() {
      wrapContacts.innerHTML = "";
      let str = "";
      myDtls.contacts.forEach((e, i) => {
         str += `
            <div class="contact-box">
               <div class="wrap">
                  <div class="contact-icon">
                     <span>
                        <i class="sbi-user"></i>
                        <img src="" class="contect-img" alt="contect image">
                     </span>
                  </div>
                  <div class="contact-datas">
                     <div class="contact-name-time">
                        <div class="contact-name">Contact Name</div>
                        <div class="last-chat-time">00:00</div>
                     </div>
                     <div class="last-chat-no-of-msg">
                        <div class="last-chat">Last Chat</div>
                        <div class="no-of-msg"><p>${Math.floor(Math.random() * 10) + 1}</p></div>
                     </div>
                  </div>
               </div>
            </div>
          `;
      })
      wrapContacts.innerHTML = str;
   }
   setContacts();

   const contactBox = $(".contact-box");
   contactBox.on((e) => {
      document.body.classList.add("active");
      bodyMaxScroll = scrollBox.scrollWidth - scrollBox.clientWidth;
      smoothScroll(scrollBox, "scrollLeft", bodyMaxScroll, 100);
   })

   profileBack.on(() => {
      smoothScroll(scrollBox, "scrollLeft", -bodyMaxScroll, 100);
   })

   profileBtn.addEventListener("click", () => {
      window.location.replace("profile.html")
   })
}
