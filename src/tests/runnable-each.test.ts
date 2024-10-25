import { RunnableEach, RunnableLambda } from "@langchain/core/runnables";

// Function that converts a string to uppercase
const toUpperCase = (input: string): string => input.toUpperCase();

// Function that adds a greeting to the string
const addGreeting = (input: string): string => `Hello, ${input}!`;

// Create runnables from these functions
const upperCaseLambda = RunnableLambda.from(toUpperCase);
const greetingLambda = RunnableLambda.from(addGreeting);

// Create a RunnableEach that applies the upperCaseLambda first, followed by greetingLambda
const chain = new RunnableEach({
  bound: upperCaseLambda.pipe(greetingLambda),
});

describe("RunnableEach - Name Transformation", () => {
  test("should convert names to uppercase and add greeting", async () => {
    const input = ["alice", "bob", "carol"];
    const result = await chain.invoke(input);
    expect(result).toEqual(["Hello, ALICE!", "Hello, BOB!", "Hello, CAROL!"]);
  });

  test("should handle an empty array", async () => {
    const input: string[] = [];
    const result = await chain.invoke(input);
    expect(result).toEqual([]);
  });

  test("should handle a single name", async () => {
    const input = ["dave"];
    const result = await chain.invoke(input);
    expect(result).toEqual(["Hello, DAVE!"]);
  });

  test("should handle names with different cases", async () => {
    const input = ["Eve", "fRaNk"];
    const result = await chain.invoke(input);
    expect(result).toEqual(["Hello, EVE!", "Hello, FRANK!"]);
  });
});
