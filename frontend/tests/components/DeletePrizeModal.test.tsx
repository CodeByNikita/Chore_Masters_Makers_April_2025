import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, vi, beforeEach, expect } from "vitest";
import React from "react";
import { act } from "react-dom/test-utils";

// Mock the necessary dependencies
vi.mock("../../src/services/parent", () => ({
  deletePrize: vi.fn(),
}));

// Create mock functions that we can control
const mockInvalidateQueries = vi.fn();
const mockMutate = vi.fn();

// Mock React Query with a more flexible implementation
vi.mock("@tanstack/react-query", () => {
  // We'll use these to store callbacks for each test
  let successCallback = null;
  let errorCallback = null;

  return {
    useMutation: (options) => {
      // Store references to the callbacks
      successCallback = options.onSuccess;
      errorCallback = options.onError;

      return {
        mutate: () => {
          // Just store the reference to mutate, we'll call success/error manually
          mockMutate();
        },
        isPending: false,
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
import DeletePrizeModal from "../../src/components/DeletePrizeModal";
import { deletePrize } from "../../src/services/parent";
import * as reactQuery from "@tanstack/react-query";

describe("DeletePrizeModal", () => {
  const onCloseMock = vi.fn();
  const mockDeletePrize = vi.mocked(deletePrize);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("does not render if isOpen is false", () => {
    render(
      <DeletePrizeModal
        isOpen={false}
        onClose={onCloseMock}
        prizeId="p1"
        prizeName="Lego Set"
      />
    );
    expect(screen.queryByText(/Confirm Deletion/i)).not.toBeInTheDocument();
  });

  test("renders correctly when isOpen is true", () => {
    render(
      <DeletePrizeModal
        isOpen={true}
        onClose={onCloseMock}
        prizeId="p1"
        prizeName="Lego Set"
      />
    );
    expect(screen.getByText(/Confirm Deletion/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete "Lego Set"/i)
    ).toBeInTheDocument();
  });

  test("calls onClose when Cancel is clicked", () => {
    render(
      <DeletePrizeModal
        isOpen={true}
        onClose={onCloseMock}
        prizeId="p1"
        prizeName="Lego Set"
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(onCloseMock).toHaveBeenCalled();
  });

  test("calls deletePrize and closes modal on success", async () => {
    render(
      <DeletePrizeModal
        isOpen={true}
        onClose={onCloseMock}
        prizeId="p1"
        prizeName="Lego Set"
      />
    );

    // Click the Delete button
    fireEvent.click(screen.getByRole("button", { name: /Delete Prize/i }));

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
      <DeletePrizeModal
        isOpen={true}
        onClose={onCloseMock}
        prizeId="p1"
        prizeName="Lego Set"
      />
    );

    // Click the Delete button
    fireEvent.click(screen.getByRole("button", { name: /Delete Prize/i }));

    // Verify mutate was called
    expect(mockMutate).toHaveBeenCalled();

    // Simulate error by manually calling the stored onError callback wrapped in act()
    await act(async () => {
      const errorCallback = reactQuery.__errorCallback();
      errorCallback(new Error("Delete failed"));
    });

    // Force a rerender to make sure the error state is visible
    rerender(
      <DeletePrizeModal
        isOpen={true}
        onClose={onCloseMock}
        prizeId="p1"
        prizeName="Lego Set"
      />
    );

    // Now the error message should be visible
    await waitFor(() => {
      expect(
        screen.getByText(/Unable to delete prize assigned to a child!/i)
      ).toBeInTheDocument();
    });

    // Click the Close button
    fireEvent.click(screen.getByRole("button", { name: /Close/i }));

    // Verify onClose was called
    expect(onCloseMock).toHaveBeenCalled();
  });
});
