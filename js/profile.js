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

/* -------------- global variable end ------------ */


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
searchIcon.addEventListener("click", () => {
    myProfileAndFindUser.classList.remove("one");
    myProfileAndFindUser.classList.add("two");
});
closeSearch.addEventListener("click", () => {
    myProfileAndFindUser.classList.remove("two");
});

imageEditeOptions.addEventListener("click", () => {
    imageEditeOptions.classList.toggle("active");
});

// search input
pasteButton.addEventListener("click", async () => {
    const text = await navigator.clipboard.readText();
    userSearchInput.value = text.substring(0, 8);
});
userSearchInput.addEventListener("keyup", (e) => {
    userSearchInput.value = e.target.value.toUpperCase();
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

        function eventHandler() {

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

            const imgPixel = 500;

            cvs.width = imgPixel;
            cvs.height = imgPixel;


            c.fillStyle = "#ffffff";
            c.fillRect(0, 0, cvs.width, cvs.height);
            c.drawImage(img, dleft, dtop, dwidth, dheight,
                0, 0, cvs.width, cvs.height);

            uploadImageBtn.removeEventListener("click", eventHandler, true);

            const dataUrl = cvs.toDataURL("image/jpeg", 1.0)
            console.log(dataUrl);
            profielImage.classList.add("active");
            profileImg.src = dataUrl;
            imageSelection.classList.remove("active");
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