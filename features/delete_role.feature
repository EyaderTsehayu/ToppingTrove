Feature: Delete role
    Scenario: Authorized user to the restaurant deletes existing role
     Given authorized user is logged in with ID 5
     When the user tries to delete the role with Id 18
     Then the user expects deleting "success"

    Scenario: Authorized user to the restaurant deletes non-existing role
     Given authorized user is logged in with ID 5
     When the user tries to delete the role with Id 15
     Then the user expects deleting "failure"
