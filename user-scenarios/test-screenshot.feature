Feature: Test Screenshot on Failure

  Scenario: This test will fail to demonstrate screenshot
    Given I open the URL "https://www.example.com"
    And I wait for 2 seconds
    Then I should see text "This Text Does Not Exist"
