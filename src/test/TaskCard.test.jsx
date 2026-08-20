import {
  render,
  screen,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import {
  describe,
  expect,
  test,
  vi,
} from "vitest";

import TaskCard from "../components/TaskCard";

describe("TaskCard", () => {
  const task = {
    id: 1,
    title: "Complete TaskFlow testing",
    priority: "HIGH",
    category: "Development",
    dueDate: "",
    completed: false,
  };

  test("renders task information", () => {
    render(
      <TaskCard
        task={task}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(
      screen.getByText(
        "Complete TaskFlow testing"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("HIGH")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Development")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/No due date/i)
    ).toBeInTheDocument();
  });

  test("calls onToggle when task checkbox is clicked", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();

    render(
      <TaskCard
        task={task}
        onToggle={onToggle}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: /mark task as completed/i,
      })
    );

    expect(
      onToggle
    ).toHaveBeenCalledOnce();

    expect(
      onToggle
    ).toHaveBeenCalledWith(
      task.id
    );
  });

  test("calls onEdit when edit button is clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    render(
      <TaskCard
        task={task}
        onToggle={vi.fn()}
        onEdit={onEdit}
        onDelete={vi.fn()}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: /edit complete taskflow testing/i,
      })
    );

    expect(
      onEdit
    ).toHaveBeenCalledOnce();

    expect(
      onEdit
    ).toHaveBeenCalledWith(
      task
    );
  });

  test("calls onDelete when delete button is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <TaskCard
        task={task}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={onDelete}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: /delete complete taskflow testing/i,
      })
    );

    expect(
      onDelete
    ).toHaveBeenCalledOnce();

    expect(
      onDelete
    ).toHaveBeenCalledWith(
      task.id
    );
  });
});