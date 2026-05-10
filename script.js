let userData = {
    username: "",
    coins: 0,
    level: 1,
    xp: 0
};

// Check LocalStorage
window.onload = () => {
    const saved = localStorage.getItem('routineGamingData');
    if (saved) {
        userData = JSON.parse(saved);
        showDashboard();
    }
};

function handleAuth() {
    const user = document.getElementById('username');
    const pass = document.getElementById('password');
    const error = document.getElementById('error-msg');
    const box = document.querySelector('.glass-box');

    if (!user.value || !pass.value) {
        box.classList.add('error-shake');
        error.style.display = "block";
        error.innerText = "Error: Access Denied";
        setTimeout(() => box.classList.remove('error-shake'), 400);
    } else {
        userData.username = user.value;
        showDashboard();
        save();
    }
}

function showDashboard() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app-screen').style.display = 'block';
    updateUI();
}

function updateUI() {
    document.getElementById('display-name').innerText = userData.username.toUpperCase();
    document.getElementById('coin-count').innerText = userData.coins;
    document.getElementById('pet-level').innerText = userData.level;
    document.getElementById('xp-fill').style.width = userData.xp + "%";
}

function addTask() {
    const input = document.getElementById('task-input');
    if (!input.value) return;

    const list = document.getElementById('task-list');
    const id = Date.now();
    const li = document.createElement('li');
    li.id = `task-${id}`;
    li.innerHTML = `
        <span style="font-family: 'Rajdhani'; font-weight: bold;">${input.value}</span>
        <button class="btn-done" onclick="completeTask(${id})">DONE</button>
    `;
    list.appendChild(li);
    input.value = "";
}

function completeTask(id) {
    userData.coins += 25;
    userData.xp += 20;
    if (userData.xp >= 100) {
        userData.level++;
        userData.xp = 0;
    }
    document.getElementById(`task-${id}`).remove();
    updateUI();
    save();
}

function save() { localStorage.setItem('routineGamingData', JSON.stringify(userData)); }

function logout() {
    localStorage.removeItem('routineGamingData');
    location.reload();
}44