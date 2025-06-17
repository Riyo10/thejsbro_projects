// Elements
const quizTitleInput = document.getElementById('quiz-title');
const questionsContainer = document.getElementById('questions-container');
const addQuestionBtn = document.getElementById('add-question-btn');
const saveQuizBtn = document.getElementById('save-quiz-btn');

// Load quizzes or create empty
let quizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');

function createQuestionElement(index, data = null) {
  const div = document.createElement('div');
  div.className = 'question-block';
  div.dataset.index = index;

  const qLabel = document.createElement('label');
  qLabel.textContent = `Question ${index + 1}`;
  qLabel.style.fontWeight = '600';
  div.appendChild(qLabel);

  const qInput = document.createElement('textarea');
  qInput.rows = 2;
  qInput.placeholder = 'Enter question text';
  if (data) qInput.value = data.question;
  div.appendChild(qInput);

  const answersDiv = document.createElement('div');
  answersDiv.className = 'answers-container';

  for (let i = 0; i < 4; i++) {
    const answerDiv = document.createElement('div');
    answerDiv.className = 'answer-input';

    const answerInput = document.createElement('input');
    answerInput.type = 'text';
    answerInput.placeholder = `Answer option ${i + 1}`;
    if (data) answerInput.value = data.answers[i];
    answerDiv.appendChild(answerInput);

    const correctCheckbox = document.createElement('input');
    correctCheckbox.type = 'checkbox';
    correctCheckbox.className = 'correct-checkbox';
    correctCheckbox.title = 'Mark as correct answer';
    if (data && data.correct.includes(i)) {
      correctCheckbox.checked = true;
    }
    answerDiv.appendChild(correctCheckbox);

    answersDiv.appendChild(answerDiv);
  }

  div.appendChild(answersDiv);

  return div;
}

function addQuestion(data = null) {
  const idx = questionsContainer.children.length;
  const qElem = createQuestionElement(idx, data);
  questionsContainer.appendChild(qElem);
}

function gatherQuiz() {
  const title = quizTitleInput.value.trim();
  if (!title) {
    alert('Quiz title is required');
    return null;
  }

  const questions = [];
  for (let i = 0; i < questionsContainer.children.length; i++) {
    const block = questionsContainer.children[i];
    const questionText = block.querySelector('textarea').value.trim();
    if (!questionText) {
      alert(`Question ${i + 1} text is empty`);
      return null;
    }

    const answerInputs = block.querySelectorAll('.answer-input input[type="text"]');
    const correctBoxes = block.querySelectorAll('.answer-input input[type="checkbox"]');

    let answers = [];
    let correct = [];
    for (let j = 0; j < 4; j++) {
      const ans = answerInputs[j].value.trim();
      if (!ans) {
        alert(`Answer option ${j + 1} in question ${i + 1} is empty`);
        return null;
      }
      answers.push(ans);
      if (correctBoxes[j].checked) correct.push(j);
    }
    if (correct.length === 0) {
      alert(`Please mark at least one correct answer in question ${i + 1}`);
      return null;
    }

    questions.push({ question: questionText, answers, correct });
  }

  return { title, questions };
}

addQuestionBtn.addEventListener('click', () => {
  addQuestion();
});

saveQuizBtn.addEventListener('click', () => {
  const quiz = gatherQuiz();
  if (!quiz) return;

  quizzes.push(quiz);
  localStorage.setItem('quizzes', JSON.stringify(quizzes));
  alert('Quiz saved successfully!');

  // Reset form
  quizTitleInput.value = '';
  questionsContainer.innerHTML = '';
});
