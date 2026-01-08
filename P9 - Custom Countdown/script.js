const inputContainer = document.getElementById('input-container');
const countdownFrom = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElem = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = Date;
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour =  minute * 60;
const day = hour * 24;

// set date inp min to current date
const today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today);

// populate countdown /
function updateDOM() {
    countdownActive = setInterval(() => {
        const now = new Date().getTime();
        const distance =  countdownValue - now;

        const days = Math.floor(distance / day);
        const hours = Math.floor((distance % day) / hour);
        const minutes = Math.floor((distance % hour) / minute);
        const seconds = Math.floor((distance % minute) / second);

        // hide input
        inputContainer.hidden = true;

        // if countdown done, show complete
        if (distance < 0) {
            countdownEl.hidden = true;
            clearInterval(countdownActive);
            completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
            completeEl.hidden = false;
        } else {
            // show countdown in prog
            countdownElTitle.textContent = `${countdownTitle}`;
            timeElem[0].textContent = `${days}`;
            timeElem[1].textContent = `${hours}`;
            timeElem[2].textContent = `${minutes}`;
            timeElem[3].textContent = `${seconds}`;
            completeEl.hidden = true;
            countdownEl.hidden = false;
        }
    }, second);
    
}

// take val from form
function updateCountdown(e) {
    e.preventDefault();
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate,
    };
    localStorage.setItem('countdown', JSON.stringify(savedCountdown));
    // check for valid date
    if (countdownDate) {
        // get number version of current date, update dom
        countdownValue = new Date(countdownDate).getTime();
        console.log(countdownTitle, countdownValue);
        updateDOM();
    } else {
        alert('please select a date for the countdown.');
    }
}

// reset all values
function reset() {
    // hide countdowns,show input
    countdownEl.hidden = true;
    completeEl.hidden = true;
    inputContainer.hidden = false;
    // stop countdown
    clearInterval(countdownActive);
    // reset values
    countdownTitle = '';
    countdownDate = '';
    localStorage.removeItem('countdown')
}

function restorePrevCountdown() {
    // get cd from local storage if available
    if (localStorage.getItem('countdown')) {
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

// event listeners
countdownFrom.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// on load, check local storage
restorePrevCountdown();