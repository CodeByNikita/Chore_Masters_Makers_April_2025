import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import React from "react";

// Mock dependencies
vi.mock("../../src/services/child", () => ({
  postAddChild: vi.fn().mockResolvedValue({}),
}));

vi.mock("../../src/utils/utils", () => ({
  convertToBase64: vi.fn().mockResolvedValue("mockBase64Image"),
}));

// Very simple mock for React Query
vi.mock("@tanstack/react-query", () => {
  const mockMutate = vi.fn().mockImplementation(() => {});
  return {
    useMutation: () => ({
      mutate: mockMutate,
      isPending: false,
    }),
    useQueryClient: () => ({
      invalidateQueries: vi.fn(),
    }),
  };
});

// Import the component after mocks
import AddChildModal from "../../src/components/AddChildModal";

describe("AddChildModal", () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.resetAllMocks();
    // Mock URL.createObjectURL
    Object.defineProperty(URL, "createObjectURL", {
      writable: true,
      value: vi.fn().mockImplementation(() => "mocked-image-url"),
    });
  });

  // Only test that the component renders when isOpen is true
  test("renders when isOpen is true", () => {
    render(
      <AddChildModal
        isOpen={true}
        onClose={vi.fn()}
        tasks={[{ _id: "1", name: "Vacuum", value: 10, imageURL: "task.jpg" }]}
        prizes={[
          { _id: "p1", name: "Lego", value: "100", imageURL: "lego.jpg" },
        ]}
      />
    );

    // Simple assertion that the component renders
    expect(screen.getByText("Add New Child")).toBeInTheDocument();
    expect(screen.getByText("Child's Name")).toBeInTheDocument();
    expect(screen.getByText("Set Password")).toBeInTheDocument();
    expect(screen.getByText("Profile Picture")).toBeInTheDocument();
    expect(screen.getByText("Assign Tasks")).toBeInTheDocument();
    expect(screen.getByText("Select Prize")).toBeInTheDocument();
  });

  // Test that the component doesn't render when isOpen is false
  test("does not render when isOpen is false", () => {
    render(
      <AddChildModal
        isOpen={false}
        onClose={vi.fn()}
        tasks={[{ _id: "1", name: "Vacuum", value: 10, imageURL: "task.jpg" }]}
        prizes={[
          { _id: "p1", name: "Lego", value: "100", imageURL: "lego.jpg" },
        ]}
      />
    );

    expect(screen.queryByText("Add New Child")).not.toBeInTheDocument();
  });
});
