Feature: Practice Test Automation Login
  As a student
  I want to login to the practice test automation website
  So that I can practice test automation

  Scenario: Successful login with valid credentials
    Given I open the URL "https://practicetestautomation.com/practice-test-login/"
    When I fill inputbox "Username" with "student"
    And I fill inputbox "Password" with "Password123"
    And I click button "Submit"
    And I wait for 2 seconds
    Then I should see text "Logged In Successfully"
