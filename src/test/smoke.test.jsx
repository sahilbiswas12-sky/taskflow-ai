import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

function TestComponent() {
  return <h1>TaskFlow AI Testing Works</h1>;
}

test("renders TaskFlow AI test component", () => {
  render(<TestComponent />);

  expect(
    screen.getByText("TaskFlow AI Testing Works")
  ).toBeInTheDocument();
});