import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import React from "react";
import { PasswordRequirements } from "../../src/components/PasswordRequirements";

describe("PasswordRequirements", () => {
  test("renders the heading correctly", () => {
    render(<PasswordRequirements password="" />);
    const heading = screen.getByText("Password must contain:");
    expect(heading).toBeInTheDocument();
  });

  test("displays all four requirements", () => {
    render(<PasswordRequirements password="" />);

    const lengthRequirement = screen.getByText("At least 8 characters");
    const uppercaseRequirement = screen.getByText("One uppercase letter");
    const numberRequirement = screen.getByText("One number");
    const specialRequirement = screen.getByText(
      "One special character (!@#$%^&*)"
    );

    expect(lengthRequirement).toBeInTheDocument();
    expect(uppercaseRequirement).toBeInTheDocument();
    expect(numberRequirement).toBeInTheDocument();
    expect(specialRequirement).toBeInTheDocument();
  });

  test("shows all requirements in default color for empty password", () => {
    render(<PasswordRequirements password="" />);

    const requirements = screen.getAllByRole("listitem");
    requirements.forEach((req) => {
      expect(req).not.toHaveClass("text-green-600");
      expect(req).toHaveClass("text-indigo-700");
    });
  });

  test("highlights length requirement when password is 8+ characters", () => {
    render(<PasswordRequirements password="12345678" />);

    const lengthRequirement = screen
      .getByText("At least 8 characters")
      .closest("li");
    expect(lengthRequirement).toHaveClass("text-green-600");
    expect(lengthRequirement).toHaveClass("font-semibold");

    // Other requirements should still be in default color
    const uppercaseRequirement = screen
      .getByText("One uppercase letter")
      .closest("li");
    const numberRequirement = screen.getByText("One number").closest("li");
    const specialRequirement = screen
      .getByText("One special character (!@#$%^&*)")
      .closest("li");

    [uppercaseRequirement, specialRequirement].forEach((req) => {
      expect(req).not.toHaveClass("text-green-600");
      expect(req).toHaveClass("text-indigo-700");
    });

    // Number requirement is satisfied because the password contains digits
    expect(numberRequirement).toHaveClass("text-green-600");
    expect(numberRequirement).toHaveClass("font-semibold");
  });

  test("highlights uppercase requirement when password has uppercase letter", () => {
    render(<PasswordRequirements password="Abc" />);

    const uppercaseRequirement = screen
      .getByText("One uppercase letter")
      .closest("li");
    expect(uppercaseRequirement).toHaveClass("text-green-600");
    expect(uppercaseRequirement).toHaveClass("font-semibold");

    // Other requirements should still be in default color (except for number if there's a digit)
    const lengthRequirement = screen
      .getByText("At least 8 characters")
      .closest("li");
    const specialRequirement = screen
      .getByText("One special character (!@#$%^&*)")
      .closest("li");

    [lengthRequirement, specialRequirement].forEach((req) => {
      expect(req).not.toHaveClass("text-green-600");
      expect(req).toHaveClass("text-indigo-700");
    });
  });

  test("highlights number requirement when password has a digit", () => {
    render(<PasswordRequirements password="abc123" />);

    const numberRequirement = screen.getByText("One number").closest("li");
    expect(numberRequirement).toHaveClass("text-green-600");
    expect(numberRequirement).toHaveClass("font-semibold");

    // Other requirements should still be in default color (except for length if 8+ chars)
    const uppercaseRequirement = screen
      .getByText("One uppercase letter")
      .closest("li");
    const specialRequirement = screen
      .getByText("One special character (!@#$%^&*)")
      .closest("li");

    [uppercaseRequirement, specialRequirement].forEach((req) => {
      expect(req).not.toHaveClass("text-green-600");
      expect(req).toHaveClass("text-indigo-700");
    });
  });

  test("highlights special character requirement when password has a special char", () => {
    render(<PasswordRequirements password="abc!" />);

    const specialRequirement = screen
      .getByText("One special character (!@#$%^&*)")
      .closest("li");
    expect(specialRequirement).toHaveClass("text-green-600");
    expect(specialRequirement).toHaveClass("font-semibold");

    // Other requirements should still be in default color (except for length if 8+ chars)
    const lengthRequirement = screen
      .getByText("At least 8 characters")
      .closest("li");
    const uppercaseRequirement = screen
      .getByText("One uppercase letter")
      .closest("li");

    [lengthRequirement, uppercaseRequirement].forEach((req) => {
      expect(req).not.toHaveClass("text-green-600");
      expect(req).toHaveClass("text-indigo-700");
    });

    // Number requirement is satisfied if there's a digit in the password
    const numberRequirement = screen.getByText("One number").closest("li");
    expect(numberRequirement).not.toHaveClass("text-green-600");
  });

  test("highlights all requirements for a strong password", () => {
    render(<PasswordRequirements password="StrongP@ss123" />);

    const requirements = screen.getAllByRole("listitem");
    requirements.forEach((req) => {
      expect(req).toHaveClass("text-green-600");
      expect(req).toHaveClass("font-semibold");
      expect(req).not.toHaveClass("text-indigo-700");
    });
  });

  test("renders SVG icon for each requirement", () => {
    render(<PasswordRequirements password="" />);

    const svgIcons = document.querySelectorAll("svg");
    expect(svgIcons.length).toBe(4); // One for each requirement

    // Check that each icon has the correct path
    svgIcons.forEach((svg) => {
      const path = svg.querySelector("path");
      expect(path).toHaveAttribute("d", "M9 12l2 2 4-4");
    });
  });

  test("applies correct styling to the container", () => {
    const { container } = render(<PasswordRequirements password="" />);

    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass(
      "bg-indigo-50",
      "p-4",
      "rounded-lg",
      "mt-2"
    );
  });
});
