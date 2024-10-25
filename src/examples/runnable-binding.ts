import { type RunnableConfig, RunnableLambda } from "@langchain/core/runnables";

const enhanceProfile = (
  profile: Record<string, any>,
  config?: RunnableConfig
) => {
  if (config?.configurable?.role) {
    return { ...profile, role: config.configurable.role };
  }
  return profile;
};

const runnable = RunnableLambda.from(enhanceProfile);

// Bind configuration to the runnable to set the user's role dynamically
const adminRunnable = runnable.bind({ configurable: { role: "Admin" } });
const userRunnable = runnable.bind({ configurable: { role: "User" } });

adminRunnable
  .invoke({ name: "Alice", email: "alice@example.com" })
  .then((result) => {
    console.log(result);
    // Output: { name: "Alice", email: "alice@example.com", role: "Admin" }
  });

userRunnable
  .invoke({ name: "Bob", email: "bob@example.com" })
  .then((result) => {
    console.log(result);
    // Output: { name: "Bob", email: "bob@example.com", role: "User" }
  });
