import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import ChildInfo from "../../src/components/ChildInfo";
import React from "react";

// 🧪 Mock the nested ChildTaskList component
vi.mock("../../src/components/ChildTaskList", () => ({
  default: () => <div>Mocked ChildTaskList</div>,
}));

describe("ChildInfo", () => {
  const mockChild = {
    _id: "child123",
    username: "Quackie",
    password: "duck123",
    imageURL: "https://example.com/quackie.jpg",
    points: 30,
    prize: {
      _id: "prize001",
      name: "Lego Set",
      value: "100",
      imageURL: "https://example.com/lego.jpg",
    },
    tasksCompleted: [],
    tasksNotCompleted: [],
    taskImages: [],
  };

  test("renders child's name, image, prize info, and points", () => {
    render(<ChildInfo child={mockChild} />);

    // Child's name and profile picture
    expect(screen.getByText("Quackie")).toBeInTheDocument();
    expect(screen.getByAltText("Quackie")).toBeInTheDocument();

    // Prize info
    expect(screen.getByText("Assigned Prize")).toBeInTheDocument();
    expect(screen.getByText("Lego Set")).toBeInTheDocument();
    expect(screen.getByAltText("Lego Set")).toBeInTheDocument();

    // Points display
    const pointsContainer = screen.getByText("Points").nextElementSibling;
    expect(pointsContainer).toHaveTextContent("30");
    expect(pointsContainer).toHaveTextContent("/");
    expect(pointsContainer).toHaveTextContent("100");
  });

  test("renders both ChildTaskList components", () => {
    render(<ChildInfo child={mockChild} />);

    // Since we're mocking ChildTaskList, expect the mock to render twice
    const taskLists = screen.getAllByText("Mocked ChildTaskList");
    expect(taskLists.length).toBe(2);
  });

  test.skip("renders action buttons", () => {
    render(<ChildInfo child={mockChild} />);

    expect(
      screen.getByRole("button", { name: "Add Task" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Remove Task" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Change Prize" })
    ).toBeInTheDocument();
  });
});
