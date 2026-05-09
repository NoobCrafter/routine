// --- 1. INITIALISIERUNG & SPEICHER ---
let userData = {
    username: "",
    coins: 0,
    level: 1,
    xp: 0,
    tasks: [],
    currentDay: "Mo"
};

// Lädt Daten beim Start der Seite
window.onload = function() {
    const savedData = localStorage.getItem('routineGamingData');
    if (savedData) {
        userData = JSON.parse(savedData);
        renderFromStorage();
    }
};

function saveToDisk() {
    localStorage.setItem('routineGamingData', JSON.stringify(userData));
}

// --- 2. AUTH & UI ---
function handleAuth() {
    const userField = document.getElementById('username').value;
    if (userField) {
        userData.username = userField;
        updateUI();
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app-screen').style.display = 'block';
        saveToDisk();
    } else {
        alert("Bitte Operator-Name eingeben!");
    }
}

function updateUI() {
    document.getElementById('display-name').innerText = userData.username.toUpperCase();
    document.getElementById('coin-count').innerText = userData.coins;
    document.getElementById('pet-level').innerText = userData.level;
    document.getElementById('xp-fill').style.width = userData.xp + "%";
    checkPetEvolution();
}

function renderFromStorage() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app-screen').style.display = 'block';
    updateUI();
}

// --- 3. MISSIONEN MIT 5 MINUTEN SPERRE ---
function addTask() {
    const input = document.getElementById('task-input');
    if (input.value.trim() !== "") {
        const taskList = document.getElementById('task-list');
        const taskId = Date.now(); 
        const li = document.createElement('li');
        li.id = `task-${taskId}`;
        
        li.innerHTML = `
            <div class="task-item" style="background: rgba(0,0,0,0.3); padding: 15px; margin-bottom: 10px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; border-left: 5px solid #ffcc00;">
                <div>
                    <strong style="display: block; color: white;">${input.value}</strong>
                    <small id="timer-${taskId}" style="color: #ffcc00;">Sperre läuft...</small>
                </div>
                <button id="btn-${taskId}" disabled style="background: #444; color: #888; border: none; padding: 10px 15px; border-radius: 5px;">WARTEN...</button>
            </div>
        `;
        taskList.appendChild(li);
        
        // Timer starten: 300 Sekunden sind 5 Minuten
        startMissionTimer(taskId, 300); 
        input.value = "";
    }
}

function startMissionTimer(taskId, seconds) {
    let timeLeft = seconds;
    const timerDisplay = document.getElementById(`timer-${taskId}`);
    const actionBtn = document.getElementById(`btn-${taskId}`);

    const interval = setInterval(() => {
        timeLeft--;
        let mins = Math.floor(timeLeft / 60);
        let secs = timeLeft % 60;
        timerDisplay.innerText = `Sperre: ${mins}:${secs < 10 ? '0' : ''}${secs}`;

        if (timeLeft <= 0) {
            clearInterval(interval);
            timerDisplay.innerText = "MISSION BEREIT!";
            timerDisplay.style.color = "#39ff14";
            actionBtn.innerText = "ERLEDIGT";
            actionBtn.disabled = false;
            actionBtn.style.background = "#00d4ff";
            actionBtn.style.color = "white";
            actionBtn.style.cursor = "pointer";
            actionBtn.onclick = () => completeTask(taskId);
        }
    }, 1000);
}

function completeTask(taskId) {
    userData.coins += 20;
    userData.xp += 25;
    
    if (userData.xp >= 100) {
        userData.level++;
        userData.xp = 0;
        alert("LEVEL UP! Dein Core entwickelt sich!");
    }
    
    const taskElement = document.getElementById(`task-${taskId}`);
    if(taskElement) taskElement.remove();
    updateUI();
    saveToDisk();
}

// --- 4. NAVIGATION, SHOP & EVOLUTION ---
function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

function setDay(day, btn) {
    userData.currentDay = day;
    document.querySelectorAll('.day-card').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    saveToDisk();
}

function buyItem(type, value, price) {
    if (userData.coins >= price) {
        userData.coins -= price;
        alert("Ausrüstung erhalten!");
        if(type === 'color') document.documentElement.style.setProperty('--g-blue', value);
        updateUI();
        saveToDisk();
    } else {
        alert("Nicht genug Coins, Operator!");
    }
}

function checkPetEvolution() {
    const petElement = document.getElementById('pet-emoji');
    if (userData.level >= 5 && userData.level < 10) {
        petElement.innerText = "🐣";
    } else if (userData.level >= 10) {
        petElement.innerText = "🤖";
    } else {
        petElement.innerText = "🥚";
    }
}

function logout() {
    if(confirm("Sitzung beenden? Alle Daten werden gelöscht!")) {
        localStorage.removeItem('routineGamingData');
        location.reload();
    }
}