# AI Development Prompts

This document contains the main prompts used during the development of the TaskFlow React application.

AI was used as a development assistant. The generated code was reviewed, tested, modified, and integrated manually throughout the project.

---

## Prompt 1 — Project Planning

I need to build a modern React task management application for an assignment.

The application should have a clean professional UI and should demonstrate practical React development skills.

Plan the application architecture, components, folder structure, features, and development phases.

Do not generate the entire application at once. Break the implementation into manageable steps.

---

## Prompt 2 — React Application Structure

Create a scalable React component structure for a task management dashboard.

The application should include:

- Sidebar
- Header
- Dashboard
- Statistics cards
- Task list
- Task cards
- Task filters
- Add/Edit task modal
- Task details
- Confirmation modal
- Progress section

Keep the components reusable and maintainable.

---

## Prompt 3 — Task State Management

Implement React state management for the task management application.

The application should support:

- Creating tasks
- Editing tasks
- Deleting tasks
- Completing tasks
- Reopening completed tasks

Use React hooks and keep the state logic clean.

---

## Prompt 4 — LocalStorage

Add LocalStorage persistence to the React task management application.

Tasks should automatically load when the application starts and should be saved whenever the task state changes.

Also include error handling so invalid LocalStorage data does not crash the application.

---

## Prompt 5 — Search

Add task search functionality.

The user should be able to search tasks by title.

The search should update the displayed task list dynamically as the user types.

Make sure searching works together with the existing task filters.

---

## Prompt 6 — Filtering

Add task filtering functionality.

The application should support:

- All tasks
- Active tasks
- Completed tasks

The filtering should work together with search.

Keep the filtering logic readable and reusable.

---

## Prompt 7 — Sorting

Add task sorting functionality.

Allow users to sort tasks by:

- Newest
- Oldest
- Priority
- Due date

Do not mutate the original task state when sorting.

---

## Prompt 8 — Task Details

Create a task details modal.

When a user selects a task, display:

- Task title
- Completion status
- Priority
- Due date

The details modal should also allow the user to:

- Mark the task complete/incomplete
- Edit the task
- Delete the task

---

## Prompt 9 — Delete Confirmation

Improve the task deletion experience.

Instead of deleting a task immediately, show a confirmation modal.

The modal should contain:

- Confirmation title
- Explanation
- Cancel button
- Delete button

The modal should close when the user presses Escape.

---

## Prompt 10 — Responsive Design

Improve the application for mobile, tablet, and desktop screens.

Review:

- Sidebar
- Header
- Task cards
- Buttons
- Modals
- Filters
- Search
- Spacing

Make sure controls remain usable on smaller screens.

---

## Prompt 11 — Accessibility

Review the React application for accessibility issues.

Improve:

- Button labels
- Keyboard navigation
- Focus states
- Modal accessibility
- ARIA labels
- Interactive controls
- Touch target sizes

Also add Escape-key support for open modals.

---

## Prompt 12 — Code Review

Review the existing React application for:

- Duplicate code
- Unnecessary state
- Incorrect React patterns
- Missing error handling
- Potential runtime errors
- Poor component structure
- Accessibility problems
- Responsive issues

Suggest practical improvements without unnecessarily rewriting working code.

---

## Prompt 13 — Debugging

I encountered an issue in my React application.

Review the provided code carefully.

Identify the exact cause of the problem, explain why it happens, and provide the corrected implementation.

Do not introduce unrelated changes.

---

## Prompt 14 — UI/UX Improvements

Review the current task management interface and suggest improvements that make it feel more polished and professional.

Focus on:

- Visual hierarchy
- Spacing
- Typography
- Buttons
- Empty states
- Task cards
- Modals
- Responsive behavior
- User feedback

Keep the existing functionality intact.

---

## Prompt 15 — Final Code Review

Perform a final review of the TaskFlow React application.

Check the application for:

- Functional bugs
- UI issues
- Responsive problems
- Accessibility issues
- State management problems
- LocalStorage problems
- Unnecessary code
- Console errors

Provide only practical fixes that improve the application.

---

# How the Prompts Were Used

The prompts were used progressively rather than asking AI to generate the entire project in one request.

The development process was:

1. Plan the application.
2. Create the component structure.
3. Implement task management.
4. Add persistence.
5. Add search and filtering.
6. Add sorting.
7. Add task details.
8. Add confirmation dialogs.
9. Improve responsiveness.
10. Improve accessibility.
11. Debug errors.
12. Review and refactor the application.

Each stage was tested before continuing to the next stage.

# AI Usage Philosophy

AI was treated as a development assistant rather than an automatic code generator.

Generated code was reviewed manually before being integrated into the project.

When problems were discovered, the code was corrected and tested instead of blindly accepting the AI-generated implementation.