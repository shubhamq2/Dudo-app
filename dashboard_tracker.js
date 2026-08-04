// ======= 📊 DAILY CHECKLIST TASK SHEETS REGISTER =======
const dailyTasksList = [
  { id: "t1", text: "Watch Video Ad 1", coins: 10 },
  { id: "t2", text: "Watch Video Ad 2", coins: 10 },
  { id: "t3", text: "Click Premium Banner Ad", coins: 15 },
  { id: "t4", text: "Spin the Lucky Wheel 3 Times", coins: 12 },
  { id: "t5", text: "Complete 1 Math Quiz", coins: 20 },
  { id: "t6", text: "Claim Hourly Vault Key", coins: 15 },
  { id: "t8", text: "Math Quiz Master", coins: 10 },
  { id: "t9", text: "Solve Captcha Task", coins: 5 },
  { id: "t10", text: "Decrypt Fast Server Bypass", coins: 30 },
  { id: "t11", text: "Play Daily Spin", coins: 10 },
  { id: "t12", text: "Click & Earn Ad Task", coins: 5 },
  { id: "t13", text: "Complete Surveys", coins: 50 },
  { id: "t14", text: "Complete TimeWall Task", coins: 20 },
  { id: "t15", text: "Play Square Dash Arcade", coins: 20 }
];

// Show/Hide Tasks Button Logic
function toggleDailyTasksChecklistDisplay() {
  const container = document.getElementById("dailyChecklistHTML");
  const toggleBtn = document.getElementById("btnToggleDailyChecklistMenu");
  const toggleText = document.getElementById("lblToggleTasksText");
  
  let savedLang = localStorage.getItem("selectedLang") || "en";
  let showTxt = "Show Tasks";
  let hideTxt = "Hide Tasks";
  
  if (!container || !toggleBtn || !toggleText) return;
  
  if (container.classList.contains("expanded")) {
    container.classList.remove("expanded");
    toggleBtn.classList.remove("active");
    toggleText.innerText = showTxt;
  } else {
    container.classList.add("expanded");
    toggleBtn.classList.add("active");
    toggleText.innerText = hideTxt;
  }
}

// REALTIME PROGRESS BAR AND CHECKLIST EVALUATION
function executeRealtimeChecklistEvaluation(completedTaskIds) {
  const container = document.getElementById("dailyChecklistHTML");
  if (!container) return;
  
  container.innerHTML = "";
  let doneCount = 0;
  
  // UI Create karna
  dailyTasksList.forEach(task => {
    const isDone = completedTaskIds.includes(task.id);
    if (isDone) doneCount++;
    
    const taskBox = document.createElement("div");
    taskBox.className = `task-item ${isDone ? 'completed' : ''}`;
    taskBox.innerHTML = `
            <div class="task-info">
                <input type="checkbox" class="task-checkbox" ${isDone ? 'checked' : ''} onclick="return false;">
                <span class="task-text">${task.text}</span>
            </div>
            <div class="task-reward">+${task.coins}🪙</div>
        `;
    container.appendChild(taskBox);
  });
  
  // Count Update Karna
  if (document.getElementById("doneCount")) {
    document.getElementById("doneCount").innerText = doneCount;
  }
  
  if (document.getElementById("dailyProgressCount")) {
    document.getElementById("dailyProgressCount").innerText = `${doneCount} / ${dailyTasksList.length} Tasks`;
  }
  
  // Bar Fill Animation
  let percentage = (doneCount / dailyTasksList.length) * 100;
  
  if (document.getElementById("taskProgressFill")) {
    document.getElementById("taskProgressFill").style.width = percentage + "%";
  }
  
  if (document.getElementById("dailyProgressBarFill")) {
    document.getElementById("dailyProgressBarFill").style.width = percentage + "%";
  }
  
  // Milestones Update
  let m1 = document.getElementById("mNode1");
  let m2 = document.getElementById("mNode2");
  let m3 = document.getElementById("mNode3");
  
  if (m1) m1.classList.remove("achieved");
  if (m2) m2.classList.remove("achieved");
  if (m3) m3.classList.remove("achieved");
  
  let hintText = "";
  if (doneCount < 2) {
    hintText = `Complete ${2 - doneCount} more tasks for +10🪙 Bonus!`;
  } else if (doneCount >= 2 && doneCount < 5) {
    if (m1) m1.classList.add("achieved");
    hintText = `Awesome! ${5 - doneCount} more tasks for +30🪙 Extra!`;
  } else if (doneCount >= 5 && doneCount < 8) {
    if (m1) m1.classList.add("achieved");
    if (m2) m2.classList.add("achieved");
    hintText = `💥 Just ${8 - doneCount} tasks left for MEGA BONUS!`;
  } else if (doneCount >= 8) {
    if (m1) m1.classList.add("achieved");
    if (m2) m2.classList.add("achieved");
    if (m3) m3.classList.add("achieved");
    hintText = "🎉 MEGA BONUS UNLOCKED!";
  }
  
  if (document.getElementById("rewardHint")) {
    document.getElementById("rewardHint").innerText = hintText;
  }
}