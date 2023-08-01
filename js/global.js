let userId = null;
let data = null;

userId = getCookie("liveChatUserId");
data = getDataFromLocalStorage("liveChatUserData");



document.addEventListener("visibilitychange", () => {
   if (document.visibilityState == "hidden")  updateLocalStorage();
}, false);

// update local storage for live chat user data
function updateLocalStorage() {
   setDataFromLocalStorage("liveChatUserData", data);
}

// object filter
function objectFilter(object, tId) {
   let ary = [];

   for (const key in object) {
      if (key.search(tId) !== -1) {
         ary.push(object[key])
      }
   }
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

   const AM_PM = h < 12 ? "AM" : "PM";

   return `${h % 12}:${m} ${AM_PM}`;
}