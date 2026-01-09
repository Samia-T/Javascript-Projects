// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations
let quesAmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let bestScoreArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0';


// Scroll
let valueY = 0;

// refresh splash page best scores
function bestScoresToDOM() {
  bestScores.forEach((bestScore, index) => {
    const bestScoreEl = bestScore;
    bestScoreEl.textContent = `${bestScoreArray[index].bestScore}s`;
  })
}


// check local storage for best scores set bestscorearray
function getSavedBestScores() {
  if (localStorage.getItem('bestScores')) {
    bestScoreArray = JSON.parse(localStorage.bestScores);
  } else {
    bestScoreArray = [
      {questions: 10, bestScore: finalTimeDisplay},
      {questions: 25, bestScore: finalTimeDisplay},
      {questions: 50, bestScore: finalTimeDisplay},
      {questions: 99, bestScore: finalTimeDisplay},
    ];
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray))
  }
  bestScoresToDOM();
}

// Update Best Score Array
function updateBestScore() {
  bestScoreArray.forEach((score, index) => {
    // select correct Best Score to update
    if (quesAmount == score.questions) {
      // Return best Score as number with one decimal
      const savedBestScore = Number(bestScoreArray[index]. bestScore);
      // update if new final score is less or replacinf zero
      if (savedBestScore === 0 || savedBestScore > finalTime) {
        bestScoreArray[index].bestScore = finalTimeDisplay;
      }
    }
  });
  // update splash page
  bestScoresToDOM();
  // save to local storage
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
}

// reset game
function playAgain() {
  gamePage.addEventListener('click', startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  equationsArray = [];
  playerGuessArray = [];
  valueY = 0;
  playAgainBtn.hidden = true;

}

// show score page
function showScorePage() {
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 700);
  gamePage.hidden = true;
  scorePage.hidden = false;
}

// format & display time in DOM
function scoresToDOM() {
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  baseTimeEl.textContent = `Base Time: ${baseTime}s`;
  penaltyTimeEl.textContent = `Penalty Time: +${penaltyTime }s`;
  finalTimeEl.textContent = `${finalTimeDisplay}s`;
  updateBestScore();
  // scroll to top, go to score page
  itemContainer.scrollTo({ top:0, behavior: 'instant'});
  showScorePage();
}

// stop timer, process results, go to score page
function checkTime() {
  console.log(timePlayed);
  if (playerGuessArray.length == quesAmount) {
    console.log('player guess arr', playerGuessArray);
    clearInterval(timer);
    // check for wrong guess, add penalty
    equationsArray.forEach((equation, index) => {
      if (equation.evaluated === playerGuessArray[index]) {
        // corr guess, no pen
      } else {
        penaltyTime += 0.5;
      }
    });
    finalTime = timePlayed + penaltyTime;
    console.log(timePlayed, penaltyTime, finalTime);
    scoresToDOM();
  }
}

// add a tenth of a second to timePlayed
function addTime() {
  timePlayed += 0.1;
  checkTime();
}

// start timer when game page clicked
function startTimer() {
  // reset times
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener('click', startTimer);
}

// scroll, store user selection in playerGuessArray
function select(guessedTrue) {
  // scroll 80 pixels
  valueY += 80;
  itemContainer.scroll(0, valueY);
  // Add player guess to array
  return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push('false');
}

// display game page
function showGamePage() {
  gamePage.hidden = false;
  countdownPage.hidden = true;
}

// get rand num upto max
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(quesAmount);
  // Set amount of wrong equations
  const wrongEquations = quesAmount - correctEquations;
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
}

// add equations to DOM
function equationsToDOM() {
  equationsArray.forEach((equation) => {
    // item
    const item = document.createElement('div');
    item.classList.add('item');
    // equation text
    const equationText = document.createElement('h1');
    equationText.textContent = equation.value;
    // append
    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDOM();

  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}

// Actually counts down
function countdownStart() {
  let countDown = 3;
  countdown.textContent = countDown;
  const timeCountDown = setInterval(() => {
    countDown--;
    if (countDown === 0) {
      countdown.textContent = 'GO!';
    } else if (countDown === -1) {
      showGamePage();
      clearInterval(timeCountDown);
    } else {
      countdown.textContent = countDown;
    }
  }, 800);
}

// show countdown from splash
function showCountdown() {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  populateGamePage();
  countdownStart();
}

// get value from selected rad button
function getRadioValue() {
  let radioValue;
  radioInputs.forEach((radioInput) => {
    if (radioInput.checked)  {
      radioValue = radioInput.value;
    } 
    
  });
  return radioValue;  
}

// form that decides amount of questions
function selectQuesAmount(e) {
  e.preventDefault();
  quesAmount = getRadioValue();
  if (quesAmount) showCountdown();
}

startForm.addEventListener('click', () => {
  radioContainers.forEach((radioEl) => {
    // remove selected label styling
    radioEl.classList.remove('selected-label');
    // add back if radio input is checked
    if (radioEl.children[1].checked) {
      radioEl.classList.add('selected-label');
    }
  })
})

// event listener
startForm.addEventListener('submit', selectQuesAmount);
gamePage.addEventListener('click', startTimer);

// On Load
getSavedBestScores();