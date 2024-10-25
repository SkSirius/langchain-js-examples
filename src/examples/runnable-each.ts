import { RunnableEach, RunnableLambda } from "@langchain/core/runnables";

const toUpperCase = (input: string): string => input.toUpperCase();

const addGreeting = (input: string): string => `Hello, ${input}!`;

const upperCaseLambda = RunnableLambda.from(toUpperCase);
const greetingLambda = RunnableLambda.from(addGreeting);

const chain = new RunnableEach({
  bound: upperCaseLambda.pipe(greetingLambda),
});

chain.invoke(["alice", "bob", "carol"]).then((result) => {
  console.log(result);
  // Output: ["Hello, ALICE!", "Hello, BOB!", "Hello, CAROL!"]
});
