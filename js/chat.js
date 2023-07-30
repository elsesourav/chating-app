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
        
    }









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