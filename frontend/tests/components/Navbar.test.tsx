import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import Navbar from "../../src/components/Navbar";
import React from "react";

describe("Navbar", () => {
  const mockProps = {
    name: "Alex",
    imageURL: "https://example.com/",
  };

  test("renders the app title", () => {
    render(<Navbar {...mockProps} />);
    expect(screen.getByText("Chore Masters")).toBeInTheDocument();
  });

  test("renders the Welcome message with user name", () => {
    render(<Navbar {...mockProps} />);
    expect(screen.getByText("Welcome, Alex")).toBeInTheDocument();
  });

  test("renders the Profile image with correct URL", () => {
    render(<Navbar {...mockProps} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", mockProps.imageURL);
  });
});
