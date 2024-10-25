import { type RunnableConfig, RunnableLambda } from "@langchain/core/runnables";

// Function that enhances a user profile based on configuration
const enhanceProfile = (
  profile: Record<string, any>,
  config?: RunnableConfig
) => {
  if (config?.configurable?.role) {
    return { ...profile, role: config.configurable.role };
  }
  return profile;
};

// Create a runnable from the function
const runnable = RunnableLambda.from(enhanceProfile);

describe("enhanceProfile - RunnableLambda", () => {
  test("should add the Admin role to the profile", async () => {
    const adminRunnable = runnable.bind({ configurable: { role: "Admin" } });
    const result = await adminRunnable.invoke({
      name: "Alice",
      email: "alice@example.com",
    });
    expect(result).toEqual({
      name: "Alice",
      email: "alice@example.com",
      role: "Admin",
    });
  });

  test("should add the User role to the profile", async () => {
    const userRunnable = runnable.bind({ configurable: { role: "User" } });
    const result = await userRunnable.invoke({
      name: "Bob",
      email: "bob@example.com",
    });
    expect(result).toEqual({
      name: "Bob",
      email: "bob@example.com",
      role: "User",
    });
  });

  test("should not add any role if the configuration is missing", async () => {
    const result = await runnable.invoke({
      name: "Charlie",
      email: "charlie@example.com",
    });
    expect(result).toEqual({ name: "Charlie", email: "charlie@example.com" });
  });

  test("should override role if different configuration is provided", async () => {
    const supervisorRunnable = runnable.bind({
      configurable: { role: "Supervisor" },
    });
    const result = await supervisorRunnable.invoke({
      name: "Dave",
      email: "dave@example.com",
    });
    expect(result).toEqual({
      name: "Dave",
      email: "dave@example.com",
      role: "Supervisor",
    });
  });
});
