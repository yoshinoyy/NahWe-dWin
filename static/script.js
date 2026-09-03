var TASKS_KEY = "steady_tasks";
var CHECKIN_KEY = "steady_checkin";
var tasks = loadTasks();
var checkin = loadCheckin();
var focusedTaskId = null;
var timerHandle = null;
var secondsLeft = 1500;
var toastTimeout = null;

var taskList = document.getElementById("taskList");
var taskForm = document.getElementById("taskForm");
var checkinForm = document.getElementById("checkinForm");
var focusContent = document.getElementById("focusContent");
var startFocusBtn = document.getElementById("startFocusBtn");
var sessionDialog = document.getElementById("sessionDialog");
var toast = document.getElementById("toast");

function localDate(offset) {
  var date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + (offset || 0));
  return date.toISOString().slice(0, 10);
}

function loadTasks() {
  var saved = localStorage.getItem(TASKS_KEY);
  if (saved) {
    try { return JSON.parse(saved); } catch (error) { localStorage.removeItem(TASKS_KEY); }
  }
  return [
    { id: "demo-1", title: "Finish research presentation", due: localDate(1), minutes: 90, priority: 3, completed: false },
    { id: "demo-2", title: "Reply to internship email", due: localDate(0), minutes: 15, priority: 2, completed: false },
    { id: "demo-3", title: "Read chapter 6 notes", due: localDate(3), minutes: 45, priority: 1, completed: false }
  ];
}

function loadCheckin() {
  var saved = localStorage.getItem(CHECKIN_KEY);
  if (saved) {
    try { return JSON.parse(saved); } catch (error) { localStorage.removeItem(CHECKIN_KEY); }
  }
  return { stress: 2, energy: 2, capacity: 120 };
}

function saveState() {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  localStorage.setItem(CHECKIN_KEY, JSON.stringify(checkin));
}

function daysUntil(dateString) {
  var today = new Date(localDate(0) + "T12:00:00");
  var due = new Date(dateString + "T12:00:00");
  return Math.round((due - today) / 86400000);
}

function dateLabel(dateString) {
  var days = daysUntil(dateString);
  if (days < 0) return "Overdue";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return new Date(dateString + "T12:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function urgencyScore(days) {
  if (days <= 0) return 100;
  if (days === 1) return 88;
  if (days === 2) return 74;
  if (days <= 7) return 56;
  return 30;
}

function scoreTask(task) {
  var score = urgencyScore(daysUntil(task.due)) + (Number(task.priority) * 21);
  if (checkin.stress >= 3 || checkin.energy <= 1) score += Math.max(0, 35 - Number(task.minutes) / 3);
  return score;
}

function openTasks() {
  return tasks.filter(function(task) { return !task.completed; });
}

function rankedTasks() {
  return openTasks().slice().sort(function(a, b) { return scoreTask(b) - scoreTask(a); });
}

function workloadState(totalMinutes) {
  if (!totalMinutes) return { label: "Ready", detail: "Add a task to begin", className: "ready" };
  if (totalMinutes > Number(checkin.capacity) * 1.25) return { label: "Overloaded", detail: "Let’s choose what matters most", className: "overloaded" };
  if (totalMinutes > Number(checkin.capacity)) return { label: "Tight", detail: "A focused plan will help", className: "tight" };
  return { label: "Manageable", detail: "Your plan fits your capacity", className: "manageable" };
}

function minutesLabel(minutes) {
  if (minutes < 60) return minutes + " min";
  var hours = Math.floor(minutes / 60);
  var rest = minutes % 60;
  return hours + "h" + (rest ? " " + rest + "m" : "");
}

function createTaskElement(task) {
  var item = document.createElement("article");
  item.className = "task-item" + (task.completed ? " task-item--complete" : "");
  item.dataset.id = task.id;

  var checkbox = document.createElement("button");
  checkbox.className = "task-check";
  checkbox.type = "button";
  checkbox.dataset.action = "complete";
  checkbox.setAttribute("aria-label", task.completed ? "Mark task incomplete" : "Mark task complete");
  checkbox.textContent = task.completed ? "✓" : "";

  var copy = document.createElement("div");
  copy.className = "task-copy";
  var title = document.createElement("strong");
  title.textContent = task.title;
  var meta = document.createElement("span");
  meta.textContent = dateLabel(task.due) + " · " + minutesLabel(Number(task.minutes));
  if (daysUntil(task.due) <= 0 && !task.completed) meta.className = "task-meta task-meta--urgent";
  else meta.className = "task-meta";
  copy.appendChild(title);
  copy.appendChild(meta);

  var priority = document.createElement("span");
  priority.className = "priority priority--" + task.priority;
  priority.textContent = task.priority === 3 ? "Must do" : task.priority === 2 ? "Important" : "Nice to do";

  var remove = document.createElement("button");
  remove.className = "task-remove";
  remove.type = "button";
  remove.dataset.action = "remove";
  remove.setAttribute("aria-label", "Remove " + task.title);
  remove.textContent = "×";

  item.appendChild(checkbox);
  item.appendChild(copy);
  item.appendChild(priority);
  item.appendChild(remove);
  return item;
}

function renderTasks() {
  taskList.textContent = "";
  var ordered = tasks.slice().sort(function(a, b) {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return scoreTask(b) - scoreTask(a);
  });
  if (!ordered.length) {
    var empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Nothing here yet. Add the first thing on your mind below.";
    taskList.appendChild(empty);
  } else {
    ordered.forEach(function(task) { taskList.appendChild(createTaskElement(task)); });
  }
  document.getElementById("taskCount").textContent = openTasks().length;
}

function renderMetrics() {
  var total = openTasks().reduce(function(sum, task) { return sum + Number(task.minutes); }, 0);
  var state = workloadState(total);
  document.getElementById("openTaskMetric").textContent = openTasks().length;
  document.getElementById("effortMetric").textContent = total >= 60 ? (total / 60).toFixed(total % 60 ? 1 : 0) + "h" : total + "m";
  document.getElementById("statusText").textContent = state.label;
  document.getElementById("statusDetail").textContent = state.detail;
  document.getElementById("statusMetric").className = "metric-card card metric-card--status metric-card--" + state.className;
}

function renderFocus() {
  var next = rankedTasks()[0];
  focusContent.textContent = "";
  if (!next) {
    var done = document.createElement("div");
    done.className = "focus-empty";
    done.innerHTML = "<span>✧</span><h2>Clear runway.</h2><p>You’ve got no open tasks. Enjoy the space, or add something small.</p>";
    focusContent.appendChild(done);
    startFocusBtn.disabled = true;
    focusedTaskId = null;
    return;
  }
  focusedTaskId = next.id;
  var label = document.createElement("p");
  label.className = "focus-label";
  label.textContent = checkin.stress >= 3 ? "Let’s make this gentle" : "The best next step is";
  var title = document.createElement("h2");
  title.id = "focusTitle";
  title.textContent = next.title;
  var detail = document.createElement("p");
  detail.className = "focus-detail";
  detail.textContent = dateLabel(next.due) + " · " + minutesLabel(Number(next.minutes)) + " · " + (next.priority === 3 ? "Must do" : "Important");
  var note = document.createElement("p");
  note.className = "focus-note";
  note.textContent = checkin.energy <= 1 || checkin.stress >= 3 ? "Start with just 25 minutes. Future-you will thank you." : "A focused start is enough for now.";
  focusContent.appendChild(label);
  focusContent.appendChild(title);
  focusContent.appendChild(detail);
  focusContent.appendChild(note);
  startFocusBtn.disabled = false;
}

function renderAll() {
  renderTasks();
  renderMetrics();
  renderFocus();
  var stressRadio = document.querySelector('input[name="stress"][value="' + checkin.stress + '"]');
  if (stressRadio) stressRadio.checked = true;
  document.getElementById("energy").value = checkin.energy;
  document.getElementById("capacity").value = checkin.capacity;
}

function showToast(message) {
  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimeout = setTimeout(function() { toast.classList.remove("show"); }, 2600);
}

taskForm.addEventListener("submit", function(event) {
  event.preventDefault();
  var formData = new FormData(taskForm);
  tasks.push({ id: String(Date.now()), title: formData.get("title").trim(), due: formData.get("due"), minutes: Number(formData.get("minutes")), priority: Number(formData.get("priority")), completed: false });
  saveState();
  taskForm.reset();
  document.getElementById("taskDue").value = localDate(1);
  renderAll();
  showToast("Task added to your plan");
});

taskList.addEventListener("click", function(event) {
  var action = event.target.closest("[data-action]");
  if (!action) return;
  var item = action.closest(".task-item");
  var id = item.dataset.id;
  var task = tasks.find(function(candidate) { return candidate.id === id; });
  if (!task) return;
  if (action.dataset.action === "complete") {
    task.completed = !task.completed;
    saveState();
    renderAll();
    showToast(task.completed ? "Nice work — one less thing to carry" : "Task moved back to your inbox");
  }
  if (action.dataset.action === "remove") {
    tasks = tasks.filter(function(candidate) { return candidate.id !== id; });
    saveState();
    renderAll();
    showToast("Task removed");
  }
});

document.getElementById("clearCompletedBtn").addEventListener("click", function() {
  var before = tasks.length;
  tasks = tasks.filter(function(task) { return !task.completed; });
  if (tasks.length !== before) {
    saveState();
    renderAll();
    showToast("Completed tasks cleared");
  } else showToast("No completed tasks yet");
});

checkinForm.addEventListener("submit", function(event) {
  event.preventDefault();
  checkin = { stress: Number(new FormData(checkinForm).get("stress")), energy: Number(document.getElementById("energy").value), capacity: Number(document.getElementById("capacity").value) };
  saveState();
  renderAll();
  document.getElementById("updatedLabel").textContent = "Updated just now";
  showToast("Your plan has been gently recalibrated");
});

document.getElementById("focusScrollBtn").addEventListener("click", function() { document.getElementById("focusPanel").scrollIntoView({ behavior: "smooth", block: "center" }); });

function updateTimer() {
  var minutes = Math.floor(secondsLeft / 60);
  var seconds = secondsLeft % 60;
  document.getElementById("timer").textContent = String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
}

startFocusBtn.addEventListener("click", function() {
  var task = tasks.find(function(candidate) { return candidate.id === focusedTaskId; });
  if (!task) return;
  document.getElementById("dialogTaskTitle").textContent = task.title;
  document.getElementById("dialogMessage").textContent = "One focused block. That’s all we’re asking of you.";
  secondsLeft = 1500;
  updateTimer();
  document.getElementById("finishSessionBtn").disabled = false;
  sessionDialog.showModal();
  clearInterval(timerHandle);
  timerHandle = setInterval(function() { secondsLeft -= 1; updateTimer(); if (secondsLeft <= 0) clearInterval(timerHandle); }, 1000);
});

function closeDialog() { clearInterval(timerHandle); sessionDialog.close(); }
document.getElementById("closeDialogBtn").addEventListener("click", closeDialog);
document.getElementById("finishSessionBtn").addEventListener("click", function() {
  var task = tasks.find(function(candidate) { return candidate.id === focusedTaskId; });
  if (task) task.completed = true;
  saveState();
  closeDialog();
  renderAll();
  showToast("You made progress. Take the win.");
});

var resetPrompts = ["Take five slow breaths, making the exhale a little longer than the inhale.", "Get a glass of water and let your eyes look away from the screen for one minute.", "Drop your shoulders, unclench your jaw, and stretch your hands before starting.", "Write down the one thing that would make today feel 1% easier."];
document.getElementById("resetBtn").addEventListener("click", function() {
  var prompt = resetPrompts[Math.floor(Math.random() * resetPrompts.length)];
  document.getElementById("resetPrompt").textContent = prompt;
  showToast("Here’s a small moment for you");
});

document.getElementById("taskDue").value = localDate(1);
renderAll();
