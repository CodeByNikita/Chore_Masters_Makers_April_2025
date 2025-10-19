import { describe, test, vi, expect, beforeEach } from "vitest";
import {
  fetchChild,
  putTaskCompleteChild,
  postAddChild,
} from "../../src/services/child"; // Adjust path as needed
import { ChildData, TaskType, PrizeType } from "../../src/types/types"; // Adjust path as needed

// Mock global fetch
global.fetch = vi.fn();

// Mock localStorage
vi.spyOn(Storage.prototype, "getItem");

// Get the actual backend URL used in the service
const BACKEND_URL = "http://localhost:8000"; // Update this to match your actual backend URL

describe("Child Service Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("fetchChild function", () => {
    test("should call fetch with correct URL and token in headers", async () => {
      // Mock successful response
      global.fetch = vi.fn().mockResolvedValueOnce({
        json: () => Promise.resolve({ document: { name: "Test Child" } }),
      });

      const token = "test-token";
      await fetchChild(token);

      // Check fetch was called with correct arguments
      expect(global.fetch).toHaveBeenCalledWith(`${BACKEND_URL}/child`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    });

    test("should return the document property from the response", async () => {
      const mockChildData = { name: "Test Child", age: 10 };

      // Mock successful response
      global.fetch = vi.fn().mockResolvedValueOnce({
        json: () => Promise.resolve({ document: mockChildData }),
      });

      const result = await fetchChild("test-token");

      expect(result).toEqual(mockChildData);
    });

    test("should handle fetch errors", async () => {
      // Mock network error
      global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network error"));

      await expect(fetchChild("test-token")).rejects.toThrow("Network error");
    });

    test("should handle JSON parsing errors", async () => {
      // Mock JSON parsing error
      global.fetch = vi.fn().mockResolvedValueOnce({
        json: () => Promise.reject(new Error("Invalid JSON")),
      });

      await expect(fetchChild("test-token")).rejects.toThrow("Invalid JSON");
    });
  });

  describe("putTaskCompleteChild function", () => {
    test("should call fetch with correct URL, token, and task_id", async () => {
      // Mock successful response
      global.fetch = vi.fn().mockResolvedValueOnce({
        status: 200,
      });

      const token = "test-token";
      const taskId = "task123";

      await putTaskCompleteChild(token, taskId);

      // Check fetch was called with correct arguments
      expect(global.fetch).toHaveBeenCalledWith(`${BACKEND_URL}/child`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ task_id: taskId }),
      });
    });

    test("should include beforeBase64 in request body when provided", async () => {
      // Mock successful response
      global.fetch = vi.fn().mockResolvedValueOnce({
        status: 200,
      });

      const token = "test-token";
      const taskId = "task123";
      const beforeImage = "base64-before-image";

      await putTaskCompleteChild(token, taskId, beforeImage);

      // Check fetch was called with correct arguments
      expect(global.fetch).toHaveBeenCalledWith(`${BACKEND_URL}/child`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          task_id: taskId,
          picBefore: beforeImage,
        }),
      });
    });

    test("should include afterBase64 in request body when provided", async () => {
      // Mock successful response
      global.fetch = vi.fn().mockResolvedValueOnce({
        status: 200,
      });

      const token = "test-token";
      const taskId = "task123";
      const afterImage = "base64-after-image";

      await putTaskCompleteChild(token, taskId, null, afterImage);

      // Check fetch was called with correct arguments
      expect(global.fetch).toHaveBeenCalledWith(`${BACKEND_URL}/child`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          task_id: taskId,
          picAfter: afterImage,
        }),
      });
    });

    test("should include both before and after images when provided", async () => {
      // Mock successful response
      global.fetch = vi.fn().mockResolvedValueOnce({
        status: 200,
      });

      const token = "test-token";
      const taskId = "task123";
      const beforeImage = "base64-before-image";
      const afterImage = "base64-after-image";

      await putTaskCompleteChild(token, taskId, beforeImage, afterImage);

      // Check fetch was called with correct arguments
      expect(global.fetch).toHaveBeenCalledWith(`${BACKEND_URL}/child`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          task_id: taskId,
          picBefore: beforeImage,
          picAfter: afterImage,
        }),
      });
    });

    test("should throw error when response status is not 200", async () => {
      // Mock error response
      global.fetch = vi.fn().mockResolvedValueOnce({
        status: 400,
      });

      await expect(
        putTaskCompleteChild("test-token", "task123")
      ).rejects.toThrow("Unable to update like listing");
    });

    test("should handle fetch errors", async () => {
      // Mock network error
      global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network error"));

      await expect(
        putTaskCompleteChild("test-token", "task123")
      ).rejects.toThrow("Network error");
    });
  });

  describe("postAddChild function", () => {
    // Create mock data that matches your interface definitions
    const mockTask: TaskType = {
      _id: "task_123",
      name: "Clean Room",
      value: 10,
      imageURL: "http://example.com/task.jpg",
    };

    const mockPrize: PrizeType = {
      _id: "prize_123",
      name: "Ice Cream",
      value: "50",
      imageURL: "http://example.com/prize.jpg",
    };

    test("should get token from localStorage", async () => {
      // Mock localStorage.getItem
      localStorage.setItem("token", "saved-token");

      // Mock successful response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: "child123" }),
      });

      const childData: ChildData = {
        name: "Child Name",
        password: "password123",
        profilePic: null,
        selectedTasks: [],
        selectedPrize: null,
      };

      await postAddChild(childData);

      // Check localStorage.getItem was called
      expect(localStorage.getItem).toHaveBeenCalledWith("token");
    });

    test("should call fetch with correct URL, token, and child data", async () => {
      // Mock localStorage.getItem
      localStorage.setItem("token", "saved-token");
      vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("saved-token");

      // Mock successful response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: "child123" }),
      });

      const childData: ChildData = {
        name: "Child Name",
        password: "password123",
        profilePic: "base64-profile-pic",
        selectedTasks: [mockTask],
        selectedPrize: mockPrize,
      };

      await postAddChild(childData);

      // Check fetch was called with correct arguments
      expect(global.fetch).toHaveBeenCalledWith(`${BACKEND_URL}/child`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer saved-token",
        },
        body: JSON.stringify(childData),
      });
    });

    test("should return response JSON on success", async () => {
      // Mock localStorage.getItem
      vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("saved-token");

      const mockResponse = { id: "child123", name: "Test Child" };

      // Mock successful response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const childData: ChildData = {
        name: "Child Name",
        password: "password123",
        profilePic: null,
        selectedTasks: [],
        selectedPrize: null,
      };

      const result = await postAddChild(childData);

      expect(result).toEqual(mockResponse);
    });

    test("should throw error when response is not OK", async () => {
      // Mock localStorage.getItem
      vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("saved-token");

      // Mock error response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
      });

      const childData: ChildData = {
        name: "Child Name",
        password: "password123",
        profilePic: null,
        selectedTasks: [],
        selectedPrize: null,
      };

      await expect(postAddChild(childData)).rejects.toThrow(
        "Failed to add child"
      );
    });

    test("should handle fetch errors", async () => {
      // Mock localStorage.getItem
      vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("saved-token");

      // Mock network error
      global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network error"));

      const childData: ChildData = {
        name: "Child Name",
        password: "password123",
        profilePic: null,
        selectedTasks: [],
        selectedPrize: null,
      };

      await expect(postAddChild(childData)).rejects.toThrow("Network error");
    });

    test("should handle JSON parsing errors", async () => {
      // Mock localStorage.getItem
      vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("saved-token");

      // Mock JSON parsing error
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error("Invalid JSON")),
      });

      const childData: ChildData = {
        name: "Child Name",
        password: "password123",
        profilePic: null,
        selectedTasks: [],
        selectedPrize: null,
      };

      await expect(postAddChild(childData)).rejects.toThrow("Invalid JSON");
    });
  });
});
