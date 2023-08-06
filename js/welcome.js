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

	guestBtn.addEventListener('click', debounce(async () => {
		const geustId = getCookie('liveChatUser') || getGuestId();

		// when no guest account exist then create a new one

		try {
			// database reference
			const dbRefInfo = ref(db, `users/${geustId.id}`);

			const user = await get(dbRefInfo);

			if (!user.exists()) {
				// create new guest

				const datas = {
					info: {
						about: '',
						creationDate: geustId.date,
						name: '',
						os: geustId.os,
						password: '',
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
					id: geustId.id,
					onlineStatus: Date.now(),
				};

				await update(dbRefInfo, datas);

				setCookie('liveChatUser', geustId, 30);

				setDataFromLocalStorage('liveChatUserData', datas);

				console.log('Data sended successfully');
				location.replace('./html/home.html');
			} else {
				// continue old guest
				console.log('Continue with ols account');
				location.replace('./html/home.html');
			}
		} catch (error) {
			console.log(error);
		}
	}), 500);
};
