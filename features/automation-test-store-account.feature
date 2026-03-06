Feature: Automation Test Store - Account Creation
  Testing account creation on automationteststore.com

  Scenario: Create new account with all details
    Given I open the URL "https://automationteststore.com/index.php?rt=account/create"
    When I wait for 3 seconds
    
    # Fill Personal Details
    And I fill inputbox "firstname" with "John"
    And I fill inputbox "lastname" with "Doe"
    And I fill inputbox "email" with "john.doe@example.com"
    And I fill inputbox "telephone" with "1234567890"
    And I fill inputbox "fax" with "9876543210"
    And I wait for 1 seconds
    
    # Fill Address Details
    And I fill inputbox "company" with "Tech Corp"
    And I fill inputbox "address_1" with "123 Main Street"
    And I fill inputbox "address_2" with "Suite 456"
    And I fill inputbox "city" with "New York"
    And I wait for 1 seconds
    # Select country first to populate states
    And I select from dropdown "country_id" option "United States"
    And I wait for 2 seconds
    # Select state after country
    And I select from dropdown "zone_id" option "New York"
    And I fill inputbox "postcode" with "10001"
    And I wait for 1 seconds
    
    # Fill Login Details
    And I fill inputbox "loginname" with "johndoe123"
    And I fill inputbox "password" with "SecurePass@123"
    And I fill inputbox "confirm" with "SecurePass@123"
    And I wait for 1 seconds
    
    # Newsletter Subscription
    And I select radio button "newsletter" with value "1"
    And I wait for 1 seconds
    
    # Accept Privacy Policy
    And I check checkbox "agree"
    And I wait for 1 seconds
    
    # Click Continue
    And I click button "Continue"
    And I wait for 3 seconds
