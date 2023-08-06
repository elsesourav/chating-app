const USER = getCookie('liveChatUser');
if (!(USER && USER.id)) window.location.replace('../index.html');

const USER_ID = getCookie('liveChatUser').id;
const UPDATE_DELAY = 10 * 1000;
let data = getDataFromLocalStorage('liveChatUserData');
let user_active = true;

let currentChatOpenId = 0;

// update local storage user data
document.addEventListener(
	'visibilitychange',
	() => {
		if (document.visibilityState == 'hidden') {
			setDataFromLocalStorage('liveChatUserData', data);
			user_active = false;
		} else {
			user_active = true;
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
	for (const key in {...object}) {
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
	const nh = h % 12;

	return `${nh < 10 ? '0' + nh : nh}:${m < 10 ? '0' + m : m} ${AM_PM}`;
}
