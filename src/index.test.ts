import { test, expect } from "vitest";
import { deferredInit, isInitialized } from ".";

test("basic functionality", () => {
  let numCalls = 0;
  const values = deferredInit({
    potato() {
      numCalls++;
      return { yes: true };
    },
  });
  const result1 = values.potato;
  const result2 = values.potato;
  const result3 = values.potato;

  expect(result1).toBe(result2);
  expect(result2).toBe(result3);
  expect(numCalls).toBe(1);
});

test("peeking initialization status", () => {
  let numCalls = 0;
  const values = deferredInit({
    potato() {
      numCalls++;
      return { yes: true };
    },
  });
  expect(isInitialized(values, "potato")).toBe(false);
  const result1 = values.potato;
  expect(isInitialized(values, "potato")).toBe(true);
  const result2 = values.potato;
  expect(isInitialized(values, "potato")).toBe(true);
  expect(result1).toBe(result2);
  expect(numCalls).toBe(1);
});

test("isInitialized with random object throws", () => {
  expect(() =>
    isInitialized({ potato: true }, "potato")
  ).toThrowErrorMatchingInlineSnapshot(`[TypeError: The value that was passed into isInitialized doesn't seem to be an object that was returned by deferredInit.]`);
});
