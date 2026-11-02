const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const storageKey = "flow-maxing-os-v1";
const backupKey = "50x-life-os-pre-v13-backup";

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
      savingsGoals: [{ id: "legacy-savings", name: "Car fund", target: 1000, targetMinor: 100000, saved: 50, savedMinor: 5000, deadline: "", status: "active", createdAt }],
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

async function tap(locator) {
  await locator.dispatchEvent("click");
}

async function testMigrationAndMoney(browser, baseUrl) {
  const { context, page } = await openWithFixture(browser, baseUrl);
  const state = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey);
  const backup = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), backupKey);

  assert.equal(state.version, 13);
  assert.equal(backup.fromVersion, 10);
  assert.deepEqual(state.finances.bills.map(item => item.name), ["Rent", "Business AI development tools"]);
  assert.deepEqual(state.finances.budgets.map(item => item.name).sort(), ["Food", "Transport"]);
  assert.ok(state.finances.budgets.every(item => item.recurring && item.protect));
  assert.deepEqual(state.finances.archivedBills.map(item => item.id).sort(), ["food-bill", "transport-bill"]);
  assert.ok(state.finances.bills.every(item => item.dueConfirmed === false));
  assert.equal(state.finances.balancesMinor.physical, 0);
  assert.equal(state.finances.balancesMinor.trading, 0);
  assert.equal(state.finances.stacks.length, 7);
  assert.equal(state.finances.stackEntries.length, 1);
  assert.equal(state.finances.stackEntries[0].amountMinor, 5000);
  assert.equal(state.finances.incomeStreams.length, 5);

  await tap(page.locator('.nav-item[data-view-target="wealth"]'));
  await page.locator("#view-wealth.active").waitFor();
  await tap(page.locator('[data-money-section="money"]').first());
  const moneyText = await page.locator("#view-wealth").innerText();
  assert.match(moneyText, /Personal position\s+£1,000\.00\s+£450\.00 safe to spend/i);
  assert.match(moneyText, /Business position\s+£670\.00\s+£545\.00 free after business plans/i);
  assert.match(moneyText, /Expected\s+£5,000\.00\s+Not available/i);
  assert.doesNotMatch(moneyText, /£500\.00 overdue/);

  await tap(page.locator('[data-money-section="stacks"]').first());
  await tap(page.locator('.bread-actions [data-add="stackAdd"]'));
  await page.locator('[name="stackId"]').selectOption({ label: "CLA Stack" });
  await page.locator('[name="amount"]').fill("50");
  await page.locator('[name="note"]').fill("First CLA allocation");
  await tap(page.locator("#save-item"));
  await page.locator("#editor-dialog").waitFor({ state: "hidden" });

  await tap(page.locator('.stack-card').filter({ hasText: "CLA Stack" }).locator('[data-edit-stack]'));
  await page.locator('[name="status"]').selectOption("archived");
  await tap(page.locator("#save-item"));
  assert.equal(await page.locator("#editor-dialog").evaluate(dialog => dialog.open), true, "A funded stack must not be archived");
  const protectedStackState = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey);
  assert.equal(protectedStackState.finances.stacks.find(item => item.name === "CLA Stack").status, "active");
  await tap(page.locator('#editor-dialog [data-close-dialog="editor-dialog"]'));

  await tap(page.locator('.bread-actions [data-add="stackMove"]'));
  await page.locator('[name="fromStackId"]').selectOption({ label: "CLA Stack" });
  await page.locator('[name="toStackId"]').selectOption({ label: "Holiday Stack" });
  await page.locator('[name="amount"]').fill("20");
  await tap(page.locator("#save-item"));
  await page.locator("#editor-dialog").waitFor({ state: "hidden" });

  await tap(page.locator('.bread-actions [data-add="stackWithdraw"]'));
  await page.locator('[name="stackId"]').selectOption({ label: "Holiday Stack" });
  await page.locator('[name="amount"]').fill("10");
  await page.locator('[name="note"]').fill("Released for another priority");
  await tap(page.locator("#save-item"));
  await page.locator("#editor-dialog").waitFor({ state: "hidden" });

  const afterStacks = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey);
  assert.equal(afterStacks.finances.balancesMinor.personal, 100000);
  assert.equal(afterStacks.finances.transactions.length, 0);
  const activeStackEntries = afterStacks.finances.stackEntries.filter(item => !item.reversedAt);
  assert.equal(activeStackEntries.filter(item => item.type === "add").reduce((sum, item) => sum + item.amountMinor, 0), 10000);
  assert.equal(activeStackEntries.filter(item => item.type === "withdraw").reduce((sum, item) => sum + item.amountMinor, 0), 1000);

  await tap(page.locator('[data-money-section="empire"]').first());
  await tap(page.locator('.empire-truth-card [data-add="incomeEntry"]'));
  await page.locator('[name="streamId"]').selectOption({ label: "Memecoin Trading" });
  await page.locator('[name="kind"]').selectOption("trading_profit");
  await page.locator('[name="amount"]').fill("800");
  await page.locator('[name="status"]').selectOption("received");
  await page.locator('[name="account"]').selectOption("trading");
  await tap(page.locator("#save-item"));
  await page.locator("#editor-dialog").waitFor({ state: "hidden" });
  const profitState = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey);
  assert.equal(profitState.finances.incomeEntries.length, 1);
  assert.equal(profitState.finances.transactions.length, 1);
  assert.equal(profitState.finances.transactions[0].account, "trading");
  const profitEntryId = profitState.finances.incomeEntries[0].id;
  const empireText = await page.locator("#view-wealth").innerText();
  assert.match(empireText, /Revenue\s+£800\.00/i);
  assert.match(empireText, /Net profit\s+£800\.00/i);

  await tap(page.locator('.empire-truth-card [data-add="incomeEntry"]'));
  await page.locator('[name="streamId"]').selectOption({ label: "Memecoin Trading" });
  await page.locator('[name="kind"]').selectOption("capital_deposit");
  await page.locator('[name="amount"]').fill("100");
  await page.locator('[name="fromAccount"]').selectOption("business");
  await page.locator('[name="toAccount"]').selectOption("trading");
  await tap(page.locator("#save-item"));
  await page.locator("#editor-dialog").waitFor({ state: "hidden" });
  const capitalState = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey);
  assert.equal(capitalState.finances.transfers.filter(item => item.empireEntryId).length, 1);
  assert.equal(capitalState.finances.transactions.length, 1);
  assert.match(await page.locator("#view-wealth").innerText(), /Revenue\s+£800\.00/i);

  await tap(page.locator('.empire-truth-card [data-add="incomeEntry"]'));
  await page.locator('[name="streamId"]').selectOption({ label: "Digital Business / Client Work" });
  await page.locator('[name="kind"]').selectOption("revenue");
  await page.locator('[name="amount"]').fill("200");
  await page.locator('[name="status"]').selectOption("recorded");
  await page.locator('[name="account"]').selectOption("business");
  await tap(page.locator("#save-item"));
  await page.locator("#editor-dialog").waitFor({ state: "hidden" });
  const recordedState = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey);
  assert.equal(recordedState.finances.transactions.length, 1, "Recorded revenue must not create received cash");
  assert.match(await page.locator("#view-wealth").innerText(), /Revenue\s+£1,000\.00/i);
  assert.match(await page.locator("#view-wealth").innerText(), /Cash received\s+£800\.00/i);

  await tap(page.locator('.empire-truth-card [data-add="incomeEntry"]'));
  await page.locator('[name="streamId"]').selectOption({ label: "Video Clipping" });
  await page.locator('[name="kind"]').selectOption("revenue");
  await page.locator('[name="amount"]').fill("500");
  await page.locator('[name="status"]').selectOption("expected");
  await tap(page.locator("#save-item"));
  await page.locator("#editor-dialog").waitFor({ state: "hidden" });

  await tap(page.locator('.empire-truth-card [data-add="incomeEntry"]'));
  await page.locator('[name="streamId"]').selectOption({ label: "Memecoin Trading" });
  await page.locator('[name="kind"]').selectOption("unrealized_gain");
  await page.locator('[name="amount"]').fill("250");
  await tap(page.locator("#save-item"));
  await page.locator("#editor-dialog").waitFor({ state: "hidden" });
  const distinctionText = await page.locator("#view-wealth").innerText();
  assert.match(distinctionText, /Payments pending\s+£500\.00/i);
  assert.match(distinctionText, /Unrealized result\s+£250\.00/i);
  assert.match(distinctionText, /Revenue\s+£1,000\.00/i);

  await tap(page.locator('[data-income-period="custom"]'));
  assert.equal(await page.locator("[data-income-range]").count(), 2);
  await page.locator('[data-income-range="start"]').fill("2026-11-01");
  await page.locator('[data-income-range="start"]').dispatchEvent("change");
  assert.match(await page.locator("#view-wealth").innerText(), /Revenue\s+£1,000\.00/i);
  await tap(page.locator('[data-income-period="month"]'));

  await tap(page.locator('[data-income-section="rules"]'));
  await tap(page.locator(`[data-add="allocationPlan"][data-income-entry-id="${profitEntryId}"]`));
  await tap(page.locator("#save-item"));
  await page.locator("#editor-dialog").waitFor({ state: "hidden" });
  const allocatedState = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey);
  const allocatedStackEntry = allocatedState.finances.stackEntries.find(item => item.incomeEntryId === profitEntryId && !item.reversedAt);
  assert.equal(allocatedStackEntry.amountMinor, 50000);
  assert.ok(allocatedStackEntry.transferId);
  const allocationTransfer = allocatedState.finances.transfers.find(item => item.id === allocatedStackEntry.transferId);
  assert.equal(allocationTransfer.fromAccount, "trading");
  assert.equal(allocationTransfer.toAccount, "personal");
  assert.equal(allocationTransfer.amountMinor, 50000);

  await tap(page.locator('[data-money-section="stacks"]').first());
  await tap(page.locator('[data-stacks-section="history"]'));
  await tap(page.locator(`[data-undo-stack-entry="${allocatedStackEntry.id}"]`));
  const releasedState = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey);
  assert.ok(releasedState.finances.stackEntries.find(item => item.id === allocatedStackEntry.id).reversedAt);
  assert.equal(releasedState.finances.incomeEntries.find(item => item.id === profitEntryId).allocationAppliedAt, "");
  assert.ok(releasedState.finances.transfers.some(item => item.reversalOf === allocationTransfer.id));

  await tap(page.locator('[data-money-section="empire"]').first());
  await tap(page.locator('[data-income-section="ledger"]'));
  await tap(page.locator(`[data-undo-income-entry="${profitEntryId}"]`));
  const reversedState = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey);
  assert.ok(reversedState.finances.incomeEntries.find(item => item.id === profitEntryId).reversedAt);
  assert.equal(reversedState.finances.transactions.length, 2);
  assert.ok(reversedState.finances.transactions.some(item => item.reversalOf === profitState.finances.transactions[0].id));
  await tap(page.locator('[data-income-section="overview"]'));
  const reversedText = await page.locator("#view-wealth").innerText();
  assert.match(reversedText, /Revenue\s+£200\.00/i);
  assert.match(reversedText, /Cash received\s+£0\.00/i);
  assert.match(reversedText, /Payments pending\s+£500\.00/i);
  assert.match(reversedText, /Unrealized result\s+£250\.00/i);

  await tap(page.locator('[data-money-section="report"]').first());
  await tap(page.locator("[data-capture-money-report]"));
  const reportState = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey);
  assert.equal(reportState.finances.monthlyMoneyReports.length, 1);
  assert.equal(reportState.finances.monthlyMoneyReports[0].snapshot.revenueMinor, 20000);
  await tap(page.locator("[data-capture-money-report]"));
  const versionedReportState = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey);
  assert.equal(versionedReportState.finances.monthlyMoneyReports.length, 2, "Report recaptures must preserve versions");

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
  await tap(transferred.page.locator('.nav-item[data-view-target="wealth"]'));
  await tap(transferred.page.locator('[data-money-section="money"]').first());
  const transferredText = await transferred.page.locator("#view-wealth").innerText();
  assert.match(transferredText, /Personal position\s+£1,100\.00\s+£550\.00 safe to spend/i);
  assert.match(transferredText, /Business position\s+£570\.00\s+£445\.00 free after business plans/i);
  await transferred.context.close();

  const protectedBusinessFixture = legacyFixture();
  protectedBusinessFixture.finances.incomeAllocations = [{ id: "allocation-business", incomeId: "income-one", sourceAccount: "personal", amount: 100, amountMinor: 10000, essentialsMinor: 0, reserveMinor: 0, repaymentsMinor: 0, businessMinor: 10000, personalMinor: 0, status: "active", createdAt: "2026-10-01T09:00:00.000Z" }];
  const protectedBusiness = await openWithFixture(browser, baseUrl, protectedBusinessFixture);
  await tap(protectedBusiness.page.locator('.nav-item[data-view-target="wealth"]'));
  await tap(protectedBusiness.page.locator('[data-money-section="money"]').first());
  assert.match(await protectedBusiness.page.locator("#view-wealth").innerText(), /Business position\s+£670\.00\s+£445\.00 free after business plans/i);
  await protectedBusiness.context.close();
}

async function testMobileAndDialogs(browser, baseUrl) {
  for (const width of [320, 375, 430]) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, serviceWorkers: "block" });
    const page = await context.newPage();
    const pageErrors = [];
    page.on("pageerror", error => pageErrors.push(error.message));
    await page.goto(baseUrl, { waitUntil: "networkidle" });

    assert.equal(await page.locator(".home-focus-card").count(), 1);
    await tap(page.locator('[data-home-section="schedule"]'));
    assert.equal(await page.locator(".schedule-workspace").count(), 1);
    await tap(page.locator('[data-add="schedule"]'));
    await page.locator('[name="title"]').fill("Gym session");
    await page.locator('[name="startTime"]').fill("18:00");
    await page.locator('[name="endTime"]').fill("19:15");
    await tap(page.locator("#save-item"));
    await page.locator("#editor-dialog").waitFor({ state: "hidden" });
    assert.match(await page.locator(".schedule-agenda").innerText(), /Gym session/);
    await tap(page.locator('[data-home-section="cues"]'));
    assert.equal(await page.locator(".smart-cue-workspace").count(), 1);
    await tap(page.getByRole("tab", { name: "Command" }));
    assert.equal(await page.locator(".home-focus-card").count(), 1);

    for (const view of ["home", "wealth", "build", "life", "more"]) {
      await tap(page.locator(`.nav-item[data-view-target="${view}"]`));
      await page.locator(`#view-${view}.active`).waitFor();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      assert.ok(overflow <= 1, `${view} overflows by ${overflow}px at ${width}px`);
      const landingHeight = await page.locator(`#view-${view}`).evaluate(element => element.scrollHeight);
      assert.ok(landingHeight <= (view === "home" ? 1200 : 1050), `${view} landing is ${landingHeight}px tall at ${width}px`);
      if (view === "wealth") {
        for (const section of ["overview", "empire", "stacks", "money", "report"]) {
          await tap(page.locator(`[data-money-section="${section}"]`).first());
          const sectionOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
          assert.ok(sectionOverflow <= 1, `wealth/${section} overflows by ${sectionOverflow}px at ${width}px`);
          if (section === "overview") {
            const overviewHeight = await page.locator("#view-wealth").evaluate(element => element.scrollHeight);
            assert.ok(overviewHeight <= 1050, `wealth overview is ${overviewHeight}px tall at ${width}px`);
          }
        }
      }
      if (view === "build") {
        for (const section of ["overview", "portfolio", "actions", "opportunities"]) {
          await tap(page.locator(`[data-build-section="${section}"]`).first());
          const sectionOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
          assert.ok(sectionOverflow <= 1, `build/${section} overflows by ${sectionOverflow}px at ${width}px`);
        }
      }
      if (view === "life") {
        for (const section of ["overview", "people", "plans", "personal"]) {
          await tap(page.locator(`[data-life-section="${section}"]`).first());
          const sectionOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
          assert.ok(sectionOverflow <= 1, `life/${section} overflows by ${sectionOverflow}px at ${width}px`);
        }
      }
      if (view === "more") {
        for (const section of ["overview", "routines", "calendar", "review"]) {
          await tap(page.locator(`[data-more-section="${section}"]`).first());
          const sectionOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
          assert.ok(sectionOverflow <= 1, `more/${section} overflows by ${sectionOverflow}px at ${width}px`);
        }
      }
    }

    await tap(page.locator("#quick-capture"));
    assert.equal(await page.locator("#editor-dialog").evaluate(dialog => dialog.open), true);
    await tap(page.locator('#editor-dialog [data-close-dialog="editor-dialog"]'));
    assert.equal(await page.locator("#editor-dialog").evaluate(dialog => dialog.open), false);
    assert.deepEqual(pageErrors, [], `Browser errors at ${width}px: ${pageErrors.join("; ")}`);
    await context.close();
  }
}

async function testAuditHardening(browser, baseUrl) {
  const fixture = legacyFixture();
  const now = new Date();
  fixture.finances.bills[2].dueConfirmed = true;
  fixture.finances.bills[2].dueDay = now.getDate();
  fixture.finances.transactions = [{ id: "future-income", type: "income", account: "personal", amount: 100, amountMinor: 10000, date: now.toISOString().slice(0, 10), category: "Test income", note: "Current money", createdAt: now.toISOString() }];
  const { context, page } = await openWithFixture(browser, baseUrl, fixture);

  await tap(page.locator('.nav-item[data-view-target="wealth"]'));
  await tap(page.locator('[data-money-section="money"]').first());
  await tap(page.locator('[data-wealth-money-section="commitments"]'));
  const rentRow = page.locator(".bill-row").filter({ hasText: "Rent" });
  await tap(rentRow.locator("[data-bill-paid]"));
  await page.locator('[name="note"]').fill("Rent paid from personal");
  await tap(page.locator("#save-item"));
  await page.locator("#editor-dialog").waitFor({ state: "hidden" });
  const paidState = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey);
  assert.equal(paidState.finances.billPayments.length, 1);
  assert.equal(paidState.finances.transactions.filter(item => item.billPaymentId).length, 1);
  assert.equal(paidState.finances.transactions.find(item => item.billPaymentId).type, "expense");

  page.once("dialog", dialog => dialog.accept());
  await page.locator("[data-reverse-bill-payment]").click();
  const reversedPaymentState = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey);
  assert.ok(reversedPaymentState.finances.billPayments[0].reversedAt);
  assert.ok(reversedPaymentState.finances.transactions.some(item => item.reversalOf === reversedPaymentState.finances.billPayments[0].transactionId));

  const historicalCash = await page.evaluate(() => {
    const previous = new Date();
    previous.setMonth(previous.getMonth() - 1);
    const month = `${previous.getFullYear()}-${String(previous.getMonth() + 1).padStart(2, "0")}`;
    return moneyReportData(month).actualCashMinor;
  });
  assert.equal(historicalCash, 167000, "A historical report must exclude later cash transactions");

  const unsafeRejected = await page.evaluate(key => {
    const payload = JSON.parse(localStorage.getItem(key));
    payload.finances.bills[0].id = 'bad" onpointerdown="alert(1)';
    try { assertTrustedStatePayload(payload); return false; } catch { return true; }
  }, storageKey);
  assert.equal(unsafeRejected, true, "Unsafe imported identifiers must be rejected");

  const replacementSnapshot = await page.evaluate(key => {
    const payload = JSON.parse(localStorage.getItem(key));
    payload.week.outcome = "Replacement test";
    replaceStateSafely(payload, "Automated test");
    return JSON.parse(localStorage.getItem("50x-life-os-before-data-replacement"));
  }, storageKey);
  assert.equal(replacementSnapshot.reason, "Automated test");
  assert.ok(replacementSnapshot.data.week);

  await context.close();
}

async function main() {
  const server = createServer();
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}/`;
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {})
  });
  try {
    await testMigrationAndMoney(browser, baseUrl);
    await testAuditHardening(browser, baseUrl);
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
