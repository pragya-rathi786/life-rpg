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
   const difficulty = document.getElementById('taskDifficulty').value;

  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
       body: JSON.stringify({ title, category, difficulty }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message);
      return;
    }

    addTaskForm.reset();
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
// SHOP LOGIC
const shopList = document.getElementById('shopList');
const inventoryList = document.getElementById('inventoryList');

async function loadShop() {
  try {
    const res = await fetch(`${API_BASE}/shop/items`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    renderShop(data.items);
  } catch (error) {
    console.error('Failed to load shop:', error);
  }
}

function renderShop(items) {
  shopList.innerHTML = '';

  items.forEach((item) => {
    const owned = currentUser.inventory?.some((inv) => inv.itemName === item.name);
    const canAfford = currentUser.currency >= item.cost;

    const div = document.createElement('div');
    div.className = 'shop-item';
    div.innerHTML = `
      <div>
        <div class="shop-item-info">${item.emoji} ${item.name}</div>
        <div class="shop-item-cost">${item.cost} CREDITS</div>
      </div>
      ${owned
        ? '<span class="owned-badge">✓ OWNED</span>'
        : `<button class="buy-btn" data-id="${item.id}" ${!canAfford ? 'disabled' : ''}>BUY</button>`
      }
    `;
    shopList.appendChild(div);
  });

  document.querySelectorAll('.buy-btn').forEach((btn) => {
    btn.addEventListener('click', () => buyItem(btn.dataset.id));
  });
}

async function buyItem(itemId) {
  try {
    const res = await fetch(`${API_BASE}/shop/buy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ itemId }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message);
      return;
    }

    currentUser = data.updatedUser;
    localStorage.setItem('user', JSON.stringify(currentUser));
    renderPlayerStats(currentUser);
    renderShop(SHOP_ITEMS_CACHE);
    renderInventory();
  } catch (error) {
    console.error('Failed to buy item:', error);
  }
}

function renderInventory() {
  inventoryList.innerHTML = '';

  if (!currentUser.inventory || currentUser.inventory.length === 0) {
    inventoryList.innerHTML = '<p class="empty-state">NO ITEMS OWNED YET.</p>';
    return;
  }

  currentUser.inventory.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'inventory-item';
    div.textContent = item.itemName;
    inventoryList.appendChild(div);
  });
}

let SHOP_ITEMS_CACHE = [];
async function initShop() {
  try {
    const res = await fetch(`${API_BASE}/shop/items`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    SHOP_ITEMS_CACHE = data.items;
    renderShop(SHOP_ITEMS_CACHE);
    renderInventory();
  } catch (error) {
    console.error('Failed to init shop:', error);
  }
}

initShop();
