import { RunnableLambda } from "@langchain/core/runnables";

const add = (input: { x: number; y: number }) => input.x + input.y;

const multiply = (input: { value: number; multiplier: number }) =>
  input.value * input.multiplier;

// Create runnables for the functions
const addLambda = RunnableLambda.from(add);
const multiplyLambda = RunnableLambda.from(multiply);

// Chain the lambdas for a mathematical operation
const chainedLambda = addLambda.pipe((result) =>
  multiplyLambda.invoke({ value: result, multiplier: 2 })
);

// Example invocation of the chainedLambda
chainedLambda.invoke({ x: 2, y: 3 }).then((result) => {
  console.log(result); // Output: 10 (since (2 + 3) * 2 = 10)
});
