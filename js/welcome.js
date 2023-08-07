import {getAnalytics} from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js';
import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js';
import {getAuth} from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js';
import {get, getDatabase, ref, update} from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js';

window.onload = () => {
	// Initialize Firebase
	const app = initializeApp(firebaseConfig);
	const analytics = getAnalytics(app);
	const auth = getAuth();
	const db = getDatabase();

	// setDataFromLocalStorage()
	pageLoad.classList.remove('active');

	// pointer events for mobile devices
	if (isMobile) {
		document.head.append(`<style>* { pointer-events: none; }</style>`);
	}

	signupBtn.addEventListener('click', () => {
		location.replace("./html/login.html");
		setDataFromLocalStorage("userLoginType", "signup")
	})
	loginBtn.addEventListener('click', () => {
		location.replace("./html/login.html");
		setDataFromLocalStorage("userLoginType", "login")
	})

	guestBtn.addEventListener('click', debounce(async () => {
		const geust = getCookie('liveChatUser') || getGuestId();

		// when no guest account exist then create a new one

		try {
			// database reference
			const dbRefInfo = ref(db, `users/${geust.id}`);

			const user = await get(dbRefInfo);

			if (!user.exists()) {
				// create new guest

				const d = Date.now();
				const datas = {
					info: {
						about: '',
						creationDate: geust.date,
						name: geust.name,
						os: geust.os,
					},
					images: {
						high: '',
						low: '',
					},
					chats: {
						receive: {},
						saved: {},
					},
					friends: {
						receive: {},
						saved: {},
					},
					id: geust.id,
					onlineStatus: d,
					profileStatis: d
				};

				await update(dbRefInfo, datas);

				setCookie('liveChatUser', geust, 30);

				setDataFromLocalStorage('liveChatUserData', datas);

				console.log('Data sended successfully');
				location.replace('./html/home.html');
			} else {
				const dbRef = ref(db, `users/${geust.id}`);
				const dataExists = getDataFromLocalStorage('liveChatUserData');
				if (!dataExists && dataExists != {}) {
					setDataFromLocalStorage('liveChatUserData', (await get(dbRef)).val());
				}
				// continue old guest
				console.log('Continue with ols account');
				location.replace('./html/home.html');
			}
		} catch (error) {
			console.log(error);
		}
	}), 500);
};
