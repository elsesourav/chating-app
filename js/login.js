import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
import { set, get, getDatabase, query, ref, update, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";



function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}






window.onload = () => {

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth = getAuth();
  const db = getDatabase();

  const cover = document.querySelectorAll(".cover");
  const allInputs = document.querySelectorAll("input");

  let allInputsData = [];
  let functions = [validEmail, validPass, validName, validEmail, validPass, validPass];

  allInputs.forEach((input, i) => {
    allInputsData[i] = "";
    input.addEventListener("input", () => {
      allInputsData[i] = input.value;
      if (input.value) {
        cover[i].classList.add("active");
      } else {
        cover[i].classList.remove("active");
      }
      action(i);
    })
  })


const a = new AlertHTML({
    title: "Alert",
    titleIcon: "sbi-security",
    message: "",
    btnNm1: "Okay",
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


  const createOne = document.getElementById("create-one");
  const goHome = document.getElementById("go-home");
  const loginButton = document.getElementById("login-button");
  const signupButton = document.getElementById("signup-button");
  const goLoginPag = document.getElementById("go-login-pag");
  const loginWindowButton = document.getElementById("login-window-button");
  const underline = document.querySelectorAll(".out");

  let createFlag = false;
  let loginFlag = false;

  function action(i) {
    if (functions[i](allInputsData[i])) {
      underline[i].classList.remove("u1");
      underline[i].classList.remove("u2");
      underline[i].classList.remove("u3");
      i < 2 ? underline[i].classList.add("u3") : underline[i].classList.add("u2");
    } else {
      underline[i].classList.add("u1")
      underline[i].classList.remove("u2")
      underline[i].classList.remove("u3")
    }


    if (i > 3 && allInputsData[4] == allInputsData[5]) {
      underline[5].classList.add("u2");
    } else if (i > 3) {
      underline[5].classList.add("u1");
      underline[5].classList.remove("u2");
    }

    loginButton.classList.remove("active");
    signupButton.classList.remove("active");
    createFlag = false;
    loginFlag = false;

    if (functions[0](allInputsData[0]) && functions[1](allInputsData[1])) {
      loginButton.classList.add("active");
      loginFlag = true;

    } else if (functions[2](allInputsData[2]) && functions[3](allInputsData[3]) &&
      functions[4](allInputsData[4]) && functions[5](allInputsData[5])) {
      signupButton.classList.add("active");
      createFlag = true;
    }
  }

  loginButton.addEventListener("click", async () => {
    if (!loginFlag) return;
    try {
      await signInWithEmailAndPassword(auth, allInputsData[0], allInputsData[1]);

      window.location.replace("html/home.html")
    } catch (error) {
      
    }
  })

  signupButton.addEventListener("click", async () => {
    if (!createFlag) return;
    try {
      const createdUser = await createUserWithEmailAndPassword(auth, allInputsData[3], allInputsData[4]);

      const user = createdUser.user;
      const date = Date.now();

      if (user) {
        await set(ref(db, `user/${user.uid}`), {
          uid: user.uid,
          email: allInputsData[3],
          name: allInputsData[2],
          date_: `${date}`,
          type: "member",
          password: `%${b10t36(date)}${stringToB64(allInputsData[4])}%${b10t36(date)}`
        })
        a.show();
        a.setMassage(`Hello <b>${allInputsData[2]}</b> your account has been created successfully`)
        a.clickBtn1(() => {
          a.hide()
          document.body.classList.toggle("active", true);
        })
      }
    } catch (error) {
      a.show();
        a.setMassage(error);
        a.clickBtn1(() => {
          a.hide()
          document.body.classList.toggle("active", true);
        })
    }
  })

  createOne.addEventListener("click", () => {
    document.body.classList.toggle("active", false);
  });
  loginWindowButton.addEventListener("click", () => {
    document.body.classList.toggle("active", true);
  })
  goLoginPag.addEventListener("click", () => {
    document.body.classList.toggle("active", true);
  })

}



