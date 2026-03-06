Feature: My Test
  Write your test description here

  Scenario: My first test scenario
    Given I open the URL "https://www.example.com"
    And I wait for 2 seconds
    Then I should see text "Example Domain"

  Scenario: My second test scenario
    Given I open the URL "https://practicetestautomation.com/practice-test-login/"
    When I fill inputbox "Username" with "student"
    And I fill inputbox "Password" with "Password123"
    And I click button "Submit"
    And I wait for 2 seconds
    Then I should see text "Logged In Successfully"
