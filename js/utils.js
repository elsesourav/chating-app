'use strict';

//use cssRoot.style.setProperty("key", "value");
const cssRoot = document.querySelector(':root');

cssRoot.style.setProperty("--_w", window.innerWidth + `px`);
cssRoot.style.setProperty("--_h", window.innerHeight + `px`);

window.addEventListener("resize", () => {
	window.location.reload();
});

// when run this app in mobile is return true
const isMobile = localStorage.mobile || window.navigator.maxTouchPoints > 1;

	// pointer events for mobile devices
	if (isMobile) {
		cssRoot.style.setProperty("--pointer", "auto");
	} else {
		cssRoot.style.setProperty("--pointer", "pointer");
	}

// minimum window size
const minSize = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;

const $ = (element) => {
	const self = document.querySelectorAll(element);

	self.each = (fun) => {
		self.forEach(fun);
	};

	self.on = (event, fun) => {
		self.forEach((element) => {
			if (typeof event == 'function') element.addEventListener('click', event);
			else element.addEventListener(event, fun);
		});
	};

	self.text = (text) => {
		self.forEach((element) => {
			element.innerText = text;
		});
	};

	self.html = (html) => {
		self.forEach((element) => {
			element.innerHtml = html;
		});
	};

	self.style = (x = {}, y) => {
		if (!y) {
			const css = Object.entries(x);
			self.forEach((element) => {
				css.forEach(([prorerty, value]) => {
					element.style[prorerty] = value;
				});
			});
		} else {
			self.forEach((element) => {
				element.style[x] = y;
			});
		}
	};
	return self;
};

const ID = (element) => {
	const self = document.getElementById(element);

	self.on = (event, fun) => {
		if (typeof event == 'function') self.addEventListener('click', event);
		else self.addEventListener(event, fun);
	};

	self.text = (text) => {
		self.innerText = text;
	};

	self.html = (html) => {
		self.innerHtml = html;
	};

	self.Style = (x = {}, y) => {
		if (!y) {
			const css = Object.entries(x);
			css.forEach(([prorerty, value]) => {
				self.style[prorerty] = value;
			});
		} else {
			self.style[x] = y;
		}
	};
	return self;
};

const Q = (element) => {
	const self = document.querySelector(element);

	self.on = (event, fun) => {
		if (typeof event == 'function') self.addEventListener('click', event);
		else self.addEventListener(event, fun);
	};

	self.text = (text) => {
		self.innerText = text;
	};

	self.html = (html) => {
		self.innerHtml = html;
	};

	self.Style = (x = {}, y) => {
		if (!y) {
			const css = Object.entries(x);
			css.forEach(([prorerty, value]) => {
				self.style[prorerty] = value;
			});
		} else {
			self.style[x] = y;
		}
	};
	return self;
};

Math.toRadian = (degree) => (degree * Math.PI) / 180; // degree to radian
Math.toRadian = (radian) => (radian * 180) / Math.PI; // radian to Degree

Math.rnd = (start = 0, end = 1, int_floor = false) => {
	const result = start + Math.random() * (end - start);
	return int_floor ? Math.floor(result) : result;
};

/* e.x 
(0 start) -------.------ (10 end) input . = 5
(10 min) ----------------.---------------- (30 max) output . = 20
*/
Math.map = (point, start, end, min, max) => {
	return ((max - min) * (point - start)) / (end - start) + min;
};

function hover(element) {
	const elements = typeof element == 'object' ? element : [element];
	elements.forEach((ele) => {
		ele.addEventListener('touchstart', () => {
			if (isMobile) ele.classList.add('_on_');
		});
		ele.addEventListener('mouseenter', () => {
			if (!isMobile) ele.classList.add('_on_');
		});

		ele.addEventListener('touchend', () => {
			if (isMobile) ele.classList.remove('_on_');
		});
		ele.addEventListener('mouseleave', () => {
			if (!isMobile) ele.classList.remove('_on_');
		});
	});
}
/* ---- example ---- */
// .hover {
//     color: black;
//     transition: linear 0.3s;
// }
// .hover._on_ {
//     color: red;
//     transition: linear 0.3s;
// }
hover(document.querySelectorAll('.hover'));

/* ----  local storage set and get ---- */
function setDataFromLocalStorage(key, object) {
	let data = JSON.stringify(object);
	localStorage.setItem(key, data);
}
function getDataFromLocalStorage(key) {
	return JSON.parse(localStorage.getItem(key));
}
function deleteDataFromLocalStorage(key) {
	return localStorage.removeItem(key);
}

// class add in html
function addClass(array, className = 'active') {
	if (array.length == undefined) {
		array.classList.forEach(() => array.classList.add(className));
	} else {
		array.forEach((element) => element.classList.add(className));
	}
}
// claass remove in html
function removeClass(array, className = 'active') {
	if (array.length == undefined) {
		array.classList.forEach(() => array.classList.remove(className));
	} else {
		array.forEach((element) => element.classList.remove(className));
	}
}

// message modify
function messageModify(message) {
	return message
		.replace(/^\s{1,}/, '') // starting whitespace and new line (when nathing write anything baln then letter)
		.replaceAll(/\n{3,}/g, '\n\n') // multiple new line
		.replaceAll(/^\n+\s{1,}/gm, '\n') // remove starting balnk space (when write then)
		.replaceAll('<', '&#60;')
		.replaceAll('>', '&#62;')
		.replaceAll(`"`, '&#34;')
		.replaceAll(`'`, '&#39;')
		.replaceAll('\n', '<br>');
}

// get date for message
let _hh,
	_mm,
	_dt = new Date();
function getChatDate() {
	_dt = new Date();
	_hh = _dt.getHours();
	_mm = _dt.getMinutes();

	return {
		year: _dt.getFullYear(),
		time: `${_hh < 10 ? '0' + _hh : _hh}:${_mm < 10 ? '0' + _mm : _mm}`,
	};
}

function getOptimizeDate() {
	const dt = new Date();
	const h = dt.getHours();
	const m = dt.getMinutes();
	const mn = dt.getMonth();
	const y = dt.getFullYear();
	const d = dt.getDate();
	return {
		full: `D${y}_${mn + 1}_${d}_${h}`,
		time: `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`,
		year: y.toString(),
	};
}

function smoothScroll(element, side, distence, time) {
	let run = true;
	const fps = 60;
	let f = (time / 1000) * fps;
	let count = f;
	let d = distence / f;
	let stap = element[side];

	function loop() {
		if (count <= 0) {
			run = false;
			if (distence < 0) element[side] = 0;
			else element[side] = distence;
		}
		if (run) {
			count--;
			stap += d;
			element[side] = stap;
			setTimeout(loop, 1000 / fps);
		}
	}
	loop();
}

function objectEvery(object) {
	for (const key in object) {
		if (!object[key]) return false;
	}
	return true;
}

function objectSome(object) {
	for (const key in object) {
		if (object[key]) return true;
	}
	return false;
}

function objectRound(object) {
	let obj = structuredClone(object);

	for (const key in obj) {
		obj[key] = Math.round(obj[key]);
	}
	return obj;
}

const validEmail = (exp) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(exp);
const validName = (exp) => /^([a-zA-Zà-úÀ-Ú]{2,})+\s+([a-zA-Zà-úÀ-Ú\s]{2,})+$/.test(exp);
const validUName = (exp) => /^[a-zA-Z0-9\_\-\@]{6,16}$/.test(exp);
const validPass = (exp) => /^([A-Za-z0-9à-úÀ-Ú\@\_\.\-]{8,16})+$/.test(exp);
const validText = (exp) => /^([A-Za-z0-9à-úÀ-Ú\.\-\,\_\|\?\:\*\&\%\#\!\+\~\₹\'\"\`\@\s]{2,})+$/.test(exp);

const b36to10 = (b36) => parseInt(b36, 36);
const b10to36 = (b10) => b10.toString(36);
const b64toString = (b64) => btoa(b64);
const stringToB64 = (b64) => atob(b64);
const b36t10 = (v) => parseInt(v, 36);
const b10t36 = (v) => Number(v).toString(36);

/* -------------------------- formula ----------------------------**
 ** const date = new Date();                                       **
 ** const pass = Sourav@121                                        **
 ** let x = `%${b10t36(date)}${stringToB64(pass)}%${b10t36(date)}` **
 ** console.log(x);                                                **
 ** x = x.split(`%${b10t36(date)}`).join("");                      **
 ** console.log(x);                                                **
 ** let y = b64toString(x);                                        **
 ** console.log(y);                                                **
 **----------------------------------------------------------------**/

function getOperatingSystemName() {
	const ua = navigator.userAgent;
	return /iPad/.test(ua) ? 'iPad' : /iPhone/.test(ua) ? 'iPhone' : /Android 4/.test(ua) ? 'Android' : /Windows/.test(ua) ? 'Windows' : 'Other';
}

function getGuestId() {
	const date = Date.now(); // in milliseconds
	return {
		date: date,
		id: b10to36(date).toUpperCase(),
		os: getOperatingSystemName(),
	};
}

function setCookie(name, value = '', exdays = 0) {
	if (typeof exdays === 'number') {
		const d = new Date();
		d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
		let expires = 'expires=' + d.toUTCString();
		document.cookie = `${name}=${JSON.stringify(value)};${expires};path=/`;
	}
}

function getCookie(name) {
	let result = document.cookie.match(new RegExp(name + '=([^;]+)'));
	result && (result = JSON.parse(result[1]));
	return result;
}

function deleteCookie(name) {
	document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

// delay input run function
function debounce(callback, delay = 1000) {
	let timeout;
	return function () {
		clearTimeout(timeout);
		timeout = setTimeout(callback, delay);
	};
}

function clearLocal() {
	deleteDataFromLocalStorage('liveChatUserData');
	setCookie('liveChatUser', '', 0);
	setTimeout(() => {
		location.replace('../index.html');
	}, 500);
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getClenderStatus(formatTime, currentTime) {
	const ft = formatTime.split('_');
	const ct = currentTime.split('_');

	if (ft[0] == ct[0] && ft[1] == ct[1] && ft[2] == ct[2]) {
		return 'Today';
	} else if (ft[0] == ct[0] && ft[1] == ct[1] && ft[2] == ct[2] - 1) {
		return 'Yesterday';
	} else if (ft[0] == ct[0] && ft[1] == ct[1] && ct[2] - ft[2] < 10 && ct[2] - ft[2] > -1) {
		const d = new Date(ft[0].substring(1, 5), ft[1], ft[2]);
		return DAYS[d.getDay()];
	} else {
		return `${ft[2]} ${MONTHS[ft[2]]} ${ft[0].substring(1, 5)}`;
	}
}

// get all messages from local data
function getAllMessages(friendId) {
	const opDate = getOptimizeDate();

	let ary = [];
	for (const key in data.chats.receive[friendId]) {
		const chat = data.chats.receive[friendId][key];
		ary.push({
			type: 'status',
			message: getClenderStatus(key, opDate.full),
		});
		for (const key in chat) {
			ary.push(chat[key]);
		}
	}
	for (const key in data.chats.seved[friendId]) {
		const chat = data.chats.seved[friendId][key];
		ary.push({
			type: 'status',
			message: getClenderStatus(key, opDate.full),
		});
		for (const key in chat) {
			ary.push(chat[key]);
		}
	}
	console.log(ary);
}

// get friend receive message length
function getFriendReceiveMessageLength(friendId) {
	let count = 0;
	for (const key in data.chats.receive[friendId]) {
		for (const k in data.chats.receive[friendId][key]) {
			count++;
		}
	}
	return count;
}
