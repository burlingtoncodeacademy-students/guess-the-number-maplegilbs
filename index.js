/*----Boiler Plate ----*/
const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}
/*--Globals--*/



/*---- Functions ----*/
function computerGuess(min, max) {
  //let guess = min + Math.floor(Math.random() * range);
  //return guess;
  let smartGuess =Math.round(min+max/2);
  return smartGuess;
}

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

async function validateInputNum(question, num) {
  num = +num;
  while (isNaN(num)) {
    num = await ask(`Sorry I needed the response to be a number \n ${question}`)
    num = +num;
  };
  return num;
}

start();

async function start() {
  let playAGameQuestion = 'Would you like to play a game?';
  let playAGameAnswer = await validateYOrN(playAGameQuestion, await ask(playAGameQuestion));
  if (!playAGameAnswer) {
    console.log(`You're no fun!  Goodbye`);
    process.exit()
  }
  console.log(`Great! Let's play a game where you (human) make up a number and I (computer) try to guess it.`);
  console.log(`First let's establish a range`);
  let getMinQuestion = 'Pick a minimum (inclusive) ';
  let min = await validateInputNum(getMinQuestion, await ask(getMinQuestion));
  let getMaxQuestion = 'Pick a maximum (inclusive) ';
  let max = await validateInputNum(getMaxQuestion, await ask(getMaxQuestion));
  while (max <= min) {
    console.log(`Please choose a maximum that is larger than the minimum;`)
    max = await validateInputNum(getMaxQuestion, await ask(getMaxQuestion));
  }
  console.log(`Okay now we have a range, please pick a number in that range.`);
  let secretNumberQuestion = `What is your secret number?\nI won't peek, I promise...\n`;
  let secretNumber = await validateInputNum(secretNumberQuestion, await ask(secretNumberQuestion));
  while (secretNumber < min || secretNumber > max) {
    console.log(`Your number does not fall within the maximum and minimum.  Please choose again.`)
    secretNumber = await validateInputNum(secretNumberQuestion, await ask(secretNumberQuestion));
  }
  console.log('You entered: ' + secretNumber);


  
}











// let answer;
//   do {
//     let guess = computerGuess(min, max);
//     answer = await ask(`Is the number ${guess}?`);
//     answer = answer.toLowerCase();
//     if (answer === 'y') {
//       console.log('You win!');
//       process.exit();
//     }
//     else {
//       let hiLow = await ask(`Is the number higher(h) or lower(l) than ${guess}?`);
//       hiLow = hiLow.toLowerCase();
//       while (hiLow !== 'h' && hiLow !== 'l') {
//         hiLow = await ask(`Sorry didn't understand, is the number higher(h) or lower(l) than ${guess}?`);
//         console.log(hiLow);
//       }
//       if (hiLow == 'h') {
//         min = guess;
//       }
//       else {
//         max = guess;
//       }
//     }
//     } while (answer !== 'y')
//   process.exit();
// }
