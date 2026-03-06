Feature: OpenCart User Registration
  As a new user
  I want to register on OpenCart demo site
  So that I can create an account

  Scenario: Register new user account
    Given I open the URL "https://demo.opencart.com/"
    When I click element "My account"
    And I wait for 1 seconds
    And I click element "Register"
    And I wait for 2 seconds
    And I fill inputbox "First Name" with "John"
    And I fill inputbox "Last Name" with "Doe"
    And I fill inputbox "E-Mail" with "johndoe.test@example.com"
    And I fill inputbox "Password" with "SecurePass123!"
    And I scroll to element "Newsletter"
    And I select radio button "Subscribe" with value "1"
    And I check checkbox "I have read and agree to the Privacy Policy"
    And I wait for 1 seconds
    And I click button "Continue"
    Then I should see text "Your Account Has Been Created"
