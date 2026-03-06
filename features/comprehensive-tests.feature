Feature: Comprehensive Web Element Testing
  Testing all available web elements and interactions

  Scenario: Test JavaScript Alerts
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

  Scenario: Test File Upload
    Given I open the URL "https://the-internet.herokuapp.com/upload"
    When I upload file "C:\\Users\\selvanaden.ramen\\Desktop\\test-file.txt" to "file-upload"
    And I click button "Upload"
    Then I should see text "File Uploaded!"

  Scenario: Test Drag and Drop
    Given I open the URL "https://the-internet.herokuapp.com/drag_and_drop"
    When I drag "A" and drop on "B"
    And I wait for 2 seconds
    Then I should see text "B"

  Scenario: Test Table Data Extraction
    Given I open the URL "https://the-internet.herokuapp.com/tables"
    Then table cell at row 0 column 0 should contain "Last Name"
    And table should have 5 rows

  Scenario: Test Iframe Interaction
    Given I open the URL "https://the-internet.herokuapp.com/iframe"
    Then I should see text "An iFrame containing the TinyMCE WYSIWYG Editor"

  Scenario: Test Scrolling
    Given I open the URL "https://the-internet.herokuapp.com/infinite_scroll"
    When I scroll to bottom
    And I wait for 2 seconds
    When I scroll to top
    And I wait for 1 seconds
    Then I should see text "Infinite Scroll"

  Scenario: Test Radio Buttons and Checkboxes
    Given I open the URL "https://demoqa.com/radio-button"
    When I click element "Yes"
    Then I should see text "You have selected Yes"
    When I click element "Impressive"
    Then I should see text "You have selected Impressive"

  Scenario: Test Date Picker
    Given I open the URL "https://demoqa.com/date-picker"
    When I scroll to element "Select Date"
    And I select date "2024-12-25" in date picker "datePickerMonthYearInput"
    And I wait for 2 seconds
    Then element "datePickerMonthYearInput" should be visible

  Scenario: Test Modal Dialog
    Given I open the URL "https://demoqa.com/modal-dialogs"
    When I scroll to element "Small modal"
    And I click button "Small modal"
    Then I should see modal with text "This is a small modal"
    When I close the modal
    And I wait for 1 seconds
    Then element "Small modal" should be visible

  Scenario: Test Multiple Windows
    Given I open the URL "https://demoqa.com/browser-windows"
    When I scroll to element "New Window"
    And I click button "New Window"
    And I wait for 2 seconds
    When I switch to new window
    Then I should see text "This is a sample page"
    When I close current tab
    Then I should see text "Browser Windows"

  Scenario: Test Text Area
    Given I open the URL "https://demoqa.com/text-box"
    When I fill inputbox "userName" with "John Doe"
    And I fill inputbox "userEmail" with "john@example.com"
    And I fill textarea "currentAddress" with "123 Main Street, New York, NY 10001"
    And I scroll to element "Submit"
    And I click button "Submit"
    Then I should see text "John Doe"
    And I should see text "john@example.com"

  Scenario: Test Element Visibility and State
    Given I open the URL "https://demoqa.com/dynamic-properties"
    Then element "This text has random Id" should be visible
    And element "Will enable 5 seconds" should be disabled
    When I wait for 6 seconds
    Then element "Will enable 5 seconds" should be enabled

  Scenario: Test Tooltips
    Given I open the URL "https://demoqa.com/tool-tips"
    When I scroll to element "Hover me to see"
    And I hover over element "Hover me to see" to show tooltip
    And I wait for 2 seconds
    Then element "Hover me to see" should be visible

  Scenario: Test Double Click
    Given I open the URL "https://demoqa.com/buttons"
    When I scroll to element "Double Click Me"
    And I double-click element "Double Click Me"
    Then I should see text "You have done a double click"

  Scenario: Test Right Click
    Given I open the URL "https://demoqa.com/buttons"
    When I scroll to element "Right Click Me"
    And I right-click element "Right Click Me"
    Then I should see text "You have done a right click"

  Scenario: Test Form with Multiple Element Types
    Given I open the URL "https://testpages.eviltester.com/styled/basic-html-form-test.html"
    When I fill inputbox "username" with "JohnSmith"
    And I wait for 1 seconds
    And I fill inputbox "password" with "SecurePass123"
    And I wait for 1 seconds
    And I fill textarea "comments" with "This is a test comment for comprehensive form testing"
    And I wait for 1 seconds
    And I scroll to element "Checkbox 1"
    And I wait for 1 seconds
    And I click element "Checkbox 1"
    And I wait for 1 seconds
    And I click element "Checkbox 3"
    And I wait for 1 seconds
    And I scroll to element "Radio2"
    And I wait for 1 seconds
    And I click element "Radio2"
    And I wait for 1 seconds
    And I upload file "C:\\Users\\selvanaden.ramen\\Desktop\\test-file.txt" to "Choose File"
    And I wait for 1 seconds
    And I scroll to element "Submit"
    And I wait for 1 seconds
    Then element "Submit" should be visible
