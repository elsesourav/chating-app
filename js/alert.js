function CE({ tag = "div", parent = document.body, cls, id, text, html, css }) {
    const element = document.createElement(tag);
    if (cls)
        cls.split(" ").forEach(c => {
            element.classList.add(c);
        });

    if (id) element.setAttribute("id", id);
    if (text) element.innerText = text;
    if (html) element.innerHTML = html;
    if (css) element.style = css;
    parent.appendChild(element);
    return element;
}
//{ tag, parent, cls, id, text, html, css }



// CE --> create Element
class AlertHTML {
    constructor({ windowWidth = window.innerWidth, titleIcon, windowHeight = window.innerHeight, width = 250, titleHeight = 50, buttonHeitht = 50, title, message, btnNm1, btnNm2, parent }) {
        this.windowWidth = windowWidth;
        this.windowHeight = windowHeight;
        this.width = width;
        this.titleHeight = titleHeight;
        this.buttonHeitht = buttonHeitht;
        this.titleText = title;
        this.titleIcon = titleIcon;
        this.messageText = message;
        this.btnNm1 = btnNm1;
        this.btnNm2 = btnNm2;
        this.parent = parent;


        // element
        this.msgEle = undefined;
        this.btn1Ele = undefined;
        this.btn2Ele = undefined;

        this.#createHtml();//  Create Html -----------

        this.styleElement = CE(
            {
                tag: "style",
                html: this.#css(),
                parent: document.head
            }
        ) // Applay all css --------------
    }

    #createHtml() {
        this.box = CE({ cls: "_-_a-box", parent: this.parent })
        /**/this.innar = CE({ cls: "_-_a-inner", parent: this.box })

        /**/    this.title = CE({ cls: "_-_a-title", parent: this.innar })
        /**/        CE({ tag: "i", cls: this.titleIcon || "sbi-notification", parent: this.title })
        /**/        CE({ tag: "p", html: this.titleText, parent: this.title })

        /**/    this.message = CE({ cls: "_-_a-message", parent: this.innar })
        /**/        this.msgEle = CE({ tag: "p", html: this.messageText, parent: this.message })

        /**/    this.buttons = CE({ cls: "_-_a-buttons", parent: this.innar })
        /**/        this.button1 = CE({ cls: "_-_a-btn", parent: this.buttons })
        /**/            this.btn1Ele = CE({ tag: "p", html: this.btnNm1, parent: this.button1 })
        /**/        this.button2 = CE({ cls: "_-_a-btn _-_a-b-last", parent: this.buttons })
        /**/            this.btn2Ele = CE({ tag: "p", html: this.btnNm2, parent: this.button2 })
    }

    #css() {
        const isMobile = localStorage.mobile || window.navigator.maxTouchPoints > 1;
        return `
        :root {
            --_-_a-width: ${this.width}px;
            --_-_a-title-height: ${this.titleHeight}px;
            --_-_a-button-height: ${this.buttonHeitht}px;
            --_-_cursor: ${isMobile ? "auto" : "pointer"};
          }
          ._-_a-box {
            position: fixed;
            width: ${this.windowWidth};
            height: ${this.windowHeight};
            inset: 0;
            display: flex;
            transform: scale(0);
            opacity: 0;
            justify-content: center;
            align-items: center;
            background: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(7px);
            transition: 0s;
            transition-delay: 0.2s;
            z-index: 100;
          }
          ._-_a-box.active {
            transition: 0s;
            opacity: 1;
            transform: scale(1);
          }
          ._-_a-box * {
            font-family: "font32";
            font-size: 1rem;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            user-select: none;
          }
          ._-_a-box ._-_a-inner {
            position: relative;
            width: var(--_-_a-width);
            height: auto;
            display: grid;
            grid-template-rows: var(--_-_a-title-height) auto var(--_-_a-button-height);
            border-radius: 10px;
            border-width: 1px;
            border-style: solid;
            border-color: #fff;
            transform: scale(0);
            transition: 0.2s linear;
            overflow: hidden;
          }
          ._-_a-box.active ._-_a-inner {
            transform: scale(1);
          }
          ._-_a-box ._-_a-inner ._-_a-title {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            background: rgba(255, 255, 255, 0.5);
            backdrop-filter: blur(10px);
          }
          ._-_a-box ._-_a-inner ._-_a-title i {
            font-size: 1.3rem;
            color: #000c;
          }
          ._-_a-box ._-_a-inner ._-_a-title p {
            font-weight: 500;
          }
          ._-_a-box ._-_a-inner ._-_a-message {
            position: relative;
            padding: 20px;
            text-align: center;
            background: rgba(255, 255, 255, 0.5);
            backdrop-filter: blur(10px);
          }
          ._-_a-box ._-_a-inner ._-_a-message p {
            font-family: "google";
          }
          ._-_a-box ._-_a-inner ._-_a-buttons {
            position: relative;
            width: 100%;
            height: 100%;
            display: grid;
            grid-template-columns: 1fr 0fr;
            place-items: center;
            overflow: hidden;
          }
          ._-_a-box ._-_a-inner ._-_a-buttons ._-_a-btn {
            --h: 2px;
            position: relative;
            width: calc(100% - var(--h) * 1.5);
            height: calc(100% - var(--h) * 2);
            margin: calc(var(--h) * 2);
            margin-right: calc(var(--h) / 2);
            display: grid;
            place-items: center;
            border-radius: 7px;
            background: rgba(255, 255, 255, 0.5);
            backdrop-filter: blur(10px);
            cursor: var(--_-_cursor);
            z-index: 1;
            overflow: hidden;
          }
          ._-_a-box ._-_a-inner ._-_a-buttons ._-_a-btn._-_a-b-last {
            margin: var(--h);
            margin-left: calc(var(--h) / 2);
          }
          ._-_a-box ._-_a-inner ._-_a-buttons ._-_a-btn::before {
            position: absolute;
            content: "";
            width: 100%;
            height: 100%;
            z-index: -1;
          
            background-repeat: no-repeat;
            background-position: -120px -120px, 0 0;
          
            background-image: -webkit-linear-gradient(
              top left,
              rgba(255, 255, 255, 0.2) 0%,
              rgba(255, 255, 255, 0.2) 37%,
              rgba(255, 255, 255, 0.8) 45%,
              rgba(255, 255, 255, 0) 50%
            );
            background-image: -moz-linear-gradient(
              0 0,
              rgba(255, 255, 255, 0.2) 0%,
              rgba(255, 255, 255, 0.2) 37%,
              rgba(255, 255, 255, 0.8) 45%,
              rgba(255, 255, 255, 0) 50%
            );
            background-image: -o-linear-gradient(
              0 0,
              rgba(255, 255, 255, 0.2) 0%,
              rgba(255, 255, 255, 0.2) 37%,
              rgba(255, 255, 255, 0.8) 45%,
              rgba(255, 255, 255, 0) 50%
            );
            background-image: linear-gradient(
              0 0,
              rgba(255, 255, 255, 0.2) 0%,
              rgba(255, 255, 255, 0.2) 37%,
              rgba(255, 255, 255, 0.8) 45%,
              rgba(255, 255, 255, 0) 50%
            );
          
            -moz-background-size: 250% 250%, 100% 100%;
            background-size: 250% 250%, 100% 100%;
          
            -webkit-transition: background-position 0s ease;
            -moz-transition: background-position 0s ease;
            -o-transition: background-position 0s ease;
            transition: background-position 0s ease;
          }
          ._-_a-box ._-_a-inner ._-_a-buttons ._-_a-btn:hover::before {
            background-position: 0 0, 0 0;
            -webkit-transition-duration: 0.5s;
            -moz-transition-duration: 0.5s;
            transition-duration: 0.5s;
          }
          ._-_a-box ._-_a-inner ._-_a-buttons ._-_a-btn i {
            position: relative;
            width: 100%;
            height: 100%;
          }
        `;
    }

    show() {
        this.box.classList.add("active");
    }    
    hide() {
        this.box.classList.remove("active");
    }

    clickBtn1(fun) {
        this.button1.addEventListener("click", () => {
            fun();
        })
    }

    clickBtn2(fun) {
        this.button2.addEventListener("click", () => {
            fun();
        })
    }

    clickOutside(fun) {
        this.box.addEventListener("click", () => {
            fun();
        })
    }

    setMassage(massage) {
      this.msgEle.innerHTML = massage;
    }

    button1SetName(name) {
      this.btn1Ele.innerHTML = name;
    }
    
    button2SetName(name) {
      this.btn2Ele.innerHTML = name;
    }
}

//{windowWidth,windowHeight,width,titleHeight,buttonHeitht,title,message,btnNm1,btnNm2,parent}


// const a = new AlertHTML({
//     title: "This is title",
//     message: "Youre message hear Please read this message cairefully sourav barui",
//     btnNm1: "No",
//     btnNm2: "Yes",
//     titleHeight: 60,
//     buttonHeitht: 45,
//     width: 290,
//     windowWidth: window.innerWidth,
//     windowHeight: window.innerHeight,

// });

// a.clickOutside(() => {
//     console.log("outside");
// })
// a.clickBtn1(() => {
//     a.hide()
// })
// a.clickBtn2(() => {
//     a.hide()
// })

