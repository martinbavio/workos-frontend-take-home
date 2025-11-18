import { describe, it, expect, vi } from "vitest";
import { render } from "vitest-browser-react";
import { SearchBar, TablePagination } from "./components";

describe("SearchBar", () => {
  const handleChange = vi.fn();
  const handleAdd = vi.fn();

  it("should render search input and add button", async () => {
    const screen = await render(
      <SearchBar
        value=""
        onChange={handleChange}
        onAdd={handleAdd}
        addLabel="Add User"
      />,
    );

    const searchInput = screen.getByPlaceholder("Search...");
    await expect.element(searchInput).toBeInTheDocument();

    const addButton = screen.getByRole("button");
    await expect.element(addButton).toHaveTextContent(/^Add User$/);
  });

  it("should display current search value", async () => {
    const handleChange = vi.fn();
    const handleAdd = vi.fn();

    const screen = await render(
      <SearchBar
        value="test search"
        onChange={handleChange}
        onAdd={handleAdd}
        addLabel="Add"
      />,
    );

    const searchInput = screen.getByPlaceholder("Search...");
    await expect.element(searchInput).toHaveValue("test search");
  });
});

describe("TablePagination", () => {
  const handlePrevious = vi.fn();
  const handleNext = vi.fn();
  it("should show prev and next buttons disabled if neccesary", async () => {
    const screen = await render(
      <TablePagination
        onPrevious={handlePrevious}
        onNext={handleNext}
        hasPrevious={false}
        hasNext={false}
        colSpan={1}
      />,
    );

    const prevButton = screen.getByRole("button", { name: "Previous page" });
    const nextButton = screen.getByRole("button", { name: "Next page" });

    await expect.element(prevButton).toBeDisabled();
    await expect.element(nextButton).toBeDisabled();
  });

  it("should show enable buttons when props are true", async () => {
    const screen = await render(
      <TablePagination
        onPrevious={handlePrevious}
        onNext={handleNext}
        hasPrevious={true}
        hasNext={true}
        colSpan={1}
      />,
    );

    const prevButton = screen.getByRole("button", { name: "Previous page" });
    const nextButton = screen.getByRole("button", { name: "Next page" });

    await expect.element(prevButton).toBeEnabled();
    await expect.element(nextButton).toBeEnabled();
  });
});
