import {
  RunnableAssign,
  RunnableLambda,
  RunnableParallel,
} from "@langchain/core/runnables";

// Function to calculate age based on birth year
const calculateAge = (x: { birthYear: number }): { age: number } => {
  const currentYear = new Date().getFullYear();
  return { age: currentYear - x.birthYear };
};

// Function to create a greeting message based on the user's name
const createGreeting = (x: { name: string }): { greeting: string } => {
  return { greeting: `Hello, ${x.name}!` };
};

// Set up the parallel runnable with both functions
const mapper = RunnableParallel.from({
  age_step: RunnableLambda.from(calculateAge),
  greeting_step: RunnableLambda.from(createGreeting),
});

const runnableAssign = new RunnableAssign({ mapper });

describe("RunnableAssign - User Profile Processing", () => {
  test("should correctly calculate age and create a greeting message", async () => {
    const input = { name: "Alice", birthYear: 1990 };
    const result = await runnableAssign.invoke(input);
    expect(result).toEqual({
      name: "Alice",
      birthYear: 1990,
      age_step: { age: new Date().getFullYear() - 1990 },
      greeting_step: { greeting: "Hello, Alice!" },
    });
  });

  test("should handle a different name and birth year", async () => {
    const input = { name: "Bob", birthYear: 1985 };
    const result = await runnableAssign.invoke(input);
    expect(result).toEqual({
      name: "Bob",
      birthYear: 1985,
      age_step: { age: new Date().getFullYear() - 1985 },
      greeting_step: { greeting: "Hello, Bob!" },
    });
  });

  test("should handle empty name gracefully", async () => {
    const input = { name: "", birthYear: 2000 };
    const result = await runnableAssign.invoke(input);
    expect(result).toEqual({
      name: "",
      birthYear: 2000,
      age_step: { age: new Date().getFullYear() - 2000 },
      greeting_step: { greeting: "Hello, !" },
    });
  });
});
