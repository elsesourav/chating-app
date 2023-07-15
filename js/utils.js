"use strict"

//use cssRoot.style.setProperty("key", "value");
const cssRoot = document.querySelector(':root');

// when run this app in mobile is return true
const isMobile = localStorage.mobile || window.navigator.maxTouchPoints > 1;

// minimum window size
const minSize = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;

const $ = (element) => {
   const self = document.querySelectorAll(element);

   self.each = (fun) => {
      self.forEach(fun);
   }

   self.on = (event, fun) => {
      self.forEach((element) => {
         if (typeof event == "function")
            element.addEventListener("click", event);
         else
            element.addEventListener(event, fun);
      });
   }

   self.text = (text) => {
      self.forEach((element) => {
         element.innerText = text;
      });
   }

   self.html = (html) => {
      self.forEach((element) => {
         element.innerHtml = html;
      });
   }

   self.style = (x = {}, y) => {
      if (!y) {
         const css = Object.entries(x);
         self.forEach((element) => {
            css.forEach(([prorerty, value]) => {
               element.style[prorerty] = value;
            });
         });
      } else {
         self.forEach(element => {
            element.style[x] = y;
         });
      }
   }
   return self;
}

const ID = (element) => {
   const self = document.getElementById(element);

   self.on = (event, fun) => {
      if (typeof event == "function")
         self.addEventListener("click", event);
      else
         self.addEventListener(event, fun);
   }

   self.text = (text) => {
      self.innerText = text;
   }

   self.html = (html) => {
      self.innerHtml = html;
   }

   self.Style = (x = {}, y) => {
      if (!y) {
         const css = Object.entries(x);
         css.forEach(([prorerty, value]) => {
            self.style[prorerty] = value;
         });
      } else {
         self.style[x] = y;
      }
   }
   return self;
};

const Q = (element) => {
   const self = document.querySelector(element);

   self.on = (event, fun) => {
      if (typeof event == "function")
         self.addEventListener("click", event);
      else
         self.addEventListener(event, fun);
   }

   self.text = (text) => {
      self.innerText = text;
   }

   self.html = (html) => {
      self.innerHtml = html;
   }

   self.Style = (x = {}, y) => {
      if (!y) {
         const css = Object.entries(x);
         css.forEach(([prorerty, value]) => {
            self.style[prorerty] = value;
         });
      } else {
         self.style[x] = y;
      }
   }
   return self;
};

Math.toRadian = degree => (degree * Math.PI) / 180;// degree to radian
Math.toRadian = radian => (radian * 180) / Math.PI;// radian to Degree

Math.rnd = (start = 0, end = 1, int_floor = false) => {
   const result = start + (Math.random() * (end - start));
   return int_floor ? Math.floor(result) : result;
}

/* e.x 
(0 start) -------.------ (10 end) input . = 5
(10 min) ----------------.---------------- (30 max) output . = 20
*/
Math.map = (point, start, end, min, max) => {
   return ((max - min) * (point - start) / (end - start)) + min;
}


function hover(element) {
   const elements = typeof element == "object" ? element : [element];
   elements.forEach((ele) => {
      ele.addEventListener("touchstart", () => {
         if (isMobile) ele.classList.add("_on_");
      });
      ele.addEventListener("mouseenter", () => {
         if (!isMobile) ele.classList.add("_on_");
      });

      ele.addEventListener("touchend", () => {
         if (isMobile) ele.classList.remove("_on_");
      });
      ele.addEventListener("mouseleave", () => {
         if (!isMobile) ele.classList.remove("_on_");
      });
   })
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
hover(document.querySelectorAll(".hover"));


/* ----  local storage set and get ---- */
function setDataFromLocalStorage(key, object) {
   var data = JSON.stringify(object);
   localStorage.setItem(key, data);
}
function getDataFromLocalStorage(key) {
   return JSON.parse(localStorage.getItem(key))
}

// class add in html
function addClass(array, className = "active") {
   if (array.length == undefined) {
      array.classList.forEach(() => array.classList.add(className));
   } else {
      array.forEach((element) => element.classList.add(className));
   }
}
// claass remove in html
function removeClass(array, className = "active") {
   if (array.length == undefined) {
      array.classList.forEach(() => array.classList.remove(className));
   } else {
      array.forEach((element) => element.classList.remove(className));
   }
}

// 2d vector create
class Vector {
   constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
   }

   add(value) {
      if (typeof value == "object") {
         this.x += value.x;
         this.y += value.y;
      } else {
         this.x += value;
         this.y += value;
      }
   }

   subtract(value) {
      if (typeof value == "object") {
         this.x -= value.x;
         this.y -= value.y;
      } else {
         this.x -= value;
         this.y -= value;
      }
   }

   multiply(value) {
      if (typeof value == "object") {
         this.x *= value.x;
         this.y *= value.y;
      } else {
         this.x *= value;
         this.y *= value;
      }
   }

   divide(value) {
      if (typeof value == "object") {
         this.x /= value.x;
         this.y /= value.y;
      } else {
         this.x /= value;
         this.y /= value;
      }
   }

   randomWeights() {
      this.x = Math.random() * 2 - 1;
      this.y = Math.random() * 2 - 1;
   }
}


// message modify
function messageModify(message) {
   return message.
      replace(/^\s{1,}/, ""). // starting whitespace and new line (when nathing write anything baln then letter)
      replaceAll(/\n{3,}/g, "\n\n"). // multiple new line
      replaceAll(/^\n+\s{1,}/mg, "\n"). // remove starting balnk space (when write then)
      replaceAll("<", "&#60;").
      replaceAll(">", "&#62;").
      replaceAll(`"`, "&#34;").
      replaceAll(`'`, "&#39;").
      replaceAll("\n", "<br>");
}


// get date for message 
let _hh, _mm, _dt = new Date();
function getChatDate() {
   _dt = new Date();
   _hh = _dt.getHours();
   _mm = _dt.getMinutes();

   return {
      year: _dt.getFullYear(),
      time: `${_hh < 10 ? "0" + _hh : _hh}:${_mm < 10 ? "0" + _mm : _mm}`
   }
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