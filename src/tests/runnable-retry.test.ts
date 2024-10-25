import { RunnableLambda, RunnableRetry } from "@langchain/core/runnables";

// Mock function that simulates an API call and always fails
const simulateApiCall = jest.fn((input: string): string => {
  console.log(`Attempting API call with input: ${input}`);
  throw new Error("API call failed due to network issue");
});

// Create a RunnableLambda from the simulateApiCall function
const apiCallLambda = RunnableLambda.from(simulateApiCall);

// Apply retry logic using the .withRetry() method
const apiCallWithRetry = apiCallLambda.withRetry({ stopAfterAttempt: 3 });

// Manually create a RunnableRetry instance
const manualRetry = new RunnableRetry({
  bound: apiCallLambda,
  maxAttemptNumber: 3,
  config: {},
});

describe("RunnableRetry - API Call Simulation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should retry up to 3 times and fail if simulateApiCall keeps failing", async () => {
    simulateApiCall.mockImplementation(() => {
      throw new Error("API call failed due to network issue");
    });

    await expect(apiCallWithRetry.invoke("Request 1")).rejects.toThrow(
      "API call failed due to network issue"
    );

    // Verify that the function was called 3 times due to retries
    expect(simulateApiCall).toHaveBeenCalledTimes(3);
  });

  test("manual retry should retry up to 3 times and fail if simulateApiCall keeps failing", async () => {
    simulateApiCall.mockImplementation(() => {
      throw new Error("API call failed due to network issue");
    });

    await expect(manualRetry.invoke("Request 2")).rejects.toThrow(
      "API call failed due to network issue"
    );

    // Verify that the function was called 3 times due to retries
    expect(simulateApiCall).toHaveBeenCalledTimes(3);
  });

  test("should fail immediately if the retry limit is set to 1", async () => {
    // Set up a lambda with retry limit of 1
    const singleRetryLambda = apiCallLambda.withRetry({ stopAfterAttempt: 1 });

    simulateApiCall.mockImplementation(() => {
      throw new Error("API call failed due to network issue");
    });

    await expect(singleRetryLambda.invoke("Request 5")).rejects.toThrow(
      "API call failed due to network issue"
    );

    // Verify that the function was called only once due to the retry limit
    expect(simulateApiCall).toHaveBeenCalledTimes(1);
  });
});
