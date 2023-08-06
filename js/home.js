import {getAnalytics} from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js';
import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js';
import {getAuth} from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js';
import {set, get, getDatabase, query, ref, update, orderByChild, equalTo, onValue, onChildChanged, onChildAdded, child, remove} from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js';

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

	setInterval(async () => {
		if (user_active) {
			try {
				const d = Date.now();

				await update(dbRef, {
					onlineStatus: d,
				});

				const borders = document.querySelectorAll('.contact-icon');
				let index = 0;

				// update my time in friends list
				for (const key in data.friends.saved) {
					await update(ref(db, `users/${key}/friends/saved/${USER_ID}`), {
						onlineStatus: d,
					});

					// update online status in my chat list
					const onSt = await get(ref(db, `users/${USER_ID}/friends/saved/${key}/onlineStatus`));

					const oldStatus = data.friends.saved[key].onlineStatus;
					const newStatus = onSt.val();

					data.friends.saved[key].onlineStatus = newStatus;

					if ((newStatus - oldStatus) > (UPDATE_DELAY - 5000)) {
						borders[index].classList.add('online');
					} else {
						borders[index].classList.remove('online');
					}
					index++;
				}

				data.onlineStatus = d;

				console.log('update time');
			} catch (error) {
				console.log(error);
			}
		}
	}, UPDATE_DELAY);

	try {
		onChildAdded(child(dbRef, `friends/receive`), async (snapshot) => {
			// updateChildFafences();
			const val = snapshot.val();

			await update(child(dbRef, `friends/saved/`), {
				[val.id]: val,
			});

			await remove(child(dbRef, `friends/receive/${val.id}`));
			data.friends.saved[val.id] = val;
			setupFriends();
		});

		// update when any one message me
		onChildAdded(child(dbRef, `chats/receive`), async (snapshot) => {
			const object = snapshot.val();
			let refr = snapshot.ref._path.pieces_;
			refr = refr[refr.length - 1]; 
			
			for (const key in object) {
				for (const k in object[key]) {
					await update(child(dbRef, `chats/saved/${refr}/${key}`), {
						[k]: object[key][k],
					});
					await remove(child(dbRef, `chats/receive/${refr}/${key}`));
		
					if (!data.chats.receive[refr]) {
						data.chats.receive[refr] = {};
						data.chats.receive[refr][key] = {
							[k]: object[key][k]
						};
					} else {
						data.chats.receive[refr][key] = {
							...data.chats.receive[refr][key],
							[k]: object[key][k]
						};
					}
				}
			}
			
			setupFriends();
		});
	} catch (error) {
		console.log(error);
	}

	/* -------------- default setup -------------- */
	// profile image
	if (data) {
		if (data.images && (data.images.high || data.images.low)) {
			profileImg.src = data.images.high;
			profielImage.classList.add('active');
		}
		if (data.info) {
			nameInput.value = data.info.name;
			aboutInput.value = data.info.about;
		}
	}

	setupFriends();

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
