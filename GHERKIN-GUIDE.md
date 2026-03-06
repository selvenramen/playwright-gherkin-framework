# Gherkin/BDD Testing Guide 📝

## What is Gherkin?

Gherkin is a plain-English language that allows non-technical users to write test scenarios. It uses simple keywords like `Given`, `When`, `Then`, and `And`.

## Quick Start

### 1. Write Your Feature File

Create a new file in the `features/` folder with a `.feature` extension:

**Example: `features/my-test.feature`**
```gherkin
Feature: Login to my application
  As a user
  I want to login to the website
  So that I can access my account

  Scenario: Successful login
    Given I open the URL "https://example.com/login"
    When I fill inputbox "Username" with "myuser"
    And I fill inputbox "Password" with "mypass123"
    And I click button "Login"
    Then I should see text "Welcome"
```

### 2. Run Your Feature File

```powershell
npm run test:gherkin
```

To see the browser while testing:
```powershell
npm run test:gherkin:headed
```

## Available Gherkin Steps

### Navigation
```gherkin
Given I open the URL "https://example.com"
```

### Input Actions
```gherkin
When I fill inputbox "Username" with "myusername"
And I fill inputbox "Email" with "user@example.com"
```

### Button Clicks
```gherkin
When I click button "Login"
And I click button "Submit"
```

### Element Clicks
```gherkin
When I click element "Dashboard"
And I click element "Settings"
```

### Dropdowns
```gherkin
When I select "United States" from dropdown "Country"
```

### Checkboxes
```gherkin
When I check checkbox "Remember me"
And I uncheck checkbox "Newsletter"
```

### Keyboard Actions
```gherkin
When I press key "Enter"
And I press key "Escape"
```

### Wait Commands
```gherkin
And I wait for 2 seconds
And I wait for 5 seconds
```

### Verification (Assertions)
```gherkin
Then I should see text "Welcome"
And I should not see text "Error"
And URL should contain "dashboard"
```

### Screenshots
```gherkin
And I take screenshot "after-login"
```

### Hover Actions
```gherkin
When I hover over element "User Menu"
```

## Advanced Gherkin Steps

### Text Area (Multi-line Text)
```gherkin
When I fill textarea "comments" with "This is a long comment with multiple lines"
And I fill textarea "address" with "123 Main Street, New York, NY 10001"
```

### File Upload
```gherkin
When I upload file "C:\\Users\\YourName\\Desktop\\document.pdf" to "Choose File"
And I upload file "C:\\path\\to\\file.txt" to "file-upload"
```
**Note:** Use double backslashes `\\` in Windows file paths

### Radio Buttons
```gherkin
When I select radio button "Male"
And I select radio button "Gender" with value "female"
And I select radio button "Yes"
```

### Alert/Prompt/Confirm Dialogs
```gherkin
When I accept the alert
When I dismiss the alert
When I fill alert prompt with "My Response"
```
**Important:** Alert handlers MUST be placed BEFORE the action that triggers the alert!

**Example:**
```gherkin
Scenario: Test JavaScript Alerts
  Given I open the URL "https://the-internet.herokuapp.com/javascript_alerts"
  When I accept the alert
  And I click button "Click for JS Alert"
  Then I should see text "You successfully clicked an alert"
```

### Date Picker
```gherkin
When I select date "2024-12-25" in date picker "datePickerMonthYearInput"
And I select date "2025-01-01" in date picker "startDate"
```

### Drag and Drop
```gherkin
When I drag "A" and drop on "B"
And I drag "Source Item" and drop on "Target Zone"
```
**Note:** This includes visual feedback (yellow/green highlights)

### Double-Click and Right-Click
```gherkin
When I double-click element "Double Click Me"
And I right-click element "Right Click Me"
```

### Tooltips
```gherkin
When I hover over element "Hover me to see" to show tooltip
```

### Modal/Dialog Windows
```gherkin
Then I should see modal with text "This is a small modal"
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
**Note:** Scrolling includes visual feedback (orange highlight)

### Table Verification
```gherkin
Then table cell at row 0 column 0 should contain "Last Name"
And table cell at row 1 column 2 should contain "john@example.com"
And table should have 5 rows
```

### Element State Verification
```gherkin
Then element "Submit" should be visible
And element "Save Button" should be enabled
And element "Delete" should be disabled
```

## Complete Example

```gherkin
Feature: User Registration
  As a new user
  I want to register an account
  So that I can use the application

  Scenario: Register with valid details
    Given I open the URL "https://example.com/register"
    When I fill inputbox "First Name" with "John"
    And I fill inputbox "Last Name" with "Doe"
    And I fill inputbox "Email" with "john@example.com"
    And I fill inputbox "Password" with "SecurePass123"
    And I fill inputbox "Confirm Password" with "SecurePass123"
    And I fill textarea "Bio" with "Software tester with 5 years experience"
    And I select date "1990-05-15" in date picker "birthDate"
    And I select "United States" from dropdown "Country"
    And I select radio button "Gender" with value "male"
    And I check checkbox "I agree to terms and conditions"
    And I upload file "C:\\Users\\John\\Documents\\profile.jpg" to "Choose File"
    And I scroll to element "Register"
    And I click button "Register"
    And I wait for 3 seconds
    Then I should see text "Registration successful"
    And I should see text "Welcome John"
    And URL should contain "dashboard"

  Scenario: Register with invalid email
    Given I open the URL "https://example.com/register"
    When I fill inputbox "Email" with "invalid-email"
    And I click button "Register"
    Then I should see text "Invalid email format"
```

## Writing Multiple Scenarios

You can write multiple test scenarios in one feature file:

```gherkin
Feature: Login functionality

  Scenario: Login with valid credentials
    Given I open the URL "https://example.com/login"
    When I fill inputbox "Username" with "validuser"
    And I fill inputbox "Password" with "validpass"
    And I click button "Login"
    Then I should see text "Dashboard"

  Scenario: Login with invalid credentials
    Given I open the URL "https://example.com/login"
    When I fill inputbox "Username" with "invaliduser"
    And I fill inputbox "Password" with "wrongpass"
    And I click button "Login"
    Then I should see text "Invalid credentials"
```

## Best Practices

1. **One feature per file**: Keep related scenarios together
2. **Clear scenario names**: Use descriptive names that explain what you're testing
3. **Use comments**: Add `#` for comments in your feature files
4. **Be specific**: Use exact text as it appears on the webpage
5. **Add waits when needed**: If pages load slowly, add wait steps

## Tips for Non-Technical Users

- **Feature**: Describe what you're testing (like "Login" or "Registration")
- **Scenario**: Describe a specific test case
- **Given**: Set up the test (usually opening a URL)
- **When**: Perform actions (filling forms, clicking buttons)
- **Then**: Verify results (check if expected text appears)
- **And**: Add more steps of the same type

## Running Specific Features

Run a specific feature file:
```powershell
npx cucumber-js features/login.feature --require-module ts-node/register --require steps/**/*.ts
```

Run with browser visible:
```powershell
$env:HEADLESS="false"; npm run test:gherkin
```

## Examples in This Framework

Check these example files in the `features/` folder:
- `login.feature` - Login test examples
- `practice-login.feature` - Practice website tests
- `example.feature` - Various scenario examples
- `comprehensive-tests.feature` - Complete example with all element types

---

## 📚 Complete Step Reference

### Navigation
- `Given I open the URL {string}`

### Input Fields
- `When I fill inputbox {string} with {string}`
- `When I fill textarea {string} with {string}`
- `When I fill datepicker {string} with {string}`
- `When I select date {string} in date picker {string}`

### Click Actions
- `When I click button {string}`
- `When I click element {string}`
- `When I double-click element {string}`
- `When I right-click element {string}`

### Form Elements
- `When I select {string} from dropdown {string}`
- `When I select from dropdown {string} option {string}`
- `When I check checkbox {string}`
- `When I uncheck checkbox {string}`
- `When I select radio button {string}`
- `When I select radio button {string} with value {string}`

### File Upload
- `When I upload file {string} to {string}`

### Alerts & Dialogs
- `When I accept the alert`
- `When I dismiss the alert`
- `When I fill alert prompt with {string}`

### Drag & Drop
- `When I drag {string} and drop on {string}`

### Scrolling
- `When I scroll to element {string}`
- `When I scroll to top`
- `When I scroll to bottom`

### Modals & Windows
- `Then I should see modal with text {string}`
- `When I close the modal`
- `When I switch to new window`
- `When I open new tab`
- `When I close current tab`

### Tooltips & Hover
- `When I hover over element {string}`
- `When I hover over element {string} to show tooltip`

### Keyboard
- `When I press key {string}`

### Wait & Screenshot
- `When I wait for {int} seconds`
- `When I take screenshot {string}`

### Text Verification
- `Then I should see text {string}`
- `Then I should not see text {string}`

### URL Verification
- `Then URL should contain {string}`

### Element State
- `Then element {string} should be visible`
- `Then element {string} should be hidden`
- `Then element {string} should be enabled`
- `Then element {string} should be disabled`

### Table Verification
- `Then table cell at row {int} column {int} should contain {string}`
- `Then table should have {int} rows`

---

**Happy Testing with Gherkin! 🎉**
