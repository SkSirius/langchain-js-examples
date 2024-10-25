import { RunnableLambda, RunnableRetry } from "@langchain/core/runnables";

// Simulate an API call that fails randomly
const simulateApiCall = (input: string): string => {
  console.log(`Attempting API call with input: ${input}`);
  throw new Error("API call failed due to network issue");
};

const apiCallLambda = RunnableLambda.from(simulateApiCall);

// Apply retry logic using the .withRetry() method
const apiCallWithRetry = apiCallLambda.withRetry({ stopAfterAttempt: 3 });

// Alternatively, create a RunnableRetry instance manually
const manualRetry = new RunnableRetry({
  bound: apiCallLambda,
  maxAttemptNumber: 3,
  config: {},
});

// Example invocation using the .withRetry() method
apiCallWithRetry
  .invoke("Request 1")
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error("Failed after multiple retries:", error.message);
  });

// Example invocation using the manual retry instance
manualRetry
  .invoke("Request 2")
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error("Failed after multiple retries:", error.message);
  });
