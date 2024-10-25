import { RunnablePick } from "@langchain/core/runnables";

// Define input data
const inputData = {
  name: "John",
  age: 30,
  city: "New York",
  country: "USA",
  email: "john.doe@example.com",
  phone: "+1234567890",
};

// Create different runnables to select fields
const basicInfoRunnable = new RunnablePick(["name", "city"]);

describe("RunnablePick - User Profile Field Selection", () => {
  test("should select basic information fields", async () => {
    const result = await basicInfoRunnable.invoke(inputData);
    expect(result).toEqual({ name: "John", city: "New York" });
  });

  test("should return an empty object if no fields match", async () => {
    const emptyRunnable = new RunnablePick(["nonexistentField"]);
    const result = await emptyRunnable.invoke(inputData);
    expect(result).toEqual(undefined);
  });

  test("should handle an empty input gracefully", async () => {
    const result = await basicInfoRunnable.invoke({});
    expect(result).toEqual(undefined);
  });
});
