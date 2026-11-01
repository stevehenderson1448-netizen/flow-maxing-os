const STORAGE_KEY = "flow-maxing-os-v1";
const SECURITY_KEY = "50x-life-os-security-v1";
const CLOUD_SYNC_KEY = "50x-life-os-cloud-sync-v1";
const MIGRATION_BACKUP_KEY = "50x-life-os-pre-v8-backup";
const LATEST_MIGRATION_BACKUP_KEY = "50x-life-os-pre-v11-backup";
const PRE_RESTORE_BACKUP_KEY = "50x-life-os-before-snapshot-restore";
const CURRENT_STATE_VERSION = 11;
const LIVE_URL = "https://stevehenderson1448-netizen.github.io/flow-maxing-os/";
const SYNC_RELAY = "https://mantledb.sh/v2";
const SYNC_PATH = "life-os";

const DEFAULT_MODES = {
  minimum: { label: "Minimum", note: "An intentionally smaller day. Preserve the foundations and one essential action.", routine: [["Water + daylight", "When I leave the bed, I open the curtains.", 2, "Stand by the window and take three slow breaths."], ["Breathe or meditate", "After drinking water, I sit in the prepared space.", 2, "Take three deliberate breaths where I am."], ["Eat properly", "When I enter the kitchen, I prepare something simple.", 10, "Eat the easiest available nourishing option."], ["One essential action", "After the foundations, I open the prepared next action.", 25, "Work on the first visible step for five minutes."], ["Prepare for sleep", "When I plug in my phone, I begin shutting down.", 10, "Dim the room and put the phone away."]] },
  standard: { label: "Standard", note: "Your sustainable day: foundations, one deep-work block, movement, and a clean shutdown.", routine: [["Water + daylight", "When I leave the bed, I drink water and open the curtains.", 5, "Stand by the window and drink a few sips."], ["Breathwork", "After water, I sit in the prepared breathing space.", 5, "Take three slow breaths."], ["Meditation", "When breathwork ends, I start the meditation timer.", 10, "Sit quietly for two minutes."], ["Read", "After breakfast, I open the book already placed nearby.", 15, "Read one page."], ["Focused work", "When I sit at the prepared desk, I open the selected file.", 90, "Work on the first visible action for ten minutes."], ["Movement", "When the main work block ends, I put on prepared exercise clothes.", 30, "Walk outside for ten minutes."], ["Evening reflection", "When I plug in my phone, I choose tomorrow's outcome.", 5, "Write one sentence naming tomorrow's first action."]] },
  peak: { label: "Peak", note: "Use naturally high energy for worthwhile work without borrowing from tomorrow.", routine: [["Morning foundations", "After waking, I begin the prepared water, light, breathing and food sequence.", 30, "Complete water, daylight and two minutes of breathing."], ["Read", "After breakfast, I open the prepared book.", 15, "Read one page and capture one line."], ["Deep work one", "When I sit at the clear desk, I open the highest-value prepared task.", 100, "Work on its first visible action for ten minutes."], ["Proper break", "When the first block ends, I leave the desk to eat and move.", 30, "Drink water and walk for five minutes."], ["Deep work two", "After the proper break, I continue only if capacity remains.", 75, "Capture the next action instead of forcing another block."], ["Movement", "When focused work closes, I change into prepared exercise clothes.", 40, "Walk outside for ten minutes."], ["Evening shutdown", "When I plug in my phone, I close work and prepare tomorrow.", 10, "Close the laptop and write tomorrow's outcome."]] }
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

function toMinor(value) {
  return Math.round((Number(value) || 0) * 100);
}

function fromMinor(value) {
  return Math.round(Number(value) || 0) / 100;
}

function minorValue(item, minorKey, majorKey) {
  return Number.isInteger(item?.[minorKey]) ? item[minorKey] : toMinor(item?.[majorKey]);
}

function weekStartKey(date = new Date()) {
  const result = new Date(date);
  const day = result.getDay() || 7;
  result.setHours(12, 0, 0, 0);
  result.setDate(result.getDate() - day + 1);
  return dayKey(result);
}

const defaultState = () => ({
  version: CURRENT_STATE_VERSION,
  week: { startedAt: weekStartKey(), outcome: "Create consistent movement in the business", secondary: "Protect health, clarity, and recovery while executing", evidence: "Complete one meaningful business deliverable and identify the next milestone.", why: "Build proof that focused mornings compound into real momentum." },
  tasks: [
    { id: crypto.randomUUID(), name: "Define this week's business needle-mover", impact: 3, complexity: 2, energy: "high", duration: 30, dueDate: "", alignment: "primary", ...TASK_SETUP_DEFAULTS["Define this week's business needle-mover"], createdAt: new Date().toISOString(), done: false },
    { id: crypto.randomUUID(), name: "Complete one focused business work block", impact: 3, complexity: 3, energy: "high", duration: 90, dueDate: "", alignment: "primary", ...TASK_SETUP_DEFAULTS["Complete one focused business work block"], createdAt: new Date().toISOString(), done: false },
    { id: crypto.randomUUID(), name: "Capture decisions and the next visible action", impact: 2, complexity: 1, energy: "low", duration: 15, dueDate: "", alignment: "supporting", ...TASK_SETUP_DEFAULTS["Capture decisions and the next visible action"], createdAt: new Date().toISOString(), done: false }
  ],
  goals: [],
  projects: [],
  milestones: [],
  projectDecisions: [],
  projectBlockers: [],
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
  finances: {
    balances: { personal: 0, business: 0, held: 0 }, balancesMinor: { personal: 0, business: 0, held: 0 },
    settings: { reserveTarget: 500, reserveTargetMinor: 50000, enjoymentAllowance: 0, enjoymentAllowanceMinor: 0 },
    transactions: [],
    transfers: [],
    bills: [
      { id: crypto.randomUUID(), name: "Rent", amount: 300, amountMinor: 30000, frequency: "monthly", dueDay: 1, dueMonth: 1, dueDate: "", dueConfirmed: false, kind: "essential", autopay: false, account: "personal", remindDays: 5, createdAt: new Date().toISOString(), paidPeriods: [], previousAmount: 0, amountChangedAt: "", lastReviewed: "" },
      { id: crypto.randomUUID(), name: "Business AI development tools", amount: 125, amountMinor: 12500, frequency: "monthly", dueDay: 1, dueMonth: 1, dueDate: "", dueConfirmed: false, kind: "essential", autopay: false, account: "business", remindDays: 3, createdAt: new Date().toISOString(), paidPeriods: [], previousAmount: 0, amountChangedAt: "", lastReviewed: "" },
      { id: crypto.randomUUID(), name: "Phone", amount: 65, amountMinor: 6500, frequency: "monthly", dueDay: 1, dueMonth: 1, dueDate: "", dueConfirmed: false, kind: "essential", autopay: false, account: "personal", remindDays: 3, createdAt: new Date().toISOString(), paidPeriods: [], previousAmount: 0, amountChangedAt: "", lastReviewed: "" },
      { id: crypto.randomUUID(), name: "Credit card minimum", amount: 20, amountMinor: 2000, frequency: "monthly", dueDay: 1, dueMonth: 1, dueDate: "", dueConfirmed: false, kind: "essential", autopay: false, account: "personal", remindDays: 5, createdAt: new Date().toISOString(), paidPeriods: [], previousAmount: 0, amountChangedAt: "", lastReviewed: "" }
    ],
    obligations: [{ id: crypto.randomUUID(), name: "Personal repayment obligation", target: 3000, targetMinor: 300000, paid: 0, paidMinor: 0, monthlyPayment: 0, monthlyPaymentMinor: 0 }],
    investments: [],
    budgets: [
      { id: crypto.randomUUID(), name: "Food", category: "Food", account: "personal", amount: 100, amountMinor: 10000, month: monthKey(), recurring: true, protect: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: crypto.randomUUID(), name: "Transport", category: "Transport", account: "personal", amount: 100, amountMinor: 10000, month: monthKey(), recurring: true, protect: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ],
    incomeForecasts: [], savingsGoals: [], plannedPurchases: [], reconciliations: [], incomeAllocations: [], archivedBills: []
  },
  maintenance: [],
  daily: {},
  reflection: { win: "", friction: "", lesson: "", next: "", recovery: "maintain", ratings: [3, 3, 3, 3, 3] },
  life: {
    relationships: "", enjoyment: "", health: "", growth: "",
    identity: { principles: "", vision: "", boundaries: "", commitments: "", patterns: "" },
    contacts: [],
    experiences: [],
    care: { appearance: "", interests: "", selfCare: "" },
    faith: { prayer: "", reading: "", reflection: "" },
    journal: []
  },
  monthly: {},
  assistant: { recommendations: [], approvedChanges: [] },
  preferences: { reminders: { enabled: false, morning: "08:00", evening: "21:00", weeklyDay: "0", weeklyTime: "18:00", lastFired: {} }, assistant: { provider: "local", shareFinancial: true, shareLife: false, shareJournal: false } },
  sync: { lastHandoff: null, inboxTombstones: {} }
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
        ? [String(step[0] || "Routine step"), String(step[1] || "Begin with the smallest version."), Math.max(1, Number(step[2]) || 5), String(step[3] || "Do the smallest useful version.")]
        : [String(step.name || "Routine step"), String(step.cue || "Begin with the smallest version."), Math.max(1, Number(step.duration) || 5), String(step.fallback || "Do the smallest useful version.")]);
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
    projectId: String(item.projectId || ""),
    goalId: String(item.goalId || ""),
    dependencyIds: Array.isArray(item.dependencyIds) ? item.dependencyIds.map(String) : [],
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
    amount: Math.max(0, Number(item.amount) || fromMinor(item.amountMinor)),
    amountMinor: Math.max(0, minorValue(item, "amountMinor", "amount")),
    frequency: ["monthly", "annual", "oneoff"].includes(item.frequency) ? item.frequency : "monthly",
    dueDay: Math.min(31, Math.max(1, Number(item.dueDay) || today.getDate())),
    dueMonth: Math.min(12, Math.max(1, Number(item.dueMonth) || today.getMonth() + 1)),
    dueDate: String(item.dueDate || ""),
    dueConfirmed: Boolean(item.dueConfirmed),
    kind: ["essential", "subscription", "flexible"].includes(item.kind) ? item.kind : "essential",
    autopay: Boolean(item.autopay),
    account: ["personal", "business"].includes(item.account) ? item.account : "personal",
    remindDays: Math.min(30, Math.max(0, Number(item.remindDays ?? 3))),
    createdAt: item.createdAt || new Date().toISOString(),
    paidPeriods: Array.isArray(item.paidPeriods) ? [...new Set(item.paidPeriods.map(String))] : [],
    previousAmount: Math.max(0, Number(item.previousAmount) || fromMinor(item.previousAmountMinor)),
    previousAmountMinor: Math.max(0, minorValue(item, "previousAmountMinor", "previousAmount")),
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

function normalizeLife(inputLife, fallback) {
  const source = inputLife && typeof inputLife === "object" ? inputLife : {};
  const contacts = Array.isArray(source.contacts) ? source.contacts.map(item => ({
    id: item.id || crypto.randomUUID(),
    name: String(item.name || "Someone important"),
    relationship: String(item.relationship || ""),
    intention: String(item.intention || ""),
    nextContactDate: String(item.nextContactDate || ""),
    lastConnected: String(item.lastConnected || ""),
    notes: String(item.notes || ""),
    status: ["active", "paused", "archived"].includes(item.status) ? item.status : "active",
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || item.createdAt || new Date().toISOString()
  })) : [];
  const experiences = Array.isArray(source.experiences) ? source.experiences.map(item => ({
    id: item.id || crypto.randomUUID(),
    name: String(item.name || "Meaningful experience"),
    category: ["social", "outing", "travel", "hobby", "celebration", "personal"].includes(item.category) ? item.category : "personal",
    targetDate: String(item.targetDate || ""),
    costEstimate: Math.max(0, Number(item.costEstimate) || fromMinor(item.costEstimateMinor)),
    costEstimateMinor: Math.max(0, minorValue(item, "costEstimateMinor", "costEstimate")),
    status: ["idea", "planned", "completed", "archived"].includes(item.status) ? item.status : "idea",
    notes: String(item.notes || ""),
    completedAt: String(item.completedAt || ""),
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || item.createdAt || new Date().toISOString()
  })) : [];
  const journal = Array.isArray(source.journal) ? source.journal.map(item => ({
    id: item.id || crypto.randomUUID(),
    date: String(item.date || dayKey()),
    type: ["reflection", "faith", "gratitude", "pattern", "memory"].includes(item.type) ? item.type : "reflection",
    content: String(item.content || ""),
    private: item.private !== false,
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || item.createdAt || new Date().toISOString()
  })) : [];
  return {
    ...fallback,
    ...source,
    identity: { ...fallback.identity, ...(source.identity || {}) },
    contacts,
    experiences,
    care: { ...fallback.care, ...(source.care || {}) },
    faith: { ...fallback.faith, ...(source.faith || {}) },
    journal
  };
}

function normalizeGoals(items) {
  if (!Array.isArray(items)) return [];
  return items.map(item => ({
    id: item.id || crypto.randomUUID(),
    name: String(item.name || "Meaningful goal"),
    area: ["business", "money", "education", "life", "health", "faith", "creative"].includes(item.area) ? item.area : "life",
    horizon: ["month", "quarter", "year", "longterm"].includes(item.horizon) ? item.horizon : "quarter",
    targetDate: String(item.targetDate || ""),
    why: String(item.why || ""),
    evidence: String(item.evidence || ""),
    status: ["active", "paused", "completed", "archived"].includes(item.status) ? item.status : "active",
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || item.createdAt || new Date().toISOString()
  }));
}

function normalizeProjects(items) {
  if (!Array.isArray(items)) return [];
  return items.map(item => ({
    id: item.id || crypto.randomUUID(),
    name: String(item.name || "Project"),
    category: ["business", "software", "education", "creative", "personal"].includes(item.category) ? item.category : "personal",
    goalId: String(item.goalId || ""),
    outcome: String(item.outcome || ""),
    nextReviewDate: String(item.nextReviewDate || ""),
    priority: Math.min(3, Math.max(1, Number(item.priority) || 2)),
    status: ["active", "paused", "completed", "archived"].includes(item.status) ? item.status : "active",
    notes: String(item.notes || ""),
    links: Array.isArray(item.links) ? item.links.map(link => ({ label: String(link.label || "Link"), url: String(link.url || "") })).filter(link => link.url) : [],
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || item.createdAt || new Date().toISOString()
  }));
}

function normalizeMilestones(items) {
  if (!Array.isArray(items)) return [];
  return items.map(item => ({
    id: item.id || crypto.randomUUID(),
    projectId: String(item.projectId || ""),
    name: String(item.name || "Milestone"),
    dueDate: String(item.dueDate || ""),
    status: ["open", "completed"].includes(item.status) ? item.status : "open",
    createdAt: item.createdAt || new Date().toISOString(),
    completedAt: String(item.completedAt || "")
  }));
}

function normalizeProjectRecords(items, type) {
  if (!Array.isArray(items)) return [];
  return items.map(item => ({
    id: item.id || crypto.randomUUID(),
    projectId: String(item.projectId || ""),
    text: String(item.text || ""),
    reason: String(item.reason || ""),
    status: type === "blocker" && ["open", "resolved"].includes(item.status) ? item.status : type === "decision" ? "recorded" : "open",
    createdAt: item.createdAt || new Date().toISOString(),
    resolvedAt: String(item.resolvedAt || "")
  }));
}

function normalizeTransactions(items) {
  if (!Array.isArray(items)) return [];
  return items.map(item => ({
    ...item,
    id: item.id || crypto.randomUUID(),
    type: item.type === "income" ? "income" : "expense",
    account: ["personal", "business", "held"].includes(item.account) ? item.account : "personal",
    amount: Math.max(0, Number(item.amount) || fromMinor(item.amountMinor)),
    amountMinor: Math.max(0, minorValue(item, "amountMinor", "amount")),
    budgetId: String(item.budgetId || ""),
    forecastId: String(item.forecastId || ""),
    reconciliationId: String(item.reconciliationId || ""),
    createdAt: item.createdAt || new Date().toISOString()
  }));
}

function normalizeBudgets(items) {
  if (!Array.isArray(items)) return [];
  return items.map(item => ({ id: item.id || crypto.randomUUID(), name: String(item.name || "Budget line"), category: String(item.category || "Other"), account: ["personal", "business"].includes(item.account) ? item.account : "personal", amount: Math.max(0, Number(item.amount) || fromMinor(item.amountMinor)), amountMinor: Math.max(0, minorValue(item, "amountMinor", "amount")), month: String(item.month || monthKey()), recurring: Boolean(item.recurring), protect: Boolean(item.protect), migratedFromBillId: String(item.migratedFromBillId || ""), createdAt: item.createdAt || new Date().toISOString(), updatedAt: item.updatedAt || item.createdAt || new Date().toISOString() }));
}

function normalizeTransfers(items) {
  if (!Array.isArray(items)) return [];
  return items.map(item => ({
    id: item.id || crypto.randomUUID(),
    fromAccount: ["personal", "business", "held"].includes(item.fromAccount) ? item.fromAccount : "personal",
    toAccount: ["personal", "business", "held"].includes(item.toAccount) ? item.toAccount : "business",
    amount: Math.max(0, Number(item.amount) || fromMinor(item.amountMinor)),
    amountMinor: Math.max(0, minorValue(item, "amountMinor", "amount")),
    date: String(item.date || dayKey()),
    note: String(item.note || "Account transfer"),
    allocationId: String(item.allocationId || ""),
    createdAt: item.createdAt || new Date().toISOString()
  })).filter(item => item.fromAccount !== item.toAccount && item.amountMinor > 0);
}

function normalizeReconciliations(items) {
  if (!Array.isArray(items)) return [];
  return items.map(item => ({
    id: item.id || crypto.randomUUID(),
    date: String(item.date || dayKey()),
    recordedMinor: { personal: Number(item.recordedMinor?.personal) || 0, business: Number(item.recordedMinor?.business) || 0, held: Number(item.recordedMinor?.held) || 0 },
    actualMinor: { personal: Number(item.actualMinor?.personal) || 0, business: Number(item.actualMinor?.business) || 0, held: Number(item.actualMinor?.held) || 0 },
    differencesMinor: { personal: Number(item.differencesMinor?.personal) || 0, business: Number(item.differencesMinor?.business) || 0, held: Number(item.differencesMinor?.held) || 0 },
    applied: Boolean(item.applied),
    adjustmentIds: Array.isArray(item.adjustmentIds) ? item.adjustmentIds.map(String) : [],
    notes: String(item.notes || ""),
    createdAt: item.createdAt || new Date().toISOString()
  }));
}

function normalizeIncomeAllocations(items) {
  if (!Array.isArray(items)) return [];
  return items.map(item => ({
    id: item.id || crypto.randomUUID(),
    incomeId: String(item.incomeId || ""),
    sourceAccount: item.sourceAccount === "business" ? "business" : "personal",
    amount: Math.max(0, Number(item.amount) || fromMinor(item.amountMinor)),
    amountMinor: Math.max(0, minorValue(item, "amountMinor", "amount")),
    essentialsMinor: Math.max(0, Number(item.essentialsMinor) || 0),
    reserveMinor: Math.max(0, Number(item.reserveMinor) || 0),
    repaymentsMinor: Math.max(0, Number(item.repaymentsMinor) || 0),
    businessMinor: Math.max(0, Number(item.businessMinor) || 0),
    personalMinor: Math.max(0, Number(item.personalMinor) || 0),
    status: item.status === "released" ? "released" : "active",
    transferId: String(item.transferId || ""),
    createdAt: item.createdAt || new Date().toISOString(),
    releasedAt: String(item.releasedAt || "")
  }));
}

function migrateFinancialCollections(finances, inputVersion, fallback) {
  const sourceBills = Array.isArray(finances?.bills) ? finances.bills : Array.isArray(finances?.commitments) ? finances.commitments : fallback.bills;
  const sourceBudgets = Array.isArray(finances?.budgets) ? finances.budgets : [];
  const archivedBills = Array.isArray(finances?.archivedBills) ? [...finances.archivedBills] : [];
  if (inputVersion >= 11) return { bills: sourceBills, budgets: sourceBudgets, archivedBills };
  const bills = [];
  const budgets = [...sourceBudgets];
  sourceBills.forEach(item => {
    const name = String(item.name || "").trim().toLowerCase();
    if (!["food", "transport"].includes(name)) {
      bills.push(item);
      return;
    }
    if (!budgets.some(budget => String(budget.name || "").trim().toLowerCase() === name)) {
      budgets.push({
        id: crypto.randomUUID(),
        name: name === "food" ? "Food" : "Transport",
        category: name === "food" ? "Food" : "Transport",
        account: "personal",
        amount: Math.max(0, Number(item.amount) || fromMinor(item.amountMinor)),
        amountMinor: Math.max(0, minorValue(item, "amountMinor", "amount")),
        month: monthKey(),
        recurring: true,
        protect: true,
        migratedFromBillId: String(item.id || ""),
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    archivedBills.push({ ...item, archivedAt: new Date().toISOString(), archivedReason: "Converted to a recurring spending budget in version 11" });
  });
  return { bills, budgets, archivedBills };
}

function normalizeIncomeForecasts(items) {
  if (!Array.isArray(items)) return [];
  return items.map(item => ({ id: item.id || crypto.randomUUID(), source: String(item.source || "Expected income"), amount: Math.max(0, Number(item.amount) || fromMinor(item.amountMinor)), amountMinor: Math.max(0, minorValue(item, "amountMinor", "amount")), expectedDate: String(item.expectedDate || ""), status: ["expected", "confirmed", "received", "cancelled"].includes(item.status) ? item.status : "expected", account: ["personal", "business"].includes(item.account) ? item.account : "personal", notes: String(item.notes || ""), createdAt: item.createdAt || new Date().toISOString(), receivedAt: String(item.receivedAt || "") }));
}

function normalizeSavingsGoals(items) {
  if (!Array.isArray(items)) return [];
  return items.map(item => ({ id: item.id || crypto.randomUUID(), name: String(item.name || "Savings goal"), target: Math.max(0, Number(item.target) || fromMinor(item.targetMinor)), targetMinor: Math.max(0, minorValue(item, "targetMinor", "target")), saved: Math.max(0, Number(item.saved) || fromMinor(item.savedMinor)), savedMinor: Math.max(0, minorValue(item, "savedMinor", "saved")), deadline: String(item.deadline || ""), status: ["active", "completed", "paused"].includes(item.status) ? item.status : "active", createdAt: item.createdAt || new Date().toISOString() }));
}

function normalizeInbox(items) {
  if (!Array.isArray(items)) return [];
  return items.filter(item => item && typeof item === "object").map(item => ({
    id: item.id || crypto.randomUUID(),
    text: String(item.text || ""),
    type: ["idea", "task", "concern", "later"].includes(item.type) ? item.type : "idea",
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || item.createdAt || new Date().toISOString()
  })).filter(item => item.text);
}

function normalizePlannedPurchases(items) {
  if (!Array.isArray(items)) return [];
  return items.map(item => ({
    id: item.id || crypto.randomUUID(),
    name: String(item.name || "Planned purchase"),
    url: safeExternalURL(item.url) || "",
    amount: Math.max(0, Number(item.amount) || fromMinor(item.amountMinor)),
    amountMinor: Math.max(0, minorValue(item, "amountMinor", "amount")),
    category: ["essential", "useful", "enjoyment", "business", "personal"].includes(item.category) ? item.category : "useful",
    account: ["personal", "business"].includes(item.account) ? item.account : "personal",
    priority: ["next", "soon", "later"].includes(item.priority) ? item.priority : "soon",
    targetDate: String(item.targetDate || ""),
    status: ["planned", "bought", "archived"].includes(item.status) ? item.status : "planned",
    reserved: Boolean(item.reserved),
    notes: String(item.notes || ""),
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || item.createdAt || new Date().toISOString(),
    boughtAt: String(item.boughtAt || "")
  }));
}

function validateState(candidate) {
  if (!candidate || typeof candidate !== "object") return false;
  if (candidate.version !== CURRENT_STATE_VERSION) return false;
  if (!candidate.week || !Array.isArray(candidate.tasks) || !Array.isArray(candidate.inbox)) return false;
  if (!candidate.finances || !Array.isArray(candidate.finances.transactions) || !Array.isArray(candidate.finances.bills)) return false;
  if (!Array.isArray(candidate.goals) || !Array.isArray(candidate.projects) || !Array.isArray(candidate.milestones)) return false;
  if (!Array.isArray(candidate.finances.budgets) || !Array.isArray(candidate.finances.incomeForecasts) || !Array.isArray(candidate.finances.savingsGoals) || !Array.isArray(candidate.finances.plannedPurchases)) return false;
  if (!Array.isArray(candidate.finances.transfers) || !Array.isArray(candidate.finances.reconciliations) || !Array.isArray(candidate.finances.incomeAllocations) || !Array.isArray(candidate.finances.archivedBills)) return false;
  if (!candidate.life || !Array.isArray(candidate.life.contacts) || !Array.isArray(candidate.life.experiences) || !Array.isArray(candidate.life.journal)) return false;
  return true;
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
  const balances = { ...base.finances.balances, ...(input.finances?.balances || {}) };
  const balancesMinor = {
    personal: Number.isInteger(input.finances?.balancesMinor?.personal) ? input.finances.balancesMinor.personal : toMinor(balances.personal),
    business: Number.isInteger(input.finances?.balancesMinor?.business) ? input.finances.balancesMinor.business : toMinor(balances.business),
    held: Number.isInteger(input.finances?.balancesMinor?.held) ? input.finances.balancesMinor.held : toMinor(balances.held)
  };
  const financeSettings = { ...base.finances.settings, ...(input.finances?.settings || {}) };
  financeSettings.reserveTargetMinor = Number.isInteger(input.finances?.settings?.reserveTargetMinor) ? input.finances.settings.reserveTargetMinor : toMinor(financeSettings.reserveTarget);
  financeSettings.enjoymentAllowanceMinor = Number.isInteger(input.finances?.settings?.enjoymentAllowanceMinor) ? input.finances.settings.enjoymentAllowanceMinor : toMinor(financeSettings.enjoymentAllowance);
  const migratedFinance = migrateFinancialCollections(input.finances, inputVersion, base.finances);
  const normalized = {
    ...base,
    ...input,
    version: CURRENT_STATE_VERSION,
    week: { ...base.week, ...(input.week || {}), startedAt: input.week?.startedAt || weekStartKey() },
    tasks: normalizeTasks(input.tasks, base.tasks),
    goals: normalizeGoals(input.goals),
    projects: normalizeProjects(input.projects),
    milestones: normalizeMilestones(input.milestones),
    projectDecisions: normalizeProjectRecords(input.projectDecisions, "decision"),
    projectBlockers: normalizeProjectRecords(input.projectBlockers, "blocker"),
    inbox: normalizeInbox(input.inbox),
    history: Array.isArray(input.history) ? input.history : [],
    modes: normalizeModes(input.modes),
    cues,
    scripts: Array.isArray(input.scripts) ? input.scripts : base.scripts,
    finances: {
      ...base.finances,
      ...(input.finances || {}),
      balances,
      balancesMinor,
      settings: financeSettings,
      transactions: normalizeTransactions(input.finances?.transactions),
      transfers: normalizeTransfers(input.finances?.transfers),
      bills: normalizeBills({ bills: migratedFinance.bills }, base.finances.bills),
      commitments: undefined,
      obligations: (Array.isArray(input.finances?.obligations) ? input.finances.obligations : base.finances.obligations).map(item => ({ ...item, id: item.id || crypto.randomUUID(), target: Math.max(0, Number(item.target) || fromMinor(item.targetMinor)), targetMinor: Math.max(0, minorValue(item, "targetMinor", "target")), paid: Math.max(0, Number(item.paid) || fromMinor(item.paidMinor)), paidMinor: Math.max(0, minorValue(item, "paidMinor", "paid")), monthlyPayment: Math.max(0, Number(item.monthlyPayment) || fromMinor(item.monthlyPaymentMinor)), monthlyPaymentMinor: Math.max(0, minorValue(item, "monthlyPaymentMinor", "monthlyPayment")) })),
      investments: (Array.isArray(input.finances?.investments) ? input.finances.investments : []).map(item => ({ ...item, id: item.id || crypto.randomUUID(), contributed: Math.max(0, Number(item.contributed) || fromMinor(item.contributedMinor)), contributedMinor: Math.max(0, minorValue(item, "contributedMinor", "contributed")), current: Math.max(0, Number(item.current) || fromMinor(item.currentMinor)), currentMinor: Math.max(0, minorValue(item, "currentMinor", "current")) })),
      budgets: normalizeBudgets(migratedFinance.budgets),
      incomeForecasts: normalizeIncomeForecasts(input.finances?.incomeForecasts),
      savingsGoals: normalizeSavingsGoals(input.finances?.savingsGoals),
      plannedPurchases: normalizePlannedPurchases(input.finances?.plannedPurchases),
      reconciliations: normalizeReconciliations(input.finances?.reconciliations),
      incomeAllocations: normalizeIncomeAllocations(input.finances?.incomeAllocations),
      archivedBills: migratedFinance.archivedBills
    },
    maintenance: normalizeMaintenance(input.maintenance),
    daily,
    reflection: { ...base.reflection, ...(input.reflection || {}), ratings: Array.isArray(input.reflection?.ratings) ? input.reflection.ratings : base.reflection.ratings },
    life: normalizeLife(input.life, base.life),
    monthly: input.monthly && typeof input.monthly === "object" ? input.monthly : {},
    assistant: { recommendations: Array.isArray(input.assistant?.recommendations) ? input.assistant.recommendations : [], approvedChanges: Array.isArray(input.assistant?.approvedChanges) ? input.assistant.approvedChanges : [] },
    preferences: { ...base.preferences, ...(input.preferences || {}), reminders: { ...base.preferences.reminders, ...(input.preferences?.reminders || {}), lastFired: input.preferences?.reminders?.lastFired || {} }, assistant: { ...base.preferences.assistant, ...(input.preferences?.assistant || {}) } },
    sync: { ...base.sync, ...(input.sync || {}), inboxTombstones: input.sync?.inboxTombstones && typeof input.sync.inboxTombstones === "object" && !Array.isArray(input.sync.inboxTombstones) ? input.sync.inboxTombstones : {} }
  };
  return validateState(normalized) ? normalized : base;
}

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const normalized = normalizeState(stored);
    const storedVersion = Number(stored?.version || 0);
    if (stored && storedVersion < CURRENT_STATE_VERSION && !localStorage.getItem(LATEST_MIGRATION_BACKUP_KEY)) {
      localStorage.setItem(LATEST_MIGRATION_BACKUP_KEY, JSON.stringify({ createdAt: new Date().toISOString(), fromVersion: storedVersion, data: stored }));
    }
    if (stored && storedVersion < 8 && !localStorage.getItem(MIGRATION_BACKUP_KEY)) {
      localStorage.setItem(MIGRATION_BACKUP_KEY, JSON.stringify({ createdAt: new Date().toISOString(), fromVersion: storedVersion, data: stored }));
    }
    if (!validateState(normalized)) throw new Error("State validation failed");
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

function loadCloudSync() {
  const base = { deviceId: crypto.randomUUID(), namespace: "", relayKey: "", encryptionKey: "", lastRevision: 0, lastChangeId: "", lastSyncedAt: "", dirty: false, dirtySections: [], conflict: false };
  try {
    return { ...base, ...JSON.parse(localStorage.getItem(CLOUD_SYNC_KEY)) };
  } catch {
    return base;
  }
}

let state = loadState();
let security = loadSecurity();
let cloudSync = loadCloudSync();
let activeView = "today";
let editor = null;
let toastTimer;
let lockTimer;
let syncTimer;
let syncDebounce;
let syncOperation;
let syncPhase = cloudSync.namespace ? (cloudSync.conflict ? "conflict" : "idle") : "off";
let appUnlocked = !security.pinHash;
let hiddenAt = 0;
let reminderTimer;
let pendingHandoff = readHandoffFromHash();
let pendingSyncPair = readSyncPairFromHash();

function saveState(message, options = {}) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (cloudSync.namespace && !options.fromSync) {
    cloudSync.dirty = true;
    const sections = Array.isArray(cloudSync.dirtySections) ? cloudSync.dirtySections : [];
    const scope = options.scope || "all";
    cloudSync.dirtySections = scope === "all" || sections.includes("all") ? ["all"] : [...new Set([...sections, scope])];
    saveCloudSync();
    scheduleCloudSync();
  }
  if (message) showToast(message);
  refreshSyncUI();
}

function saveSecurity() {
  localStorage.setItem(SECURITY_KEY, JSON.stringify(security));
  refreshSettings();
}

function saveCloudSync() {
  localStorage.setItem(CLOUD_SYNC_KEY, JSON.stringify(cloudSync));
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
  state.daily[key] = { intention: "", primaryOutcome: "", experienceIntention: "", energy: 0, clarity: 0, availableMinutes: 120, mode: "standard", routine: [], win: "", friction: "", tomorrow: "", tomorrowTaskId: "", tomorrowReady: false, ...existing, connection: { ...CONNECTION_DEFAULT, ...(existing.connection || {}) } };
  return state.daily[key];
}

function monthlyState() {
  const key = monthKey();
  state.monthly[key] = { financial: "", growth: "", business: "", lifestyle: "", adjustment: "", decisions: "", snapshot: null, ...(state.monthly[key] || {}) };
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

function safeExternalURL(value) {
  try {
    const url = new URL(String(value));
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
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
  const project = state.projects.find(item => item.id === task.projectId && item.status === "active");
  const projectPriority = project ? Number(project.priority || 2) * 2 : 0;
  const timeFit = Number(task.duration) <= Number(daily.availableMinutes || 120) ? 4 : -6;
  return taskScore(task, daily.energy || 3) + urgency + alignment + projectPriority + timeFit;
}

function taskBlocker(task) {
  return (task.dependencyIds || []).map(id => state.tasks.find(item => item.id === id)).find(item => item && !item.done) || null;
}

function rankedTasks(daily = todayState(), includeBlocked = false) {
  return state.tasks.filter(task => !task.done && (includeBlocked || !taskBlocker(task))).sort((a, b) => {
    const blockedDifference = Number(Boolean(taskBlocker(a))) - Number(Boolean(taskBlocker(b)));
    return blockedDifference || smartTaskScore(b, daily) - smartTaskScore(a, daily);
  });
}

function taskReason(task, daily = todayState()) {
  if (task.done) return "Completed this week";
  const blocker = taskBlocker(task);
  if (blocker) return `Waiting for ${blocker.name}`;
  const due = taskDueDays(task);
  if (due !== null && due < 0) return `${Math.abs(due)} day${Math.abs(due) === 1 ? "" : "s"} overdue`;
  if (due === 0) return "Due today";
  if (due !== null && due <= 3) return `Due in ${due} days`;
  if (task.alignment === "primary") return "Moves the main outcome";
  const project = state.projects.find(item => item.id === task.projectId);
  if (project) return `Next output for ${project.name}`;
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
  if (!bill.dueConfirmed) {
    return { bill, due: current.due, period: current.period, days: null, status: currentPaid ? "paid" : "verify", actionPaid: currentPaid, hasOutstanding: !currentPaid, actionPeriod: current.period, needsConfirmation: true };
  }
  const outstanding = nextOutstandingBillCycle(bill, reference);
  if (!outstanding) return { bill, due: current.due, period: current.period, days: daysFromToday(current.due, reference), status: "paid", actionPaid: true, hasOutstanding: false };
  const days = daysFromToday(outstanding.due, reference);
  const actionPaid = currentPaid && days > 0;
  const status = actionPaid ? "paid" : days < 0 ? "overdue" : days === 0 ? "today" : days <= Math.max(3, bill.remindDays) ? "soon" : "upcoming";
  return { bill, ...outstanding, days, status, actionPaid, hasOutstanding: true, actionPeriod: actionPaid ? current.period : outstanding.period };
}

function monthlyBillEquivalent(bill) {
  return fromMinor(monthlyBillEquivalentMinor(bill));
}

function monthlyBillEquivalentMinor(bill) {
  const amountMinor = minorValue(bill, "amountMinor", "amount");
  if (bill.frequency === "monthly") return amountMinor;
  if (bill.frequency === "annual") return Math.round(amountMinor / 12);
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

function relationshipOpportunity(reference = new Date()) {
  const contacts = state.life.contacts.filter(item => item.status === "active");
  if (!contacts.length) return null;
  return contacts.map(contact => {
    const days = contact.nextContactDate ? daysFromToday(dateFromKey(contact.nextContactDate), reference) : null;
    return { contact, days };
  }).sort((a, b) => {
    if (a.days === null && b.days === null) return String(a.contact.lastConnected || "").localeCompare(String(b.contact.lastConnected || ""));
    if (a.days === null) return 1;
    if (b.days === null) return -1;
    return a.days - b.days;
  })[0];
}

function experienceOpportunity(totals = moneyTotals(), reference = new Date()) {
  const available = Number(totals.enjoymentAvailable || 0);
  const experiences = state.life.experiences.filter(item => ["idea", "planned"].includes(item.status));
  if (!experiences.length) return null;
  return experiences.map(experience => ({
    experience,
    days: experience.targetDate ? daysFromToday(dateFromKey(experience.targetDate), reference) : null,
    affordable: Number(experience.costEstimate || 0) <= available
  })).sort((a, b) => Number(b.affordable) - Number(a.affordable) || (a.days ?? 9999) - (b.days ?? 9999))[0];
}

function currentBudgetItems(reference = new Date()) {
  const key = monthKey(reference);
  return state.finances.budgets.filter(item => item.recurring || item.month === key);
}

function budgetSpentAgainstMinor(budget, reference = new Date()) {
  const key = monthKey(reference);
  const labels = [budget.name, budget.category].map(value => String(value || "").trim().toLowerCase()).filter(Boolean);
  return state.finances.transactions.filter(item => {
    if (item.type !== "expense" || item.account !== budget.account || !String(item.date).startsWith(key)) return false;
    if (item.budgetId === budget.id) return true;
    return labels.includes(String(item.category || "").trim().toLowerCase());
  }).reduce((sum, item) => sum + minorValue(item, "amountMinor", "amount"), 0);
}

function budgetRemainingMinor(budget, reference = new Date()) {
  return Math.max(0, minorValue(budget, "amountMinor", "amount") - budgetSpentAgainstMinor(budget, reference));
}

function moneyTotals() {
  const totalsMinor = { ...state.finances.balancesMinor };
  state.finances.transactions.forEach(item => {
    const sign = item.type === "income" ? 1 : -1;
    totalsMinor[item.account] = (Number(totalsMinor[item.account]) || 0) + sign * minorValue(item, "amountMinor", "amount");
  });
  state.finances.transfers.forEach(item => {
    const amountMinor = minorValue(item, "amountMinor", "amount");
    totalsMinor[item.fromAccount] = (Number(totalsMinor[item.fromAccount]) || 0) - amountMinor;
    totalsMinor[item.toAccount] = (Number(totalsMinor[item.toAccount]) || 0) + amountMinor;
  });
  const reference = new Date();
  const billSchedule = state.finances.bills.map(bill => billScheduleEntry(bill, reference)).sort((a, b) => a.due - b.due);
  const protectedBillCycles = state.finances.bills.filter(bill => bill.dueConfirmed).flatMap(bill => outstandingBillCycles(bill, reference).map(cycle => ({ bill, ...cycle })));
  const unconfirmedPersonalBillsMinor = state.finances.bills.filter(item => !item.dueConfirmed && item.account !== "business").reduce((sum, item) => sum + monthlyBillEquivalentMinor(item), 0);
  const unconfirmedBusinessBillsMinor = state.finances.bills.filter(item => !item.dueConfirmed && item.account === "business").reduce((sum, item) => sum + monthlyBillEquivalentMinor(item), 0);
  const monthlyBillsMinor = state.finances.bills.reduce((sum, item) => sum + monthlyBillEquivalentMinor(item), 0);
  const personalMonthlyBillsMinor = state.finances.bills.filter(item => item.account !== "business").reduce((sum, item) => sum + monthlyBillEquivalentMinor(item), 0);
  const businessMonthlyBillsMinor = state.finances.bills.filter(item => item.account === "business").reduce((sum, item) => sum + monthlyBillEquivalentMinor(item), 0);
  const overdueBillsMinor = protectedBillCycles.filter(item => item.days < 0).reduce((sum, item) => sum + minorValue(item.bill, "amountMinor", "amount"), 0);
  const dueSoonMinor = protectedBillCycles.filter(item => item.days >= 0 && item.days <= 7).reduce((sum, item) => sum + minorValue(item.bill, "amountMinor", "amount"), 0);
  const dueThirtyMinor = protectedBillCycles.filter(item => item.days >= 0 && item.days <= 30).reduce((sum, item) => sum + minorValue(item.bill, "amountMinor", "amount"), 0);
  const personalOverdueMinor = protectedBillCycles.filter(item => item.days < 0 && item.bill.account !== "business").reduce((sum, item) => sum + minorValue(item.bill, "amountMinor", "amount"), 0);
  const businessOverdueMinor = protectedBillCycles.filter(item => item.days < 0 && item.bill.account === "business").reduce((sum, item) => sum + minorValue(item.bill, "amountMinor", "amount"), 0);
  const personalDueSoonMinor = protectedBillCycles.filter(item => item.days >= 0 && item.days <= 7 && item.bill.account !== "business").reduce((sum, item) => sum + minorValue(item.bill, "amountMinor", "amount"), 0);
  const businessDueSoonMinor = protectedBillCycles.filter(item => item.days >= 0 && item.days <= 7 && item.bill.account === "business").reduce((sum, item) => sum + minorValue(item.bill, "amountMinor", "amount"), 0);
  const personalBillsMinor = protectedBillCycles.filter(item => item.days <= 30 && item.bill.account !== "business").reduce((sum, item) => sum + minorValue(item.bill, "amountMinor", "amount"), unconfirmedPersonalBillsMinor);
  const businessBillsMinor = protectedBillCycles.filter(item => item.days <= 30 && item.bill.account === "business").reduce((sum, item) => sum + minorValue(item.bill, "amountMinor", "amount"), unconfirmedBusinessBillsMinor);
  const obligationsMinor = state.finances.obligations.reduce((sum, item) => sum + Math.max(0, minorValue(item, "targetMinor", "target") - minorValue(item, "paidMinor", "paid")), 0);
  const obligationPlanMinor = state.finances.obligations.reduce((sum, item) => sum + minorValue(item, "monthlyPaymentMinor", "monthlyPayment"), 0);
  const investmentsMinor = state.finances.investments.reduce((sum, item) => sum + minorValue(item, "currentMinor", "current"), 0);
  const currentBudgets = currentBudgetItems(reference);
  const personalBudgetProtectionMinor = currentBudgets.filter(item => item.protect && item.account !== "business").reduce((sum, item) => sum + budgetRemainingMinor(item, reference), 0);
  const businessBudgetProtectionMinor = currentBudgets.filter(item => item.protect && item.account === "business").reduce((sum, item) => sum + budgetRemainingMinor(item, reference), 0);
  const activeAllocations = state.finances.incomeAllocations.filter(item => item.status === "active");
  const allocatedEssentialsMinor = activeAllocations.reduce((sum, item) => sum + Number(item.essentialsMinor || 0), 0);
  const allocatedReserveMinor = activeAllocations.reduce((sum, item) => sum + Number(item.reserveMinor || 0), 0);
  const allocatedRepaymentsMinor = activeAllocations.reduce((sum, item) => sum + Number(item.repaymentsMinor || 0), 0);
  const reserveTargetMinor = Math.max(0, Number(state.finances.settings?.reserveTargetMinor) || toMinor(state.finances.settings?.reserveTarget));
  const plannedPurchases = state.finances.plannedPurchases.filter(item => item.status === "planned" && item.reserved);
  const personalPurchaseReserveMinor = plannedPurchases.filter(item => item.account !== "business").reduce((sum, item) => sum + minorValue(item, "amountMinor", "amount"), 0);
  const businessPurchaseReserveMinor = plannedPurchases.filter(item => item.account === "business").reduce((sum, item) => sum + minorValue(item, "amountMinor", "amount"), 0);
  const plannedPurchaseReserveMinor = personalPurchaseReserveMinor + businessPurchaseReserveMinor;
  const savingsCurrentMinor = state.finances.savingsGoals.filter(item => item.status === "active").reduce((sum, item) => sum + minorValue(item, "savedMinor", "saved"), 0);
  const personalEssentialProtectionMinor = Math.max(personalBillsMinor + personalBudgetProtectionMinor, allocatedEssentialsMinor);
  const reserveProtectionMinor = Math.max(reserveTargetMinor, savingsCurrentMinor, allocatedReserveMinor);
  const repaymentProtectionMinor = Math.max(obligationPlanMinor, allocatedRepaymentsMinor);
  const personalProtectedMinor = personalEssentialProtectionMinor + reserveProtectionMinor + repaymentProtectionMinor + personalPurchaseReserveMinor;
  const businessProtectedMinor = businessBillsMinor + businessBudgetProtectionMinor + businessPurchaseReserveMinor;
  const protectedCashMinor = personalProtectedMinor + businessProtectedMinor;
  const personalSafeMinor = Math.max(0, Number(totalsMinor.personal || 0) - personalProtectedMinor);
  const businessFreeMinor = Math.max(0, Number(totalsMinor.business || 0) - businessProtectedMinor);
  const availableMinor = Number(totalsMinor.personal || 0) + Number(totalsMinor.business || 0);
  const configuredEnjoymentMinor = Math.max(0, Number(state.finances.settings?.enjoymentAllowanceMinor) || toMinor(state.finances.settings?.enjoymentAllowance));
  const enjoymentAvailableMinor = Math.min(personalSafeMinor, configuredEnjoymentMinor);
  const subscriptions = state.finances.bills.filter(item => item.kind === "subscription");
  const subscriptionAnnualMinor = subscriptions.reduce((sum, item) => sum + (item.frequency === "monthly" ? minorValue(item, "amountMinor", "amount") * 12 : item.frequency === "annual" ? minorValue(item, "amountMinor", "amount") : 0), 0);
  const expectedIncomeMinor = state.finances.incomeForecasts.filter(item => item.status === "expected").reduce((sum, item) => sum + minorValue(item, "amountMinor", "amount"), 0);
  const confirmedIncomeMinor = state.finances.incomeForecasts.filter(item => item.status === "confirmed").reduce((sum, item) => sum + minorValue(item, "amountMinor", "amount"), 0);
  const currentBudget = currentBudgets;
  const budgetedMinor = currentBudget.reduce((sum, item) => sum + minorValue(item, "amountMinor", "amount"), 0);
  const spentThisMonthMinor = state.finances.transactions.filter(item => item.type === "expense" && String(item.date).startsWith(monthKey())).reduce((sum, item) => sum + minorValue(item, "amountMinor", "amount"), 0);
  const budgetSpentMinor = currentBudget.reduce((sum, item) => sum + budgetSpentAgainstMinor(item, reference), 0);
  const unassignedSpendingMinor = Math.max(0, spentThisMonthMinor - budgetSpentMinor);
  const savingsTargetMinor = state.finances.savingsGoals.filter(item => item.status === "active").reduce((sum, item) => sum + minorValue(item, "targetMinor", "target"), 0);
  const totals = Object.fromEntries(Object.entries(totalsMinor).map(([key, value]) => [key, fromMinor(value)]));
  return {
    ...totals,
    available: fromMinor(availableMinor), safeToSpend: fromMinor(personalSafeMinor), businessFree: fromMinor(businessFreeMinor),
    enjoymentAvailable: fromMinor(enjoymentAvailableMinor), configuredEnjoyment: fromMinor(configuredEnjoymentMinor), protectedCash: fromMinor(protectedCashMinor), personalProtected: fromMinor(personalProtectedMinor), businessProtected: fromMinor(businessProtectedMinor), reserveTarget: fromMinor(reserveTargetMinor),
    plannedPurchaseReserve: fromMinor(plannedPurchaseReserveMinor), personalPurchaseReserve: fromMinor(personalPurchaseReserveMinor), businessPurchaseReserve: fromMinor(businessPurchaseReserveMinor),
    monthlyBills: fromMinor(monthlyBillsMinor), overdueBills: fromMinor(overdueBillsMinor), personalOverdue: fromMinor(personalOverdueMinor), businessOverdue: fromMinor(businessOverdueMinor), dueSoon: fromMinor(dueSoonMinor), personalDueSoon: fromMinor(personalDueSoonMinor), businessDueSoon: fromMinor(businessDueSoonMinor), dueThirty: fromMinor(dueThirtyMinor),
    obligations: fromMinor(obligationsMinor), obligationPlan: fromMinor(obligationPlanMinor), investments: fromMinor(investmentsMinor), subscriptionAnnual: fromMinor(subscriptionAnnualMinor),
    expectedIncome: fromMinor(expectedIncomeMinor), confirmedIncome: fromMinor(confirmedIncomeMinor), budgeted: fromMinor(budgetedMinor), budgetSpent: fromMinor(budgetSpentMinor), unassignedSpending: fromMinor(unassignedSpendingMinor), spentThisMonth: fromMinor(spentThisMonthMinor),
    personalBudgetProtection: fromMinor(personalBudgetProtectionMinor), businessBudgetProtection: fromMinor(businessBudgetProtectionMinor), personalEssentialProtection: fromMinor(personalEssentialProtectionMinor), reserveProtection: fromMinor(reserveProtectionMinor), repaymentProtection: fromMinor(repaymentProtectionMinor),
    savingsTarget: fromMinor(savingsTargetMinor), savingsCurrent: fromMinor(savingsCurrentMinor), billSchedule, subscriptions,
    coverMonths: monthlyBillsMinor ? availableMinor / monthlyBillsMinor : null,
    personalCoverMonths: personalMonthlyBillsMinor ? Number(totalsMinor.personal || 0) / personalMonthlyBillsMinor : null,
    businessCoverMonths: businessMonthlyBillsMinor ? Number(totalsMinor.business || 0) / businessMonthlyBillsMinor : null,
    personalGap: fromMinor(Math.max(0, personalProtectedMinor - Number(totalsMinor.personal || 0))), businessGap: fromMinor(Math.max(0, businessProtectedMinor - Number(totalsMinor.business || 0))),
    minor: { ...totalsMinor, available: availableMinor, safeToSpend: personalSafeMinor, businessFree: businessFreeMinor, protectedCash: protectedCashMinor, personalProtected: personalProtectedMinor, businessProtected: businessProtectedMinor, personalEssentialProtection: personalEssentialProtectionMinor, reserveProtection: reserveProtectionMinor, repaymentProtection: repaymentProtectionMinor, plannedPurchaseReserve: plannedPurchaseReserveMinor, expectedIncome: expectedIncomeMinor, confirmedIncome: confirmedIncomeMinor }
  };
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
  const bill = moneyTotals().billSchedule.find(entry => entry.hasOutstanding && Number.isFinite(entry.days) && entry.days <= 3);
  const maintenance = maintenanceSchedule().find(entry => !entry.actionDone && entry.days <= 3);
  const relationship = relationshipOpportunity();
  const experience = experienceOpportunity();
  return { recovery, mode, routineMinutes, capacity, tasks, bill, maintenance, relationship, experience, plannedMinutes: capacity - remaining };
}

function weeklyCoach() {
  const metrics = weekMetrics();
  const recovery = recoverySignal();
  const routine = routineSignal();
  const recent = recentDailyRecords(7).map(([, day]) => day);
  const friction = [...recent].reverse().find(day => day.friction)?.friction || state.reflection.friction;
  const totals = moneyTotals();
  const activeProjects = state.projects.filter(item => item.status === "active");
  const openBlockers = state.projectBlockers.filter(item => item.status !== "resolved");
  const title = metrics.daysChecked < 2 ? "Build the signal" : metrics.energy && metrics.energy < 3 ? "Reduce load, preserve momentum" : metrics.routine >= 75 ? "The foundations are supporting execution" : "Simplify the system before adding effort";
  const insights = [];
  insights.push(metrics.tasksDone ? `${metrics.tasksDone} action${metrics.tasksDone === 1 ? "" : "s"} completed; protect the work that directly moved the weekly outcome.` : "No completed action is recorded yet; choose one finish line small enough to close.");
  insights.push(friction ? `Repeated friction to design around: ${friction}` : "Record friction in the evening check-in so the system can distinguish effort problems from design problems.");
  insights.push(routine.ready ? `${routine.step} is at ${routine.rate}% across ${routine.attempts} attempts. ${routine.message}` : routine.message);
  insights.push(metrics.connectionDays || metrics.restDays ? `Human connection was protected on ${metrics.connectionDays} day${metrics.connectionDays === 1 ? "" : "s"}; deliberate rest on ${metrics.restDays}. Keep both visible before adding more work.` : "No connection or protected rest is recorded yet. A sustainable week needs contact with people and time with no performance demand.");
  insights.push(`${activeProjects.length} active project${activeProjects.length === 1 ? "" : "s"} and ${openBlockers.length} open blocker${openBlockers.length === 1 ? "" : "s"}. ${openBlockers.length ? "Resolve or deliberately defer blockers before expanding scope." : "Keep the next output visible in Today."}`);
  insights.push(`Personal safe-to-spend is ${currency(totals.safeToSpend)} after recorded protection; ${currency(totals.expectedIncome + totals.confirmedIncome)} forecast income remains outside available cash.`);
  return { title, summary: recovery.note, insights };
}

function currentMonthlyEvidence() {
  const totals = moneyTotals();
  const month = monthKey();
  const transactions = state.finances.transactions.filter(item => String(item.date).startsWith(month));
  const incomeMinor = transactions.filter(item => item.type === "income").reduce((sum, item) => sum + minorValue(item, "amountMinor", "amount"), 0);
  const expenseMinor = transactions.filter(item => item.type === "expense").reduce((sum, item) => sum + minorValue(item, "amountMinor", "amount"), 0);
  return {
    capturedAt: new Date().toISOString(),
    personalCashMinor: totals.minor.personal,
    businessCashMinor: totals.minor.business,
    safeToSpendMinor: totals.minor.safeToSpend,
    expectedIncomeMinor: totals.minor.expectedIncome,
    confirmedIncomeMinor: totals.minor.confirmedIncome,
    incomeMinor,
    expenseMinor,
    obligationsMinor: toMinor(totals.obligations),
    reserveMinor: toMinor(totals.reserveTarget),
    activeProjects: state.projects.filter(item => item.status === "active").length,
    completedTasks: state.tasks.filter(item => item.done).length,
    openBlockers: state.projectBlockers.filter(item => item.status !== "resolved").length,
    connectionDays: Object.entries(state.daily).filter(([key, value]) => key.startsWith(month) && value.connection?.completed).length,
    restDays: Object.entries(state.daily).filter(([key, value]) => key.startsWith(month) && value.connection?.restCompleted).length,
    completedExperiences: state.life.experiences.filter(item => item.status === "completed" && String(item.completedAt).startsWith(month)).length
  };
}

function captureMonthlyEvidence() {
  monthlyState().snapshot = currentMonthlyEvidence();
  saveState("Monthly evidence captured");
  render();
}

function monthlyEvidenceCard() {
  const snapshot = monthlyState().snapshot;
  const evidence = snapshot || currentMonthlyEvidence();
  const netMinor = evidence.incomeMinor - evidence.expenseMinor;
  return `<article class="card monthly-evidence-card"><div class="card-head"><div><p class="eyebrow">Monthly evidence</p><h2>${snapshot ? `Captured ${formatSyncTime(snapshot.capturedAt)}` : "Live position"}</h2><p>Auditable records before interpretation.</p></div><button class="button button-secondary button-small" data-capture-month>${snapshot ? "Refresh" : "Capture"}</button></div><div class="monthly-evidence-grid"><div><span>Cash movement</span><strong class="${netMinor < 0 ? "negative" : ""}">${netMinor >= 0 ? "+" : "−"}${currency(fromMinor(Math.abs(netMinor)))}</strong><small>${currency(fromMinor(evidence.incomeMinor))} in · ${currency(fromMinor(evidence.expenseMinor))} out</small></div><div><span>Safe personal cash</span><strong>${currency(fromMinor(evidence.safeToSpendMinor))}</strong><small>Expected income excluded</small></div><div><span>Project movement</span><strong>${evidence.completedTasks} actions</strong><small>${evidence.activeProjects} active · ${evidence.openBlockers} blocked</small></div><div><span>Life participation</span><strong>${evidence.connectionDays} connections</strong><small>${evidence.restDays} rest days · ${evidence.completedExperiences} experiences</small></div></div></article>`;
}

function assistantRecommendation(kind) {
  const daily = todayState();
  const permissions = state.preferences.assistant;
  const totals = permissions.shareFinancial ? moneyTotals() : null;
  const openProjects = state.projects.filter(item => item.status === "active");
  const blockers = state.projectBlockers.filter(item => item.status !== "resolved");
  const maintenanceDue = maintenanceSchedule().filter(item => !item.actionDone && item.days <= 7);
  const nextBill = totals?.billSchedule.find(item => item.hasOutstanding);
  const topTask = rankedTasks(daily)[0];
  const relationship = permissions.shareLife ? relationshipOpportunity() : null;
  const facts = [
    `${state.modes[daily.mode]?.label || "Standard"} mode is manually selected${daily.energy ? ` with energy ${daily.energy}/5` : " without an energy check-in"}.`,
    topTask ? `The highest-ranked open action is “${topTask.name}” (${topTask.duration} minutes).` : "There are no open actions.",
    totals ? `Personal safe-to-spend is ${currency(totals.safeToSpend)}; business cash remains separate.` : "Financial records were not read because financial assistant access is off.",
    totals ? (nextBill ? `${nextBill.bill.name} is the next outstanding bill (${currency(nextBill.bill.amount)}, ${billDueLabel(nextBill).toLowerCase()}).` : "No outstanding bill cycle is visible.") : "Bill records were not read because financial assistant access is off.",
    `${openProjects.length} active project${openProjects.length === 1 ? "" : "s"}, ${blockers.length} open blocker${blockers.length === 1 ? "" : "s"}, and ${maintenanceDue.length} maintenance item${maintenanceDue.length === 1 ? "" : "s"} due within seven days.`,
    permissions.shareLife ? (relationship ? `${relationship.contact.name} is the clearest voluntary reconnection opportunity.` : "No relationship reminder is currently due.") : "Relationship reminders were not read because Life assistant access is off."
  ];
  const base = { id: crypto.randomUUID(), kind, createdAt: new Date().toISOString(), facts, assumptions: [], suggestions: [], proposal: null };
  if (kind === "day") {
    base.title = "A balanced plan for today";
    base.assumptions = ["Your available-time and energy check-ins are current.", "Deadlines and balances recorded in the app reflect reality."];
    base.suggestions = [topTask ? `Build: finish the smallest complete version of “${topTask.name}”.` : "Build: define one next visible action before adding more plans.", nextBill ? `Maintain: address ${nextBill.bill.name} before it becomes avoidable friction.` : maintenanceDue[0] ? `Maintain: handle ${maintenanceDue[0].item.name}.` : "Maintain: keep the selected routine foundations.", relationship ? `Experience: make one genuine point of contact with ${relationship.contact.name}.` : "Experience: protect rest, enjoyment, or one human interaction."];
    if (topTask && daily.primaryOutcome !== topTask.name) base.proposal = { type: "dailyPrimary", value: topTask.name, label: "Use this as today’s outcome" };
  } else if (kind === "finances") {
    if (!totals) {
      base.title = "Financial access is off";
      base.assumptions = ["No financial record was read for this review."];
      base.suggestions = ["Enable financial summaries in Assistant privacy if you want a local review.", "You can still use the Money module without the assistant."];
      state.assistant.recommendations.unshift(base);
      state.assistant.recommendations = state.assistant.recommendations.slice(0, 20);
      saveState("Assistant review created");
      return base;
    }
    const protectionGap = Math.max(0, totals.personalProtected - totals.personal);
    base.title = protectionGap ? "Personal cash needs protection" : "Your financial categories are clear";
    base.assumptions = ["All recent cash movements have been entered in the ledger.", "Expected income and investments are not available cash until recorded as received."];
    base.suggestions = [protectionGap ? `Close a ${currency(protectionGap)} personal protection gap before increasing flexible spending.` : `${currency(totals.safeToSpend)} is currently flexible after recorded personal protection.`, `${currency(totals.expectedIncome)} expected and ${currency(totals.confirmedIncome)} confirmed income remain outside available cash.`, totals.obligationPlan ? `${currency(totals.obligationPlan)} is planned toward liabilities this month.` : "Set a realistic repayment amount when the cash-flow evidence is clear."];
  } else if (kind === "week") {
    const leadingProject = [...openProjects].sort((a, b) => b.priority - a.priority)[0];
    base.title = "Protect one weekly output";
    base.assumptions = ["Active project priorities are current.", "A completed output matters more than filling the week with activity."];
    base.suggestions = [leadingProject ? `Make “${leadingProject.outcome || leadingProject.name}” the clearest project output.` : "Create a project only if the weekly outcome needs several coordinated actions.", blockers.length ? `Resolve or explicitly defer ${blockers.length} blocker${blockers.length === 1 ? "" : "s"} before expanding scope.` : "No recorded blocker needs escalation.", "Keep supporting actions to the minimum needed to move the output."];
    if (!state.week.outcome.trim() && leadingProject) base.proposal = { type: "weekOutcome", value: leadingProject.outcome || leadingProject.name, label: "Use as weekly outcome" };
  } else if (kind === "balance") {
    const suggested = suggestedMode(daily.energy || 3);
    base.title = "Build without sacrificing the human day";
    base.assumptions = ["Energy is a self-report, not a diagnosis.", "Connection and rest remain valid even when work is incomplete."];
    base.suggestions = [`Keep ${state.modes[suggested].label} mode as an option, not an automatic decision.`, relationship ? `A short contact with ${relationship.contact.name} can satisfy today’s connection intention.` : "Choose one low-friction human interaction today.", "Protect a period with no work, optimisation, admin, or guilt."];
    if (daily.energy && daily.mode !== suggested) base.proposal = { type: "mode", value: suggested, label: `Switch to ${state.modes[suggested].label} mode` };
  } else if (kind === "responsibilities") {
    base.title = maintenanceDue.length || nextBill || blockers.length ? "A few responsibilities need visibility" : "No urgent responsibility is hidden";
    base.assumptions = ["Only responsibilities recorded here can be checked.", "An absence of records is not proof that no external obligation exists."];
    base.suggestions = [nextBill ? `Check ${nextBill.bill.name}: ${billDueLabel(nextBill)}.` : "Bill calendar shows no outstanding cycle.", maintenanceDue.length ? `${maintenanceDue.length} life-maintenance item${maintenanceDue.length === 1 ? " is" : "s are"} due within seven days.` : "No life-maintenance date is due within seven days.", blockers.length ? `${blockers.length} project blocker${blockers.length === 1 ? " needs" : "s need"} a decision.` : "No project blocker is open."];
  } else {
    const signal = routineSignal();
    base.title = "Make the system easier to operate";
    base.assumptions = ["Repeated misses are design evidence, not a character judgement.", "Removing a step can be more intelligent than adding effort."];
    base.suggestions = [signal.ready ? `${signal.step} is the clearest routine signal: ${signal.message}` : signal.message, "Keep one cue, one visible response, and one prepared environment for the behaviour that matters most.", "Archive goals, projects, and tasks that no longer change a real decision."];
  }
  state.assistant.recommendations.unshift(base);
  state.assistant.recommendations = state.assistant.recommendations.slice(0, 20);
  saveState("Assistant review created");
  return base;
}

function assistantRecommendationCard(item) {
  const change = state.assistant.approvedChanges.find(entry => entry.recommendationId === item.id && !entry.reversedAt);
  return `<article class="assistant-result"><div class="assistant-result-head"><div><small>${escapeHTML(item.kind)} review · ${formatSyncTime(item.createdAt)}</small><h3>${escapeHTML(item.title)}</h3></div><span>Local</span></div><div class="assistant-evidence"><section><strong>Facts used</strong>${item.facts.map(value => `<p>${escapeHTML(value)}</p>`).join("")}</section><section><strong>Assumptions</strong>${item.assumptions.map(value => `<p>${escapeHTML(value)}</p>`).join("")}</section><section><strong>Suggestions</strong>${item.suggestions.map(value => `<p>${escapeHTML(value)}</p>`).join("")}</section></div>${item.proposal ? `<div class="assistant-proposal"><span><small>Proposed change</small><strong>${escapeHTML(item.proposal.label)}</strong></span>${change ? '<b>Approved ✓</b>' : `<button class="button button-primary button-small" data-approve-recommendation="${item.id}">Review + apply</button>`}</div>` : ""}</article>`;
}

function renderAssistant() {
  const latest = state.assistant.recommendations[0];
  const changes = state.assistant.approvedChanges.slice(0, 6);
  document.getElementById("assistant-content").innerHTML = `<div class="assistant-intro"><span class="assistant-orb">✦</span><div><strong>Private structured guidance</strong><p>Uses records on this device. No external AI provider receives your data, and no important record changes without approval.</p></div></div><div class="assistant-prompts">${[["day","Plan my day"],["week","Prioritise my week"],["finances","Review finances"],["balance","Balance my week"],["responsibilities","Check responsibilities"],["simplify","Simplify my system"]].map(([kind,label]) => `<button data-assistant-kind="${kind}"><span>${escapeHTML(label)}</span><b>→</b></button>`).join("")}</div>${latest ? assistantRecommendationCard(latest) : '<div class="assistant-empty"><strong>Ask one useful question.</strong><p>The answer will separate recorded facts, assumptions, and suggestions.</p></div>'}${changes.length ? `<div class="change-history"><div class="section-mini-head"><span>Approved change history</span><small>Reversible</small></div>${changes.map(item => `<div class="change-row"><span><strong>${escapeHTML(item.label)}</strong><small>${formatSyncTime(item.createdAt)}${item.reversedAt ? " · reversed" : ""}</small></span>${item.reversedAt ? "" : `<button class="text-button" data-reverse-change="${item.id}">Undo</button>`}</div>`).join("")}</div>` : ""}`;
}

function openAssistant() {
  renderAssistant();
  document.getElementById("assistant-dialog").showModal();
}

function applyAssistantRecommendation(id) {
  const recommendation = state.assistant.recommendations.find(item => item.id === id);
  if (!recommendation?.proposal) return;
  if (state.assistant.approvedChanges.some(item => item.recommendationId === id && !item.reversedAt)) return showToast("That change is already applied");
  const proposal = recommendation.proposal;
  let before;
  if (proposal.type === "dailyPrimary") {
    before = todayState().primaryOutcome;
    todayState().primaryOutcome = proposal.value;
  } else if (proposal.type === "weekOutcome") {
    before = state.week.outcome;
    state.week.outcome = proposal.value;
  } else if (proposal.type === "mode") {
    before = todayState().mode;
    todayState().mode = proposal.value;
    todayState().routine = [];
  } else return;
  state.assistant.approvedChanges.unshift({ id: crypto.randomUUID(), recommendationId: id, type: proposal.type, label: proposal.label, before, after: proposal.value, createdAt: new Date().toISOString(), reversedAt: "" });
  saveState("Approved assistant change applied");
  render();
  renderAssistant();
}

function reverseAssistantChange(id) {
  const change = state.assistant.approvedChanges.find(item => item.id === id);
  if (!change || change.reversedAt) return;
  if (change.type === "dailyPrimary") todayState().primaryOutcome = change.before;
  if (change.type === "weekOutcome") state.week.outcome = change.before;
  if (change.type === "mode") {
    todayState().mode = change.before;
    todayState().routine = [];
  }
  change.reversedAt = new Date().toISOString();
  saveState("Assistant change reversed");
  render();
  renderAssistant();
}

function spentToday() {
  return fromMinor(state.finances.transactions.filter(item => item.date === dayKey() && item.type === "expense").reduce((sum, item) => sum + minorValue(item, "amountMinor", "amount"), 0));
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
  renderLife();
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
  document.getElementById("view-today").innerHTML = `
    <div class="page-head today-page-head"><p class="eyebrow">${escapeHTML(formatDate())} · Daily command centre</p><h1 id="today-heading">${greeting()}</h1><p>Decide the day in a few minutes, then leave the system and live it.</p></div>
    ${todayPriorityCard(daily, plan, mode, routineDone, totals)}
    <div class="today-core-grid">
      ${dailyCommandCard(plan, daily)}
      <article class="card routine-core-card" id="today-routine"><div class="card-head"><div><p class="eyebrow">Essential routine</p><h2>${escapeHTML(mode.label)} mode</h2><p>${escapeHTML(mode.note)}</p></div><span class="tag">${routineDone}/${mode.routine.length}</span></div><div class="routine-list">${mode.routine.map((item, index) => routineTemplate(item, index, daily.routine[index])).join("")}</div></article>
    </div>
    ${todaySecondaryDetails(plan, daily, openTasks)}`;
}

function dailyNorthStarCard(daily = todayState()) {
  return `<article class="card north-star-card"><div class="north-star-head"><div><p class="eyebrow">Intentions</p><h2>How will today feel human?</h2></div></div><div class="north-star-fields"><div class="field"><label for="daily-intention">How do I want to show up?</label><input id="daily-intention" data-daily-field="intention" value="${escapeHTML(daily.intention)}" placeholder="Calm, direct, present…" /></div><div class="field"><label for="daily-experience">Life participation</label><input id="daily-experience" data-daily-field="experienceIntention" value="${escapeHTML(daily.experienceIntention)}" placeholder="Call someone, walk outside, enjoy dinner…" /></div></div></article>`;
}

function todayPriorityCard(daily, plan, mode, routineDone, totals) {
  const maintenance = maintenanceSchedule().find(item => !item.actionDone && item.days <= 3);
  const alert = totals.personalGap ? { label: "Personal protection gap", value: currency(totals.personalGap), view: "money", urgent: true }
    : totals.businessGap ? { label: "Business protection gap", value: currency(totals.businessGap), view: "money", urgent: true }
      : plan.bill ? { label: plan.bill.bill.name, value: billDueLabel(plan.bill), view: "money", urgent: plan.bill.days <= 0 }
        : maintenance ? { label: maintenance.item.name, value: maintenanceDueLabel(maintenance), view: "architecture", urgent: maintenance.days <= 0 }
          : { label: "No urgent maintenance", value: `${currency(totals.safeToSpend)} personal safe`, view: "money", urgent: false };
  const progress = mode.routine.length ? Math.round((routineDone / mode.routine.length) * 100) : 0;
  return `<article class="card today-priority-card"><div class="priority-main"><p class="eyebrow">Most important outcome</p><textarea id="daily-primary" data-daily-field="primaryOutcome" placeholder="One finish condition that makes today count.">${escapeHTML(daily.primaryOutcome)}</textarea></div><div class="priority-controls"><div><span class="micro-label">Energy now</span><div class="energy-picker priority-energy">${[1,2,3,4,5].map(value => `<button class="energy-button ${daily.energy === value ? "selected" : ""}" data-energy="${value}" aria-label="Energy ${value}"><span>${["○","◔","◑","◕","●"][value-1]}</span><small>${value}</small></button>`).join("")}</div></div><div><span class="micro-label">Operating mode</span><div class="mode-row priority-modes">${Object.entries(state.modes).map(([key, value]) => `<button class="mode-button ${daily.mode === key ? "selected" : ""}" data-mode="${key}">${escapeHTML(value.label)}</button>`).join("")}</div></div></div><div class="priority-status"><button class="priority-progress" data-scroll-target="today-routine"><span>Routine</span><strong>${routineDone}/${mode.routine.length}</strong><i><b style="width:${progress}%"></b></i></button><button class="priority-alert ${alert.urgent ? "urgent" : ""}" data-view-target="${alert.view}"><span>${escapeHTML(alert.label)}</span><strong>${escapeHTML(alert.value)}</strong></button></div></article>`;
}

function todaySecondaryDetails(plan, daily, openTasks) {
  return `<details class="today-secondary"><summary><span><strong>More for today</strong><small>Intentions, detailed capacity, connection, preparation and evening review</small></span><b>+</b></summary><div class="today-secondary-grid"><div class="stack">${dailyNorthStarCard(daily)}<article class="card"><div class="card-head"><div><p class="eyebrow">Execution queue</p><h2>Only if capacity remains</h2></div><button class="text-button" data-add="task">+ Add</button></div><div class="task-list">${openTasks.length ? openTasks.slice(0, 4).map(taskTemplate).join("") : '<div class="empty">No open actions. Choose the next meaningful outcome.</div>'}</div></article>${tomorrowSetupCard(daily, openTasks)}</div><aside class="stack"><article class="card card-muted"><div class="card-head"><div><p class="eyebrow">Detailed capacity</p><h2>Refine the plan</h2></div></div><span class="micro-label">Mental clarity</span><div class="energy-picker compact-picker">${[1,2,3,4,5].map(value => `<button class="energy-button ${daily.clarity === value ? "selected" : ""}" data-clarity="${value}"><small>${value}</small></button>`).join("")}</div><span class="micro-label time-label">Focused time available</span><div class="time-picker">${[[45,"45m"],[90,"1.5h"],[180,"3h"],[300,"5h"]].map(([value,label]) => `<button class="time-button ${Number(daily.availableMinutes) === value ? "selected" : ""}" data-available-minutes="${value}">${label}</button>`).join("")}</div><div class="suggestion mode-suggestion"><span><strong>Suggestion: ${escapeHTML(state.modes[plan.recovery.mode]?.label || "Standard")}.</strong> ${escapeHTML(plan.recovery.note)}</span>${daily.mode !== plan.recovery.mode ? `<button class="text-button" data-use-suggested-mode="${plan.recovery.mode}">Use suggestion</button>` : ""}</div></article>${connectionRestCard(daily)}<article class="card weekly-anchor-card"><p class="eyebrow">Primary weekly outcome</p><h2>${escapeHTML(state.week.outcome || "Define the result that would make this week count.")}</h2><p>${escapeHTML(state.week.evidence || "Name the evidence that will prove it is complete.")}</p></article><article class="card"><div class="card-head"><div><p class="eyebrow">Evening feedback loop</p><h2>Close the day cleanly</h2></div></div>${dailyField("win", "What moved today?", "Name the meaningful progress.")}${dailyField("friction", "What caused friction?", "Situation, cue, or missing preparation.")}${dailyField("tomorrow", "Tomorrow's main outcome", "One finish condition for tomorrow.")}<p class="money-note">Recorded spending today: <strong>${currency(spentToday())}</strong></p></article></aside></div></details>`;
}

function dailyCommandCard(plan, daily = todayState()) {
  const build = plan.tasks[0];
  const maintain = plan.bill ? { label: plan.bill.bill.name, note: `${currency(plan.bill.bill.amount)} · ${billDueLabel(plan.bill)}`, view: "money" } : plan.maintenance ? { label: plan.maintenance.item.name, note: maintenanceDueLabel(plan.maintenance), view: "architecture" } : { label: "Keep the foundations", note: plan.routineMinutes ? `${plan.routineMinutes} minutes remain in ${plan.mode.label} mode` : "Routine foundations complete", view: "today" };
  const experience = daily.experienceIntention ? { label: daily.experienceIntention, note: "Chosen for today" } : plan.relationship ? { label: `Connect with ${plan.relationship.contact.name}`, note: plan.relationship.contact.intention || "Make one genuine point of contact" } : plan.experience ? { label: plan.experience.experience.name, note: plan.experience.affordable ? "Fits the current enjoyment allowance" : "Keep the idea visible without financial pressure" } : { label: "Make room for life", note: "Connection, enjoyment, care, or unstructured rest" };
  const queue = plan.tasks.slice(1);
  return `<article class="card command-card command-card-v2"><div class="command-head"><div><p class="eyebrow">Today’s operating plan</p><h2>Three moves are enough.</h2><p>One action to build, one to maintain, and one to experience.</p></div><span>${plan.capacity} min</span></div><div class="operating-lanes"><div class="operating-lane build"><i>B</i><span><small>Build</small><strong>${escapeHTML(build?.name || daily.primaryOutcome || "Choose the next visible action")}</strong><em>${escapeHTML(build ? `${taskReason(build)} · ${build.duration} min` : "Move the most important outcome")}</em></span>${build ? `<button class="mini-check" data-task-toggle="${build.id}" aria-label="Complete ${escapeHTML(build.name)}">✓</button>` : `<button class="mini-arrow" data-view-target="week">›</button>`}</div><div class="operating-lane maintain"><i>M</i><span><small>Maintain</small><strong>${escapeHTML(maintain.label)}</strong><em>${escapeHTML(maintain.note)}</em></span><button class="mini-arrow" data-view-target="${maintain.view}">›</button></div><div class="operating-lane experience"><i>E</i><span><small>Experience</small><strong>${escapeHTML(experience.label)}</strong><em>${escapeHTML(experience.note)}</em></span><button class="mini-arrow" data-view-target="life">›</button></div></div>${queue.length ? `<div class="command-queue"><span>Next, only if capacity remains</span>${queue.map(task => `<button data-edit-task="${task.id}"><strong>${escapeHTML(task.name)}</strong><small>${task.duration} min · ${escapeHTML(taskReason(task))}</small></button>`).join("")}</div>` : ""}<div class="command-anchor"><span>Weekly direction</span><strong>${escapeHTML(state.week.outcome || "Define the outcome that makes this week count")}</strong></div></article>`;
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
  return `<div class="routine-item"><button class="check-button ${done ? "done" : ""}" data-routine-index="${index}" aria-label="Toggle ${escapeHTML(item[0])}"></button><div class="routine-copy"><strong>${escapeHTML(item[0])}</strong><small>${escapeHTML(item[1])}</small><em>Fallback · ${escapeHTML(item[3] || "Do the smallest useful version.")}</em></div><span class="duration">${Number(item[2])} min</span></div>`;
}

function dailyField(key, label, placeholder) {
  return `<div class="field"><label for="daily-${key}">${label}</label><textarea id="daily-${key}" data-daily-field="${key}" placeholder="${placeholder}">${escapeHTML(todayState()[key])}</textarea></div>`;
}

function taskTemplate(task) {
  const due = taskDueDays(task);
  const project = state.projects.find(item => item.id === task.projectId);
  const blocker = taskBlocker(task);
  const dueTag = task.done || due === null ? "" : `<span class="tag ${due < 0 ? "tag-danger" : due <= 3 ? "tag-warm" : ""}">${due < 0 ? `${Math.abs(due)}d overdue` : due === 0 ? "Due today" : `Due ${formatCompactDate(task.dueDate)}`}</span>`;
  return `<div class="task-card ${task.done ? "done" : ""}"><button class="check-button ${task.done ? "done" : ""}" data-task-toggle="${task.id}" aria-label="Toggle task"></button><div class="task-copy"><p class="task-name">${escapeHTML(task.name)}</p><small class="smart-reason">${escapeHTML(taskReason(task))}</small><div class="task-meta">${project ? `<span class="tag tag-project">${escapeHTML(project.name)}</span>` : ""}${blocker ? '<span class="tag tag-danger">Blocked</span>' : ""}<span class="tag tag-impact">${escapeHTML(task.alignment)}</span><span class="tag">Impact ${task.impact}</span><span class="tag">${escapeHTML(energyLabel(task.energy))}</span><span class="tag">${task.duration} min</span>${dueTag}</div></div><button class="edit-button" data-edit-task="${task.id}" aria-label="Edit task">•••</button></div>`;
}

function renderLife() {
  const totals = moneyTotals();
  const contactOpportunity = relationshipOpportunity();
  const experience = experienceOpportunity(totals);
  const upcomingContacts = state.life.contacts.filter(item => item.status === "active").sort((a, b) => String(a.nextContactDate || "9999").localeCompare(String(b.nextContactDate || "9999")));
  const openExperiences = state.life.experiences.filter(item => item.status !== "archived").sort((a, b) => Number(a.status === "completed") - Number(b.status === "completed") || String(a.targetDate || "9999").localeCompare(String(b.targetDate || "9999")));
  const recentJournal = [...state.life.journal].sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 8);
  document.getElementById("view-life").innerHTML = `
    <div class="page-head life-page-head"><p class="eyebrow">Life OS · Experience</p><h1 id="life-heading">Life is not a reward.</h1><p>Keep identity, people, care, faith, enjoyment, and meaningful experiences inside the plan—not waiting at the end of it.</p></div>
    <div class="life-principles"><div><span>Build</span><strong>Create the future</strong></div><div><span>Maintain</span><strong>Protect what matters</strong></div><div><span>Experience</span><strong>Live in the present</strong></div></div>
    <div class="grid two-column life-grid">
      <div class="stack">
        <article class="card identity-card"><div class="card-head"><div><p class="eyebrow">Identity + values</p><h2>Operate from who you choose to be</h2><p>Use these as decision filters, not standards for self-punishment.</p></div></div><div class="identity-grid">${lifeObjectField("identity", "principles", "Guiding principles", "What remains true when pressure rises?")}${lifeObjectField("identity", "vision", "Long-term vision", "What kind of life are you building?")}${lifeObjectField("identity", "boundaries", "Boundaries", "What protects your time, money, dignity, and peace?")}${lifeObjectField("identity", "commitments", "Behavioural commitments", "What do you practise regardless of mood?")}${lifeObjectField("identity", "patterns", "Patterns to notice", "Observe recurring loops without turning them into identity.")}</div></article>
        <article class="card relationships-card"><div class="card-head"><div><p class="eyebrow">Relationships</p><h2>Keep people inside real life</h2><p>Optional reminders for intentions you choose. Nobody is scored.</p></div><button class="button button-secondary button-small" data-add="contact">+ Person</button></div>${contactOpportunity ? `<div class="life-opportunity"><span>Reconnection opportunity</span><strong>${escapeHTML(contactOpportunity.contact.name)}</strong><small>${escapeHTML(contactOpportunity.contact.intention || contactDueLabel(contactOpportunity))}</small></div>` : ""}<div class="contact-list">${upcomingContacts.length ? upcomingContacts.map(contactTemplate).join("") : '<div class="empty">Add someone only when a reminder would genuinely help you act with care.</div>'}</div></article>
        <article class="card experiences-card"><div class="card-head"><div><p class="eyebrow">Experiences + enjoyment</p><h2>Plan a life you can actually enter</h2><p>Ideas can remain free, affordable, and pressure-free.</p></div><button class="button button-secondary button-small" data-add="experience">+ Experience</button></div><div class="enjoyment-budget"><span>Available within current protection</span><strong>${currency(totals.enjoymentAvailable)}</strong><button class="text-button" data-add="moneySettings">Set allowance</button></div>${experience ? `<div class="life-opportunity experience-opportunity"><span>${experience.affordable ? "Affordable next experience" : "Keep visible without pressure"}</span><strong>${escapeHTML(experience.experience.name)}</strong><small>${experience.experience.costEstimate ? `${currency(experience.experience.costEstimate)} estimated` : "No spending required"}</small></div>` : ""}<div class="experience-list">${openExperiences.length ? openExperiences.map(item => experienceTemplate(item, totals)).join("") : '<div class="empty">Add one activity, outing, hobby, celebration, or place you would genuinely enjoy.</div>'}</div></article>
      </div>
      <aside class="stack">
        <article class="card care-card"><div class="card-head"><div><p class="eyebrow">Personal care</p><h2>Care without earning it</h2></div></div>${lifeObjectField("care", "appearance", "Appearance + clothing", "What would help you feel prepared and self-respecting?")}${lifeObjectField("care", "interests", "Interests", "What do you want to explore for its own sake?")}${lifeObjectField("care", "selfCare", "Care intention", "One practical act of care that fits real life.")}</article>
        <article class="card faith-card"><div class="card-head"><div><p class="eyebrow">Faith + reflection</p><h2>Private grounding</h2><p>Optional and private by default.</p></div></div>${lifeObjectField("faith", "prayer", "Prayer intention", "What practice would help you become still?")}${lifeObjectField("faith", "reading", "Scripture or spiritual reading", "What are you reading or returning to?")}${lifeObjectField("faith", "reflection", "Current reflection", "What feels important to sit with?")}</article>
        <article class="card journal-card"><div class="card-head"><div><p class="eyebrow">Private reflections</p><h2>Remember what life felt like</h2><p>Encrypted during device sync and secure handoff. Standard exported backups remain readable files.</p></div><button class="button button-secondary button-small" data-add="journal">+ Write</button></div><div class="journal-list">${recentJournal.length ? recentJournal.map(journalTemplate).join("") : '<div class="empty">No entry is required. Write only when reflection would be useful.</div>'}</div></article>
      </aside>
    </div>`;
}

function lifeObjectField(group, key, label, placeholder) {
  const value = state.life[group]?.[key] || "";
  return `<div class="field"><label for="life-${group}-${key}">${label}</label><textarea id="life-${group}-${key}" data-life-group="${group}" data-life-key="${key}" placeholder="${placeholder}">${escapeHTML(value)}</textarea></div>`;
}

function contactDueLabel(entry) {
  if (!entry || entry.days === null) return entry?.contact.lastConnected ? `Last connected ${formatCompactDate(String(entry.contact.lastConnected).slice(0, 10))}` : "No reminder date";
  if (entry.days < 0) return `Reminder was ${Math.abs(entry.days)} day${Math.abs(entry.days) === 1 ? "" : "s"} ago`;
  if (entry.days === 0) return "Reconnect today";
  if (entry.days === 1) return "Reconnect tomorrow";
  return `Reconnect in ${entry.days} days`;
}

function contactTemplate(contact) {
  const entry = { contact, days: contact.nextContactDate ? daysFromToday(dateFromKey(contact.nextContactDate)) : null };
  return `<div class="contact-row"><button class="contact-done" data-contact-connected="${contact.id}" aria-label="Record connection with ${escapeHTML(contact.name)}">✓</button><div><strong>${escapeHTML(contact.name)}</strong><small>${escapeHTML(contact.relationship || "Relationship")}</small><p>${escapeHTML(contact.intention || contactDueLabel(entry))}</p></div><span>${escapeHTML(contactDueLabel(entry))}</span><button class="edit-button" data-edit-contact="${contact.id}" aria-label="Edit ${escapeHTML(contact.name)}">•••</button></div>`;
}

function experienceTemplate(experience, totals = moneyTotals()) {
  const completed = experience.status === "completed";
  const affordable = Number(experience.costEstimate || 0) <= Number(totals.enjoymentAvailable || 0);
  const dateLabel = experience.targetDate ? formatCompactDate(experience.targetDate) : "No date pressure";
  return `<div class="experience-row ${completed ? "completed" : ""}"><button class="experience-done ${completed ? "done" : ""}" data-experience-toggle="${experience.id}" aria-label="${completed ? "Reopen" : "Complete"} ${escapeHTML(experience.name)}"></button><div><strong>${escapeHTML(experience.name)}</strong><small>${escapeHTML(experience.category)} · ${escapeHTML(dateLabel)}</small></div><span class="affordability ${affordable ? "affordable" : "hold"}">${experience.costEstimate ? currency(experience.costEstimate) : "Free"}</span><button class="edit-button" data-edit-experience="${experience.id}" aria-label="Edit ${escapeHTML(experience.name)}">•••</button></div>`;
}

function journalTemplate(entry) {
  const preview = entry.content.length > 110 ? `${entry.content.slice(0, 110)}…` : entry.content;
  return `<button class="journal-row" data-edit-journal="${entry.id}"><span><small>${escapeHTML(entry.type)} · ${formatCompactDate(entry.date)}</small><strong>${escapeHTML(preview || "Private entry")}</strong></span><i>${entry.private ? "Private" : "Personal"}</i></button>`;
}

function renderMoney() {
  const totals = moneyTotals();
  const transactions = [...state.finances.transactions].sort((a, b) => b.date.localeCompare(a.date));
  const transfers = [...state.finances.transfers].sort((a, b) => b.date.localeCompare(a.date));
  document.getElementById("view-money").innerHTML = `
    <div class="page-head"><p class="eyebrow">Financial OS</p><h1 id="money-heading">Know your position.</h1><p>Every pound has a purpose. Expected investment money does not count until it actually arrives.</p></div>
    <div class="money-summary">${moneyStat("Personal safe", currency(totals.safeToSpend), "After personal protection")}${moneyStat("Personal cash", currency(totals.personal), "Business excluded")}${moneyStat("Business free", currency(totals.businessFree), "After business bills")}${moneyStat("Protected", currency(totals.protectedCash), totals.overdueBills ? `${currency(totals.overdueBills)} overdue` : "Bills, reserve + plans")}</div>
    <div class="grid two-column">
      <div class="stack">
        ${financialTruthCard(totals)}
        ${reconciliationCard(totals)}
        <article class="card bills-card"><div class="card-head"><div><p class="eyebrow">Bill calendar</p><h2>Due dates, without surprises</h2><p>Recurring bills, one-offs, autopay, and what is actually paid.</p></div><button class="button button-secondary button-small" data-add="bill">+ Bill</button></div>${billInsight(totals)}<div class="bills-list">${totals.billSchedule.length ? totals.billSchedule.map(billTemplate).join("") : '<div class="empty">No bills yet. Add the first due date you want the system to watch.</div>'}</div></article>
        ${incomeForecastCard(totals)}
        ${incomeAllocationCard()}
        ${cashFlowForecastCard(totals)}
        ${plannedPurchasesCard(totals)}
        ${budgetCard(totals)}
        ${subscriptionAuditCard(totals)}
        <article class="card"><div class="card-head"><div><p class="eyebrow">Cash ledger</p><h2>Transactions + transfers</h2><p>Record reality. A transfer moves money between accounts without creating income.</p></div><div class="card-actions"><button class="button button-secondary button-small" data-add="transfer">+ Transfer</button><button class="button button-secondary button-small" data-add="transaction">+ Transaction</button></div></div><div class="ledger-list">${[...transactions.map(item => ({ ...item, ledgerKind: "transaction" })), ...transfers.map(item => ({ ...item, ledgerKind: "transfer" }))].sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 24).map(item => item.ledgerKind === "transfer" ? transferTemplate(item) : transactionTemplate(item)).join("") || '<div class="empty">No cash movement recorded yet.</div>'}</div></article>
        <article class="card"><div class="card-head"><div><p class="eyebrow">Starting position</p><h2>Opening balances</h2></div></div><div class="balance-grid">${balanceField("personal", "Personal cash")}${balanceField("business", "Business cash")}${balanceField("held", "Money held for others")}</div><p class="privacy-note">Use opening balances once, then keep the ledger current.</p></article>
      </div>
      <aside class="stack">${spendingGuardrailCard(totals)}${cashCoverCard(totals)}${savingsCard(totals)}${moneyCollectionCard("obligation", "Liabilities + obligations", "What must be restored or repaid", state.finances.obligations, item => `${escapeHTML(item.name)} · ${currency(Math.max(0, item.target - item.paid))} left${item.monthlyPayment ? ` · ${currency(item.monthlyPayment)}/mo` : ""}`)}${moneyCollectionCard("investment", "Investments", "Visible, but unavailable until realised", state.finances.investments, item => `${escapeHTML(item.name)} · ${currency(item.current)} current value`)}</aside>
    </div>`;
}

function financialTruthCard(totals) {
  const gap = totals.personalGap + totals.businessGap;
  return `<article class="card financial-truth-card ${gap ? "urgent" : ""}"><div class="card-head"><div><p class="eyebrow">Financial truth</p><h2>${gap ? `${currency(gap)} protection gap` : "Each account stands on its own"}</h2><p>Personal cash cannot conceal a business gap, and business cash never becomes personal spending money without a recorded transfer.</p></div><span class="tag">Exact pence</span></div><div class="account-truth-grid"><div class="${totals.personalGap ? "gap" : ""}"><span>Personal position</span><strong>${currency(totals.personal)}</strong><small>${totals.personalGap ? `${currency(totals.personalGap)} short of protection` : `${currency(totals.safeToSpend)} safe to spend`}</small></div><div class="${totals.businessGap ? "gap" : ""}"><span>Business position</span><strong>${currency(totals.business)}</strong><small>${totals.businessGap ? `${currency(totals.businessGap)} short of protection` : `${currency(totals.businessFree)} free after business plans`}</small></div></div><div class="truth-grid"><div><span>Expected</span><strong>${currency(totals.expectedIncome)}</strong><small>Not available</small></div><div><span>Confirmed</span><strong>${currency(totals.confirmedIncome)}</strong><small>Still not received</small></div><div><span>Investments</span><strong>${currency(totals.investments)}</strong><small>Not cash</small></div><div><span>Held for others</span><strong>${currency(totals.held)}</strong><small>Restricted</small></div><div><span>Liabilities</span><strong>${currency(totals.obligations)}</strong><small>Outstanding</small></div><div><span>Savings</span><strong>${currency(totals.savingsCurrent)}</strong><small>Protected goals</small></div></div></article>`;
}

function reconciliationCard(totals) {
  const latest = [...state.finances.reconciliations].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0];
  const age = latest ? Math.max(0, daysFromToday(new Date(latest.date)) * -1) : null;
  const differenceMinor = latest ? Object.values(latest.differencesMinor).reduce((sum, value) => sum + Math.abs(Number(value) || 0), 0) : 0;
  return `<article class="card reconciliation-card ${age === null || age >= 7 ? "needs-review" : ""}"><div class="card-head"><div><p class="eyebrow">Weekly reconciliation</p><h2>${latest ? (differenceMinor ? `${currency(fromMinor(differenceMinor))} corrected` : "Recorded cash matched") : "Compare the app with reality"}</h2><p>${latest ? `Last checked ${formatCompactDate(latest.date)} · ${latest.applied ? "differences were recorded in the ledger" : "comparison only"}.` : "Enter the balances shown by your real accounts. Any correction becomes an auditable ledger entry."}</p></div><button class="button button-primary button-small" data-add="reconciliation">Reconcile</button></div>${latest ? `<div class="reconciliation-summary"><span>Personal <strong>${currency(fromMinor(latest.actualMinor.personal))}</strong></span><span>Business <strong>${currency(fromMinor(latest.actualMinor.business))}</strong></span><span>Held <strong>${currency(fromMinor(latest.actualMinor.held))}</strong></span></div>` : `<div class="reconciliation-summary"><span>Recorded personal <strong>${currency(totals.personal)}</strong></span><span>Recorded business <strong>${currency(totals.business)}</strong></span><span>Recorded held <strong>${currency(totals.held)}</strong></span></div>`}</article>`;
}

function incomeForecastCard(totals) {
  const forecasts = [...state.finances.incomeForecasts].sort((a, b) => String(a.expectedDate || "9999").localeCompare(String(b.expectedDate || "9999")));
  return `<article class="card forecast-card"><div class="card-head"><div><p class="eyebrow">Expected income</p><h2>Forecast without pretending it arrived</h2><p>Student Finance, invoices, investments, and other income remain expected until received.</p></div><button class="button button-secondary button-small" data-add="income">+ Income</button></div><div class="forecast-summary"><span>Expected <strong>${currency(totals.expectedIncome)}</strong></span><span>Confirmed <strong>${currency(totals.confirmedIncome)}</strong></span></div><div class="forecast-list">${forecasts.length ? forecasts.map(incomeTemplate).join("") : '<div class="empty">No expected income recorded.</div>'}</div></article>`;
}

function incomeTemplate(item) {
  const date = item.expectedDate ? formatCompactDate(item.expectedDate) : "No date";
  const allocation = state.finances.incomeAllocations.find(entry => entry.incomeId === item.id);
  return `<div class="forecast-row ${item.status}"><button class="forecast-edit" data-edit-income="${item.id}"><span><strong>${escapeHTML(item.source)}</strong><small>${escapeHTML(date)} · ${escapeHTML(item.account)}</small></span><span><b>${currency(item.amount)}</b><small>${escapeHTML(item.status)}</small></span></button>${item.status !== "cancelled" && !allocation ? `<button class="tiny-button" data-allocate-income="${item.id}">${item.status === "received" ? "Allocate" : "Receive + allocate"}</button>` : allocation ? `<span class="allocation-state">${allocation.status === "active" ? "Allocated" : "Released"}</span>` : ""}</div>`;
}

function incomeAllocationCard() {
  const allocations = [...state.finances.incomeAllocations].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  if (!allocations.length) return "";
  return `<article class="card allocation-card"><div class="card-head"><div><p class="eyebrow">Incoming money plans</p><h2>Received cash has a job</h2><p>Protected allocations remain outside safe-to-spend until you release them.</p></div></div><div class="allocation-list">${allocations.slice(0, 6).map(allocationTemplate).join("")}</div></article>`;
}

function allocationTemplate(item) {
  const income = state.finances.incomeForecasts.find(entry => entry.id === item.incomeId);
  return `<div class="allocation-row ${item.status}"><div><strong>${escapeHTML(income?.source || "Received income")}</strong><small>${formatCompactDate(String(item.createdAt).slice(0, 10))} · ${escapeHTML(item.sourceAccount)}</small><p>Essentials ${currency(fromMinor(item.essentialsMinor))} · reserve ${currency(fromMinor(item.reserveMinor))} · repayments ${currency(fromMinor(item.repaymentsMinor))} · business ${currency(fromMinor(item.businessMinor))} · personal ${currency(fromMinor(item.personalMinor))}</p></div><button class="tiny-button" data-allocation-release="${item.id}">${item.status === "active" ? "Release protection" : "Protect again"}</button></div>`;
}

function forecastBillPeriod(bill, date) {
  if (bill.frequency === "monthly") return monthKey(date);
  if (bill.frequency === "annual") return String(date.getFullYear());
  return bill.dueDate;
}

function billFallsInMonth(bill, date) {
  if (bill.frequency === "monthly") return true;
  if (bill.frequency === "annual") return Number(bill.dueMonth) === date.getMonth() + 1;
  return String(bill.dueDate || "").startsWith(monthKey(date));
}

function threeMonthCashFlow(totals = moneyTotals()) {
  let personalMinor = totals.minor.personal;
  let businessMinor = totals.minor.business;
  const obligationMinor = state.finances.obligations.reduce((sum, item) => sum + minorValue(item, "monthlyPaymentMinor", "monthlyPayment"), 0);
  return Array.from({ length: 3 }, (_, offset) => {
    const date = new Date(new Date().getFullYear(), new Date().getMonth() + offset + 1, 1);
    const key = monthKey(date);
    const bills = state.finances.bills.filter(bill => billFallsInMonth(bill, date) && !bill.paidPeriods.includes(forecastBillPeriod(bill, date)));
    const budgets = state.finances.budgets.filter(item => item.recurring || item.month === key);
    const personalBillsMinor = bills.filter(bill => bill.account !== "business").reduce((sum, bill) => sum + minorValue(bill, "amountMinor", "amount"), 0) + budgets.filter(item => item.account !== "business").reduce((sum, item) => sum + minorValue(item, "amountMinor", "amount"), 0) + obligationMinor;
    const businessBillsMinor = bills.filter(bill => bill.account === "business").reduce((sum, bill) => sum + minorValue(bill, "amountMinor", "amount"), 0) + budgets.filter(item => item.account === "business").reduce((sum, item) => sum + minorValue(item, "amountMinor", "amount"), 0);
    const forecasts = state.finances.incomeForecasts.filter(item => item.status !== "cancelled" && item.status !== "received" && (item.expectedDate ? item.expectedDate.startsWith(key) : offset === 0));
    const confirmedPersonalMinor = forecasts.filter(item => item.status === "confirmed" && item.account !== "business").reduce((sum, item) => sum + minorValue(item, "amountMinor", "amount"), 0);
    const confirmedBusinessMinor = forecasts.filter(item => item.status === "confirmed" && item.account === "business").reduce((sum, item) => sum + minorValue(item, "amountMinor", "amount"), 0);
    const expectedMinor = forecasts.filter(item => item.status === "expected").reduce((sum, item) => sum + minorValue(item, "amountMinor", "amount"), 0);
    personalMinor += confirmedPersonalMinor - personalBillsMinor;
    businessMinor += confirmedBusinessMinor - businessBillsMinor;
    return { key, label: new Intl.DateTimeFormat("en-GB", { month: "short" }).format(date), personalMinor, businessMinor, personalBillsMinor, businessBillsMinor, confirmedMinor: confirmedPersonalMinor + confirmedBusinessMinor, expectedMinor };
  });
}

function cashFlowForecastCard(totals) {
  const forecast = threeMonthCashFlow(totals);
  return `<article class="card cash-flow-card"><div class="card-head"><div><p class="eyebrow">Three-month cash flow</p><h2>Conservative planning view</h2><p>Only confirmed income enters the projection. Expected income stays visible but excluded.</p></div><span class="tag">Planning estimate</span></div><div class="cash-flow-list">${forecast.map(item => `<div class="cash-flow-row"><span><strong>${item.label}</strong><small>${currency(fromMinor(item.personalBillsMinor + item.businessBillsMinor))} planned out</small></span><span><small>Personal</small><strong class="${item.personalMinor < 0 ? "negative" : ""}">${currency(fromMinor(item.personalMinor))}</strong></span><span><small>Business</small><strong class="${item.businessMinor < 0 ? "negative" : ""}">${currency(fromMinor(item.businessMinor))}</strong></span><span><small>Expected outside cash</small><strong>${currency(fromMinor(item.expectedMinor))}</strong></span></div>`).join("")}</div><p class="dialog-note">This is a forward plan, not a bank balance. Reconcile the ledger and mark bills paid to keep it useful.</p></article>`;
}

function plannedPurchasesCard(totals) {
  const priorityOrder = { next: 0, soon: 1, later: 2 };
  const purchases = state.finances.plannedPurchases.filter(item => item.status === "planned").sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority] || String(a.targetDate || "9999").localeCompare(String(b.targetDate || "9999")) || a.createdAt.localeCompare(b.createdAt));
  const bought = state.finances.plannedPurchases.filter(item => item.status === "bought").sort((a, b) => String(b.boughtAt || b.updatedAt).localeCompare(String(a.boughtAt || a.updatedAt)));
  const plannedMinor = purchases.reduce((sum, item) => sum + minorValue(item, "amountMinor", "amount"), 0);
  return `<article class="card purchases-card"><div class="card-head"><div><p class="eyebrow">Next purchases</p><h2>${purchases.length ? `${purchases.length} planned · ${currency(fromMinor(plannedMinor))}` : "Buy deliberately, not impulsively"}</h2><p>Keep the item, price, and real link together. Protect money only when the purchase belongs in the current plan.</p></div><button class="button button-secondary button-small" data-add="purchase">+ Purchase</button></div>${totals.plannedPurchaseReserve ? `<div class="purchase-reserve"><span>Protected for purchases</span><strong>${currency(totals.plannedPurchaseReserve)}</strong></div>` : ""}<div class="purchase-list">${purchases.length ? purchases.map(item => purchaseTemplate(item, totals)).join("") : '<div class="empty">Add something you are genuinely considering. The system will show whether it fits your protected cash.</div>'}</div>${bought.length ? `<details class="purchase-history"><summary>Purchased recently <span>${bought.length}</span></summary><div class="purchase-list purchased">${bought.slice(0, 6).map(item => purchaseTemplate(item, totals)).join("")}</div></details>` : ""}<p class="dialog-note">Marking an item bought never changes a balance automatically. Record the matching transaction when money actually leaves the account.</p></article>`;
}

function purchaseTemplate(item, totals) {
  const amountMinor = minorValue(item, "amountMinor", "amount");
  const account = item.account === "business" ? "business" : "personal";
  const protectedMinor = Number(totals.minor[`${account}Protected`] || 0);
  const availableMinor = Math.max(0, Number(totals.minor[account] || 0) - protectedMinor + (item.status === "planned" && item.reserved ? amountMinor : 0));
  const shortMinor = Math.max(0, amountMinor - availableMinor);
  const safeUrl = safeExternalURL(item.url);
  const dateLabel = item.targetDate ? formatCompactDate(item.targetDate) : "No target date";
  let statusLabel = "Price needed";
  let statusClass = "neutral";
  if (item.status === "bought") {
    statusLabel = "Bought";
    statusClass = "bought";
  } else if (amountMinor && item.reserved && !shortMinor) {
    statusLabel = "Money protected";
    statusClass = "protected";
  } else if (amountMinor && shortMinor) {
    statusLabel = `${currency(fromMinor(shortMinor))} short`;
    statusClass = "short";
  } else if (amountMinor) {
    statusLabel = "Affordable now";
    statusClass = "affordable";
  }
  return `<div class="purchase-row ${item.status === "bought" ? "is-bought" : ""}"><div class="purchase-copy"><div class="purchase-title"><strong>${escapeHTML(item.name)}</strong><span class="purchase-priority ${escapeHTML(item.priority)}">${escapeHTML(item.priority)}</span></div><small>${escapeHTML(item.category)} · ${escapeHTML(account)} · ${escapeHTML(dateLabel)}</small>${item.notes ? `<p>${escapeHTML(item.notes)}</p>` : ""}<div class="purchase-actions">${safeUrl ? `<a href="${escapeHTML(safeUrl)}" target="_blank" rel="noopener noreferrer">Open link ↗</a>` : '<span class="missing-link">Add link</span>'}<button class="text-button" data-purchase-bought="${item.id}">${item.status === "bought" ? "Reopen" : "Mark bought"}</button></div></div><div class="purchase-value"><strong>${amountMinor ? currency(fromMinor(amountMinor)) : "—"}</strong><span class="purchase-status ${statusClass}">${escapeHTML(statusLabel)}</span></div><button class="edit-button" data-edit-purchase="${item.id}" aria-label="Edit ${escapeHTML(item.name)}">•••</button></div>`;
}

function budgetCard(totals) {
  const items = currentBudgetItems();
  const variance = totals.budgeted - totals.budgetSpent;
  return `<article class="card budget-card"><div class="card-head"><div><p class="eyebrow">Monthly spending budgets</p><h2>${variance >= 0 ? `${currency(variance)} remaining` : `${currency(Math.abs(variance))} over plan`}</h2><p>Food, transport and flexible spending belong here—not in overdue bill alerts.</p></div><button class="button button-secondary button-small" data-add="budget">+ Line</button></div><div class="budget-meter"><i style="width:${totals.budgeted ? Math.min(100, Math.round((totals.budgetSpent / totals.budgeted) * 100)) : 0}%"></i></div><div class="budget-summary"><span>Planned <strong>${currency(totals.budgeted)}</strong></span><span>Assigned spending <strong>${currency(totals.budgetSpent)}</strong></span><span>Unassigned spending <strong>${currency(totals.unassignedSpending)}</strong></span></div><div class="budget-line-list">${items.length ? items.map(budgetTemplate).join("") : '<div class="empty">Add only the lines that help you make decisions.</div>'}</div></article>`;
}

function budgetTemplate(item) {
  const spentMinor = budgetSpentAgainstMinor(item);
  const amountMinor = minorValue(item, "amountMinor", "amount");
  const remainingMinor = Math.max(0, amountMinor - spentMinor);
  const progress = amountMinor ? Math.min(100, Math.round((spentMinor / amountMinor) * 100)) : 0;
  return `<button class="budget-line" data-edit-budget="${item.id}"><span><small>${escapeHTML(item.account)} · ${item.recurring ? "monthly" : formatCompactDate(`${item.month}-01`)}${item.protect ? " · protected" : ""}</small><strong>${escapeHTML(item.name)}</strong><i><b style="width:${progress}%"></b></i></span><span><strong>${currency(fromMinor(remainingMinor))}</strong><small>remaining</small></span></button>`;
}

function savingsCard(totals) {
  return `<article class="card savings-card"><div class="card-head"><div><p class="eyebrow">Savings + reserves</p><h2>${currency(totals.savingsCurrent)} protected</h2><p>Progress toward specific goals without counting it as spendable cash.</p></div><button class="button button-secondary button-small" data-add="savings">+ Goal</button></div><div class="simple-list">${state.finances.savingsGoals.length ? state.finances.savingsGoals.map(item => `<button data-edit-savings="${item.id}"><span>${escapeHTML(item.name)} · ${item.deadline ? formatCompactDate(item.deadline) : "No deadline"}</span><strong>${currency(item.saved)} / ${currency(item.target)}</strong></button>`).join("") : '<div class="empty">No savings goals recorded.</div>'}</div></article>`;
}

function billInsight(totals) {
  const unconfirmed = state.finances.bills.filter(item => !item.dueConfirmed).length;
  if (totals.personalOverdue || totals.businessOverdue) return `<div class="bill-insight urgent"><span>Confirmed overdue bills</span><strong>${currency(totals.personalOverdue)} personal · ${currency(totals.businessOverdue)} business</strong><small>Only bills with a confirmed due date can create this alert.</small></div>`;
  const personalGap = Math.max(0, totals.personalDueSoon - totals.personal);
  const businessGap = Math.max(0, totals.businessDueSoon - totals.business);
  if (personalGap || businessGap) return `<div class="bill-insight urgent"><span>Account-specific cash gap</span><strong>${personalGap ? `${currency(personalGap)} personal` : "Personal covered"} · ${businessGap ? `${currency(businessGap)} business` : "Business covered"}</strong><small>A surplus in one account does not hide a gap in the other.</small></div>`;
  if (totals.dueSoon) return `<div class="bill-insight"><span>Next 7 days</span><strong>${currency(totals.personalDueSoon)} personal · ${currency(totals.businessDueSoon)} business</strong><small>Confirmed immediate bills are covered inside their own accounts.</small></div>`;
  if (unconfirmed) return `<div class="bill-insight verify"><span>Dates to verify</span><strong>${unconfirmed} bill${unconfirmed === 1 ? " needs" : "s need"} a confirmed due date</strong><small>They remain protected in planning but cannot become overdue until confirmed.</small></div>`;
  return `<div class="bill-insight calm"><span>Clear runway</span><strong>No unpaid bills in the next 7 days</strong><small>The calendar will surface the next due date automatically.</small></div>`;
}

function cashCoverCard(totals) {
  const autopay = state.finances.bills.filter(item => item.autopay).length;
  const coverLabel = value => value === null ? "No bills" : value < 0 ? "Below zero" : `${value.toFixed(1)} mo`;
  return `<article class="card cash-cover-card"><div class="card-head"><div><p class="eyebrow">Cash cover</p><h2>Separated by account</h2><p>Personal and business cash never conceal a gap in the other account.</p></div></div><div class="cover-metrics"><div><span>Personal cover</span><strong>${escapeHTML(coverLabel(totals.personalCoverMonths))}</strong></div><div><span>Business cover</span><strong>${escapeHTML(coverLabel(totals.businessCoverMonths))}</strong></div><div><span>Next 30 days</span><strong>${currency(totals.dueThirty)}</strong></div><div><span>Autopay bills</span><strong>${autopay}</strong></div><div><span>Held separately</span><strong>${currency(totals.held)}</strong></div></div></article>`;
}

function spendingGuardrailCard(totals) {
  const gap = totals.personalGap;
  return `<article class="card guardrail-card ${gap ? "urgent" : ""}"><div class="card-head"><div><p class="eyebrow">Personal safe-to-spend</p><h2>${gap ? `${currency(gap)} protection gap` : `${currency(totals.safeToSpend)} flexible`}</h2><p>${gap ? "Personal cash does not fully cover the protected plan." : "Business funds, expected income, investments, and money held for others are excluded."}</p></div><button class="edit-button" data-add="moneySettings" aria-label="Edit spending guardrails">•••</button></div><div class="protection-breakdown"><span>Essential commitments <b>${currency(totals.personalEssentialProtection)}</b></span><span>Reserve floor <b>${currency(totals.reserveProtection)}</b></span><span>Repayments <b>${currency(totals.repaymentProtection)}</b></span><span>Reserved purchases <b>${currency(totals.personalPurchaseReserve)}</b></span></div><div class="guardrail-formula"><span>Personal cash <b>${currency(totals.personal)}</b></span><i>−</i><span>Protection <b>${currency(totals.personalProtected)}</b></span><i>=</i><span>Safe <b>${currency(totals.safeToSpend)}</b></span></div></article>`;
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
  if (entry.needsConfirmation) return entry.actionPaid ? "Paid · confirm the next due date" : "Confirm due date";
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
  return `<div class="bill-row ${entry.status}"><button class="bill-paid-button ${entry.actionPaid ? "done" : ""}" data-bill-paid="${bill.id}" data-bill-period="${entry.actionPeriod || entry.period}" aria-label="${entry.actionPaid ? "Mark unpaid" : "Mark paid"}"></button><div class="bill-copy"><strong>${escapeHTML(bill.name)}</strong><small class="bill-due">${escapeHTML(billDueLabel(entry))}</small><div class="bill-meta"><span>${frequency}</span><span>${escapeHTML(bill.kind)}</span><span>${escapeHTML(bill.account)}</span>${bill.autopay ? "<span>Autopay</span>" : ""}${bill.dueConfirmed ? "<span>Confirmed date</span>" : "<span>Needs verification</span>"}</div></div><div class="bill-value"><strong>${currency(bill.amount)}</strong><small>${bill.dueConfirmed ? formatCompactDate(entry.due) : "No overdue alert"}</small></div><button class="edit-button" data-edit-bill="${bill.id}" aria-label="Edit bill">•••</button></div>`;
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

function transferTemplate(item) {
  return `<div class="ledger-row transfer"><div><strong>${escapeHTML(item.note || "Account transfer")}</strong><small>${escapeHTML(item.date)} · ${escapeHTML(item.fromAccount)} → ${escapeHTML(item.toAccount)}</small></div><div class="ledger-amount transfer">${currency(item.amount)}<button class="edit-button" data-edit-transfer="${item.id}" aria-label="Edit transfer">•••</button></div></div>`;
}

function moneyCollectionCard(type, title, note, items, formatter) {
  return `<article class="card"><div class="card-head"><div><p class="eyebrow">${title}</p><h2>${note}</h2></div><button class="button button-secondary button-small" data-add="${type}">+ Add</button></div><div class="simple-list">${items.length ? items.map(item => `<button data-edit-${type}="${item.id}"><span>${formatter(item)}</span><span>•••</span></button>`).join("") : '<div class="empty">Nothing recorded.</div>'}</div></article>`;
}

function renderWeek() {
  const open = rankedTasks(todayState(), true);
  const done = state.tasks.filter(task => task.done);
  const activeGoals = state.goals.filter(item => item.status === "active");
  const activeProjects = state.projects.filter(item => item.status === "active");
  const openMilestones = state.milestones.filter(item => item.status !== "completed");
  const openBlockers = state.projectBlockers.filter(item => item.status !== "resolved");
  document.getElementById("view-week").innerHTML = `
    <div class="page-head"><p class="eyebrow">Focus OS · Build</p><h1 id="week-heading">Move meaningful work.</h1><p>Goals set direction. Projects create outputs. Today only needs the next visible action.</p></div>
    <div class="focus-summary">${reviewMetric("Active goals", String(activeGoals.length), "Longer direction")}${reviewMetric("Projects", String(activeProjects.length), "Current workspaces")}${reviewMetric("Milestones", String(openMilestones.length), "Open deliverables")}${reviewMetric("Blockers", String(openBlockers.length), openBlockers.length ? "Needs a decision" : "Nothing stuck")}</div>
    <article class="week-outcome"><div class="field"><label for="week-outcome">Primary weekly outcome</label><textarea class="outcome-input" id="week-outcome" data-week-field="outcome" data-auto-resize rows="2" placeholder="One measurable result">${escapeHTML(state.week.outcome)}</textarea></div><div class="field"><label for="week-evidence">Evidence of completion</label><textarea id="week-evidence" data-week-field="evidence" placeholder="What proves this is finished?">${escapeHTML(state.week.evidence)}</textarea></div><div class="inline-fields week-details"><div class="field"><label for="week-secondary">Secondary outcome</label><textarea class="week-compact-input" id="week-secondary" data-week-field="secondary" data-auto-resize rows="2">${escapeHTML(state.week.secondary)}</textarea></div><div class="field"><label for="week-why">Why now?</label><textarea class="week-compact-input" id="week-why" data-week-field="why" data-auto-resize rows="2">${escapeHTML(state.week.why)}</textarea></div></div></article>
    <div class="grid two-column focus-grid">
      <div class="stack">
        ${projectsCard(activeProjects)}
        <article class="card"><div class="card-head"><div><p class="eyebrow">Flow-matched actions</p><h2>Open work, ranked for your state</h2></div><button class="button button-secondary button-small" data-add="task">+ Action</button></div><div class="task-list">${open.length ? open.map(taskTemplate).join("") : '<div class="empty">No open actions. Add the first visible step.</div>'}</div></article>
        <article class="card"><div class="card-head"><div><p class="eyebrow">Completed</p><h2>${done.length} actions moved</h2></div></div><div class="task-list">${done.length ? done.map(taskTemplate).join("") : '<div class="empty">Completed actions collect here until the weekly close.</div>'}</div></article>
      </div>
      <aside class="stack">${goalsCard(activeGoals)}${inboxCard()}<article class="card card-muted"><div class="card-head"><div><p class="eyebrow">Decision hierarchy</p><h2>Protect what matters</h2></div></div><div class="priority-rule"><strong>1</strong><span><b>Project output</b>One meaningful deliverable.</span></div><div class="priority-rule"><strong>2</strong><span><b>Next action</b>The smallest visible movement.</span></div><div class="priority-rule"><strong>3</strong><span><b>Maintenance</b>Only essential responsibilities.</span></div></article></aside>
    </div>`;
}

function goalsCard(goals = state.goals.filter(item => item.status === "active")) {
  return `<article class="card goals-card"><div class="card-head"><div><p class="eyebrow">Goals</p><h2>Direction without task inflation</h2><p>Keep only goals that change current decisions.</p></div><button class="button button-secondary button-small" data-add="goal">+ Goal</button></div><div class="goal-list">${goals.length ? goals.map(goalTemplate).join("") : '<div class="empty">No active goals. Add one only when it clarifies what deserves focus.</div>'}</div></article>`;
}

function goalTemplate(goal) {
  const projectCount = state.projects.filter(item => item.goalId === goal.id && item.status !== "archived").length;
  return `<button class="goal-row" data-edit-goal="${goal.id}"><span><small>${escapeHTML(goal.area)} · ${escapeHTML(goal.horizon)}</small><strong>${escapeHTML(goal.name)}</strong><em>${escapeHTML(goal.evidence || goal.why || "Define the evidence that proves progress.")}</em></span><b>${projectCount} project${projectCount === 1 ? "" : "s"}</b></button>`;
}

function projectsCard(projects = state.projects.filter(item => item.status === "active")) {
  return `<article class="card projects-card"><div class="card-head"><div><p class="eyebrow">Project workspaces</p><h2>Outputs, blockers, decisions</h2><p>Keep the project small enough to reveal its next move.</p></div><div class="card-actions"><button class="button button-secondary button-small" data-add="milestone">+ Milestone</button><button class="button button-primary button-small" data-add="project">+ Project</button></div></div><div class="project-list">${projects.length ? projects.sort((a, b) => b.priority - a.priority).map(projectTemplate).join("") : '<div class="empty">Create a project when a goal needs more than one action to complete.</div>'}</div></article>`;
}

function projectTemplate(project) {
  const tasks = state.tasks.filter(item => item.projectId === project.id);
  const milestones = state.milestones.filter(item => item.projectId === project.id);
  const blockers = state.projectBlockers.filter(item => item.projectId === project.id && item.status !== "resolved");
  const decisions = state.projectDecisions.filter(item => item.projectId === project.id).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  const completedMilestones = milestones.filter(item => item.status === "completed").length;
  const links = project.links.map(link => ({ ...link, safeUrl: safeExternalURL(link.url) })).filter(link => link.safeUrl);
  return `<details class="project-card" ${blockers.length ? "open" : ""}><summary><span><small>${escapeHTML(project.category)} · Priority ${project.priority}</small><strong>${escapeHTML(project.name)}</strong><em>${escapeHTML(project.outcome || "Define the output this project exists to create.")}</em></span><div><b>${completedMilestones}/${milestones.length} milestones</b><i>›</i></div></summary><div class="project-body"><div class="project-progress"><span style="width:${milestones.length ? Math.round((completedMilestones / milestones.length) * 100) : 0}%"></span></div><div class="project-stats"><span>${tasks.filter(item => !item.done).length} open actions</span><span>${blockers.length} blockers</span><span>${decisions.length} decisions</span></div>${blockers.length ? `<div class="project-alerts">${blockers.map(item => `<button data-edit-blocker="${item.id}"><strong>Blocked</strong><span>${escapeHTML(item.text)}</span></button>`).join("")}</div>` : ""}${milestones.length ? `<div class="milestone-list">${milestones.map(item => `<div class="milestone-row ${item.status === "completed" ? "done" : ""}"><button class="check-button ${item.status === "completed" ? "done" : ""}" data-milestone-toggle="${item.id}" aria-label="Toggle milestone"></button><button data-edit-milestone="${item.id}"><strong>${escapeHTML(item.name)}</strong><small>${item.dueDate ? formatCompactDate(item.dueDate) : "No date pressure"}</small></button></div>`).join("")}</div>` : ""}${links.length ? `<div class="project-links">${links.map(link => `<a href="${escapeHTML(link.safeUrl)}" target="_blank" rel="noopener noreferrer">${escapeHTML(link.label)} ↗</a>`).join("")}</div>` : ""}<div class="project-actions"><button class="text-button" data-edit-project="${project.id}">Edit project</button><button class="text-button" data-add="blocker" data-project-id="${project.id}">+ Blocker</button><button class="text-button" data-add="decision" data-project-id="${project.id}">+ Decision</button><button class="text-button" data-add="task" data-project-id="${project.id}">+ Next action</button></div>${decisions.length ? `<div class="decision-log"><small>Latest decision</small><strong>${escapeHTML(decisions[0].text)}</strong><span>${escapeHTML(decisions[0].reason || "Decision recorded")}</span></div>` : ""}</div></details>`;
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
  const metrics = weekMetrics();
  const coach = weeklyCoach();
  document.getElementById("view-review").innerHTML = `
    <div class="page-head"><p class="eyebrow">Life OS + feedback loop</p><h1 id="review-heading">Learn, then adjust.</h1><p>Review the quality of the system—not your worth. Look for patterns across weeks and months.</p></div>
    <div class="review-metrics">${reviewMetric("Evidence", `${metrics.daysChecked} days`, "Check-ins recorded")}${reviewMetric("Energy", metrics.energy ? `${metrics.energy.toFixed(1)}/5` : "—", "Self-reported average")}${reviewMetric("Foundations", `${metrics.routine}%`, "Routine steps kept")}${reviewMetric("Outputs", String(metrics.tasksDone), "Actions completed")}</div>
    ${weeklyCoachCard(coach)}
    <div class="grid two-column"><div class="stack"><article class="card"><div class="card-head"><div><p class="eyebrow">Weekly evidence by area</p><h2>Notice patterns without grading your life</h2><p>These are self-reports for context, not a combined score.</p></div></div><div class="rating-list">${DIMENSIONS.map((item, index) => ratingTemplate(item, index)).join("")}</div></article><article class="card"><div class="card-head"><div><p class="eyebrow">Weekly reflection</p><h2>Close the loop</h2></div></div><div class="reflection-prompts">${reflectionField("win", "What moved forward?", "Name the real win.")}${reflectionField("friction", "Where did friction appear?", "Notice the system, not a character flaw.")}${reflectionField("lesson", "What cue or design will change?", "One environmental or behavioural adjustment.")}${reflectionField("next", "What may matter next week?", "Capture it without overcommitting.")}</div></article><article class="card week-close-card"><div><p class="eyebrow">Weekly rollover</p><h2>Archive the learning. Keep the momentum.</h2><p>Completed work moves into history. Open actions carry forward and the next week starts clean.</p></div><button class="button button-primary" data-close-week>Close this week</button></article></div><aside class="stack">${weeklyFinancialReviewCard()}<article class="card card-muted"><div class="card-head"><div><p class="eyebrow">Life stays visible</p><h2>Protect what work is for</h2></div></div>${lifeField("relationships", "Relationships", "Who needs intentional time?")}${lifeField("enjoyment", "Enjoyment", "Padel, music, socialising, creativity, freedom.")}${lifeField("health", "Health", "Sleep, food, movement, recovery.")}${lifeField("growth", "Growth", "What knowledge will you apply?")}</article>${monthlyEvidenceCard()}<article class="card"><div class="card-head"><div><p class="eyebrow">Monthly strategic review</p><h2>${new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(new Date())}</h2></div></div>${monthlyField("financial", "Financial position", "What changed in cash, commitments, investments, or liabilities?")}${monthlyField("growth", "Personal development", "What changed in capability or character?")}${monthlyField("business", "Business progress", "What value, systems, or revenue moved?")}${monthlyField("lifestyle", "Lifestyle quality", "Is life actually becoming calmer, freer, and fuller?")}${monthlyField("adjustment", "One strategic adjustment", "What single change matters next month?")}${monthlyField("decisions", "Decisions for next month", "What will you start, stop, continue, or deliberately defer?")}</article><article class="card card-muted"><div class="card-head"><div><p class="eyebrow">Recovery decision</p><h2>What does next week need?</h2></div></div><div class="recovery-grid">${[["restore","Restore","Lower load"],["maintain","Maintain","Stay steady"],["expand","Expand","Add stretch"]].map(([key,label,note]) => `<button class="recovery-option ${state.reflection.recovery === key ? "selected" : ""}" data-recovery="${key}"><strong>${label}</strong><small>${note}</small></button>`).join("")}</div></article></aside></div>
    <article class="card history-card"><div class="card-head"><div><p class="eyebrow">System memory</p><h2>Previous weeks</h2><p>Patterns become visible when the system remembers.</p></div><span class="tag">${state.history.length} archived</span></div>${historyView()}</article>`;
}

function weeklyCoachCard(coach) {
  return `<article class="card coach-card"><div class="coach-lead"><p class="eyebrow">Weekly coach</p><h2>${escapeHTML(coach.title)}</h2><p>${escapeHTML(coach.summary)}</p></div><div class="coach-insights">${coach.insights.map((insight, index) => `<div><i>${String(index + 1).padStart(2, "0")}</i><p>${escapeHTML(insight)}</p></div>`).join("")}</div></article>`;
}

function weeklyFinancialReviewCard() {
  const totals = moneyTotals();
  const latest = [...state.finances.reconciliations].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0];
  const age = latest ? Math.max(0, daysFromToday(new Date(latest.date)) * -1) : null;
  const status = age === null ? "Not reconciled yet" : age >= 7 ? `${age} days since the last check` : `Checked ${age === 0 ? "today" : `${age} day${age === 1 ? "" : "s"} ago`}`;
  return `<article class="card weekly-finance-card ${age === null || age >= 7 ? "urgent" : ""}"><div class="card-head"><div><p class="eyebrow">Financial stability</p><h2>${escapeHTML(status)}</h2><p>${currency(totals.personal)} personal · ${currency(totals.business)} business · ${currency(totals.obligations)} liabilities.</p></div><button class="button button-secondary button-small" data-add="reconciliation">Check balances</button></div><div class="weekly-finance-flags"><span>Safe personal <strong>${currency(totals.safeToSpend)}</strong></span><span>Upcoming 30 days <strong>${currency(totals.dueThirty)}</strong></span><span>Repayment plan <strong>${currency(totals.obligationPlan)}</strong></span></div></article>`;
}

function reviewMetric(label, value, note) {
  return `<div class="review-metric"><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`;
}

function historyView() {
  if (!state.history.length) return '<div class="history-empty"><strong>Your first trend starts when you close this week.</strong><span>Nothing is lost before then; current data remains live.</span></div>';
  const recent = state.history.slice(0, 8);
  return `<div class="history-trends">${recent.slice().reverse().map(item => `<div class="trend-column"><div class="trend-bar"><i style="height:${Math.max(8, Math.min(100, Number(item.metrics?.routine || 0)))}%"></i></div><span>${formatCompactDate(item.end)}</span></div>`).join("")}</div><div class="history-list">${recent.map(historyTemplate).join("")}</div>`;
}

function historyTemplate(item) {
  return `<details class="history-item"><summary><span><small>${formatCompactDate(item.start)}–${formatCompactDate(item.end)}</small><strong>${escapeHTML(item.week?.outcome || "Week without a named outcome")}</strong></span><b>${Number(item.metrics?.tasksDone || 0)} moved</b></summary><div class="history-detail"><div><span>Energy</span><strong>${item.metrics?.energy ? Number(item.metrics.energy).toFixed(1) : "—"}</strong></div><div><span>Routine</span><strong>${Number(item.metrics?.routine || 0)}%</strong></div><div><span>Completed</span><strong>${Number(item.metrics?.tasksDone || 0)}</strong></div><p><b>Win</b>${escapeHTML(item.reflection?.win || "No win recorded.")}</p><p><b>Lesson</b>${escapeHTML(item.reflection?.lesson || "No lesson recorded.")}</p></div></details>`;
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
  if (type === "transfer") return state.finances.transfers;
  if (type === "bill") return state.finances.bills;
  if (type === "obligation") return state.finances.obligations;
  if (type === "investment") return state.finances.investments;
  if (type === "contact") return state.life.contacts;
  if (type === "experience") return state.life.experiences;
  if (type === "journal") return state.life.journal;
  if (type === "goal") return state.goals;
  if (type === "project") return state.projects;
  if (type === "milestone") return state.milestones;
  if (type === "blocker") return state.projectBlockers;
  if (type === "decision") return state.projectDecisions;
  if (type === "budget") return state.finances.budgets;
  if (type === "income") return state.finances.incomeForecasts;
  if (type === "savings") return state.finances.savingsGoals;
  if (type === "purchase") return state.finances.plannedPurchases;
  return [];
}

function openEditor(type, id = null, preset = {}) {
  const dialog = document.getElementById("editor-dialog");
  const fields = document.getElementById("dialog-fields");
  const collectionTypes = ["task", "inbox", "maintenance", "cue", "script", "transaction", "transfer", "bill", "obligation", "investment", "contact", "experience", "journal", "goal", "project", "milestone", "blocker", "decision", "budget", "income", "savings", "purchase"];
  const item = collectionTypes.includes(type) && id ? editorCollection(type).find(entry => entry.id === id) : null;
  editor = ["handoffImport", "syncPair"].includes(type) ? { type, payload: id } : { type, id, preset };
  const titles = { task: "Smart action", inbox: "Quick capture", maintenance: "Life maintenance date", cue: "Cue architecture", script: "If–then script", transaction: "Transaction", transfer: "Account transfer", reconciliation: "Weekly reconciliation", allocation: "Receive + allocate income", bill: "Bill + due date", obligation: "Obligation", investment: "Investment", contact: "Relationship intention", experience: "Experience", journal: "Private reflection", goal: "Goal", project: "Project workspace", milestone: "Milestone", blocker: "Project blocker", decision: "Project decision", budget: "Budget line", income: "Income forecast", savings: "Savings goal", purchase: "Next purchase", moneySettings: "Spending guardrails", assistantSettings: "Assistant privacy", routine: `${state.modes[id]?.label || "Routine"} mode`, reminders: "Gentle reminders", security: "App lock", sync: "Device sync", syncPair: "Connect this device", handoff: "Secure phone handoff", handoffImport: "Import secure handoff" };
  document.getElementById("dialog-eyebrow").textContent = ({ routine: "Personalise your system", reminders: "Stay gently connected", security: "Local privacy", sync: "Encrypted private relay", syncPair: "Encrypted private relay", handoff: "Encrypted device transfer", handoffImport: "Encrypted device transfer" })[type] || (id ? "Update your system" : "Add to your system");
  document.getElementById("dialog-title").textContent = titles[type] || "Item";
  document.getElementById("delete-item").classList.toggle("hidden", !(id && collectionTypes.includes(type)));
  document.getElementById("save-item").textContent = ({ sync: cloudSync.namespace ? "Done" : "Start sync + share", syncPair: "Connect this device", handoff: "Create secure link", handoffImport: "Import", security: "Save lock", reminders: "Save reminders", routine: "Save routine" })[type] || "Save";
  if (type === "task") fields.innerHTML = taskEditor(item || preset);
  if (type === "inbox") fields.innerHTML = inboxEditor(item);
  if (type === "maintenance") fields.innerHTML = maintenanceEditor(item);
  if (type === "cue") fields.innerHTML = cueEditor(item);
  if (type === "script") fields.innerHTML = scriptEditor(item);
  if (type === "transaction") fields.innerHTML = transactionEditor(item);
  if (type === "transfer") fields.innerHTML = transferEditor(item);
  if (type === "reconciliation") fields.innerHTML = reconciliationEditor();
  if (type === "allocation") fields.innerHTML = allocationEditor(preset.incomeId);
  if (type === "bill") fields.innerHTML = billEditor(item);
  if (type === "obligation") fields.innerHTML = `<div class="field"><label>Name</label><input name="name" required value="${escapeHTML(item?.name || "")}" /></div><div class="inline-fields"><div class="field"><label>Total owed (£)</label><input name="target" type="number" min="0" step="0.01" required value="${item?.target || ""}" /></div><div class="field"><label>Already restored (£)</label><input name="paid" type="number" min="0" step="0.01" value="${item?.paid || 0}" /></div><div class="field"><label>Planned this month (£)</label><input name="monthlyPayment" type="number" min="0" step="0.01" value="${item?.monthlyPayment || 0}" /></div></div>`;
  if (type === "investment") fields.innerHTML = `<div class="field"><label>Name</label><input name="name" required value="${escapeHTML(item?.name || "")}" /></div><div class="inline-fields"><div class="field"><label>Contributed (£)</label><input name="contributed" type="number" min="0" step="0.01" value="${item?.contributed || 0}" /></div><div class="field"><label>Current value (£)</label><input name="current" type="number" min="0" step="0.01" value="${item?.current || 0}" /></div></div>`;
  if (type === "contact") fields.innerHTML = contactEditor(item);
  if (type === "experience") fields.innerHTML = experienceEditor(item);
  if (type === "journal") fields.innerHTML = journalEditor(item);
  if (type === "goal") fields.innerHTML = goalEditor(item);
  if (type === "project") fields.innerHTML = projectEditor(item);
  if (type === "milestone") fields.innerHTML = milestoneEditor(item || preset);
  if (type === "blocker" || type === "decision") fields.innerHTML = projectRecordEditor(type, item || preset);
  if (type === "budget") fields.innerHTML = budgetEditor(item);
  if (type === "income") fields.innerHTML = incomeEditor(item);
  if (type === "savings") fields.innerHTML = savingsEditor(item);
  if (type === "purchase") fields.innerHTML = purchaseEditor(item);
  if (type === "moneySettings") fields.innerHTML = moneySettingsEditor();
  if (type === "assistantSettings") fields.innerHTML = assistantSettingsEditor();
  if (type === "routine") fields.innerHTML = routineEditor(id);
  if (type === "reminders") fields.innerHTML = remindersEditor();
  if (type === "security") fields.innerHTML = securityEditor();
  if (type === "sync") fields.innerHTML = syncEditor();
  if (type === "syncPair") fields.innerHTML = syncPairEditor();
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
  const dependencyId = item?.dependencyIds?.[0] || "";
  return `<div class="field"><label>Action</label><input name="name" required value="${escapeHTML(item?.name || "")}" /></div><div class="inline-fields"><div class="field"><label>Project</label><select name="projectId"><option value="">No project</option>${state.projects.filter(project => project.status !== "archived").map(project => `<option value="${project.id}" ${item?.projectId === project.id ? "selected" : ""}>${escapeHTML(project.name)}</option>`).join("")}</select></div><div class="field"><label>Goal</label><select name="goalId"><option value="">No direct goal</option>${state.goals.filter(goal => goal.status !== "archived").map(goal => `<option value="${goal.id}" ${item?.goalId === goal.id ? "selected" : ""}>${escapeHTML(goal.name)}</option>`).join("")}</select></div><div class="field"><label>Blocked by</label><select name="dependencyId"><option value="">Nothing</option>${state.tasks.filter(task => !task.done && task.id !== item?.id).map(task => `<option value="${task.id}" ${dependencyId === task.id ? "selected" : ""}>${escapeHTML(task.name)}</option>`).join("")}</select></div></div><div class="inline-fields"><div class="field"><label>Weekly role</label><select name="alignment">${[["primary","Main outcome"],["supporting","Supporting"],["maintenance","Maintenance"]].map(([value,label]) => `<option value="${value}" ${item?.alignment === value ? "selected" : ""}>${label}</option>`).join("")}</select></div><div class="field"><label>Deadline</label><input name="dueDate" type="date" value="${item?.dueDate || ""}" /></div></div><div class="inline-fields"><div class="field"><label>Impact</label><select name="impact">${[1,2,3].map(value => `<option value="${value}" ${Number(item?.impact || 2) === value ? "selected" : ""}>${value}</option>`).join("")}</select></div><div class="field"><label>Complexity</label><select name="complexity">${[1,2,3].map(value => `<option value="${value}" ${Number(item?.complexity || 1) === value ? "selected" : ""}>${value}</option>`).join("")}</select></div><div class="field"><label>Energy</label><select name="energy">${["low","medium","high"].map(value => `<option value="${value}" ${(item?.energy || "medium") === value ? "selected" : ""}>${energyLabel(value)}</option>`).join("")}</select></div></div><div class="field"><label>Minutes</label><input name="duration" type="number" min="5" max="300" step="5" value="${item?.duration || 30}" /></div><div class="task-setup-editor"><div><p class="eyebrow">Automatic start architecture</p><strong>Prepare → place → launch → fallback</strong></div><div class="field"><label>Prepare beforehand</label><textarea name="preparation" placeholder="Pack the bag, open the file, gather the documents…">${escapeHTML(item?.preparation || "")}</textarea></div><div class="field"><label>Put it here</label><textarea name="placement" placeholder="By the door, on the desk, beside breakfast…">${escapeHTML(item?.placement || "")}</textarea></div><div class="field"><label>Start when</label><textarea name="launchCue" placeholder="After meditation, when work ends, after breakfast…">${escapeHTML(item?.launchCue || "")}</textarea></div><div class="field"><label>If the plan breaks</label><textarea name="fallback" placeholder="The minimum version that still keeps momentum.">${escapeHTML(item?.fallback || "")}</textarea></div></div><p class="dialog-note">The scheduler chooses the task. This setup removes the decisions and friction that normally delay starting.</p>`;
}

function goalEditor(item) {
  return `<div class="field"><label>Goal</label><input name="name" required value="${escapeHTML(item?.name || "")}" placeholder="A result that changes meaningful decisions" /></div><div class="inline-fields"><div class="field"><label>Life area</label><select name="area">${["business","money","education","life","health","faith","creative"].map(value => `<option value="${value}" ${(item?.area || "life") === value ? "selected" : ""}>${value[0].toUpperCase() + value.slice(1)}</option>`).join("")}</select></div><div class="field"><label>Horizon</label><select name="horizon">${[["month","Month"],["quarter","Quarter"],["year","Year"],["longterm","Long term"]].map(([value,label]) => `<option value="${value}" ${(item?.horizon || "quarter") === value ? "selected" : ""}>${label}</option>`).join("")}</select></div><div class="field"><label>Target date</label><input name="targetDate" type="date" value="${item?.targetDate || ""}" /></div></div><div class="field"><label>Why this matters</label><textarea name="why">${escapeHTML(item?.why || "")}</textarea></div><div class="field"><label>Evidence of completion</label><textarea name="evidence" required>${escapeHTML(item?.evidence || "")}</textarea></div><div class="field"><label>Status</label><select name="status">${["active","paused","completed","archived"].map(value => `<option value="${value}" ${(item?.status || "active") === value ? "selected" : ""}>${value[0].toUpperCase() + value.slice(1)}</option>`).join("")}</select></div>`;
}

function projectEditor(item) {
  const links = (item?.links || []).map(link => `${link.label} | ${link.url}`).join("\n");
  return `<div class="field"><label>Project name</label><input name="name" required value="${escapeHTML(item?.name || "")}" /></div><div class="inline-fields"><div class="field"><label>Category</label><select name="category">${["business","software","education","creative","personal"].map(value => `<option value="${value}" ${(item?.category || "personal") === value ? "selected" : ""}>${value[0].toUpperCase() + value.slice(1)}</option>`).join("")}</select></div><div class="field"><label>Goal</label><select name="goalId"><option value="">No parent goal</option>${state.goals.filter(goal => goal.status !== "archived").map(goal => `<option value="${goal.id}" ${item?.goalId === goal.id ? "selected" : ""}>${escapeHTML(goal.name)}</option>`).join("")}</select></div><div class="field"><label>Priority</label><select name="priority">${[1,2,3].map(value => `<option value="${value}" ${Number(item?.priority || 2) === value ? "selected" : ""}>${value}</option>`).join("")}</select></div></div><div class="field"><label>Project output</label><textarea name="outcome" required placeholder="What tangible result must this project create?">${escapeHTML(item?.outcome || "")}</textarea></div><div class="inline-fields"><div class="field"><label>Next review</label><input name="nextReviewDate" type="date" value="${item?.nextReviewDate || ""}" /></div><div class="field"><label>Status</label><select name="status">${["active","paused","completed","archived"].map(value => `<option value="${value}" ${(item?.status || "active") === value ? "selected" : ""}>${value[0].toUpperCase() + value.slice(1)}</option>`).join("")}</select></div></div><div class="field"><label>Working notes</label><textarea name="notes">${escapeHTML(item?.notes || "")}</textarea></div><div class="field"><label>Links (one per line)</label><textarea name="links" placeholder="Repository | https://github.com/…">${escapeHTML(links)}</textarea></div>`;
}

function projectSelect(name, selected = "") {
  return `<div class="field"><label>Project</label><select name="${name}" required><option value="">Choose a project</option>${state.projects.filter(project => project.status !== "archived").map(project => `<option value="${project.id}" ${selected === project.id ? "selected" : ""}>${escapeHTML(project.name)}</option>`).join("")}</select></div>`;
}

function milestoneEditor(item) {
  return `${projectSelect("projectId", item?.projectId)}<div class="field"><label>Milestone</label><input name="name" required value="${escapeHTML(item?.name || "")}" placeholder="A verifiable deliverable" /></div><div class="inline-fields"><div class="field"><label>Target date</label><input name="dueDate" type="date" value="${item?.dueDate || ""}" /></div><div class="field"><label>Status</label><select name="status"><option value="open" ${item?.status !== "completed" ? "selected" : ""}>Open</option><option value="completed" ${item?.status === "completed" ? "selected" : ""}>Completed</option></select></div></div>`;
}

function projectRecordEditor(type, item) {
  const isBlocker = type === "blocker";
  return `${projectSelect("projectId", item?.projectId)}<div class="field"><label>${isBlocker ? "What is blocking movement?" : "Decision"}</label><textarea name="text" required>${escapeHTML(item?.text || "")}</textarea></div><div class="field"><label>${isBlocker ? "Resolution note" : "Reason or trade-off"}</label><textarea name="reason">${escapeHTML(item?.reason || "")}</textarea></div>${isBlocker ? `<div class="field"><label>Status</label><select name="status"><option value="open" ${item?.status !== "resolved" ? "selected" : ""}>Open</option><option value="resolved" ${item?.status === "resolved" ? "selected" : ""}>Resolved</option></select></div>` : ""}`;
}

function budgetEditor(item) {
  return `<div class="field"><label>Budget line</label><input name="name" required value="${escapeHTML(item?.name || "")}" placeholder="Food, transport, personal spending…" /></div><div class="inline-fields"><div class="field"><label>Transaction category</label><input name="category" value="${escapeHTML(item?.category || item?.name || "Other")}" /></div><div class="field"><label>Account</label><select name="account"><option value="personal" ${item?.account !== "business" ? "selected" : ""}>Personal</option><option value="business" ${item?.account === "business" ? "selected" : ""}>Business</option></select></div><div class="field"><label>Starting month</label><input name="month" type="month" value="${item?.month || monthKey()}" /></div></div><div class="field"><label>Planned amount (£)</label><input name="amount" type="number" min="0" step="0.01" required value="${item?.amount ?? ""}" /></div><label class="toggle-row"><span><strong>Repeat every month</strong><small>Keep this budget active until you edit or delete it</small></span><input name="recurring" type="checkbox" ${item?.recurring ? "checked" : ""} /><i></i></label><label class="toggle-row"><span><strong>Protect the remaining amount</strong><small>Subtract what is still unspent from safe-to-spend</small></span><input name="protect" type="checkbox" ${item?.protect ? "checked" : ""} /><i></i></label>`;
}

function incomeEditor(item) {
  return `<div class="field"><label>Income source</label><input name="source" required value="${escapeHTML(item?.source || "")}" placeholder="Student Finance, invoice, salary…" /></div><div class="inline-fields"><div class="field"><label>Amount (£)</label><input name="amount" type="number" min="0" step="0.01" required value="${item?.amount ?? ""}" /></div><div class="field"><label>Expected date</label><input name="expectedDate" type="date" value="${item?.expectedDate || ""}" /></div></div><div class="inline-fields"><div class="field"><label>Status</label><select name="status">${[["expected","Expected"],["confirmed","Confirmed"],["received","Received"],["cancelled","Cancelled"]].map(([value,label]) => `<option value="${value}" ${(item?.status || "expected") === value ? "selected" : ""}>${label}</option>`).join("")}</select></div><div class="field"><label>Account</label><select name="account"><option value="personal" ${item?.account !== "business" ? "selected" : ""}>Personal</option><option value="business" ${item?.account === "business" ? "selected" : ""}>Business</option></select></div></div><div class="field"><label>Notes</label><textarea name="notes">${escapeHTML(item?.notes || "")}</textarea></div><p class="dialog-note">Even “received” income stays separate from cash balances until you record the matching transaction. This prevents silent balance changes.</p>`;
}

function savingsEditor(item) {
  return `<div class="field"><label>Savings goal</label><input name="name" required value="${escapeHTML(item?.name || "")}" /></div><div class="inline-fields"><div class="field"><label>Target (£)</label><input name="target" type="number" min="0" step="0.01" required value="${item?.target ?? ""}" /></div><div class="field"><label>Already protected (£)</label><input name="saved" type="number" min="0" step="0.01" value="${item?.saved ?? 0}" /></div><div class="field"><label>Optional deadline</label><input name="deadline" type="date" value="${item?.deadline || ""}" /></div></div><div class="field"><label>Status</label><select name="status">${["active","completed","paused"].map(value => `<option value="${value}" ${(item?.status || "active") === value ? "selected" : ""}>${value[0].toUpperCase() + value.slice(1)}</option>`).join("")}</select></div>`;
}

function purchaseEditor(item) {
  return `<div class="field"><label>What are you planning to buy?</label><input name="name" required value="${escapeHTML(item?.name || "")}" placeholder="Item name" /></div><div class="field"><label>Product link</label><input name="url" type="url" inputmode="url" value="${escapeHTML(item?.url || "")}" placeholder="https://…" /></div><div class="inline-fields"><div class="field"><label>Price (£)</label><input name="amount" type="number" min="0" step="0.01" value="${item?.amount ?? ""}" placeholder="0.00" /></div><div class="field"><label>Pay from</label><select name="account"><option value="personal" ${item?.account !== "business" ? "selected" : ""}>Personal</option><option value="business" ${item?.account === "business" ? "selected" : ""}>Business</option></select></div><div class="field"><label>Target date</label><input name="targetDate" type="date" value="${item?.targetDate || ""}" /></div></div><div class="inline-fields"><div class="field"><label>Purpose</label><select name="category">${[["essential","Essential"],["useful","Useful"],["enjoyment","Enjoyment"],["business","Business"],["personal","Personal"]].map(([value,label]) => `<option value="${value}" ${(item?.category || "useful") === value ? "selected" : ""}>${label}</option>`).join("")}</select></div><div class="field"><label>Priority</label><select name="priority">${[["next","Next"],["soon","Soon"],["later","Later"]].map(([value,label]) => `<option value="${value}" ${(item?.priority || "soon") === value ? "selected" : ""}>${label}</option>`).join("")}</select></div><div class="field"><label>Status</label><select name="status">${[["planned","Planned"],["bought","Bought"],["archived","Archived"]].map(([value,label]) => `<option value="${value}" ${(item?.status || "planned") === value ? "selected" : ""}>${label}</option>`).join("")}</select></div></div><label class="toggle-row"><span><strong>Protect this money</strong><small>Subtract the price from safe-to-spend while this purchase is planned</small></span><input name="reserved" type="checkbox" ${item?.reserved ? "checked" : ""} /><i></i></label><div class="field"><label>Decision notes</label><textarea name="notes" placeholder="Why it matters, size, model, cheaper alternative…">${escapeHTML(item?.notes || "")}</textarea></div><p class="dialog-note">Planning or marking a purchase bought never moves cash automatically. Add a transaction only when money actually leaves the account.</p>`;
}

function inboxEditor(item) {
  return `<div class="field"><label>What do you want to hold?</label><textarea name="text" required placeholder="Idea, concern, reminder, or something to revisit.">${escapeHTML(item?.text || "")}</textarea></div><div class="field"><label>Type</label><select name="type">${["idea","task","concern","later"].map(value => `<option value="${value}" ${item?.type === value ? "selected" : ""}>${value[0].toUpperCase() + value.slice(1)}</option>`).join("")}</select></div><p class="dialog-note">Capturing this does not make it a commitment. Review it during weekly planning.</p>`;
}

function maintenanceEditor(item) {
  return `<div class="field"><label>What needs remembering?</label><input name="name" required value="${escapeHTML(item?.name || "")}" placeholder="Dentist, birthday, MOT, passport…" /></div><div class="inline-fields"><div class="field"><label>Category</label><select name="category">${[["appointment","Appointment"],["birthday","Birthday"],["renewal","Renewal"],["car","Car"],["document","Document"],["health","Health"],["home","Home"],["other","Other"]].map(([value,label]) => `<option value="${value}" ${item?.category === value ? "selected" : ""}>${label}</option>`).join("")}</select></div><div class="field"><label>Date</label><input name="dueDate" type="date" required value="${item?.dueDate || dayKey()}" /></div><div class="field"><label>Repeats</label><select name="recurrence">${[["oneoff","One-off"],["annual","Every year"],["monthly","Every month"]].map(([value,label]) => `<option value="${value}" ${item?.recurrence === value ? "selected" : ""}>${label}</option>`).join("")}</select></div></div><div class="field"><label>Remind me before</label><select name="remindDays">${[[0,"On the day"],[1,"1 day"],[3,"3 days"],[7,"7 days"],[14,"14 days"],[30,"30 days"],[60,"60 days"]].map(([value,label]) => `<option value="${value}" ${Number(item?.remindDays ?? 7) === value ? "selected" : ""}>${label}</option>`).join("")}</select></div><div class="field"><label>Useful details</label><textarea name="notes" placeholder="Location, document needed, person to contact…">${escapeHTML(item?.notes || "")}</textarea></div>`;
}

function contactEditor(item) {
  return `<div class="field"><label>Name</label><input name="name" required value="${escapeHTML(item?.name || "")}" placeholder="Who do you want to stay connected with?" /></div><div class="inline-fields"><div class="field"><label>Relationship</label><input name="relationship" value="${escapeHTML(item?.relationship || "")}" placeholder="Friend, family, network…" /></div><div class="field"><label>Optional reminder</label><input name="nextContactDate" type="date" value="${item?.nextContactDate || ""}" /></div></div><div class="field"><label>Relationship intention</label><textarea name="intention" placeholder="Call properly, create a link-up, check how they are…">${escapeHTML(item?.intention || "")}</textarea></div><div class="field"><label>Private context</label><textarea name="notes" placeholder="Only record details that are genuinely useful and respectful.">${escapeHTML(item?.notes || "")}</textarea></div><div class="field"><label>Status</label><select name="status">${[["active","Active"],["paused","Paused"],["archived","Archived"]].map(([value,label]) => `<option value="${value}" ${(item?.status || "active") === value ? "selected" : ""}>${label}</option>`).join("")}</select></div><p class="dialog-note">This is a reminder for your intention, not a score for the person or relationship.</p>`;
}

function experienceEditor(item) {
  return `<div class="field"><label>Experience</label><input name="name" required value="${escapeHTML(item?.name || "")}" placeholder="Padel, dinner, day trip, creative session…" /></div><div class="inline-fields"><div class="field"><label>Type</label><select name="category">${[["social","Social"],["outing","Outing"],["travel","Travel"],["hobby","Hobby"],["celebration","Celebration"],["personal","Personal"]].map(([value,label]) => `<option value="${value}" ${(item?.category || "personal") === value ? "selected" : ""}>${label}</option>`).join("")}</select></div><div class="field"><label>Optional date</label><input name="targetDate" type="date" value="${item?.targetDate || ""}" /></div><div class="field"><label>Estimated cost (£)</label><input name="costEstimate" type="number" min="0" step="0.01" value="${Number(item?.costEstimate) || 0}" /></div></div><div class="field"><label>Status</label><select name="status">${[["idea","Idea"],["planned","Planned"],["completed","Completed"],["archived","Archived"]].map(([value,label]) => `<option value="${value}" ${(item?.status || "idea") === value ? "selected" : ""}>${label}</option>`).join("")}</select></div><div class="field"><label>Useful details</label><textarea name="notes" placeholder="Who, where, what would make it enjoyable, or a free alternative.">${escapeHTML(item?.notes || "")}</textarea></div><p class="dialog-note">Experiences do not need to be expensive, social, or productive to belong in your life.</p>`;
}

function journalEditor(item) {
  return `<div class="inline-fields"><div class="field"><label>Date</label><input name="date" type="date" required value="${item?.date || dayKey()}" /></div><div class="field"><label>Type</label><select name="type">${[["reflection","Reflection"],["faith","Faith"],["gratitude","Gratitude"],["pattern","Pattern"],["memory","Memory"]].map(([value,label]) => `<option value="${value}" ${(item?.type || "reflection") === value ? "selected" : ""}>${label}</option>`).join("")}</select></div></div><div class="field"><label>Reflection</label><textarea name="content" required rows="8" placeholder="Write only what is useful to remember or understand.">${escapeHTML(item?.content || "")}</textarea></div><label class="toggle-row"><span><strong>Mark as private</strong><small>Encrypted during sync and secure handoff; standard JSON exports remain readable</small></span><input name="private" type="checkbox" ${item?.private !== false ? "checked" : ""} /><i></i></label>`;
}

function cueEditor(item) {
  return `<div class="field"><label>Behaviour</label><input name="name" required value="${escapeHTML(item?.name || "")}" /></div><div class="field"><label>When this happens</label><textarea name="cue" required>${escapeHTML(item?.cue || "")}</textarea></div><div class="field"><label>I immediately</label><textarea name="response" required>${escapeHTML(item?.response || "")}</textarea></div><div class="field"><label>Install this positive cue</label><textarea name="setup" required>${escapeHTML(item?.setup || "")}</textarea></div><div class="field"><label>Remove this competing cue</label><textarea name="remove" required>${escapeHTML(item?.remove || "")}</textarea></div>`;
}

function scriptEditor(item) {
  return `<div class="field"><label>If</label><textarea name="trigger" required>${escapeHTML(item?.trigger || "")}</textarea></div><div class="field"><label>Then</label><textarea name="response" required>${escapeHTML(item?.response || "")}</textarea></div>`;
}

function transactionEditor(item) {
  const budgets = currentBudgetItems();
  return `<div class="inline-fields"><div class="field"><label>Type</label><select name="type"><option value="expense" ${item?.type === "expense" ? "selected" : ""}>Expense</option><option value="income" ${item?.type === "income" ? "selected" : ""}>Income</option></select></div><div class="field"><label>Account</label><select name="account">${[["personal","Personal"],["business","Business"],["held","Held for others"]].map(([value,label]) => `<option value="${value}" ${item?.account === value ? "selected" : ""}>${label}</option>`).join("")}</select></div><div class="field"><label>Date</label><input name="date" type="date" required value="${item?.date || dayKey()}" /></div></div><div class="field"><label>Amount (£)</label><input name="amount" type="number" min="0.01" step="0.01" required value="${item?.amount || ""}" /></div><div class="inline-fields"><div class="field"><label>Category</label><input name="category" required value="${escapeHTML(item?.category || "Other")}" placeholder="Food, transport, income…" /></div><div class="field"><label>Budget line</label><select name="budgetId"><option value="">Not assigned</option>${budgets.map(budget => `<option value="${budget.id}" ${item?.budgetId === budget.id ? "selected" : ""}>${escapeHTML(budget.name)} · ${escapeHTML(budget.account)}</option>`).join("")}</select></div></div><div class="field"><label>Note</label><input name="note" value="${escapeHTML(item?.note || "")}" placeholder="What was this for?" /></div>`;
}

function transferEditor(item) {
  return `<div class="inline-fields"><div class="field"><label>From</label><select name="fromAccount">${[["personal","Personal"],["business","Business"],["held","Held for others"]].map(([value,label]) => `<option value="${value}" ${(item?.fromAccount || "personal") === value ? "selected" : ""}>${label}</option>`).join("")}</select></div><div class="field"><label>To</label><select name="toAccount">${[["personal","Personal"],["business","Business"],["held","Held for others"]].map(([value,label]) => `<option value="${value}" ${(item?.toAccount || "business") === value ? "selected" : ""}>${label}</option>`).join("")}</select></div><div class="field"><label>Date</label><input name="date" type="date" required value="${item?.date || dayKey()}" /></div></div><div class="field"><label>Amount (£)</label><input name="amount" type="number" min="0.01" step="0.01" required value="${item?.amount || ""}" /></div><div class="field"><label>Note</label><input name="note" value="${escapeHTML(item?.note || "")}" placeholder="Why is this money moving?" /></div><p class="dialog-note">A transfer reduces one account and increases the other by the same amount. It never counts as income.</p>`;
}

function reconciliationEditor() {
  const totals = moneyTotals();
  return `<div class="reconciliation-intro"><strong>Compare recorded cash with the real account balances</strong><p>Differences can be added as clearly labelled adjustment transactions, preserving the audit trail.</p></div><div class="inline-fields"><div class="field"><label>Date checked</label><input name="date" type="date" required value="${dayKey()}" /></div><div class="field"><label>Actual personal (£)</label><input name="actualPersonal" type="number" step="0.01" required value="${totals.personal}" /></div></div><div class="inline-fields"><div class="field"><label>Actual business (£)</label><input name="actualBusiness" type="number" step="0.01" required value="${totals.business}" /></div><div class="field"><label>Actual held for others (£)</label><input name="actualHeld" type="number" step="0.01" required value="${totals.held}" /></div></div><div class="field"><label>Notes</label><textarea name="notes" placeholder="Missing transaction, bank fee, cash movement to investigate…"></textarea></div><label class="toggle-row"><span><strong>Apply differences to the ledger</strong><small>Create auditable reconciliation adjustments instead of rewriting balances</small></span><input name="applyAdjustments" type="checkbox" checked /><i></i></label>`;
}

function allocationEditor(incomeId) {
  const income = state.finances.incomeForecasts.find(item => item.id === incomeId);
  if (!income) return `<div class="empty">This income forecast is no longer available.</div>`;
  return `<div class="allocation-intro"><strong>${escapeHTML(income.source)} · ${currency(income.amount)}</strong><p>Allocate the full received amount. The receipt is recorded once; business allocation becomes a linked transfer; protected personal allocations stay outside safe-to-spend until released.</p></div><input type="hidden" name="incomeId" value="${income.id}" /><div class="allocation-editor-grid"><div class="field"><label>Essentials (£)</label><input name="essentials" type="number" min="0" step="0.01" value="0" /></div><div class="field"><label>Reserve (£)</label><input name="reserve" type="number" min="0" step="0.01" value="0" /></div><div class="field"><label>Repayments (£)</label><input name="repayments" type="number" min="0" step="0.01" value="0" /></div><div class="field"><label>Business (£)</label><input name="business" type="number" min="0" step="0.01" value="${income.account === "business" ? income.amount : 0}" /></div><div class="field"><label>Personal spending (£)</label><input name="personal" type="number" min="0" step="0.01" value="${income.account === "personal" ? income.amount : 0}" /></div></div><p class="dialog-note">The five amounts must total exactly ${currency(income.amount)}. Nothing changes until you save this confirmed plan.</p>`;
}

function billEditor(item) {
  const frequency = item?.frequency || "monthly";
  const monthNames = Array.from({ length: 12 }, (_, index) => new Intl.DateTimeFormat("en-GB", { month: "long" }).format(new Date(2024, index, 1)));
  return `<div class="field"><label>Bill name</label><input name="name" required value="${escapeHTML(item?.name || "")}" placeholder="Rent, phone, insurance…" /></div><div class="inline-fields bill-core-fields"><div class="field"><label>Amount (£)</label><input name="amount" type="number" min="0.01" step="0.01" required value="${item?.amount ?? ""}" /></div><div class="field"><label>Repeats</label><select name="frequency" data-bill-frequency>${[["monthly","Monthly"],["annual","Yearly"],["oneoff","One-off"]].map(([value,label]) => `<option value="${value}" ${frequency === value ? "selected" : ""}>${label}</option>`).join("")}</select></div></div><div class="bill-date-group" data-bill-date="monthly"><div class="field"><label>Due day each month</label><input name="dueDayMonthly" type="number" inputmode="numeric" min="1" max="31" value="${item?.dueDay || new Date().getDate()}" /></div></div><div class="bill-date-group" data-bill-date="annual"><div class="inline-fields"><div class="field"><label>Due month</label><select name="dueMonth">${monthNames.map((name,index) => `<option value="${index + 1}" ${Number(item?.dueMonth || new Date().getMonth() + 1) === index + 1 ? "selected" : ""}>${name}</option>`).join("")}</select></div><div class="field"><label>Due day</label><input name="dueDayAnnual" type="number" inputmode="numeric" min="1" max="31" value="${item?.dueDay || new Date().getDate()}" /></div></div></div><div class="bill-date-group" data-bill-date="oneoff"><div class="field"><label>Due date</label><input name="dueDate" type="date" value="${item?.dueDate || dayKey()}" /></div></div><div class="inline-fields"><div class="field"><label>Type</label><select name="billKind">${[["essential","Essential"],["subscription","Subscription"],["flexible","Flexible"]].map(([value,label]) => `<option value="${value}" ${(item?.kind || "essential") === value ? "selected" : ""}>${label}</option>`).join("")}</select></div><div class="field"><label>Paid from</label><select name="account"><option value="personal" ${item?.account !== "business" ? "selected" : ""}>Personal</option><option value="business" ${item?.account === "business" ? "selected" : ""}>Business</option></select></div><div class="field"><label>Remind me before</label><select name="remindDays">${[[0,"On the day"],[1,"1 day"],[3,"3 days"],[7,"7 days"],[14,"14 days"]].map(([value,label]) => `<option value="${value}" ${Number(item?.remindDays ?? 3) === value ? "selected" : ""}>${label}</option>`).join("")}</select></div></div><label class="toggle-row"><span><strong>Due date confirmed</strong><small>Only confirmed dates can create overdue or due-soon alerts</small></span><input name="dueConfirmed" type="checkbox" ${item?.dueConfirmed ? "checked" : ""} /><i></i></label><label class="toggle-row"><span><strong>Paid automatically</strong><small>Label this as autopay in the calendar</small></span><input name="autopay" type="checkbox" ${item?.autopay ? "checked" : ""} /><i></i></label><p class="dialog-note">Use a spending budget—not a bill—for food, transport, or flexible monthly limits.</p>`;
}

function moneySettingsEditor() {
  return `<div class="field"><label>Cash reserve floor (£)</label><input name="reserveTarget" type="number" min="0" step="10" required value="${Number(state.finances.settings.reserveTarget) || 0}" /></div><div class="field"><label>Monthly enjoyment allowance (£)</label><input name="enjoymentAllowance" type="number" min="0" step="5" value="${Number(state.finances.settings.enjoymentAllowance) || 0}" /></div><p class="dialog-note">Personal safe-to-spend uses personal cash only, then protects genuine bills, remaining protected budgets, the reserve floor, planned repayments, active income allocations and reserved purchases. Expected income, investments, business cash and money held for others remain excluded.</p>`;
}

function assistantSettingsEditor() {
  const settings = state.preferences.assistant;
  return `<div class="assistant-privacy-panel"><strong>Current provider: Private local analysis</strong><p>The built-in assistant works without sending records to an external AI model.</p></div><label class="toggle-row"><span><strong>Financial summaries</strong><small>Allow the local assistant to use classified money totals</small></span><input name="shareFinancial" type="checkbox" ${settings.shareFinancial ? "checked" : ""} /><i></i></label><label class="toggle-row"><span><strong>Life + relationship reminders</strong><small>Allow local suggestions to mention voluntary connection intentions</small></span><input name="shareLife" type="checkbox" ${settings.shareLife ? "checked" : ""} /><i></i></label><label class="toggle-row"><span><strong>Private journal content</strong><small>Off by default and not used by the current assistant</small></span><input name="shareJournal" type="checkbox" ${settings.shareJournal ? "checked" : ""} /><i></i></label><p class="dialog-note">If an external model provider is added later, it must use these permissions and show exactly what will be shared before sending anything.</p>`;
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
  return `<div class="routine-step-editor"><div class="step-order"><span>${index + 1}</span><button type="button" data-move-step="up" aria-label="Move up">↑</button><button type="button" data-move-step="down" aria-label="Move down">↓</button></div><div class="step-fields"><input name="stepName" required value="${escapeHTML(step[0])}" placeholder="Step name" /><input name="stepCue" required value="${escapeHTML(step[1])}" placeholder="When this event happens…" /><input name="stepFallback" required value="${escapeHTML(step[3] || "Do the smallest useful version.")}" placeholder="If the plan breaks, do this…" /><div class="step-duration"><input name="stepDuration" type="number" min="1" max="300" required value="${Number(step[2]) || 5}" /><span>min</span></div></div><button class="step-remove" type="button" data-remove-routine-step aria-label="Remove step">×</button></div>`;
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

function syncEditor() {
  if (!cloudSync.namespace) {
    return `<div class="sync-intro"><span class="sync-orb">↻</span><div><strong>Keep phone and desktop together</strong><p>Your Life OS is encrypted on this device before syncing. The relay stores unreadable data; the private key stays inside your pairing link.</p></div></div><div class="sync-promise-grid"><div><span>01</span><strong>Start here</strong><small>Use the device with your latest data.</small></div><div><span>02</span><strong>Share link</strong><small>Open the private pairing link on your other device.</small></div><div><span>03</span><strong>Stay current</strong><small>Changes sync whenever either app is open.</small></div></div><p class="dialog-note">For your current mobile updates, start this on the phone first. Keep the pairing link private: it unlocks your encrypted sync.</p>`;
  }
  const conflict = cloudSync.conflict || syncPhase === "conflict";
  const status = conflict ? "Two devices changed before they could sync" : syncPhase === "syncing" ? "Syncing your latest changes…" : cloudSync.dirty ? "Changes saved here and waiting to sync" : `Up to date${cloudSync.lastSyncedAt ? ` · ${formatSyncTime(cloudSync.lastSyncedAt)}` : ""}`;
  return `<div class="sync-intro ${conflict ? "sync-conflict" : "sync-connected"}"><span class="sync-orb">${conflict ? "!" : "✓"}</span><div><strong>${conflict ? "Choose which copy to keep" : "Encrypted sync is connected"}</strong><p>${status}</p></div></div>${conflict ? `<div class="sync-conflict-actions"><button class="button button-primary button-wide" type="button" data-sync-use-local>Keep this device's copy</button><button class="button button-secondary button-wide" type="button" data-sync-use-cloud>Use the other device's copy</button></div><p class="dialog-note">Nothing is overwritten until you choose. If unsure, export a backup first.</p>` : `<div class="sync-control-list"><button class="sync-control" type="button" data-sync-now><span><strong>Sync now</strong><small>Check for updates immediately</small></span><b>↻</b></button><button class="sync-control" type="button" data-sync-share><span><strong>Share pairing link</strong><small>Send the private encrypted link</small></span><b>↗</b></button><button class="sync-control" type="button" data-sync-copy><span><strong>Copy pairing link</strong><small>Paste it into the other device</small></span><b>⧉</b></button><button class="sync-control sync-control-danger" type="button" data-sync-disconnect><span><strong>Disconnect this device</strong><small>Data remains safely stored here</small></span><b>×</b></button></div><p class="dialog-note">Changes are saved locally first, so the app still works offline. Sync resumes when the app is open and connected.</p>`}`;
}

function syncPairEditor() {
  return `<div class="sync-intro sync-connected"><span class="sync-orb">↻</span><div><strong>Private sync invitation found</strong><p>Connect this device and load the latest encrypted Life OS copy.</p></div></div><div class="sync-promise-grid sync-pair-grid"><div><span>✓</span><strong>End-to-end encrypted</strong><small>The decryption key is in this private link, not the relay.</small></div><div><span>✓</span><strong>Local-first</strong><small>Your app keeps working even when you are offline.</small></div></div><p class="dialog-note">Connecting replaces the Life OS data currently saved in this browser. Local app-lock settings stay on this device.</p>`;
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
    const steps = [...form.querySelectorAll(".routine-step-editor")].map(row => [row.querySelector('[name="stepName"]').value.trim(), row.querySelector('[name="stepCue"]').value.trim(), Math.max(1, Number(row.querySelector('[name="stepDuration"]').value) || 5), row.querySelector('[name="stepFallback"]').value.trim() || "Do the smallest useful version."]).filter(step => step[0]);
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
  if (editor.type === "assistantSettings") {
    state.preferences.assistant = { provider: "local", shareFinancial: form.elements.shareFinancial.checked, shareLife: form.elements.shareLife.checked, shareJournal: form.elements.shareJournal.checked };
    saveState("Assistant privacy updated");
    return true;
  }
  if (editor.type === "sync") {
    if (!cloudSync.namespace) await startCloudSync();
    return true;
  }
  if (editor.type === "syncPair") {
    if (!confirm("Connect this device and replace its current Life OS data with the synced copy?")) return false;
    await connectCloudSync(editor.payload);
    return true;
  }
  if (editor.type === "moneySettings") {
    state.finances.settings.reserveTarget = Math.max(0, Number(data.reserveTarget) || 0);
    state.finances.settings.reserveTargetMinor = toMinor(state.finances.settings.reserveTarget);
    state.finances.settings.enjoymentAllowance = Math.max(0, Number(data.enjoymentAllowance) || 0);
    state.finances.settings.enjoymentAllowanceMinor = toMinor(state.finances.settings.enjoymentAllowance);
    saveState("Spending guardrails updated");
    render();
    return true;
  }
  if (editor.type === "reconciliation") {
    const totals = moneyTotals();
    const recordedMinor = { personal: totals.minor.personal, business: totals.minor.business, held: totals.minor.held };
    const actualMinor = { personal: toMinor(data.actualPersonal), business: toMinor(data.actualBusiness), held: toMinor(data.actualHeld) };
    const differencesMinor = Object.fromEntries(Object.keys(recordedMinor).map(account => [account, actualMinor[account] - recordedMinor[account]]));
    const reconciliation = { id: crypto.randomUUID(), date: data.date || dayKey(), recordedMinor, actualMinor, differencesMinor, applied: form.elements.applyAdjustments.checked, adjustmentIds: [], notes: data.notes.trim(), createdAt: new Date().toISOString() };
    if (reconciliation.applied) {
      Object.entries(differencesMinor).forEach(([account, differenceMinor]) => {
        if (!differenceMinor) return;
        const adjustment = { id: crypto.randomUUID(), type: differenceMinor > 0 ? "income" : "expense", account, date: reconciliation.date, amount: fromMinor(Math.abs(differenceMinor)), amountMinor: Math.abs(differenceMinor), category: "Reconciliation adjustment", budgetId: "", forecastId: "", reconciliationId: reconciliation.id, note: `Balance correction from weekly reconciliation${data.notes.trim() ? ` · ${data.notes.trim()}` : ""}`, createdAt: new Date().toISOString() };
        state.finances.transactions.push(adjustment);
        reconciliation.adjustmentIds.push(adjustment.id);
      });
    }
    state.finances.reconciliations.unshift(reconciliation);
    state.finances.reconciliations = state.finances.reconciliations.slice(0, 104);
    saveState(reconciliation.adjustmentIds.length ? "Balances reconciled with an auditable correction" : "Weekly balance check saved");
    render();
    return true;
  }
  if (editor.type === "allocation") {
    const income = state.finances.incomeForecasts.find(item => item.id === data.incomeId);
    if (!income) return showToast("That income forecast is no longer available"), false;
    if (state.finances.incomeAllocations.some(item => item.incomeId === income.id)) return showToast("This income already has an allocation plan"), false;
    const buckets = { essentialsMinor: toMinor(data.essentials), reserveMinor: toMinor(data.reserve), repaymentsMinor: toMinor(data.repayments), businessMinor: toMinor(data.business), personalMinor: toMinor(data.personal) };
    const allocatedMinor = Object.values(buckets).reduce((sum, value) => sum + value, 0);
    const amountMinor = minorValue(income, "amountMinor", "amount");
    if (allocatedMinor !== amountMinor) return showToast(`Allocate exactly ${currency(income.amount)}`), false;
    const allocation = { id: crypto.randomUUID(), incomeId: income.id, sourceAccount: income.account, amount: income.amount, amountMinor, ...buckets, status: "active", transferId: "", createdAt: new Date().toISOString(), releasedAt: "" };
    if (!state.finances.transactions.some(item => item.forecastId === income.id)) {
      state.finances.transactions.push({ id: crypto.randomUUID(), type: "income", account: income.account, date: income.receivedAt ? String(income.receivedAt).slice(0, 10) : dayKey(), amount: income.amount, amountMinor, category: "Received income", budgetId: "", forecastId: income.id, reconciliationId: "", note: income.source, createdAt: new Date().toISOString() });
    }
    const personalDestinationMinor = buckets.essentialsMinor + buckets.reserveMinor + buckets.repaymentsMinor + buckets.personalMinor;
    const transferMinor = income.account === "personal" ? buckets.businessMinor : personalDestinationMinor;
    if (transferMinor > 0) {
      const transfer = { id: crypto.randomUUID(), fromAccount: income.account, toAccount: income.account === "personal" ? "business" : "personal", amount: fromMinor(transferMinor), amountMinor: transferMinor, date: dayKey(), note: `Allocation from ${income.source}`, allocationId: allocation.id, createdAt: new Date().toISOString() };
      state.finances.transfers.push(transfer);
      allocation.transferId = transfer.id;
    }
    income.status = "received";
    income.receivedAt ||= new Date().toISOString();
    state.finances.incomeAllocations.push(allocation);
    saveState("Income received, allocated, and recorded once");
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
  if (editor.type === "purchase" && data.url.trim() && !safeExternalURL(data.url)) return showToast("Use a valid http or https product link"), false;
  const collection = editorCollection(editor.type);
  let item = editor.id ? collection.find(entry => entry.id === editor.id) : null;
  if (!item) {
    item = { id: crypto.randomUUID() };
    collection.push(item);
  }
  if (editor.type === "task") {
    const nextSetup = { preparation: data.preparation.trim(), placement: data.placement.trim(), launchCue: data.launchCue.trim(), fallback: data.fallback.trim() };
    const setupChanged = Object.entries(nextSetup).some(([key, value]) => item[key] !== value);
    Object.assign(item, { name: data.name.trim(), impact: Number(data.impact), complexity: Number(data.complexity), energy: data.energy, duration: Number(data.duration), dueDate: data.dueDate || "", alignment: data.alignment, projectId: data.projectId || "", goalId: data.goalId || "", dependencyIds: data.dependencyId ? [data.dependencyId] : [], ...nextSetup, createdAt: item.createdAt || new Date().toISOString(), done: item.done || false });
    const daily = todayState();
    if (setupChanged && daily.tomorrowTaskId === item.id) daily.tomorrowReady = false;
  }
  if (editor.type === "inbox") Object.assign(item, { text: data.text.trim(), type: data.type, createdAt: item.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() });
  if (editor.type === "maintenance") Object.assign(item, { name: data.name.trim(), category: data.category, dueDate: data.dueDate, recurrence: data.recurrence, remindDays: Number(data.remindDays), notes: data.notes.trim(), createdAt: item.createdAt || new Date().toISOString(), completedPeriods: item.completedPeriods || [] });
  if (editor.type === "cue") Object.assign(item, { name: data.name.trim(), cue: data.cue.trim(), response: data.response.trim(), setup: data.setup.trim(), remove: data.remove.trim() });
  if (editor.type === "script") Object.assign(item, { trigger: data.trigger.trim(), response: data.response.trim() });
  if (editor.type === "transaction") {
    if (item.reconciliationId || item.forecastId) return showToast("This auditable transaction is linked to its source record"), false;
    Object.assign(item, { type: data.type, account: data.account, date: data.date, amount: fromMinor(toMinor(data.amount)), amountMinor: toMinor(data.amount), category: data.category.trim(), budgetId: data.budgetId || "", forecastId: "", reconciliationId: "", note: data.note.trim(), createdAt: item.createdAt || new Date().toISOString() });
  }
  if (editor.type === "transfer") {
    if (item.allocationId) return showToast("Release the linked income allocation instead of editing its transfer"), false;
    if (data.fromAccount === data.toAccount) return showToast("Choose two different accounts"), false;
    Object.assign(item, { fromAccount: data.fromAccount, toAccount: data.toAccount, date: data.date, amount: fromMinor(toMinor(data.amount)), amountMinor: toMinor(data.amount), note: data.note.trim() || "Account transfer", allocationId: item.allocationId || "", createdAt: item.createdAt || new Date().toISOString() });
  }
  if (editor.type === "bill") {
    if (data.frequency === "oneoff" && !data.dueDate) return showToast("Choose the one-off due date"), false;
    const frequencyChanged = item.frequency && item.frequency !== data.frequency;
    const dueDay = data.frequency === "annual" ? Number(data.dueDayAnnual) : Number(data.dueDayMonthly);
    const nextAmount = Number(data.amount);
    const priceChanged = Number(item.amount) > 0 && Number(item.amount) !== nextAmount;
    const becomingSubscription = item.kind !== "subscription" && data.billKind === "subscription";
    const previousAmount = priceChanged ? Number(item.amount) : Number(item.previousAmount || 0);
    Object.assign(item, { name: data.name.trim(), amount: fromMinor(toMinor(nextAmount)), amountMinor: toMinor(nextAmount), frequency: data.frequency, dueDay, dueMonth: Number(data.dueMonth || 1), dueDate: data.dueDate || "", dueConfirmed: form.elements.dueConfirmed.checked, kind: data.billKind, account: data.account, remindDays: Number(data.remindDays), autopay: Boolean(data.autopay), createdAt: item.createdAt || new Date().toISOString(), paidPeriods: frequencyChanged ? [] : (item.paidPeriods || []), previousAmount, previousAmountMinor: toMinor(previousAmount), amountChangedAt: priceChanged ? new Date().toISOString() : (item.amountChangedAt || ""), lastReviewed: becomingSubscription ? new Date().toISOString() : (item.lastReviewed || "") });
  }
  if (editor.type === "obligation") Object.assign(item, { name: data.name.trim(), target: fromMinor(toMinor(data.target)), targetMinor: toMinor(data.target), paid: fromMinor(toMinor(data.paid)), paidMinor: toMinor(data.paid), monthlyPayment: fromMinor(toMinor(data.monthlyPayment)), monthlyPaymentMinor: toMinor(data.monthlyPayment) });
  if (editor.type === "investment") Object.assign(item, { name: data.name.trim(), contributed: fromMinor(toMinor(data.contributed)), contributedMinor: toMinor(data.contributed), current: fromMinor(toMinor(data.current)), currentMinor: toMinor(data.current) });
  if (editor.type === "contact") Object.assign(item, { name: data.name.trim(), relationship: data.relationship.trim(), intention: data.intention.trim(), nextContactDate: data.nextContactDate || "", notes: data.notes.trim(), status: data.status, lastConnected: item.lastConnected || "", createdAt: item.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() });
  if (editor.type === "experience") Object.assign(item, { name: data.name.trim(), category: data.category, targetDate: data.targetDate || "", costEstimate: fromMinor(Math.max(0, toMinor(data.costEstimate))), costEstimateMinor: Math.max(0, toMinor(data.costEstimate)), status: data.status, notes: data.notes.trim(), completedAt: data.status === "completed" ? (item.completedAt || new Date().toISOString()) : "", createdAt: item.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() });
  if (editor.type === "journal") Object.assign(item, { date: data.date, type: data.type, content: data.content.trim(), private: Boolean(data.private), createdAt: item.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() });
  if (editor.type === "goal") Object.assign(item, { name: data.name.trim(), area: data.area, horizon: data.horizon, targetDate: data.targetDate || "", why: data.why.trim(), evidence: data.evidence.trim(), status: data.status, createdAt: item.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() });
  if (editor.type === "project") {
    const links = data.links.split(/\r?\n/).map(line => {
      const [label, ...urlParts] = line.split("|");
      const url = urlParts.join("|").trim() || label.trim();
      return { label: urlParts.length ? label.trim() || "Link" : "Link", url };
    }).filter(link => safeExternalURL(link.url));
    Object.assign(item, { name: data.name.trim(), category: data.category, goalId: data.goalId || "", outcome: data.outcome.trim(), nextReviewDate: data.nextReviewDate || "", priority: Number(data.priority), status: data.status, notes: data.notes.trim(), links, createdAt: item.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  if (editor.type === "milestone") Object.assign(item, { projectId: data.projectId, name: data.name.trim(), dueDate: data.dueDate || "", status: data.status, createdAt: item.createdAt || new Date().toISOString(), completedAt: data.status === "completed" ? (item.completedAt || new Date().toISOString()) : "" });
  if (editor.type === "blocker") Object.assign(item, { projectId: data.projectId, text: data.text.trim(), reason: data.reason.trim(), status: data.status, createdAt: item.createdAt || new Date().toISOString(), resolvedAt: data.status === "resolved" ? (item.resolvedAt || new Date().toISOString()) : "" });
  if (editor.type === "decision") Object.assign(item, { projectId: data.projectId, text: data.text.trim(), reason: data.reason.trim(), status: "recorded", createdAt: item.createdAt || new Date().toISOString() });
  if (editor.type === "budget") Object.assign(item, { name: data.name.trim(), category: data.category.trim() || "Other", account: data.account, month: data.month || monthKey(), amount: fromMinor(toMinor(data.amount)), amountMinor: toMinor(data.amount), recurring: form.elements.recurring.checked, protect: form.elements.protect.checked, migratedFromBillId: item.migratedFromBillId || "", createdAt: item.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() });
  if (editor.type === "income") Object.assign(item, { source: data.source.trim(), amount: fromMinor(toMinor(data.amount)), amountMinor: toMinor(data.amount), expectedDate: data.expectedDate || "", status: data.status, account: data.account, notes: data.notes.trim(), createdAt: item.createdAt || new Date().toISOString(), receivedAt: data.status === "received" ? (item.receivedAt || new Date().toISOString()) : "" });
  if (editor.type === "savings") Object.assign(item, { name: data.name.trim(), target: fromMinor(toMinor(data.target)), targetMinor: toMinor(data.target), saved: fromMinor(toMinor(data.saved)), savedMinor: toMinor(data.saved), deadline: data.deadline || "", status: data.status, createdAt: item.createdAt || new Date().toISOString() });
  if (editor.type === "purchase") Object.assign(item, { name: data.name.trim(), url: safeExternalURL(data.url) || "", amount: fromMinor(Math.max(0, toMinor(data.amount))), amountMinor: Math.max(0, toMinor(data.amount)), category: data.category, account: data.account, priority: data.priority, targetDate: data.targetDate || "", status: data.status, reserved: form.elements.reserved.checked, notes: data.notes.trim(), createdAt: item.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString(), boughtAt: data.status === "bought" ? (item.boughtAt || new Date().toISOString()) : "" });
  saveState(editor.type === "inbox" ? "Captured without changing direction" : "System updated", { scope: editor.type === "inbox" ? "inbox" : "all" });
  render();
  return true;
}

function deleteEditor() {
  if (!editor?.id || !confirm("Delete this item?")) return;
  const collection = editorCollection(editor.type);
  const index = collection.findIndex(entry => entry.id === editor.id);
  if (editor.type === "transfer" && collection[index]?.allocationId) return showToast("This transfer belongs to an income allocation and cannot be deleted separately");
  if (editor.type === "transaction" && (collection[index]?.reconciliationId || collection[index]?.forecastId)) return showToast("This transaction is linked to an auditable source record and cannot be deleted separately");
  if (editor.type === "inbox" && index >= 0) recordInboxDeletion(editor.id);
  if (index >= 0) collection.splice(index, 1);
  if (editor.type === "task" && todayState().tomorrowTaskId === editor.id) {
    todayState().tomorrowTaskId = "";
    todayState().tomorrowReady = false;
  }
  saveState("Item deleted", { scope: editor.type === "inbox" ? "inbox" : "all" });
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
  recordInboxDeletion(item.id);
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
  const migrationRestore = document.getElementById("restore-migration");
  if (reminderStatus) reminderStatus.textContent = state.preferences.reminders.enabled ? `On · ${state.preferences.reminders.morning} + ${state.preferences.reminders.evening}` : "Off";
  if (securityStatus) securityStatus.textContent = security.pinHash ? (security.credentialId ? "PIN + device unlock" : "PIN enabled") : "Off";
  if (migrationRestore) migrationRestore.classList.toggle("hidden", !(localStorage.getItem(LATEST_MIGRATION_BACKUP_KEY) || localStorage.getItem(MIGRATION_BACKUP_KEY)));
  refreshSyncUI();
}

function restoreMigrationSnapshot() {
  try {
    const snapshot = JSON.parse(localStorage.getItem(LATEST_MIGRATION_BACKUP_KEY) || localStorage.getItem(MIGRATION_BACKUP_KEY));
    if (!snapshot?.data) throw new Error("Snapshot unavailable");
    if (!confirm("Restore the data snapshot created immediately before the latest upgrade? Your current copy will be kept as a separate recovery snapshot.")) return;
    localStorage.setItem(PRE_RESTORE_BACKUP_KEY, JSON.stringify({ createdAt: new Date().toISOString(), data: state }));
    state = normalizeState(snapshot.data);
    saveState("Upgrade snapshot restored and safely updated");
    render();
    document.getElementById("settings-dialog").close();
  } catch {
    showToast("The migration snapshot could not be restored");
  }
}

function formatSyncTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "recently";
  const sameDay = dayKey(date) === dayKey();
  return new Intl.DateTimeFormat("en-GB", sameDay ? { hour: "2-digit", minute: "2-digit" } : { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(date);
}

function refreshSyncUI() {
  const topStatus = document.getElementById("cloud-status");
  const settingsStatus = document.getElementById("sync-status");
  const settingsAction = document.getElementById("sync-action");
  const privacyNote = document.getElementById("privacy-note");
  let topLabel = "Private";
  let detail = "Not connected · this device only";
  let phase = "private";
  if (cloudSync.namespace) {
    phase = syncPhase;
    if (cloudSync.conflict || syncPhase === "conflict") {
      topLabel = "Review sync";
      detail = "Action needed · choose which copy to keep";
      phase = "conflict";
    } else if (syncPhase === "syncing") {
      topLabel = "Syncing";
      detail = "Encrypting and checking devices…";
    } else if (syncPhase === "offline" || !navigator.onLine) {
      topLabel = "Saved offline";
      detail = cloudSync.dirty ? "Changes queued · sync resumes online" : "Offline · latest copy saved here";
      phase = "offline";
    } else if (syncPhase === "error") {
      topLabel = "Sync paused";
      detail = "Saved here · tap to retry";
      phase = "error";
    } else if (cloudSync.dirty) {
      topLabel = "Saving";
      detail = "Changes saved here · syncing shortly";
      phase = "pending";
    } else {
      topLabel = "Synced";
      detail = `Up to date${cloudSync.lastSyncedAt ? ` · ${formatSyncTime(cloudSync.lastSyncedAt)}` : ""}`;
      phase = "synced";
    }
  }
  if (topStatus) {
    topStatus.dataset.syncPhase = phase;
    const label = topStatus.querySelector("span");
    if (label) label.textContent = topLabel;
  }
  if (settingsStatus) settingsStatus.textContent = detail;
  if (settingsAction) settingsAction.textContent = cloudSync.conflict ? "!" : "›";
  if (privacyNote) privacyNote.textContent = cloudSync.namespace ? "Your synced data is encrypted before leaving this device. Keep your pairing link private." : "Your data stays private to this browser unless you deliberately transfer or sync it.";
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
  processPendingTransfers();
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

function randomHex(size = 12) {
  return [...crypto.getRandomValues(new Uint8Array(size))].map(value => value.toString(16).padStart(2, "0")).join("");
}

function syncRelayUrl(config = cloudSync) {
  return `${SYNC_RELAY}/${encodeURIComponent(config.namespace)}/${SYNC_PATH}`;
}

function syncHeaders(config = cloudSync, includeContent = false) {
  const headers = { "X-Mantle-Key": config.relayKey };
  if (includeContent) headers["Content-Type"] = "application/json";
  return headers;
}

async function encryptCloudState(config, revision, parentChangeId = "") {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const packed = await gzipBytes(new TextEncoder().encode(JSON.stringify(state)));
  const key = await crypto.subtle.importKey("raw", base64UrlToBytes(config.encryptionKey), { name: "AES-GCM" }, false, ["encrypt"]);
  const additionalData = new TextEncoder().encode(`50x-sync:${config.namespace}`);
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData }, key, packed.bytes);
  return { kind: "50x-sync", version: 1, revision, changeId: crypto.randomUUID(), parentChangeId, updatedAt: new Date().toISOString(), updatedBy: config.deviceId, compressed: packed.compressed, iv: bytesToBase64Url(iv), data: bytesToBase64Url(new Uint8Array(encrypted)) };
}

async function decryptCloudState(envelope, config = cloudSync) {
  if (envelope?.kind !== "50x-sync" || Number(envelope.version) !== 1 || !envelope.iv || !envelope.data) throw new Error("Invalid encrypted sync data");
  const key = await crypto.subtle.importKey("raw", base64UrlToBytes(config.encryptionKey), { name: "AES-GCM" }, false, ["decrypt"]);
  const additionalData = new TextEncoder().encode(`50x-sync:${config.namespace}`);
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: base64UrlToBytes(envelope.iv), additionalData }, key, base64UrlToBytes(envelope.data));
  const unpacked = await gunzipBytes(new Uint8Array(decrypted), envelope.compressed);
  const result = JSON.parse(new TextDecoder().decode(unpacked));
  if (!result?.week || !Array.isArray(result.tasks)) throw new Error("Invalid Life OS state");
  return result;
}

async function fetchRemoteEnvelope(config = cloudSync) {
  const response = await fetch(syncRelayUrl(config), { headers: syncHeaders(config), cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Sync read failed (${response.status})`);
  return response.json();
}

async function writeRemoteEnvelope(envelope, config = cloudSync) {
  const body = JSON.stringify(envelope);
  if (new Blob([body]).size > 63000) throw new Error("Your encrypted Life OS has outgrown the free sync space. Export a backup and trim older history.");
  const response = await fetch(syncRelayUrl(config), { method: "POST", headers: syncHeaders(config, true), body, cache: "no-store" });
  if (!response.ok) throw new Error(`Sync write failed (${response.status})`);
}

function pairPayload(config = cloudSync) {
  return bytesToBase64Url(new TextEncoder().encode(JSON.stringify({ version: 1, namespace: config.namespace, relayKey: config.relayKey, encryptionKey: config.encryptionKey })));
}

function parsePairPayload(value) {
  const payload = typeof value === "string" ? JSON.parse(new TextDecoder().decode(base64UrlToBytes(value))) : value;
  if (Number(payload?.version) !== 1 || !/^[a-z0-9-]{10,80}$/i.test(payload.namespace || "") || !/^[a-f0-9]{32,128}$/i.test(payload.relayKey || "") || !/^[A-Za-z0-9_-]{40,60}$/.test(payload.encryptionKey || "")) throw new Error("Invalid pairing link");
  return payload;
}

function readSyncPairFromHash() {
  try {
    const match = location.hash.match(/(?:^#|&)sync=([^&]+)/);
    const value = match ? decodeURIComponent(match[1]) : "";
    return value ? parsePairPayload(value) : null;
  } catch {
    return null;
  }
}

function inboxRecordTime(item) {
  const value = Date.parse(item?.updatedAt || item?.createdAt || "");
  return Number.isFinite(value) ? value : 0;
}

function inboxTombstoneTime(value) {
  const parsed = Date.parse(value || "");
  return Number.isFinite(parsed) ? parsed : 0;
}

function recordInboxDeletion(id) {
  if (!id) return;
  if (!state.sync || typeof state.sync !== "object") state.sync = { lastHandoff: null, inboxTombstones: {} };
  if (!state.sync.inboxTombstones || typeof state.sync.inboxTombstones !== "object") state.sync.inboxTombstones = {};
  state.sync.inboxTombstones[id] = new Date().toISOString();
}

function inboxOnlySyncDifference(localState, remoteState) {
  const comparable = value => {
    const copy = normalizeState(value);
    copy.inbox = [];
    copy.sync = { ...copy.sync, inboxTombstones: {} };
    return JSON.stringify(copy);
  };
  return comparable(localState) === comparable(remoteState);
}

function mergeInboxStates(localState, remoteState) {
  const local = normalizeState(localState);
  const merged = normalizeState(remoteState);
  const tombstones = { ...(merged.sync.inboxTombstones || {}) };
  Object.entries(local.sync.inboxTombstones || {}).forEach(([id, deletedAt]) => {
    if (inboxTombstoneTime(deletedAt) >= inboxTombstoneTime(tombstones[id])) tombstones[id] = deletedAt;
  });
  const records = new Map();
  [...merged.inbox, ...local.inbox].forEach(item => {
    const existing = records.get(item.id);
    if (!existing || inboxRecordTime(item) >= inboxRecordTime(existing)) records.set(item.id, item);
  });
  merged.inbox = [...records.values()].filter(item => !tombstones[item.id]);
  merged.sync = { ...merged.sync, inboxTombstones: tombstones };
  return merged;
}

function canAutoMergeInbox(localState, remoteState) {
  const dirtySections = Array.isArray(cloudSync.dirtySections) ? cloudSync.dirtySections : [];
  return (dirtySections.length === 1 && dirtySections[0] === "inbox") || inboxOnlySyncDifference(localState, remoteState);
}

function cloudPairingUrl() {
  const base = location.protocol === "https:" ? `${location.origin}${location.pathname}` : LIVE_URL;
  return `${base}#sync=${pairPayload()}`;
}

async function shareCloudPairingLink() {
  if (!cloudSync.namespace) return;
  const url = cloudPairingUrl();
  if (navigator.share) {
    try {
      await navigator.share({ title: "50X Life OS private sync", text: "Open this private pairing link on your other device. Anyone with the link can unlock your encrypted sync.", url });
      showToast("Private pairing link shared");
      return;
    } catch (error) {
      if (error.name !== "AbortError" && error.name !== "NotAllowedError") throw error;
    }
  }
  await copyText(url);
  showToast("Private pairing link copied");
}

async function startCloudSync() {
  if (!crypto.subtle) throw new Error("Encryption is unavailable in this browser");
  syncPhase = "syncing";
  refreshSyncUI();
  const previous = cloudSync;
  try {
    const namespace = `50x-${randomHex(14)}`;
    const response = await fetch(`${SYNC_RELAY}/claim/${namespace}`, { cache: "no-store" });
    if (!response.ok) throw new Error("Private sync space could not be created");
    const claim = await response.json();
    if (!claim.key) throw new Error("Private sync key was not returned");
    cloudSync = { deviceId: previous.deviceId || crypto.randomUUID(), namespace, relayKey: claim.key, encryptionKey: bytesToBase64Url(crypto.getRandomValues(new Uint8Array(32))), lastRevision: 0, lastChangeId: "", lastSyncedAt: "", dirty: true, dirtySections: ["all"], conflict: false };
    const envelope = await encryptCloudState(cloudSync, 1);
    await writeRemoteEnvelope(envelope, cloudSync);
    const verified = await fetchRemoteEnvelope(cloudSync);
    if (verified?.changeId !== envelope.changeId) throw new Error("Private sync could not be verified");
    Object.assign(cloudSync, { lastRevision: 1, lastChangeId: envelope.changeId, lastSyncedAt: new Date().toISOString(), dirty: false, dirtySections: [], conflict: false });
    saveCloudSync();
    syncPhase = "idle";
    refreshSyncUI();
    copyText(cloudPairingUrl()).then(() => showToast("Sync started · pairing link copied")).catch(() => showToast("Sync started · open Device sync to pair another device"));
  } catch (error) {
    cloudSync = previous;
    saveCloudSync();
    syncPhase = cloudSync.namespace ? "error" : "off";
    refreshSyncUI();
    showToast(error.message || "Private sync could not be started");
    throw error;
  }
}

async function connectCloudSync(payload) {
  if (!crypto.subtle) throw new Error("Encryption is unavailable in this browser");
  const previousPhase = cloudSync.namespace ? "idle" : "off";
  try {
    const pair = parsePairPayload(payload);
    const nextConfig = { deviceId: cloudSync.deviceId || crypto.randomUUID(), namespace: pair.namespace, relayKey: pair.relayKey, encryptionKey: pair.encryptionKey, lastRevision: 0, lastChangeId: "", lastSyncedAt: "", dirty: false, dirtySections: [], conflict: false };
    syncPhase = "syncing";
    refreshSyncUI();
    const envelope = await fetchRemoteEnvelope(nextConfig);
    if (!envelope) throw new Error("The synced copy is no longer available");
    const imported = await decryptCloudState(envelope, nextConfig);
    state = normalizeState(imported);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    cloudSync = { ...nextConfig, lastRevision: Number(envelope.revision) || 1, lastChangeId: envelope.changeId || "", lastSyncedAt: new Date().toISOString() };
    saveCloudSync();
    pendingSyncPair = null;
    if (location.hash.includes("sync=")) history.replaceState(null, "", `${location.pathname}${location.search}`);
    syncPhase = "idle";
    render();
    refreshSyncUI();
    showToast("This device is now synced");
  } catch (error) {
    syncPhase = navigator.onLine ? previousPhase : "offline";
    refreshSyncUI();
    showToast(error.message || "This device could not connect");
    throw error;
  }
}

function applyRemoteEnvelope(envelope, imported) {
  state = normalizeState(imported);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  cloudSync.lastRevision = Number(envelope.revision) || cloudSync.lastRevision;
  cloudSync.lastChangeId = envelope.changeId || cloudSync.lastChangeId;
  cloudSync.lastSyncedAt = new Date().toISOString();
  cloudSync.dirty = false;
  cloudSync.dirtySections = [];
  cloudSync.conflict = false;
  saveCloudSync();
  render();
}

async function pushLocalState(remote) {
  const revision = Math.max(Number(remote?.revision) || 0, Number(cloudSync.lastRevision) || 0) + 1;
  const envelope = await encryptCloudState(cloudSync, revision, remote?.changeId || "");
  await writeRemoteEnvelope(envelope);
  const verified = await fetchRemoteEnvelope();
  if (verified?.changeId !== envelope.changeId) {
    cloudSync.conflict = true;
    cloudSync.dirty = true;
    saveCloudSync();
    syncPhase = "conflict";
    throw new Error("Another device changed at the same time");
  }
  cloudSync.lastRevision = revision;
  cloudSync.lastChangeId = envelope.changeId;
  cloudSync.lastSyncedAt = new Date().toISOString();
  cloudSync.dirty = false;
  cloudSync.dirtySections = [];
  cloudSync.conflict = false;
  saveCloudSync();
}

async function performCloudSync(silent = false) {
  if (!cloudSync.namespace) return;
  if (!navigator.onLine) {
    syncPhase = "offline";
    refreshSyncUI();
    return;
  }
  syncPhase = "syncing";
  refreshSyncUI();
  try {
    const remote = await fetchRemoteEnvelope();
    if (!remote) throw new Error("Your private sync space is unavailable");
    const remoteChanged = Number(remote.revision) !== Number(cloudSync.lastRevision) || String(remote.changeId || "") !== String(cloudSync.lastChangeId || "");
    if ((remoteChanged && cloudSync.dirty) || cloudSync.conflict) {
      const imported = await decryptCloudState(remote);
      if (canAutoMergeInbox(state, imported)) {
        state = mergeInboxStates(state, imported);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        cloudSync.lastRevision = Number(remote.revision) || cloudSync.lastRevision;
        cloudSync.lastChangeId = remote.changeId || cloudSync.lastChangeId;
        cloudSync.lastSyncedAt = new Date().toISOString();
        cloudSync.dirty = true;
        cloudSync.dirtySections = ["inbox"];
        cloudSync.conflict = false;
        saveCloudSync();
        await pushLocalState(remote);
        render();
        if (!silent) showToast("Inbox changes merged safely");
      } else {
        cloudSync.conflict = true;
        saveCloudSync();
        syncPhase = "conflict";
        if (!silent) showToast("Sync needs a quick decision");
        return;
      }
    }
    else if (remoteChanged) applyRemoteEnvelope(remote, await decryptCloudState(remote));
    if (cloudSync.dirty) await pushLocalState(remote);
    cloudSync.lastSyncedAt = new Date().toISOString();
    saveCloudSync();
    syncPhase = "idle";
    if (!silent) showToast("Everything is synced");
  } catch (error) {
    if (cloudSync.conflict) syncPhase = "conflict";
    else syncPhase = navigator.onLine ? "error" : "offline";
    if (!silent) showToast(error.message || "Sync is paused; your changes are safe here");
  } finally {
    refreshSyncUI();
  }
}

function syncNow(options = {}) {
  if (syncOperation) return syncOperation;
  syncOperation = performCloudSync(Boolean(options.silent)).finally(() => { syncOperation = null; });
  return syncOperation;
}

function scheduleCloudSync(delay = 1200) {
  clearTimeout(syncDebounce);
  if (!cloudSync.namespace) return;
  syncDebounce = setTimeout(() => syncNow({ silent: true }), delay);
}

async function keepLocalSyncCopy() {
  syncPhase = "syncing";
  refreshSyncUI();
  try {
    const remote = await fetchRemoteEnvelope();
    if (!remote) throw new Error("The other copy is unavailable");
    cloudSync.conflict = false;
    cloudSync.dirty = true;
    cloudSync.dirtySections = ["all"];
    await pushLocalState(remote);
    syncPhase = "idle";
    showToast("This device's copy is now synced");
  } catch (error) {
    syncPhase = cloudSync.conflict ? "conflict" : "error";
    showToast(error.message || "Could not finish syncing");
  } finally {
    saveCloudSync();
    refreshSyncUI();
  }
}

async function useRemoteSyncCopy() {
  syncPhase = "syncing";
  refreshSyncUI();
  try {
    const remote = await fetchRemoteEnvelope();
    if (!remote) throw new Error("The other copy is unavailable");
    applyRemoteEnvelope(remote, await decryptCloudState(remote));
    syncPhase = "idle";
    showToast("The other device's copy is now here");
  } catch (error) {
    syncPhase = "conflict";
    showToast(error.message || "Could not load the other copy");
  } finally {
    refreshSyncUI();
  }
}

function disconnectCloudSync() {
  if (!confirm("Disconnect sync on this device? Your Life OS data will stay saved here.")) return false;
  const deviceId = cloudSync.deviceId || crypto.randomUUID();
  cloudSync = { deviceId, namespace: "", relayKey: "", encryptionKey: "", lastRevision: 0, lastChangeId: "", lastSyncedAt: "", dirty: false, dirtySections: [], conflict: false };
  localStorage.setItem(CLOUD_SYNC_KEY, JSON.stringify(cloudSync));
  clearTimeout(syncDebounce);
  syncPhase = "off";
  refreshSyncUI();
  showToast("This device is disconnected");
  return true;
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {}
  }
  const area = document.createElement("textarea");
  area.value = value;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  const copied = document.execCommand("copy");
  area.remove();
  if (!copied) throw new Error("Copy unavailable");
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

function processPendingTransfers() {
  if (!appUnlocked || document.getElementById("editor-dialog").open) return;
  if (pendingSyncPair) {
    if (cloudSync.namespace && cloudSync.namespace === pendingSyncPair.namespace) {
      pendingSyncPair = null;
      if (location.hash.includes("sync=")) history.replaceState(null, "", `${location.pathname}${location.search}`);
      showToast("This device is already connected");
      return;
    }
    setTimeout(() => openEditor("syncPair", pendingSyncPair), 250);
    return;
  }
  processPendingHandoff();
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

document.addEventListener("click", async event => {
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
  if (target.dataset.assistantKind) {
    assistantRecommendation(target.dataset.assistantKind);
    renderAssistant();
    return;
  }
  if (target.dataset.approveRecommendation) {
    applyAssistantRecommendation(target.dataset.approveRecommendation);
    return;
  }
  if (target.dataset.reverseChange) {
    reverseAssistantChange(target.dataset.reverseChange);
    return;
  }
  if (target.hasAttribute("data-sync-now")) {
    await syncNow();
    if (editor?.type === "sync") document.getElementById("dialog-fields").innerHTML = syncEditor();
    return;
  }
  if (target.hasAttribute("data-sync-share")) {
    try { await shareCloudPairingLink(); } catch { showToast("The pairing link could not be shared"); }
    return;
  }
  if (target.hasAttribute("data-sync-copy")) {
    try {
      await copyText(cloudPairingUrl());
      showToast("Private pairing link copied");
    } catch {
      showToast("The pairing link could not be copied");
    }
    return;
  }
  if (target.hasAttribute("data-sync-disconnect")) {
    if (disconnectCloudSync()) document.getElementById("editor-dialog").close();
    return;
  }
  if (target.hasAttribute("data-sync-use-local")) {
    await keepLocalSyncCopy();
    if (!cloudSync.conflict) document.getElementById("editor-dialog").close();
    return;
  }
  if (target.hasAttribute("data-sync-use-cloud")) {
    await useRemoteSyncCopy();
    if (!cloudSync.conflict) document.getElementById("editor-dialog").close();
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
  if (target.dataset.useSuggestedMode) {
    const daily = todayState();
    if (daily.mode !== target.dataset.useSuggestedMode) {
      daily.mode = target.dataset.useSuggestedMode;
      daily.routine = [];
    }
    saveState("Mode changed by your choice");
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
  if (target.dataset.milestoneToggle) {
    const milestone = state.milestones.find(item => item.id === target.dataset.milestoneToggle);
    if (!milestone) return;
    const completed = milestone.status === "completed";
    milestone.status = completed ? "open" : "completed";
    milestone.completedAt = completed ? "" : new Date().toISOString();
    saveState(completed ? "Milestone reopened" : "Milestone completed");
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
  if (target.dataset.contactConnected) {
    const contact = state.life.contacts.find(item => item.id === target.dataset.contactConnected);
    if (!contact) return;
    contact.lastConnected = dayKey();
    contact.updatedAt = new Date().toISOString();
    const connection = todayState().connection;
    connection.person = contact.name;
    connection.plan = contact.intention || connection.plan;
    connection.completed = true;
    connection.completedAt = new Date().toISOString();
    saveState(`Connection with ${contact.name} recorded`);
    return render();
  }
  if (target.dataset.experienceToggle) {
    const experience = state.life.experiences.find(item => item.id === target.dataset.experienceToggle);
    if (!experience) return;
    const completed = experience.status === "completed";
    experience.status = completed ? "planned" : "completed";
    experience.completedAt = completed ? "" : new Date().toISOString();
    experience.updatedAt = new Date().toISOString();
    saveState(completed ? "Experience reopened" : "Experience remembered");
    return render();
  }
  if (target.dataset.purchaseBought) {
    const purchase = state.finances.plannedPurchases.find(item => item.id === target.dataset.purchaseBought);
    if (!purchase) return;
    const bought = purchase.status === "bought";
    purchase.status = bought ? "planned" : "bought";
    purchase.boughtAt = bought ? "" : new Date().toISOString();
    purchase.updatedAt = new Date().toISOString();
    saveState(bought ? "Purchase reopened" : "Marked bought — record the transaction when cash leaves");
    return render();
  }
  if (target.dataset.reviewSubscription) {
    const bill = state.finances.bills.find(item => item.id === target.dataset.reviewSubscription);
    if (!bill) return;
    bill.lastReviewed = new Date().toISOString();
    bill.previousAmount = Number(bill.amount);
    bill.previousAmountMinor = minorValue(bill, "amountMinor", "amount");
    saveState("Subscription review recorded");
    return render();
  }
  if (target.dataset.allocateIncome) {
    openEditor("allocation", null, { incomeId: target.dataset.allocateIncome });
    return;
  }
  if (target.dataset.allocationRelease) {
    const allocation = state.finances.incomeAllocations.find(item => item.id === target.dataset.allocationRelease);
    if (!allocation) return;
    const releasing = allocation.status === "active";
    allocation.status = releasing ? "released" : "active";
    allocation.releasedAt = releasing ? new Date().toISOString() : "";
    saveState(releasing ? "Allocation protection released" : "Allocation protection restored");
    return render();
  }
  if (target.dataset.add) return openEditor(target.dataset.add, null, { projectId: target.dataset.projectId || "" });
  if (target.dataset.editRoutine) return openEditor("routine", target.dataset.editRoutine);
  if (target.dataset.inboxTask) return promoteInboxItem(target.dataset.inboxTask);
  if (target.hasAttribute("data-capture-month")) return captureMonthlyEvidence();
  if (target.hasAttribute("data-close-week")) return closeWeek();
  if (target.hasAttribute("data-add-routine-step")) {
    document.querySelector(".routine-step-list").insertAdjacentHTML("beforeend", routineStepEditor(["", "", 5, "Do the smallest useful version."], document.querySelectorAll(".routine-step-editor").length));
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
  ["task", "inbox", "maintenance", "cue", "script", "transaction", "transfer", "bill", "obligation", "investment", "contact", "experience", "journal", "goal", "project", "milestone", "blocker", "decision", "budget", "income", "savings", "purchase"].forEach(type => {
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
  if (target.dataset.balance) {
    const amountMinor = toMinor(target.value);
    state.finances.balances[target.dataset.balance] = fromMinor(amountMinor);
    state.finances.balancesMinor[target.dataset.balance] = amountMinor;
  }
  if (target.dataset.reflection) state.reflection[target.dataset.reflection] = target.value.trim();
  if (target.dataset.lifeField) state.life[target.dataset.lifeField] = target.value.trim();
  if (target.dataset.lifeGroup && target.dataset.lifeKey) state.life[target.dataset.lifeGroup][target.dataset.lifeKey] = target.value.trim();
  if (target.dataset.monthlyField) monthlyState()[target.dataset.monthlyField] = target.value.trim();
  if (target.dataset.rating !== undefined) state.reflection.ratings[Number(target.dataset.rating)] = Number(target.value);
  if (target.matches("[data-week-field],[data-daily-field],[data-balance],[data-reflection],[data-life-field],[data-life-group],[data-monthly-field],[data-rating]")) {
    saveState("Saved");
    if (target.dataset.rating !== undefined || target.dataset.balance) render();
  }
});

document.addEventListener("input", event => {
  const target = event.target;
  if (target.matches("[data-auto-resize]")) resizeOutcomeInput(target);
  if (target.dataset.balance) {
    const amountMinor = toMinor(target.value);
    state.finances.balances[target.dataset.balance] = fromMinor(amountMinor);
    state.finances.balancesMinor[target.dataset.balance] = amountMinor;
    saveState();
  }
  if (target.dataset.weekField) state.week[target.dataset.weekField] = target.value;
  if (target.dataset.dailyField) todayState()[target.dataset.dailyField] = target.value;
  if (target.dataset.reflection) state.reflection[target.dataset.reflection] = target.value;
  if (target.dataset.lifeField) state.life[target.dataset.lifeField] = target.value;
  if (target.dataset.lifeGroup && target.dataset.lifeKey) state.life[target.dataset.lifeGroup][target.dataset.lifeKey] = target.value;
  if (target.dataset.monthlyField) monthlyState()[target.dataset.monthlyField] = target.value;
  if (target.matches("[data-week-field],[data-daily-field],[data-reflection],[data-life-field],[data-life-group],[data-monthly-field]")) saveState();
  if (target.dataset.rating !== undefined) {
    state.reflection.ratings[Number(target.dataset.rating)] = Number(target.value);
    target.closest(".rating-control").querySelector("span").textContent = `${target.value}/5`;
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
document.getElementById("open-assistant").addEventListener("click", openAssistant);
document.getElementById("quick-capture").addEventListener("click", () => openEditor("inbox"));
document.getElementById("open-settings").addEventListener("click", openSettings);
document.getElementById("edit-routines").addEventListener("click", () => { document.getElementById("settings-dialog").close(); goToView("architecture"); });
document.getElementById("reminder-settings").addEventListener("click", () => { document.getElementById("settings-dialog").close(); openEditor("reminders"); });
document.getElementById("assistant-settings").addEventListener("click", () => { document.getElementById("settings-dialog").close(); openEditor("assistantSettings"); });
document.getElementById("security-settings").addEventListener("click", () => { document.getElementById("settings-dialog").close(); openEditor("security"); });
document.getElementById("device-sync").addEventListener("click", () => { document.getElementById("settings-dialog").close(); openEditor("sync"); });
document.getElementById("create-handoff").addEventListener("click", () => { document.getElementById("settings-dialog").close(); openEditor("handoff"); });
document.getElementById("export-data").addEventListener("click", exportBackup);
document.getElementById("restore-migration").addEventListener("click", restoreMigrationSnapshot);
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
  else {
    if (security.pinHash && hiddenAt && Date.now() - hiddenAt >= Math.max(1, Number(security.lockMinutes) || 5) * 60000) showLock();
    if (!pendingSyncPair) syncNow({ silent: true });
  }
});

window.addEventListener("online", () => syncNow({ silent: true }));
window.addEventListener("offline", () => { syncPhase = cloudSync.namespace ? "offline" : "off"; refreshSyncUI(); });
window.addEventListener("focus", () => { if (!pendingSyncPair) syncNow({ silent: true }); });

async function initialise() {
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    try { await navigator.serviceWorker.register("service-worker.js"); } catch {}
  }
  render();
  refreshSyncUI();
  startReminderChecks();
  clearInterval(syncTimer);
  syncTimer = setInterval(() => syncNow({ silent: true }), 45000);
  if (security.pinHash) showLock();
  else processPendingTransfers();
  if (cloudSync.namespace && !pendingSyncPair) scheduleCloudSync(400);
}

initialise();
