Feature: Test Automation Practice Website
  Testing various automation scenarios on practice site

  Scenario: Fill all form fields
    Given I open the URL "https://testautomationpractice.blogspot.com/"
    When I wait for 3 seconds
    # Fill all text fields
    And I fill inputbox "name" with "John Doe"
    And I fill inputbox "email" with "john@example.com"
    And I fill inputbox "phone" with "1234567890"
    And I fill textarea "address" with "123 Main Street, New York, NY"
    And I wait for 1 seconds
    # Select gender (radio button)
    And I select radio button "gender" with value "male"
    And I wait for 1 seconds
    # Check sunday in checkbox
    And I check checkbox "sunday"
    And I wait for 1 seconds
    # Select country from dropdown
    And I scroll to element "country"
    And I select from dropdown "country" option "India"
    And I wait for 1 seconds
    # Select multiple options from Colors (multi-select)
    And I scroll to element "colors"
    And I select from multi-select "colors" option "Red"
    And I wait for 1 seconds
    # Select multiple options from Sorted List (multi-select)
    And I scroll to element "Sorted List"
    And I select from multi-select "animals" option "Cheetah"
    And I wait for 1 seconds
    # Fill date picker
    And I fill datepicker "datepicker" with "03/05/2026"
    And I wait for 1 seconds
    And I click button "Submit"
    And I wait for 3 seconds