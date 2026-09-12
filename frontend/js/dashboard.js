const API_BASE = 'https://liferpg-backend-t668.onrender.com/api';
const token = localStorage.getItem('token');
let currentUser = JSON.parse(localStorage.getItem('user'));

// Agar login nahi hai, wapas bhej do login page pe
if (!token || !currentUser) {
  window.location.href = 'index.html';
}

// DOM Elements
const playerName = document.getElementById('playerName');
const playerLevel = document.getElementById('playerLevel');
const xpBarFill = document.getElementById('xpBarFill');
const xpCurrent = document.getElementById('xpCurrent');
const xpNeeded = document.getElementById('xpNeeded');
const playerCurrency = document.getElementById('playerCurrency');
const playerStreak = document.getElementById('playerStreak');
const attrIntellect = document.getElementById('attrIntellect');
const attrStrength = document.getElementById('attrStrength');
const attrDiscipline = document.getElementById('attrDiscipline');
const taskList = document.getElementById('taskList');
const addTaskForm = document.getElementById('addTaskForm');
const logoutBtn = document.getElementById('logoutBtn');
const levelUpModal = document.getElementById('levelUpModal');
const newLevelText = document.getElementById('newLevelText');
const closeModal = document.getElementById('closeModal');

// Render Player Stats
function renderPlayerStats(user) {
  playerName.textContent = user.username.toUpperCase();
  playerLevel.textContent = user.level;
  playerCurrency.textContent = user.currency;
  playerStreak.textContent = user.streak?.count || 0;
  attrIntellect.textContent = user.attributes?.intellect || 0;
  attrStrength.textContent = user.attributes?.strength || 0;
  attrDiscipline.textContent = user.attributes?.discipline || 0;

  const needed = user.level * 100;
  const percent = Math.min((user.xp / needed) * 100, 100);
  xpBarFill.style.width = `${percent}%`;
  xpCurrent.textContent = user.xp;
  xpNeeded.textContent = needed;
}

// Fetch & Render Tasks
async function loadTasks() {
  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (!res.ok) {
      console.error(data.message);
      return;
    }

    renderTasks(data.tasks);
  } catch (error) {
    console.error('Failed to load tasks:', error);
  }
}

function renderTasks(tasks) {
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    taskList.innerHTML = '<p class="empty-state">NO ACTIVE MISSIONS. DEPLOY ONE ABOVE.</p>';
    return;
  }

  tasks.forEach((task) => {
    const card = document.createElement('div');
    card.className = `task-card ${task.completed ? 'completed' : ''}`;
    card.innerHTML = `
      <div class="task-info">
        <div class="task-title">${task.title}</div>
        <div class="task-meta">${task.category.toUpperCase()} • +${task.xpReward} XP</div>
      </div>
      <div class="task-actions">
        ${!task.completed ? `<button class="complete-btn" data-id="${task._id}">COMPLETE</button>` : ''}
        <button class="delete-btn" data-id="${task._id}">DELETE</button>
      </div>
    `;
    taskList.appendChild(card);
  });

  // Attach event listeners
  document.querySelectorAll('.complete-btn').forEach((btn) => {
    btn.addEventListener('click', () => completeTask(btn.dataset.id));
  });
  document.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', () => deleteTask(btn.dataset.id));
  });
}

// Add Task
addTaskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('taskTitle').value;
  const category = document.getElementById('taskCategory').value;
  const xpReward = document.getElementById('taskXP').value;

  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, category, xpReward: Number(xpReward) }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message);
      return;
    }

    addTaskForm.reset();
    document.getElementById('taskXP').value = 10;
    loadTasks();
  } catch (error) {
    console.error('Failed to add task:', error);
  }
});

// Complete Task
async function completeTask(id) {
  try {
    const res = await fetch(`${API_BASE}/tasks/${id}/complete`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message);
      return;
    }

    // Update local user data
    currentUser = data.updatedUser;
    localStorage.setItem('user', JSON.stringify(currentUser));
    renderPlayerStats(currentUser);
    loadTasks();

    // Show level up modal if leveled up
    if (data.leveledUp) {
      newLevelText.textContent = `RANK ${currentUser.level} ACHIEVED`;
      levelUpModal.classList.remove('hidden');
    }
  } catch (error) {
    console.error('Failed to complete task:', error);
  }
}

// Delete Task
async function deleteTask(id) {
  if (!confirm('Abandon this mission?')) return;

  try {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) loadTasks();
  } catch (error) {
    console.error('Failed to delete task:', error);
  }
}

// Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
});

// Close Level Up Modal
closeModal.addEventListener('click', () => {
  levelUpModal.classList.add('hidden');
});

// Initial Load
renderPlayerStats(currentUser);
loadTasks();