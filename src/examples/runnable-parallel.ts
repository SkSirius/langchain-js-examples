import { RunnableLambda, RunnableParallel } from "@langchain/core/runnables";

const addYears = (age: number): number => age + 5;
const yearsToFifty = (age: number): number => 50 - age;
const yearsToHundred = (age: number): number => 100 - age;

const addYearsLambda = RunnableLambda.from(addYears);
const milestoneFiftyLambda = RunnableLambda.from(yearsToFifty);
const milestoneHundredLambda = RunnableLambda.from(yearsToHundred);

const sequence = addYearsLambda.pipe(
  RunnableParallel.from({
    years_to_fifty: milestoneFiftyLambda,
    years_to_hundred: milestoneHundredLambda,
  })
);

sequence.invoke(25).then((result) => {
  console.log(result);
  // Output: { years_to_fifty: 20, years_to_hundred: 70 }
});

// Batch processing
sequence.batch([25, 35, 45]).then((results) => {
  console.log(results);
  // Output: [
  //   { years_to_fifty: 20, years_to_hundred: 70 },
  //   { years_to_fifty: 10, years_to_hundred: 60 },
  //   { years_to_fifty: 0, years_to_hundred: 50 }
  // ]
});
