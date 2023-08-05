import {getAnalytics} from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js';
import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js';
import {getAuth} from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js';
import {set, get, getDatabase, query, ref, update, orderByChild, equalTo, onValue, onChildChanged, onChildAdded} from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js';

// import { getDatabase, ref, onDisconnect } from "firebase/database";

// clear all local datas
// clearLocal();

window.onload = async () => {
	// Initialize Firebase
	const app = initializeApp(firebaseConfig);
	const analytics = getAnalytics(app);
	const auth = getAuth();
	const db = getDatabase();

	const dbRef = ref(db, `users/${USER_ID}`);

	if (!data) {
		try {
			data = (await get(dbRef)).val();
			setupFriends();
		} catch (e) {
			location.reload();
		}
	}


	pageLoad.classList.remove('active');

	setInterval(() => {
		try {
			update(dbRef, {
				onlineStatus: Date.now(),
			});
			console.log('update time');
		} catch (error) {
			console.log(error);
		}
	}, 60000);
	// Friends Update Changes Realtime

	// // Friends
	// onValue(dbRefFriends, (snapshot) => {
	//    data.friends = snapshot.val() || {};

	// });

	// // Info
	// onValue(dbRefInfo, (snapshot) => {
	//    data.info = snapshot.val();

	// });

	// // Images
	// onValue(dbRefImage, (snapshot) => {
	//    data.image = snapshot.val() || {};

	// });

	// // Status
	// onValue(dbRefStatus, (snapshot) => {
	//    data.status = snapshot.val() || {};

	// });

	// onChildAdded(dbRefChats, (snapshot) => {

	//    updateChildFafences();
	// });

	function setupChatChaild(key) {
		// Chat
		try {
			// const rf = ref(db, `users_data/chats/${USER_ID}/${key}`);
			// onChildChanged(rf, (snapshot) => {
			//    console.log(snapshot.val());
			//    data.chats[key][getOptimizeDate().full] = snapshot.val() || {};
			//    setupFriends();
			// });
		} catch (e) {
			console.log(e);
		}
	}


	/* -------------- default setup -------------- */
	// profile image 
	if (data) {
		if (data.images && (data.images.high || data.images.low)) {
			profileImg.src = data.images.high;
			profielImage.classList.add("active");
		}
		if (data.info) {
			nameInput.value = data.info.name;
			aboutInput.value = data.info.about;
		}
	}

	function updateChildFafences() {
		for (const key in data.friends) {
		}
	}
	updateChildFafences();

	// pointer events for mobile devices
	if (isMobile) {
		document.head.append(`<style>* { pointer-events: none; }</style>`);
	}

	const toggleCancleNewBtn = ID('toggle-cancle-new-btn');
	const indexHeader = ID('index-header');
	const scrollBox = ID('scroll-box');
	const profileBack = ID('profile-back');
	// const wrapContacts = ID("wrap-contacts");
	const profileBtn = ID('profile-btn');

	toggleCancleNewBtn.on(() => {
		indexHeader.classList.toggle('active');
	});

	// defualt chat open off
	let bodyMaxScroll = scrollBox.scrollHeight - scrollBox.clientHeight;
	document.body.classList.remove('active');

	function setContacts() {
		let str = '';
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
		});
		// wrapContacts.innerHTML = str;
	}
	// setContacts();

	const contactBox = $('.contact-box');
	contactBox.on((e) => {
		document.body.classList.add('active');
		bodyMaxScroll = scrollBox.scrollWidth - scrollBox.clientWidth;
		smoothScroll(scrollBox, 'scrollLeft', bodyMaxScroll, 100);
	});

	profileBack.on(() => {
		smoothScroll(scrollBox, 'scrollLeft', -bodyMaxScroll, 100);
	});

	profileBtn.addEventListener('click', () => {
		window.location.replace('profile.html');
	});
};
