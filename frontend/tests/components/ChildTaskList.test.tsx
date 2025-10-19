import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import ChildTaskList from "../../src/components/ChildTaskList";
import React from "react";

describe("ChildTaskList", () => {
  const mockTasks = [
    {
      _id: "1",
      name: "Vacuum",
      value: 10,
      imageURL: "https://example.com/vacuum.jpg",
    },
    {
      _id: "2",
      name: "Dishes",
      value: 15,
      imageURL: "https://example.com/dishes.jpg",
    },
  ];

  const mockImages = [
    {
      taskId: "1",
      picBefore: "https://example.com/before.jpg",
      picAfter: "https://example.com/after.jpg",
    },
  ];

  test("renders title with correct task count", () => {
    render(
      <ChildTaskList
        tasks={mockTasks}
        title="Not Completed Tasks"
        titleColor="text-red-500"
        backgroundColor="bg-white"
      />
    );

    expect(screen.getByText("2 Not Completed Tasks")).toBeInTheDocument();
  });

  test("displays task names and main images", () => {
    render(
      <ChildTaskList
        tasks={mockTasks}
        title="Tasks"
        titleColor="text-black"
        backgroundColor="bg-white"
      />
    );

    expect(screen.getByAltText("Vacuum")).toBeInTheDocument();
    expect(screen.getByAltText("Dishes")).toBeInTheDocument();
  });

  test("renders before/after images when available", () => {
    render(
      <ChildTaskList
        tasks={mockTasks}
        taskImages={mockImages}
        title="Completed Tasks"
        titleColor="text-green-500"
        backgroundColor="bg-gray-100"
      />
    );

    expect(screen.getByAltText("Before")).toBeInTheDocument();
    expect(screen.getByAltText("After")).toBeInTheDocument();
  });

  test("opens and closes image modal on click", () => {
    render(
      <ChildTaskList
        tasks={mockTasks}
        taskImages={mockImages}
        title="Completed Tasks"
        titleColor="text-green-500"
        backgroundColor="bg-gray-100"
      />
    );

    // Click on task image
    const taskImage = screen.getByAltText("Vacuum");
    fireEvent.click(taskImage);

    // Modal should appear
    expect(screen.getByAltText("Enlarged view")).toBeInTheDocument();

    // Click to close
    fireEvent.click(screen.getByAltText("Enlarged view"));
    expect(screen.queryByAltText("Enlarged view")).not.toBeInTheDocument();
  });
});
