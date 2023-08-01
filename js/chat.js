import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
import { set, get, getDatabase, query, ref, update, orderByChild, equalTo, onValue } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";


if (isMobile) {
    cssRoot.style.setProperty("--cursor", "auto");
}

const inputDiv = ID("input-div");
const msgLvl = ID("msg-lvl")
const scrollChatWrap = Q("#scroll-chat .wrap")
const scrollChat = ID("scroll-chat")
const messagesLisr = ID("messages-")
const sendMsg = ID("send-msg")


let inputlabel = true;
let maxScroll = 0;

inputDiv.on("keyup", () => {
    let val = inputDiv.innerText;
    if (!val.length) {
        inputlabel = false;
        msgLvl.classList.add("active");
    } else {
        inputlabel = true;
        msgLvl.classList.remove("active");
    }
})
let you, nm;

(async () => {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const auth = getAuth();
    const db = getDatabase();


    const dbRefInfo = ref(db, `users_data/info/${userId}`);
    const dbRefStatus = ref(db, `users_data/status/${userId}`);
    const dbRefFriends = ref(db, `users_data/friends/${userId}`);
    const dbRefImage = ref(db, `users_data/image/${userId}`);
    const dbRefChats = ref(db, `users_data/chats/${userId}`);


    function setupFriends() {
        const object = data && data.friends ? data.friends : {};
        const friendsLen = Object.keys(object).length;
        if (friendsLen < 1) return;

        let str = "";
        for (let i = 0; i < friendsLen; i++) {
            str += `
            <div class="contact-box">
               <div class="wrap">
                  <div class="contact-icon">
                     <span>
                        <i class="sbi-user"></i>
                        <img src="" class="contect-img" alt="friend image">
                     </span>
                  </div>
                  <div class="contact-datas">
                     <div class="contact-name-time">
                        <div class="contact-name">Contact Name</div>
                        <div class="last-chat-time">00:00</div>
                     </div>
                     <div class="last-chat-no-of-msg">
                        <div class="last-chat">Last Chat</div>
                        <div class="no-of-msg"><p>100</p></div>
                     </div>
                  </div>
               </div>
            </div>
          `;
        }
        wrapContacts.innerHTML = str;


        // sorted by last message user z
        const sortedFriends = sortObjectByUserId(data.friends);
        const iconEle = document.querySelectorAll(".contact-icon");
        const image = document.querySelectorAll(".contect-img");
        const name = document.querySelectorAll(".contact-name");
        const lastChatTime = document.querySelectorAll(".last-chat-time");
        const lastChat = document.querySelectorAll(".last-chat");
        const noOfMsgEle = document.querySelectorAll(".no-of-msg");
        const noOfMsg = document.querySelectorAll(".no-of-msg p");

        sortedFriends.forEach((friend, i) => {
            
            if (friend.image && friend.image.low) {
                iconEle[i].classList.add("active");
                image[i].src = friend.image.lwo;
            }

            name[i].innerText = friend.name ? friend.name : "Guest";
            lastChatTime[i].innerText = formatTime(friend.rank);
            lastChat[i].innerText = friend.message;

            if (!friend.visited) {
                noOfMsg[i].innerText = friend.count;
                noOfMsgEle[i].classList.add("active");
            }
        })
    }

    setupFriends();







    function getMessages({ message, time, senderId, type, name }) {
        you = senderId == myDtls.id
        // nm = you ? (type == "one" ? "" : "You") : name;

        // <div class="chat-box ${you ? "me" : "other"}">

        return `
            <div class="chat-box me">
                <div class="chat-content">
                    <div class="wrap">
                        <div class="c-text">${message}
                        <p class="c-time" data-time="${time}"></p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }




    function setMessages() {
        scrollChatWrap.innerHTML = "";
        let str = ``;

        messages.forEach((e) => {
            str += getMessages(e);
        })
        scrollChatWrap.innerHTML = str;

        // update scroll
        maxScroll = scrollChat.scrollHeight - scrollChat.clientHeight;
        scrollChat.scrollTop = maxScroll;
    }
    setMessages();

    sendMsg.on(() => {
        console.log(inputDiv.innerText);
        const message = messageModify(inputDiv.innerText);
        console.log(message);

        if (!message.length) {
            return;
        } else {
            messages.push({
                type: "one",
                message: message,
                time: getChatDate().time,
                id: Date.now() + "msgId",
                senderId: myDtls.id,
                name: myDtls.name,
            })
            setMessages();
            inputDiv.innerHTML = "";
        }
    })

    // ------- end of the chat set ------
    maxScroll = scrollChat.scrollHeight - scrollChat.clientHeight;
    scrollChat.scrollTop = maxScroll;


})();