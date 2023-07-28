import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
import { set, get, getDatabase, query, ref, update, orderByChild, equalTo, startAt, endAt } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";


/* -------------- global variable start ------------ */

const P = {
    topLeft: false,
    bottomLeft: false,
    bottomRight: false,
    topRight: false
};

const pre = { x: 0, y: 0 };
let middleMove = false;

// set initial sides position
const sides = {
    left: 48,
    right: 48,
    top: 48,
    bottom: 48
}

const { width: Width, height: Height } = canvasBox.getBoundingClientRect();
const minSelectorSize = 60;

let currentSearchSelection = null; // for search user click detials

/* -------------- global variable end ------------ */

(async () => {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const auth = getAuth();
    const db = getDatabase();

    const dbRefInfo = ref(db, `users_data/info/${userId}`);
    const dbRefStatus = ref(db, `users_data/status/${userId}`);
    const dbRefFriends = ref(db, `users_data/friends/${userId}`);
    const dbRefImage = ref(db, `users_data/image/${userId}`);

    let allUserInfo = null;



    imageUpload.addEventListener("click", () => {
        fileInput.click();
    })

    uploadCancleBtn.addEventListener("click", () => {
        imageSelection.classList.remove("active");
        fileInput.value = null;
    });

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

    imageEditeOptions.addEventListener("click", () => {
        imageEditeOptions.classList.toggle("active");
    });
    // copy buttton 
    userID.addEventListener("click", async () => {
        await navigator.clipboard.writeText(userId.innerText);
    });


    // -------------- image selection --------------
    fileInput.addEventListener("change", (e) => {
        if (!e.target.files[0]) {
            imageSelection.classList.remove("active");
            return;
        }

        const c = cvs.getContext("2d");

        let fileNames = e.target.files[0].name;
        const img = new Image();
        const Img = URL.createObjectURL(e.target.files[0]);
        img.src = Img;

        img.onload = () => {
            imageSelection.classList.add("active");

            const w = img.width;
            const h = img.height;
            const max = Math.max(w, h);
            const min = Math.min(w, h);

            const cvsBoxWidth = canvasBox.clientWidth;
            const minHlaf = (cvsBoxWidth - (min / max) * cvsBoxWidth * 0.9) / 2;

            selector.style.inset = `${sides.top = minHlaf}px ${sides.right = minHlaf}px ${sides.bottom = minHlaf}px ${sides.left = minHlaf}px`;

            cvs.width = max;
            cvs.height = max;

            c.fillStyle = "#ffffff";
            c.fillRect(0, 0, cvs.width, cvs.height);
            c.drawImage(img, (max - w) / 2, (max - h) / 2, w, h);

            async function eventHandler() {

                const wRatio = w / canvasBox.clientWidth;
                const hRatio = h / canvasBox.clientHeight;

                const ratio = Math.max(wRatio, hRatio);

                const half = {
                    x: w < h ? (h - w) / 2 : 0,
                    y: w > h ? (w - h) / 2 : 0
                };

                const dleft = Math.round(sides.left * ratio - half.x);
                const dtop = Math.round(sides.top * ratio - half.y);
                const dwidth = Math.round(selector.clientWidth * ratio);
                const dheight = Math.round(selector.clientHeight * ratio);

                const IMG_PIXEL = { high: 512, low: 64 };
                const IMAGE_URL = { high: "", low: "" };

                // for high quality image
                cvs.width = IMG_PIXEL.high;
                cvs.height = IMG_PIXEL.high;

                c.fillStyle = "#ffffff";
                c.fillRect(0, 0, cvs.width, cvs.height);
                c.drawImage(img, dleft, dtop, dwidth, dheight,
                    0, 0, cvs.width, cvs.height);
                IMAGE_URL.high = cvs.toDataURL("image/jpeg", 1.0);

                // for low quality image
                cvs.width = IMG_PIXEL.low;
                cvs.height = IMG_PIXEL.low;

                c.fillStyle = "#ffffff";
                c.fillRect(0, 0, cvs.width, cvs.height);
                c.drawImage(img, dleft, dtop, dwidth, dheight,
                    0, 0, cvs.width, cvs.height);

                IMAGE_URL.low = cvs.toDataURL("image/jpeg", 1.0);

                profielImage.classList.add("active");
                imageSelection.classList.remove("active");
                uploadImageBtn.removeEventListener("click", eventHandler, true);

                uploadProcess.classList.add("active");
                const MS = Date.now();

                await set(dbRefImage, {
                    imgHigh: IMAGE_URL.high,
                    imgLow: IMAGE_URL.low,
                    time: MS
                }).then(() => {
                    console.log("Data sended successfully");
                    uploadProcess.classList.remove("active");
                    profileImg.src = IMAGE_URL.high;

                }).catch((error) => {
                    uploadProcess.classList.remove("active");
                });
            }
            uploadImageBtn.addEventListener("click", eventHandler, true);

        };
    });


    // -------------- event handlers --------------

    /*  ---------- event listener for pc  -----------*/
    topLeft.addEventListener("mousedown", () => { P.topLeft = true; });
    bottomLeft.addEventListener("mousedown", () => { P.bottomLeft = true; });
    bottomRight.addEventListener("mousedown", () => { P.bottomRight = true; });
    topRight.addEventListener("mousedown", () => { P.topRight = true; });

    document.body.addEventListener("mouseup", resetSideAndMiddle);

    canvasBox.addEventListener("mousedown", (e) => {
        pre.x = e.clientX;
        pre.y = e.clientY;
    });

    canvasBox.addEventListener("mousemove", (e) => {
        selectionChanged({ x: e.clientX, y: e.clientY });
    })

    selector.addEventListener("mousedown", (e) => {
        pre.x = e.clientX;
        pre.y = e.clientY;
        middleMove = true;
    });

    selector.addEventListener("mousemove", (e) => {
        selectorMove({ x: e.clientX, y: e.clientY });
    });

    /*  ---------- event listener for mobile -----------*/
    topLeft.addEventListener("touchstart", () => { P.topLeft = true; });
    bottomLeft.addEventListener("touchstart", () => { P.bottomLeft = true; });
    bottomRight.addEventListener("touchstart", () => { P.bottomRight = true; });
    topRight.addEventListener("touchstart", () => { P.topRight = true; });

    document.body.addEventListener("touchend", resetSideAndMiddle);

    canvasBox.addEventListener("touchstart", (e) => {
        pre.x = e.touches[0].clientX;
        pre.y = e.touches[0].clientY;
    });

    canvasBox.addEventListener("touchmove", (e) => {
        selectionChanged({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    })

    selector.addEventListener("touchstart", (e) => {
        pre.x = e.touches[0].clientX;
        pre.y = e.touches[0].clientY;
        middleMove = true;
    });

    selector.addEventListener("touchmove", (e) => {
        selectorMove({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    });


    // false all sides and middle
    function resetSideAndMiddle() {
        for (const key in P) {
            P[key] = false;
        }
        middleMove = false;
    }

    // control selection movement
    function selectorMove({ x, y }) {
        if (!middleMove || objectSome(P)) return;
        let dx = x - pre.x;
        let dy = y - pre.y;

        if (sides.left + dx > 0 && sides.right - dx > 0) {
            sides.left += dx;
            sides.right -= dx;
        }
        if (sides.top + dy > 0 && sides.bottom - dy > 0) {
            sides.top += dy;
            sides.bottom -= dy;
        }

        const { top, bottom, left, right } = objectRound(sides);
        selector.style.inset = `${top}px ${right}px ${bottom}px ${left}px`;

        pre.x = x;
        pre.y = y;
    }

    // control sides changes
    function selectionChanged({ x, y }) {
        const _sides = structuredClone(sides);

        const { top, bottom, left, right } = sides;

        if (P.topLeft) {
            const avg = ((x - pre.x) + (y - pre.y)) / 2;
            if (top + avg >= 0 && left + avg >= 0) {
                sides.top += avg;
                sides.left += avg;
            }

        } else if (P.topRight) {
            const avg = (-(x - pre.x) + (y - pre.y)) / 2;
            if (top + avg >= 0 && right + avg >= 0) {
                sides.top += avg;
                sides.right += avg;
            }

        } else if (P.bottomLeft) {
            const avg = ((x - pre.x) - (y - pre.y)) / 2;
            if (bottom + avg >= 0 && left + avg >= 0) {
                sides.bottom += avg;
                sides.left += avg;
            }

        } else if (P.bottomRight) {
            const avg = (-(x - pre.x) - (y - pre.y)) / 2;
            if (bottom + avg >= 0 && right + avg >= 0) {
                sides.bottom += avg;
                sides.right += avg;
            }
        }

        const { top: t, bottom: b, left: l, right: r } = objectRound(sides);

        if (Width - (t + b) > minSelectorSize &&
            Height - (l + r) > minSelectorSize) {

            selector.style.inset = `${t}px ${r}px ${b}px ${l}px`;
        } else {
            for (const key in sides) {
                sides[key] = _sides[key];
            }
        }

        pre.x = x;
        pre.y = y;
    }



    /* ------------ search in user datas  ----------------*/
    // search input
    userSearchInput.addEventListener("input", debounce(() => {
        let ID = userSearchInput.value;
        manageSearchUsers(ID);
    }, 500));

    // paste button
    pasteButton.addEventListener("click", debounce(async () => {
        const text = await navigator.clipboard.readText();
        const ID = text.substring(0, 8);
        userSearchInput.value = ID;
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

        allSearchResult.innerHTML = "";
        let strElement = "";

        sorted.forEach(e => {
            const isYou = userId === e.userId;
            const isFriend = isMyFriend(data.friends, e.userId);
            strElement += `
            <div class="search-user ${isYou || isFriend ? "have" : ""}">
				<i class="sbi-user"></i>
				<div class="user-name">${isYou ? "You" : e.name ? e.name : "Guest"}</div>
				<p>ID</p>
				<div class="user-id">${e.userId}</div>
            </div>
        `;
        });

        allSearchResult.innerHTML = strElement;
        const allFindUsers = document.querySelectorAll(".search-user");
        allFindUsers.forEach((findUser, i) => {
            findUser.addEventListener("click", () => {
                removeClass(allFindUsers);
                addClass(findUser);

                // set in search view elements
                userAddAndInfo.classList.add("active");
                userAddAndInfo.classList.remove("have");
                if (userId === sorted[i].userId || isMyFriend(data.friends, sorted[i].userId)) {
                    userAddAndInfo.classList.add("have");
                }
                searchUserName.innerText = sorted[i].name;

                // add image url when have image
                searchIcon.classList.remove("active");
                if (sorted[i].imgLow) {
                    searchUserImage.src = sorted[i].imgLow;
                    searchIcon.classList.add("active");
                }
                currentSearchSelection = sorted[i];
            });
        });
    }

    addUserBtn.addEventListener("click", debounce(async () => {
        if (!currentSearchSelection) return;
        uploadProcess.classList.add("active");

        try {
            await update(dbRefFriends, {
                [currentSearchSelection.id]: Date.now()
            })
            const snapshot = await get(dbRefFriends);

            const len = Object.keys(snapshot.val()).length;

            await update(dbRefInfo, {
                friends: len
            })

            uploadProcess.classList.remove("active");
            currentSearchSelection = null;
            userSearchInput.value = "";
            allSearchResult.innerHTML = "";
        } catch (error) {
            console.log("something went wrong!!");
            console.log(error);
        }

    }, 700));
})();

