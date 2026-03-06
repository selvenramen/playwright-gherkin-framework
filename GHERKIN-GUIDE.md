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
    And I select "United States" from dropdown "Country"
    And I check checkbox "I agree to terms and conditions"
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

---

**Happy Testing with Gherkin! 🎉**
