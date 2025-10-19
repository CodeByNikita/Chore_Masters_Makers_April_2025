import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import React from "react";
import AddPrizeModal from "../../src/components/AddPrizeModal";

// 🔧 Mock services
vi.mock("../../src/services/parent", () => ({
  postAddPrize: vi.fn(),
}));

vi.mock("../../src/utils/utils", () => ({
  convertToBase64: vi.fn(),
}));
import { convertToBase64 } from "../../src/utils/utils";

// 🔧 Mock React Query
const mockMutate = vi.fn();
vi.mock("@tanstack/react-query", () => ({
  useMutation: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
  useQueryClient: () => ({
    invalidateQueries: vi.fn(),
  }),
}));

describe("AddPrizeModal", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    Object.defineProperty(URL, "createObjectURL", {
      writable: true,
      value: vi.fn().mockReturnValue("mocked-prize-image-url"),
    });
  });

  test("renders form elements when open", () => {
    render(<AddPrizeModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText("Add New Prize")).toBeInTheDocument();
    expect(screen.getByText("Prize Name")).toBeInTheDocument();
    expect(screen.getByText("Set Value")).toBeInTheDocument();
    expect(screen.getByText("Prize Picture")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add Prize" })
    ).toBeInTheDocument();
  });

  test("submits the form with correct data", async () => {
    const onClose = vi.fn();

    const { container } = render(
      <AddPrizeModal isOpen={true} onClose={onClose} />
    );

    (convertToBase64 as vi.Mock).mockResolvedValue("mockBase64PrizeImage");

    fireEvent.change(screen.getByPlaceholderText("Enter name"), {
      target: { value: "Bike" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter Value"), {
      target: { value: "100" },
    });

    const mockFile = new File(["dummy content"], "prize.jpg", {
      type: "image/jpeg",
    });

    const fileInput = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    fireEvent.change(fileInput, {
      target: { files: [mockFile] },
    });

    fireEvent.click(screen.getByRole("button", { name: "Add Prize" }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        name: "Bike",
        value: 100,
        image: "mockBase64PrizeImage",
      });
    });
  });

  test("does not render when isOpen is false", () => {
    render(<AddPrizeModal isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByText("Add New Prize")).not.toBeInTheDocument();
  });
});
