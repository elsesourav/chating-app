const USER = getCookie('liveChatUser');
if (!(USER && USER.id)) window.location.replace('../index.html');

const USER_ID = getCookie('liveChatUser').id;
let data = getDataFromLocalStorage('liveChatUserData');

// update local storage user data
document.addEventListener(
	'visibilitychange',
	() => {
		if (document.visibilityState == 'hidden') {
			setDataFromLocalStorage('liveChatUserData', data);
		}
	},
	false
);

// profile image url and size
const IMG_PIXEL = {high: 512, low: 64};
const IMAGE_URL = {high: '', low: ''};

// object filter
function objectFilter(object, tId) {
	let ary = [];

	for (const key in object) {
		if (key.search(tId) !== -1) {
			ary.push(object[key]);
		}
	}
	return ary;
}
function objectToArray(object) {
	let ary = [];
	for (const key in object) ary.push(object[key]);
	return ary;
}

// check is olrady my friend
function isMyFriend(object, tId) {
	for (const key in object) {
		if (key == tId) return true;
	}
	return false;
}

// sort object by user id
function sortObjectByUserId(object) {
	let ary = [];
	for (const key in object) {
		const obj = object[key];
		obj.id = key;
		ary.push(obj);
	}
	return ary.sort((a, b) => a.rank - b.rank);
}

// time conversion ms to hh:mm AM/PM
function formatTime(ms) {
	const d = new Date(ms);
	const h = d.getHours();
	const m = d.getMinutes();

	const AM_PM = h < 12 ? 'AM' : 'PM';

	return `${h % 12}:${m} ${AM_PM}`;
}

function setupFriends() {
	const fs = data && data.friends ? data.friends : {};
	const friendsLen = Object.keys(fs).length;
	if (friendsLen < 1) return;

	let str = '';
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


	const iconEle = document.querySelectorAll('.contact-icon');
	const image = document.querySelectorAll('.contect-img');
	const name = document.querySelectorAll('.contact-name');
	const lastChatTime = document.querySelectorAll('.last-chat-time');
	const lastChat = document.querySelectorAll('.last-chat');
	const noOfMsgEle = document.querySelectorAll('.no-of-msg');
	const noOfMsg = document.querySelectorAll('.no-of-msg p');

	sortedFriends.forEach((friend, i) => {
		if (friend.images.high && friend.images.low) {
			iconEle[i].classList.add('active');
			image[i].src = friend.images.low; 
		}

		name[i].innerText = friend.name ? friend.name : 'Guest';
		lastChatTime[i].innerText = formatTime(friend.lastChatTime);
		lastChat[i].innerText = friend.lastMessage;

		const len = getFriendReceiveMessageLength(friend.id);

		if (len > 0) {
			noOfMsg[i].innerText = len;
			noOfMsgEle[i].classList.add('active');
		}
	});
}
