import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, beforeEach, vi, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { TaskCompleteButton } from "../../src/components/TaskCompleteButton";
import React from "react";

// Mock the child service and utility function
vi.mock("../../src/services/child", () => ({
  putTaskCompleteChild: vi.fn(),
}));

vi.mock("../../src/utils/utils", () => ({
  convertToBase64: vi.fn(),
}));

import { putTaskCompleteChild } from "../../src/services/child";
import { convertToBase64 } from "../../src/utils/utils";

describe("TaskCompleteButton", () => {
  const task_id = "abc123";
  const fetchChildTrigger = vi.fn();

  beforeEach(() => {
    localStorage.setItem("token", "mock-token");
    vi.resetAllMocks();
  });

  test('calls putTaskCompleteChild and fetchChildTrigger when "Mark Complete" is clicked', async () => {
    // Fix the TypeScript error by using a simple type assertion
    (convertToBase64 as any).mockResolvedValue("mocked-base64");
    (putTaskCompleteChild as any).mockResolvedValue({});

    render(
      <MemoryRouter>
        <TaskCompleteButton
          task_id={task_id}
          isTaskComplete={false}
          fetchChildTrigger={fetchChildTrigger}
        />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: /mark complete/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(putTaskCompleteChild).toHaveBeenCalledWith(
        "mock-token",
        task_id,
        null, // beforeBase64
        null // afterBase64
      );
      expect(fetchChildTrigger).toHaveBeenCalled();
    });
  });

  test("throws error if token is missing", () => {
    localStorage.removeItem("token");

    expect(() =>
      render(
        <MemoryRouter>
          <TaskCompleteButton
            task_id={task_id}
            isTaskComplete={false}
            fetchChildTrigger={fetchChildTrigger}
          />
        </MemoryRouter>
      )
    ).toThrow("Unable to update like listing");
  });

  test('renders "Mark as Incomplete" button when isTaskComplete is true', () => {
    render(
      <MemoryRouter>
        <TaskCompleteButton
          task_id={task_id}
          isTaskComplete={true}
          fetchChildTrigger={fetchChildTrigger}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("button", { name: /mark as incomplete/i })
    ).toBeInTheDocument();
  });

  test("handles file uploads correctly", async () => {
    // Mock the base64 conversion for both files
    (convertToBase64 as any).mockImplementation((file) => {
      return Promise.resolve(`mocked-base64-for-${file.name}`);
    });
    (putTaskCompleteChild as any).mockResolvedValue({});

    render(
      <MemoryRouter>
        <TaskCompleteButton
          task_id={task_id}
          isTaskComplete={false}
          fetchChildTrigger={fetchChildTrigger}
        />
      </MemoryRouter>
    );

    // Create mock files
    const beforeFile = new File(["content"], "before.jpg", {
      type: "image/jpeg",
    });
    const afterFile = new File(["content"], "after.jpg", {
      type: "image/jpeg",
    });

    // Simulate file selection
    const beforeInput = screen.getByLabelText(/before image/i);
    const afterInput = screen.getByLabelText(/after image/i);

    fireEvent.change(beforeInput, { target: { files: [beforeFile] } });
    fireEvent.change(afterInput, { target: { files: [afterFile] } });

    // Click the button
    const button = screen.getByRole("button", { name: /mark complete/i });
    fireEvent.click(button);

    // Check if convertToBase64 was called with the correct files
    await waitFor(() => {
      expect(convertToBase64).toHaveBeenCalledWith(beforeFile);
      expect(convertToBase64).toHaveBeenCalledWith(afterFile);
    });

    // Check if putTaskCompleteChild was called with the correct base64 strings
    await waitFor(() => {
      expect(putTaskCompleteChild).toHaveBeenCalledWith(
        "mock-token",
        task_id,
        "mocked-base64-for-before.jpg",
        "mocked-base64-for-after.jpg"
      );
    });

    expect(fetchChildTrigger).toHaveBeenCalled();
  });
});
