import {
  RunnableAssign,
  RunnableLambda,
  RunnableParallel,
} from "@langchain/core/runnables";

const calculateAge = (x: { birthYear: number }): { age: number } => {
  const currentYear = new Date().getFullYear();
  return { age: currentYear - x.birthYear };
};

const createGreeting = (x: { name: string }): { greeting: string } => {
  return { greeting: `Hello, ${x.name}!` };
};

const mapper = RunnableParallel.from({
  age_step: RunnableLambda.from(calculateAge),
  greeting_step: RunnableLambda.from(createGreeting),
});

const runnableAssign = new RunnableAssign({ mapper });

runnableAssign.invoke({ name: "Alice", birthYear: 1990 }).then((result) => {
  console.log(result);
  // Output: { name: "Alice", birthYear: 1990, age_step: { age: 34 }, greeting_step: { greeting: "Hello, Alice!" } }
});
