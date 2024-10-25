import { RunnableLambda } from "@langchain/core/runnables";

// Function to add two numbers
const add = (input: { x: number; y: number }) => input.x + input.y;

// Function to multiply two numbers
const multiply = (input: { value: number; multiplier: number }) =>
  input.value * input.multiplier;

// Create runnables for the functions
const addLambda = RunnableLambda.from(add);
const multiplyLambda = RunnableLambda.from(multiply);

// Chain the lambdas for a mathematical operation
const chainedLambda = addLambda.pipe((result) =>
  multiplyLambda.invoke({ value: result, multiplier: 2 })
);

describe("RunnableLambda - Operations", () => {
  test("should add two numbers and multiply the result by 2", async () => {
    const result = await chainedLambda.invoke({ x: 2, y: 3 });
    expect(result).toBe(10); // (2 + 3) * 2 = 10
  });

  test("should handle adding zero values correctly", async () => {
    const result = await chainedLambda.invoke({ x: 0, y: 0 });
    expect(result).toBe(0); // (0 + 0) * 2 = 0
  });
});
