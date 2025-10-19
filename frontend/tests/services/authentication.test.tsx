import { describe, test, vi, expect, beforeEach } from "vitest";
import { postToken } from "../../src/services/authentication"; // Adjust path as needed
import { NavigateFunction } from "react-router";

// Mock global fetch
global.fetch = vi.fn();

// Mock localStorage
vi.spyOn(Storage.prototype, "setItem");

// Get the actual backend URL from the function's scope
const BACKEND_URL = "http://localhost:8000"; // This is the value being used based on your error

describe("postToken function", () => {
  const mockNavigate = vi.fn() as unknown as NavigateFunction;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test("should call fetch with correct URL and options", async () => {
    // Mock successful response
    global.fetch = vi.fn().mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve({ token: "test-token", userType: "Parent" }),
    });

    await postToken("testuser", "password123", mockNavigate);

    // Check fetch was called with correct arguments using the actual URL
    expect(global.fetch).toHaveBeenCalledWith(`${BACKEND_URL}/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "testuser",
        password: "password123",
      }),
    });
  });

  test("should store token in localStorage on successful response", async () => {
    // Mock successful response
    global.fetch = vi.fn().mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve({ token: "test-token", userType: "Parent" }),
    });

    await postToken("testuser", "password123", mockNavigate);

    // Check localStorage was called
    expect(localStorage.setItem).toHaveBeenCalledWith("token", "test-token");
  });

  test("should navigate to parent route when userType is Parent", async () => {
    // Mock successful response with Parent userType
    global.fetch = vi.fn().mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve({ token: "test-token", userType: "Parent" }),
    });

    await postToken("testuser", "password123", mockNavigate);

    // Check navigate was called with parent route
    expect(mockNavigate).toHaveBeenCalledWith("/parent");
  });

  test("should navigate to child route when userType is Child", async () => {
    // Mock successful response with Child userType
    global.fetch = vi.fn().mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve({ token: "test-token", userType: "Child" }),
    });

    await postToken("testuser", "password123", mockNavigate);

    // Check navigate was called with child route
    expect(mockNavigate).toHaveBeenCalledWith("/child");
  });

  test("should throw error when response status is not 200", async () => {
    // Mock error response
    global.fetch = vi.fn().mockResolvedValueOnce({
      status: 401,
      json: () => Promise.resolve({ error: "Invalid credentials" }),
    });

    // Test that the function throws an error
    await expect(
      postToken("testuser", "wrongpassword", mockNavigate)
    ).rejects.toThrow("Invalid credentials");

    // Verify localStorage was not called
    expect(localStorage.setItem).not.toHaveBeenCalled();

    // Verify navigate was not called
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("should handle network errors", async () => {
    // Mock network error
    global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network error"));

    // Test that the function throws an error
    await expect(
      postToken("testuser", "password123", mockNavigate)
    ).rejects.toThrow("Network error");

    // Verify localStorage was not called
    expect(localStorage.setItem).not.toHaveBeenCalled();

    // Verify navigate was not called
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("should handle malformed JSON response", async () => {
    // Mock malformed JSON response
    global.fetch = vi.fn().mockResolvedValueOnce({
      status: 200,
      json: () => Promise.reject(new Error("Invalid JSON")),
    });

    // Test that the function throws an error
    await expect(
      postToken("testuser", "password123", mockNavigate)
    ).rejects.toThrow("Invalid JSON");

    // Verify localStorage was not called
    expect(localStorage.setItem).not.toHaveBeenCalled();

    // Verify navigate was not called
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
