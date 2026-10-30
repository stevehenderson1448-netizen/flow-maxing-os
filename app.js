const STORAGE_KEY = "flow-maxing-os-v1";

const MODES = {
  peak: {
    label: "Peak",
    note: "Protect the morning. Use your clearest energy for the hardest meaningful work.",
    routine: [
      ["Water + arrive", "No phone. Let the day begin deliberately.", 5],
      ["Meditation", "Sit after water and start the timer.", 10],
      ["Breathwork", "Five calm cycles after meditation.", 5],
      ["Read", "Ten pages; capture one useful idea.", 20],
      ["Focused business work", "One high-impact task before reactive work.", 90]
    ]
  },
  steady: {
    label: "Steady",
    note: "Keep the chain intact. A smaller clean day beats forcing peak output.",
    routine: [
      ["Water + arrive", "No phone for the first few minutes.", 3],
      ["Meditation", "One short sit is enough to keep the cue alive.", 7],
      ["Breathwork", "Three slow cycles.", 3],
      ["Read", "Five pages or one useful section.", 10],
      ["Focused business work", "One contained, valuable block.", 50]
    ]
  },
  recovery: {
    label: "Recovery",
    note: "Late wake-up or low capacity: preserve momentum without creating debt.",
    routine: [
      ["Water + reset", "Drop the guilt. Start from now.", 2],
      ["Meditation", "Three quiet minutes to regain choice.", 3],
      ["Breathwork", "One minute of slow breathing.", 1],
      ["Read", "One page keeps the identity alive.", 3],
      ["Business needle-mover", "Do the smallest version of the top task.", 25]
    ]
  }
};

const defaultState = () => ({
  version: 1,
  week: {
    outcome: "Create consistent movement in the business",
    evidence: "Complete one meaningful business deliverable and learn what unlocks the next step.",
    why: "Build proof that focused mornings compound into real momentum."
  },
  tasks: [
    { id: crypto.randomUUID(), name: "Define this week's business needle-mover", impact: 3, complexity: 2, energy: "high", duration: 30, done: false },
    { id: crypto.randomUUID(), name: "Complete one focused business work block", impact: 3, complexity: 3, energy: "high", duration: 90, done: false },
    { id: crypto.randomUUID(), name: "Capture decisions and the next visible action", impact: 2, complexity: 1, energy: "low", duration: 15, done: false }
  ],
  cues: [
    { id: crypto.randomUUID(), name: "Meditation", cue: "After I drink my morning water", response: "I sit in my meditation spot and start a 10-minute timer" },
    { id: crypto.randomUUID(), name: "Breathwork", cue: "When meditation ends", response: "I complete five slow breath cycles before standing up" },
    { id: crypto.randomUUID(), name: "Reading", cue: "After breathwork", response: "I open my current book and read ten pages" },
    { id: crypto.randomUUID(), name: "Focused work", cue: "When I close my book", response: "I open only the week's highest-impact business task and work for 90 minutes" }
  ],
  scripts: [
    { id: crypto.randomUUID(), trigger: "I wake later than planned", response: "I choose Recovery mode, skip guilt, and begin the reduced stack from now." },
    { id: crypto.randomUUID(), trigger: "I resist starting focused work", response: "I set a five-minute timer and do only the first visible action." },
    { id: crypto.randomUUID(), trigger: "My energy drops", response: "I switch to a low-energy task or deliberate recovery instead of drifting." }
  ],
  daily: {},
  reflection: { win: "", friction: "", lesson: "", next: "", recovery: "maintain" }
});

let state = loadState();
let activeView = "today";
let editor = null;
let toastTimer;

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return stored && stored.version === 1 ? stored : defaultState();
  } catch {
    return defaultState();
  }
}

function saveState(message) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (message) showToast(message);
}

function dayKey(date = new Date()) {
  return date.toLocaleDateString("en-CA");
}

function todayState() {
  const key = dayKey();
  if (!state.daily[key]) state.daily[key] = { energy: 0, mode: "peak", routine: [] };
  return state.daily[key];
}

function suggestedMode(energy) {
  if (energy <= 2) return "recovery";
  if (energy <= 4) return "steady";
  return "peak";
}

function formatDate() {
  return new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

function energyLabel(value) {
  return ({ low: "Low energy", medium: "Medium energy", high: "High energy" })[value];
}

function taskScore(task, energy) {
  const capacity = energy >= 5 ? 3 : energy >= 3 ? 2 : 1;
  const taskEnergy = { low: 1, medium: 2, high: 3 }[task.energy];
  const fit = 4 - Math.abs(capacity - taskEnergy);
  return task.impact * 4 + fit * 2 - task.complexity;
}

function render() {
  renderToday();
  renderWeek();
  renderArchitecture();
  renderReview();
  document.querySelectorAll(".view").forEach(view => view.classList.toggle("active", view.id === `view-${activeView}`));
  document.querySelectorAll(".nav-item").forEach(item => item.classList.toggle("active", item.dataset.viewTarget === activeView));
}

function renderToday() {
  const daily = todayState();
  const mode = MODES[daily.mode];
  const routineDone = daily.routine.filter(Boolean).length;
  const outcomeTasks = state.tasks.filter(task => task.impact === 3);
  const outcomeDone = outcomeTasks.filter(task => task.done).length;
  const progress = outcomeTasks.length ? Math.round((outcomeDone / outcomeTasks.length) * 100) : 0;
  const matched = [...state.tasks].sort((a, b) => Number(a.done) - Number(b.done) || taskScore(b, daily.energy || 3) - taskScore(a, daily.energy || 3));

  document.getElementById("view-today").innerHTML = `
    <div class="page-head">
      <p class="eyebrow">${escapeHTML(formatDate())}</p>
      <h1 id="today-heading">Move with the day.</h1>
      <p>Check your capacity, choose the right mode, then let the system tell you what matters.</p>
    </div>
    <div class="grid two-column">
      <div class="stack">
        <article class="card card-green">
          <p class="eyebrow">This week's outcome</p>
          <h2 class="outcome-title">${escapeHTML(state.week.outcome)}</h2>
          <p class="outcome-evidence">${escapeHTML(state.week.evidence)}</p>
          <div class="outcome-progress"><span style="width:${progress}%"></span></div>
          <div class="progress-label"><span>${outcomeDone} of ${outcomeTasks.length} high-impact actions</span><span>${progress}%</span></div>
        </article>

        <article class="card">
          <div class="card-head">
            <div><p class="eyebrow">Morning architecture</p><h2>${mode.label} mode</h2><p>${mode.note}</p></div>
            <span class="tag">${routineDone}/${mode.routine.length}</span>
          </div>
          <div class="routine-list">
            ${mode.routine.map((item, index) => `
              <div class="routine-item">
                <button class="check-button ${daily.routine[index] ? "done" : ""}" data-routine-index="${index}" aria-label="Mark ${escapeHTML(item[0])} ${daily.routine[index] ? "incomplete" : "complete"}"></button>
                <div class="routine-copy"><strong>${escapeHTML(item[0])}</strong><small>${escapeHTML(item[1])}</small></div>
                <span class="duration">${item[2]} min</span>
              </div>`).join("")}
          </div>
        </article>

        <article class="card">
          <div class="card-head"><div><p class="eyebrow">Matched work</p><h2>Best use of this energy</h2></div><button class="text-button" data-add="task">+ Add</button></div>
          <div class="task-list">${matched.length ? matched.map(taskTemplate).join("") : '<div class="empty">No tasks yet. Add the next useful action.</div>'}</div>
        </article>
      </div>

      <aside class="stack">
        <article class="card card-muted">
          <div class="card-head"><div><p class="eyebrow">Capacity first</p><h2>How much is here?</h2></div></div>
          <div class="energy-picker" aria-label="Energy level">
            ${[1,2,3,4,5].map(value => `<button class="energy-button ${daily.energy === value ? "selected" : ""}" data-energy="${value}"><span>${["○","◔","◑","◕","●"][value-1]}</span><small>${value}</small></button>`).join("")}
          </div>
          <div class="mode-row">
            ${Object.entries(MODES).map(([key, value]) => `<button class="mode-button ${daily.mode === key ? "selected" : ""}" data-mode="${key}">${value.label}</button>`).join("")}
          </div>
          <p class="suggestion">${daily.energy ? `Energy ${daily.energy}/5 suggests <strong>${MODES[suggestedMode(daily.energy)].label}</strong> mode. You still choose.` : "Choose your honest capacity. The plan should fit you—not fight you."}</p>
        </article>
        <article class="card card-muted">
          <p class="quote">“Protect the cue. Scale the response.”</p>
          <p class="quote-note">On difficult days, shrink the action without breaking the relationship.</p>
          <button class="button button-secondary button-wide" data-view-target="architecture">See my action architecture</button>
        </article>
      </aside>
    </div>`;
}

function taskTemplate(task) {
  return `<div class="task-card ${task.done ? "done" : ""}">
    <button class="check-button ${task.done ? "done" : ""}" data-task-toggle="${task.id}" aria-label="Mark task ${task.done ? "incomplete" : "complete"}"></button>
    <div class="task-copy"><p class="task-name">${escapeHTML(task.name)}</p><div class="task-meta"><span class="tag tag-impact">Impact ${task.impact}</span><span class="tag">Complexity ${task.complexity}</span><span class="tag">${escapeHTML(energyLabel(task.energy))}</span><span class="tag">${task.duration} min</span></div></div>
    <button class="edit-button" data-edit-task="${task.id}" aria-label="Edit task">•••</button>
  </div>`;
}

function renderWeek() {
  const open = state.tasks.filter(task => !task.done).sort((a,b) => b.impact - a.impact || a.complexity - b.complexity);
  const done = state.tasks.filter(task => task.done);
  document.getElementById("view-week").innerHTML = `
    <div class="page-head"><p class="eyebrow">Weekly compass</p><h1 id="week-heading">Define the win.</h1><p>One outcome gives every task a job. Impact tells you what deserves your best energy.</p></div>
    <div class="grid two-column">
      <div class="stack">
        <article class="week-outcome">
          <div class="field"><label for="week-outcome">The outcome</label><input class="outcome-input" id="week-outcome" data-week-field="outcome" value="${escapeHTML(state.week.outcome)}" placeholder="What will be meaningfully different?" /></div>
          <div class="field"><label for="week-evidence">Evidence it happened</label><textarea id="week-evidence" data-week-field="evidence" placeholder="What can you point to?">${escapeHTML(state.week.evidence)}</textarea></div>
          <div class="field"><label for="week-why">Why this matters now</label><textarea id="week-why" data-week-field="why" placeholder="Why is this worth protecting?">${escapeHTML(state.week.why)}</textarea></div>
        </article>
        <article class="card">
          <div class="card-head"><div><p class="eyebrow">Action map</p><h2>Open actions</h2><p>Impact 3 gets your peak. Complexity tells you how much capacity it needs.</p></div><button class="button button-secondary button-small" data-add="task">+ Action</button></div>
          <div class="task-list">${open.length ? open.map(taskTemplate).join("") : '<div class="empty">The week is clear. Add the next outcome-driving action.</div>'}</div>
        </article>
      </div>
      <aside class="stack">
        <article class="card card-muted">
          <div class="card-head"><div><p class="eyebrow">Planning rule</p><h2>Match, don't force</h2></div></div>
          <p class="suggestion"><strong>High complexity + high impact</strong><br>Morning peak, protected block.</p>
          <p class="suggestion"><strong>Low complexity + high impact</strong><br>Do it early; take the fast win.</p>
          <p class="suggestion"><strong>Low impact</strong><br>Batch it, delegate it, or remove it.</p>
        </article>
        <article class="card">
          <div class="card-head"><div><p class="eyebrow">Completed</p><h2>${done.length} actions</h2></div></div>
          <div class="task-list">${done.length ? done.map(taskTemplate).join("") : '<div class="empty">Completed actions will collect here.</div>'}</div>
        </article>
      </aside>
    </div>`;
}

function renderArchitecture() {
  document.getElementById("view-architecture").innerHTML = `
    <div class="page-head"><p class="eyebrow">Action architecture</p><h1 id="architecture-heading">Make starting obvious.</h1><p>Each action begins when something concrete happens. Scripts catch the moments that usually knock the day off course.</p></div>
    <div class="grid two-column">
      <article class="card">
        <div class="card-head"><div><p class="eyebrow">Morning cue chain</p><h2>When this → I do this</h2></div><button class="button button-secondary button-small" data-add="cue">+ Cue</button></div>
        <div class="architecture-flow">
          ${state.cues.length ? state.cues.map((cue,index) => `<div class="cue-card"><span class="cue-number">${index+1}</span><div class="cue-content"><h3>${escapeHTML(cue.name)}</h3><div class="cue-line"><strong>When</strong><span>${escapeHTML(cue.cue)}</span></div><div class="cue-line"><strong>Then</strong><span>${escapeHTML(cue.response)}</span></div></div><div class="cue-actions"><button class="edit-button" data-edit-cue="${cue.id}" aria-label="Edit cue">•••</button></div></div>`).join("") : '<div class="empty">Add a concrete cue and a specific response.</div>'}
        </div>
      </article>
      <aside class="stack">
        <article class="card">
          <div class="card-head"><div><p class="eyebrow">If–then scripts</p><h2>Decide before the moment</h2></div><button class="button button-secondary button-small" data-add="script">+ Script</button></div>
          <div class="script-list">${state.scripts.length ? state.scripts.map(script => `<div class="script-card" data-edit-script="${script.id}" role="button" tabindex="0"><p><strong>If</strong> ${escapeHTML(script.trigger)}, <strong>then</strong> ${escapeHTML(script.response)}</p></div>`).join("") : '<div class="empty">Create a script for a predictable obstacle.</div>'}</div>
        </article>
        <article class="card card-muted">
          <p class="quote">A habit is not the whole routine.</p>
          <p class="quote-note">It is one dependable cue–response relationship. Build the chain one link at a time.</p>
        </article>
      </aside>
    </div>`;
}

function renderReview() {
  const completed = state.tasks.filter(task => task.done).length;
  const dailyEntries = Object.values(state.daily);
  const routineChecks = dailyEntries.reduce((total, day) => total + (day.routine || []).filter(Boolean).length, 0);
  document.getElementById("view-review").innerHTML = `
    <div class="page-head"><p class="eyebrow">Weekly reflection</p><h1 id="review-heading">Learn, then recover.</h1><p>The review is not a scorecard. It is how the system gets more honest and easier to trust.</p></div>
    <div class="grid two-column">
      <article class="card">
        <div class="card-head"><div><p class="eyebrow">Close the loop</p><h2>What did the week teach?</h2></div></div>
        <div class="reflection-prompts">
          ${reflectionField("win", "What moved forward?", "Name the real win, however small.")}
          ${reflectionField("friction", "Where did friction appear?", "Notice the situation, not a character flaw.")}
          ${reflectionField("lesson", "What will you keep or change?", "Turn the observation into a design decision.")}
          ${reflectionField("next", "What may matter next week?", "Capture it without committing yet.")}
        </div>
      </article>
      <aside class="stack">
        <article class="card card-muted">
          <div class="card-head"><div><p class="eyebrow">Recovery decision</p><h2>What does capacity need?</h2></div></div>
          <div class="recovery-grid">
            ${[["restore","Restore","Lower load"],["maintain","Maintain","Stay steady"],["expand","Expand","Add stretch"]].map(([key,label,note]) => `<button class="recovery-option ${state.reflection.recovery === key ? "selected" : ""}" data-recovery="${key}"><strong>${label}</strong><small>${note}</small></button>`).join("")}
          </div>
          <p class="suggestion">Recovery is part of the production system. Choose what makes next week's focus sustainable.</p>
        </article>
        <article class="card card-green">
          <p class="eyebrow">This system so far</p>
          <h2 class="outcome-title">${completed} actions moved. ${routineChecks} routine links kept.</h2>
          <p class="outcome-evidence">Use the numbers as clues, never verdicts.</p>
        </article>
      </aside>
    </div>`;
}

function reflectionField(key, label, placeholder) {
  return `<div class="field"><label for="reflection-${key}">${label}</label><textarea id="reflection-${key}" data-reflection="${key}" placeholder="${placeholder}">${escapeHTML(state.reflection[key])}</textarea></div>`;
}

function goToView(view) {
  activeView = view;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openEditor(type, id = null) {
  const dialog = document.getElementById("editor-dialog");
  const fields = document.getElementById("dialog-fields");
  const deleteButton = document.getElementById("delete-item");
  editor = { type, id };
  const collection = type === "task" ? state.tasks : type === "cue" ? state.cues : state.scripts;
  const item = id ? collection.find(entry => entry.id === id) : null;
  document.getElementById("dialog-eyebrow").textContent = id ? "Update your system" : "Add to your system";
  document.getElementById("dialog-title").textContent = ({ task: "Action", cue: "Cue–response", script: "If–then script" })[type];
  deleteButton.classList.toggle("hidden", !id);

  if (type === "task") {
    fields.innerHTML = `
      <div class="field"><label for="edit-name">Action</label><input id="edit-name" name="name" required value="${escapeHTML(item?.name || "")}" placeholder="The next visible action" /></div>
      <div class="inline-fields">
        <div class="field"><label for="edit-impact">Impact</label><select id="edit-impact" name="impact">${[1,2,3].map(v => `<option value="${v}" ${item?.impact === v ? "selected" : ""}>${v} — ${["Useful","Meaningful","Outcome-driving"][v-1]}</option>`).join("")}</select></div>
        <div class="field"><label for="edit-complexity">Complexity</label><select id="edit-complexity" name="complexity">${[1,2,3].map(v => `<option value="${v}" ${item?.complexity === v ? "selected" : ""}>${v} — ${["Simple","Focused","Deep"][v-1]}</option>`).join("")}</select></div>
        <div class="field"><label for="edit-energy">Energy</label><select id="edit-energy" name="energy">${["low","medium","high"].map(v => `<option value="${v}" ${item?.energy === v ? "selected" : ""}>${energyLabel(v)}</option>`).join("")}</select></div>
      </div>
      <div class="field"><label for="edit-duration">Minutes</label><input id="edit-duration" name="duration" type="number" min="5" max="300" step="5" value="${item?.duration || 30}" /></div>`;
  } else if (type === "cue") {
    fields.innerHTML = `
      <div class="field"><label for="edit-name">Action name</label><input id="edit-name" name="name" required value="${escapeHTML(item?.name || "")}" placeholder="Meditation" /></div>
      <div class="field"><label for="edit-cue">When this happens</label><textarea id="edit-cue" name="cue" required placeholder="After I drink my morning water">${escapeHTML(item?.cue || "")}</textarea></div>
      <div class="field"><label for="edit-response">I do this</label><textarea id="edit-response" name="response" required placeholder="I sit in my meditation spot and start the timer">${escapeHTML(item?.response || "")}</textarea></div>`;
  } else {
    fields.innerHTML = `
      <div class="field"><label for="edit-trigger">If</label><textarea id="edit-trigger" name="trigger" required placeholder="I wake later than planned">${escapeHTML(item?.trigger || "")}</textarea></div>
      <div class="field"><label for="edit-response">Then</label><textarea id="edit-response" name="response" required placeholder="I switch to Recovery mode and begin from now">${escapeHTML(item?.response || "")}</textarea></div>`;
  }
  dialog.showModal();
  setTimeout(() => fields.querySelector("input, textarea")?.focus(), 50);
}

function saveEditor() {
  const form = document.getElementById("editor-form");
  if (!form.reportValidity()) return false;
  const formData = Object.fromEntries(new FormData(form));
  const collection = editor.type === "task" ? state.tasks : editor.type === "cue" ? state.cues : state.scripts;
  let item = editor.id ? collection.find(entry => entry.id === editor.id) : null;
  if (!item) {
    item = { id: crypto.randomUUID() };
    collection.push(item);
  }
  if (editor.type === "task") Object.assign(item, { name: formData.name.trim(), impact: Number(formData.impact), complexity: Number(formData.complexity), energy: formData.energy, duration: Number(formData.duration), done: item.done || false });
  if (editor.type === "cue") Object.assign(item, { name: formData.name.trim(), cue: formData.cue.trim(), response: formData.response.trim() });
  if (editor.type === "script") Object.assign(item, { trigger: formData.trigger.trim(), response: formData.response.trim() });
  saveState("System updated");
  render();
  return true;
}

function deleteEditor() {
  if (!editor?.id || !confirm("Delete this item?")) return;
  const collection = editor.type === "task" ? state.tasks : editor.type === "cue" ? state.cues : state.scripts;
  collection.splice(collection.findIndex(entry => entry.id === editor.id), 1);
  saveState("Item deleted");
  render();
  document.getElementById("editor-dialog").close();
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

document.addEventListener("click", event => {
  const target = event.target.closest("button, [data-edit-script]");
  if (!target) return;
  if (target.dataset.viewTarget) return goToView(target.dataset.viewTarget);
  if (target.dataset.energy) {
    const daily = todayState();
    daily.energy = Number(target.dataset.energy);
    daily.mode = suggestedMode(daily.energy);
    daily.routine = [];
    saveState(); render();
  }
  if (target.dataset.mode) { const daily = todayState(); daily.mode = target.dataset.mode; daily.routine = []; saveState(); render(); }
  if (target.dataset.routineIndex) { const daily = todayState(); const index = Number(target.dataset.routineIndex); daily.routine[index] = !daily.routine[index]; saveState(daily.routine[index] ? "Link kept" : "Marked incomplete"); render(); }
  if (target.dataset.taskToggle) { const task = state.tasks.find(item => item.id === target.dataset.taskToggle); task.done = !task.done; saveState(task.done ? "Action complete" : "Action reopened"); render(); }
  if (target.dataset.add) openEditor(target.dataset.add);
  if (target.dataset.editTask) openEditor("task", target.dataset.editTask);
  if (target.dataset.editCue) openEditor("cue", target.dataset.editCue);
  if (target.dataset.editScript) openEditor("script", target.dataset.editScript);
  if (target.dataset.recovery) { state.reflection.recovery = target.dataset.recovery; saveState("Recovery intention saved"); render(); }
});

document.addEventListener("change", event => {
  if (event.target.dataset.weekField) { state.week[event.target.dataset.weekField] = event.target.value.trim(); saveState("Weekly compass saved"); }
  if (event.target.dataset.reflection) { state.reflection[event.target.dataset.reflection] = event.target.value.trim(); saveState("Reflection saved"); }
});

document.getElementById("editor-form").addEventListener("submit", event => {
  if (event.submitter?.value === "cancel") return;
  if (!saveEditor()) event.preventDefault();
});
document.getElementById("delete-item").addEventListener("click", deleteEditor);
document.getElementById("open-settings").addEventListener("click", () => document.getElementById("settings-dialog").showModal());
document.getElementById("export-data").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const link = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `flow-maxing-backup-${dayKey()}.json` });
  link.click(); URL.revokeObjectURL(link.href); showToast("Backup exported");
});
document.getElementById("import-data").addEventListener("change", async event => {
  try {
    const imported = JSON.parse(await event.target.files[0].text());
    if (imported.version !== 1 || !imported.week || !Array.isArray(imported.tasks)) throw new Error();
    state = imported; saveState("Backup restored"); render(); document.getElementById("settings-dialog").close();
  } catch { showToast("That backup could not be read"); }
  event.target.value = "";
});
document.getElementById("reset-data").addEventListener("click", () => {
  if (!confirm("Reset Flow Maxing and replace all current data? Export a backup first if you may want it later.")) return;
  state = defaultState(); saveState("Fresh system created"); render(); document.getElementById("settings-dialog").close();
});

if ("serviceWorker" in navigator && location.protocol !== "file:") navigator.serviceWorker.register("service-worker.js");
render();
