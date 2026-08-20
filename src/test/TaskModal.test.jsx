import {
  render,
  screen,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import {
  afterEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";

import TaskModal from "../components/TaskModal";

const mockSubtasks = [
  {
    title: "Review portfolio content",
    description:
      "Check all portfolio sections and project information.",
    priority: "HIGH",
    estimatedMinutes: 30,
    reason:
      "Accurate content is important before submission.",
  },
  {
    title: "Test mobile responsiveness",
    description:
      "Check the portfolio on different screen sizes.",
    priority: "HIGH",
    estimatedMinutes: 45,
    reason:
      "The website must work well on mobile devices.",
  },
  {
    title: "Update project README",
    description:
      "Document setup, features, and deployment details.",
    priority: "MEDIUM",
    estimatedMinutes: 25,
    reason:
      "Clear documentation makes the project easier to review.",
  },
];

function renderTaskModal(
  overrides = {}
) {
  const props = {
    task: null,
    onClose: vi.fn(),
    onSave: vi.fn(),
    onAddGeneratedTasks: vi.fn(),
    ...overrides,
  };

  render(
    <TaskModal {...props} />
  );

  return props;
}

function mockSuccessfulAIResponse() {
  const fetchMock =
    vi.fn().mockResolvedValue({
      ok: true,

      json: vi
        .fn()
        .mockResolvedValue({
          subtasks:
            mockSubtasks,
        }),
    });

  vi.stubGlobal(
    "fetch",
    fetchMock
  );

  return fetchMock;
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("TaskModal", () => {
  test("renders create task modal and AI planner", () => {
    renderTaskModal();

    expect(
      screen.getByRole(
        "dialog"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole(
        "heading",
        {
          name: /create a task/i,
        }
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /smart task planner/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole(
        "button",
        {
          name:
            /break down with ai/i,
        }
      )
    ).toBeInTheDocument();
  });

  test("saves a normal task with entered information", async () => {
    const user =
      userEvent.setup();

    const onSave =
      vi.fn();

    renderTaskModal({
      onSave,
    });

    await user.type(
      screen.getByLabelText(
        /task title/i
      ),
      "  Complete TaskFlow testing  "
    );

    await user.type(
      screen.getByLabelText(
        /description/i
      ),
      "  Test all important components.  "
    );

    await user.selectOptions(
      screen.getByLabelText(
        /priority/i
      ),
      "HIGH"
    );

    await user.selectOptions(
      screen.getByLabelText(
        /category/i
      ),
      "Study"
    );

    await user.type(
      screen.getByLabelText(
        /due date/i
      ),
      "2026-08-30"
    );

    await user.click(
      screen.getByRole(
        "button",
        {
          name:
            /create task/i,
        }
      )
    );

    expect(
      onSave
    ).toHaveBeenCalledOnce();

    expect(
      onSave
    ).toHaveBeenCalledWith({
      title:
        "Complete TaskFlow testing",

      description:
        "Test all important components.",

      priority:
        "HIGH",

      category:
        "Study",

      dueDate:
        "2026-08-30",
    });
  });

  test("shows error when AI is used without a task title", async () => {
    const user =
      userEvent.setup();

    const fetchMock =
      vi.fn();

    vi.stubGlobal(
      "fetch",
      fetchMock
    );

    renderTaskModal();

    await user.click(
      screen.getByRole(
        "button",
        {
          name:
            /break down with ai/i,
        }
      )
    );

    expect(
      screen.getByRole(
        "alert"
      )
    ).toHaveTextContent(
      "Enter a task title before using AI."
    );

    expect(
      fetchMock
    ).not.toHaveBeenCalled();
  });

  test("requests AI subtasks and displays the generated plan", async () => {
    const user =
      userEvent.setup();

    const fetchMock =
      mockSuccessfulAIResponse();

    renderTaskModal();

    await user.type(
      screen.getByLabelText(
        /task title/i
      ),
      "Prepare portfolio submission"
    );

    await user.type(
      screen.getByLabelText(
        /description/i
      ),
      "Review and prepare the portfolio."
    );

    await user.click(
      screen.getByRole(
        "button",
        {
          name:
            /break down with ai/i,
        }
      )
    );

    expect(
      await screen.findByText(
        "Review portfolio content"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Test mobile responsiveness"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Update project README"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /3 suggested steps/i
      )
    ).toBeInTheDocument();

    expect(
      fetchMock
    ).toHaveBeenCalledOnce();

    expect(
      fetchMock
    ).toHaveBeenCalledWith(
      "/api/breakdown",
      expect.objectContaining({
        method:
          "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            title:
              "Prepare portfolio submission",

            description:
              "Review and prepare the portfolio.",
          }),
      })
    );
  });

  test("adds one AI-generated task", async () => {
    const user =
      userEvent.setup();

    const onAddGeneratedTasks =
      vi.fn();

    mockSuccessfulAIResponse();

    renderTaskModal({
      onAddGeneratedTasks,
    });

    await user.type(
      screen.getByLabelText(
        /task title/i
      ),
      "Prepare portfolio submission"
    );

    await user.click(
      screen.getByRole(
        "button",
        {
          name:
            /break down with ai/i,
        }
      )
    );

    await screen.findByText(
      "Review portfolio content"
    );

    const addButtons =
      screen.getAllByRole(
        "button",
        {
          name:
            /\+ add this task/i,
        }
      );

    await user.click(
      addButtons[0]
    );

    expect(
      onAddGeneratedTasks
    ).toHaveBeenCalledOnce();

    expect(
      onAddGeneratedTasks
    ).toHaveBeenCalledWith([
      {
        title:
          "Review portfolio content",

        description:
          "Check all portfolio sections and project information.",

        priority:
          "HIGH",

        category:
          "Development",

        dueDate:
          "",

        estimatedMinutes:
          30,

        aiGenerated:
          true,
      },
    ]);
  });

  test("adds all AI-generated tasks", async () => {
    const user =
      userEvent.setup();

    const onAddGeneratedTasks =
      vi.fn();

    mockSuccessfulAIResponse();

    renderTaskModal({
      onAddGeneratedTasks,
    });

    await user.type(
      screen.getByLabelText(
        /task title/i
      ),
      "Prepare portfolio submission"
    );

    await user.selectOptions(
      screen.getByLabelText(
        /category/i
      ),
      "Work"
    );

    await user.type(
      screen.getByLabelText(
        /due date/i
      ),
      "2026-08-30"
    );

    await user.click(
      screen.getByRole(
        "button",
        {
          name:
            /break down with ai/i,
        }
      )
    );

    await screen.findByText(
      "Review portfolio content"
    );

    await user.click(
      screen.getByRole(
        "button",
        {
          name:
            /\+ add all/i,
        }
      )
    );

    expect(
      onAddGeneratedTasks
    ).toHaveBeenCalledOnce();

    const generatedTasks =
      onAddGeneratedTasks.mock
        .calls[0][0];

    expect(
      generatedTasks
    ).toHaveLength(3);

    expect(
      generatedTasks[0]
    ).toEqual({
      title:
        "Review portfolio content",

      description:
        "Check all portfolio sections and project information.",

      priority:
        "HIGH",

      category:
        "Work",

      dueDate:
        "2026-08-30",

      estimatedMinutes:
        30,

      aiGenerated:
        true,
    });

    expect(
      generatedTasks[1]
        .aiGenerated
    ).toBe(true);

    expect(
      generatedTasks[2]
        .aiGenerated
    ).toBe(true);
  });

  test("shows API error safely when AI request fails", async () => {
    const user =
      userEvent.setup();

    const fetchMock =
      vi.fn().mockResolvedValue({
        ok: false,

        json: vi
          .fn()
          .mockResolvedValue({
            error:
              "AI service is temporarily unavailable.",
          }),
      });

    vi.stubGlobal(
      "fetch",
      fetchMock
    );

    renderTaskModal();

    await user.type(
      screen.getByLabelText(
        /task title/i
      ),
      "Prepare portfolio"
    );

    await user.click(
      screen.getByRole(
        "button",
        {
          name:
            /break down with ai/i,
        }
      )
    );

    const alert =
      await screen.findByRole(
        "alert"
      );

    expect(
      alert
    ).toHaveTextContent(
      "AI plan unavailable"
    );

    expect(
      alert
    ).toHaveTextContent(
      "AI service is temporarily unavailable."
    );
  });

  test("closes modal when Escape key is pressed", async () => {
    const user =
      userEvent.setup();

    const onClose =
      vi.fn();

    renderTaskModal({
      onClose,
    });

    await user.keyboard(
      "{Escape}"
    );

    expect(
      onClose
    ).toHaveBeenCalledOnce();
  });

  test("edit mode loads existing task and hides AI planner", () => {
    const existingTask = {
      id: 25,

      title:
        "Existing Task",

      description:
        "Existing description",

      priority:
        "LOW",

      category:
        "Personal",

      dueDate:
        "2026-08-25",
    };

    renderTaskModal({
      task:
        existingTask,
    });

    expect(
      screen.getByRole(
        "heading",
        {
          name:
            /edit task/i,
        }
      )
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(
        /task title/i
      )
    ).toHaveValue(
      "Existing Task"
    );

    expect(
      screen.getByLabelText(
        /priority/i
      )
    ).toHaveValue(
      "LOW"
    );

    expect(
      screen.getByLabelText(
        /category/i
      )
    ).toHaveValue(
      "Personal"
    );

    expect(
      screen.queryByText(
        /smart task planner/i
      )
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole(
        "button",
        {
          name:
            /save changes/i,
        }
      )
    ).toBeInTheDocument();
  });
});