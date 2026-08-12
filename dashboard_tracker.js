// ======= 📊 DAILY CHECKLIST TASK SHEETS REGISTER =======
const dailyTasksList = [
  { id: "t1", text: "Watch Media Clip 1", coins: 10 },
  { id: "t2", text: "Watch Media Clip 2", coins: 10 },
  { id: "t3", text: "Explore Premium Web Offer", coins: 15 },
  { id: "t4", text: "Play Daily Spin 3 Times", coins: 12 },
  { id: "t5", text: "Complete 1 Math Quiz", coins: 20 },
  { id: "t6", text: "Claim Hourly Vault Key", coins: 15 },
  { id: "t8", text: "Math Quiz Master", coins: 10 },
  { id: "t9", text: "Solve Captcha Task", coins: 5 },
  { id: "t10", text: "Secure Server Validation", coins: 30 },
  { id: "t11", text: "Play Daily Spin", coins: 10 },
  { id: "t12", text: "Instant Coins Task", coins: 5 },
  { id: "t13", text: "Complete Surveys", coins: 50 },
  { id: "t14", text: "Complete TimeWall Task", coins: 20 },
  { id: "t15", text: "Play Square Dash Arcade", coins: 20 },
  { id: "t16", text: "Premium Web Stream", coins: 50 }
];

// 🔄 Show/Hide Tasks Button Logic (Multi-Language Safe)
function toggleDailyTasksChecklistDisplay() {
  const container = document.getElementById("dailyChecklistHTML");
  const toggleBtn = document.getElementById("btnToggleDailyChecklistMenu");
  const toggleText = document.getElementById("lblToggleTasksText");
  
  let savedLang = localStorage.getItem("selectedLang") || "en";
  
  // Safe Fallback Language strings
  let showTxt = "Show Tasks";
  let hideTxt = "Hide Tasks";
  
  // Connecting to global langData if available in your files
  if (typeof langData !== 'undefined' && langData[savedLang]) {
    showTxt = langData[savedLang]["show_tasks_btn"] || showTxt;
    hideTxt = langData[savedLang]["hide_tasks_btn"] || hideTxt;
  } else if (savedLang === "hi") {
    showTxt = "टास्क दिखाएं";
    hideTxt = "टास्क छुपाएं";
  }
  
  if (!container || !toggleBtn || !toggleText) return;
  
  if (container.classList.contains("expanded")) {
    container.classList.remove("expanded");
    toggleBtn.classList.remove("active");
    toggleText.innerHTML = `<span>${showTxt}</span> <i class="fa-solid fa-chevron-down"></i>`;
  } else {
    container.classList.add("expanded");
    toggleBtn.classList.add("active");
    toggleText.innerHTML = `<span>${hideTxt}</span> <i class="fa-solid fa-chevron-up"></i>`;
  }
}

// 🚀 REALTIME PROGRESS BAR AND CHECKLIST EVALUATION
function executeRealtimeChecklistEvaluation(completedTaskIdsArray) {
  const container = document.getElementById("dailyChecklistHTML");
  if (!container) return;
  
  container.innerHTML = "";
  let doneCount = 0;
  
  // UI Create karna
  dailyTasksList.forEach(task => {
    const isDone = completedTaskIdsArray.includes(task.id);
    if (isDone) doneCount++;
    
    const taskBox = document.createElement("div");
    taskBox.className = `task-item ${isDone ? 'completed' : ''}`;
    
    // Premium UI Generation
    let iconHtml = isDone ?
      `<i class="fa-solid fa-circle-check" style="color: #10b981; font-size: 16px;"></i>` :
      `<div style="width: 14px; height: 14px; border: 2px solid #cbd5e1; border-radius: 50%;"></div>`;
    
    taskBox.innerHTML = `
            <div class="task-info" style="display: flex; align-items: center; gap: 10px;">
                ${iconHtml}
                <span class="task-text" style="color: ${isDone ? '#94a3b8' : '#334155'}; text-decoration: ${isDone ? 'line-through' : 'none'}; font-weight: 700;">${task.text}</span>
            </div>
            <div class="task-reward" style="background: rgba(250, 204, 21, 0.1); color: #f59e0b; padding: 2px 8px; border-radius: 6px; font-weight: 900; font-size: 11px;">+${task.coins} 🪙</div>
        `;
    container.appendChild(taskBox);
  });
  
  // Count Update Karna
  if (document.getElementById("doneCount")) document.getElementById("doneCount").innerText = doneCount;
  if (document.getElementById("dailyProgressCount")) document.getElementById("dailyProgressCount").innerText = `${doneCount} / ${dailyTasksList.length} Tasks`;
  
  // Bar Fill Animation
  let percentage = (doneCount / dailyTasksList.length) * 100;
  if (document.getElementById("taskProgressFill")) document.getElementById("taskProgressFill").style.width = percentage + "%";
  if (document.getElementById("dailyProgressBarFill")) document.getElementById("dailyProgressBarFill").style.width = percentage + "%";
  
  // Milestones Update & Unlock logic
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
    executeAutoClaimMilestone(1, 10); // Automatically trigger backend API claim for Node 1
  } else if (doneCount >= 5 && doneCount < 8) {
    if (m1) m1.classList.add("achieved");
    if (m2) m2.classList.add("achieved");
    hintText = `💥 Just ${dailyTasksList.length - doneCount} tasks left for MEGA BONUS!`;
    executeAutoClaimMilestone(2, 30); // Claim Node 2
  } else if (doneCount >= 8) {
    if (m1) m1.classList.add("achieved");
    if (m2) m2.classList.add("achieved");
    if (m3) m3.classList.add("achieved");
    hintText = "🎉 MEGA BONUS UNLOCKED! ALL DONE!";
    executeAutoClaimMilestone(3, 100); // Claim Node 3 Mega Bonus
  }
  
  if (document.getElementById("rewardHint")) {
    document.getElementById("rewardHint").innerText = hintText;
  }
}

// 💰 NEW: SECURE NODE.JS API CALL FOR MILESTONE REWARDS
async function executeAutoClaimMilestone(milestoneTier, rewardAmount) {
  const uid = localStorage.getItem("userId");
  const token = localStorage.getItem("userToken");
  
  // LocalStorage validation to prevent spam API calls
  let today = new Date().toISOString().slice(0, 10);
  let milestoneKey = `milestone_${milestoneTier}_claimed_${today}_${uid}`;
  
  if (localStorage.getItem(milestoneKey) === "true") return; // Already claimed today
  
  try {
    const DEFAULT_API_BASE = "https://dudo-app.onrender.com/api";
    const API_BASE_URL = localStorage.getItem("customServerUrl") || DEFAULT_API_BASE;
    
    const res = await fetch(`${API_BASE_URL}/user/update-balance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        userId: uid,
        pointsToAdd: rewardAmount,
        action: `daily_milestone_tier_${milestoneTier}`
      })
    });
    
    const data = await res.json();
    if (data.success) {
      localStorage.setItem(milestoneKey, "true"); // Lock locally
      
      // Optionally update UI top balance dynamically if elements exist
      if (document.getElementById("liveUserCoins")) {
        document.getElementById("liveUserCoins").innerText = data.newCoins;
      }
      console.log(`Milestone Tier ${milestoneTier} Unlocked: +${rewardAmount} Coins securely credited!`);
    }
  } catch (err) {
    console.log("Milestone sync delayed. Retrying next refresh.");
  }
}