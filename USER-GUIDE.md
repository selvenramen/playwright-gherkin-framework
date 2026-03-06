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

### Fill Text Area (Multi-line Text)
```gherkin
When I fill textarea "comments" with "This is a long comment"
And I fill textarea "address" with "123 Main Street, New York, NY 10001"
```

### Upload Files
```gherkin
When I upload file "C:\\Users\\YourName\\Desktop\\document.pdf" to "Choose File"
And I upload file "C:\\path\\to\\image.jpg" to "uploadPicture"
```

### Select Radio Button
```gherkin
When I select radio button "Male"
And I select radio button "Gender" with value "female"
```

### Handle Alerts/Dialogs
```gherkin
When I accept the alert
When I dismiss the alert
When I fill alert prompt with "Hello World"
```
**Important:** Alert handlers must be placed BEFORE the step that triggers the alert!

### Date Picker
```gherkin
When I select date "2024-12-25" in date picker "datePickerMonthYearInput"
```

### Drag and Drop
```gherkin
When I drag "A" and drop on "B"
And I drag "Item 1" and drop on "Drop Zone"
```

### Double-Click and Right-Click
```gherkin
When I double-click element "Double Click Me"
And I right-click element "Right Click Me"
```

### Hover and Tooltips
```gherkin
When I hover over element "Hover me to see" to show tooltip
```

### Modal/Dialog Windows
```gherkin
Then I should see modal with text "This is a modal"
When I close the modal
```

### Multiple Windows/Tabs
```gherkin
When I switch to new window
And I close current tab
```

### Scrolling
```gherkin
When I scroll to element "Submit"
And I scroll to top
And I scroll to bottom
```

### Table Verification
```gherkin
Then table cell at row 0 column 0 should contain "Last Name"
And table should have 5 rows
```

### Element State Verification
```gherkin
Then element "Submit" should be visible
And element "Save" should be enabled
And element "Delete" should be disabled
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

## 📝 Complete Examples

### Example 1: Form with Multiple Elements

Create a file named `user-scenarios\comprehensive-form-test.feature` with this content:

```gherkin
Feature: Complete Form Test
  Testing a form with various elements

  Scenario: Fill and submit registration form
    Given I open the URL "https://testpages.eviltester.com/styled/basic-html-form-test.html"
    When I fill inputbox "username" with "JohnSmith"
    And I wait for 1 seconds
    And I fill inputbox "password" with "SecurePass123"
    And I wait for 1 seconds
    And I fill textarea "comments" with "This is my feedback about the application"
    And I wait for 1 seconds
    And I click element "Checkbox 1"
    And I click element "Checkbox 3"
    And I wait for 1 seconds
    And I click element "Radio2"
    And I wait for 1 seconds
    And I upload file "C:\\Users\\selvanaden.ramen\\Desktop\\test-file.txt" to "Choose File"
    And I wait for 1 seconds
    And I scroll to element "Submit"
    And I click button "Submit"
    Then element "Submit" should be visible
```

### Example 2: Alert and Window Handling

```gherkin
Feature: Alert Test
  Testing JavaScript alerts

  Scenario: Handle different alert types
    Given I open the URL "https://the-internet.herokuapp.com/javascript_alerts"
    When I accept the alert
    And I click button "Click for JS Alert"
    Then I should see text "You successfully clicked an alert"
    When I dismiss the alert
    And I click button "Click for JS Confirm"
    Then I should see text "You clicked: Cancel"
    When I fill alert prompt with "Hello World"
    And I click button "Click for JS Prompt"
    Then I should see text "You entered: Hello World"
```

### Example 3: Simple Login Test

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

## 📚 Quick Reference - All Available Commands

### Navigation & Basic Actions
```gherkin
Given I open the URL "https://example.com"
When I wait for 2 seconds
And I take screenshot "screenshot-name"
```

### Input & Forms
```gherkin
When I fill inputbox "field-name" with "value"
And I fill textarea "field-name" with "multi-line text"
And I select "option-text" from dropdown "dropdown-name"
And I check checkbox "checkbox-name"
And I select radio button "radio-name"
And I select radio button "name" with value "value"
And I select date "2024-12-25" in date picker "field-name"
And I upload file "C:\\path\\to\\file.txt" to "Choose File"
```

### Click Actions
```gherkin
When I click button "button-text"
And I click element "element-text"
And I double-click element "element-text"
And I right-click element "element-text"
And I press key "Enter"
```

### Scrolling
```gherkin
When I scroll to element "element-text"
And I scroll to top
And I scroll to bottom
```

### Alerts & Prompts
```gherkin
When I accept the alert
When I dismiss the alert
When I fill alert prompt with "response text"
```
**Note:** Alert handlers must be placed BEFORE the action that triggers the alert!

### Drag & Drop
```gherkin
When I drag "source-element" and drop on "target-element"
```

### Modals & Windows
```gherkin
Then I should see modal with text "modal text"
When I close the modal
When I switch to new window
And I close current tab
```

### Tooltips & Hover
```gherkin
When I hover over element "element-text" to show tooltip
```

### Verification (Assertions)
```gherkin
Then I should see text "expected text"
And I should not see text "unwanted text"
And URL should contain "dashboard"
And element "element-text" should be visible
And element "element-text" should be enabled
And element "element-text" should be disabled
```

### Table Verification
```gherkin
Then table cell at row 0 column 0 should contain "text"
And table should have 5 rows
```

---

**Happy Testing! 🎉**
