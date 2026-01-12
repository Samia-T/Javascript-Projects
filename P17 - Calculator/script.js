const calculatorDisplay = document.querySelector('h1');
const inputBtns = document.querySelectorAll('button');
const clearBtn = document.getElementById('clear-btn');

// calculate first and second val depending on operator
const calculate = {
    '/': (firstNumber, sendNumber) => firstNumber / sendNumber,

    '*': (firstNumber, sendNumber) => firstNumber * sendNumber,

    '-': (firstNumber, sendNumber) => firstNumber - sendNumber,

    '+': (firstNumber, sendNumber) => firstNumber + sendNumber,

    '=': (firstNumber, sendNumber) => sendNumber,

};

let firstValue = 0;
let operatorValue = '';
let awaitingNextValue = false;

function sendNumberValue(number) {
    // replace current display value if first value is entered
    if (awaitingNextValue) {
        calculatorDisplay.textContent = number;
        awaitingNextValue = false;
    } else {
         // if current display value is 0, replace it, if not add number
        const displayValue =  calculatorDisplay.textContent;
        calculatorDisplay.textContent = displayValue === '0' ? number : displayValue + number;
    }
}

function addDecimal() {
    // if operator pressed, dont add dec
    if (awaitingNextValue) return;
    // if no dec, add dec
    if (!calculatorDisplay.textContent.includes('.')) {
        calculatorDisplay.textContent = `${calculatorDisplay.textContent}.`;
    }
}

function useOperator(operator) {
    const currentValue = Number(calculatorDisplay.textContent);
    // prevent multiple operators
    if (operator && awaitingNextValue) {
        operatorValue = operator;
        return;  
    }
    // assign first val if no val
    if (!firstValue) {
        firstValue = currentValue;
    } else {
        const calculation = calculate[operatorValue](firstValue, currentValue);
        calculatorDisplay.textContent = calculation;
        firstValue = calculation;
    }
    // ready for next val, store operator
    awaitingNextValue = true;
    operatorValue = operator;
}

// reset all values, display
function resetAll() {
    firstValue = 0;
    operatorValue = '';
    awaitingNextValue = false;
    calculatorDisplay.textContent = '0'
}

// add event listeners for nums, ops, dec btn
inputBtns.forEach((inputBtn) => {
    if (inputBtn.classList.length === 0) {
        inputBtn.addEventListener('click', () => sendNumberValue(inputBtn.value));
    } else if (inputBtn.classList.contains('operator')) {
        inputBtn.addEventListener('click', () => useOperator(inputBtn.value));
    } else if (inputBtn.classList.contains('decimal')) {
        inputBtn.addEventListener('click', addDecimal);
    }
});

// event listener
clearBtn.addEventListener('click', resetAll);