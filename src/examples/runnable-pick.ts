import { RunnablePick } from "@langchain/core/runnables";

const inputData = {
  name: "John",
  age: 30,
  city: "New York",
  country: "USA",
  email: "john.doe@example.com",
  phone: "+1234567890",
};

const basicInfoRunnable = new RunnablePick(["name", "city"]);

// Example invocations
basicInfoRunnable.invoke(inputData).then((outputData) => {
  console.log(outputData);
  // Output: { name: 'John', city: 'New York' }
});
