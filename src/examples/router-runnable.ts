import { RouterRunnable, RunnableLambda } from "@langchain/core/runnables";

const router = new RouterRunnable({
  runnables: {
    toUpperCase: RunnableLambda.from((text: string) => text.toUpperCase()),
    reverseText: RunnableLambda.from((text: string) =>
      text.split("").reverse().join("")
    ),
  },
});

// Invoke the 'reverseText' runnable
const result1 = router.invoke({ key: "reverseText", input: "Hello World" }); // Output: "dlroW olleH"

// Invoke the 'toUpperCase' runnable
const result2 = router.invoke({ key: "toUpperCase", input: "Hello World" }); // Output: "HELLO WORLD"
