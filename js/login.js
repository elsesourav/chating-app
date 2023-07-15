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


const validEmail = exp => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(exp);
const validName = exp => /^([a-zA-Zà-úÀ-Ú]{2,})+\s+([a-zA-Zà-úÀ-Ú\s]{2,})+$/.test(exp);
const validUName = exp => /^[a-zA-Z0-9\_\-\@]{6,16}$/.test(exp);
const validPass = exp => /^([A-Za-z0-9à-úÀ-Ú\@\_\.\-]{8,16})+$/.test(exp);
const validText = exp => /^([A-Za-z0-9à-úÀ-Ú\.\-\,\_\|\?\:\*\&\%\#\!\+\~\₹\'\"\`\@\s]{2,})+$/.test(exp); 


const b36to10 = b36 => parseInt(b36, 36);
const b10to36 = b10 => b10.toString(36);
const b64toString = b64 => btoa(b64);
const stringToB64 = b64 => atob(b64);


/* -------------------- formula ----------------------------------**
** const date = new Date();                                       **
** const pass = Sourav@121                                        **        
** let x = `%${b10t36(date)}${stringToB64(pass)}%${b10t36(date)}` **  
** console.log(x);                                                **  
** x = x.split(`%${b10t36(date)}`).join("");                      **          
** console.log(x);                                                **
** let y = b64toString(x);                                        **  
** console.log(y);                                                **      
**----------------------------------------------------------------**/




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
      console.log("done");
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
        document.body.classList.toggle("active", true);
      }
    } catch (error) {
      console.log(error);
      alert("Your documents not correct! Please Try again.");
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



