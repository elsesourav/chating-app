import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
import {
    set, get, getDatabase, query, ref, update, orderByChild,
    equalTo, startAt, endAt, onValue, child
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";




let currentSearchSelection = null; // for search user click detials

/* -------------- global variable end ------------ */

(async () => {

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const auth = getAuth();
    const db = getDatabase();

    const dbRef = ref(db, `users/${USER_ID}`)

    let allUserInfo = null;





    // initial run
    userID.innerText = USER_ID;
    if (data && data.info.name) nameInput.value = data.info.name;
    if (data && data.info.about) aboutInput.value = data.info.about;

    // update profile information
    proUpdateButton.addEventListener("click", debounce(async () => {
        uploadProcess.classList.add("active");
        const name = nameInput.value;
        const about = aboutInput.value;
        await update(child(dbRef, `info`), {
            name: name,
            about: about
        })

        data.info.name = name;
        data.info.about = about;

        uploadProcess.classList.remove("active");
    }, 500));




















    /* ------------- user profile setting ------------- */
    profileOpenClose.addEventListener("click", () => {
        myProfileAndFindUser.classList.toggle("show");
    });
    profielImage.addEventListener("click", () => {
        myProfileAndFindUser.classList.add("one");
        myProfileAndFindUser.classList.remove("two");
    });
    closeProfile.addEventListener("click", () => {
        myProfileAndFindUser.classList.remove("one");
    });
    searchIcon.addEventListener("click", async () => {
        myProfileAndFindUser.classList.remove("one");
        myProfileAndFindUser.classList.add("two");

        try {
            const r = ref(db, `users_data/info/`);
            allUserInfo = (await get(r)).val();
        } catch (error) {
            console.log(error);
        }
    });

    closeSearch.addEventListener("click", () => {
        myProfileAndFindUser.classList.remove("two");
        currentSearchSelection = null;
        userSearchInput.value = "";
        searchUserName.innerText = "User Name";
        userAddAndInfo.classList.remove("active");
        allSearchResult.innerHTML = "";
    });


    // copy buttton 
    userID.addEventListener("click", async () => {
        await navigator.clipboard.writeText(userID.innerText);
    });






    /* ------------ search in user datas  ----------------*/
    // search input
    userSearchInput.addEventListener("input", debounce(() => {
        let ID = userSearchInput.value;
        allSearchResult.innerHTML = "";

        if (ID.length > 8) userSearchInput.value = ID.substring(0, 8);
        else if (ID.length < 5) return;

        manageSearchUsers(ID);
    }, 500));

    // paste button
    pasteButton.addEventListener("click", debounce(async () => {
        const text = await navigator.clipboard.readText();
        const ID = text.substring(0, 8);
        userSearchInput.value = ID;
        allSearchResult.innerHTML = "";
        manageSearchUsers(ID);
    }, 500));


    // search and manage users
    async function manageSearchUsers(ID) {
        if (ID.length < 5) return;

        ID = ID.toUpperCase();
        console.log(allUserInfo);
        // const sorted = allUserInfo.filter(({ id }) => id.includes(ID))
        const sorted = objectFilter(allUserInfo, ID);

        console.log(sorted);

        let strElement = "";

        sorted.forEach(e => {
            const isYou = USER_ID === e.id;
            const isFriend = isMyFriend(data.friends, e.id);
            strElement += `
            <div class="search-user ${isYou || isFriend ? "have" : ""}">
                <i class="sbi-user"></i>
				<div class="user-name">${isYou ? "You" : e.name ? e.name : "Guest"}</div>
				<p>ID</p>
				<div class="user-id">${e.id}</div>
            </div>
        `;
        });

        allSearchResult.innerHTML = strElement;
        const allFindUsers = document.querySelectorAll(".search-user");
        allFindUsers.forEach((findUser, i) => {
            findUser.addEventListener("click", async () => {
                removeClass(allFindUsers);
                addClass(findUser);

                // set in search view elements
                userAddAndInfo.classList.add("active");
                userAddAndInfo.classList.remove("have");
                friendOrNot.classList = [];

                if (USER_ID === sorted[i].USER_ID) {
                    userAddAndInfo.classList.add("have");
                    friendOrNot.classList.add("sbi-user");
                } else if (isMyFriend(data.friends, sorted[i].USER_ID)) {
                    userAddAndInfo.classList.add("have");
                    friendOrNot.classList.add("sbi-user-check");
                } else {
                    friendOrNot.classList.add("sbi-user");
                }
                searchUserName.innerText = sorted[i].name || sorted[i].USER_ID;

                // add image url when have image
                searchIcon.classList.remove("active");
                const imgs = (await get(dbRefImage)).val();

                if (imgs) {
                    searchUserImage.src = imgs.high;
                    searchIcon.classList.add("active");
                }
                currentSearchSelection = sorted[i];
            });
        });
    }

    // when add an new friend
    addUserBtn.addEventListener("click", debounce(async () => {
        if (!currentSearchSelection) return;
        uploadProcess.classList.add("active");

        try {
            const d = Date.now();
            const opDate = getOptimizeDate();

            const dbRefChatMe = ref(db, `users_data/chats/${USER_ID}/${currentSearchSelection.USER_ID}/${opDate.full}`);
            const dbRefChatFriend = ref(db, `users_data/chats/${currentSearchSelection.USER_ID}/${USER_ID}/${opDate.full}`);
            const dbRefFriendFriends = ref(db, `users_data/friends/${currentSearchSelection.USER_ID}`);
            const dbRefFriendInfo = ref(db, `users_data/info/${currentSearchSelection.USER_ID}`);


            const friendInfo = (await get(dbRefFriendInfo)).val();

            const firstChat = {
                type: "both",
                message: "Welcome to Live Chat"
            }

            const initInfo = {
                path: opDate.full,
                count: 1,
                message: "Welcome to Live Chat",
                rank: d,
                visited: false
            }

            // add friend in friends list
            await update(dbRefFriends, {
                [currentSearchSelection.USER_ID]: {
                    ...initInfo,
                    name: friendInfo.name || "Guest"
                }
            })

            await update(dbRefFriendFriends, {
                [USER_ID]: {
                    ...initInfo,
                    name: data.info.name || "Guest"
                }
            })


            // set first chat in my chat list
            await update(dbRefChatMe, { [d]: firstChat });

            // set first chat in friend chat list
            await update(dbRefChatFriend, { [d]: firstChat });

            data.friends[currentSearchSelection.USER_ID] = {
                ...initInfo,
                name: friendInfo.name || "Guest"
            };

            console.log(data.chats);
            // upsh first chat
            data.chats || (data.chats = {})
            data.chats[currentSearchSelection.USER_ID] = {
                [opDate.full]: { [d]: firstChat }
            }
            


            friendOrNot.classList.add("sbi-user-check");
            uploadProcess.classList.remove("active");
            userAddAndInfo.classList.add("have");
            currentSearchSelection = null;
            userSearchInput.value = "";
            allSearchResult.innerHTML = "";
        } catch (error) {
            console.log("something went wrong!!");
            console.log(error);
        }

    }, 700));
})();

