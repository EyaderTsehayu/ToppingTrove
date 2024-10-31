const { Given, When, Then } = require("@cucumber/cucumber");
const axios = require("axios");
const assert = require("assert");

let response;

Given("authorized user is logged in with ID {int}", (id) => {
  loginId = id;
});

// When step for updating the order status
When("the user tries to delete the role with Id {int}", async (roleId) => {
  // console.log("role id inside when", roleId);
  try {
    response = await axios.delete(`http://localhost:3000/api/role/${roleId}`);
  } catch (err) {
    response = err.response; // Capture error response if the update fails
  }
});

// Then step to check for success or failure
Then("the user expects deleting {string}", (condition) => {
  if (condition === "success") {
    assert.strictEqual(response.status, 200);
  } else if (condition === "failure") {
    assert.strictEqual(response.status, 404);
  }
});
