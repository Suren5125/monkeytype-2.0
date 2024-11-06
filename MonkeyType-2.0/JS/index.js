const timeBtns = document.querySelectorAll(".time")
const timerBar = document.querySelector("#timer");
const container = document.querySelector(".container")
let line = document.querySelector(".line");
let lineWords = [];
let choosenTime = 60;


// ***** Add Words to Array and Line ***** //

function AddWords() {
    for (let i = 0; i < 400; i++) {
        lineWords.push(wordsObj[Math.floor(Math.random() * wordsObj.length)]);
    }

    for (let i = 0; i < lineWords.length; i++) {
        const elem = document.createElement("div")
        elem.classList.add("elem")
        line.appendChild(elem)
    }

    for (let i = 0; i < line.childNodes.length; i++) {
        for (let j = 0; j < lineWords[i].length; j++) {
            const char = document.createElement("span");
            char.textContent = lineWords[i][j];
            line.childNodes[i].appendChild(char)
        }
    }
}

AddWords()

// ***** Choose Time ***** //

timeBtns.forEach(item => {
    item.onclick = () => {
        timeBtns.forEach(element => {
            element.classList.remove("time-active")
        });
        item.classList.add("time-active")
        choosenTime = item.textContent;
        timerBar.textContent = choosenTime;
    }
})

// ***** REFRESH ***** //

const selector = document.querySelector(".selector")
const selectorLeft = selector.offsetLeft
const selectorTop = selector.offsetTop


function Refresh() {
    container.removeChild(line)
    lineWords = []

    line = document.createElement("div")
    line.classList.add("line")
    container.appendChild(line)

    let columnCount = 0;
    let rowCount = 0;

    let Stop = false;
    RefreshStop = true;

    timeBtns.forEach(item => {
        item.disabled = false
        item.classList.replace("disable-time-btn", "time")
    })

    AddWords()

    // ***** KeyDown ****** //

    selector.style.left = selectorLeft + 'px'
    selector.style.top = selectorTop + 'px'

    const chars = document.querySelectorAll("span")
    let count = 0;
    chars[count].classList.add("lastIndex")
    let locked = false;

    let LineLastWords = [];
    let lastRowCount;

    window.addEventListener("keydown", (e) => {
        if (e.key != "Alt" && e.key != "Control" && e.key != "CapsLock" && e.key != "Shift" && e.key != "Tab" && e.key != "Enter" && !Stop) {
            if (e.key != "Backspace") {
                if (e.key === chars[count].textContent) {
                    chars[count].classList.add("white")
                } else {
                    chars[count].classList.add("red")
                }
            }

            if (e.key === "Backspace" && selector.offsetLeft != selectorLeft && count > 0) {
                count -= 1;
                rowCount -= 1;
                chars[count].classList.remove("white")
                chars[count].classList.remove("red")
                chars[count + 1].classList.remove("lastIndex")
            }

            if (e.key != "Backspace") {
                count += 1;
                rowCount += 1;
            }

            if (!locked) {
                locked = true;
                globalTimer()
            }

            if (count > 0) {
                chars[count - 1].classList.remove("lastIndex")
                chars[count].classList.add("lastIndex")
            } else {
                chars[count].classList.add("lastIndex")
            }

            timeBtns.forEach(item => {
                item.disabled = true
                item.classList.replace("time", "disable-time-btn")
            })

            let lastWordData = LineLastWords[columnCount].getBoundingClientRect()

            if(selector.offsetLeft >= lastWordData.x + lastWordData.width - 15 && e.key != "Backspace") {
                columnCount += 1;
                lastRowCount = rowCount ;
                rowCount = 0;
            }

            if(e.key == "Backspace" && selector.offsetLeft == line.childNodes[0].offsetLeft && columnCount != 0) {
                columnCount -= 1;
                rowCount = lastRowCount;
            }

            
            selector.style.left = selectorLeft + (rowCount * 16) + 'px'
            selector.style.top = selectorTop + (columnCount * 48) + 'px'

            RefreshStop = false;
        }
    })

    // ***** TIMER ***** //

    function globalTimer() {
        let second = choosenTime;
        const time = setInterval(Timer, 1000);

        function Timer() {
            if (!Stop) {
                second -= 1;
                timerBar.textContent = second;
                if (second === 0 || RefreshStop === true) {
                    clearInterval(time)
                    Stop = true;
                    timerBar.textContent = choosenTime
                }
            } else {
                clearInterval(time)
                timerBar.textContent = choosenTime
            }
        }
    }

    // ***** Detect last word of line  ******* //

        function detectWidth() {
            for (let i = 1; i < line.childNodes.length; i++) {
                if(line.childNodes[i - 1].offsetTop != line.childNodes[i].offsetTop && line.childNodes[0].offsetLeft === line.childNodes[i].offsetLeft) {
                    LineLastWords.push(line.childNodes[i - 1])
                }
            }
        }

        detectWidth()
}

Refresh()


// ***** Create Line ***** //

// function createLine() {

// }

// createLine()




// ***** Refresh ***** //

const RefreshBtns = document.querySelectorAll(".Refresh")

RefreshBtns.forEach(button => {
    button.onclick = () => {
        button.disabled = true;
        setTimeout(() => {
            button.disabled = false;
        }, 100);
        Refresh()
    }
})

