# TaskFlow — React Task Management Application

TaskFlow is a responsive task management web application built with React.

The application allows users to create, manage, search, filter, sort, edit, complete, and delete tasks through a clean and responsive interface.

## Features

- Add new tasks
- Edit existing tasks
- Delete tasks with confirmation
- Mark tasks as completed
- Mark completed tasks as active
- Search tasks
- Filter tasks by:
  - All
  - Active
  - Completed
- Sort tasks by:
  - Newest
  - Oldest
  - Priority
  - Due date
- Task details modal
- Task statistics
- Task completion progress
- LocalStorage persistence
- Light and dark mode
- Responsive design
- Keyboard-friendly interactions
- Escape-key modal closing
- Empty-state handling
- Accessible buttons and labels

## Technologies Used

- React
- JavaScript
- CSS
- Vite
- Lucide React
- Browser LocalStorage

## Project Structure

```text
src/
├── components/
│   ├── ConfirmModal.jsx
│   ├── Header.jsx
│   ├── ProgressCard.jsx
│   ├── Sidebar.jsx
│   ├── StatsCards.jsx
│   ├── TaskCard.jsx
│   ├── TaskDetails.jsx
│   ├── TaskFilters.jsx
│   ├── TaskList.jsx
│   └── TaskModal.jsx
│
├── App.jsx
├── App.css
├── index.css
└── main.jsx