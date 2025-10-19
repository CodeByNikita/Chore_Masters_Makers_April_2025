import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import React from "react";
import ParentTask from "../../src/components/ParentTaskList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ✅ Mock DeleteTaskModal
vi.mock("../../src/components/DeleteTaskModal", () => ({
  default: ({ isOpen, taskName }: any) =>
    isOpen ? <div>Mock Delete Modal for {taskName}</div> : null,
}));

const mockTask = {
  _id: "abc123",
  name: "Do the dishes",
  value: 15,
  imageURL: "https://example.com/dishes.jpg",
};

function renderWithQueryClient(ui: React.ReactNode) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("ParentTask", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders task image, name and point value", () => {
    renderWithQueryClient(<ParentTask task={mockTask} isLast={false} />);

    expect(screen.getByAltText("Do the dishes")).toBeInTheDocument();
    expect(screen.getByText("Do the dishes")).toBeInTheDocument();
    expect(screen.getByText("15 pts")).toBeInTheDocument();
  });

  test("renders Edit and Delete buttons", () => {
    renderWithQueryClient(<ParentTask task={mockTask} isLast={false} />);

    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  test("opens DeleteTaskModal when Delete is clicked", () => {
    renderWithQueryClient(<ParentTask task={mockTask} isLast={false} />);

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(
      screen.getByText("Mock Delete Modal for Do the dishes")
    ).toBeInTheDocument();
  });

  test("opens DeleteTaskModal when Delete is clicked", () => {
    renderWithQueryClient(<ParentTask task={mockTask} isLast={false} />);

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(
      screen.getByText("Mock Delete Modal for Do the dishes")
    ).toBeInTheDocument();
  });
});
