Feature: Example Test Scenarios
  These are example scenarios showing how to write Gherkin tests

  Scenario: Simple website verification
    Given I open the URL "https://www.example.com"
    And I wait for 2 seconds
    Then I should see text "Example Domain"

  Scenario: Form submission example
    Given I open the URL "https://www.example.com/contact"
    When I fill inputbox "name" with "John Doe"
    And I fill inputbox "email" with "john@example.com"
    And I select "Support" from dropdown "subject"
    And I check checkbox "I agree to terms"
    And I click button "Submit"
     And I wait for 2 seconds
    Then I should see text "Thank you"

  Scenario: Search functionality
    Given I open the URL "https://www.example.com"
    When I fill inputbox "search" with "laptop"
    And I press key "Enter"
    And I wait for 2 seconds
    Then I should see text "Search results"
    And URL should contain "search"
