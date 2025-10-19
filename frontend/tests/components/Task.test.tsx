import { render, screen } from "@testing-library/react";
import { describe, test, vi, expect } from "vitest";
import Task from "../../src/components/Task";
import React from "react";

// Mock child component to isolate test
vi.mock("../../src/components/taskCompleteButton", () => ({
  TaskCompleteButton: () => <div>Mocked TaskCompleteButton</div>,
}));

describe("Task component", () => {
  const baseProps = {
    _id: "task123",
    name: "Vacuuming",
    value: 20,
    imageURL: "https://example.com/task-image.jpg",
    fetchChildTrigger: vi.fn(),
  };

  test("renders task name, value, and image", () => {
    render(<Task {...baseProps} isTaskComplete={false} />);

    expect(screen.getByText("Vacuuming")).toBeInTheDocument();
    expect(screen.getByText("20 Points")).toBeInTheDocument();
    expect(screen.getByAltText("Vacuuming")).toBeInTheDocument();
    expect(screen.getByText("Mocked TaskCompleteButton")).toBeInTheDocument();
  });

  test("shows 'Completed' badge when task is complete", () => {
    render(<Task {...baseProps} isTaskComplete={true} />);

    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  test("renders before and after images when provided", () => {
    render(
      <Task
        {...baseProps}
        isTaskComplete={true}
        beforeImage="before.jpg"
        afterImage="after.jpg"
      />
    );

    expect(screen.getByText("Before:")).toBeInTheDocument();
    expect(screen.getByText("After:")).toBeInTheDocument();
    expect(screen.getByAltText("Before")).toBeInTheDocument();
    expect(screen.getByAltText("After")).toBeInTheDocument();
  });
});
