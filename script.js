let categoryOne = document.querySelectorAll(".category-one");
let categoryTwo = document.querySelectorAll(".category-two");
let category = document.querySelectorAll(".category");
let next = document.querySelector(".next");
let prev = document.querySelector(".previous");
let option = document.querySelectorAll(".option");
let score = document.querySelector(".score");
let timer = document.querySelector(".timer");
let yourScore = document.querySelector(".yourScore");
let landingPage = document.querySelector(".landingPage");
let categoryPage = document.querySelector(".category-page");
let mainGame = document.querySelector(".main-game");
let start = document.querySelector(".start");
let resetQues = document.querySelector(".resetQues");
let resetCatg = document.querySelector(".resetCatg");
let scoreCard = document.querySelector(".scoreCard");
let questionUpdt = document.querySelector(".question");
let nextQuestion = document.querySelector(".nextQuestion");

let updatedUrl;
let apiDataGlobal;
let quesNo = 1;
let scores = 0;
let timeInterval;
let time = 0;

start.addEventListener("click", () => {
  landingPage.classList.add("displayNone");
});
next.addEventListener("click", () => {
  categoryOne.forEach((cat) => {
    cat.classList.add("displayNone");
  });
  categoryTwo.forEach((cut) => {
    cut.classList.add("displayBlock");
  });
});

prev.addEventListener("click", () => {
  categoryOne.forEach((cat) => {
    cat.classList.remove("displayNone");
  });
  categoryTwo.forEach((cut) => {
    cut.classList.remove("displayBlock");
  });
});

// trying to acess no written inside id to edit category in api url
category.forEach((c) => {
  c.addEventListener("click", async () => {
    updatedUrl = `https://opentdb.com/api.php?amount=10&category=${c.id}&difficulty=easy&type=multiple`;
    await getQuiz(updatedUrl);
    categoryPage.classList.add("displayNone");
    mainGame.classList.remove("displayNone");
    gameStart();
  });
});

// getting quiz data from api
const getQuiz = async (url) => {
  console.log("geting data");
  let response = await fetch(url);
  console.log(response);
  let data = await response.json();
  console.log(data);
  apiDataGlobal = data;
  ques_ans(data, 0);
  for (let index = 0; index < 10; index++) {
    console.log(data.results[index].correct_answer);
  }
};
function rightEventHandler(e) {
  scores++;
  updateScore(scores);
  e.target.classList.add("correct");
  const wait = setTimeout(() => {
    handler();
  }, 1500);
}
function wrongEventHandler(e) {
  e.target.classList.add("wrong");
  const wait = setTimeout(() => {
    handler();
  }, 1500);
}

// update question and answers
function ques_ans(apiData, k) {
  questionUpdt.innerText = decodeHtmlEntities(apiData.results[k].question);
  console.log(k);
  let x = Math.floor(Math.random() * 4);
  let j = 0;

  for (let i = 0; i < option.length; i++) {
    if (i === x) {
      option[i].innerText = decodeHtmlEntities(
        apiData.results[k].correct_answer
      );
      option[i].addEventListener("click", rightEventHandler);
    } else {
      option[i].innerText = decodeHtmlEntities(
        apiData.results[k].incorrect_answers[j]
      );
      option[i].addEventListener("click", wrongEventHandler);
      j++;
    }
  }
}

// updating ques and ans when next button is clicked
nextQuestion.addEventListener("click", handler);

function handler() {
  console.log(" skip clicked or time was over");
  option.forEach((opt) => {
    opt.removeEventListener("click", rightEventHandler);
    opt.removeEventListener("click", wrongEventHandler);

    opt.classList.remove("correct");
    opt.classList.remove("wrong");

    time = 0;
  });

  try {
    ques_ans(apiDataGlobal, quesNo);
  } catch (error) {
    console.log(error);
  }

  if (quesNo === 10) {
    console.log("entered");
    clearInterval(timeInterval);
    updtFinalScore();
    mainGame.classList.add("displayNone");
    scoreCard.classList.remove("displayNone");
  }
  quesNo++;
}

// just a fuction to convert htmllike text into text for eg &quto s &quoto to "s"
function decodeHtmlEntities(text) {
  const element = document.createElement("div");
  if (text) {
    element.innerHTML = text;
    return element.textContent;
  } else {
    return "";
  }
}

function updateScore(scoreCount) {
  score.innerText = `Score ${scoreCount}/10`;
}

// setting timer

function gameStart() {
  timeInterval = setInterval(() => {
    timer.innerHTML = `Time Left ${time}`;
    if (time === 10) {
      handler();
    }
    time++;
  }, 1000);
}

//updating Final score in sccoreCard
function updtFinalScore() {
  yourScore.innerHTML = `Your Score : ${scores}`;
}

resetQues.addEventListener("click", () => {
  scoreCard.classList.add("displayNone");
  mainGame.classList.remove("displayNone");
  quesNo = 1;
  scores = 0;
  updateScore(scores);
  getQuiz(updatedUrl);
  gameStart();
});

resetCatg.addEventListener("click", () => {
  scoreCard.classList.add("displayNone");
  categoryPage.classList.remove("displayNone");
  quesNo = 1;
  scores = 0;
  updateScore(scores);
});
