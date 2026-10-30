const STORAGE_KEY = "flow-maxing-os-v1";

const MODES = {
  minimum: { label: "Minimum", note: "An intentionally smaller day. Preserve the foundations and one essential action.", routine: [["Water + daylight", "Open the curtains and begin from now.", 2], ["Breathe or meditate", "Choose the easiest two-minute version.", 2], ["Eat properly", "Protect basic energy before performance.", 10], ["One essential action", "Complete the smallest useful version.", 25], ["Prepare for sleep", "Reduce tomorrow's recovery debt.", 10]] },
  standard: { label: "Standard", note: "Your sustainable day: foundations, one deep-work block, movement, and a clean shutdown.", routine: [["Water + daylight", "No phone. Let the day begin deliberately.", 5], ["Breathwork", "Five comfortable minutes after water.", 5], ["Meditation", "Start immediately when breathwork ends.", 10], ["Read", "Fifteen minutes after breakfast.", 15], ["Focused work", "One protected, outcome-driven block.", 90], ["Movement", "Walk, gym, or sport after the work block.", 30], ["Evening reflection", "Choose tomorrow's outcome and close the day.", 5]] },
  peak: { label: "Peak", note: "Use naturally high energy for worthwhile work without borrowing from tomorrow.", routine: [["Morning foundations", "Water, daylight, breathwork, meditation, food.", 30], ["Read", "Capture one idea worth applying.", 15], ["Deep work one", "Highest-complexity weekly outcome.", 100], ["Proper break", "Eat, move, and reset attention.", 30], ["Deep work two", "Only if capacity and value are both present.", 75], ["Movement", "Train or walk without rushing recovery.", 40], ["Evening shutdown", "Preserve the next morning.", 10]] }
};

const CUE_DEFAULTS = [
  { name: "Wake consistently", cue: "When my alarm sounds", response: "I get out of bed and open the curtains", setup: "Keep water ready and curtains easy to open", remove: "Keep the phone away from the bed" },
  { name: "Breathwork", cue: "After I drink my morning water", response: "I sit down and begin five minutes of slow breathing", setup: "Keep the breathing space clear and ready", remove: "Do not open social media first" },
  { name: "Meditation", cue: "When breathwork ends", response: "I start a 10-minute meditation", setup: "Leave the meditation seat prepared", remove: "Keep notifications silent" },
  { name: "Reading", cue: "After breakfast", response: "I open the book already placed nearby", setup: "Leave the current book at the breakfast spot", remove: "Do not open news or feeds before reading" },
  { name: "Focused work", cue: "When I sit at my prepared desk", response: "I open yesterday's selected task and begin", setup: "Prepare the task and files the night before", remove: "Close unrelated tabs and silence notifications" },
  { name: "Movement", cue: "When my main work block ends", response: "I put on prepared exercise clothes", setup: "Lay out clothes and shoes in advance", remove: "Avoid sitting down to scroll first" },
  { name: "Evening shutdown", cue: "When I plug in my phone for the night", response: "I write tomorrow's priority and close work", setup: "Keep a notebook beside the charging station", remove: "Turn off unnecessary work alerts" }
];

const defaultState = () => ({
  version: 2,
  week: { outcome: "Create consistent movement in the business", secondary: "Protect health, clarity, and recovery while executing", evidence: "Complete one meaningful business deliverable and identify the next milestone.", why: "Build proof that focused mornings compound into real momentum." },
  tasks: [
    { id: crypto.randomUUID(), name: "Define this week's business needle-mover", impact: 3, complexity: 2, energy: "high", duration: 30, done: false },
    { id: crypto.randomUUID(), name: "Complete one focused business work block", impact: 3, complexity: 3, energy: "high", duration: 90, done: false },
    { id: crypto.randomUUID(), name: "Capture decisions and the next visible action", impact: 2, complexity: 1, energy: "low", duration: 15, done: false }
  ],
  cues: CUE_DEFAULTS.map(cue => ({ id: crypto.randomUUID(), ...cue })),
  scripts: [
    { id: crypto.randomUUID(), trigger: "I wake later than planned", response: "I choose Minimum mode, skip guilt, and begin the reduced sequence from now." },
    { id: crypto.randomUUID(), trigger: "I do not feel motivated", response: "I work for 10 minutes before deciding whether to continue." },
    { id: crypto.randomUUID(), trigger: "I feel overwhelmed", response: "I write everything down, identify one next action, and begin there." },
    { id: crypto.randomUUID(), trigger: "I start overthinking", response: "I separate what I know from what I am assuming and choose one testable action." },
    { id: crypto.randomUUID(), trigger: "I become distracted", response: "I capture the distraction in a note and return to the current task." },
    { id: crypto.randomUUID(), trigger: "I feel mentally exhausted", response: "I switch to a simpler task or recover instead of forcing complex work." }
  ],
  finances: { balances: { personal: 0, business: 0, held: 0 }, transactions: [], commitments: [{ id: crypto.randomUUID(), name: "Known monthly commitments", amount: 710 }], obligations: [{ id: crypto.randomUUID(), name: "Money to replace", target: 3000, paid: 0 }], investments: [] },
  daily: {},
  reflection: { win: "", friction: "", lesson: "", next: "", recovery: "maintain", ratings: [3, 3, 3, 3, 3] },
  life: { relationships: "", enjoyment: "", health: "", growth: "" },
  monthly: {}
});

let state = loadState();
let activeView = "today";
let editor = null;
let toastTimer;

function normalizeState(input) {
  const base = defaultState();
  if (!input || typeof input !== "object") return base;
  const sourceCues = Array.isArray(input.cues) ? input.cues : [];
  const cues = sourceCues.map(cue => {
    const match = CUE_DEFAULTS.find(item => item.name.toLowerCase() === String(cue.name).toLowerCase());
    return { id: cue.id || crypto.randomUUID(), ...match, ...cue, setup: cue.setup || match?.setup || "Prepare the environment before the cue arrives", remove: cue.remove || match?.remove || "Remove the easiest competing action" };
  });
  CUE_DEFAULTS.forEach(cue => { if (!cues.some(item => item.name.toLowerCase() === cue.name.toLowerCase())) cues.push({ id: crypto.randomUUID(), ...cue }); });
  const daily = input.daily || {};
  Object.values(daily).forEach(day => { if (day.mode === "recovery") day.mode = "minimum"; if (day.mode === "steady") day.mode = "standard"; });
  return {
    ...base, ...input, version: 2,
    week: { ...base.week, ...(input.week || {}) },
    tasks: Array.isArray(input.tasks) ? input.tasks : base.tasks,
    cues,
    scripts: Array.isArray(input.scripts) ? input.scripts : base.scripts,
    finances: { ...base.finances, ...(input.finances || {}), balances: { ...base.finances.balances, ...(input.finances?.balances || {}) }, transactions: Array.isArray(input.finances?.transactions) ? input.finances.transactions : [], commitments: Array.isArray(input.finances?.commitments) ? input.finances.commitments : base.finances.commitments, obligations: Array.isArray(input.finances?.obligations) ? input.finances.obligations : base.finances.obligations, investments: Array.isArray(input.finances?.investments) ? input.finances.investments : [] },
    daily,
    reflection: { ...base.reflection, ...(input.reflection || {}), ratings: input.reflection?.ratings || base.reflection.ratings },
    life: { ...base.life, ...(input.life || {}) }, monthly: input.monthly || {}
  };
}

function loadState() { try { return normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY))); } catch { return defaultState(); } }
function saveState(message) { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); if (message) showToast(message); }
function dayKey(date = new Date()) { return date.toLocaleDateString("en-CA"); }
function monthKey(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; }
function todayState() { const key = dayKey(); state.daily[key] = { energy: 0, clarity: 0, mode: "standard", routine: [], win: "", friction: "", tomorrow: "", ...(state.daily[key] || {}) }; return state.daily[key]; }
function monthlyState() { const key = monthKey(); state.monthly[key] = { financial: "", growth: "", business: "", lifestyle: "", adjustment: "", ...(state.monthly[key] || {}) }; return state.monthly[key]; }
function suggestedMode(energy) { return energy <= 2 ? "minimum" : energy <= 4 ? "standard" : "peak"; }
function formatDate() { return new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" }).format(new Date()); }
function greeting() { const hour = new Date().getHours(); return hour < 12 ? "Good morning." : hour < 18 ? "Good afternoon." : "Good evening."; }
function escapeHTML(value = "") { return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char])); }
function currency(value) { return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 2 }).format(Number(value) || 0); }
function energyLabel(value) { return ({ low: "Low energy", medium: "Medium energy", high: "High energy" })[value]; }
function taskScore(task, energy) { const capacity = energy >= 5 ? 3 : energy >= 3 ? 2 : 1; const taskEnergy = { low: 1, medium: 2, high: 3 }[task.energy]; return task.impact * 4 + (4 - Math.abs(capacity - taskEnergy)) * 2 - task.complexity; }

function moneyTotals() {
  const totals = { ...state.finances.balances };
  state.finances.transactions.forEach(item => { const sign = item.type === "income" ? 1 : -1; totals[item.account] = (Number(totals[item.account]) || 0) + sign * Number(item.amount || 0); });
  const commitments = state.finances.commitments.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const obligations = state.finances.obligations.reduce((sum, item) => sum + Math.max(0, Number(item.target || 0) - Number(item.paid || 0)), 0);
  const investments = state.finances.investments.reduce((sum, item) => sum + Number(item.current || 0), 0);
  return { ...totals, available: totals.personal + totals.business, commitments, obligations, investments };
}
function spentToday() { return state.finances.transactions.filter(item => item.date === dayKey() && item.type === "expense").reduce((sum, item) => sum + Number(item.amount || 0), 0); }

function render() {
  renderToday(); renderMoney(); renderWeek(); renderArchitecture(); renderReview();
  document.querySelectorAll(".view").forEach(view => view.classList.toggle("active", view.id === `view-${activeView}`));
  document.querySelectorAll(".nav-item").forEach(item => item.classList.toggle("active", item.dataset.viewTarget === activeView));
}

function renderToday() {
  const daily = todayState(); const mode = MODES[daily.mode] || MODES.standard; const totals = moneyTotals();
  const routineDone = daily.routine.filter(Boolean).length;
  const openTasks = state.tasks.filter(task => !task.done).sort((a, b) => taskScore(b, daily.energy || 3) - taskScore(a, daily.energy || 3));
  const primary = openTasks[0];
  document.getElementById("view-today").innerHTML = `
    <div class="page-head"><p class="eyebrow">${escapeHTML(formatDate())} · Command centre</p><h1 id="today-heading">${greeting()}</h1><p>Protect the foundations, move one meaningful outcome, and keep the rest of life visible.</p></div>
    <div class="engine-grid">${engineStat("Money", currency(totals.available), "Available now", "money")}${engineStat("Routine", `${routineDone}/${mode.routine.length}`, `${mode.label} mode`, "today")}${engineStat("Mental", daily.clarity ? `${daily.clarity}/5` : "—", "Clarity", "today")}${engineStat("Execution", primary ? "1 next" : "Clear", primary?.name || "No open actions", "week")}${engineStat("Life", state.life.relationships || state.life.enjoyment ? "Planned" : "Open", "Relationships + enjoyment", "review")}</div>
    <div class="grid two-column">
      <div class="stack">
        <article class="card card-green"><p class="eyebrow">Primary weekly outcome</p><h2 class="outcome-title">${escapeHTML(state.week.outcome)}</h2><p class="outcome-evidence">${escapeHTML(state.week.evidence)}</p>${primary ? `<div class="next-action"><span>Next action</span><strong>${escapeHTML(primary.name)}</strong></div>` : ""}</article>
        <article class="card"><div class="card-head"><div><p class="eyebrow">Daily routine OS</p><h2>${mode.label} mode</h2><p>${mode.note}</p></div><span class="tag">${routineDone}/${mode.routine.length}</span></div><div class="routine-list">${mode.routine.map((item, index) => `<div class="routine-item"><button class="check-button ${daily.routine[index] ? "done" : ""}" data-routine-index="${index}" aria-label="Toggle ${escapeHTML(item[0])}"></button><div class="routine-copy"><strong>${escapeHTML(item[0])}</strong><small>${escapeHTML(item[1])}</small></div><span class="duration">${item[2]} min</span></div>`).join("")}</div></article>
        <article class="card"><div class="card-head"><div><p class="eyebrow">Execution OS</p><h2>Best use of this energy</h2></div><button class="text-button" data-add="task">+ Add</button></div><div class="task-list">${openTasks.length ? openTasks.slice(0, 4).map(taskTemplate).join("") : '<div class="empty">No open actions. Choose the next meaningful outcome.</div>'}</div></article>
      </div>
      <aside class="stack">
        <article class="card card-muted"><div class="card-head"><div><p class="eyebrow">State check-in</p><h2>What capacity is here?</h2></div></div><span class="micro-label">Energy</span><div class="energy-picker">${[1,2,3,4,5].map(value => `<button class="energy-button ${daily.energy === value ? "selected" : ""}" data-energy="${value}"><span>${["○","◔","◑","◕","●"][value-1]}</span><small>${value}</small></button>`).join("")}</div><span class="micro-label clarity-label">Mental clarity</span><div class="energy-picker compact-picker">${[1,2,3,4,5].map(value => `<button class="energy-button ${daily.clarity === value ? "selected" : ""}" data-clarity="${value}"><small>${value}</small></button>`).join("")}</div><div class="mode-row">${Object.entries(MODES).map(([key, value]) => `<button class="mode-button ${daily.mode === key ? "selected" : ""}" data-mode="${key}">${value.label}</button>`).join("")}</div><p class="suggestion">${daily.energy ? `Energy ${daily.energy}/5 suggests <strong>${MODES[suggestedMode(daily.energy)].label}</strong>. Minimum is valid, not failure.` : "Choose your honest state. The system should fit you—not fight you."}</p></article>
        <article class="card"><div class="card-head"><div><p class="eyebrow">Evening feedback loop</p><h2>Close the day cleanly</h2></div></div>${dailyField("win", "What moved today?", "Name the meaningful progress.")}${dailyField("friction", "What caused friction?", "Situation, cue, or missing preparation.")}${dailyField("tomorrow", "Tomorrow's main outcome", "One finish condition for tomorrow.")}<p class="money-note">Recorded spending today: <strong>${currency(spentToday())}</strong></p></article>
      </aside>
    </div>`;
}

function engineStat(name, value, note, view) { return `<button class="engine-stat" data-view-target="${view}"><span>${name}</span><strong>${escapeHTML(value)}</strong><small>${escapeHTML(note)}</small></button>`; }
function dailyField(key, label, placeholder) { return `<div class="field"><label for="daily-${key}">${label}</label><textarea id="daily-${key}" data-daily-field="${key}" placeholder="${placeholder}">${escapeHTML(todayState()[key])}</textarea></div>`; }
function taskTemplate(task) { return `<div class="task-card ${task.done ? "done" : ""}"><button class="check-button ${task.done ? "done" : ""}" data-task-toggle="${task.id}" aria-label="Toggle task"></button><div class="task-copy"><p class="task-name">${escapeHTML(task.name)}</p><div class="task-meta"><span class="tag tag-impact">Impact ${task.impact}</span><span class="tag">Complexity ${task.complexity}</span><span class="tag">${escapeHTML(energyLabel(task.energy))}</span><span class="tag">${task.duration} min</span></div></div><button class="edit-button" data-edit-task="${task.id}" aria-label="Edit task">•••</button></div>`; }

function renderMoney() {
  const totals = moneyTotals(); const transactions = [...state.finances.transactions].sort((a,b) => b.date.localeCompare(a.date));
  document.getElementById("view-money").innerHTML = `
    <div class="page-head"><p class="eyebrow">Financial OS</p><h1 id="money-heading">Know your position.</h1><p>Every pound has a purpose. Expected investment money does not count until it actually arrives.</p></div>
    <div class="money-summary">${moneyStat("Available cash", currency(totals.available), "Personal + business")}${moneyStat("Held for others", currency(totals.held), "Always separate")}${moneyStat("Monthly commitments", currency(totals.commitments), `${currency(totals.commitments * 3)} over 3 months`)}${moneyStat("Obligations remaining", currency(totals.obligations), "Tracked explicitly")}</div>
    <div class="grid two-column">
      <div class="stack">
        <article class="card"><div class="card-head"><div><p class="eyebrow">Cash ledger</p><h2>Transactions</h2><p>Record reality, not forecasts.</p></div><button class="button button-secondary button-small" data-add="transaction">+ Transaction</button></div><div class="ledger-list">${transactions.length ? transactions.slice(0, 20).map(transactionTemplate).join("") : '<div class="empty">No transactions recorded yet.</div>'}</div></article>
        <article class="card"><div class="card-head"><div><p class="eyebrow">Starting position</p><h2>Opening balances</h2></div></div><div class="balance-grid">${balanceField("personal", "Personal cash")}${balanceField("business", "Business cash")}${balanceField("held", "Money held for others")}</div><p class="privacy-note">Use opening balances once, then keep the ledger current.</p></article>
      </div>
      <aside class="stack">${moneyCollectionCard("commitment", "Monthly commitments", "Recurring obligations", state.finances.commitments, item => `${escapeHTML(item.name)} · ${currency(item.amount)}`)}${moneyCollectionCard("obligation", "Liabilities + obligations", "What must be restored or repaid", state.finances.obligations, item => `${escapeHTML(item.name)} · ${currency(Math.max(0, item.target - item.paid))} remaining`)}${moneyCollectionCard("investment", "Investments", "Visible, but unavailable until realised", state.finances.investments, item => `${escapeHTML(item.name)} · ${currency(item.current)} current value`)}</aside>
    </div>`;
}
function moneyStat(label, value, note) { return `<article class="money-stat"><span>${label}</span><strong>${value}</strong><small>${note}</small></article>`; }
function balanceField(key, label) { return `<div class="field"><label for="balance-${key}">${label}</label><input id="balance-${key}" data-balance="${key}" type="number" step="0.01" value="${Number(state.finances.balances[key]) || 0}" /></div>`; }
function transactionTemplate(item) { const sign = item.type === "income" ? "+" : "−"; return `<div class="ledger-row"><div><strong>${escapeHTML(item.note || item.category)}</strong><small>${escapeHTML(item.date)} · ${escapeHTML(item.account)} · ${escapeHTML(item.category)}</small></div><div class="ledger-amount ${item.type}">${sign}${currency(item.amount)}<button class="edit-button" data-edit-transaction="${item.id}" aria-label="Edit transaction">•••</button></div></div>`; }
function moneyCollectionCard(type, title, note, items, formatter) { return `<article class="card"><div class="card-head"><div><p class="eyebrow">${title}</p><h2>${note}</h2></div><button class="text-button" data-add="${type}">+ Add</button></div><div class="simple-list">${items.length ? items.map(item => `<button data-edit-${type}="${item.id}"><span>${formatter(item)}</span><span>›</span></button>`).join("") : '<div class="empty">Nothing recorded.</div>'}</div></article>`; }

function renderWeek() {
  const open = state.tasks.filter(task => !task.done).sort((a,b) => b.impact - a.impact || b.complexity - a.complexity); const done = state.tasks.filter(task => task.done);
  document.getElementById("view-week").innerHTML = `<div class="page-head"><p class="eyebrow">Execution OS</p><h1 id="week-heading">Define the win.</h1><p>No more than two major outcomes. Everything else is maintenance, exploration, or deliberately deferred.</p></div><div class="grid two-column"><div class="stack"><article class="week-outcome"><div class="field"><label for="week-outcome">Primary weekly outcome</label><input class="outcome-input" id="week-outcome" data-week-field="outcome" value="${escapeHTML(state.week.outcome)}" placeholder="One measurable result" /></div><div class="field"><label for="week-secondary">Secondary outcome</label><input id="week-secondary" data-week-field="secondary" value="${escapeHTML(state.week.secondary)}" placeholder="One additional meaningful result" /></div><div class="field"><label for="week-evidence">Evidence it happened</label><textarea id="week-evidence" data-week-field="evidence">${escapeHTML(state.week.evidence)}</textarea></div><div class="field"><label for="week-why">Why this matters now</label><textarea id="week-why" data-week-field="why">${escapeHTML(state.week.why)}</textarea></div></article><article class="card"><div class="card-head"><div><p class="eyebrow">Flow-matched work</p><h2>Open actions</h2><p>Complexity chooses the energy window. Impact chooses the priority.</p></div><button class="button button-secondary button-small" data-add="task">+ Action</button></div><div class="task-list">${open.length ? open.map(taskTemplate).join("") : '<div class="empty">The week is clear.</div>'}</div></article></div><aside class="stack"><article class="card card-muted"><div class="card-head"><div><p class="eyebrow">Daily hierarchy</p><h2>Know when work is finished</h2></div></div><div class="priority-rule"><strong>1</strong><span><b>Main outcome</b>One meaningful deliverable.</span></div><div class="priority-rule"><strong>2</strong><span><b>Supporting tasks</b>Up to two useful actions.</span></div><div class="priority-rule"><strong>3</strong><span><b>Maintenance</b>Only essential responsibilities.</span></div></article><article class="card"><div class="card-head"><div><p class="eyebrow">Completed</p><h2>${done.length} actions moved</h2></div></div><div class="task-list">${done.length ? done.map(taskTemplate).join("") : '<div class="empty">Completed actions collect here.</div>'}</div></article></aside></div>`;
}

function renderArchitecture() {
  document.getElementById("view-architecture").innerHTML = `<div class="page-head"><p class="eyebrow">Routine + Mental OS</p><h1 id="architecture-heading">Make starting obvious.</h1><p>Install positive cues, remove competing cues, and pre-decide what happens when your state changes.</p></div><div class="grid two-column"><article class="card"><div class="card-head"><div><p class="eyebrow">Cue-driven architecture</p><h2>Trigger → action → environment</h2></div><button class="button button-secondary button-small" data-add="cue">+ Cue</button></div><div class="architecture-flow">${state.cues.map((cue,index) => `<div class="cue-card"><span class="cue-number">${index+1}</span><div class="cue-content"><h3>${escapeHTML(cue.name)}</h3><div class="cue-line"><strong>When</strong><span>${escapeHTML(cue.cue)}</span></div><div class="cue-line"><strong>Then</strong><span>${escapeHTML(cue.response)}</span></div><div class="cue-line positive"><strong>Install</strong><span>${escapeHTML(cue.setup)}</span></div><div class="cue-line negative"><strong>Remove</strong><span>${escapeHTML(cue.remove)}</span></div></div><div class="cue-actions"><button class="edit-button" data-edit-cue="${cue.id}">•••</button></div></div>`).join("")}</div></article><aside class="stack"><article class="card"><div class="card-head"><div><p class="eyebrow">Prepared responses</p><h2>If–then scripts</h2></div><button class="button button-secondary button-small" data-add="script">+ Script</button></div><div class="script-list">${state.scripts.map(script => `<div class="script-card" data-edit-script="${script.id}" role="button" tabindex="0"><p><strong>If</strong> ${escapeHTML(script.trigger)}, <strong>then</strong> ${escapeHTML(script.response)}</p></div>`).join("")}</div></article><article class="card card-muted"><p class="quote">A missed action is system data.</p><p class="quote-note">Ask which cue was missing, which competing cue was present, and which single environmental change would help next time.</p></article></aside></div>`;
}

function renderReview() {
  const dimensions = [["Sleep and energy", "Was I getting enough rest and waking with usable energy?"], ["Mental clarity", "Did I feel present, focused, and emotionally regulated?"], ["Execution", "Did I make meaningful progress on my main priorities?"], ["Physical wellbeing", "Did I eat properly, move, and recover?"], ["Life balance", "Did I make time for relationships and enjoyment?"]];
  const average = (state.reflection.ratings.reduce((a,b) => a + Number(b), 0) / 5).toFixed(1); const month = monthlyState();
  document.getElementById("view-review").innerHTML = `<div class="page-head"><p class="eyebrow">Life OS + feedback loop</p><h1 id="review-heading">Learn, then adjust.</h1><p>Review the quality of the system—not your worth. Look for patterns across weeks and months.</p></div><div class="grid two-column"><div class="stack"><article class="card"><div class="card-head"><div><p class="eyebrow">Weekly life assessment</p><h2>Five connected engines</h2></div><strong class="average-score">${average}<small>/5</small></strong></div><div class="rating-list">${dimensions.map((item,index) => ratingTemplate(item,index)).join("")}</div></article><article class="card"><div class="card-head"><div><p class="eyebrow">Weekly reflection</p><h2>Close the loop</h2></div></div><div class="reflection-prompts">${reflectionField("win", "What moved forward?", "Name the real win.")}${reflectionField("friction", "Where did friction appear?", "Notice the system, not a character flaw.")}${reflectionField("lesson", "What cue or design will change?", "One environmental or behavioural adjustment.")}${reflectionField("next", "What may matter next week?", "Capture it without overcommitting.")}</div></article></div><aside class="stack"><article class="card card-muted"><div class="card-head"><div><p class="eyebrow">Life stays visible</p><h2>Protect what work is for</h2></div></div>${lifeField("relationships", "Relationships", "Who needs intentional time?")}${lifeField("enjoyment", "Enjoyment", "Padel, music, socialising, creativity, freedom.")}${lifeField("health", "Health", "Sleep, food, movement, recovery.")}${lifeField("growth", "Growth", "What knowledge will you apply?")}</article><article class="card"><div class="card-head"><div><p class="eyebrow">Monthly strategic review</p><h2>${new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(new Date())}</h2></div></div>${monthlyField("financial", "Financial position", "What changed in cash, commitments, investments, or liabilities?")}${monthlyField("growth", "Personal development", "What changed in capability or character?")}${monthlyField("business", "Business progress", "What value, systems, or revenue moved?")}${monthlyField("lifestyle", "Lifestyle quality", "Is life actually becoming calmer, freer, and fuller?")}${monthlyField("adjustment", "One strategic adjustment", "What single change matters next month?")}</article><article class="card card-muted"><div class="card-head"><div><p class="eyebrow">Recovery decision</p><h2>What does next week need?</h2></div></div><div class="recovery-grid">${[["restore","Restore","Lower load"],["maintain","Maintain","Stay steady"],["expand","Expand","Add stretch"]].map(([key,label,note]) => `<button class="recovery-option ${state.reflection.recovery === key ? "selected" : ""}" data-recovery="${key}"><strong>${label}</strong><small>${note}</small></button>`).join("")}</div></article></aside></div>`;
}
function ratingTemplate(item, index) { return `<div class="rating-row"><div><strong>${item[0]}</strong><small>${item[1]}</small></div><div class="rating-control"><span>${state.reflection.ratings[index]}/5</span><input type="range" min="1" max="5" step="1" value="${state.reflection.ratings[index]}" data-rating="${index}" aria-label="${escapeHTML(item[0])}" /></div></div>`; }
function reflectionField(key, label, placeholder) { return `<div class="field"><label for="reflection-${key}">${label}</label><textarea id="reflection-${key}" data-reflection="${key}" placeholder="${placeholder}">${escapeHTML(state.reflection[key])}</textarea></div>`; }
function lifeField(key, label, placeholder) { return `<div class="field"><label for="life-${key}">${label}</label><textarea id="life-${key}" data-life-field="${key}" placeholder="${placeholder}">${escapeHTML(state.life[key])}</textarea></div>`; }
function monthlyField(key, label, placeholder) { return `<div class="field"><label for="monthly-${key}">${label}</label><textarea id="monthly-${key}" data-monthly-field="${key}" placeholder="${placeholder}">${escapeHTML(monthlyState()[key])}</textarea></div>`; }

function goToView(view) { activeView = view; render(); window.scrollTo({ top: 0, behavior: "smooth" }); }
function editorCollection(type) { if (type === "task") return state.tasks; if (type === "cue") return state.cues; if (type === "script") return state.scripts; if (type === "transaction") return state.finances.transactions; if (type === "commitment") return state.finances.commitments; if (type === "obligation") return state.finances.obligations; if (type === "investment") return state.finances.investments; return []; }

function openEditor(type, id = null) {
  const dialog = document.getElementById("editor-dialog"); const fields = document.getElementById("dialog-fields"); const item = id ? editorCollection(type).find(entry => entry.id === id) : null;
  editor = { type, id };
  document.getElementById("dialog-eyebrow").textContent = id ? "Update your system" : "Add to your system";
  document.getElementById("dialog-title").textContent = ({ task: "Action", cue: "Cue architecture", script: "If–then script", transaction: "Transaction", commitment: "Monthly commitment", obligation: "Obligation", investment: "Investment" })[type];
  document.getElementById("delete-item").classList.toggle("hidden", !id);
  if (type === "task") fields.innerHTML = taskEditor(item);
  if (type === "cue") fields.innerHTML = cueEditor(item);
  if (type === "script") fields.innerHTML = scriptEditor(item);
  if (type === "transaction") fields.innerHTML = transactionEditor(item);
  if (type === "commitment") fields.innerHTML = `<div class="field"><label>Name</label><input name="name" required value="${escapeHTML(item?.name || "")}" /></div><div class="field"><label>Monthly amount (£)</label><input name="amount" type="number" min="0" step="0.01" required value="${item?.amount || ""}" /></div>`;
  if (type === "obligation") fields.innerHTML = `<div class="field"><label>Name</label><input name="name" required value="${escapeHTML(item?.name || "")}" /></div><div class="inline-fields"><div class="field"><label>Total owed (£)</label><input name="target" type="number" min="0" step="0.01" required value="${item?.target || ""}" /></div><div class="field"><label>Already restored (£)</label><input name="paid" type="number" min="0" step="0.01" value="${item?.paid || 0}" /></div></div>`;
  if (type === "investment") fields.innerHTML = `<div class="field"><label>Name</label><input name="name" required value="${escapeHTML(item?.name || "")}" /></div><div class="inline-fields"><div class="field"><label>Contributed (£)</label><input name="contributed" type="number" min="0" step="0.01" value="${item?.contributed || 0}" /></div><div class="field"><label>Current value (£)</label><input name="current" type="number" min="0" step="0.01" value="${item?.current || 0}" /></div></div>`;
  dialog.showModal(); setTimeout(() => fields.querySelector("input, textarea")?.focus(), 50);
}
function taskEditor(item) { return `<div class="field"><label>Action</label><input name="name" required value="${escapeHTML(item?.name || "")}" /></div><div class="inline-fields"><div class="field"><label>Impact</label><select name="impact">${[1,2,3].map(v => `<option value="${v}" ${item?.impact === v ? "selected" : ""}>${v}</option>`).join("")}</select></div><div class="field"><label>Complexity</label><select name="complexity">${[1,2,3].map(v => `<option value="${v}" ${item?.complexity === v ? "selected" : ""}>${v}</option>`).join("")}</select></div><div class="field"><label>Energy</label><select name="energy">${["low","medium","high"].map(v => `<option value="${v}" ${item?.energy === v ? "selected" : ""}>${energyLabel(v)}</option>`).join("")}</select></div></div><div class="field"><label>Minutes</label><input name="duration" type="number" min="5" max="300" step="5" value="${item?.duration || 30}" /></div>`; }
function cueEditor(item) { return `<div class="field"><label>Behaviour</label><input name="name" required value="${escapeHTML(item?.name || "")}" /></div><div class="field"><label>When this happens</label><textarea name="cue" required>${escapeHTML(item?.cue || "")}</textarea></div><div class="field"><label>I immediately</label><textarea name="response" required>${escapeHTML(item?.response || "")}</textarea></div><div class="field"><label>Install this positive cue</label><textarea name="setup" required>${escapeHTML(item?.setup || "")}</textarea></div><div class="field"><label>Remove this competing cue</label><textarea name="remove" required>${escapeHTML(item?.remove || "")}</textarea></div>`; }
function scriptEditor(item) { return `<div class="field"><label>If</label><textarea name="trigger" required>${escapeHTML(item?.trigger || "")}</textarea></div><div class="field"><label>Then</label><textarea name="response" required>${escapeHTML(item?.response || "")}</textarea></div>`; }
function transactionEditor(item) { return `<div class="inline-fields"><div class="field"><label>Type</label><select name="type"><option value="expense" ${item?.type === "expense" ? "selected" : ""}>Expense</option><option value="income" ${item?.type === "income" ? "selected" : ""}>Income</option></select></div><div class="field"><label>Account</label><select name="account">${[["personal","Personal"],["business","Business"],["held","Held for others"]].map(([v,l]) => `<option value="${v}" ${item?.account === v ? "selected" : ""}>${l}</option>`).join("")}</select></div><div class="field"><label>Date</label><input name="date" type="date" required value="${item?.date || dayKey()}" /></div></div><div class="field"><label>Amount (£)</label><input name="amount" type="number" min="0.01" step="0.01" required value="${item?.amount || ""}" /></div><div class="field"><label>Category</label><select name="category">${["Living expenses","Personal reserve","Savings","Business capital","Family support","Money held for others","Income","Other"].map(v => `<option ${item?.category === v ? "selected" : ""}>${v}</option>`).join("")}</select></div><div class="field"><label>Note</label><input name="note" value="${escapeHTML(item?.note || "")}" placeholder="What was this for?" /></div>`; }

function saveEditor() {
  const form = document.getElementById("editor-form"); if (!form.reportValidity()) return false; const data = Object.fromEntries(new FormData(form)); const collection = editorCollection(editor.type); let item = editor.id ? collection.find(entry => entry.id === editor.id) : null;
  if (!item) { item = { id: crypto.randomUUID() }; collection.push(item); }
  if (editor.type === "task") Object.assign(item, { name: data.name.trim(), impact: Number(data.impact), complexity: Number(data.complexity), energy: data.energy, duration: Number(data.duration), done: item.done || false });
  if (editor.type === "cue") Object.assign(item, { name: data.name.trim(), cue: data.cue.trim(), response: data.response.trim(), setup: data.setup.trim(), remove: data.remove.trim() });
  if (editor.type === "script") Object.assign(item, { trigger: data.trigger.trim(), response: data.response.trim() });
  if (editor.type === "transaction") Object.assign(item, { type: data.type, account: data.account, date: data.date, amount: Number(data.amount), category: data.category, note: data.note.trim() });
  if (editor.type === "commitment") Object.assign(item, { name: data.name.trim(), amount: Number(data.amount) });
  if (editor.type === "obligation") Object.assign(item, { name: data.name.trim(), target: Number(data.target), paid: Number(data.paid) });
  if (editor.type === "investment") Object.assign(item, { name: data.name.trim(), contributed: Number(data.contributed), current: Number(data.current) });
  saveState("System updated"); render(); return true;
}
function deleteEditor() { if (!editor?.id || !confirm("Delete this item?")) return; const collection = editorCollection(editor.type); const index = collection.findIndex(entry => entry.id === editor.id); if (index >= 0) collection.splice(index, 1); saveState("Item deleted"); render(); document.getElementById("editor-dialog").close(); }
function showToast(message) { const toast = document.getElementById("toast"); toast.textContent = message; toast.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 1800); }

document.addEventListener("click", event => {
  const target = event.target.closest("button, [data-edit-script]"); if (!target) return;
  if (target.dataset.viewTarget) return goToView(target.dataset.viewTarget);
  if (target.dataset.energy) { const daily = todayState(); daily.energy = Number(target.dataset.energy); daily.mode = suggestedMode(daily.energy); daily.routine = []; saveState(); render(); }
  if (target.dataset.clarity) { todayState().clarity = Number(target.dataset.clarity); saveState(); render(); }
  if (target.dataset.mode) { const daily = todayState(); daily.mode = target.dataset.mode; daily.routine = []; saveState(); render(); }
  if (target.dataset.routineIndex !== undefined) { const daily = todayState(); const index = Number(target.dataset.routineIndex); daily.routine[index] = !daily.routine[index]; saveState(daily.routine[index] ? "Foundation kept" : "Marked incomplete"); render(); }
  if (target.dataset.taskToggle) { const task = state.tasks.find(item => item.id === target.dataset.taskToggle); task.done = !task.done; saveState(task.done ? "Action complete" : "Action reopened"); render(); }
  if (target.dataset.add) openEditor(target.dataset.add);
  ["task","cue","script","transaction","commitment","obligation","investment"].forEach(type => { const key = `edit${type[0].toUpperCase()}${type.slice(1)}`; if (target.dataset[key]) openEditor(type, target.dataset[key]); });
  if (target.dataset.recovery) { state.reflection.recovery = target.dataset.recovery; saveState("Recovery intention saved"); render(); }
});

document.addEventListener("change", event => {
  const target = event.target;
  if (target.dataset.weekField) state.week[target.dataset.weekField] = target.value.trim();
  if (target.dataset.dailyField) todayState()[target.dataset.dailyField] = target.value.trim();
  if (target.dataset.balance) state.finances.balances[target.dataset.balance] = Number(target.value);
  if (target.dataset.reflection) state.reflection[target.dataset.reflection] = target.value.trim();
  if (target.dataset.lifeField) state.life[target.dataset.lifeField] = target.value.trim();
  if (target.dataset.monthlyField) monthlyState()[target.dataset.monthlyField] = target.value.trim();
  if (target.dataset.rating !== undefined) state.reflection.ratings[Number(target.dataset.rating)] = Number(target.value);
  if (target.matches("[data-week-field],[data-daily-field],[data-balance],[data-reflection],[data-life-field],[data-monthly-field],[data-rating]")) {
    saveState("Saved");
    if (target.dataset.rating !== undefined) render();
  }
});
document.addEventListener("input", event => { if (event.target.dataset.rating !== undefined) { state.reflection.ratings[Number(event.target.dataset.rating)] = Number(event.target.value); event.target.closest(".rating-control").querySelector("span").textContent = `${event.target.value}/5`; } });

document.getElementById("editor-form").addEventListener("submit", event => { if (event.submitter?.value === "cancel") return; if (!saveEditor()) event.preventDefault(); });
document.getElementById("delete-item").addEventListener("click", deleteEditor);
document.getElementById("open-settings").addEventListener("click", () => document.getElementById("settings-dialog").showModal());
document.getElementById("export-data").addEventListener("click", () => { const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" }); const link = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `50x-life-os-backup-${dayKey()}.json` }); link.click(); URL.revokeObjectURL(link.href); showToast("Backup exported"); });
document.getElementById("import-data").addEventListener("change", async event => { try { const imported = JSON.parse(await event.target.files[0].text()); if (!imported.week || !Array.isArray(imported.tasks)) throw new Error(); state = normalizeState(imported); saveState("Backup restored and upgraded"); render(); document.getElementById("settings-dialog").close(); } catch { showToast("That backup could not be read"); } event.target.value = ""; });
document.getElementById("reset-data").addEventListener("click", () => { if (!confirm("Reset 50X Life OS and replace all current data? Export a backup first if you may want it later.")) return; state = defaultState(); saveState("Fresh 50X system created"); render(); document.getElementById("settings-dialog").close(); });

if ("serviceWorker" in navigator && location.protocol !== "file:") navigator.serviceWorker.register("service-worker.js");
render();
