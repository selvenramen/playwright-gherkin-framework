Feature: Login to Orange HRM
  As a user
  I want to login to the Orange HRM application
  So that I can access my dashboard

  Scenario: Successful login to Orange HRM
    Given I open the URL "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
    When I fill inputbox "Username" with "Admin"
    And I fill inputbox "Password" with "admin123"
    And I click button "Login"
    And I click element "Leave"
    And I wait for 3 seconds
    Then I should see text "Leave List"
    And I should not see text "Invalid Credentials"
