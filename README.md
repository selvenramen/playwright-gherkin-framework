# Simple Playwright Testing Framework 🚀

A user-friendly framework for browser test automation with two authoring styles:
- **TypeScript commands** for technical users
- **Gherkin/BDD steps** for non-technical users (plain English)

## 📋 Prerequisites

Before getting started, ensure you have:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PowerShell 5+** (Windows) or any terminal (Mac/Linux)
- **A code editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)
- **Browser access** (Tests open real browsers - Chromium, Firefox, or WebKit)

## 📚 Key Technology Stack

This framework is built on:
- **[Playwright](https://playwright.dev/)** - Modern browser automation
- **[Gherkin](https://cucumber.io/docs/gherkin/)** - BDD scenario language
- **[Cucumber.js](https://cucumber.io/docs/cucumber/)** - Test runner for Gherkin
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

Familiar with these? Great! If not, check the links above.

## ✨ New Elements & Features Added

This project now includes:
- **Dynamic step generation** from feature files (`scripts/generate-steps.js`)
- **Auto-filtered step output** (only used Gherkin patterns are generated)
- **Advanced interaction steps**: alert/prompt, drag & drop, tooltips, modal, tab/window, scrolling
- **Table & element-state validations** (row/cell checks, visible/hidden/enabled/disabled)
- **Attribute verification steps** and selector-based click support
- **Headed Gherkin execution** (`npm run test:gherkin:headed`)

## 📋 Setup

### 1) Install dependencies
```powershell
npm install
```

### 2) Install Playwright browsers
```powershell
npm run install-browsers
```

## 🎯 Two Ways to Write Tests

### Option 1: Gherkin/BDD (Recommended for non-technical users)

Create `.feature` files in `features/`:

```gherkin
Feature: Login to website

  Scenario: Successful login
    Given I open the URL "https://example.com"
    When I fill inputbox "Username" with "myuser"
    And I fill inputbox "Password" with "mypass"
    And I click button "Login"
    Then I should see text "Welcome"
```

**Advanced example with checkboxes and dropdowns:**

```gherkin
Feature: Account Creation

  Scenario: Register new account
    Given I open the URL "https://automationteststore.com/index.php?rt=account/create"
    When I fill inputbox "firstname" with "John"
    And I fill inputbox "lastname" with "Doe"
    And I fill inputbox "email" with "john@example.com"
    And I select from dropdown "country_id" option "United States"
    And I select from dropdown "zone_id" option "New York"
    And I check checkbox "agree"
    And I click button "Continue"
```

Run Gherkin tests:
```powershell
npm run test:gherkin
```

Run Gherkin tests (headed):
```powershell
npm run test:gherkin:headed
```

See full syntax guide: [GHERKIN-GUIDE.md](GHERKIN-GUIDE.md)

### Example Test Output

When you run a test, you'll see real-time progress:

```
.📂 Opening URL: https://demo.opencart.com/
.⏳ Waiting for 1 seconds...
.🖱️  Clicking element: My account
.⏳ Waiting for 1 seconds...
.🖱️  Clicking element: Register
.⏳ Waiting for 2 seconds...
.✏️  Filling input box "First Name" with: John
.✏️  Filling input box "Last Name" with: Doe
.✏️  Filling input box "E-Mail" with: johndoe.test@example.com
.✏️  Filling input box "Password" with: SecurePass123!
.📜 Scrolling to element: Newsletter
.🔘 Selecting radio button: Subscribe with value: 1
.☑️  Checking checkbox: I have read and agree to the Privacy Policy
.⏳ Waiting for 1 seconds...
.🖱️  Clicking button: Continue
.✅ I should see text "Your Account Has Been Created"

1 scenario (1 passed)
17 steps (17 passed)
0m35.241s (executing steps: 0m35.102s)
```

**✨ Each emoji shows what's happening in real-time!**

### Option 2: TypeScript

```typescript
import { createTest } from '../framework/SimpleTestFramework';

createTest('My test name', async (framework) => {
  await framework.openUrl('https://example.com');
  await framework.clickButton('Login');
  await framework.verifyTextPresent('Welcome');
});
```

## ⚙️ How Step Generation Works

The framework uses a **smart step generator** to keep things clean:

```
┌─────────────────────────────────────────────────────────────────┐
│  1. You write .feature files in features/ folder                │
│     (Gherkin syntax - plain English)                            │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. Run: npm run test:gherkin                                   │
│     (or use RUN-SPECIFIC-TEST.bat)                              │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. generate-steps.js extracts step patterns from .feature      │
│     Example: "I fill inputbox 'email' with 'test@email.com'"    │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. Matcher finds matching pattern in predefined library        │
│     Example: "I fill inputbox {string} with {string}"           │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. Generates only USED steps in common-steps.ts                │
│     (Keeps file clean, no unused step definitions)              │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  6. Cucumber.js runs the test with Playwright                   │
│     (Steps execute your defined actions)                        │
└─────────────────────────────────────────────────────────────────┘
```

**Key benefit**: Only steps you use are generated - no bloat!

## 🧩 Supported Gherkin Feature Categories

- Navigation: open URL
- Input: fill inputbox / textarea
- Click actions: button, generic element, selector click, double-click, right-click
- Wait and text verification
- Alert/Prompt: accept, dismiss, fill prompt
- File upload and drag/drop
- Table checks: cell content and row count
- Radio button selection
- **Checkbox**: check/uncheck checkbox (`I check checkbox {string}`, `I uncheck checkbox {string}`)
- **Dropdown**: select from dropdown (`I select from dropdown {string} option {string}`)
- Tooltip interactions
- Date picker input
- Modal visibility and close
- Window/Tab actions: switch, open, close, count
- Scrolling: element, top, bottom, custom position
- Element state and attribute validations

## 🛠️ Key Framework Methods (TypeScript)

Common methods in `SimpleTestFramework` include:
- `openUrl`, `fillInputBox`, `clickButton`, `clickElement`, `clickBySelector`
- `verifyTextPresent`, `verifyTextNotPresent`, `verifyUrlContains`
- `selectFromDropdown`, `checkCheckbox`, `uncheckCheckbox`
- `uploadFile`, `uploadMultipleFiles`
- `selectRadioButton`, `fillDatePicker`, `fillTextArea`
- `acceptAlert`, `dismissAlert`, `fillAlertPrompt`, `getAlertText`
- `dragAndDrop`, `doubleClickElement`, `rightClickElement`
- `hoverElement`, `hoverToShowTooltip`, `getTooltipText`
- `verifyModalVisible`, `closeModal`
- `openNewTab`, `switchToWindow`, `closeCurrentTab`, `getWindowCount`
- `scrollToElement`, `scrollToTop`, `scrollToBottom`, `scrollToPosition`
- `verifyElementVisible`, `verifyElementHidden`, `verifyElementEnabled`, `verifyElementDisabled`, `verifyElementAttribute`

## 🏃 Run Commands

### Playwright tests
```powershell
npm test
npm run test:headed
npm run test:ui
npm run test:specific -- --grep "Login"
```

### Gherkin flow
```powershell
npm run generate-steps
npm run test:gherkin
npm run test:gherkin:headed
```

## 📂 Current Project Structure

```
FW project - pattern/
├── features/                              # Gherkin scenarios
│   ├── testautomation-practice.feature   # Example: Form automation
│   └── automation-test-store-account.feature  # Example: Account creation
├── framework/
│   └── SimpleTestFramework.ts            # Framework engine
├── scripts/
│   └── generate-steps.js                 # Step generation + mapping
├── steps/
│   └── common-steps.ts                   # Auto-generated from feature usage
├── user-scenarios/
├── package.json
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

## 💡 Tips

- Keep feature step wording consistent with supported patterns.
- Prefer readable, business-friendly Gherkin sentences.
- Use headed mode (`npm run test:gherkin:headed`) during debugging to see the browser in action.
- All steps have a 60-second timeout configured automatically.
- Check `features/` folder for example scenarios (testautomation-practice, automation-test-store-account, opencart-register).
- Look at actual test output to understand what each step is doing (emojis help!).

## 🐛 Troubleshooting

- **Step not found**: Ensure wording matches a supported pattern in `scripts/generate-steps.js`.
- **Element not found**: Try clearer field/button text or selector-based step.
- **Flaky timing**: Add wait steps or stronger assertions.
- **Timeout errors**: Steps have 60-second timeout. If needed, adjust in `steps/common-steps.ts` or `scripts/generate-steps.js`.
- **Checkbox/Dropdown issues**: Framework tries multiple selectors (name, id, class, value). Check browser console for actual HTML attributes.

## 🔗 Resources

Need help? Check these docs:

**Framework Documentation:**
- [Gherkin/BDD Guide](GHERKIN-GUIDE.md) - Complete step reference (in this project)
- [User Guide](USER-GUIDE.md) - Detailed framework usage (in this project)

**External References:**
- [Playwright Official Docs](https://playwright.dev/docs/intro) - Browser automation API
- [Gherkin Syntax Guide](https://cucumber.io/docs/gherkin/) - BDD language basics
- [Cucumber.js Docs](https://cucumber.io/docs/cucumber/) - Test runner & hooks
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - For custom test code

---

*Need help? Check the guides above or run `npm run test:gherkin:headed` to watch tests execute live!*
