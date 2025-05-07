const streakDisplay = document.getElementById("streak");
const resetBtn = document.getElementById("resetBtn");
const shareBtn = document.getElementById("shareBtn");
const goalInput = document.getElementById("goalInput");
const setGoalBtn = document.getElementById("setGoalBtn");
const goalDisplay = document.getElementById("goalDisplay");
const journalInput = document.getElementById("journalInput");
const saveJournalBtn = document.getElementById("saveJournalBtn");
const journalList = document.getElementById("journalList");
const progressFill = document.getElementById("progress-fill");

const badges = {
  1: document.getElementById("badge-1"),
  7: document.getElementById("badge-7"),
  25: document.getElementById("badge-25"),
  50: document.getElementById("badge-50"),
  90: document.getElementById("badge-90")
};

function getStartDate() {
  return localStorage.getItem("nofapStart") || null;
}

function setStartDate(date) {
  localStorage.setItem("nofapStart", date);
}

function getGoal() {
  return parseInt(localStorage.getItem("nofapGoal")) || 90;
}

function setGoal(days) {
  localStorage.setItem("nofapGoal", days);
  goalDisplay.textContent = `🎯 Your goal: ${days} days`;
}

function resetStreak() {
  setStartDate(new Date().toISOString());
  updateStreak();
}

function updateStreak() {
  const start = getStartDate();
  if (!start) {
    resetStreak();
    return;
  }
  const now = new Date();
  const diff = Math.floor((now - new Date(start)) / (1000 * 60 * 60 * 24));
  streakDisplay.textContent = `Streak: ${diff} day${diff === 1 ? "" : "s"}`;
  updateBadges(diff);
  updateProgressBar(diff);
  Notification.requestPermission().then(permission => {
    if (permission === "granted" && diff > 0) {
      new Notification(`Keep going! You're on day ${diff}! 💪`);
    }
  });
}

function updateBadges(streak) {
  for (const days in badges) {
    if (streak >= parseInt(days)) {
      badges[days].classList.add("earned");
    } else {
      badges[days].classList.remove("earned");
    }
  }
}

function updateProgressBar(streak) {
  const goal = getGoal();
  const percentage = Math.min((streak / goal) * 100, 100);
  progressFill.style.width = `${percentage}%`;
}

resetBtn.addEventListener("click", () => {
  if (confirm("Are you sure you relapsed? This will reset your streak.")) {
    resetStreak();
  }
});

shareBtn.addEventListener("click", () => {
  const streakText = streakDisplay.textContent;
  if (navigator.share) {
    navigator.share({ title: "My NoFap Streak", text: streakText });
  } else {
    alert("Sharing not supported in this browser.");
  }
});

setGoalBtn.addEventListener("click", () => {
  const days = parseInt(goalInput.value);
  if (days > 0) setGoal(days);
  updateStreak();
});

saveJournalBtn.addEventListener("click", () => {
  const entry = journalInput.value.trim();
  if (entry) {
    const date = new Date().toLocaleDateString();
    const logs = JSON.parse(localStorage.getItem("nofapJournal") || "[]");
    logs.unshift({ date, entry });
    localStorage.setItem("nofapJournal", JSON.stringify(logs));
    journalInput.value = "";
    loadJournal();
  }
});

function loadJournal() {
  const logs = JSON.parse(localStorage.getItem("nofapJournal") || "[]");
  journalList.innerHTML = logs.map(log => `<li><strong>${log.date}</strong>: ${log.entry}</li>`).join("");
}

window.addEventListener("load", () => {
  if (!getStartDate()) resetStreak();
  else updateStreak();
  setGoal(getGoal());
  loadJournal();
});
