const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const storageKey = "flow-maxing-os-v1";
const backupKey = "50x-life-os-pre-v11-backup";

const mimeTypes = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json"
};

function createServer() {
  return http.createServer((request, response) => {
    const requestPath = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const relativePath = requestPath === "/" ? "index.html" : requestPath.replace(/^\/+/, "");
    const filePath = path.resolve(root, relativePath);
    if (!filePath.startsWith(`${root}${path.sep}`) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      response.writeHead(404).end("Not found");
      return;
    }
    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream"
    });
    fs.createReadStream(filePath).pipe(response);
  });
}

function legacyFixture() {
  const createdAt = "2026-10-01T09:00:00.000Z";
  const bill = (id, name, amount, account = "personal") => ({
    id,
    name,
    amount,
    amountMinor: amount * 100,
    frequency: "monthly",
    dueDay: 1,
    dueMonth: 1,
    dueDate: "",
    kind: "essential",
    account,
    paidPeriods: [],
    createdAt
  });
  return {
    version: 10,
    week: { outcome: "Ship the milestone", startedAt: "2026-10-26" },
    tasks: [],
    inbox: [],
    goals: [],
    projects: [],
    milestones: [],
    finances: {
      balances: { personal: 1000, business: 670, held: 250 },
      balancesMinor: { personal: 100000, business: 67000, held: 25000 },
      settings: { reserveTarget: 0, reserveTargetMinor: 0, enjoymentAllowance: 0, enjoymentAllowanceMinor: 0 },
      transactions: [],
      bills: [
        bill("food-bill", "Food", 100),
        bill("transport-bill", "Transport", 100),
        bill("rent-bill", "Rent", 300),
        bill("ai-bill", "Business AI development tools", 125, "business")
      ],
      obligations: [],
      investments: [],
      budgets: [],
      incomeForecasts: [{ id: "student-finance", source: "Student Finance", amount: 5000, amountMinor: 500000, status: "expected", account: "personal", expectedDate: "2026-11-15", createdAt }],
      savingsGoals: [],
      plannedPurchases: []
    },
    life: { contacts: [], experiences: [], journal: [] },
    createdAt
  };
}

async function openWithFixture(browser, baseUrl, fixture = legacyFixture()) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: "block" });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", error => pageErrors.push(error.message));
  await page.addInitScript(({ key, fixture: initialState }) => localStorage.setItem(key, JSON.stringify(initialState)), { key: storageKey, fixture });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  assert.deepEqual(pageErrors, [], `Browser errors: ${pageErrors.join("; ")}`);
  return { context, page };
}

async function testMigrationAndMoney(browser, baseUrl) {
  const { context, page } = await openWithFixture(browser, baseUrl);
  const state = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey);
  const backup = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), backupKey);

  assert.equal(state.version, 11);
  assert.equal(backup.fromVersion, 10);
  assert.deepEqual(state.finances.bills.map(item => item.name), ["Rent", "Business AI development tools"]);
  assert.deepEqual(state.finances.budgets.map(item => item.name).sort(), ["Food", "Transport"]);
  assert.ok(state.finances.budgets.every(item => item.recurring && item.protect));
  assert.deepEqual(state.finances.archivedBills.map(item => item.id).sort(), ["food-bill", "transport-bill"]);
  assert.ok(state.finances.bills.every(item => item.dueConfirmed === false));

  await page.locator('.nav-item[data-view-target="money"]').click();
  await page.locator("#view-money.active").waitFor();
  const moneyText = await page.locator("#view-money").innerText();
  assert.match(moneyText, /Personal safe\s+£500\.00/i);
  assert.match(moneyText, /Business free\s+£545\.00/i);
  assert.match(moneyText, /Expected\s+£5,000\.00\s+Not available/i);
  assert.doesNotMatch(moneyText, /£500\.00 overdue/);

  await context.close();

  const transferFixture = legacyFixture();
  transferFixture.finances.transfers = [{
    id: "transfer-1",
    fromAccount: "business",
    toAccount: "personal",
    amount: 100,
    amountMinor: 10000,
    date: "2026-11-01",
    note: "Director transfer",
    createdAt: "2026-11-01T09:00:00.000Z"
  }];
  const transferred = await openWithFixture(browser, baseUrl, transferFixture);
  await transferred.page.locator('.nav-item[data-view-target="money"]').click();
  const transferredText = await transferred.page.locator("#view-money").innerText();
  assert.match(transferredText, /Personal safe\s+£600\.00/i);
  assert.match(transferredText, /Business free\s+£445\.00/i);
  await transferred.context.close();
}

async function testMobileAndDialogs(browser, baseUrl) {
  for (const width of [320, 375, 430]) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, serviceWorkers: "block" });
    const page = await context.newPage();
    const pageErrors = [];
    page.on("pageerror", error => pageErrors.push(error.message));
    await page.goto(baseUrl, { waitUntil: "networkidle" });

    assert.equal(await page.locator(".today-priority-card").count(), 1);
    assert.equal(await page.locator(".today-secondary").getAttribute("open"), null);

    for (const view of ["today", "life", "money", "week", "architecture", "review"]) {
      await page.locator(`.nav-item[data-view-target="${view}"]`).click();
      await page.locator(`#view-${view}.active`).waitFor();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      assert.ok(overflow <= 1, `${view} overflows by ${overflow}px at ${width}px`);
    }

    await page.locator("#quick-capture").click();
    assert.equal(await page.locator("#editor-dialog").evaluate(dialog => dialog.open), true);
    await page.locator('#editor-dialog [data-close-dialog="editor-dialog"]').click();
    assert.equal(await page.locator("#editor-dialog").evaluate(dialog => dialog.open), false);
    assert.deepEqual(pageErrors, [], `Browser errors at ${width}px: ${pageErrors.join("; ")}`);
    await context.close();
  }
}

async function main() {
  const server = createServer();
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}/`;
  const browser = await chromium.launch({ headless: true });
  try {
    await testMigrationAndMoney(browser, baseUrl);
    await testMobileAndDialogs(browser, baseUrl);
  } finally {
    await Promise.race([
      browser.close(),
      new Promise(resolve => setTimeout(resolve, 3000))
    ]);
    server.closeAllConnections?.();
    await new Promise(resolve => server.close(resolve));
  }
  process.stdout.write("50X smoke suite passed\n");
}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});
