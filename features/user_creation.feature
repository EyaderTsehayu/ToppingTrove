Feature: User Creation

  Scenario: Successfully create a new user
    Given I have the user details with name "Eyad", email "Eyad@gmail.com", password "password123", location "Addis Ababa", phone number "1234567890"
    When I send a POST request to create the user
    Then the response status should be 201
    And the response should contain a message "User created successfuly"
    And the response should contain the user email "Eyad@gmail.com"

  Scenario: Attempt to create a user with an existing email
    Given a user already exists with email "Beki@gmail.com"
    And I have the user details with name "Beki ", email "Beki@gmail.com", password "password123", location "Los Angeles", phone number "0987654321"
    When I send a POST request to create the user
    Then the response status should be 409
    And the response should contain an error message "User with this email already exists"

  Scenario: Attempt to create a user without required fields
    Given I have incomplete user details with name "Mike", email "mike@gmail.com", and no password
    When I send a POST request to create the user
    Then the response status should be 500
    And the response should contain a message "Something went wrong"
