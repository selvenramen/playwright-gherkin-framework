# 📝 How to Write and Run Tests (For Non-Technical Users)

## Quick Start (2 Steps Only!)

### Step 1: Write Your Test

1. Open Notepad
2. Write your test using the template below
3. Save in `user-scenarios` folder with `.feature` extension
   - Example: Save as `my-test.feature`
   - In Notepad: File → Save As → All Files (not Text Documents) → Type filename `my-test.feature`

### Step 2: Run Your Test

**Open PowerShell in the project folder and run:**
```powershell
$env:HEADLESS="false"; npx cucumber-js user-scenarios/**/*.feature --require-module ts-node/register --require steps/**/*.ts --format progress
```

**Or double-click:** `RUN-MY-TESTS.bat`

That's it! Your tests will run with the browser visible.

---

## 📋 Test Template

Copy this and modify for your needs:

```gherkin
Feature: Login Test
  Testing login functionality

  Scenario: Test login to website
    Given I open the URL "https://your-website.com/login"
    When I fill inputbox "Username" with "myusername"
    And I fill inputbox "Password" with "mypassword"
    And I click button "Login"
    Then I should see text "Welcome"
```

---

## 🎯 Available Commands

### Open a Website
```gherkin
Given I open the URL "https://www.example.com"
```

### Fill a Text Field
```gherkin
When I fill inputbox "Username" with "myuser"
And I fill inputbox "Email" with "user@example.com"
```

### Click a Button
```gherkin
When I click button "Login"
And I click button "Submit"
And I click button "Sign Up"
```

### Click Any Element (Link, Text, etc.)
```gherkin
When I click element "Dashboard"
And I click element "Settings"
```

### Wait for Page to Load
```gherkin
And I wait for 2 seconds
And I wait for 5 seconds
```

### Check if Text Appears
```gherkin
Then I should see text "Welcome"
And I should see text "Login successful"
```

### Check if Text Does NOT Appear
```gherkin
Then I should not see text "Error"
And I should not see text "Invalid"
```

### Select from Dropdown
```gherkin
When I select "United States" from dropdown "Country"
```

### Check/Uncheck Boxes
```gherkin
When I check checkbox "Remember me"
And I uncheck checkbox "Newsletter"
```

### Press Keyboard Keys
```gherkin
When I press key "Enter"
And I press key "Tab"
```

### Take a Screenshot
```gherkin
And I take screenshot "after-login"
```

### Check the URL
```gherkin
Then URL should contain "dashboard"
```

---

## 📝 Complete Example

Create a file named `user-scenarios\my-test.feature` with this content:

```gherkin
Feature: Shopping Test
  Test buying a product

  Scenario: Login and search for product
    Given I open the URL "https://www.example-shop.com"
    When I click element "Login"
    And I fill inputbox "Email" with "customer@example.com"
    And I fill inputbox "Password" with "mypassword123"
    And I click button "Sign In"
    And I wait for 3 seconds
    Then I should see text "Welcome"
    
    When I fill inputbox "Search" with "laptop"
    And I press key "Enter"
    And I wait for 2 seconds
    Then I should see text "Search Results"
```

---

## 💡 Tips

1. **Save files with .feature extension**: Always save as `.feature` not `.txt`
   - In Notepad: Save As → Select "All Files" → Type `mytest.feature`

2. **One test per scenario**: Keep scenarios simple and focused

3. **Use exact text**: When checking for text, use the EXACT words you see on the website

4. **Add waits**: If pages load slowly, add `And I wait for 3 seconds`

5. **Multiple scenarios**: You can have many scenarios in one file

---

## 🚀 Running Your Tests

### ⭐ Easiest Way - Double-Click:

**Run ALL tests:**
- Double-click: `RUN-MY-TESTS.bat`

**Run ONE specific test:**
- Drag your test file onto: `RUN-SPECIFIC-TEST.bat`
- Or double-click `RUN-SPECIFIC-TEST.bat` and type filename when asked

### Using Commands:

**Run ALL tests (browser visible):**
```powershell
$env:HEADLESS="false"; npx cucumber-js user-scenarios/**/*.feature --require-module ts-node/register --require steps/**/*.ts --format progress
```

**Run ONE specific test (browser visible):**
```powershell
$env:HEADLESS="false"; npx cucumber-js user-scenarios/my-test.feature --require-module ts-node/register --require steps/**/*.ts --format progress
```

**Run tests without browser (faster):**
```powershell
npx cucumber-js user-scenarios/**/*.feature --require-module ts-node/register --require steps/**/*.ts --format progress
```

---

## 📂 Where to Save Your Tests

Save all your test files in the `user-scenarios` folder:
```
FW project/
  └── user-scenarios/
      ├── TEMPLATE.feature (example)
      ├── my-login-test.feature (your test)
      ├── shopping-test.feature (your test)
      └── registration-test.feature (your test)
```

---

## ❓ Need Help?

- Check `TEMPLATE.feature` for examples
- Check `features` folder for more advanced examples
- All commands are listed above - just copy and modify!

---

**Happy Testing! 🎉**
