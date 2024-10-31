const { Given, When, Then } = require("@cucumber/cucumber");
const axios = require("axios");
const assert = require("assert");

let response;
let loggedUserResId;

// Given step for restaurant owner login
Given("a user is logged in with restaurant ID {int}", async (id) => {
  loggedUserResId = id;
});

// When step for updating the order status
When(
  "the user tries to update order status of orderId {int} to {string}",
  async (orderId, status) => {
    try {
      response = await axios.put(
        `http://localhost:3000/api/order?id=${orderId}&loggedUserRes=${loggedUserResId}`,
        { status: status } // Set status to READY in the request payload
      );
    } catch (err) {
      response = err.response; // Capture error response if the update fails
    }
  }
);

// Then step to check for success or failure
Then("the user expects {string}", (condition) => {
  if (condition === "success") {
    assert.strictEqual(response.status, 200);
  } else if (condition === "failure") {
    assert.strictEqual(response.status, 500);
  }
});
