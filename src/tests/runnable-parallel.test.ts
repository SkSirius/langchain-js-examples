import { RunnableLambda, RunnableParallel } from "@langchain/core/runnables";

// Define functions for age manipulation
const addYears = (age: number): number => age + 5; // Adds 5 years to the current age
const yearsToFifty = (age: number): number => 50 - age; // Years left to reach age 50
const yearsToHundred = (age: number): number => 100 - age; // Years left to reach age 100

// Create RunnableLambda instances
const addYearsLambda = RunnableLambda.from(addYears);
const milestoneFiftyLambda = RunnableLambda.from(yearsToFifty);
const milestoneHundredLambda = RunnableLambda.from(yearsToHundred);

// Create a sequence combining RunnableLambda and RunnableParallel
const sequence = addYearsLambda.pipe(
  RunnableParallel.from({
    years_to_fifty: milestoneFiftyLambda,
    years_to_hundred: milestoneHundredLambda,
  })
);

describe("RunnableParallel - Age Prediction and Milestone Calculation", () => {
  test("should calculate years to milestone ages for a single input", async () => {
    const result = await sequence.invoke(25);
    expect(result).toEqual({ years_to_fifty: 20, years_to_hundred: 70 });
  });

  test("should handle batch processing of ages", async () => {
    const results = await sequence.batch([25, 35, 45]);
    expect(results).toEqual([
      { years_to_fifty: 20, years_to_hundred: 70 },
      { years_to_fifty: 10, years_to_hundred: 60 },
      { years_to_fifty: 0, years_to_hundred: 50 },
    ]);
  });

  test("should handle edge case where age is already above a milestone", async () => {
    const result = await sequence.invoke(60);
    expect(result).toEqual({ years_to_fifty: -15, years_to_hundred: 35 });
  });

  test("should handle a case where age is exactly at a milestone", async () => {
    const result = await sequence.invoke(50);
    expect(result).toEqual({ years_to_fifty: -5, years_to_hundred: 45 });
  });

  test("should handle a batch with diverse ages", async () => {
    const results = await sequence.batch([10, 50, 90]);
    expect(results).toEqual([
      { years_to_fifty: 35, years_to_hundred: 85 },
      { years_to_fifty: -5, years_to_hundred: 45 },
      { years_to_fifty: -45, years_to_hundred: 5 },
    ]);
  });
});
