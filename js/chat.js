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
function getMessages({ message, time, senderId, type, name }) {
    you = senderId == myDtls.id
    nm = you ? (type == "one" ? "" : "You") : name;

    return `
    <div class="chat-box ${you ? "me" : "other"}">
        <div class="chat-content">
            <div class="wrap">
                <div class="c-name">${nm}</div>
                <div class="c-text">${message}</div>
                <div class="c-time">${time}</div>
            </div>
        </div>
    </div>
    `
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


