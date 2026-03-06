# Quick Reference for Non-Technical Users

## What You Need:

1. **Your test file** (written in Notepad, saved as `.feature` in `user-scenarios` folder)
2. **This command** (copy and paste into PowerShell):

```powershell
$env:HEADLESS="false"; npx cucumber-js user-scenarios/**/*.feature --require-module ts-node/register --require steps/**/*.ts --format progress
```

---

## Example Test File

**File: `user-scenarios/my-test.feature`**

```gherkin
Feature: Login Test

  Scenario: Test login to website
    Given I open the URL "https://practicetestautomation.com/practice-test-login/"
    When I fill inputbox "Username" with "student"
    And I fill inputbox "Password" with "Password123"
    And I click button "Submit"
    And I wait for 2 seconds
    Then I should see text "Logged In Successfully"
```

---

## Available Commands

### Basic Commands
```gherkin
Given I open the URL "https://example.com"
When I fill inputbox "Username" with "myuser"
And I fill inputbox "Password" with "mypass"
And I fill textarea "Comments" with "This is a comment"
And I click button "Login"
And I click element "Dashboard"
And I wait for 3 seconds
Then I should see text "Welcome"
And I should not see text "Error"
```

### Form Elements
```gherkin
When I select "USA" from dropdown "Country"
When I check checkbox "Remember me"
When I select radio button "Male"
When I upload file "C:\\path\\to\\file.txt" to "Choose File"
When I select date "2024-12-25" in date picker "birthDate"
```

### Advanced Actions
```gherkin
When I double-click element "Item"
When I right-click element "File"
When I drag "A" and drop on "B"
When I scroll to element "Submit"
When I accept the alert
When I hover over element "Menu" to show tooltip
```

### Verification
```gherkin
Then URL should contain "dashboard"
And element "Submit" should be visible
And element "Save" should be enabled
And table cell at row 0 column 0 should contain "Name"
```

### Other
```gherkin
When I press key "Enter"
And I take screenshot "screenshot-name"
```

**For complete command list, see [USER-GUIDE.md](USER-GUIDE.md)**

---

## How to Run:

### Option 1: Run ALL Tests
Double-click: `RUN-MY-TESTS.bat`

### Option 2: Run ONE Specific Test
Drag your test file onto: `RUN-SPECIFIC-TEST.bat`

Or in PowerShell:
```powershell
.\RUN-SPECIFIC-TEST.bat my-test.feature
```

### Option 3: Using PowerShell Command

**Run all tests:**
```powershell
$env:HEADLESS="false"; npx cucumber-js user-scenarios/**/*.feature --require-module ts-node/register --require steps/**/*.ts --format progress
```

**Run specific test:**
```powershell
$env:HEADLESS="false"; npx cucumber-js user-scenarios/my-test.feature --require-module ts-node/register --require steps/**/*.ts --format progress
```

**Done!** ✅
