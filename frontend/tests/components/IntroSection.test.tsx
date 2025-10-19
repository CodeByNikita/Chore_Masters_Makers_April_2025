import { render, screen } from "@testing-library/react";
import { describe, test, expect, beforeEach } from "vitest";
import React from "react";
import IntroSection from "../../src/components/IntroSection";

describe("IntroSection", () => {
  beforeEach(() => {
    render(<IntroSection />);
  });

  test("renders the main heading correctly", () => {
    const heading = screen.getByRole("heading", {
      name: /Make Chores Fun and Rewarding! 🌟/i,
      level: 2,
    });
    expect(heading).toBeInTheDocument();
  });

  test("renders the description paragraph", () => {
    const description = screen.getByText(
      /Chore Masters helps parents create engaging tasks for their kids, with exciting rewards that motivate them to participate in household responsibilities\./i
    );
    expect(description).toBeInTheDocument();
  });

  test("renders all three feature cards", () => {
    // Test for the three main features
    const setTasksHeading = screen.getByRole("heading", { name: /Set Tasks/i });
    const trackProgressHeading = screen.getByRole("heading", {
      name: /Track Progress/i,
    });
    const earnRewardsHeading = screen.getByRole("heading", {
      name: /Earn Rewards/i,
    });

    expect(setTasksHeading).toBeInTheDocument();
    expect(trackProgressHeading).toBeInTheDocument();
    expect(earnRewardsHeading).toBeInTheDocument();
  });

  test("renders feature card descriptions correctly", () => {
    // Test for the descriptions of each feature
    const setTasksDesc = screen.getByText(
      /Create and assign daily or weekly chores/i
    );
    const trackProgressDesc = screen.getByText(
      /Monitor completion of tasks in real-time/i
    );
    const earnRewardsDesc = screen.getByText(
      /Win exciting prizes for completing chores/i
    );

    expect(setTasksDesc).toBeInTheDocument();
    expect(trackProgressDesc).toBeInTheDocument();
    expect(earnRewardsDesc).toBeInTheDocument();
  });

  test("renders all emojis in the feature cards", () => {
    // Check for the presence of emoji characters
    expect(screen.getByText("📝")).toBeInTheDocument();
    expect(screen.getByText("🎯")).toBeInTheDocument();
    expect(screen.getByText("🎁")).toBeInTheDocument();
  });

  test("component has the correct layout structure", () => {
    // Check for the main container
    const mainContainer = document.querySelector(".bg-indigo-50");
    expect(mainContainer).toBeInTheDocument();

    // Check for the grid layout of feature cards
    const gridContainer = document.querySelector(".grid.grid-cols-3");
    expect(gridContainer).toBeInTheDocument();

    // Check if we have 3 cards
    const cards = document.querySelectorAll(".bg-white.p-4.rounded-lg.shadow");
    expect(cards.length).toBe(3);
  });

  test("has appropriate styling classes applied", () => {
    // Test for core styling classes
    const container = document.querySelector(".bg-indigo-50.px-12.ml-12");
    expect(container).toBeInTheDocument();

    // Test content container
    const contentContainer = document.querySelector(
      ".max-w-3xl.mx-auto.text-center"
    );
    expect(contentContainer).toBeInTheDocument();

    // Test heading styling
    const heading = screen.getByRole("heading", {
      name: /Make Chores Fun and Rewarding! 🌟/i,
    });
    expect(heading.classList.contains("text-3xl")).toBe(true);
    expect(heading.classList.contains("font-bold")).toBe(true);
    expect(heading.classList.contains("text-indigo-900")).toBe(true);
  });
});
