import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../src/App";
import React from "react";

describe("App component", () => {
  it("renders Homepage by default", async () => {
    render(<App />);
    const heading = await screen.findByText((text) =>
      text.includes("Make Chores Fun and Rewarding")
    );
    expect(heading).toBeInTheDocument();
  });
});
