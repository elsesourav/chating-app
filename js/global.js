let userId = null;
let data = null;

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