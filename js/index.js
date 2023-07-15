
if (isMobile) {
    cssRoot.style.setProperty("--cursor", "auto");
}

const toggleCancleNewBtn = ID("toggle-cancle-new-btn");
const indexHeader = ID("index-header");
const scrollBox = ID("scroll-box");
const profileBack = ID("profile-back");
const wrapContacts = ID("wrap-contacts");


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
                    <i class="sbi-user-circle"></i>
                  </div>
                  <div class="contact-datas">
                    <div class="contact-name-time">
                      <div class="contact-name">Contact name</div>
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
