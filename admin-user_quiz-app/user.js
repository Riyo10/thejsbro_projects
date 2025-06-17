const quizSelector = document.getElementById('quiz-selector');
const startQuizBtn = document.getElementById('start-quiz-btn');
const quizArea = document.getElementById('quiz-area');

let quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];

function loadQuizOptions() {
  quizSelector.innerHTML = '<option value="">Select a quiz</option>';
  quizzes.forEach((quiz, i) => {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = quiz.title;
    quizSelector.appendChild(option);
  });
  startQuizBtn.disabled = true;
}

quizSelector.addEventListener('change', () => {
  startQuizBtn.disabled = quizSelector.value === '';
});

startQuizBtn.addEventListener('click', () => {
  const idx = quizSelector.value;
  if (idx === '') return;

  currentQuiz = quizzes[idx];
  currentQuestionIndex = 0;
  userAnswers = [];
  quizArea.innerHTML = '';
  renderQuestion();
});

function renderQuestion() {
  const q = currentQuiz.questions[currentQuestionIndex];
  quizArea.innerHTML = '';

  const qTitle = document.createElement('h3');
  qTitle.textContent = `Q${currentQuestionIndex + 1}: ${q.question}`;
  quizArea.appendChild(qTitle);

  const answersDiv = document.createElement('div');

  q.answers.forEach((answer, idx) => {
    const label = document.createElement('label');
    label.style.display = 'block';
    label.style.marginBottom = '0.5rem';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.name = 'answer';
    input.value = idx;
    input.style.marginRight = '0.6rem';

    label.appendChild(input);
    label.appendChild(document.createTextNode(answer));
    answersDiv.appendChild(label);
  });

  quizArea.appendChild(answersDiv);

  const navDiv = document.createElement('div');
  navDiv.className = 'nav-buttons';

  if (currentQuestionIndex > 0) {
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previous';
    prevBtn.onclick = () => {
      saveUserAnswer();
      currentQuestionIndex--;
      renderQuestion();
    };
    navDiv.appendChild(prevBtn);
  }

  if (currentQuestionIndex < currentQuiz.questions.length - 1) {
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.onclick = () => {
      if (!saveUserAnswer()) return;
      currentQuestionIndex++;
      renderQuestion();
    };
    navDiv.appendChild(nextBtn);
  } else {
    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Submit';
    submitBtn.onclick = () => {
      if (!saveUserAnswer()) return;
      showResults();
    };
    navDiv.appendChild(submitBtn);
  }

  quizArea.appendChild(navDiv);

  restoreUserAnswer();
}

function saveUserAnswer() {
  const checkedBoxes = [...quizArea.querySelectorAll('input[name="answer"]:checked')].map(el => Number(el.value));
  if (checkedBoxes.length === 0) {
    alert('Please select at least one answer');
    return false;
  }
  userAnswers[currentQuestionIndex] = checkedBoxes;
  return true;
}

function restoreUserAnswer() {
  const answers = userAnswers[currentQuestionIndex] || [];
  quizArea.querySelectorAll('input[name="answer"]').forEach(input => {
    input.checked = answers.includes(Number(input.value));
  });
}

function showResults() {
  quizArea.innerHTML = '<h2>Results</h2>';

  let score = 0;
  currentQuiz.questions.forEach((q, i) => {
    const userAns = userAnswers[i] || [];
    const correctAns = q.correct;

    const isCorrect =
      userAns.length === correctAns.length &&
      userAns.every(val => correctAns.includes(val));

    if (isCorrect) score++;

    const div = document.createElement('div');
    div.className = 'result-item ' + (isCorrect ? 'correct' : 'incorrect');
    div.innerHTML = `
      <strong>Q${i + 1}:</strong> ${q.question}<br/>
      Your answers: ${userAns.map(a => q.answers[a]).join(', ')}<br/>
      Correct answers: ${correctAns.map(a => q.answers[a]).join(', ')}<br/>
      <strong>${isCorrect ? 'Correct' : 'Incorrect'}</strong>
    `;
    quizArea.appendChild(div);
  });

  const scoreSummary = document.createElement('div');
  scoreSummary.className = 'score-summary';
  scoreSummary.textContent = `Your score: ${score} / ${currentQuiz.questions.length}`;
  quizArea.appendChild(scoreSummary);
}

// Init
loadQuizOptions();
