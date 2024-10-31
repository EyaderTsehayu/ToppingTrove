const { Given, When, Then } = require("@cucumber/cucumber");
const axios = require("axios");
const assert = require("assert");

let response;
let requestBody = {};

// Base URL for the endpoint
const baseURL = "http://localhost:3000/api/user/normalUser";

Given(
  "I have the user details with name {string}, email {string}, password {string}, location {string}, phone number {string}",
  (name, email, password, location, phoneNumber) => {
    requestBody = {
      name,
      email,
      password,
      location,
      phoneNumber,
      // roles: roles.split(",").map((role) => role.trim()),
    };
  }
);

Given("a user already exists with email {string}", async (email) => {
  // Create a user with the specified email to simulate an existing user
  try {
    await axios.post(baseURL, {
      name: "Bereket",
      email,
      password: "12341234",
      location: "Addis Ababa",
      phoneNumber: "111222333",
    });
  } catch (error) {
    // Ignore error if user already exists
  }
});

Given(
  "I have incomplete user details with name {string}, email {string}, and no password",
  (name, email) => {
    requestBody = {
      name,
      email,
      // No password field provided intentionally
    };
  }
);

When("I send a POST request to create the user", async () => {
  try {
    response = await axios.post(baseURL, requestBody);
  } catch (err) {
    response = err.response;
  }
});

Then("the response status should be {int}", (statusCode) => {
  assert.strictEqual(response.status, statusCode);
});

Then("the response should contain a message {string}", (message) => {
  assert.strictEqual(response.data.message, message);
});

Then("the response should contain the user email {string}", (email) => {
  assert.strictEqual(response.data.user.email, email);
});

Then(
  "the response should contain an error message {string}",
  (errorMessage) => {
    assert.strictEqual(response.data.error, errorMessage);
  }
);
