 Feature: Fetch orders for restaurant owners

   Scenario: Restaurant owner fetches all orders
     Given a restaurant owner is logged in with ID 8
     When the restaurant owner tries to fetch all orders with resId 5
     Then the restaurant owner expects "success"
   
   Scenario: Restaurant owner tries to fetch empty orders
     Given a restaurant owner is logged in with ID 17
     When the restaurant owner tries to fetch all orders with resId 23
     Then the restaurant owner expects "failure"



