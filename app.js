const STORAGE_KEY = "flow-maxing-os-v1";
const SECURITY_KEY = "50x-life-os-security-v1";
const LIVE_URL = "https://stevehenderson1448-netizen.github.io/flow-maxing-os/";

const DEFAULT_MODES = {
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
  { name: "Evening shutdown", cue: "When I plug in my phone for the night", response: "I write tomorrow's priority and close work", setup: "Keep a notebook beside the charging station", remove: "Turn off unnecessary work alerts" },
  { name: "Tomorrow setup", cue: "When my evening reflection ends", response: "I choose tomorrow's important task and prepare everything needed to begin", setup: "Put the materials at the exact place where the action will start", remove: "Do not leave decisions or packing for the morning" },
  { name: "Gym preparation", cue: "When I finish dinner and tomorrow includes training", response: "I pack my gym clothes, shoes, water bottle, towel, and headphones", setup: "Put the packed bag and shoes beside the door", remove: "Do not rely on rushed morning packing" },
  { name: "Leave on time", cue: "When I check tomorrow's calendar during shutdown", response: "I gather the keys, documents, directions, and anything I need to take", setup: "Place everything together beside the door", remove: "Do not search for essentials when it is time to leave" }
];

const TASK_SETUP_DEFAULTS = {
  "Define this week's business needle-mover": { preparation: "Review the weekly outcome and open the decision notes", placement: "Leave the notes open on the clear desk", launchCue: "After morning meditation, sit at the desk and read the weekly outcome", fallback: "Write one sentence naming the result that matters most" },
  "Complete one focused business work block": { preparation: "Choose the exact deliverable, open its files, and close unrelated tabs", placement: "Leave the charged laptop at the clear desk with the first file open", launchCue: "After meditation and breakfast, sit down and start the prepared file", fallback: "Work on the first visible action for 10 minutes" },
  "Capture decisions and the next visible action": { preparation: "Keep one decision note pinned and ready", placement: "Leave the note open beside the work", launchCue: "When the focused work block ends, write the decision before standing up", fallback: "Record one next action in a single sentence" }
};

const CONNECTION_DEFAULT = { type: "", person: "", plan: "", completed: false, completedAt: "", restMinutes: 30, restCompleted: false, restCompletedAt: "" };

const DIMENSIONS = [
  ["Sleep and energy", "Was I getting enough rest and waking with usable energy?"],
  ["Mental clarity", "Did I feel present, focused, and emotionally regulated?"],
  ["Execution", "Did I make meaningful progress on my main priorities?"],
  ["Physical wellbeing", "Did I eat properly, move, and recover?"],
  ["Life balance", "Did I make time for relationships and enjoyment?"]
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function weekStartKey(date = new Date()) {
  const result = new Date(date);
  const day = result.getDay() || 7;
  result.setHours(12, 0, 0, 0);
  result.setDate(result.getDate() - day + 1);
  return dayKey(result);
}

const defaultState = () => ({
  version: 7,
  week: { startedAt: weekStartKey(), outcome: "Create consistent movement in the business", secondary: "Protect health, clarity, and recovery while executing", evidence: "Complete one meaningful business deliverable and identify the next milestone.", why: "Build proof that focused mornings compound into real momentum." },
  tasks: [
    { id: crypto.randomUUID(), name: "Define this week's business needle-mover", impact: 3, complexity: 2, energy: "high", duration: 30, dueDate: "", alignment: "primary", ...TASK_SETUP_DEFAULTS["Define this week's business needle-mover"], createdAt: new Date().toISOString(), done: false },
    { id: crypto.randomUUID(), name: "Complete one focused business work block", impact: 3, complexity: 3, energy: "high", duration: 90, dueDate: "", alignment: "primary", ...TASK_SETUP_DEFAULTS["Complete one focused business work block"], createdAt: new Date().toISOString(), done: false },
    { id: crypto.randomUUID(), name: "Capture decisions and the next visible action", impact: 2, complexity: 1, energy: "low", duration: 15, dueDate: "", alignment: "supporting", ...TASK_SETUP_DEFAULTS["Capture decisions and the next visible action"], createdAt: new Date().toISOString(), done: false }
  ],
  inbox: [],
  history: [],
  modes: clone(DEFAULT_MODES),
  cues: CUE_DEFAULTS.map(cue => ({ id: crypto.randomUUID(), ...cue })),
  scripts: [
    { id: crypto.randomUUID(), trigger: "I wake later than planned", response: "I choose Minimum mode, skip guilt, and begin the reduced sequence from now." },
    { id: crypto.randomUUID(), trigger: "I do not feel motivated", response: "I work for 10 minutes before deciding whether to continue." },
    { id: crypto.randomUUID(), trigger: "I feel overwhelmed", response: "I write everything down, identify one next action, and begin there." },
    { id: crypto.randomUUID(), trigger: "I start overthinking", response: "I separate what I know from what I am assuming and choose one testable action." },
    { id: crypto.randomUUID(), trigger: "I become distracted", response: "I capture the distraction in a note and return to the current task." },
    { id: crypto.randomUUID(), trigger: "I feel mentally exhausted", response: "I switch to a simpler task or recover instead of forcing complex work." }
  ],
  finances: { balances: { personal: 0, business: 0, held: 0 }, settings: { reserveTarget: 500 }, transactions: [], bills: [{ id: crypto.randomUUID(), name: "Known monthly commitments", amount: 710, frequency: "monthly", dueDay: new Date().getDate(), dueMonth: new Date().getMonth() + 1, dueDate: "", kind: "essential", autopay: false, account: "personal", remindDays: 3, createdAt: new Date().toISOString(), paidPeriods: [], previousAmount: 0, amountChangedAt: "", lastReviewed: "" }], obligations: [{ id: crypto.randomUUID(), name: "Money to replace", target: 3000, paid: 0, monthlyPayment: 0 }], investments: [] },
  maintenance: [],
  daily: {},
  reflection: { win: "", friction: "", lesson: "", next: "", recovery: "maintain", ratings: [3, 3, 3, 3, 3] },
  life: { relationships: "", enjoyment: "", health: "", growth: "" },
  monthly: {},
  preferences: { reminders: { enabled: false, morning: "08:00", evening: "21:00", weeklyDay: "0", weeklyTime: "18:00", lastFired: {} } },
  sync: { lastHandoff: null }
});

function normalizeModes(inputModes) {
  const modes = clone(DEFAULT_MODES);
  Object.keys(modes).forEach(key => {
    const source = inputModes?.[key];
    if (!source) return;
    modes[key].label = String(source.label || modes[key].label);
    modes[key].note = String(source.note || modes[key].note);
    if (Array.isArray(source.routine) && source.routine.length) {
      modes[key].routine = source.routine.map(step => Array.isArray(step)
        ? [String(step[0] || "Routine step"), String(step[1] || "Begin with the smallest version."), Math.max(1, Number(step[2]) || 5)]
        : [String(step.name || "Routine step"), String(step.cue || "Begin with the smallest version."), Math.max(1, Number(step.duration) || 5)]);
    }
  });
  return modes;
}

function normalizeTasks(inputTasks, fallback) {
  const source = Array.isArray(inputTasks) ? inputTasks : fallback;
  return source.map(item => {
    const setup = TASK_SETUP_DEFAULTS[item.name] || {};
    return {
    id: item.id || crypto.randomUUID(),
    name: String(item.name || "Untitled action"),
    impact: Math.min(3, Math.max(1, Number(item.impact) || 2)),
    complexity: Math.min(3, Math.max(1, Number(item.complexity) || 1)),
    energy: ["low", "medium", "high"].includes(item.energy) ? item.energy : "medium",
    duration: Math.max(5, Number(item.duration) || 30),
    dueDate: String(item.dueDate || ""),
    alignment: ["primary", "supporting", "maintenance"].includes(item.alignment) ? item.alignment : "supporting",
    preparation: String(item.preparation ?? setup.preparation ?? ""),
    placement: String(item.placement ?? setup.placement ?? ""),
    launchCue: String(item.launchCue ?? setup.launchCue ?? ""),
    fallback: String(item.fallback ?? setup.fallback ?? ""),
    createdAt: item.createdAt || new Date().toISOString(),
    done: Boolean(item.done)
    };
  });
}

function normalizeBills(finances, fallback) {
  const source = Array.isArray(finances?.bills)
    ? finances.bills
    : Array.isArray(finances?.commitments)
      ? finances.commitments
      : fallback;
  const today = new Date();
  return source.map(item => ({
    id: item.id || crypto.randomUUID(),
    name: String(item.name || "Untitled bill"),
    amount: Math.max(0, Number(item.amount) || 0),
    frequency: ["monthly", "annual", "oneoff"].includes(item.frequency) ? item.frequency : "monthly",
    dueDay: Math.min(31, Math.max(1, Number(item.dueDay) || today.getDate())),
    dueMonth: Math.min(12, Math.max(1, Number(item.dueMonth) || today.getMonth() + 1)),
    dueDate: String(item.dueDate || ""),
    kind: ["essential", "subscription", "flexible"].includes(item.kind) ? item.kind : "essential",
    autopay: Boolean(item.autopay),
    account: ["personal", "business"].includes(item.account) ? item.account : "personal",
    remindDays: Math.min(30, Math.max(0, Number(item.remindDays ?? 3))),
    createdAt: item.createdAt || new Date().toISOString(),
    paidPeriods: Array.isArray(item.paidPeriods) ? [...new Set(item.paidPeriods.map(String))] : [],
    previousAmount: Math.max(0, Number(item.previousAmount) || 0),
    amountChangedAt: String(item.amountChangedAt || ""),
    lastReviewed: String(item.lastReviewed || "")
  }));
}

function normalizeMaintenance(items) {
  if (!Array.isArray(items)) return [];
  return items.map(item => ({
    id: item.id || crypto.randomUUID(),
    name: String(item.name || "Life maintenance item"),
    category: ["appointment", "birthday", "renewal", "car", "document", "health", "home", "other"].includes(item.category) ? item.category : "other",
    dueDate: String(item.dueDate || dayKey()),
    recurrence: ["oneoff", "monthly", "annual"].includes(item.recurrence) ? item.recurrence : "oneoff",
    remindDays: Math.min(60, Math.max(0, Number(item.remindDays ?? 7))),
    notes: String(item.notes || ""),
    createdAt: item.createdAt || new Date().toISOString(),
    completedPeriods: Array.isArray(item.completedPeriods) ? [...new Set(item.completedPeriods.map(String))] : []
  }));
}

function normalizeState(input) {
  const base = defaultState();
  if (!input || typeof input !== "object") return base;
  const inputVersion = Number(input.version) || 0;
  const sourceCues = Array.isArray(input.cues) ? input.cues : [];
  const cues = sourceCues.map(cue => {
    const match = CUE_DEFAULTS.find(item => item.name.toLowerCase() === String(cue.name).toLowerCase());
    return { id: cue.id || crypto.randomUUID(), ...match, ...cue, setup: cue.setup ?? match?.setup ?? "Prepare the environment before the cue arrives", remove: cue.remove ?? match?.remove ?? "Remove the easiest competing action" };
  });
  if (inputVersion < 7) {
    CUE_DEFAULTS.forEach(cue => {
      if (!cues.some(item => item.name.toLowerCase() === cue.name.toLowerCase())) cues.push({ id: crypto.randomUUID(), ...cue });
    });
  }
  const daily = input.daily && typeof input.daily === "object" ? input.daily : {};
  Object.values(daily).forEach(day => {
    if (day.mode === "recovery") day.mode = "minimum";
    if (day.mode === "steady") day.mode = "standard";
  });
  return {
    ...base,
    ...input,
    version: 7,
    week: { ...base.week, ...(input.week || {}), startedAt: input.week?.startedAt || weekStartKey() },
    tasks: normalizeTasks(input.tasks, base.tasks),
    inbox: Array.isArray(input.inbox) ? input.inbox : [],
    history: Array.isArray(input.history) ? input.history : [],
    modes: normalizeModes(input.modes),
    cues,
    scripts: Array.isArray(input.scripts) ? input.scripts : base.scripts,
    finances: {
      ...base.finances,
      ...(input.finances || {}),
      balances: { ...base.finances.balances, ...(input.finances?.balances || {}) },
      settings: { ...base.finances.settings, ...(input.finances?.settings || {}) },
      transactions: Array.isArray(input.finances?.transactions) ? input.finances.transactions : [],
      bills: normalizeBills(input.finances, base.finances.bills),
      commitments: undefined,
      obligations: (Array.isArray(input.finances?.obligations) ? input.finances.obligations : base.finances.obligations).map(item => ({ ...item, id: item.id || crypto.randomUUID(), monthlyPayment: Math.max(0, Number(item.monthlyPayment) || 0) })),
      investments: Array.isArray(input.finances?.investments) ? input.finances.investments : []
    },
    maintenance: normalizeMaintenance(input.maintenance),
    daily,
    reflection: { ...base.reflection, ...(input.reflection || {}), ratings: Array.isArray(input.reflection?.ratings) ? input.reflection.ratings : base.reflection.ratings },
    life: { ...base.life, ...(input.life || {}) },
    monthly: input.monthly && typeof input.monthly === "object" ? input.monthly : {},
    preferences: { reminders: { ...base.preferences.reminders, ...(input.preferences?.reminders || {}), lastFired: input.preferences?.reminders?.lastFired || {} } },
    sync: { ...base.sync, ...(input.sync || {}) }
  };
}

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const normalized = normalizeState(stored);
    if (stored?.version !== normalized.version) localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  } catch {
    return defaultState();
  }
}

function loadSecurity() {
  try {
    return { pinHash: "", salt: "", lockMinutes: 5, credentialId: "", credentialUserId: "", ...JSON.parse(localStorage.getItem(SECURITY_KEY)) };
  } catch {
    return { pinHash: "", salt: "", lockMinutes: 5, credentialId: "", credentialUserId: "" };
  }
}

let state = loadState();
let security = loadSecurity();
let activeView = "today";
let editor = null;
let toastTimer;
let lockTimer;
let appUnlocked = !security.pinHash;
let hiddenAt = 0;
let reminderTimer;
let pendingHandoff = readHandoffFromHash();

function saveState(message) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (message) showToast(message);
}

function saveSecurity() {
  localStorage.setItem(SECURITY_KEY, JSON.stringify(security));
  refreshSettings();
}

function dayKey(date = new Date()) {
  return date.toLocaleDateString("en-CA");
}

function monthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function dateFromKey(key) {
  return new Date(`${key}T12:00:00`);
}

function addDays(date, amount) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

function todayState() {
  const key = dayKey();
  const existing = state.daily[key] || {};
  state.daily[key] = { energy: 0, clarity: 0, availableMinutes: 120, mode: "standard", routine: [], win: "", friction: "", tomorrow: "", tomorrowTaskId: "", tomorrowReady: false, ...existing, connection: { ...CONNECTION_DEFAULT, ...(existing.connection || {}) } };
  return state.daily[key];
}

function monthlyState() {
  const key = monthKey();
  state.monthly[key] = { financial: "", growth: "", business: "", lifestyle: "", adjustment: "", ...(state.monthly[key] || {}) };
  return state.monthly[key];
}

function suggestedMode(energy) {
  return energy <= 2 ? "minimum" : energy <= 4 ? "standard" : "peak";
}

function formatDate() {
  return new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
}

function formatCompactDate(value) {
  const date = value instanceof Date ? value : dateFromKey(value);
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(date);
}

function greeting() {
  const hour = new Date().getHours();
  return hour < 12 ? "Good morning." : hour < 18 ? "Good afternoon." : "Good evening.";
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

function currency(value) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 2 }).format(Number(value) || 0);
}

function average(values) {
  const clean = values.map(Number).filter(value => Number.isFinite(value) && value > 0);
  return clean.length ? clean.reduce((sum, value) => sum + value, 0) / clean.length : 0;
}

function energyLabel(value) {
  return ({ low: "Low energy", medium: "Medium energy", high: "High energy" })[value] || "Flexible energy";
}

function taskScore(task, energy) {
  const capacity = energy >= 5 ? 3 : energy >= 3 ? 2 : 1;
  const taskEnergy = { low: 1, medium: 2, high: 3 }[task.energy] || 2;
  return Number(task.impact) * 4 + (4 - Math.abs(capacity - taskEnergy)) * 2 - Number(task.complexity);
}

function taskDueDays(task, reference = new Date()) {
  return task.dueDate ? daysFromToday(dateFromKey(task.dueDate), reference) : null;
}

function smartTaskScore(task, daily = todayState()) {
  const due = taskDueDays(task);
  const urgency = due === null ? 0 : due < 0 ? 22 : due === 0 ? 18 : due <= 3 ? 12 : due <= 7 ? 7 : 0;
  const alignment = ({ primary: 8, supporting: 4, maintenance: 1 })[task.alignment] || 0;
  const timeFit = Number(task.duration) <= Number(daily.availableMinutes || 120) ? 4 : -6;
  return taskScore(task, daily.energy || 3) + urgency + alignment + timeFit;
}

function rankedTasks(daily = todayState()) {
  return state.tasks.filter(task => !task.done).sort((a, b) => smartTaskScore(b, daily) - smartTaskScore(a, daily));
}

function taskReason(task, daily = todayState()) {
  if (task.done) return "Completed this week";
  const due = taskDueDays(task);
  if (due !== null && due < 0) return `${Math.abs(due)} day${Math.abs(due) === 1 ? "" : "s"} overdue`;
  if (due === 0) return "Due today";
  if (due !== null && due <= 3) return `Due in ${due} days`;
  if (task.alignment === "primary") return "Moves the main outcome";
  if (Number(task.duration) <= Number(daily.availableMinutes || 120)) return "Fits today's time and energy";
  return "High-value next action";
}

function recentDailyRecords(length = 7) {
  const earliest = startOfDay(addDays(new Date(), -(length - 1)));
  const tomorrow = startOfDay(addDays(new Date(), 1));
  return Object.entries(state.daily).filter(([key]) => {
    const date = dateFromKey(key);
    return date >= earliest && date < tomorrow;
  }).sort(([a], [b]) => a.localeCompare(b));
}

function connectionSignal(daily = todayState()) {
  const records = recentDailyRecords(7).map(([, item]) => item);
  const connectedDays = records.filter(item => item.connection?.completed).length;
  const restDays = records.filter(item => item.connection?.restCompleted).length;
  const recentTypes = records.filter(item => item.connection?.completed && item.connection.type).map(item => item.connection.type);
  const options = ["call", "text", "plan", "inperson"];
  const recommendedType = options.find(type => !recentTypes.slice(-3).includes(type)) || options[(recentTypes.length + 1) % options.length];
  const labels = { call: "Call someone", text: "Send a real message", plan: "Create a link-up", inperson: "Spend time together" };
  return { connectedDays, restDays, recommendedType, recommendation: labels[recommendedType], completed: Boolean(daily.connection?.completed), restCompleted: Boolean(daily.connection?.restCompleted) };
}

function recoverySignal(daily = todayState()) {
  const records = recentDailyRecords(7).map(([, item]) => item).filter(item => Number(item.energy) > 0);
  const averageEnergy = average(records.map(item => item.energy));
  const averageClarity = average(records.map(item => item.clarity));
  const lowDays = records.filter(item => Number(item.energy) <= 2).length;
  const currentEnergy = Number(daily.energy);
  if ((currentEnergy > 0 && currentEnergy <= 2) || lowDays >= 3 || (records.length >= 3 && averageEnergy < 2.8)) {
    return { key: "restore", mode: "minimum", label: "Protect recovery", note: `${lowDays || 1} low-energy signal${lowDays === 1 ? "" : "s"} this week. Keep foundations and one essential action.`, averageEnergy, averageClarity, lowDays };
  }
  if (currentEnergy >= 5 && (records.length < 2 || averageEnergy >= 3.8) && lowDays === 0) {
    return { key: "expand", mode: "peak", label: "Use the capacity", note: "Energy is strong without a visible recovery warning. Add stretch only after the main outcome.", averageEnergy, averageClarity, lowDays };
  }
  return { key: "maintain", mode: "standard", label: "Stay sustainable", note: records.length ? `Seven-day energy is ${averageEnergy.toFixed(1)}/5. Use a steady load and preserve tomorrow.` : "Check in for a few days and the recovery signal will become more precise.", averageEnergy, averageClarity, lowDays };
}

function routineSignal() {
  const records = recentDailyRecords(14);
  const signals = [];
  Object.entries(state.modes).forEach(([modeKey, mode]) => {
    mode.routine.forEach((step, index) => {
      const opportunities = records.map(([, day]) => day).filter(day => day.mode === modeKey && Array.isArray(day.routine));
      if (opportunities.length < 2) return;
      const completed = opportunities.filter(day => Boolean(day.routine[index])).length;
      signals.push({ modeKey, modeLabel: mode.label, step: step[0], cue: step[1], duration: Number(step[2]), attempts: opportunities.length, completed, rate: Math.round((completed / opportunities.length) * 100) });
    });
  });
  if (!signals.length) return { ready: false, message: "Complete routine check-ins on at least two days and this system will identify the weak link." };
  const weakest = signals.sort((a, b) => a.rate - b.rate || b.attempts - a.attempts)[0];
  const action = weakest.duration > 20 ? `Try a ${Math.max(2, Math.round(weakest.duration / 2))}-minute minimum version.` : `Strengthen the cue: “${weakest.cue}”`;
  return { ready: true, ...weakest, message: weakest.rate >= 80 ? "Your routine architecture is holding. Avoid adding complexity yet." : `${action} Change the design before demanding more discipline.` };
}

function startOfDay(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function clampedDate(year, monthIndex, day) {
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  return new Date(year, monthIndex, Math.min(Math.max(1, Number(day) || 1), lastDay));
}

function daysFromToday(date, reference = new Date()) {
  return Math.round((startOfDay(date) - startOfDay(reference)) / 86400000);
}

function billCycle(bill, reference = new Date()) {
  if (bill.frequency === "monthly") {
    return { period: monthKey(reference), due: clampedDate(reference.getFullYear(), reference.getMonth(), bill.dueDay) };
  }
  if (bill.frequency === "annual") {
    return { period: String(reference.getFullYear()), due: clampedDate(reference.getFullYear(), bill.dueMonth - 1, bill.dueDay) };
  }
  const due = bill.dueDate ? dateFromKey(bill.dueDate) : startOfDay(reference);
  return { period: bill.dueDate || dayKey(due), due };
}

function firstRecurringBillCycle(bill, reference = new Date()) {
  const parsedCreated = new Date(bill.createdAt || reference);
  const created = Number.isNaN(parsedCreated.getTime()) ? startOfDay(reference) : startOfDay(parsedCreated);
  if (bill.frequency === "annual") {
    let year = created.getFullYear();
    let due = clampedDate(year, bill.dueMonth - 1, bill.dueDay);
    if (due < created) {
      year += 1;
      due = clampedDate(year, bill.dueMonth - 1, bill.dueDay);
    }
    return { period: String(year), due };
  }
  let month = new Date(created.getFullYear(), created.getMonth(), 1);
  let due = clampedDate(month.getFullYear(), month.getMonth(), bill.dueDay);
  if (due < created) {
    month = new Date(month.getFullYear(), month.getMonth() + 1, 1);
    due = clampedDate(month.getFullYear(), month.getMonth(), bill.dueDay);
  }
  return { period: monthKey(month), due };
}

function nextOutstandingBillCycle(bill, reference = new Date()) {
  if (bill.frequency === "oneoff") {
    const cycle = billCycle(bill, reference);
    return bill.paidPeriods.includes(cycle.period) ? null : cycle;
  }
  const first = firstRecurringBillCycle(bill, reference);
  if (bill.frequency === "annual") {
    for (let year = first.due.getFullYear(); year <= reference.getFullYear() + 2; year += 1) {
      const period = String(year);
      if (!bill.paidPeriods.includes(period)) return { period, due: clampedDate(year, bill.dueMonth - 1, bill.dueDay) };
    }
    return null;
  }
  const firstMonth = new Date(first.due.getFullYear(), first.due.getMonth(), 1);
  const lastMonth = new Date(reference.getFullYear(), reference.getMonth() + 12, 1);
  for (let cursor = new Date(firstMonth); cursor <= lastMonth; cursor.setMonth(cursor.getMonth() + 1)) {
    const period = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
    if (!bill.paidPeriods.includes(period)) return { period, due: clampedDate(cursor.getFullYear(), cursor.getMonth(), bill.dueDay) };
  }
  return null;
}

function outstandingBillCycles(bill, reference = new Date(), horizonDays = 30) {
  const horizon = startOfDay(addDays(reference, horizonDays));
  const horizonEnd = addDays(horizon, 1);
  if (bill.frequency === "oneoff") {
    const cycle = billCycle(bill, reference);
    return !bill.paidPeriods.includes(cycle.period) && cycle.due < horizonEnd ? [{ ...cycle, days: daysFromToday(cycle.due, reference) }] : [];
  }
  const first = firstRecurringBillCycle(bill, reference);
  const cycles = [];
  if (bill.frequency === "annual") {
    for (let year = first.due.getFullYear(); year <= horizon.getFullYear(); year += 1) {
      const period = String(year);
      const due = clampedDate(year, bill.dueMonth - 1, bill.dueDay);
      if (due < horizonEnd && !bill.paidPeriods.includes(period)) cycles.push({ period, due, days: daysFromToday(due, reference) });
    }
    return cycles;
  }
  const lastMonth = new Date(horizon.getFullYear(), horizon.getMonth(), 1);
  for (let cursor = new Date(first.due.getFullYear(), first.due.getMonth(), 1); cursor <= lastMonth; cursor.setMonth(cursor.getMonth() + 1)) {
    const period = monthKey(cursor);
    const due = clampedDate(cursor.getFullYear(), cursor.getMonth(), bill.dueDay);
    if (due < horizonEnd && !bill.paidPeriods.includes(period)) cycles.push({ period, due, days: daysFromToday(due, reference) });
  }
  return cycles;
}

function billScheduleEntry(bill, reference = new Date()) {
  const current = billCycle(bill, reference);
  const currentPaid = bill.paidPeriods.includes(current.period);
  const outstanding = nextOutstandingBillCycle(bill, reference);
  if (!outstanding) return { bill, due: current.due, period: current.period, days: daysFromToday(current.due, reference), status: "paid", actionPaid: true, hasOutstanding: false };
  const days = daysFromToday(outstanding.due, reference);
  const actionPaid = currentPaid && days > 0;
  const status = actionPaid ? "paid" : days < 0 ? "overdue" : days === 0 ? "today" : days <= Math.max(3, bill.remindDays) ? "soon" : "upcoming";
  return { bill, ...outstanding, days, status, actionPaid, hasOutstanding: true, actionPeriod: actionPaid ? current.period : outstanding.period };
}

function monthlyBillEquivalent(bill) {
  if (bill.frequency === "monthly") return Number(bill.amount || 0);
  if (bill.frequency === "annual") return Number(bill.amount || 0) / 12;
  return 0;
}

function maintenanceCycle(item, reference = new Date(), offset = 0) {
  const original = dateFromKey(item.dueDate || dayKey(reference));
  if (item.recurrence === "oneoff") return { period: item.dueDate, due: original };
  if (item.recurrence === "annual") {
    const baseYear = Math.max(reference.getFullYear(), original.getFullYear()) + offset;
    return { period: String(baseYear), due: clampedDate(baseYear, original.getMonth(), original.getDate()) };
  }
  const base = original > reference
    ? new Date(original.getFullYear(), original.getMonth(), 1)
    : new Date(reference.getFullYear(), reference.getMonth(), 1);
  const target = new Date(base.getFullYear(), base.getMonth() + offset, 1);
  return { period: monthKey(target), due: clampedDate(target.getFullYear(), target.getMonth(), original.getDate()) };
}

function maintenanceScheduleEntry(item, reference = new Date()) {
  const current = maintenanceCycle(item, reference);
  const actionDone = item.completedPeriods.includes(current.period);
  if (item.recurrence === "oneoff") {
    const days = daysFromToday(current.due, reference);
    return { item, ...current, actionPeriod: current.period, actionDone, days, status: actionDone ? "done" : days < 0 ? "overdue" : days === 0 ? "today" : days <= item.remindDays ? "soon" : "upcoming" };
  }
  const display = actionDone ? maintenanceCycle(item, reference, 1) : current;
  const days = daysFromToday(display.due, reference);
  return { item, ...display, actionPeriod: current.period, actionDone, days, status: actionDone ? "done" : days < 0 ? "overdue" : days === 0 ? "today" : days <= item.remindDays ? "soon" : "upcoming" };
}

function maintenanceSchedule(reference = new Date()) {
  return state.maintenance.map(item => maintenanceScheduleEntry(item, reference)).sort((a, b) => Number(a.actionDone) - Number(b.actionDone) || a.due - b.due);
}

function moneyTotals() {
  const totals = { ...state.finances.balances };
  state.finances.transactions.forEach(item => {
    const sign = item.type === "income" ? 1 : -1;
    totals[item.account] = (Number(totals[item.account]) || 0) + sign * Number(item.amount || 0);
  });
  const reference = new Date();
  const billSchedule = state.finances.bills.map(bill => billScheduleEntry(bill, reference)).sort((a, b) => a.due - b.due);
  const protectedBillCycles = state.finances.bills.flatMap(bill => outstandingBillCycles(bill, reference).map(cycle => ({ bill, ...cycle })));
  const monthlyBills = state.finances.bills.reduce((sum, item) => sum + monthlyBillEquivalent(item), 0);
  const overdueBills = protectedBillCycles.filter(item => item.days < 0).reduce((sum, item) => sum + Number(item.bill.amount || 0), 0);
  const dueSoon = protectedBillCycles.filter(item => item.days >= 0 && item.days <= 7).reduce((sum, item) => sum + Number(item.bill.amount || 0), 0);
  const dueThirty = protectedBillCycles.filter(item => item.days >= 0 && item.days <= 30).reduce((sum, item) => sum + Number(item.bill.amount || 0), 0);
  const obligations = state.finances.obligations.reduce((sum, item) => sum + Math.max(0, Number(item.target || 0) - Number(item.paid || 0)), 0);
  const obligationPlan = state.finances.obligations.reduce((sum, item) => sum + Number(item.monthlyPayment || 0), 0);
  const investments = state.finances.investments.reduce((sum, item) => sum + Number(item.current || 0), 0);
  const available = Number(totals.personal || 0) + Number(totals.business || 0);
  const reserveTarget = Math.max(0, Number(state.finances.settings?.reserveTarget) || 0);
  const protectedCash = dueThirty + overdueBills + obligationPlan + reserveTarget;
  const safeToSpend = Math.max(0, available - protectedCash);
  const subscriptions = state.finances.bills.filter(item => item.kind === "subscription");
  const subscriptionAnnual = subscriptions.reduce((sum, item) => sum + (item.frequency === "monthly" ? Number(item.amount) * 12 : item.frequency === "annual" ? Number(item.amount) : 0), 0);
  return { ...totals, available, safeToSpend, protectedCash, reserveTarget, monthlyBills, overdueBills, dueSoon, dueThirty, billSchedule, coverMonths: monthlyBills ? available / monthlyBills : null, obligations, obligationPlan, investments, subscriptions, subscriptionAnnual };
}

function buildDailyPlan(daily = todayState()) {
  const recovery = recoverySignal(daily);
  const mode = state.modes[daily.mode] || state.modes[recovery.mode];
  const routineMinutes = mode.routine.reduce((sum, step, index) => sum + (daily.routine[index] ? 0 : Number(step[2] || 0)), 0);
  const capacity = Math.max(15, Number(daily.availableMinutes) || 120);
  let remaining = capacity;
  const tasks = [];
  rankedTasks(daily).forEach(task => {
    if (tasks.length >= 3) return;
    if (Number(task.duration) <= remaining || !tasks.length) {
      tasks.push(task);
      remaining = Math.max(0, remaining - Number(task.duration));
    }
  });
  const bill = moneyTotals().billSchedule.find(entry => entry.hasOutstanding && entry.days <= 3);
  const maintenance = maintenanceSchedule().find(entry => !entry.actionDone && entry.days <= 3);
  return { recovery, mode, routineMinutes, capacity, tasks, bill, maintenance, plannedMinutes: capacity - remaining };
}

function weeklyCoach() {
  const metrics = weekMetrics();
  const recovery = recoverySignal();
  const routine = routineSignal();
  const recent = recentDailyRecords(7).map(([, day]) => day);
  const friction = [...recent].reverse().find(day => day.friction)?.friction || state.reflection.friction;
  const title = metrics.daysChecked < 2 ? "Build the signal" : metrics.energy && metrics.energy < 3 ? "Reduce load, preserve momentum" : metrics.routine >= 75 ? "The foundations are supporting execution" : "Simplify the system before adding effort";
  const insights = [];
  insights.push(metrics.tasksDone ? `${metrics.tasksDone} action${metrics.tasksDone === 1 ? "" : "s"} completed; protect the work that directly moved the weekly outcome.` : "No completed action is recorded yet; choose one finish line small enough to close.");
  insights.push(friction ? `Repeated friction to design around: ${friction}` : "Record friction in the evening check-in so the system can distinguish effort problems from design problems.");
  insights.push(routine.ready ? `${routine.step} is at ${routine.rate}% across ${routine.attempts} attempts. ${routine.message}` : routine.message);
  insights.push(metrics.connectionDays || metrics.restDays ? `Human connection was protected on ${metrics.connectionDays} day${metrics.connectionDays === 1 ? "" : "s"}; deliberate rest on ${metrics.restDays}. Keep both visible before adding more work.` : "No connection or protected rest is recorded yet. A sustainable week needs contact with people and time with no performance demand.");
  return { title, summary: recovery.note, insights };
}

function spentToday() {
  return state.finances.transactions.filter(item => item.date === dayKey() && item.type === "expense").reduce((sum, item) => sum + Number(item.amount || 0), 0);
}

function weekMetrics(startKey = state.week.startedAt, tasks = state.tasks, ratings = state.reflection.ratings) {
  const start = dateFromKey(startKey || weekStartKey());
  const end = addDays(start, 6);
  const days = Object.entries(state.daily).filter(([key]) => {
    const date = dateFromKey(key);
    return date >= start && date <= end;
  }).map(([, value]) => value);
  let routineDone = 0;
  let routinePossible = 0;
  days.forEach(day => {
    const mode = state.modes[day.mode] || state.modes.standard;
    routineDone += Array.isArray(day.routine) ? day.routine.filter(Boolean).length : 0;
    routinePossible += mode.routine.length;
  });
  return {
    score: average(ratings),
    energy: average(days.map(day => day.energy)),
    clarity: average(days.map(day => day.clarity)),
    routine: routinePossible ? Math.round((routineDone / routinePossible) * 100) : 0,
    tasksDone: tasks.filter(task => task.done).length,
    connectionDays: days.filter(day => day.connection?.completed).length,
    restDays: days.filter(day => day.connection?.restCompleted).length,
    daysChecked: days.filter(day => day.energy || day.clarity || day.routine?.some(Boolean) || day.connection?.completed || day.connection?.restCompleted).length
  };
}

function render() {
  renderToday();
  renderMoney();
  renderWeek();
  renderArchitecture();
  renderReview();
  document.querySelectorAll(".view").forEach(view => view.classList.toggle("active", view.id === `view-${activeView}`));
  document.querySelectorAll(".nav-item").forEach(item => item.classList.toggle("active", item.dataset.viewTarget === activeView));
  document.querySelectorAll("[data-auto-resize]").forEach(resizeOutcomeInput);
  refreshSettings();
}

function resizeOutcomeInput(input) {
  if (!input) return;
  input.style.height = "auto";
  const borders = input.offsetHeight - input.clientHeight;
  input.style.height = `${Math.max(72, input.scrollHeight + borders)}px`;
}

function renderToday() {
  const daily = todayState();
  const mode = state.modes[daily.mode] || state.modes.standard;
  const totals = moneyTotals();
  const plan = buildDailyPlan(daily);
  const routineDone = daily.routine.filter(Boolean).length;
  const openTasks = rankedTasks(daily);
  const primary = openTasks[0];
  const lifeDue = maintenanceSchedule().filter(item => !item.actionDone && item.days <= 7).length;
  document.getElementById("view-today").innerHTML = `
    <div class="page-head"><p class="eyebrow">${escapeHTML(formatDate())} · Command centre</p><h1 id="today-heading">${greeting()}</h1><p>Protect the foundations, move one meaningful outcome, and keep the rest of life visible.</p></div>
    <div class="engine-grid">${engineStat("Safe to spend", currency(totals.safeToSpend), "After protected money", "money")}${engineStat("Routine", `${routineDone}/${mode.routine.length}`, `${mode.label} mode`, "today")}${engineStat("Recovery", plan.recovery.key === "restore" ? "Protect" : plan.recovery.key === "expand" ? "Expand" : "Steady", plan.recovery.label, "today")}${engineStat("Execution", primary ? "1 next" : "Clear", primary?.name || "No open actions", "week")}${engineStat("Life admin", lifeDue ? `${lifeDue} due` : "Clear", "Next 7 days", "architecture")}</div>
    <div class="grid two-column">
      <div class="stack">
        ${dailyCommandCard(plan, daily)}
        <article class="card"><div class="card-head"><div><p class="eyebrow">Daily routine OS</p><h2>${escapeHTML(mode.label)} mode</h2><p>${escapeHTML(mode.note)}</p></div><span class="tag">${routineDone}/${mode.routine.length}</span></div><div class="routine-list">${mode.routine.map((item, index) => routineTemplate(item, index, daily.routine[index])).join("")}</div></article>
        <article class="card"><div class="card-head"><div><p class="eyebrow">Execution OS</p><h2>Best use of this energy</h2></div><button class="text-button" data-add="task">+ Add</button></div><div class="task-list">${openTasks.length ? openTasks.slice(0, 4).map(taskTemplate).join("") : '<div class="empty">No open actions. Choose the next meaningful outcome.</div>'}</div></article>
      </div>
      <aside class="stack">
        <article class="card card-muted"><div class="card-head"><div><p class="eyebrow">State check-in</p><h2>What capacity is here?</h2></div></div><span class="micro-label">Energy</span><div class="energy-picker">${[1,2,3,4,5].map(value => `<button class="energy-button ${daily.energy === value ? "selected" : ""}" data-energy="${value}"><span>${["○","◔","◑","◕","●"][value-1]}</span><small>${value}</small></button>`).join("")}</div><span class="micro-label clarity-label">Mental clarity</span><div class="energy-picker compact-picker">${[1,2,3,4,5].map(value => `<button class="energy-button ${daily.clarity === value ? "selected" : ""}" data-clarity="${value}"><small>${value}</small></button>`).join("")}</div><span class="micro-label time-label">Focused time available</span><div class="time-picker">${[[45,"45m"],[90,"1.5h"],[180,"3h"],[300,"5h"]].map(([value,label]) => `<button class="time-button ${Number(daily.availableMinutes) === value ? "selected" : ""}" data-available-minutes="${value}">${label}</button>`).join("")}</div><div class="mode-row">${Object.entries(state.modes).map(([key, value]) => `<button class="mode-button ${daily.mode === key ? "selected" : ""}" data-mode="${key}">${escapeHTML(value.label)}</button>`).join("")}</div><p class="suggestion"><strong>${escapeHTML(plan.recovery.label)}.</strong> ${escapeHTML(plan.recovery.note)}</p></article>
        ${connectionRestCard(daily)}
        <article class="card weekly-anchor-card"><p class="eyebrow">Primary weekly outcome</p><h2>${escapeHTML(state.week.outcome || "Define the result that would make this week count.")}</h2><p>${escapeHTML(state.week.evidence || "Name the evidence that will prove it is complete.")}</p></article>
        ${tomorrowSetupCard(daily, openTasks)}
        <article class="card"><div class="card-head"><div><p class="eyebrow">Evening feedback loop</p><h2>Close the day cleanly</h2></div></div>${dailyField("win", "What moved today?", "Name the meaningful progress.")}${dailyField("friction", "What caused friction?", "Situation, cue, or missing preparation.")}${dailyField("tomorrow", "Tomorrow's main outcome", "One finish condition for tomorrow.")}<p class="money-note">Recorded spending today: <strong>${currency(spentToday())}</strong></p></article>
      </aside>
    </div>`;
}

function dailyCommandCard(plan, daily = todayState()) {
  const rows = [`<div class="command-row foundation"><i>01</i><span><strong>Foundations</strong><small>${plan.routineMinutes ? `${plan.routineMinutes} minutes remain in ${plan.mode.label} mode` : "Routine foundations complete"}</small></span></div>`];
  const connection = connectionSignal(daily);
  if (!connection.completed) rows.push(`<div class="command-row connection"><i>♥</i><span><strong>One human connection</strong><small>${escapeHTML(connection.recommendation)} · keep people inside the plan</small></span><button class="mini-arrow" data-scroll-target="connection-card" aria-label="Open human connection">›</button></div>`);
  if (!connection.restCompleted) rows.push(`<div class="command-row rest"><i>R</i><span><strong>Protected rest</strong><small>${Number(daily.connection.restMinutes) || 30} minutes with no performance demand</small></span><button class="mini-check" data-rest-complete aria-label="Mark protected rest complete">✓</button></div>`);
  plan.tasks.forEach((task, index) => rows.push(`<div class="command-row"><i>${String(index + 2).padStart(2, "0")}</i><span><strong>${escapeHTML(task.name)}</strong><small>${escapeHTML(taskReason(task))} · ${task.duration} min</small></span><button class="mini-check" data-task-toggle="${task.id}" aria-label="Complete ${escapeHTML(task.name)}">✓</button></div>`));
  if (plan.maintenance) rows.push(`<div class="command-row alert"><i>!</i><span><strong>${escapeHTML(plan.maintenance.item.name)}</strong><small>Life maintenance · ${escapeHTML(maintenanceDueLabel(plan.maintenance))}</small></span><button class="mini-arrow" data-view-target="architecture">›</button></div>`);
  if (plan.bill) rows.push(`<div class="command-row alert"><i>£</i><span><strong>${escapeHTML(plan.bill.bill.name)}</strong><small>${currency(plan.bill.bill.amount)} · ${escapeHTML(billDueLabel(plan.bill))}</small></span><button class="mini-arrow" data-view-target="money">›</button></div>`);
  return `<article class="card card-green command-card"><div class="command-head"><div><p class="eyebrow">Adaptive daily plan</p><h2>${escapeHTML(plan.recovery.label)}</h2><p>${escapeHTML(plan.recovery.note)}</p></div><span>${plan.capacity} min</span></div><div class="command-list">${rows.join("")}</div><div class="command-anchor"><span>Anchored to</span><strong>${escapeHTML(state.week.outcome || "your weekly outcome")}</strong></div></article>`;
}

function connectionRestCard(daily = todayState()) {
  const connection = daily.connection;
  const signal = connectionSignal(daily);
  const types = [["call", "Call", "☎"], ["text", "Text", "↗"], ["plan", "Link up", "+"], ["inperson", "In person", "♥"]];
  const recentPeople = [...new Set(recentDailyRecords(30).map(([, item]) => item.connection?.person?.trim()).filter(Boolean))].slice(-8).reverse();
  const humanDone = Boolean(connection.completed);
  const restDone = Boolean(connection.restCompleted);
  return `<article class="card connection-card ${humanDone && restDone ? "complete" : ""}" id="connection-card"><div class="card-head"><div><p class="eyebrow">Connection + recovery</p><h2>${humanDone && restDone ? "Human day protected." : "People and rest are foundations."}</h2><p>One genuine interaction and one period with no performance demand.</p></div><span class="connection-score">${signal.connectedDays}/7</span></div><section class="connection-section"><div class="section-mini-head"><span>Human interaction</span><small>${humanDone ? "Completed" : `Suggested: ${signal.recommendation}`}</small></div><div class="connection-picker">${types.map(([type, label, icon]) => `<button class="connection-type ${connection.type === type ? "selected" : ""}" data-connection-type="${type}" aria-pressed="${connection.type === type}"><i>${icon}</i><span>${label}</span></button>`).join("")}</div><div class="connection-fields"><div class="field"><label for="connection-person">Who?</label><input id="connection-person" data-connection-field="person" list="recent-people" value="${escapeHTML(connection.person)}" placeholder="Name or relationship" /></div><div class="field"><label for="connection-plan">What will you do?</label><textarea id="connection-plan" data-connection-field="plan" placeholder="Call after dinner, send a proper message, suggest Saturday…">${escapeHTML(connection.plan)}</textarea></div></div>${recentPeople.length ? `<datalist id="recent-people">${recentPeople.map(person => `<option value="${escapeHTML(person)}"></option>`).join("")}</datalist>` : ""}<button class="connection-complete ${humanDone ? "done" : ""}" data-connection-complete ${connection.type ? "" : "disabled"}>${humanDone ? "Connection completed ✓" : "Mark interaction complete"}</button></section><section class="rest-section"><div class="section-mini-head"><span>Protected rest</span><small>${restDone ? "Completed" : `${signal.restDays}/7 days protected`}</small></div><div class="rest-picker">${[15,30,60,90].map(minutes => `<button class="rest-time ${Number(connection.restMinutes) === minutes ? "selected" : ""}" data-rest-minutes="${minutes}">${minutes}m</button>`).join("")}</div><p>No work, optimisation, admin, or guilt. Walk, listen to music, sit outside, play, or simply stop.</p><button class="connection-complete rest-complete ${restDone ? "done" : ""}" data-rest-complete>${restDone ? "Rest protected ✓" : "Mark rest complete"}</button></section></article>`;
}

function tomorrowSetupCard(daily, openTasks = rankedTasks(daily)) {
  if (!openTasks.length) return `<article class="card prep-card"><div class="card-head"><div><p class="eyebrow">Tomorrow setup</p><h2>Nothing needs preparing.</h2><p>Add the next meaningful action when it becomes clear.</p></div><button class="button button-secondary button-small" data-add="task">+ Action</button></div></article>`;
  const task = openTasks.find(item => item.id === daily.tomorrowTaskId) || openTasks[0];
  const ready = daily.tomorrowReady && daily.tomorrowTaskId === task.id;
  const steps = [
    ["01", "Prepare", task.preparation || "Gather the materials, information, clothes, or equipment this action needs."],
    ["02", "Place", task.placement || "Put everything at the exact location where the action will begin."],
    ["03", "Launch", task.launchCue || "Choose one specific event that will trigger the first movement."],
    ["04", "Fallback", task.fallback || "Define a version small enough to do even when the plan changes."]
  ];
  return `<article class="card prep-card ${ready ? "ready" : ""}"><div class="card-head"><div><p class="eyebrow">Tomorrow setup</p><h2>${ready ? "Environment ready." : "Make starting automatic."}</h2><p>${ready ? "The decision and preparation are already handled." : "Prepare the action before motivation is needed."}</p></div><span class="prep-status">${ready ? "Ready" : "Tonight"}</span></div><div class="field prep-task-field"><label for="tomorrow-task">Task to prepare</label><select id="tomorrow-task" data-tomorrow-task>${openTasks.map(item => `<option value="${item.id}" ${item.id === task.id ? "selected" : ""}>${escapeHTML(item.name)}</option>`).join("")}</select></div><div class="prep-sequence">${steps.map(([number, label, value]) => `<div class="prep-step"><i>${number}</i><span><small>${label}</small><strong>${escapeHTML(value)}</strong></span></div>`).join("")}</div><div class="prep-actions"><button class="button button-secondary button-small" data-edit-task="${task.id}">Edit setup</button><button class="button ${ready ? "button-secondary" : "button-primary"} button-small" data-tomorrow-ready="${task.id}">${ready ? "Mark not ready" : "Everything is ready"}</button></div></article>`;
}

function engineStat(name, value, note, view) {
  return `<button class="engine-stat" data-view-target="${view}"><span>${name}</span><strong>${escapeHTML(value)}</strong><small>${escapeHTML(note)}</small></button>`;
}

function routineTemplate(item, index, done) {
  return `<div class="routine-item"><button class="check-button ${done ? "done" : ""}" data-routine-index="${index}" aria-label="Toggle ${escapeHTML(item[0])}"></button><div class="routine-copy"><strong>${escapeHTML(item[0])}</strong><small>${escapeHTML(item[1])}</small></div><span class="duration">${Number(item[2])} min</span></div>`;
}

function dailyField(key, label, placeholder) {
  return `<div class="field"><label for="daily-${key}">${label}</label><textarea id="daily-${key}" data-daily-field="${key}" placeholder="${placeholder}">${escapeHTML(todayState()[key])}</textarea></div>`;
}

function taskTemplate(task) {
  const due = taskDueDays(task);
  const dueTag = task.done || due === null ? "" : `<span class="tag ${due < 0 ? "tag-danger" : due <= 3 ? "tag-warm" : ""}">${due < 0 ? `${Math.abs(due)}d overdue` : due === 0 ? "Due today" : `Due ${formatCompactDate(task.dueDate)}`}</span>`;
  return `<div class="task-card ${task.done ? "done" : ""}"><button class="check-button ${task.done ? "done" : ""}" data-task-toggle="${task.id}" aria-label="Toggle task"></button><div class="task-copy"><p class="task-name">${escapeHTML(task.name)}</p><small class="smart-reason">${escapeHTML(taskReason(task))}</small><div class="task-meta"><span class="tag tag-impact">${escapeHTML(task.alignment)}</span><span class="tag">Impact ${task.impact}</span><span class="tag">${escapeHTML(energyLabel(task.energy))}</span><span class="tag">${task.duration} min</span>${dueTag}</div></div><button class="edit-button" data-edit-task="${task.id}" aria-label="Edit task">•••</button></div>`;
}

function renderMoney() {
  const totals = moneyTotals();
  const transactions = [...state.finances.transactions].sort((a, b) => b.date.localeCompare(a.date));
  document.getElementById("view-money").innerHTML = `
    <div class="page-head"><p class="eyebrow">Financial OS</p><h1 id="money-heading">Know your position.</h1><p>Every pound has a purpose. Expected investment money does not count until it actually arrives.</p></div>
    <div class="money-summary">${moneyStat("Safe to spend", currency(totals.safeToSpend), "After bills, reserve + plans")}${moneyStat("Available cash", currency(totals.available), "Personal + business")}${moneyStat("Protected", currency(totals.protectedCash), "Next 30 days + reserve")}${moneyStat("Overdue", currency(totals.overdueBills), totals.overdueBills ? "Needs a decision" : "All clear")}</div>
    <div class="grid two-column">
      <div class="stack">
        <article class="card bills-card"><div class="card-head"><div><p class="eyebrow">Bill calendar</p><h2>Due dates, without surprises</h2><p>Recurring bills, one-offs, autopay, and what is actually paid.</p></div><button class="button button-secondary button-small" data-add="bill">+ Bill</button></div>${billInsight(totals)}<div class="bills-list">${totals.billSchedule.length ? totals.billSchedule.map(billTemplate).join("") : '<div class="empty">No bills yet. Add the first due date you want the system to watch.</div>'}</div></article>
        ${subscriptionAuditCard(totals)}
        <article class="card"><div class="card-head"><div><p class="eyebrow">Cash ledger</p><h2>Transactions</h2><p>Record reality, not forecasts.</p></div><button class="button button-secondary button-small" data-add="transaction">+ Transaction</button></div><div class="ledger-list">${transactions.length ? transactions.slice(0, 20).map(transactionTemplate).join("") : '<div class="empty">No transactions recorded yet.</div>'}</div></article>
        <article class="card"><div class="card-head"><div><p class="eyebrow">Starting position</p><h2>Opening balances</h2></div></div><div class="balance-grid">${balanceField("personal", "Personal cash")}${balanceField("business", "Business cash")}${balanceField("held", "Money held for others")}</div><p class="privacy-note">Use opening balances once, then keep the ledger current.</p></article>
      </div>
      <aside class="stack">${spendingGuardrailCard(totals)}${cashCoverCard(totals)}${moneyCollectionCard("obligation", "Liabilities + obligations", "What must be restored or repaid", state.finances.obligations, item => `${escapeHTML(item.name)} · ${currency(Math.max(0, item.target - item.paid))} left${item.monthlyPayment ? ` · ${currency(item.monthlyPayment)}/mo` : ""}`)}${moneyCollectionCard("investment", "Investments", "Visible, but unavailable until realised", state.finances.investments, item => `${escapeHTML(item.name)} · ${currency(item.current)} current value`)}</aside>
    </div>`;
}

function billInsight(totals) {
  if (totals.overdueBills) return `<div class="bill-insight urgent"><span>Needs attention</span><strong>${currency(totals.overdueBills)} is overdue</strong><small>Mark paid bills complete or update their dates so the plan stays honest.</small></div>`;
  if (totals.dueSoon > totals.available) return `<div class="bill-insight urgent"><span>Cash gap</span><strong>${currency(totals.dueSoon - totals.available)} short for the next 7 days</strong><small>Move money, delay a flexible bill, or protect essential payments first.</small></div>`;
  if (totals.dueSoon) return `<div class="bill-insight"><span>Next 7 days</span><strong>${currency(totals.dueSoon)} due and ${currency(totals.available)} available</strong><small>Your immediate bills are covered by the cash currently recorded.</small></div>`;
  return `<div class="bill-insight calm"><span>Clear runway</span><strong>No unpaid bills in the next 7 days</strong><small>The calendar will surface the next due date automatically.</small></div>`;
}

function cashCoverCard(totals) {
  const autopay = state.finances.bills.filter(item => item.autopay).length;
  const cover = totals.coverMonths === null ? "No monthly bills" : totals.coverMonths < 0 ? "Cash is below zero" : `${totals.coverMonths.toFixed(1)} months`;
  return `<article class="card cash-cover-card"><div class="card-head"><div><p class="eyebrow">Cash cover</p><h2>${escapeHTML(cover)}</h2><p>How long available cash covers your recurring bill baseline.</p></div></div><div class="cover-metrics"><div><span>Next 30 days</span><strong>${currency(totals.dueThirty)}</strong></div><div><span>Autopay bills</span><strong>${autopay}</strong></div><div><span>Held separately</span><strong>${currency(totals.held)}</strong></div></div></article>`;
}

function spendingGuardrailCard(totals) {
  const gap = Math.max(0, totals.protectedCash - totals.available);
  return `<article class="card guardrail-card ${gap ? "urgent" : ""}"><div class="card-head"><div><p class="eyebrow">Safe-to-spend engine</p><h2>${gap ? `${currency(gap)} protection gap` : `${currency(totals.safeToSpend)} flexible`}</h2><p>${gap ? "Current cash does not fully cover the protected plan." : "This is the money left after the next 30 days, your reserve floor, and planned obligation payments."}</p></div><button class="edit-button" data-add="moneySettings" aria-label="Edit spending guardrails">•••</button></div><div class="guardrail-formula"><span>Cash <b>${currency(totals.available)}</b></span><i>−</i><span>Bills <b>${currency(totals.dueThirty + totals.overdueBills)}</b></span><i>−</i><span>Reserve <b>${currency(totals.reserveTarget)}</b></span><i>−</i><span>Plans <b>${currency(totals.obligationPlan)}</b></span></div></article>`;
}

function subscriptionAuditCard(totals) {
  const entries = totals.subscriptions.map(bill => billScheduleEntry(bill));
  return `<article class="card subscription-card"><div class="card-head"><div><p class="eyebrow">Subscription audit</p><h2>${currency(totals.subscriptionAnnual)} per year</h2><p>Renewals, price movement, and services that need a conscious keep-or-cancel decision.</p></div><button class="button button-secondary button-small" data-add="bill">+ Add</button></div><div class="subscription-summary"><span>${entries.length} active</span><span>${currency(totals.subscriptionAnnual / 12)}/mo equivalent</span></div><div class="subscription-list">${entries.length ? entries.sort((a, b) => a.due - b.due).map(subscriptionTemplate).join("") : '<div class="empty">Mark a bill as “Subscription” to audit it here.</div>'}</div></article>`;
}

function subscriptionTemplate(entry) {
  const bill = entry.bill;
  const reviewAge = bill.lastReviewed ? daysFromToday(new Date(bill.lastReviewed)) * -1 : 999;
  const priceUp = Number(bill.previousAmount) > 0 && Number(bill.amount) > Number(bill.previousAmount);
  const flag = priceUp ? `Price rose from ${currency(bill.previousAmount)}` : entry.hasOutstanding && entry.days <= 30 ? billDueLabel(entry) : reviewAge > 90 ? "Not reviewed in 90+ days" : "Reviewed and visible";
  return `<div class="subscription-row ${priceUp || reviewAge > 90 ? "flagged" : ""}"><div><strong>${escapeHTML(bill.name)}</strong><small>${escapeHTML(flag)}</small></div><span>${currency(bill.amount)}</span><button class="tiny-button" data-review-subscription="${bill.id}">Reviewed</button><button class="edit-button" data-edit-bill="${bill.id}" aria-label="Edit subscription">•••</button></div>`;
}

function billDueLabel(entry) {
  if (entry.actionPaid) return entry.bill.frequency === "oneoff" ? "Paid" : `Paid · next ${formatCompactDate(entry.due)}`;
  if (entry.days < 0) return `${Math.abs(entry.days)} day${Math.abs(entry.days) === 1 ? "" : "s"} overdue`;
  if (entry.days === 0) return "Due today";
  if (entry.days === 1) return "Due tomorrow";
  if (entry.days <= 7) return `Due in ${entry.days} days`;
  return `Due ${formatCompactDate(entry.due)}`;
}

function billTemplate(entry) {
  const bill = entry.bill;
  const frequency = ({ monthly: "Monthly", annual: "Annual", oneoff: "One-off" })[bill.frequency];
  return `<div class="bill-row ${entry.status}"><button class="bill-paid-button ${entry.actionPaid ? "done" : ""}" data-bill-paid="${bill.id}" data-bill-period="${entry.actionPeriod || entry.period}" aria-label="${entry.actionPaid ? "Mark unpaid" : "Mark paid"}"></button><div class="bill-copy"><strong>${escapeHTML(bill.name)}</strong><small class="bill-due">${escapeHTML(billDueLabel(entry))}</small><div class="bill-meta"><span>${frequency}</span><span>${escapeHTML(bill.kind)}</span><span>${escapeHTML(bill.account)}</span>${bill.autopay ? "<span>Autopay</span>" : ""}</div></div><div class="bill-value"><strong>${currency(bill.amount)}</strong><small>${formatCompactDate(entry.due)}</small></div><button class="edit-button" data-edit-bill="${bill.id}" aria-label="Edit bill">•••</button></div>`;
}

function moneyStat(label, value, note) {
  return `<article class="money-stat"><span>${label}</span><strong>${value}</strong><small>${note}</small></article>`;
}

function balanceField(key, label) {
  return `<div class="field"><label for="balance-${key}">${label}</label><input id="balance-${key}" data-balance="${key}" type="number" step="0.01" value="${Number(state.finances.balances[key]) || 0}" /></div>`;
}

function transactionTemplate(item) {
  const sign = item.type === "income" ? "+" : "−";
  return `<div class="ledger-row"><div><strong>${escapeHTML(item.note || item.category)}</strong><small>${escapeHTML(item.date)} · ${escapeHTML(item.account)} · ${escapeHTML(item.category)}</small></div><div class="ledger-amount ${item.type}">${sign}${currency(item.amount)}<button class="edit-button" data-edit-transaction="${item.id}" aria-label="Edit transaction">•••</button></div></div>`;
}

function moneyCollectionCard(type, title, note, items, formatter) {
  return `<article class="card"><div class="card-head"><div><p class="eyebrow">${title}</p><h2>${note}</h2></div><button class="button button-secondary button-small" data-add="${type}">+ Add</button></div><div class="simple-list">${items.length ? items.map(item => `<button data-edit-${type}="${item.id}"><span>${formatter(item)}</span><span>•••</span></button>`).join("") : '<div class="empty">Nothing recorded.</div>'}</div></article>`;
}

function renderWeek() {
  const open = rankedTasks();
  const done = state.tasks.filter(task => task.done);
  document.getElementById("view-week").innerHTML = `
    <div class="page-head"><p class="eyebrow">Direction + Execution OS</p><h1 id="week-heading">Define the win.</h1><p>Choose no more than two meaningful outcomes. Everything else is maintenance, exploration, or deliberately deferred.</p></div>
    <article class="week-outcome"><div class="field"><label for="week-outcome">Primary weekly outcome</label><textarea class="outcome-input" id="week-outcome" data-week-field="outcome" data-auto-resize rows="2" placeholder="One measurable result">${escapeHTML(state.week.outcome)}</textarea></div><div class="field"><label for="week-evidence">Evidence of completion</label><textarea id="week-evidence" data-week-field="evidence" placeholder="What proves this is finished?">${escapeHTML(state.week.evidence)}</textarea></div><div class="inline-fields week-details"><div class="field"><label for="week-secondary">Secondary outcome</label><textarea class="week-compact-input" id="week-secondary" data-week-field="secondary" data-auto-resize rows="2">${escapeHTML(state.week.secondary)}</textarea></div><div class="field"><label for="week-why">Why now?</label><textarea class="week-compact-input" id="week-why" data-week-field="why" data-auto-resize rows="2">${escapeHTML(state.week.why)}</textarea></div></div></article>
    <div class="grid two-column focus-grid">
      <div class="stack">
        <article class="card"><div class="card-head"><div><p class="eyebrow">Flow-matched actions</p><h2>Open work, ranked for your state</h2></div><button class="button button-secondary button-small" data-add="task">+ Action</button></div><div class="task-list">${open.length ? open.map(taskTemplate).join("") : '<div class="empty">No open actions. Add the first visible step.</div>'}</div></article>
        <article class="card"><div class="card-head"><div><p class="eyebrow">Completed</p><h2>${done.length} actions moved</h2></div></div><div class="task-list">${done.length ? done.map(taskTemplate).join("") : '<div class="empty">Completed actions collect here until the weekly close.</div>'}</div></article>
      </div>
      <aside class="stack">${inboxCard()}<article class="card card-muted"><div class="card-head"><div><p class="eyebrow">Decision hierarchy</p><h2>Protect what matters</h2></div></div><div class="priority-rule"><strong>1</strong><span><b>Main outcome</b>One meaningful deliverable.</span></div><div class="priority-rule"><strong>2</strong><span><b>Supporting work</b>Up to two useful actions.</span></div><div class="priority-rule"><strong>3</strong><span><b>Maintenance</b>Only essential responsibilities.</span></div></article></aside>
    </div>`;
}

function inboxCard() {
  return `<article class="card inbox-card"><div class="card-head"><div><p class="eyebrow">Quick capture</p><h2>Inbox</h2><p>Hold ideas without changing direction.</p></div><button class="button button-secondary button-small" data-add="inbox">+ Capture</button></div><div class="inbox-list">${state.inbox.length ? state.inbox.map(inboxTemplate).join("") : '<div class="empty">Clear. Nothing is competing for attention.</div>'}</div></article>`;
}

function inboxTemplate(item) {
  return `<div class="inbox-item"><button class="inbox-copy" data-edit-inbox="${item.id}"><span class="tag">${escapeHTML(item.type || "idea")}</span><strong>${escapeHTML(item.text)}</strong><small>${formatCompactDate(new Date(item.createdAt || Date.now()))}</small></button><button class="inbox-promote" data-inbox-task="${item.id}" aria-label="Turn into action">→</button></div>`;
}

function renderArchitecture() {
  document.getElementById("view-architecture").innerHTML = `
    <div class="page-head"><p class="eyebrow">Routine + Life Maintenance OS</p><h1 id="architecture-heading">Make starting obvious.</h1><p>Keep important life dates visible, strengthen cues, and pre-decide what happens when your state changes.</p></div>
    <div class="grid two-column"><div class="stack">${maintenanceCard()}<article class="card"><div class="card-head"><div><p class="eyebrow">Editable daily architecture</p><h2>Your three operating modes</h2><p>Shape the system around real capacity.</p></div></div><div class="mode-editor-list">${Object.entries(state.modes).map(([key, mode]) => modeCard(key, mode)).join("")}</div></article><article class="card"><div class="card-head"><div><p class="eyebrow">Cue-driven architecture</p><h2>Trigger → action → environment</h2></div><button class="button button-secondary button-small" data-add="cue">+ Cue</button></div><div class="architecture-flow">${state.cues.map((cue, index) => cueTemplate(cue, index)).join("")}</div></article></div><aside class="stack">${routineIntelligenceCard()}<article class="card"><div class="card-head"><div><p class="eyebrow">Prepared responses</p><h2>If–then scripts</h2></div><button class="button button-secondary button-small" data-add="script">+ Script</button></div><div class="script-list">${state.scripts.map(script => `<div class="script-card" data-edit-script="${script.id}" role="button" tabindex="0"><p><strong>If</strong> ${escapeHTML(script.trigger)}, <strong>then</strong> ${escapeHTML(script.response)}</p></div>`).join("")}</div></article><article class="card card-muted"><p class="quote">A missed action is system data.</p><p class="quote-note">Ask which cue was missing, which competing cue was present, and which single environmental change would help next time.</p></article></aside></div>`;
}

function maintenanceCard() {
  const schedule = maintenanceSchedule();
  return `<article class="card maintenance-card"><div class="card-head"><div><p class="eyebrow">Life maintenance calendar</p><h2>Important things stay visible</h2><p>Appointments, birthdays, renewals, car, documents, health, and home.</p></div><button class="button button-secondary button-small" data-add="maintenance">+ Date</button></div><div class="maintenance-list">${schedule.length ? schedule.map(maintenanceTemplate).join("") : '<div class="empty">Nothing scheduled yet. Add the first responsibility you do not want to hold in your head.</div>'}</div></article>`;
}

function maintenanceDueLabel(entry) {
  if (entry.actionDone) return entry.item.recurrence === "oneoff" ? "Completed" : `Done · next ${formatCompactDate(entry.due)}`;
  if (entry.days < 0) return `${Math.abs(entry.days)} day${Math.abs(entry.days) === 1 ? "" : "s"} overdue`;
  if (entry.days === 0) return "Due today";
  if (entry.days === 1) return "Due tomorrow";
  if (entry.days <= 7) return `Due in ${entry.days} days`;
  return `Due ${formatCompactDate(entry.due)}`;
}

function maintenanceTemplate(entry) {
  const item = entry.item;
  return `<div class="maintenance-row ${entry.status}"><button class="maintenance-check ${entry.actionDone ? "done" : ""}" data-maintenance-done="${item.id}" data-maintenance-period="${entry.actionPeriod}" aria-label="${entry.actionDone ? "Reopen" : "Complete"} ${escapeHTML(item.name)}"></button><div><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(maintenanceDueLabel(entry))}</small><span>${escapeHTML(item.category)} · ${escapeHTML(item.recurrence)}</span></div><time>${formatCompactDate(entry.due)}</time><button class="edit-button" data-edit-maintenance="${item.id}" aria-label="Edit ${escapeHTML(item.name)}">•••</button></div>`;
}

function routineIntelligenceCard() {
  const signal = routineSignal();
  if (!signal.ready) return `<article class="card intelligence-card"><p class="eyebrow">Routine intelligence</p><h2>Building the signal</h2><p>${escapeHTML(signal.message)}</p></article>`;
  return `<article class="card intelligence-card ${signal.rate < 60 ? "urgent" : ""}"><div class="signal-ring" style="--signal:${signal.rate * 3.6}deg"><strong>${signal.rate}%</strong><span>${signal.attempts} tries</span></div><div><p class="eyebrow">Routine intelligence</p><h2>${escapeHTML(signal.step)}</h2><p>${escapeHTML(signal.modeLabel)} mode · ${signal.completed}/${signal.attempts} completed</p><small>${escapeHTML(signal.message)}</small><button class="text-button" data-edit-routine="${signal.modeKey}">Adjust this mode →</button></div></article>`;
}

function modeCard(key, mode) {
  const total = mode.routine.reduce((sum, step) => sum + Number(step[2] || 0), 0);
  return `<button class="mode-editor-card" data-edit-routine="${key}"><span><small>${escapeHTML(mode.label)} mode</small><strong>${mode.routine.length} steps · ${total} min</strong><em>${escapeHTML(mode.note)}</em></span><b>›</b></button>`;
}

function cueTemplate(cue, index) {
  return `<div class="cue-card"><span class="cue-number">${index + 1}</span><div class="cue-content"><h3>${escapeHTML(cue.name)}</h3><div class="cue-line"><strong>When</strong><span>${escapeHTML(cue.cue)}</span></div><div class="cue-line"><strong>Then</strong><span>${escapeHTML(cue.response)}</span></div><div class="cue-line positive"><strong>Install</strong><span>${escapeHTML(cue.setup)}</span></div><div class="cue-line negative"><strong>Remove</strong><span>${escapeHTML(cue.remove)}</span></div></div><div class="cue-actions"><button class="edit-button" data-edit-cue="${cue.id}">•••</button></div></div>`;
}

function renderReview() {
  const averageRating = average(state.reflection.ratings).toFixed(1);
  const metrics = weekMetrics();
  const coach = weeklyCoach();
  document.getElementById("view-review").innerHTML = `
    <div class="page-head"><p class="eyebrow">Life OS + feedback loop</p><h1 id="review-heading">Learn, then adjust.</h1><p>Review the quality of the system—not your worth. Look for patterns across weeks and months.</p></div>
    <div class="review-metrics">${reviewMetric("Life score", `${averageRating}/5`, "Current reflection")}${reviewMetric("Energy", metrics.energy ? `${metrics.energy.toFixed(1)}/5` : "—", `${metrics.daysChecked} days checked`)}${reviewMetric("Routine", `${metrics.routine}%`, "Foundations kept")}${reviewMetric("Execution", String(metrics.tasksDone), "Actions completed")}</div>
    ${weeklyCoachCard(coach)}
    <div class="grid two-column"><div class="stack"><article class="card"><div class="card-head"><div><p class="eyebrow">Weekly life assessment</p><h2>Five connected engines</h2></div><strong class="average-score">${averageRating}<small>/5</small></strong></div><div class="rating-list">${DIMENSIONS.map((item, index) => ratingTemplate(item, index)).join("")}</div></article><article class="card"><div class="card-head"><div><p class="eyebrow">Weekly reflection</p><h2>Close the loop</h2></div></div><div class="reflection-prompts">${reflectionField("win", "What moved forward?", "Name the real win.")}${reflectionField("friction", "Where did friction appear?", "Notice the system, not a character flaw.")}${reflectionField("lesson", "What cue or design will change?", "One environmental or behavioural adjustment.")}${reflectionField("next", "What may matter next week?", "Capture it without overcommitting.")}</div></article><article class="card week-close-card"><div><p class="eyebrow">Weekly rollover</p><h2>Archive the learning. Keep the momentum.</h2><p>Completed work moves into history. Open actions carry forward and the next week starts clean.</p></div><button class="button button-primary" data-close-week>Close this week</button></article></div><aside class="stack"><article class="card card-muted"><div class="card-head"><div><p class="eyebrow">Life stays visible</p><h2>Protect what work is for</h2></div></div>${lifeField("relationships", "Relationships", "Who needs intentional time?")}${lifeField("enjoyment", "Enjoyment", "Padel, music, socialising, creativity, freedom.")}${lifeField("health", "Health", "Sleep, food, movement, recovery.")}${lifeField("growth", "Growth", "What knowledge will you apply?")}</article><article class="card"><div class="card-head"><div><p class="eyebrow">Monthly strategic review</p><h2>${new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(new Date())}</h2></div></div>${monthlyField("financial", "Financial position", "What changed in cash, commitments, investments, or liabilities?")}${monthlyField("growth", "Personal development", "What changed in capability or character?")}${monthlyField("business", "Business progress", "What value, systems, or revenue moved?")}${monthlyField("lifestyle", "Lifestyle quality", "Is life actually becoming calmer, freer, and fuller?")}${monthlyField("adjustment", "One strategic adjustment", "What single change matters next month?")}</article><article class="card card-muted"><div class="card-head"><div><p class="eyebrow">Recovery decision</p><h2>What does next week need?</h2></div></div><div class="recovery-grid">${[["restore","Restore","Lower load"],["maintain","Maintain","Stay steady"],["expand","Expand","Add stretch"]].map(([key,label,note]) => `<button class="recovery-option ${state.reflection.recovery === key ? "selected" : ""}" data-recovery="${key}"><strong>${label}</strong><small>${note}</small></button>`).join("")}</div></article></aside></div>
    <article class="card history-card"><div class="card-head"><div><p class="eyebrow">System memory</p><h2>Previous weeks</h2><p>Patterns become visible when the system remembers.</p></div><span class="tag">${state.history.length} archived</span></div>${historyView()}</article>`;
}

function weeklyCoachCard(coach) {
  return `<article class="card coach-card"><div class="coach-lead"><p class="eyebrow">Weekly coach</p><h2>${escapeHTML(coach.title)}</h2><p>${escapeHTML(coach.summary)}</p></div><div class="coach-insights">${coach.insights.map((insight, index) => `<div><i>${String(index + 1).padStart(2, "0")}</i><p>${escapeHTML(insight)}</p></div>`).join("")}</div></article>`;
}

function reviewMetric(label, value, note) {
  return `<div class="review-metric"><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`;
}

function historyView() {
  if (!state.history.length) return '<div class="history-empty"><strong>Your first trend starts when you close this week.</strong><span>Nothing is lost before then; current data remains live.</span></div>';
  const recent = state.history.slice(0, 8);
  return `<div class="history-trends">${recent.slice().reverse().map(item => `<div class="trend-column"><div class="trend-bar"><i style="height:${Math.max(8, Math.min(100, Number(item.metrics?.score || 0) * 20))}%"></i></div><span>${formatCompactDate(item.end)}</span></div>`).join("")}</div><div class="history-list">${recent.map(historyTemplate).join("")}</div>`;
}

function historyTemplate(item) {
  return `<details class="history-item"><summary><span><small>${formatCompactDate(item.start)}–${formatCompactDate(item.end)}</small><strong>${escapeHTML(item.week?.outcome || "Week without a named outcome")}</strong></span><b>${Number(item.metrics?.score || 0).toFixed(1)}/5</b></summary><div class="history-detail"><div><span>Energy</span><strong>${item.metrics?.energy ? Number(item.metrics.energy).toFixed(1) : "—"}</strong></div><div><span>Routine</span><strong>${Number(item.metrics?.routine || 0)}%</strong></div><div><span>Completed</span><strong>${Number(item.metrics?.tasksDone || 0)}</strong></div><p><b>Win</b>${escapeHTML(item.reflection?.win || "No win recorded.")}</p><p><b>Lesson</b>${escapeHTML(item.reflection?.lesson || "No lesson recorded.")}</p></div></details>`;
}

function ratingTemplate(item, index) {
  return `<div class="rating-row"><div><strong>${item[0]}</strong><small>${item[1]}</small></div><div class="rating-control"><span>${state.reflection.ratings[index]}/5</span><input type="range" min="1" max="5" step="1" value="${state.reflection.ratings[index]}" data-rating="${index}" aria-label="${escapeHTML(item[0])}" /></div></div>`;
}

function reflectionField(key, label, placeholder) {
  return `<div class="field"><label for="reflection-${key}">${label}</label><textarea id="reflection-${key}" data-reflection="${key}" placeholder="${placeholder}">${escapeHTML(state.reflection[key])}</textarea></div>`;
}

function lifeField(key, label, placeholder) {
  return `<div class="field"><label for="life-${key}">${label}</label><textarea id="life-${key}" data-life-field="${key}" placeholder="${placeholder}">${escapeHTML(state.life[key])}</textarea></div>`;
}

function monthlyField(key, label, placeholder) {
  return `<div class="field"><label for="monthly-${key}">${label}</label><textarea id="monthly-${key}" data-monthly-field="${key}" placeholder="${placeholder}">${escapeHTML(monthlyState()[key])}</textarea></div>`;
}

function closeWeek() {
  if (!confirm("Close this week? Completed actions will be archived, open actions will carry forward, and the weekly plan will reset.")) return;
  const start = state.week.startedAt || weekStartKey();
  const end = dayKey(addDays(dateFromKey(start), 6));
  state.history.unshift({ id: crypto.randomUUID(), start, end, closedAt: new Date().toISOString(), week: clone(state.week), tasks: clone(state.tasks), reflection: clone(state.reflection), metrics: weekMetrics(start) });
  state.history = state.history.slice(0, 52);
  state.tasks = state.tasks.filter(task => !task.done).map(task => ({ ...task, done: false }));
  const followingWeek = addDays(dateFromKey(start), 7);
  const currentWeek = dateFromKey(weekStartKey());
  state.week = { startedAt: dayKey(followingWeek < currentWeek ? currentWeek : followingWeek), outcome: state.reflection.next || "", secondary: "", evidence: "", why: "" };
  state.reflection = { win: "", friction: "", lesson: "", next: "", recovery: "maintain", ratings: [3, 3, 3, 3, 3] };
  saveState("Week archived. Next week is ready.");
  render();
}

function goToView(view) {
  activeView = view;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function editorCollection(type) {
  if (type === "task") return state.tasks;
  if (type === "inbox") return state.inbox;
  if (type === "maintenance") return state.maintenance;
  if (type === "cue") return state.cues;
  if (type === "script") return state.scripts;
  if (type === "transaction") return state.finances.transactions;
  if (type === "bill") return state.finances.bills;
  if (type === "obligation") return state.finances.obligations;
  if (type === "investment") return state.finances.investments;
  return [];
}

function openEditor(type, id = null) {
  const dialog = document.getElementById("editor-dialog");
  const fields = document.getElementById("dialog-fields");
  const collectionTypes = ["task", "inbox", "maintenance", "cue", "script", "transaction", "bill", "obligation", "investment"];
  const item = collectionTypes.includes(type) && id ? editorCollection(type).find(entry => entry.id === id) : null;
  editor = type === "handoffImport" ? { type, payload: id } : { type, id };
  const titles = { task: "Smart action", inbox: "Quick capture", maintenance: "Life maintenance date", cue: "Cue architecture", script: "If–then script", transaction: "Transaction", bill: "Bill + due date", obligation: "Obligation", investment: "Investment", moneySettings: "Spending guardrails", routine: `${state.modes[id]?.label || "Routine"} mode`, reminders: "Gentle reminders", security: "App lock", handoff: "Secure phone handoff", handoffImport: "Import secure handoff" };
  document.getElementById("dialog-eyebrow").textContent = ({ routine: "Personalise your system", reminders: "Stay gently connected", security: "Local privacy", handoff: "Encrypted device transfer", handoffImport: "Encrypted device transfer" })[type] || (id ? "Update your system" : "Add to your system");
  document.getElementById("dialog-title").textContent = titles[type] || "Item";
  document.getElementById("delete-item").classList.toggle("hidden", !(id && collectionTypes.includes(type)));
  document.getElementById("save-item").textContent = ({ handoff: "Create secure link", handoffImport: "Import", security: "Save lock", reminders: "Save reminders", routine: "Save routine" })[type] || "Save";
  if (type === "task") fields.innerHTML = taskEditor(item);
  if (type === "inbox") fields.innerHTML = inboxEditor(item);
  if (type === "maintenance") fields.innerHTML = maintenanceEditor(item);
  if (type === "cue") fields.innerHTML = cueEditor(item);
  if (type === "script") fields.innerHTML = scriptEditor(item);
  if (type === "transaction") fields.innerHTML = transactionEditor(item);
  if (type === "bill") fields.innerHTML = billEditor(item);
  if (type === "obligation") fields.innerHTML = `<div class="field"><label>Name</label><input name="name" required value="${escapeHTML(item?.name || "")}" /></div><div class="inline-fields"><div class="field"><label>Total owed (£)</label><input name="target" type="number" min="0" step="0.01" required value="${item?.target || ""}" /></div><div class="field"><label>Already restored (£)</label><input name="paid" type="number" min="0" step="0.01" value="${item?.paid || 0}" /></div><div class="field"><label>Planned this month (£)</label><input name="monthlyPayment" type="number" min="0" step="0.01" value="${item?.monthlyPayment || 0}" /></div></div>`;
  if (type === "investment") fields.innerHTML = `<div class="field"><label>Name</label><input name="name" required value="${escapeHTML(item?.name || "")}" /></div><div class="inline-fields"><div class="field"><label>Contributed (£)</label><input name="contributed" type="number" min="0" step="0.01" value="${item?.contributed || 0}" /></div><div class="field"><label>Current value (£)</label><input name="current" type="number" min="0" step="0.01" value="${item?.current || 0}" /></div></div>`;
  if (type === "moneySettings") fields.innerHTML = moneySettingsEditor();
  if (type === "routine") fields.innerHTML = routineEditor(id);
  if (type === "reminders") fields.innerHTML = remindersEditor();
  if (type === "security") fields.innerHTML = securityEditor();
  if (type === "handoff") fields.innerHTML = handoffEditor();
  if (type === "handoffImport") fields.innerHTML = handoffImportEditor();
  connectEditorLabels(fields, type);
  dialog.showModal();
  if (type === "bill") updateBillEditorFields();
  setTimeout(() => fields.querySelector("input:not([type=checkbox]), textarea")?.focus(), 60);
}

function connectEditorLabels(fields, type) {
  fields.querySelectorAll(".field").forEach((field, index) => {
    const label = field.querySelector(":scope > label");
    const control = field.querySelector(":scope > input, :scope > textarea, :scope > select");
    if (!label || !control) return;
    control.id ||= `editor-${type}-${index}`;
    label.htmlFor = control.id;
  });
}

function taskEditor(item) {
  return `<div class="field"><label>Action</label><input name="name" required value="${escapeHTML(item?.name || "")}" /></div><div class="inline-fields"><div class="field"><label>Weekly role</label><select name="alignment">${[["primary","Main outcome"],["supporting","Supporting"],["maintenance","Maintenance"]].map(([value,label]) => `<option value="${value}" ${item?.alignment === value ? "selected" : ""}>${label}</option>`).join("")}</select></div><div class="field"><label>Deadline</label><input name="dueDate" type="date" value="${item?.dueDate || ""}" /></div></div><div class="inline-fields"><div class="field"><label>Impact</label><select name="impact">${[1,2,3].map(value => `<option value="${value}" ${Number(item?.impact || 2) === value ? "selected" : ""}>${value}</option>`).join("")}</select></div><div class="field"><label>Complexity</label><select name="complexity">${[1,2,3].map(value => `<option value="${value}" ${Number(item?.complexity || 1) === value ? "selected" : ""}>${value}</option>`).join("")}</select></div><div class="field"><label>Energy</label><select name="energy">${["low","medium","high"].map(value => `<option value="${value}" ${(item?.energy || "medium") === value ? "selected" : ""}>${energyLabel(value)}</option>`).join("")}</select></div></div><div class="field"><label>Minutes</label><input name="duration" type="number" min="5" max="300" step="5" value="${item?.duration || 30}" /></div><div class="task-setup-editor"><div><p class="eyebrow">Automatic start architecture</p><strong>Prepare → place → launch → fallback</strong></div><div class="field"><label>Prepare beforehand</label><textarea name="preparation" placeholder="Pack the bag, open the file, gather the documents…">${escapeHTML(item?.preparation || "")}</textarea></div><div class="field"><label>Put it here</label><textarea name="placement" placeholder="By the door, on the desk, beside breakfast…">${escapeHTML(item?.placement || "")}</textarea></div><div class="field"><label>Start when</label><textarea name="launchCue" placeholder="After meditation, when work ends, after breakfast…">${escapeHTML(item?.launchCue || "")}</textarea></div><div class="field"><label>If the plan breaks</label><textarea name="fallback" placeholder="The minimum version that still keeps momentum.">${escapeHTML(item?.fallback || "")}</textarea></div></div><p class="dialog-note">The scheduler chooses the task. This setup removes the decisions and friction that normally delay starting.</p>`;
}

function inboxEditor(item) {
  return `<div class="field"><label>What do you want to hold?</label><textarea name="text" required placeholder="Idea, concern, reminder, or something to revisit.">${escapeHTML(item?.text || "")}</textarea></div><div class="field"><label>Type</label><select name="type">${["idea","task","concern","later"].map(value => `<option value="${value}" ${item?.type === value ? "selected" : ""}>${value[0].toUpperCase() + value.slice(1)}</option>`).join("")}</select></div><p class="dialog-note">Capturing this does not make it a commitment. Review it during weekly planning.</p>`;
}

function maintenanceEditor(item) {
  return `<div class="field"><label>What needs remembering?</label><input name="name" required value="${escapeHTML(item?.name || "")}" placeholder="Dentist, birthday, MOT, passport…" /></div><div class="inline-fields"><div class="field"><label>Category</label><select name="category">${[["appointment","Appointment"],["birthday","Birthday"],["renewal","Renewal"],["car","Car"],["document","Document"],["health","Health"],["home","Home"],["other","Other"]].map(([value,label]) => `<option value="${value}" ${item?.category === value ? "selected" : ""}>${label}</option>`).join("")}</select></div><div class="field"><label>Date</label><input name="dueDate" type="date" required value="${item?.dueDate || dayKey()}" /></div><div class="field"><label>Repeats</label><select name="recurrence">${[["oneoff","One-off"],["annual","Every year"],["monthly","Every month"]].map(([value,label]) => `<option value="${value}" ${item?.recurrence === value ? "selected" : ""}>${label}</option>`).join("")}</select></div></div><div class="field"><label>Remind me before</label><select name="remindDays">${[[0,"On the day"],[1,"1 day"],[3,"3 days"],[7,"7 days"],[14,"14 days"],[30,"30 days"],[60,"60 days"]].map(([value,label]) => `<option value="${value}" ${Number(item?.remindDays ?? 7) === value ? "selected" : ""}>${label}</option>`).join("")}</select></div><div class="field"><label>Useful details</label><textarea name="notes" placeholder="Location, document needed, person to contact…">${escapeHTML(item?.notes || "")}</textarea></div>`;
}

function cueEditor(item) {
  return `<div class="field"><label>Behaviour</label><input name="name" required value="${escapeHTML(item?.name || "")}" /></div><div class="field"><label>When this happens</label><textarea name="cue" required>${escapeHTML(item?.cue || "")}</textarea></div><div class="field"><label>I immediately</label><textarea name="response" required>${escapeHTML(item?.response || "")}</textarea></div><div class="field"><label>Install this positive cue</label><textarea name="setup" required>${escapeHTML(item?.setup || "")}</textarea></div><div class="field"><label>Remove this competing cue</label><textarea name="remove" required>${escapeHTML(item?.remove || "")}</textarea></div>`;
}

function scriptEditor(item) {
  return `<div class="field"><label>If</label><textarea name="trigger" required>${escapeHTML(item?.trigger || "")}</textarea></div><div class="field"><label>Then</label><textarea name="response" required>${escapeHTML(item?.response || "")}</textarea></div>`;
}

function transactionEditor(item) {
  return `<div class="inline-fields"><div class="field"><label>Type</label><select name="type"><option value="expense" ${item?.type === "expense" ? "selected" : ""}>Expense</option><option value="income" ${item?.type === "income" ? "selected" : ""}>Income</option></select></div><div class="field"><label>Account</label><select name="account">${[["personal","Personal"],["business","Business"],["held","Held for others"]].map(([value,label]) => `<option value="${value}" ${item?.account === value ? "selected" : ""}>${label}</option>`).join("")}</select></div><div class="field"><label>Date</label><input name="date" type="date" required value="${item?.date || dayKey()}" /></div></div><div class="field"><label>Amount (£)</label><input name="amount" type="number" min="0.01" step="0.01" required value="${item?.amount || ""}" /></div><div class="field"><label>Category</label><select name="category">${["Living expenses","Personal reserve","Savings","Business capital","Family support","Money held for others","Income","Other"].map(value => `<option ${item?.category === value ? "selected" : ""}>${value}</option>`).join("")}</select></div><div class="field"><label>Note</label><input name="note" value="${escapeHTML(item?.note || "")}" placeholder="What was this for?" /></div>`;
}

function billEditor(item) {
  const frequency = item?.frequency || "monthly";
  const monthNames = Array.from({ length: 12 }, (_, index) => new Intl.DateTimeFormat("en-GB", { month: "long" }).format(new Date(2024, index, 1)));
  return `<div class="field"><label>Bill name</label><input name="name" required value="${escapeHTML(item?.name || "")}" placeholder="Rent, phone, insurance…" /></div><div class="inline-fields bill-core-fields"><div class="field"><label>Amount (£)</label><input name="amount" type="number" min="0.01" step="0.01" required value="${item?.amount ?? ""}" /></div><div class="field"><label>Repeats</label><select name="frequency" data-bill-frequency>${[["monthly","Monthly"],["annual","Yearly"],["oneoff","One-off"]].map(([value,label]) => `<option value="${value}" ${frequency === value ? "selected" : ""}>${label}</option>`).join("")}</select></div></div><div class="bill-date-group" data-bill-date="monthly"><div class="field"><label>Due day each month</label><input name="dueDayMonthly" type="number" inputmode="numeric" min="1" max="31" value="${item?.dueDay || new Date().getDate()}" /></div></div><div class="bill-date-group" data-bill-date="annual"><div class="inline-fields"><div class="field"><label>Due month</label><select name="dueMonth">${monthNames.map((name,index) => `<option value="${index + 1}" ${Number(item?.dueMonth || new Date().getMonth() + 1) === index + 1 ? "selected" : ""}>${name}</option>`).join("")}</select></div><div class="field"><label>Due day</label><input name="dueDayAnnual" type="number" inputmode="numeric" min="1" max="31" value="${item?.dueDay || new Date().getDate()}" /></div></div></div><div class="bill-date-group" data-bill-date="oneoff"><div class="field"><label>Due date</label><input name="dueDate" type="date" value="${item?.dueDate || dayKey()}" /></div></div><div class="inline-fields"><div class="field"><label>Type</label><select name="billKind">${[["essential","Essential"],["subscription","Subscription"],["flexible","Flexible"]].map(([value,label]) => `<option value="${value}" ${(item?.kind || "essential") === value ? "selected" : ""}>${label}</option>`).join("")}</select></div><div class="field"><label>Paid from</label><select name="account"><option value="personal" ${item?.account !== "business" ? "selected" : ""}>Personal</option><option value="business" ${item?.account === "business" ? "selected" : ""}>Business</option></select></div><div class="field"><label>Remind me before</label><select name="remindDays">${[[0,"On the day"],[1,"1 day"],[3,"3 days"],[7,"7 days"],[14,"14 days"]].map(([value,label]) => `<option value="${value}" ${Number(item?.remindDays ?? 3) === value ? "selected" : ""}>${label}</option>`).join("")}</select></div></div><label class="toggle-row"><span><strong>Paid automatically</strong><small>Label this as autopay in the calendar</small></span><input name="autopay" type="checkbox" ${item?.autopay ? "checked" : ""} /><i></i></label><p class="dialog-note">Subscription price changes are remembered automatically. Mark each cycle paid to advance its date.</p>`;
}

function moneySettingsEditor() {
  return `<div class="field"><label>Cash reserve floor (£)</label><input name="reserveTarget" type="number" min="0" step="10" required value="${Number(state.finances.settings.reserveTarget) || 0}" /></div><p class="dialog-note">Safe to spend = available cash − unpaid bills in the next 30 days − overdue bills − this reserve − planned obligation payments.</p>`;
}

function updateBillEditorFields() {
  const frequency = document.querySelector('[data-bill-frequency]')?.value;
  document.querySelectorAll("[data-bill-date]").forEach(group => group.classList.toggle("hidden", group.dataset.billDate !== frequency));
}

function routineEditor(key) {
  const mode = state.modes[key];
  return `<div class="field"><label>Mode purpose</label><textarea name="note" required>${escapeHTML(mode.note)}</textarea></div><div class="routine-editor-head"><span>Sequence</span><button class="text-button" type="button" data-add-routine-step>+ Add step</button></div><div class="routine-step-list">${mode.routine.map((step, index) => routineStepEditor(step, index)).join("")}</div><p class="dialog-note">Routine completion for today resets when you change its sequence.</p>`;
}

function routineStepEditor(step = ["", "", 5], index = 0) {
  return `<div class="routine-step-editor"><div class="step-order"><span>${index + 1}</span><button type="button" data-move-step="up" aria-label="Move up">↑</button><button type="button" data-move-step="down" aria-label="Move down">↓</button></div><div class="step-fields"><input name="stepName" required value="${escapeHTML(step[0])}" placeholder="Step name" /><input name="stepCue" required value="${escapeHTML(step[1])}" placeholder="Cue or minimum version" /><div class="step-duration"><input name="stepDuration" type="number" min="1" max="300" required value="${Number(step[2]) || 5}" /><span>min</span></div></div><button class="step-remove" type="button" data-remove-routine-step aria-label="Remove step">×</button></div>`;
}

function remindersEditor() {
  const reminder = state.preferences.reminders;
  const supported = "Notification" in window;
  return `<label class="toggle-row"><span><strong>Enable reminders</strong><small>${supported ? "Morning, evening, and weekly review" : "Notifications are not supported in this browser"}</small></span><input name="enabled" type="checkbox" ${reminder.enabled && supported ? "checked" : ""} ${supported ? "" : "disabled"} /><i></i></label><div class="inline-fields reminder-fields"><div class="field"><label>Morning check-in</label><input name="morning" type="time" value="${reminder.morning}" /></div><div class="field"><label>Evening shutdown</label><input name="evening" type="time" value="${reminder.evening}" /></div></div><div class="inline-fields reminder-fields"><div class="field"><label>Weekly review day</label><select name="weeklyDay">${[[0,"Sunday"],[1,"Monday"],[2,"Tuesday"],[3,"Wednesday"],[4,"Thursday"],[5,"Friday"],[6,"Saturday"]].map(([value,label]) => `<option value="${value}" ${String(reminder.weeklyDay) === String(value) ? "selected" : ""}>${label}</option>`).join("")}</select></div><div class="field"><label>Review time</label><input name="weeklyTime" type="time" value="${reminder.weeklyTime}" /></div></div><p class="dialog-note">Reminders appear when the installed app is active or next opened. Mobile operating systems may limit background web notifications.</p>`;
}

function securityEditor() {
  const deviceAvailable = Boolean(window.PublicKeyCredential && window.isSecureContext);
  return `${security.pinHash ? '<div class="field"><label>Current PIN</label><input name="currentPin" type="password" inputmode="numeric" maxlength="12" required autocomplete="current-password" /></div>' : ""}<div class="field"><label>${security.pinHash ? "New PIN (optional)" : "Create PIN"}</label><input name="newPin" type="password" inputmode="numeric" minlength="4" maxlength="12" ${security.pinHash ? "" : "required"} autocomplete="new-password" /></div><div class="field"><label>Confirm new PIN</label><input name="confirmPin" type="password" inputmode="numeric" minlength="4" maxlength="12" ${security.pinHash ? "" : "required"} autocomplete="new-password" /></div><div class="field"><label>Auto-lock after</label><select name="lockMinutes">${[[1,"1 minute"],[5,"5 minutes"],[15,"15 minutes"],[30,"30 minutes"]].map(([value,label]) => `<option value="${value}" ${Number(security.lockMinutes) === value ? "selected" : ""}>${label}</option>`).join("")}</select></div><label class="toggle-row"><span><strong>Face ID / device unlock</strong><small>${deviceAvailable ? "Use this device's secure authenticator" : "Available only in the installed secure app"}</small></span><input name="deviceUnlock" type="checkbox" ${security.credentialId ? "checked" : ""} ${deviceAvailable ? "" : "disabled"} /><i></i></label>${security.pinHash ? '<button class="button button-ghost button-wide danger-button" type="button" data-disable-lock>Turn off app lock</button>' : ""}<p class="dialog-note">The PIN verifier stays only on this device and is never included in backups or handoffs.</p>`;
}

function handoffEditor() {
  return `<div class="handoff-intro"><strong>Encrypted before it leaves this device</strong><p>Create a one-time link for your phone. Share the password separately.</p></div><div class="field"><label>Transfer password</label><input name="password" type="password" minlength="6" required autocomplete="new-password" /></div><div class="field"><label>Confirm password</label><input name="confirmPassword" type="password" minlength="6" required autocomplete="new-password" /></div><p class="dialog-note">This safely copies your current data; it does not create a cloud account or continuous background sync.</p>`;
}

function handoffImportEditor() {
  return `<div class="handoff-intro"><strong>Encrypted transfer detected</strong><p>Enter the password chosen on the sending device.</p></div><div class="field"><label>Transfer password</label><input name="password" type="password" required autocomplete="current-password" /></div><p class="dialog-note">Importing replaces this device's Life OS data. Its local PIN settings remain unchanged.</p>`;
}

async function saveEditor() {
  const form = document.getElementById("editor-form");
  if (!form.reportValidity()) return false;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  if (editor.type === "routine") {
    const steps = [...form.querySelectorAll(".routine-step-editor")].map(row => [row.querySelector('[name="stepName"]').value.trim(), row.querySelector('[name="stepCue"]').value.trim(), Math.max(1, Number(row.querySelector('[name="stepDuration"]').value) || 5)]).filter(step => step[0]);
    if (!steps.length) return showToast("Keep at least one routine step"), false;
    const sequenceChanged = JSON.stringify(state.modes[editor.id].routine) !== JSON.stringify(steps);
    state.modes[editor.id].note = data.note.trim();
    state.modes[editor.id].routine = steps;
    if (sequenceChanged && todayState().mode === editor.id) todayState().routine = [];
    saveState("Routine updated");
    render();
    return true;
  }
  if (editor.type === "reminders") return saveReminders(form, data);
  if (editor.type === "security") return saveLockSettings(form, data);
  if (editor.type === "moneySettings") {
    state.finances.settings.reserveTarget = Math.max(0, Number(data.reserveTarget) || 0);
    saveState("Spending guardrails updated");
    render();
    return true;
  }
  if (editor.type === "handoff") {
    if (data.password !== data.confirmPassword) return showToast("Passwords do not match"), false;
    await createSecureHandoff(data.password);
    return true;
  }
  if (editor.type === "handoffImport") {
    try {
      const imported = await decryptHandoff(editor.payload, data.password);
      if (!confirm("Replace this device's current Life OS data with the secure handoff?")) return false;
      state = normalizeState(imported);
      saveState("Secure handoff imported");
      pendingHandoff = null;
      if (location.hash.includes("handoff=")) history.replaceState(null, "", `${location.pathname}${location.search}`);
      render();
      return true;
    } catch {
      showToast("Password incorrect or transfer damaged");
      return false;
    }
  }
  const collection = editorCollection(editor.type);
  let item = editor.id ? collection.find(entry => entry.id === editor.id) : null;
  if (!item) {
    item = { id: crypto.randomUUID() };
    collection.push(item);
  }
  if (editor.type === "task") {
    const nextSetup = { preparation: data.preparation.trim(), placement: data.placement.trim(), launchCue: data.launchCue.trim(), fallback: data.fallback.trim() };
    const setupChanged = Object.entries(nextSetup).some(([key, value]) => item[key] !== value);
    Object.assign(item, { name: data.name.trim(), impact: Number(data.impact), complexity: Number(data.complexity), energy: data.energy, duration: Number(data.duration), dueDate: data.dueDate || "", alignment: data.alignment, ...nextSetup, createdAt: item.createdAt || new Date().toISOString(), done: item.done || false });
    const daily = todayState();
    if (setupChanged && daily.tomorrowTaskId === item.id) daily.tomorrowReady = false;
  }
  if (editor.type === "inbox") Object.assign(item, { text: data.text.trim(), type: data.type, createdAt: item.createdAt || new Date().toISOString() });
  if (editor.type === "maintenance") Object.assign(item, { name: data.name.trim(), category: data.category, dueDate: data.dueDate, recurrence: data.recurrence, remindDays: Number(data.remindDays), notes: data.notes.trim(), createdAt: item.createdAt || new Date().toISOString(), completedPeriods: item.completedPeriods || [] });
  if (editor.type === "cue") Object.assign(item, { name: data.name.trim(), cue: data.cue.trim(), response: data.response.trim(), setup: data.setup.trim(), remove: data.remove.trim() });
  if (editor.type === "script") Object.assign(item, { trigger: data.trigger.trim(), response: data.response.trim() });
  if (editor.type === "transaction") Object.assign(item, { type: data.type, account: data.account, date: data.date, amount: Number(data.amount), category: data.category, note: data.note.trim() });
  if (editor.type === "bill") {
    if (data.frequency === "oneoff" && !data.dueDate) return showToast("Choose the one-off due date"), false;
    const frequencyChanged = item.frequency && item.frequency !== data.frequency;
    const dueDay = data.frequency === "annual" ? Number(data.dueDayAnnual) : Number(data.dueDayMonthly);
    const nextAmount = Number(data.amount);
    const priceChanged = Number(item.amount) > 0 && Number(item.amount) !== nextAmount;
    const becomingSubscription = item.kind !== "subscription" && data.billKind === "subscription";
    Object.assign(item, { name: data.name.trim(), amount: nextAmount, frequency: data.frequency, dueDay, dueMonth: Number(data.dueMonth || 1), dueDate: data.dueDate || "", kind: data.billKind, account: data.account, remindDays: Number(data.remindDays), autopay: Boolean(data.autopay), createdAt: item.createdAt || new Date().toISOString(), paidPeriods: frequencyChanged ? [] : (item.paidPeriods || []), previousAmount: priceChanged ? Number(item.amount) : Number(item.previousAmount || 0), amountChangedAt: priceChanged ? new Date().toISOString() : (item.amountChangedAt || ""), lastReviewed: becomingSubscription ? new Date().toISOString() : (item.lastReviewed || "") });
  }
  if (editor.type === "obligation") Object.assign(item, { name: data.name.trim(), target: Number(data.target), paid: Number(data.paid), monthlyPayment: Number(data.monthlyPayment) });
  if (editor.type === "investment") Object.assign(item, { name: data.name.trim(), contributed: Number(data.contributed), current: Number(data.current) });
  saveState(editor.type === "inbox" ? "Captured without changing direction" : "System updated");
  render();
  return true;
}

function deleteEditor() {
  if (!editor?.id || !confirm("Delete this item?")) return;
  const collection = editorCollection(editor.type);
  const index = collection.findIndex(entry => entry.id === editor.id);
  if (index >= 0) collection.splice(index, 1);
  if (editor.type === "task" && todayState().tomorrowTaskId === editor.id) {
    todayState().tomorrowTaskId = "";
    todayState().tomorrowReady = false;
  }
  saveState("Item deleted");
  render();
  document.getElementById("editor-dialog").close();
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function promoteInboxItem(id) {
  const index = state.inbox.findIndex(item => item.id === id);
  if (index < 0) return;
  const item = state.inbox[index];
  state.tasks.push({ id: crypto.randomUUID(), name: item.text, impact: 2, complexity: 1, energy: "medium", duration: 30, dueDate: "", alignment: "supporting", createdAt: new Date().toISOString(), done: false });
  state.inbox.splice(index, 1);
  saveState("Capture moved into actions");
  render();
}

function renumberRoutineSteps() {
  document.querySelectorAll(".routine-step-editor").forEach((row, index) => {
    row.querySelector(".step-order span").textContent = String(index + 1);
  });
}

function refreshSettings() {
  const reminderStatus = document.getElementById("reminder-status");
  const securityStatus = document.getElementById("security-status");
  if (reminderStatus) reminderStatus.textContent = state.preferences.reminders.enabled ? `On · ${state.preferences.reminders.morning} + ${state.preferences.reminders.evening}` : "Off";
  if (securityStatus) securityStatus.textContent = security.pinHash ? (security.credentialId ? "PIN + device unlock" : "PIN enabled") : "Off";
}

function openSettings() {
  refreshSettings();
  document.getElementById("settings-dialog").showModal();
}

async function saveReminders(form, data) {
  const enabled = form.elements.enabled.checked;
  if (enabled) {
    if (!("Notification" in window)) return showToast("Notifications are not supported here"), false;
    const permission = Notification.permission === "default" ? await Notification.requestPermission() : Notification.permission;
    if (permission !== "granted") return showToast("Notification permission was not granted"), false;
  }
  state.preferences.reminders = { ...state.preferences.reminders, enabled, morning: data.morning || "08:00", evening: data.evening || "21:00", weeklyDay: data.weeklyDay || "0", weeklyTime: data.weeklyTime || "18:00" };
  saveState(enabled ? "Gentle reminders enabled" : "Reminders turned off");
  startReminderChecks();
  refreshSettings();
  return true;
}

function minutesSince(time, now = new Date()) {
  const [hours, minutes] = String(time).split(":").map(Number);
  return now.getHours() * 60 + now.getMinutes() - (hours * 60 + minutes);
}

async function showReminder(tag, title, body) {
  const registration = await navigator.serviceWorker?.ready.catch(() => null);
  if (registration?.showNotification) {
    await registration.showNotification(title, { body, tag, icon: "icon-180.png", badge: "icon-180.png" });
  } else if (Notification.permission === "granted") {
    new Notification(title, { body, tag, icon: "icon-180.png" });
  }
}

async function checkReminders() {
  const reminder = state.preferences.reminders;
  if (!reminder.enabled || !("Notification" in window) || Notification.permission !== "granted") return;
  const now = new Date();
  const today = dayKey(now);
  const checks = [
    { key: `morning-${today}`, due: minutesSince(reminder.morning, now), window: 120, title: "Choose your honest capacity", body: "Check your energy, select a mode, and protect one meaningful outcome." },
    { key: `evening-${today}`, due: minutesSince(reminder.evening, now), window: 180, title: "Close the human day", body: "Protect one real interaction, take deliberate rest, then prepare tomorrow's first action." }
  ];
  if (String(now.getDay()) === String(reminder.weeklyDay)) checks.push({ key: `weekly-${today}`, due: minutesSince(reminder.weeklyTime, now), window: 240, title: "Weekly review", body: "Close the loop, choose recovery, and define what matters next." });
  for (const item of checks) {
    if (item.due >= 0 && item.due <= item.window && !reminder.lastFired[item.key]) {
      reminder.lastFired[item.key] = new Date().toISOString();
      await showReminder(item.key, item.title, item.body);
      saveState();
    }
  }
  for (const entry of state.finances.bills.map(bill => billScheduleEntry(bill, now))) {
    if (!entry.hasOutstanding || entry.days > entry.bill.remindDays) continue;
    const key = `bill-${entry.bill.id}-${entry.period}-${today}`;
    if (reminder.lastFired[key]) continue;
    const timing = entry.days < 0 ? `${Math.abs(entry.days)} day${Math.abs(entry.days) === 1 ? "" : "s"} overdue` : entry.days === 0 ? "due today" : `due in ${entry.days} day${entry.days === 1 ? "" : "s"}`;
    reminder.lastFired[key] = new Date().toISOString();
    await showReminder(key, `Bill ${timing}: ${entry.bill.name}`, `${currency(entry.bill.amount)} from ${entry.bill.account}${entry.bill.autopay ? " · autopay" : ""}.`);
    saveState();
  }
  for (const task of state.tasks.filter(item => !item.done && item.dueDate)) {
    const days = taskDueDays(task, now);
    if (days > 1) continue;
    const key = `task-${task.id}-${today}`;
    if (reminder.lastFired[key]) continue;
    const timing = days < 0 ? `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} overdue` : days === 0 ? "due today" : "due tomorrow";
    reminder.lastFired[key] = new Date().toISOString();
    await showReminder(key, `Action ${timing}`, `${task.name} · ${task.duration} min · ${energyLabel(task.energy)}.`);
    saveState();
  }
  for (const entry of maintenanceSchedule(now)) {
    if (entry.actionDone || entry.days > entry.item.remindDays) continue;
    const key = `maintenance-${entry.item.id}-${entry.period}-${today}`;
    if (reminder.lastFired[key]) continue;
    const timing = entry.days < 0 ? `${Math.abs(entry.days)} day${Math.abs(entry.days) === 1 ? "" : "s"} overdue` : entry.days === 0 ? "today" : `in ${entry.days} day${entry.days === 1 ? "" : "s"}`;
    reminder.lastFired[key] = new Date().toISOString();
    await showReminder(key, `${entry.item.name} · ${timing}`, entry.item.notes || `${entry.item.category} life-maintenance reminder.`);
    saveState();
  }
}

function startReminderChecks() {
  clearInterval(reminderTimer);
  checkReminders();
  reminderTimer = setInterval(checkReminders, 60000);
}

function bytesToBase64Url(bytes) {
  let binary = "";
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(base64);
  return Uint8Array.from(binary, char => char.charCodeAt(0));
}

async function pinHash(pin, saltValue) {
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(pin), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: base64UrlToBytes(saltValue), iterations: 180000, hash: "SHA-256" }, material, 256);
  return bytesToBase64Url(new Uint8Array(bits));
}

async function verifyPin(pin) {
  if (!security.pinHash || !security.salt) return false;
  return (await pinHash(pin, security.salt)) === security.pinHash;
}

async function setupDeviceCredential() {
  if (!window.PublicKeyCredential || !window.isSecureContext) throw new Error("Device unlock unavailable");
  const userId = crypto.getRandomValues(new Uint8Array(16));
  const credential = await navigator.credentials.create({ publicKey: { challenge: crypto.getRandomValues(new Uint8Array(32)), rp: { name: "50X Life OS" }, user: { id: userId, name: "50x-owner", displayName: "50X Life OS owner" }, pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }], authenticatorSelection: { authenticatorAttachment: "platform", residentKey: "preferred", userVerification: "required" }, timeout: 60000, attestation: "none" } });
  return { credentialId: bytesToBase64Url(new Uint8Array(credential.rawId)), credentialUserId: bytesToBase64Url(userId) };
}

async function saveLockSettings(form, data) {
  if (!crypto.subtle) return showToast("Secure PIN storage is unavailable here"), false;
  if (security.pinHash && !(await verifyPin(data.currentPin || ""))) return showToast("Current PIN is incorrect"), false;
  if (data.newPin || !security.pinHash) {
    if (!/^\d{4,12}$/.test(data.newPin || "")) return showToast("Use a 4–12 digit PIN"), false;
    if (data.newPin !== data.confirmPin) return showToast("New PINs do not match"), false;
    const salt = bytesToBase64Url(crypto.getRandomValues(new Uint8Array(16)));
    security.salt = salt;
    security.pinHash = await pinHash(data.newPin, salt);
  }
  security.lockMinutes = Number(data.lockMinutes) || 5;
  const wantsDevice = form.elements.deviceUnlock.checked;
  if (wantsDevice && !security.credentialId) {
    try {
      Object.assign(security, await setupDeviceCredential());
    } catch {
      showToast("PIN saved; device unlock was not enabled");
    }
  }
  if (!wantsDevice) {
    security.credentialId = "";
    security.credentialUserId = "";
  }
  saveSecurity();
  appUnlocked = true;
  scheduleAutoLock();
  showToast("App lock updated");
  return true;
}

async function disableLock() {
  const pin = prompt("Enter your current PIN to turn off the app lock:");
  if (pin === null) return;
  if (!(await verifyPin(pin))) return showToast("Current PIN is incorrect");
  security = { pinHash: "", salt: "", lockMinutes: 5, credentialId: "", credentialUserId: "" };
  localStorage.removeItem(SECURITY_KEY);
  appUnlocked = true;
  clearTimeout(lockTimer);
  document.getElementById("editor-dialog").close();
  refreshSettings();
  showToast("App lock turned off");
}

function showLock() {
  if (!security.pinHash) return;
  appUnlocked = false;
  document.body.classList.add("locked");
  document.getElementById("lock-screen").classList.remove("hidden");
  document.getElementById("device-unlock").classList.toggle("hidden", !security.credentialId);
  document.getElementById("unlock-pin").value = "";
  document.getElementById("lock-error").textContent = "";
  setTimeout(() => document.getElementById("unlock-pin").focus(), 80);
}

function hideLock() {
  appUnlocked = true;
  document.body.classList.remove("locked");
  document.getElementById("lock-screen").classList.add("hidden");
  scheduleAutoLock();
  processPendingHandoff();
}

function scheduleAutoLock() {
  clearTimeout(lockTimer);
  if (!security.pinHash || !appUnlocked) return;
  lockTimer = setTimeout(showLock, Math.max(1, Number(security.lockMinutes) || 5) * 60000);
}

async function unlockWithDevice() {
  try {
    await navigator.credentials.get({ publicKey: { challenge: crypto.getRandomValues(new Uint8Array(32)), allowCredentials: [{ id: base64UrlToBytes(security.credentialId), type: "public-key", transports: ["internal"] }], userVerification: "required", timeout: 60000 } });
    hideLock();
  } catch {
    document.getElementById("lock-error").textContent = "Device unlock was cancelled or unavailable.";
  }
}

async function gzipBytes(bytes) {
  if (!("CompressionStream" in window)) return { bytes, compressed: false };
  const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream("gzip"));
  return { bytes: new Uint8Array(await new Response(stream).arrayBuffer()), compressed: true };
}

async function gunzipBytes(bytes, compressed) {
  if (!compressed) return bytes;
  if (!("DecompressionStream" in window)) throw new Error("Compression unavailable");
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function deriveTransferKey(password, salt) {
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: 180000, hash: "SHA-256" }, material, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}

async function encryptHandoff(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const packed = await gzipBytes(new TextEncoder().encode(JSON.stringify(state)));
  const key = await deriveTransferKey(password, salt);
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, packed.bytes);
  const envelope = { kind: "50x-handoff", version: 1, compressed: packed.compressed, salt: bytesToBase64Url(salt), iv: bytesToBase64Url(iv), data: bytesToBase64Url(new Uint8Array(encrypted)) };
  return { envelope, encoded: bytesToBase64Url(new TextEncoder().encode(JSON.stringify(envelope))) };
}

async function decryptHandoff(payload, password) {
  const envelope = typeof payload === "string" ? JSON.parse(new TextDecoder().decode(base64UrlToBytes(payload))) : payload;
  if (envelope?.kind !== "50x-handoff") throw new Error("Invalid handoff");
  const key = await deriveTransferKey(password, base64UrlToBytes(envelope.salt));
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: base64UrlToBytes(envelope.iv) }, key, base64UrlToBytes(envelope.data));
  const unpacked = await gunzipBytes(new Uint8Array(decrypted), envelope.compressed);
  return JSON.parse(new TextDecoder().decode(unpacked));
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(value);
  const area = document.createElement("textarea");
  area.value = value;
  document.body.appendChild(area);
  area.select();
  document.execCommand("copy");
  area.remove();
}

function downloadBlob(blob, filename) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

async function createSecureHandoff(password) {
  if (!crypto.subtle) throw new Error("Encryption unavailable");
  const { envelope, encoded } = await encryptHandoff(password);
  const base = location.protocol === "https:" ? `${location.origin}${location.pathname}` : LIVE_URL;
  const url = `${base}#handoff=${encoded}`;
  state.sync.lastHandoff = new Date().toISOString();
  saveState();
  if (url.length <= 10000) {
    if (navigator.share) {
      try {
        await navigator.share({ title: "50X Life OS secure handoff", text: "Open this encrypted Life OS handoff on your other device, then enter the transfer password.", url });
        showToast("Secure handoff shared");
        return;
      } catch (error) {
        if (error.name !== "AbortError") throw error;
      }
    }
    await copyText(url);
    showToast("Secure handoff link copied");
    return;
  }
  const file = new File([JSON.stringify(envelope)], `50x-secure-handoff-${dayKey()}.50x`, { type: "application/json" });
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ title: "50X Life OS secure handoff", files: [file] });
    showToast("Encrypted handoff shared");
  } else {
    downloadBlob(file, file.name);
    showToast("Encrypted handoff downloaded");
  }
}

function readHandoffFromHash() {
  try {
    return new URLSearchParams(location.hash.slice(1)).get("handoff");
  } catch {
    return null;
  }
}

function processPendingHandoff() {
  if (!pendingHandoff || !appUnlocked || document.getElementById("editor-dialog").open) return;
  setTimeout(() => openEditor("handoffImport", pendingHandoff), 250);
}

function exportBackup() {
  downloadBlob(new Blob([JSON.stringify(state, null, 2)], { type: "application/json" }), `50x-life-os-backup-${dayKey()}.json`);
  showToast("Backup exported");
}

async function importBackupFile(file) {
  const imported = JSON.parse(await file.text());
  if (!imported.week || !Array.isArray(imported.tasks)) throw new Error("Invalid backup");
  state = normalizeState(imported);
  saveState("Backup restored and upgraded");
  render();
}

document.addEventListener("click", event => {
  const target = event.target.closest("button, [data-edit-script]");
  if (!target || document.body.classList.contains("locked")) return;
  if (target.dataset.closeDialog) {
    document.getElementById(target.dataset.closeDialog)?.close();
    return;
  }
  if (target.dataset.viewTarget) return goToView(target.dataset.viewTarget);
  if (target.dataset.scrollTarget) {
    document.getElementById(target.dataset.scrollTarget)?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  if (target.dataset.connectionType) {
    const connection = todayState().connection;
    connection.type = target.dataset.connectionType;
    connection.completed = false;
    connection.completedAt = "";
    saveState("Connection chosen");
    return render();
  }
  if (target.hasAttribute("data-connection-complete")) {
    const connection = todayState().connection;
    if (!connection.type) return showToast("Choose how you will connect first");
    connection.completed = !connection.completed;
    connection.completedAt = connection.completed ? new Date().toISOString() : "";
    saveState(connection.completed ? "Human connection protected" : "Connection reopened");
    return render();
  }
  if (target.dataset.restMinutes) {
    const connection = todayState().connection;
    connection.restMinutes = Number(target.dataset.restMinutes);
    connection.restCompleted = false;
    connection.restCompletedAt = "";
    saveState("Rest time protected");
    return render();
  }
  if (target.hasAttribute("data-rest-complete")) {
    const connection = todayState().connection;
    connection.restCompleted = !connection.restCompleted;
    connection.restCompletedAt = connection.restCompleted ? new Date().toISOString() : "";
    saveState(connection.restCompleted ? "Rest protected" : "Rest reopened");
    return render();
  }
  if (target.dataset.energy) {
    const daily = todayState();
    daily.energy = Number(target.dataset.energy);
    const nextMode = recoverySignal(daily).mode;
    if (daily.mode !== nextMode) daily.routine = [];
    daily.mode = nextMode;
    saveState();
    return render();
  }
  if (target.dataset.clarity) {
    todayState().clarity = Number(target.dataset.clarity);
    saveState();
    return render();
  }
  if (target.dataset.availableMinutes) {
    todayState().availableMinutes = Number(target.dataset.availableMinutes);
    saveState("Today's capacity updated");
    return render();
  }
  if (target.dataset.mode) {
    const daily = todayState();
    if (daily.mode !== target.dataset.mode) {
      daily.mode = target.dataset.mode;
      daily.routine = [];
    }
    saveState();
    return render();
  }
  if (target.dataset.routineIndex !== undefined) {
    const daily = todayState();
    const index = Number(target.dataset.routineIndex);
    daily.routine[index] = !daily.routine[index];
    saveState(daily.routine[index] ? "Foundation kept" : "Marked incomplete");
    return render();
  }
  if (target.dataset.taskToggle) {
    const task = state.tasks.find(item => item.id === target.dataset.taskToggle);
    task.done = !task.done;
    const daily = todayState();
    if (task.done && daily.tomorrowTaskId === task.id) {
      daily.tomorrowTaskId = "";
      daily.tomorrowReady = false;
    }
    saveState(task.done ? "Action complete" : "Action reopened");
    return render();
  }
  if (target.dataset.tomorrowReady) {
    const daily = todayState();
    const sameTask = daily.tomorrowTaskId === target.dataset.tomorrowReady;
    daily.tomorrowTaskId = target.dataset.tomorrowReady;
    daily.tomorrowReady = sameTask ? !daily.tomorrowReady : true;
    saveState(daily.tomorrowReady ? "Tomorrow is prepared" : "Preparation reopened");
    return render();
  }
  if (target.dataset.billPaid) {
    const bill = state.finances.bills.find(item => item.id === target.dataset.billPaid);
    if (!bill) return;
    const period = String(target.dataset.billPeriod);
    const paid = bill.paidPeriods.includes(period);
    bill.paidPeriods = paid ? bill.paidPeriods.filter(item => item !== period) : [...bill.paidPeriods, period];
    saveState(paid ? "Bill reopened" : "Bill marked paid");
    return render();
  }
  if (target.dataset.maintenanceDone) {
    const item = state.maintenance.find(entry => entry.id === target.dataset.maintenanceDone);
    if (!item) return;
    const period = String(target.dataset.maintenancePeriod);
    const done = item.completedPeriods.includes(period);
    item.completedPeriods = done ? item.completedPeriods.filter(value => value !== period) : [...item.completedPeriods, period];
    saveState(done ? "Life item reopened" : "Life item completed");
    return render();
  }
  if (target.dataset.reviewSubscription) {
    const bill = state.finances.bills.find(item => item.id === target.dataset.reviewSubscription);
    if (!bill) return;
    bill.lastReviewed = new Date().toISOString();
    bill.previousAmount = Number(bill.amount);
    saveState("Subscription review recorded");
    return render();
  }
  if (target.dataset.add) return openEditor(target.dataset.add);
  if (target.dataset.editRoutine) return openEditor("routine", target.dataset.editRoutine);
  if (target.dataset.inboxTask) return promoteInboxItem(target.dataset.inboxTask);
  if (target.hasAttribute("data-close-week")) return closeWeek();
  if (target.hasAttribute("data-add-routine-step")) {
    document.querySelector(".routine-step-list").insertAdjacentHTML("beforeend", routineStepEditor(["", "", 5], document.querySelectorAll(".routine-step-editor").length));
    renumberRoutineSteps();
    return;
  }
  if (target.hasAttribute("data-remove-routine-step")) {
    if (document.querySelectorAll(".routine-step-editor").length <= 1) return showToast("Keep at least one step");
    target.closest(".routine-step-editor").remove();
    return renumberRoutineSteps();
  }
  if (target.dataset.moveStep) {
    const row = target.closest(".routine-step-editor");
    if (target.dataset.moveStep === "up" && row.previousElementSibling) row.parentNode.insertBefore(row, row.previousElementSibling);
    if (target.dataset.moveStep === "down" && row.nextElementSibling) row.parentNode.insertBefore(row.nextElementSibling, row);
    return renumberRoutineSteps();
  }
  if (target.hasAttribute("data-disable-lock")) return disableLock();
  ["task", "inbox", "maintenance", "cue", "script", "transaction", "bill", "obligation", "investment"].forEach(type => {
    const key = `edit${type[0].toUpperCase()}${type.slice(1)}`;
    if (target.dataset[key]) openEditor(type, target.dataset[key]);
  });
  if (target.dataset.recovery) {
    state.reflection.recovery = target.dataset.recovery;
    saveState("Recovery intention saved");
    render();
  }
});

document.addEventListener("keydown", event => {
  if ((event.key !== "Enter" && event.key !== " ") || !event.target.matches("[data-edit-script]")) return;
  event.preventDefault();
  openEditor("script", event.target.dataset.editScript);
});

document.addEventListener("change", event => {
  const target = event.target;
  if (target.matches("[data-bill-frequency]")) updateBillEditorFields();
  if (target.dataset.connectionField) {
    todayState().connection[target.dataset.connectionField] = target.value.trim();
    saveState("Connection plan saved");
    return;
  }
  if (target.dataset.tomorrowTask !== undefined) {
    const daily = todayState();
    daily.tomorrowTaskId = target.value;
    daily.tomorrowReady = false;
    saveState("Tomorrow's task selected");
    return render();
  }
  if (target.dataset.weekField) state.week[target.dataset.weekField] = target.value.trim();
  if (target.dataset.dailyField) todayState()[target.dataset.dailyField] = target.value.trim();
  if (target.dataset.balance) state.finances.balances[target.dataset.balance] = Number(target.value);
  if (target.dataset.reflection) state.reflection[target.dataset.reflection] = target.value.trim();
  if (target.dataset.lifeField) state.life[target.dataset.lifeField] = target.value.trim();
  if (target.dataset.monthlyField) monthlyState()[target.dataset.monthlyField] = target.value.trim();
  if (target.dataset.rating !== undefined) state.reflection.ratings[Number(target.dataset.rating)] = Number(target.value);
  if (target.matches("[data-week-field],[data-daily-field],[data-balance],[data-reflection],[data-life-field],[data-monthly-field],[data-rating]")) {
    saveState("Saved");
    if (target.dataset.rating !== undefined || target.dataset.balance) render();
  }
});

document.addEventListener("input", event => {
  if (event.target.matches("[data-auto-resize]")) resizeOutcomeInput(event.target);
  if (event.target.dataset.rating !== undefined) {
    state.reflection.ratings[Number(event.target.dataset.rating)] = Number(event.target.value);
    event.target.closest(".rating-control").querySelector("span").textContent = `${event.target.value}/5`;
  }
});

document.getElementById("editor-form").addEventListener("submit", async event => {
  event.preventDefault();
  if (event.submitter?.value === "cancel") return document.getElementById("editor-dialog").close();
  try {
    const saved = await saveEditor();
    if (saved) document.getElementById("editor-dialog").close();
  } catch {
    showToast("That action could not be completed");
  }
});

document.getElementById("delete-item").addEventListener("click", deleteEditor);
document.getElementById("quick-capture").addEventListener("click", () => openEditor("inbox"));
document.getElementById("open-settings").addEventListener("click", openSettings);
document.getElementById("edit-routines").addEventListener("click", () => { document.getElementById("settings-dialog").close(); goToView("architecture"); });
document.getElementById("reminder-settings").addEventListener("click", () => { document.getElementById("settings-dialog").close(); openEditor("reminders"); });
document.getElementById("security-settings").addEventListener("click", () => { document.getElementById("settings-dialog").close(); openEditor("security"); });
document.getElementById("create-handoff").addEventListener("click", () => { document.getElementById("settings-dialog").close(); openEditor("handoff"); });
document.getElementById("export-data").addEventListener("click", exportBackup);
document.getElementById("import-data").addEventListener("change", async event => {
  try {
    await importBackupFile(event.target.files[0]);
    document.getElementById("settings-dialog").close();
  } catch {
    showToast("That backup could not be read");
  }
  event.target.value = "";
});
document.getElementById("import-handoff").addEventListener("change", async event => {
  try {
    const envelope = JSON.parse(await event.target.files[0].text());
    if (envelope.kind !== "50x-handoff") throw new Error();
    document.getElementById("settings-dialog").close();
    openEditor("handoffImport", envelope);
  } catch {
    showToast("That secure handoff could not be read");
  }
  event.target.value = "";
});
document.getElementById("reset-data").addEventListener("click", () => {
  if (!confirm("Reset 50X Life OS and replace all current data? Export a backup first if you may want it later.")) return;
  state = defaultState();
  saveState("Fresh 50X system created");
  render();
  document.getElementById("settings-dialog").close();
});

document.getElementById("unlock-form").addEventListener("submit", async event => {
  event.preventDefault();
  const pin = document.getElementById("unlock-pin").value;
  if (await verifyPin(pin)) return hideLock();
  document.getElementById("lock-error").textContent = "That PIN is incorrect.";
  document.getElementById("unlock-pin").select();
});
document.getElementById("device-unlock").addEventListener("click", unlockWithDevice);

["pointerdown", "keydown", "touchstart"].forEach(name => document.addEventListener(name, () => {
  if (appUnlocked) scheduleAutoLock();
}, { passive: true }));

document.addEventListener("visibilitychange", () => {
  if (document.hidden) hiddenAt = Date.now();
  else if (security.pinHash && hiddenAt && Date.now() - hiddenAt >= Math.max(1, Number(security.lockMinutes) || 5) * 60000) showLock();
});

async function initialise() {
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    try { await navigator.serviceWorker.register("service-worker.js"); } catch {}
  }
  render();
  startReminderChecks();
  if (security.pinHash) showLock();
  else processPendingHandoff();
}

initialise();
