/*----Boiler Plate ----*/
const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}




/*---- Computer Guess and Computer Secret Num Generator Functions ----*/
function computerGuess(min, max) {
  //let range = max - min+1; 
  //let guess = min + Math.floor(Math.random() * range);
  //return guess;
  let guess = Math.round((min + max) / 2);
  return guess;
}

function setSecretNum(min, max) {
  let range = max - min + 1;
  let secretNum = min + Math.floor(Math.random() * range)
  return secretNum;
}




/*----Validation Functions----*/
async function validateYOrN(question, yOrN) {
  if (typeof yOrN === 'string') {
    yOrN = yOrN.toLowerCase();
  }
  while (yOrN !== 'y' && yOrN !== 'n') {
    yOrN = await ask(`I'm sorry I did not understand.  Please respond with Y or N. \n ${question}`);
    if (typeof yOrN === 'string') {
      yOrN = yOrN.toLowerCase();
    };
  }
  return (yOrN === 'y' ? true : false);
}

async function validateHOrL(question, hOrL) {
  if (typeof hOrL === 'string') {
    hOrL = hOrL.toLowerCase();
  }
  while (hOrL !== 'h' && hOrL !== 'l') {
    hOrL = await ask(`I'm sorry I did not understand.  Please respond with H or L. \n ${question}`);
    if (typeof hOrL === 'string') {
      hOrL = hOrL.toLowerCase();
    };
  }
  return (hOrL === 'h' ? true : false);
}

async function validateInputNum(question, num) {
  //need to handle empty string
  num = +num;
  while (isNaN(num)) {
    num = await ask(`Sorry I needed the response to be a number \n ${question}`)
    num = +num;
  };
  return num;
}




/*----Primary Game Function----*/
//Human Player
async function humanPlays(min, max) {
  let secretNumber = setSecretNum(min, max);
  console.log(`Okay I've picked a secret number, start guessing.`);
  let guessPrompt = `Please enter a guess: `
  let guess = await validateInputNum(guessPrompt, await ask(guessPrompt));
  while (guess < min || guess > max) {
    console.log(`Your number does not fall within the maximum and minimum.  Please choose again.`)
    guess = await validateInputNum(guessPrompt, await ask(guessPrompt));
  }
  let guesses = 1;
  while (guess !== secretNumber) {
    if (guess > secretNumber) {
      console.log(`Sorry your guess was too high, try again.`)
      guess = await validateInputNum(guessPrompt, await ask(guessPrompt));
    }
    else if (guess < secretNumber) {
      console.log(`Sorry your guess was too low, try again.`)
      guess = await validateInputNum(guessPrompt, await ask(guessPrompt));
    }
    guesses++;
  }
  if (guess === secretNumber) {
    console.log(`You win, ${secretNumber} was my secret number.  And it only took you ${guesses} tries.`);
    let playAgainQuestion = `Would you like to play again? Y or N `
    let playAgain = await validateYOrN(playAgainQuestion, await ask(playAgainQuestion))
    if (playAgain) {
      start()
    }
    else {
      process.exit()
    }
  }
}

//Computer player
async function computerPlays(min, max) {
  console.log(`\nSo we have a range from ${min} to ${max}, please pick a number in that range.`);
  let secretNumberQuestion = `What is your secret number?\nI won't peek, I promise...\n`;
  let secretNumber = await validateInputNum(secretNumberQuestion, await ask(secretNumberQuestion));
  while (secretNumber < min || secretNumber > max) {
    console.log(`Your number does not fall within the maximum and minimum.  Please choose again.`)
    secretNumber = await validateInputNum(secretNumberQuestion, await ask(secretNumberQuestion));
  }
  console.log('You entered: ' + secretNumber + '. \nTime for me to guess.');


  //Accept guesses and deal with responses
  let guess = computerGuess(min, max);
  let guessCheck = `Is the number ${guess}? `;
  let isCorrect = await validateYOrN(guessCheck, await ask(guessCheck));
  let guesses = 1;
  while (!isCorrect) {
    if (min === max) {
      console.log(`You cheater!  You said it was higher than ${min - 1} and lower than ${max + 1}\n I quit!`);
      process.exit()
    }
    let hOrLQuestion = `Is the number higher (H) or lower (L) than ${guess}? `;
    let isHigher = await validateHOrL(hOrLQuestion, await ask(hOrLQuestion));
    if (isHigher) {
      min = guess + 1;
    }
    else {
      max = guess - 1;
    }
    if (min > max) {
      console.log(`You cheater!  You said it was higher than ${min} and lower than ${max + 1}.  I quit!`);
      process.exit()
    }
    guess = computerGuess(min, max);
    guessCheck = `Is the number ${guess}? `
    isCorrect = await validateYOrN(guessCheck, await ask(guessCheck));
    guesses++;
  }
  if (isCorrect) {
    console.log(`VICTORY! And I did it in only ${guesses} tries.  Beat that!`);
    let playAgainQuestion = `Would you like to play again? Y or N `
    let playAgain = await validateYOrN(playAgainQuestion, await ask(playAgainQuestion))
    if (playAgain) {
      start()
    }
    else {
      process.exit()
    }
  }
}



//Primary Game Functionality
async function start(isInitialCall = false) {
  if (isInitialCall) {
    //Ask if user would like to play a game, if not quit the program
    let playAGameQuestion = 'Would you like to play a game? Y or N ';
    let playAGameAnswer = await validateYOrN(playAGameQuestion, await ask(playAGameQuestion));
    if (!playAGameAnswer) {
      console.log(`You're no fun!  Goodbye`);
      process.exit()
    }
  console.log(`\nGreat! Let's play a game where one of use makes up a number, and the other tries to guess it..`);
  console.log(`First let's establish a range.\n`);
  }
  else {
    console.log( `Lets set the range. `)
  }

  //Establish min and max
  let getMinQuestion = 'Pick a minimum (inclusive) ';
  let min = await validateInputNum(getMinQuestion, await ask(getMinQuestion));
  let getMaxQuestion = 'Pick a maximum (inclusive) ';
  let max = await validateInputNum(getMaxQuestion, await ask(getMaxQuestion));
  while (max <= min) {
    console.log(`Please choose a maximum that is larger than the minimum;`)
    max = await validateInputNum(getMaxQuestion, await ask(getMaxQuestion));
  }

//Run game for human player or computer player depending on the choice
  let playerQuestion = `Would you like to be the one to guess? Y or N ` 
  let isHumanPlayer = await validateYOrN(playerQuestion, await ask(playerQuestion));
  if (isHumanPlayer) {
    humanPlays(min, max);
  }
  else {
    console.log(`Okay I'll be the one to guess.`);
    computerPlays(min, max)
  }
};



/*--Initial Call--*/
start(true);
