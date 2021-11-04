/*----Boiler Plate ----*/
const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}


  /*---- Guessing Function ----*/
  function computerGuess(min, max) {
    //let guess = min + Math.floor(Math.random() * range);
    //return guess;
    let smartGuess = Math.round((min + max) / 2);
    return smartGuess;
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
async function start() {
    //Ask if user would like to play a game, if not quit the program
    let playAGameQuestion = 'Would you like to play a game?';
    let playAGameAnswer = await validateYOrN(playAGameQuestion, await ask(playAGameQuestion));
    if (!playAGameAnswer) {
      console.log(`You're no fun!  Goodbye`);
      process.exit()
    }

    //Establish min and max and get the secret number
    console.log(`\nGreat! Let's play a game where you (human) make up a number and I (computer) try to guess it.`);
    console.log(`First let's establish a range.\n`);
    let getMinQuestion = 'Pick a minimum (inclusive) ';
    let min = await validateInputNum(getMinQuestion, await ask(getMinQuestion));
    let getMaxQuestion = 'Pick a maximum (inclusive) ';
    let max = await validateInputNum(getMaxQuestion, await ask(getMaxQuestion));
    while (max <= min) {
      console.log(`Please choose a maximum that is larger than the minimum;`)
      max = await validateInputNum(getMaxQuestion, await ask(getMaxQuestion));
    }
    console.log(`\nOkay now we have a range, please pick a number in that range.`);
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
    }
    if (isCorrect) {
      console.log('VICTORY!');
      process.exit();
    }
};



/*--Initial Call--*/
start();
