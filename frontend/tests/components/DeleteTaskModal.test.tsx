import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, vi, beforeEach, expect } from "vitest";
import React from "react";
import { act } from "react-dom/test-utils";

// Mock the necessary dependencies
vi.mock("../../src/services/parent", () => ({
  deleteTask: vi.fn(),
}));

// Create mock functions that we can control
const mockInvalidateQueries = vi.fn();
const mockMutate = vi.fn();

// Let's keep track of the mutation function for testing
let mockMutationFn;
let isPendingState = false;

// Mock React Query with a flexible implementation
vi.mock("@tanstack/react-query", () => {
  // We'll use these to store callbacks for each test
  let successCallback = null;
  let errorCallback = null;

  return {
    useMutation: (options) => {
      // Store references to the callbacks
      successCallback = options.onSuccess;
      errorCallback = options.onError;

      // Save the mutation function for testing
      mockMutationFn = options.mutationFn;

      return {
        mutate: () => {
          // Call the actual mutation function to see it working
          mockMutate();
          mockMutationFn?.();
        },
        isPending: isPendingState, // Use the state variable
      };
    },
    useQueryClient: () => ({
      invalidateQueries: mockInvalidateQueries,
    }),
    // Expose the callbacks so tests can access them
    __successCallback: () => successCallback,
    __errorCallback: () => errorCallback,
  };
});

// Import the component and mocked dependencies after mocking
import DeleteTaskModal from "../../src/components/DeleteTaskModal";
import { deleteTask } from "../../src/services/parent";
import * as reactQuery from "@tanstack/react-query";

describe("DeleteTaskModal", () => {
  const onCloseMock = vi.fn();
  const mockDeleteTask = vi.mocked(deleteTask);

  beforeEach(() => {
    vi.clearAllMocks();
    isPendingState = false; // Reset the pending state
  });

  test("does not render if isOpen is false", () => {
    render(
      <DeleteTaskModal
        isOpen={false}
        onClose={onCloseMock}
        taskId="t1"
        taskName="Clean Room"
      />
    );
    expect(screen.queryByText(/Confirm Deletion/i)).not.toBeInTheDocument();
  });

  test("renders correctly when isOpen is true", () => {
    render(
      <DeleteTaskModal
        isOpen={true}
        onClose={onCloseMock}
        taskId="t1"
        taskName="Clean Room"
      />
    );
    expect(screen.getByText(/Confirm Deletion/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete "Clean Room"/i)
    ).toBeInTheDocument();
  });

  test("renders with generic text when no taskName is provided", () => {
    render(<DeleteTaskModal isOpen={true} onClose={onCloseMock} taskId="t1" />);
    expect(
      screen.getByText(/Are you sure you want to delete this task/i)
    ).toBeInTheDocument();
  });

  test("calls onClose when Cancel is clicked", () => {
    render(
      <DeleteTaskModal
        isOpen={true}
        onClose={onCloseMock}
        taskId="t1"
        taskName="Clean Room"
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(onCloseMock).toHaveBeenCalled();
  });

  test("calls onClose when X button is clicked", () => {
    render(
      <DeleteTaskModal
        isOpen={true}
        onClose={onCloseMock}
        taskId="t1"
        taskName="Clean Room"
      />
    );
    // The X button doesn't have a text label, so we need to find it another way
    // Using SVG path to identify the close button
    const closeButton = document
      .querySelector('button svg path[d="M6 18L18 6M6 6l12 12"]')
      ?.closest("button");
    fireEvent.click(closeButton);
    expect(onCloseMock).toHaveBeenCalled();
  });

  test("calls deleteTask and closes modal on success", async () => {
    render(
      <DeleteTaskModal
        isOpen={true}
        onClose={onCloseMock}
        taskId="t1"
        taskName="Clean Room"
      />
    );

    // Click the Delete button
    fireEvent.click(screen.getByRole("button", { name: /Delete Task/i }));

    // Verify mutate was called
    expect(mockMutate).toHaveBeenCalled();

    // Simulate success by manually calling the stored onSuccess callback
    await act(async () => {
      // Get the success callback and call it
      const successCallback = reactQuery.__successCallback();
      successCallback();
    });

    // Verify the expected behavior
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["parentData"],
    });
    expect(onCloseMock).toHaveBeenCalled();
  });

  test("displays error if deletion fails", async () => {
    // Render with a fresh component for error test
    const { rerender } = render(
      <DeleteTaskModal
        isOpen={true}
        onClose={onCloseMock}
        taskId="t1"
        taskName="Clean Room"
      />
    );

    // Click the Delete button
    fireEvent.click(screen.getByRole("button", { name: /Delete Task/i }));

    // Verify mutate was called
    expect(mockMutate).toHaveBeenCalled();

    // Simulate error by manually calling the stored onError callback wrapped in act()
    await act(async () => {
      const errorCallback = reactQuery.__errorCallback();
      errorCallback(new Error("Delete failed"));
    });

    // Force a rerender to make sure the error state is visible
    rerender(
      <DeleteTaskModal
        isOpen={true}
        onClose={onCloseMock}
        taskId="t1"
        taskName="Clean Room"
      />
    );

    // Now the error message should be visible
    await waitFor(() => {
      expect(
        screen.getByText(/Unable to delete task assigned to a child!/i)
      ).toBeInTheDocument();
    });

    // Click the Close button to dismiss the error
    fireEvent.click(screen.getByRole("button", { name: /Close/i }));

    // Verify onClose was called
    expect(onCloseMock).toHaveBeenCalled();
  });

  test("mutation uses the correct taskId", async () => {
    // Setup the mock to actually track the call
    mockDeleteTask.mockResolvedValue({});

    render(
      <DeleteTaskModal
        isOpen={true}
        onClose={onCloseMock}
        taskId="t1"
        taskName="Clean Room"
      />
    );

    // Click the Delete button
    fireEvent.click(screen.getByRole("button", { name: /Delete Task/i }));

    // Verify the mutation function was called with the correct ID
    await waitFor(() => {
      // The mutation function should have been called with the taskId
      expect(mockDeleteTask).toHaveBeenCalledWith("t1");
    });
  });

  test("Delete button shows loading state while mutation is pending", () => {
    // Set the isPending state to true for this test
    isPendingState = true;

    render(
      <DeleteTaskModal
        isOpen={true}
        onClose={onCloseMock}
        taskId="t1"
        taskName="Clean Room"
      />
    );

    // The Delete button should show "Deleting..." text
    expect(
      screen.getByRole("button", { name: /Deleting\.\.\./i })
    ).toBeInTheDocument();

    // Both buttons should be disabled
    const deleteButton = screen.getByRole("button", {
      name: /Deleting\.\.\./i,
    });
    const cancelButton = screen.getByRole("button", { name: /Cancel/i });

    expect(deleteButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });
});
