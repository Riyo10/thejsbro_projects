const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const search = document.getElementById('search');
const progress = document.getElementById('progress');
const darkToggle = document.getElementById('dark-toggle');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// === SMART HELPERS ===

function autoCategory(text) {
  if (/bill|money|payment/i.test(text)) return 'finance';
  if (/doctor|medicine|health/i.test(text)) return 'health';
  if (/project|meeting|client/i.test(text)) return 'work';
  if (/milk|eggs|bread|grocery/i.test(text)) return 'groceries';
  return 'general';
}

function parseDueDate(text) {
  const now = new Date();
  if (/today/i.test(text)) return now.toDateString();
  if (/tomorrow/i.test(text)) {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    return t.toDateString();
  }

  const dateMatch = text.match(/\b\d{1,2}\/\d{1,2}(\/\d{2,4})?\b/);
  return dateMatch ? dateMatch[0] : 'unspecified';
}

function detectPriority(text) {
  if (/urgent|‼️/i.test(text)) return 'high';
  if (/important/i.test(text)) return 'medium';
  return 'low';
}

function isOverdue(task) {
  const d = new Date(task.due);
  const today = new Date();
  return !isNaN(d) && d < today && !task.done;
}

// === MAIN FUNCTIONS ===

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const task = parseTask(text);
  tasks.push(task);
  input.value = '';
  saveAndRender();
});

function parseTask(text) {
  const hashtagMatch = text.match(/#\w+/g) || [];
  const category = hashtagMatch.length ? hashtagMatch.map(tag => tag.substring(1)).join(', ') : autoCategory(text);
  const due = parseDueDate(text);
  const priority = detectPriority(text);

  const cleanedText = text
    .replace(/#\w+/g, '')
    .replace(/\b(today|tomorrow|\d{1,2}\/\d{1,2}(\/\d{2,4})?)\b/i, '')
    .replace(/\burgent|important|‼️/gi, '')
    .trim();

  return {
    text: cleanedText,
    category,
    due,
    priority,
    done: false,
    id: Date.now()
  };
}

function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
  showProgress();
}

function renderTasks(taskArray = tasks) {
  list.innerHTML = '';

  taskArray.sort((a, b) => {
    const dateA = new Date(a.due), dateB = new Date(b.due);
    if (!isNaN(dateA - dateB) && dateA - dateB !== 0) return dateA - dateB;

    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  taskArray.forEach(task => {
    const li = document.createElement('li');
    li.classList.add(task.priority);
    if (task.done) li.classList.add('done');
    if (isOverdue(task)) li.classList.add('overdue');

    li.innerHTML = `
      <div>
        <strong>${task.text}</strong>
        <div class="task-meta">
          ${task.due} | 🏷️ ${task.category} | ⭐ ${task.priority}
        </div>
      </div>
      <div>
        <input type="checkbox" ${task.done ? 'checked' : ''} />
        <button class="delete-btn">🗑️</button>
      </div>
    `;

    li.querySelector('input').addEventListener('change', () => {
      task.done = !task.done;
      saveAndRender();
    });

    li.querySelector('.delete-btn').addEventListener('click', () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveAndRender();
    });

    list.appendChild(li);
  });
}

search.addEventListener('input', () => {
  const q = search.value.toLowerCase();
  const filtered = tasks.filter(task => task.text.toLowerCase().includes(q));
  renderTasks(filtered);
});

function showProgress() {
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  progress.textContent = `✅ ${done} / 📋 ${total}`;
}

// Dark Mode Toggle
darkToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

// Restore theme
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
}

// Initial render
renderTasks();
showProgress();
