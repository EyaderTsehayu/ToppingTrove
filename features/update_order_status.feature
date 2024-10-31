Feature: Update order status

  Scenario: Authorized user to the restaurant updates order status
    Given a user is logged in with restaurant ID 5
    When the user tries to update order status of orderId 4 to "READY"  
    Then the user expects "success"
  
  Scenario: Unauthorized user to the restaurant updates order status
    Given a user is logged in with restaurant ID 9
    When the user tries to update order status of orderId 4 to "READY"   
    Then the user expects "failure"
