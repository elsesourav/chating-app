import {getAnalytics} from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js';
import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js';
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js';
import {set, get, getDatabase, query, ref, update, orderByChild, equalTo} from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js';

window.onload = () => {
	// Initialize Firebase
	const app = initializeApp(firebaseConfig);
	const analytics = getAnalytics(app);
	const auth = getAuth();
	const db = getDatabase();

	const localType = getDataFromLocalStorage('userLoginType');

	if (localType) {
		if (localType == 'login') {
			document.body.classList.add('active');
		} else {
			document.body.classList.remove('active');
		}
		deleteDataFromLocalStorage('userLoginType');
	}

	ID('go-home').on(() => {
		window.location.replace('../index.html');
	});

	const cover = document.querySelectorAll('.cover');
	const allInputs = document.querySelectorAll('input');

	let allInputsData = [];
	let functions = [validEmail, validPass, validName, validEmail, validPass, validPass];

	allInputs.forEach((input, i) => {
		allInputsData[i] = '';
		input.addEventListener('input', () => {
			allInputsData[i] = input.value;
			if (input.value) {
				cover[i].classList.add('active');
			} else {
				cover[i].classList.remove('active');
			}
			action(i);
		});
	});

	const a = new AlertHTML({
		title: 'Alert',
		titleIcon: 'sbi-security',
		message: '',
		btnNm1: 'Okay',
		titleHeight: 60,
		buttonHeitht: 45,
		width: 290,
		windowWidth: window.innerWidth,
		windowHeight: window.innerHeight,
	});

	// a.clickOutside(() => {
	//     console.log("outside");
	// })
	// a.clickBtn1(() => {
	//     a.hide()
	// })
	// a.clickBtn2(() => {
	//     a.hide()
	// })

	const createOne = document.getElementById('create-one');
	const loginButton = document.getElementById('login-button');
	const signupButton = document.getElementById('signup-button');
	const goLoginPag = document.getElementById('go-login-pag');
	const loginWindowButton = document.getElementById('login-window-button');
	const underline = document.querySelectorAll('.out');

	let createFlag = false;
	let loginFlag = false;

	function action(i) {
		if (functions[i](allInputsData[i])) {
			underline[i].classList.remove('u1');
			underline[i].classList.remove('u2');
			underline[i].classList.remove('u3');
			i < 2 ? underline[i].classList.add('u3') : underline[i].classList.add('u2');
		} else {
			underline[i].classList.add('u1');
			underline[i].classList.remove('u2');
			underline[i].classList.remove('u3');
		}

		if (i > 3 && allInputsData[4] == allInputsData[5]) {
			underline[5].classList.add('u2');
		} else if (i > 3) {
			underline[5].classList.add('u1');
			underline[5].classList.remove('u2');
		}

		loginButton.classList.remove('active');
		signupButton.classList.remove('active');
		createFlag = false;
		loginFlag = false;

		if (functions[0](allInputsData[0]) && functions[1](allInputsData[1])) {
			loginButton.classList.add('active');
			loginFlag = true;
		} else if (functions[2](allInputsData[2]) && functions[3](allInputsData[3]) && functions[4](allInputsData[4]) && functions[5](allInputsData[5])) {
			signupButton.classList.add('active');
			createFlag = true;
		}
	}

	loginButton.addEventListener('click', async () => {
		if (!loginFlag) return;
		try {
			const u = await signInWithEmailAndPassword(auth, allInputsData[0], allInputsData[1]);

			const userData = (await get(ref(db, `register_users/${u.user.uid}`))).val();

			setCookie('liveChatUser', userData, 30);

			const dbRef = ref(db, `users/${userData.id}`);

			const dataExists = getDataFromLocalStorage('liveChatUserData');
			if (!dataExists && dataExists != {}) {
				const us = (await get(dbRef)).val();
				setDataFromLocalStorage('liveChatUserData', {
					id: us.id,
					images: {
						high: '',
						low: '',
					},
					friends: us.friends || {
            receive: us.friends.receive || {},
            saved: us.friends.saved || {},
          },
          chats: us.chats || {
            receive: us.chats.receive || {},
            saved: us.chats.saved || {},
          },
					info: us.info,
					onlineStatus: us.onlineStatus,
					profileStatis: us.profileStatis,
				});
			}

			setTimeout(() => {
				window.location.replace('../html/home.html');
			}, 100);
		} catch (error) {
			console.log(error);
		}
	});

	signupButton.addEventListener('click', async () => {
		if (!createFlag) return;
		try {
			const createdUser = await createUserWithEmailAndPassword(auth, allInputsData[3], allInputsData[4]);

			const user = createdUser.user;
			const date = Date.now();

			if (user) {
				const userDtls = getGuestId();
				const dbRefInfo = ref(db, `users/${userDtls.id}`);

				await set(ref(db, `register_users/${user.uid}`), {
					...userDtls,
					email: allInputsData[3],
					name: allInputsData[2],
					password: `%${b10t36(date)}${stringToB64(allInputsData[4])}%${b10t36(date)}`,
				});

				const d = Date.now();
				const datas = {
					info: {
						about: '',
						creationDate: userDtls.date,
						name: allInputsData[2],
						os: userDtls.os,
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
					id: userDtls.id,
					onlineStatus: d,
					profileStatis: d,
				};

				await update(dbRefInfo, datas);

				setDataFromLocalStorage('liveChatUserData', datas);

				a.show();
				a.setMassage(`Hello <b>${allInputsData[2]}</b> your account has been created successfully`);
				a.clickBtn1(() => {
					a.hide();
					document.body.classList.toggle('active', true);
				});
			}
		} catch (error) {
			a.show();
			a.setMassage(error);
			a.clickBtn1(() => {
				a.hide();
				document.body.classList.add('active');
			});
		}
	});

	createOne.addEventListener('click', () => {
		document.body.classList.remove('active');
	});
	loginWindowButton.addEventListener('click', () => {
		document.body.classList.add('active');
	});
	goLoginPag.addEventListener('click', () => {
		document.body.classList.add('active');
	});
};
