const fs = require('fs');
const path = require('path');

console.log('🔄 Generating step definitions...');
console.log('✅ Using traditional Gherkin patterns');

const stepDefinitions = [
  {
    name: 'NAVIGATION STEPS',
    pattern: 'I open the URL {string}',
    body: `Given('I open the URL {string}', { timeout: 60000 }, async (url: string) => {\n  await framework.openUrl(url);\n});`
  },
  {
    name: 'INPUT STEPS',
    pattern: 'I fill inputbox {string} with {string}',
    body: `When('I fill inputbox {string} with {string}', { timeout: 60000 }, async (field: string, value: string) => {\n  await framework.fillInputBox(field, value);\n});`
  },
  {
    name: 'INPUT STEPS',
    pattern: 'I fill datepicker {string} with {string}',
    body: `When('I fill datepicker {string} with {string}', { timeout: 60000 }, async (field: string, value: string) => {\n  await framework.fillInputBox(field, value);\n});`
  },
  {
    name: 'CLICK STEPS',
    pattern: 'I click button {string}',
    body: `When('I click button {string}', { timeout: 60000 }, async (text: string) => {\n  await framework.clickButton(text);\n});`
  },
  {
    name: 'CLICK STEPS',
    pattern: 'I click element {string}',
    body: `When('I click element {string}', { timeout: 60000 }, async (text: string) => {\n  await framework.clickElement(text);\n});`
  },
  {
    name: 'CLICK STEPS',
    pattern: 'I click element with selector {string}',
    body: `When('I click element with selector {string}', async (selector: string) => {\n  await framework.clickBySelector(selector);\n});`
  },
  {
    name: 'WAIT STEPS',
    pattern: 'I wait for {int} seconds',
    body: `When('I wait for {int} seconds', async (seconds: number) => {\n  await framework.wait(seconds);\n});`
  },
  {
    name: 'VERIFICATION STEPS',
    pattern: 'I should see text {string}',
    body: `Then('I should see text {string}', async (text: string) => {\n  await framework.verifyTextPresent(text);\n});`
  },
  {
    name: 'VERIFICATION STEPS',
    pattern: 'I should not see text {string}',
    body: `Then('I should not see text {string}', async (text: string) => {\n  await framework.verifyTextNotPresent(text);\n});`
  },
  {
    name: 'ALERT/DIALOG STEPS',
    pattern: 'I accept the alert',
    body: `When('I accept the alert', async () => {\n  await framework.acceptAlert();\n});`
  },
  {
    name: 'ALERT/DIALOG STEPS',
    pattern: 'I dismiss the alert',
    body: `When('I dismiss the alert', async () => {\n  await framework.dismissAlert();\n});`
  },
  {
    name: 'ALERT/DIALOG STEPS',
    pattern: 'I fill alert prompt with {string}',
    body: `When('I fill alert prompt with {string}', async (text: string) => {\n  await framework.fillAlertPrompt(text);\n});`
  },
  {
    name: 'FILE UPLOAD STEPS',
    pattern: 'I upload file {string} to {string}',
    body: `When('I upload file {string} to {string}', async (filePath: string, inputName: string) => {\n  await framework.uploadFile(inputName, filePath);\n});`
  },
  {
    name: 'DRAG AND DROP STEPS',
    pattern: 'I drag {string} and drop on {string}',
    body: `When('I drag {string} and drop on {string}', async (source: string, target: string) => {\n  await framework.dragAndDrop(source, target);\n});`
  },
  {
    name: 'TABLE STEPS',
    pattern: 'table cell at row {int} column {int} should contain {string}',
    body: `Then('table cell at row {int} column {int} should contain {string}', async (row: number, col: number, text: string) => {\n  const cellText = await framework.getTableCellText(row, col);\n  expect(cellText).toContain(text);\n});`
  },
  {
    name: 'TABLE STEPS',
    pattern: 'table should have {int} rows',
    body: `Then('table should have {int} rows', async (expectedRows: number) => {\n  const actualRows = await framework.getTableRowCount();\n  expect(actualRows).toBe(expectedRows);\n});`
  },
  {
    name: 'RADIO BUTTON STEPS',
    pattern: 'I select radio button {string}',
    body: `When('I select radio button {string}', async (name: string) => {\n  await framework.selectRadioButton(name);\n});`
  },
  {
    name: 'RADIO BUTTON STEPS',
    pattern: 'I select radio button {string} with value {string}',
    body: `When('I select radio button {string} with value {string}', async (name: string, value: string) => {\n  await framework.selectRadioButton(name, value);\n});`
  },
  {
    name: 'ADVANCED CLICK STEPS',
    pattern: 'I double-click element {string}',
    body: `When('I double-click element {string}', async (text: string) => {\n  await framework.doubleClickElement(text);\n});`
  },
  {
    name: 'ADVANCED CLICK STEPS',
    pattern: 'I right-click element {string}',
    body: `When('I right-click element {string}', async (text: string) => {\n  await framework.rightClickElement(text);\n});`
  },
  {
    name: 'TOOLTIP STEPS',
    pattern: 'I hover over element {string} to show tooltip',
    body: `When('I hover over element {string} to show tooltip', async (text: string) => {\n  await framework.hoverToShowTooltip(text);\n});`
  },
  {
    name: 'TOOLTIP STEPS',
    pattern: 'tooltip for {string} should be {string}',
    body: `Then('tooltip for {string} should be {string}', async (element: string, expectedTooltip: string) => {\n  const tooltip = await framework.getTooltipText(element);\n  expect(tooltip).toBe(expectedTooltip);\n});`
  },
  {
    name: 'DATE PICKER STEPS',
    pattern: 'I select date {string} in date picker {string}',
    body: `When('I select date {string} in date picker {string}', async (date: string, fieldName: string) => {\n  await framework.fillDatePicker(fieldName, date);\n});`
  },
  {
    name: 'MODAL/DIALOG STEPS',
    pattern: 'I should see modal with text {string}',
    body: `Then('I should see modal with text {string}', async (text: string) => {\n  await framework.verifyModalVisible(text);\n});`
  },
  {
    name: 'MODAL/DIALOG STEPS',
    pattern: 'I close the modal',
    body: `When('I close the modal', async () => {\n  await framework.closeModal();\n});`
  },
  {
    name: 'WINDOW/TAB STEPS',
    pattern: 'I switch to new window',
    body: `When('I switch to new window', async () => {\n  await framework.switchToWindow();\n});`
  },
  {
    name: 'WINDOW/TAB STEPS',
    pattern: 'I switch to window {int}',
    body: `When('I switch to window {int}', async (index: number) => {\n  await framework.switchToWindow(index);\n});`
  },
  {
    name: 'WINDOW/TAB STEPS',
    pattern: 'I open new tab',
    body: `When('I open new tab', async () => {\n  await framework.openNewTab();\n});`
  },
  {
    name: 'WINDOW/TAB STEPS',
    pattern: 'I open new tab with URL {string}',
    body: `When('I open new tab with URL {string}', async (url: string) => {\n  await framework.openNewTab(url);\n});`
  },
  {
    name: 'WINDOW/TAB STEPS',
    pattern: 'I close current tab',
    body: `When('I close current tab', async () => {\n  await framework.closeCurrentTab();\n});`
  },
  {
    name: 'WINDOW/TAB STEPS',
    pattern: 'there should be {int} open windows',
    body: `Then('there should be {int} open windows', async (expectedCount: number) => {\n  const count = await framework.getWindowCount();\n  expect(count).toBe(expectedCount);\n});`
  },
  {
    name: 'SCROLLING STEPS',
    pattern: 'I scroll to element {string}',
    body: `When('I scroll to element {string}', async (text: string) => {\n  await framework.scrollToElement(text);\n});`
  },
  {
    name: 'SCROLLING STEPS',
    pattern: 'I scroll to top',
    body: `When('I scroll to top', async () => {\n  await framework.scrollToTop();\n});`
  },
  {
    name: 'SCROLLING STEPS',
    pattern: 'I scroll to bottom',
    body: `When('I scroll to bottom', async () => {\n  await framework.scrollToBottom();\n});`
  },
  {
    name: 'SCROLLING STEPS',
    pattern: 'I scroll to position {int}, {int}',
    body: `When('I scroll to position {int}, {int}', async (x: number, y: number) => {\n  await framework.scrollToPosition(x, y);\n});`
  },
  {
    name: 'TEXTAREA STEPS',
    pattern: 'I fill textarea {string} with {string}',
    body: `When('I fill textarea {string} with {string}', async (name: string, value: string) => {\n  await framework.fillTextArea(name, value);\n});`
  },
  {
    name: 'ELEMENT STATE VERIFICATION STEPS',
    pattern: 'element {string} should be visible',
    body: `Then('element {string} should be visible', async (text: string) => {\n  await framework.verifyElementVisible(text);\n});`
  },
  {
    name: 'ELEMENT STATE VERIFICATION STEPS',
    pattern: 'element {string} should be hidden',
    body: `Then('element {string} should be hidden', async (text: string) => {\n  await framework.verifyElementHidden(text);\n});`
  },
  {
    name: 'ELEMENT STATE VERIFICATION STEPS',
    pattern: 'element {string} should be enabled',
    body: `Then('element {string} should be enabled', async (text: string) => {\n  await framework.verifyElementEnabled(text);\n});`
  },
  {
    name: 'ELEMENT STATE VERIFICATION STEPS',
    pattern: 'element {string} should be disabled',
    body: `Then('element {string} should be disabled', async (text: string) => {\n  await framework.verifyElementDisabled(text);\n});`
  },
  {
    name: 'ATTRIBUTE VERIFICATION STEPS',
    pattern: 'element {string} should have attribute {string} with value {string}',
    body: `Then('element {string} should have attribute {string} with value {string}', async (element: string, attr: string, value: string) => {\n  await framework.verifyElementAttribute(element, attr, value);\n});`
  },
  {
    name: 'CHECKBOX STEPS',
    pattern: 'I check checkbox {string}',
    body: `When('I check checkbox {string}', async (name: string) => {\n  await framework.checkCheckbox(name);\n});`
  },
  {
    name: 'CHECKBOX STEPS',
    pattern: 'I uncheck checkbox {string}',
    body: `When('I uncheck checkbox {string}', async (name: string) => {\n  await framework.uncheckCheckbox(name);\n});`
  },
  {
    name: 'DROPDOWN STEPS',
    pattern: 'I select from dropdown {string} option {string}',
    body: `When('I select from dropdown {string} option {string}', async (dropdownName: string, optionText: string) => {\n  await framework.selectFromDropdown(dropdownName, optionText);\n});`
  },
  {
    name: 'MULTI-SELECT DROPDOWN STEPS',
    pattern: 'I select from multi-select {string} option {string}',
    body: `When('I select from multi-select {string} option {string}', async (dropdownName: string, optionText: string) => {\n  await framework.selectFromDropdown(dropdownName, optionText);\n});`
  }
];

const featuresDir = path.join(__dirname, '..', 'features');
const tempFeaturesDir = path.join(__dirname, '..', 'temp-features');

const listFeatureFiles = (dir) => {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFeatureFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.feature')) {
      files.push(fullPath);
    }
  }

  return files;
};

const extractStepLines = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const stepLines = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    const match = /^(Given|When|Then|And|But)\s+(.*)$/.exec(trimmed);
    if (match && match[2]) {
      stepLines.push(match[2].trim());
    }
  }

  return stepLines;
};

const patternToRegex = (pattern) => {
  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const withTokens = escaped
    .replace(/\\\{string\\\}/g, '.*')
    .replace(/\\\{int\\\}/g, '\\d+');
  return new RegExp(`^${withTokens}$`, 'i');
};

const featureFiles = listFeatureFiles(
  fs.existsSync(tempFeaturesDir) ? tempFeaturesDir : featuresDir
);
const usedSteps = new Set();

for (const file of featureFiles) {
  for (const stepLine of extractStepLines(file)) {
    usedSteps.add(stepLine);
  }
}

const usedStepDefinitions = stepDefinitions.filter((step) => {
  const regex = patternToRegex(step.pattern);
  for (const used of usedSteps) {
    if (regex.test(used)) {
      return true;
    }
  }
  return false;
});

// Helper function to inject timeout into step definitions
const injectTimeout = (body) => {
  // Match Given/When/Then with single quotes and inject timeout before async function
  return body.replace(
    /^(Given|When|Then)\('([^']+)',\s*(async)/g,
    "$1('$2', { timeout: 60000 }, $3"
  );
};

const stepDefinitionsContent = usedStepDefinitions
  .map((step, index, arr) => {
    const header = index === 0 || arr[index - 1].name !== step.name
      ? `\n// ========================================\n// ${step.name}\n// ========================================\n\n`
      : '\n';
    const bodyWithTimeout = injectTimeout(step.body);
    return `${header}${bodyWithTimeout}`;
  })
  .join('\n');

const stepsContent = `import { Before, After, BeforeAll, Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, firefox, webkit, Browser, Page, BrowserContext, expect } from '@playwright/test';
import { SimpleTestFramework } from '../framework/SimpleTestFramework';
import { BrowserType } from '../framework/types/enums';

// Global variables to store browser context
let browser: Browser;
let context: BrowserContext;
let page: Page;
let framework: SimpleTestFramework;

// Make framework globally accessible
declare global {
  var framework: SimpleTestFramework;
}

// Set default timeout for all scenarios
BeforeAll(function () {
  setDefaultTimeout(60000);
});

// Before each scenario
Before({ timeout: 60000 }, async function () {
  const headless = process.env.HEADLESS !== 'false';
  const browserTypeStr = (process.env.BROWSER || 'chromium').toLowerCase() as BrowserType;
  
  // Launch browser based on BROWSER environment variable
  switch (browserTypeStr) {
    case BrowserType.FIREFOX:
      browser = await firefox.launch({ headless });
      break;
    case BrowserType.WEBKIT:
    case BrowserType.SAFARI:
      browser = await webkit.launch({ headless });
      break;
    case BrowserType.CHROMIUM:
    case BrowserType.CHROME:
    default:
      browser = await chromium.launch({ headless });
      break;
  }
  
  context = await browser.newContext();
  page = await context.newPage();
  framework = new SimpleTestFramework(page);
  global.framework = framework;
});

// After each scenario
After({ timeout: 60000 }, async function (scenario) {
  // Capture screenshot on failure
  if (scenario.result?.status === 'FAILED') {
    const screenshot = await page.screenshot({ fullPage: true });
    this.attach(screenshot, 'image/png');
  }
  
  await browser.close();
});

${stepDefinitionsContent}
`;

// Ensure steps directory exists
const stepsDir = path.join(__dirname, '..', 'steps');
if (!fs.existsSync(stepsDir)) {
  fs.mkdirSync(stepsDir, { recursive: true });
}

// Write the file
const filePath = path.join(stepsDir, 'common-steps.ts');
fs.writeFileSync(filePath, stepsContent, 'utf8');

console.log('✅ Step definitions generated successfully!');
console.log('   File: steps/common-steps.ts');
console.log('   Steps: All comprehensive steps included');
