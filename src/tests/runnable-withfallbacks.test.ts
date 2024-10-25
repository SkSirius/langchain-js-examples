import {
  RunnableLambda,
  RunnableWithFallbacks,
} from "@langchain/core/runnables";

// Define the primary operation that throws an error
const primaryOperation = jest.fn((input: string): string => {
  if (input !== "safe") {
    throw new Error("Primary operation failed due to unsafe input");
  }
  return `Processed: ${input}`;
});

// Define a fallback operation
const fallbackOperation = jest.fn(
  (input: string): string => `Fallback processed: ${input}`
);

// Create RunnableLambda instances
const primaryRunnable = RunnableLambda.from(primaryOperation);
const fallbackRunnable = RunnableLambda.from(fallbackOperation);

// Apply the fallback logic using the .withFallbacks() method
const runnableWithFallback = primaryRunnable.withFallbacks([fallbackRunnable]);

// Manually create a RunnableWithFallbacks instance
const manualFallbackChain = new RunnableWithFallbacks({
  runnable: primaryRunnable,
  fallbacks: [fallbackRunnable],
});

describe("RunnableWithFallbacks - Primary and Fallback Processing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should use fallback when the primary operation fails", async () => {
    const result = await runnableWithFallback.invoke("unsafe input");
    expect(result).toBe("Fallback processed: unsafe input");
    expect(primaryOperation).toHaveBeenCalledTimes(1);
    expect(fallbackOperation).toHaveBeenCalledTimes(1);
  });

  test("should not use fallback when the primary operation succeeds", async () => {
    const result = await runnableWithFallback.invoke("safe");
    expect(result).toBe("Processed: safe");
    expect(primaryOperation).toHaveBeenCalledTimes(1);
    expect(fallbackOperation).toHaveBeenCalledTimes(0);
  });

  test("manual fallback chain should use fallback on failure", async () => {
    const result = await manualFallbackChain.invoke("unsafe input");
    expect(result).toBe("Fallback processed: unsafe input");
    expect(primaryOperation).toHaveBeenCalledTimes(1);
    expect(fallbackOperation).toHaveBeenCalledTimes(1);
  });

  test("manual fallback chain should succeed without fallback", async () => {
    const result = await manualFallbackChain.invoke("safe");
    expect(result).toBe("Processed: safe");
    expect(primaryOperation).toHaveBeenCalledTimes(1);
    expect(fallbackOperation).toHaveBeenCalledTimes(0);
  });

  test("should throw an error if all fallbacks fail", async () => {
    const alwaysFailPrimary = RunnableLambda.from(() => {
      throw new Error("Always fail");
    });

    const failingFallback = RunnableLambda.from(() => {
      throw new Error("Fallback also failed");
    });

    const failingChain = new RunnableWithFallbacks({
      runnable: alwaysFailPrimary,
      fallbacks: [failingFallback],
    });

    await expect(failingChain.invoke("input")).rejects.toThrow("Always fail");
  });
});
