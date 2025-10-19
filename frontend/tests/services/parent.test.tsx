import { describe, test, vi, expect, beforeEach } from "vitest";
import {
  fetchParent,
  postAddPrize,
  postAddTask,
  postAddParent,
  deleteTask,
  deletePrize,
} from "../../src/services/parent"; // Adjust path as needed
import {
  PrizePayload,
  TaskPayload,
  TokenResponse,
} from "../../src/types/types"; // Adjust path as needed

// Mock global fetch
global.fetch = vi.fn();

// Mock localStorage
vi.spyOn(Storage.prototype, "getItem");
vi.spyOn(Storage.prototype, "setItem");

// Get the actual backend URL used in the service
const BACKEND_URL = "http://localhost:8000"; // Update this to match your actual backend URL

describe("Parent Service Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("fetchParent function", () => {
    test("should call fetch with correct URL and token in headers", async () => {
      // Mock successful response
      global.fetch = vi.fn().mockResolvedValueOnce({
        json: () => Promise.resolve({ document: { username: "TestParent" } }),
      });

      const token = "test-token";
      await fetchParent(token);

      // Check fetch was called with correct arguments
      expect(global.fetch).toHaveBeenCalledWith(`${BACKEND_URL}/parent`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    });

    test("should return the document property from the response", async () => {
      const mockParentData = { username: "TestParent", tasks: [] };

      // Mock successful response
      global.fetch = vi.fn().mockResolvedValueOnce({
        json: () => Promise.resolve({ document: mockParentData }),
      });

      const result = await fetchParent("test-token");

      expect(result).toEqual(mockParentData);
    });

    test("should handle fetch errors", async () => {
      // Mock network error
      global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network error"));

      await expect(fetchParent("test-token")).rejects.toThrow("Network error");
    });

    test("should handle JSON parsing errors", async () => {
      // Mock JSON parsing error
      global.fetch = vi.fn().mockResolvedValueOnce({
        json: () => Promise.reject(new Error("Invalid JSON")),
      });

      await expect(fetchParent("test-token")).rejects.toThrow("Invalid JSON");
    });
  });

  describe("postAddPrize function", () => {
    test("should get token from localStorage", async () => {
      // Mock localStorage.getItem
      localStorage.setItem("token", "saved-token");

      // Mock successful response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: "prize123" }),
      });

      const prizeData: PrizePayload = {
        name: "New Prize",
        value: 50,
        image: "base64-image-data",
      };

      await postAddPrize(prizeData);

      // Check localStorage.getItem was called
      expect(localStorage.getItem).toHaveBeenCalledWith("token");
    });

    test("should call fetch with correct URL, token, and prize data", async () => {
      // Mock localStorage.getItem
      vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("saved-token");

      // Mock successful response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: "prize123" }),
      });

      const prizeData: PrizePayload = {
        name: "New Prize",
        value: 50,
        image: "base64-image-data",
      };

      await postAddPrize(prizeData);

      // Check fetch was called with correct arguments
      expect(global.fetch).toHaveBeenCalledWith(`${BACKEND_URL}/parent/prize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer saved-token",
        },
        body: JSON.stringify({
          name: prizeData.name,
          value: prizeData.value,
          imageURL: prizeData.image,
        }),
      });
    });

    test("should return response JSON on success", async () => {
      // Mock localStorage.getItem
      vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("saved-token");

      const mockResponse = { id: "prize123", name: "New Prize" };

      // Mock successful response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await postAddPrize({
        name: "New Prize",
        value: 50,
        image: null,
      });

      expect(result).toEqual(mockResponse);
    });

    test("should throw error when response is not OK", async () => {
      // Mock localStorage.getItem
      vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("saved-token");

      // Mock error response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      await expect(
        postAddPrize({
          name: "New Prize",
          value: 50,
          image: null,
        })
      ).rejects.toThrow("Failed to add prize");
    });

    test("should handle fetch errors", async () => {
      // Mock localStorage.getItem
      vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("saved-token");

      // Mock network error
      global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network error"));

      await expect(
        postAddPrize({
          name: "New Prize",
          value: 50,
          image: null,
        })
      ).rejects.toThrow("Network error");
    });
  });

  describe("postAddTask function", () => {
    test("should get token from localStorage", async () => {
      // Mock localStorage.getItem
      localStorage.setItem("token", "saved-token");

      // Mock successful response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: "task123" }),
      });

      const taskData: TaskPayload = {
        name: "New Task",
        value: 10,
        imageURL: "base64-image-data",
      };

      await postAddTask(taskData);

      // Check localStorage.getItem was called
      expect(localStorage.getItem).toHaveBeenCalledWith("token");
    });

    test("should call fetch with correct URL, token, and task data", async () => {
      // Mock localStorage.getItem
      vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("saved-token");

      // Mock successful response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: "task123" }),
      });

      const taskData: TaskPayload = {
        name: "New Task",
        value: 10,
        imageURL: "base64-image-data",
      };

      await postAddTask(taskData);

      // Check fetch was called with correct arguments
      expect(global.fetch).toHaveBeenCalledWith(`${BACKEND_URL}/parent/task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer saved-token",
        },
        body: JSON.stringify(taskData),
      });
    });

    test("should return response JSON on success", async () => {
      // Mock localStorage.getItem
      vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("saved-token");

      const mockResponse = { id: "task123", name: "New Task" };

      // Mock successful response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await postAddTask({
        name: "New Task",
        value: 10,
        imageURL: null,
      });

      expect(result).toEqual(mockResponse);
    });

    test("should throw error when response is not OK", async () => {
      // Mock localStorage.getItem
      vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("saved-token");

      // Mock error response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      await expect(
        postAddTask({
          name: "New Task",
          value: 10,
          imageURL: null,
        })
      ).rejects.toThrow("Failed to add task");
    });

    test("should handle fetch errors", async () => {
      // Mock localStorage.getItem
      vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("saved-token");

      // Mock network error
      global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network error"));

      await expect(
        postAddTask({
          name: "New Task",
          value: 10,
          imageURL: null,
        })
      ).rejects.toThrow("Network error");
    });
  });

  describe("postAddParent function", () => {
    test("should make signup request with correct data", async () => {
      // Mock successful signup response
      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({ token: "new-token", userType: "Parent" }),
        });

      const signupData = {
        username: "newparent",
        password: "password123",
        profilePic: "base64-profile-pic",
      };

      await postAddParent(signupData);

      // Check first fetch (signup) was called with correct arguments
      expect(global.fetch).toHaveBeenCalledWith(`${BACKEND_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });
    });

    test("should make token request after successful signup", async () => {
      // Mock successful signup and token responses
      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({ token: "new-token", userType: "Parent" }),
        });

      const signupData = {
        username: "newparent",
        password: "password123",
        profilePic: "base64-profile-pic",
      };

      await postAddParent(signupData);

      // Check second fetch (token) was called with correct arguments
      expect(global.fetch).toHaveBeenNthCalledWith(2, `${BACKEND_URL}/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });
    });

    test("should store token in localStorage on successful signup", async () => {
      // Mock successful signup and token responses
      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({ token: "new-token", userType: "Parent" }),
        });

      const signupData = {
        username: "newparent",
        password: "password123",
        profilePic: "base64-profile-pic",
      };

      await postAddParent(signupData);

      // Check token was stored in localStorage
      expect(localStorage.setItem).toHaveBeenCalledWith("token", "new-token");
    });

    test("should throw error when signup response is not OK", async () => {
      // Mock error signup response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: "Username already exists" }),
      });

      const signupData = {
        username: "newparent",
        password: "password123",
        profilePic: "base64-profile-pic",
      };

      await expect(postAddParent(signupData)).rejects.toThrow(
        "Username already exists"
      );
    });

    test("should throw error when token response is not OK", async () => {
      // Mock successful signup but failed token response
      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
        });

      const signupData = {
        username: "newparent",
        password: "password123",
        profilePic: "base64-profile-pic",
      };

      await expect(postAddParent(signupData)).rejects.toThrow(
        "Authentication failed"
      );
    });

    test("should handle fetch errors", async () => {
      // Mock network error
      global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network error"));

      const signupData = {
        username: "newparent",
        password: "password123",
        profilePic: "base64-profile-pic",
      };

      await expect(postAddParent(signupData)).rejects.toThrow("Network error");
    });
  });

  describe("deleteTask function", () => {
    test("should get token from localStorage", async () => {
      // Mock localStorage.getItem
      localStorage.setItem("token", "saved-token");

      // Mock successful response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      await deleteTask("task123");

      // Check localStorage.getItem was called
      expect(localStorage.getItem).toHaveBeenCalledWith("token");
    });

    test("should call fetch with correct URL, token, and task ID", async () => {
      // Mock localStorage.getItem
      vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("saved-token");

      // Mock successful response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      await deleteTask("task123");

      // Check fetch was called with correct arguments
      expect(global.fetch).toHaveBeenCalledWith(`${BACKEND_URL}/parent/task`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer saved-token",
        },
        body: JSON.stringify({ taskId: "task123" }),
      });
    });

    test("should return response JSON on success", async () => {
      // Mock localStorage.getItem
      vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("saved-token");

      const mockResponse = { success: true, message: "Task deleted" };

      // Mock successful response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await deleteTask("task123");

      expect(result).toEqual(mockResponse);
    });

    test("should throw error when response is not OK", async () => {
      // Mock localStorage.getItem
      vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("saved-token");

      // Mock error response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      await expect(deleteTask("task123")).rejects.toThrow(
        "Failed to delete task"
      );
    });

    test("should handle fetch errors", async () => {
      // Mock localStorage.getItem
      vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("saved-token");

      // Mock network error
      global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network error"));

      await expect(deleteTask("task123")).rejects.toThrow("Network error");
    });
  });

  describe("deletePrize function", () => {
    test("should get token from localStorage", async () => {
      // Mock localStorage.getItem
      localStorage.setItem("token", "saved-token");

      // Mock successful response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      await deletePrize("prize123");

      // Check localStorage.getItem was called
      expect(localStorage.getItem).toHaveBeenCalledWith("token");
    });

    test("should call fetch with correct URL, token, and prize ID", async () => {
      // Mock localStorage.getItem
      vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("saved-token");

      // Mock successful response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      await deletePrize("prize123");

      // Check fetch was called with correct arguments
      expect(global.fetch).toHaveBeenCalledWith(`${BACKEND_URL}/parent/prize`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer saved-token",
        },
        body: JSON.stringify({ prizeId: "prize123" }),
      });
    });

    test("should return response JSON on success", async () => {
      // Mock localStorage.getItem
      vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("saved-token");

      const mockResponse = { success: true, message: "Prize deleted" };

      // Mock successful response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await deletePrize("prize123");

      expect(result).toEqual(mockResponse);
    });

    test("should throw error when response is not OK", async () => {
      // Mock localStorage.getItem
      vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("saved-token");

      // Mock error response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      await expect(deletePrize("prize123")).rejects.toThrow(
        "Failed to delete prize"
      );
    });

    test("should handle fetch errors", async () => {
      // Mock localStorage.getItem
      vi.spyOn(Storage.prototype, "getItem").mockReturnValueOnce("saved-token");

      // Mock network error
      global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network error"));

      await expect(deletePrize("prize123")).rejects.toThrow("Network error");
    });
  });
});
