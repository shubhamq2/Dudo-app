// ======= 📊 DAILY CHECKLIST TASK SHEETS REGISTER =======
const dailyTasksList = [
  { id: "t1", text: "Watch Media Clip 1", coins: 10 },
  { id: "t2", text: "Watch Media Clip 2", coins: 10 },
  { id: "t3", text: "Explore Premium Web Offer", coins: 15 },
  { id: "t4", text: "Play Daily Spin", coins: 12 },
  { id: "t5", text: "Lucky Scratch Card", coins: 20 },
  { id: "t6", text: "Premium Partner Offerwall", coins: 15 },
  { id: "t8", text: "Math Quiz Master", coins: 10 },
  { id: "t9", text: "Solve Captcha Task", coins: 5 },
  { id: "t10", text: "Secure Cloud Validation", coins: 30 },
  { id: "t11", text: "Read Articles", coins: 10 },
  { id: "t12", text: "Sponsor Web Visit", coins: 5 },
  { id: "t13", text: "Smart Premium Task", coins: 50 },
  { id: "t14", text: "Video Zone Stream", coins: 20 },
  { id: "t15", text: "Micro Video Play", coins: 20 },
  { id: "t16", text: "30s Web Stream", coins: 50 }
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
  
  // Connecting to global langData if available in your HTML files
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
  
  // UI Creation Loop
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
                <span class="task-text" style="color: ${isDone ? '#94a3b8' : '#334155'}; text-decoration: ${isDone ? 'line-through' : 'none'}; font-weight: 700; font-size: 13.5px;">${task.text}</span>
            </div>
            <div class="task-reward" style="background: rgba(250, 204, 21, 0.1); color: #f59e0b; padding: 3px 8px; border-radius: 6px; font-weight: 900; font-size: 11px;">+${task.coins} 🪙</div>
        `;
    container.appendChild(taskBox);
  });
  
  // Count Update Tracking
  if (document.getElementById("doneCount")) document.getElementById("doneCount").innerText = doneCount;
  if (document.getElementById("dailyProgressCount")) document.getElementById("dailyProgressCount").innerText = `${doneCount} / ${dailyTasksList.length} Tasks`;
  
  // Bar Fill Animation Progress
  let percentage = (doneCount / dailyTasksList.length) * 100;
  if (document.getElementById("taskProgressFill")) document.getElementById("taskProgressFill").style.width = percentage + "%";
  if (document.getElementById("dailyProgressBarFill")) document.getElementById("dailyProgressBarFill").style.width = percentage + "%";
  
  // Milestones Nodes Update & Unlock logic
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
    executeAutoClaimMilestone(1, 10); // Automatically trigger Firebase claim for Node 1
  } else if (doneCount >= 5 && doneCount < 8) {
    if (m1) m1.classList.add("achieved");
    if (m2) m2.classList.add("achieved");
    hintText = `💥 Just ${8 - doneCount} tasks left for MEGA BONUS!`;
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

// 💰 NEW: SECURE PURE FIREBASE TRANSACTION FOR MILESTONE REWARDS
function executeAutoClaimMilestone(milestoneTier, rewardAmount) {
  const uid = localStorage.getItem("userId");
  if (!uid) return;
  
  // Ensure Firebase db instance is available
  if (typeof firebase === 'undefined' || !firebase.database) return;
  const db = firebase.database();
  
  // LocalStorage validation to prevent spam database transaction calls
  let today = new Date().toISOString().slice(0, 10);
  let milestoneKey = `milestone_${milestoneTier}_claimed_${today}_${uid}`;
  
  if (localStorage.getItem(milestoneKey) === "true") return; // Already claimed today locally
  
  // Check securely on Firebase if already claimed today
  db.ref(`users/${uid}/daily_milestones_claimed/${today}`).once('value', (snapshot) => {
    let claimedTiers = snapshot.val() || [];
    
    // If the tier is NOT found in the database for today
    if (!claimedTiers.includes(milestoneTier)) {
      
      // 1. Give Coins securely via Transaction
      db.ref(`users/${uid}/coins`).transaction((current) => {
        return (current || 0) + rewardAmount;
      }).then((result) => {
        if (result.committed) {
          // 2. Mark this Tier as Claimed in the Database
          claimedTiers.push(milestoneTier);
          return db.ref(`users/${uid}/daily_milestones_claimed/${today}`).set(claimedTiers);
        }
      }).then(() => {
        // 3. Mark locally to prevent further checks
        localStorage.setItem(milestoneKey, "true");
        console.log(`Milestone Tier ${milestoneTier} Unlocked: +${rewardAmount} Coins securely credited!`);
      }).catch((error) => {
        console.log("Milestone sync delayed. Retrying next refresh.");
      });
      
    } else {
      // If DB says it's claimed but local storage didn't know, update local storage
      localStorage.setItem(milestoneKey, "true");
    }
  });
}