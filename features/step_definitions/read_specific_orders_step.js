const { Given, When, Then } = require("@cucumber/cucumber");
const axios = require("axios");
const assert = require("assert");

let response;

// Given step for restaurant owner login
Given("a restaurant owner is logged in with ID {int}", async (id) => {
  loggedUserId = id;
});

// When step for fetching all orders
When(
  "the restaurant owner tries to fetch all orders with resId {int}",
  async (id) => {
    try {
      response = await axios.get("http://localhost:3000/api/order", {});
      response.data = response.data.filter(
        (order) => order.restaurantId === id
      );
    } catch (err) {
      response = err.response; // Capture error response if fetching fails
    }
  }
);

// Then step to check for success
Then("the restaurant owner expects {string}", (condition) => {
  console.log(condition);
  if (condition === "success") {
    assert.strictEqual(response.status, 200); // Expect a 200 status for successful fetch
    assert(response.data.length > 0, "Orders were fetched successfully");
  } else if (condition === "failure") {
    //  assert.strictEqual(response.status, 404); // Expect a 404 status for failed fetch
    assert(
      response.data.length == 0,
      "No orders found for the given restaurant"
    );
  }
});
