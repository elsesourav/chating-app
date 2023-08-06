import {getAnalytics} from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js';
import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js';
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js';
import {set, get, getDatabase, query, ref, update, orderByChild, orderByValue, equalTo, startAfter, startAt, endAt, onValue, child} from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js';

let currentSearchSelection = null; // for search user click detials

/* -------------- global variable end ------------ */

(async () => {
	// Initialize Firebase
	const app = initializeApp(firebaseConfig);
	const analytics = getAnalytics(app);
	const auth = getAuth();
	const db = getDatabase();

	const dbRef = ref(db, `users/${USER_ID}`);

	let allUserInfo = null;

	// initial run
	userID.innerText = USER_ID;
	if (data && data.info.name) nameInput.value = data.info.name;
	if (data && data.info.about) aboutInput.value = data.info.about;

	// update profile information
	proUpdateButton.addEventListener(
		'click',
		debounce(async () => {
			uploadProcess.classList.add('active');
			const name = nameInput.value;
			const about = aboutInput.value;
			await update(child(dbRef, `info`), {
				name: name,
				about: about,
			});

			data.info.name = name;
			data.info.about = about;

			uploadProcess.classList.remove('active');
		}, 500)
	);

	// logout button
	logoutButton.addEventListener('click', async () => {
		clearLocal();
	});

	// delete image button
	imageDelete.addEventListener('click', async () => {
		try {
			uploadProcess.classList.add('active');
			await update(child(dbRef, `images`), {
				high: '',
				low: '',
			});
			data.images.high = '';
			data.images.low = '';
			profileImg.src = '';
			profielImage.classList.remove('active');
		} catch (error) {
			console.log(error);
		}
		uploadProcess.classList.remove('active');
	});

	/* ----------------- upload profile image ------------------ */
	doneSelectedImage.addEventListener(
		'click',
		async () => {
			createImageData();
			try {
				await update(child(dbRef, `images`), {
					high: IMAGE_URL.high,
					low: IMAGE_URL.low,
				});
			} catch (error) {
				console.log(error);
			}

			profileImg.src = IMAGE_URL.high;
			data.images.high = IMAGE_URL.high;
			data.images.low = IMAGE_URL.low;
			profielImage.classList.add('active');
			uploadProcess.classList.remove('active');
		},
		true
	);

	/* ------------- user profile setting ------------- */
	profileOpenClose.addEventListener('click', () => {
		myProfileAndFindUser.classList.toggle('show');
	});
	profielImage.addEventListener('click', () => {
		myProfileAndFindUser.classList.add('one');
		myProfileAndFindUser.classList.remove('two');
	});
	closeProfile.addEventListener('click', () => {
		myProfileAndFindUser.classList.remove('one');
	});
	searchIcon.addEventListener('click', async () => {
		myProfileAndFindUser.classList.remove('one');
		myProfileAndFindUser.classList.add('two');

		// 	try {
		// 		const r = ref(db, `users_data/info/`);
		// 		allUserInfo = (await get(r)).val();
		// 	} catch (error) {
		// 		console.log(error);
		// 	}
	});

	closeSearch.addEventListener('click', () => {
		myProfileAndFindUser.classList.remove('two');
		currentSearchSelection = null;
		userSearchInput.value = '';
		searchUserName.innerText = 'User Name';
		userAddAndInfo.classList.remove('active');
		allSearchResult.innerHTML = '';
		searchUserImage.url = "";
		searchIcon.classList.remove('active');
	});

	// copy buttton
	userID.addEventListener('click', async () => {
		await navigator.clipboard.writeText(userID.innerText);
	});

	/* ------------ search in user datas  ----------------*/
	// search input
	userSearchInput.addEventListener(
		'input',
		debounce(() => {
			let ID = userSearchInput.value;
			allSearchResult.innerHTML = '';

			if (ID.length > 8) userSearchInput.value = ID.substring(0, 8);
			else if (ID.length < 5) return;

			manageSearchUsers(ID);
		}, 500)
	);

	// paste button
	pasteButton.addEventListener(
		'click',
		debounce(async () => {
			const text = await navigator.clipboard.readText();
			const ID = text.substring(0, 8);
			userSearchInput.value = ID;
			allSearchResult.innerHTML = '';
			manageSearchUsers(ID);
		}, 500)
	);

	// search and manage users
	async function manageSearchUsers(ID) {
		if (ID.length < 5) return;

		ID = ID.toUpperCase();
		// console.log(allUserInfo);//
		// const sorted = allUserInfo.filter(({ id }) => id.includes(ID))
		// const sorted = objectFilter(allUserInfo, ID);

		const newRef = query(ref(db, 'users'), orderByChild('id'), equalTo(ID));
		const result = objectToArray((await get(newRef)).val());

		let strElement = '';

		[...result].forEach(({id, info}) => {
			const isYou = USER_ID === id;
			const isFriend = isMyFriend(data.friends, id);
			strElement += `
            <div class="search-user ${isYou || isFriend ? 'have' : ''}">
                <i class="sbi-user"></i>
				<div class="user-name">${isYou ? 'You' : info.name ? info.name : 'Guest'}</div>
				<p>ID</p>
				<div class="user-id">${id}</div>
            </div>
        `;
		});

		allSearchResult.innerHTML = strElement;
		const allFindUsers = document.querySelectorAll('.search-user');
		allFindUsers.forEach((findUser, i) => {
			findUser.addEventListener('click', async () => {
				removeClass(allFindUsers);
				addClass(findUser);

				const {id, images, info} = result[i];

				// set in search view elements
				userAddAndInfo.classList.add('active');
				userAddAndInfo.classList.remove('have');
				friendOrNot.classList = [];

				if (USER_ID === id) {
					userAddAndInfo.classList.add('have');
					friendOrNot.classList.add('sbi-user');
				} else if (isMyFriend(data.friends, id)) {
					userAddAndInfo.classList.add('have');
					friendOrNot.classList.add('sbi-user-check');
				} else {
					friendOrNot.classList.add('sbi-user');
				}
				searchUserName.innerText = info.name || id;

				// add image url when have image
				if (images && images.high != '') {
					searchIcon.classList.remove('active');
					searchUserImage.src = images.high;
					searchIcon.classList.add('active');
				}
				currentSearchSelection = result[i];
			});
		});
	}

	// when add an new friend
	addUserBtn.addEventListener(
		'click',
		debounce(async () => {
			if (!currentSearchSelection) return;
			uploadProcess.classList.add('active');
			const {id, images, info, onlineStatus} = currentSearchSelection;

			try {
				const d = Date.now();
				const opDate = getOptimizeDate();

				const firstChat = {
					type: 'both',
					message: 'Welcome to Live Chat!',
				};
				const friendInfo = {
					about: info.about,
					creationDate: info.creationDate,
					name: info.name || 'Guest',
					os: info.os,
					onlineStatus: onlineStatus,
					lastChatTime: d,
					lastMessage: firstChat.message,
					images: {
						high: images.high,
						low: images.low,
					},
				};

				// add in friend's friends list
				await update(ref(db, `users/${id}/friends/saved`), {
					[USER_ID]: {
						about: data.info.about,
						creationDate: data.info.creationDate,
						name: data.info.name || 'Guest',
						os: data.info.os,
						onlineStatus: data.onlineStatus,
						lastChatTime: d,
						lastMessage: firstChat.message,
						images: {
							high: data.images.high,
							low: data.images.low,
						},
					},
				});

				// add in friends list
				await update(child(dbRef, `friends/receive`), {
					[id]: friendInfo,
				});

				// set first chat in my chat list
				await update(child(dbRef, `chats/receive/${id}/${opDate.full}`), {
					[d]: firstChat,
				});

				// set first chat in friend chat list
				await update(ref(db, `users/${id}/chats/receive/${USER_ID}/${opDate.full}`), {
					[d]: firstChat,
				});

				data.friends.saved[id] = friendInfo;
				

				// upsh first chat in local
				if (!data.chats.receive[id]) {
					data.chats.receive[id] = {
						[opDate.full]: {
							[d]: firstChat,
						},
					};
				} else {
					data.chats.receive[id][opDate.full] = {
						...data.chats.receive[id][opDate.full],
						[d]: firstChat,
					};
				}

				friendOrNot.classList.add('sbi-user-check');
				uploadProcess.classList.remove('active');
				userAddAndInfo.classList.add('have');
				currentSearchSelection = null;
				userSearchInput.value = '';
				allSearchResult.innerHTML = '';
				setupFriends();
			} catch (error) {
				console.log('something went wrong!!');
				console.log(error);
			}
		}, 700)
	);
})();
