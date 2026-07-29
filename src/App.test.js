import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

test("analyse shows move history and restart appears after the first move", async () => {
  const user = userEvent.setup();
  render(<App />);

  expect(screen.queryByRole("button", { name: /restart game/i })).not.toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /analyse/i }));
  expect(screen.getByText(/move history/i)).toBeInTheDocument();

  const squares = screen
    .getAllByRole("button")
    .filter((button) => button.className === "square");

  await user.click(squares[0]);
  expect(squares[0]).toHaveTextContent("X");
  expect(screen.getByRole("button", { name: /restart game/i })).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /restart game/i }));

  const resetSquares = screen
    .getAllByRole("button")
    .filter((button) => button.className === "square");

  resetSquares.forEach((square) => {
    expect(square).toHaveTextContent("");
  });

  expect(screen.getByText(/turn of player x/i)).toBeInTheDocument();
});
