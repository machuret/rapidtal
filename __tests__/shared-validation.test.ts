/** @jest-environment node */

import { isUuid } from "../supabase/functions/_shared/validation";

describe("shared Edge validation", () => {
  test.each([
    "123e4567-e89b-12d3-a456-426614174000",
    "550e8400-e29b-41d4-a716-446655440000",
    "6ba7b810-9dad-51d1-80b4-00c04fd430c8",
  ])("accepts a standard UUID: %s", (value) => {
    expect(isUuid(value)).toBe(true);
  });

  test.each([
    "123e4567-e89b-12d3-a456426614174000",
    "123e4567-e89b-62d3-a456-426614174000",
    "123e4567-e89b-12d3-c456-426614174000",
    "",
    null,
    undefined,
  ])("rejects a malformed UUID: %s", (value) => {
    expect(isUuid(value)).toBe(false);
  });
});
