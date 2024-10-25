import {
  RunnableLambda,
  RunnableWithFallbacks,
} from "@langchain/core/runnables";

const primaryOperation = (input: string): string => {
  if (input !== "safe") {
    throw new Error("Primary operation failed due to unsafe input");
  }
  return `Processed: ${input}`;
};

// Define a fallback operation that processes the input differently
const fallbackOperation = (input: string): string =>
  `Fallback processed: ${input}`;

const primaryRunnable = RunnableLambda.from(primaryOperation);
const fallbackRunnable = RunnableLambda.from(fallbackOperation);

// Apply the fallback logic using the .withFallbacks() method
const runnableWithFallback = primaryRunnable.withFallbacks([fallbackRunnable]);

// Alternatively, create a RunnableWithFallbacks instance manually
const manualFallbackChain = new RunnableWithFallbacks({
  runnable: primaryRunnable,
  fallbacks: [fallbackRunnable],
});

// Example invocation using .withFallbacks()
runnableWithFallback
  .invoke("unsafe input")
  .then((result) => {
    console.log(result);
    // Output: "Fallback processed: unsafe input"
  })
  .catch((error) => {
    console.error("Failed after all attempts:", error.message);
  });

// Example invocation using manual instantiation
manualFallbackChain
  .invoke("safe")
  .then((result) => {
    console.log(result);
    // Output: "Processed: safe"
  })
  .catch((error) => {
    console.error("Failed after all attempts:", error.message);
  });
