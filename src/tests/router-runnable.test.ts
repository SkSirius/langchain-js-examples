import { RouterRunnable, RunnableLambda } from "@langchain/core/runnables";

describe("RouterRunnable", () => {
  let router: any;

  beforeEach(() => {
    // Set up the router with the runnables before each test
    router = new RouterRunnable({
      runnables: {
        // Converts text to uppercase
        toUpperCase: RunnableLambda.from((text: string) => text.toUpperCase()),

        // Reverses the given string
        reverseText: RunnableLambda.from((text: string) =>
          text.split("").reverse().join("")
        ),
      },
    });
  });

  test("should convert text to uppercase", async () => {
    const input = "Hello World";
    const result = await router.invoke({ key: "toUpperCase", input });
    expect(result).toBe("HELLO WORLD");
  });

  test("should reverse the text", async () => {
    const input = "Hello World";
    const result = await router.invoke({ key: "reverseText", input });
    expect(result).toBe("dlroW olleH");
  });

  test("should handle empty string for uppercase", async () => {
    const input = "";
    const result = await router.invoke({ key: "toUpperCase", input });
    expect(result).toBe("");
  });

  test("should handle empty string for reverseText", async () => {
    const input = "";
    const result = await router.invoke({ key: "reverseText", input });
    expect(result).toBe("");
  });
});
