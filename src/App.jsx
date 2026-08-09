import { useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatsCards from "./components/StatsCards";
import ProgressCard from "./components/ProgressCard";
import TaskList from "./components/TaskList";
import TaskModal from "./components/TaskModal";
import TaskFilters from "./components/TaskFilters";
import Profile from "./components/Profile";
import Notifications from "./components/Notifications";
import Settings from "./components/Settings";
import ConfirmModal from "./components/ConfirmModal";
import "./App.css";

const DEFAULT_PROFILE = {
  name: "Sahil",
  email: "sahil@example.com",
  plan: "Free Plan",
};

const INITIAL_TASKS = [
  {
    id: 1,
    title: "Complete portfolio website",
    description: "Finish the final UI and responsive layout.",
    priority: "HIGH",
    category: "Development",
    dueDate: "2026-08-10",
    completed: false,
    createdAt: "2026-08-01T10:00:00.000Z",
  },
  {
    id: 2,
    title: "Build React project",
    description: "Complete the React task management application.",
    priority: "MEDIUM",
    category: "Development",
    dueDate: "2026-08-12",
    completed: false,
    createdAt: "2026-08-02T10:00:00.000Z",
  },
  {
    id: 3,
    title: "Submit internship assignment",
    description: "Review the final submission before sending it.",
    priority: "LOW",
    category: "Work",
    dueDate: "2026-08-15",
    completed: true,
    createdAt: "2026-08-03T10:00:00.000Z",
  },
];

function loadStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);

    if (!saved) {
      return fallback;
    }

    const parsed = JSON.parse(saved);

    return parsed ?? fallback;
  } catch (error) {
    console.error(`Unable to load ${key}:`, error);
    return fallback;
  }
}

function App() {
  const [tasks, setTasks] = useState(() =>
    loadStorage("taskflow-tasks", INITIAL_TASKS)
  );

  const [profile, setProfile] = useState(() =>
    loadStorage("taskflow-profile", DEFAULT_PROFILE)
  );

  const [darkMode, setDarkMode] = useState(() =>
    loadStorage("taskflow-dark-mode", true)
  );

  const [activeView, setActiveView] = useState("dashboard");

  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NEWEST");

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [deleteTaskId, setDeleteTaskId] = useState(null);

  useEffect(() => {
    localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("taskflow-profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(
      "taskflow-dark-mode",
      JSON.stringify(darkMode)
    );

    document.documentElement.classList.toggle(
      "light-mode",
      !darkMode
    );
  }, [darkMode]);

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.completed),
    [tasks]
  );

  const activeTasks = useMemo(
    () => tasks.filter((task) => !task.completed),
    [tasks]
  );

  const categories = useMemo(() => {
    const values = tasks
      .map((task) => task.category)
      .filter(Boolean);

    return ["ALL", ...new Set(values)];
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (activeView === "completed") {
      result = result.filter((task) => task.completed);
    }

    if (activeView === "my-tasks") {
      result = result.filter((task) => !task.completed);
    }

    if (statusFilter === "ACTIVE") {
      result = result.filter((task) => !task.completed);
    }

    if (statusFilter === "COMPLETED") {
      result = result.filter((task) => task.completed);
    }

    if (priorityFilter !== "ALL") {
      result = result.filter(
        (task) => task.priority === priorityFilter
      );
    }

    if (categoryFilter !== "ALL") {
      result = result.filter(
        (task) => task.category === categoryFilter
      );
    }

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase().trim();

      result = result.filter((task) =>
        `${task.title} ${task.description} ${task.category} ${task.priority}`
          .toLowerCase()
          .includes(query)
      );
    }

    result.sort((a, b) => {
      if (sortBy === "OLDEST") {
        return (
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
        );
      }

      if (sortBy === "DUE_SOON") {
        return (
          new Date(a.dueDate).getTime() -
          new Date(b.dueDate).getTime()
        );
      }

      if (sortBy === "PRIORITY") {
        const order = {
          HIGH: 1,
          MEDIUM: 2,
          LOW: 3,
        };

        return order[a.priority] - order[b.priority];
      }

      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    });

    return result;
  }, [
    tasks,
    activeView,
    statusFilter,
    priorityFilter,
    categoryFilter,
    sortBy,
    searchTerm,
  ]);

  const completionPercentage =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks.length / tasks.length) * 100);

  const notifications = useMemo(() => {
    const upcoming = activeTasks
      .filter((task) => task.dueDate)
      .slice(0, 3);

    return upcoming.map((task) => ({
      id: task.id,
      title: task.title,
      message: `Due ${formatDate(task.dueDate)}`,
      priority: task.priority,
    }));
  }, [activeTasks]);

  const handleNavigation = (view) => {
    setActiveView(view);

    if (view === "settings") {
      setIsProfileOpen(false);
      setIsNotificationsOpen(false);
    }
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === editingTask.id
            ? {
                ...task,
                ...taskData,
              }
            : task
        )
      );
    } else {
      const newTask = {
        ...taskData,
        id: Date.now(),
        completed: false,
        createdAt: new Date().toISOString(),
      };

      setTasks((currentTasks) => [
        newTask,
        ...currentTasks,
      ]);
    }

    setEditingTask(null);
    setIsTaskModalOpen(false);
  };

  const handleToggleTask = (taskId) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  };

  const handleDeleteRequest = (taskId) => {
    setDeleteTaskId(taskId);
  };

  const handleConfirmDelete = () => {
    if (deleteTaskId === null) {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.filter(
        (task) => task.id !== deleteTaskId
      )
    );

    setDeleteTaskId(null);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
    setCategoryFilter("ALL");
    setSortBy("NEWEST");
  };

  const handleSignOut = () => {
    setIsProfileOpen(false);

    window.alert(
      "You have been signed out of this demo application."
    );
  };

  const showTaskInterface =
    activeView === "dashboard" ||
    activeView === "my-tasks" ||
    activeView === "completed";

  return (
    <div className="app">
      <Sidebar
        activeView={activeView}
        onNavigate={handleNavigation}
        profile={profile}
      />

      <Header
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode((value) => !value)}
        onProfile={() => {
          setIsProfileOpen((value) => !value);
          setIsNotificationsOpen(false);
        }}
        onNotifications={() => {
          setIsNotificationsOpen((value) => !value);
          setIsProfileOpen(false);
        }}
        profile={profile}
        notificationCount={notifications.length}
      />

      <main className="main-content">
        {showTaskInterface && (
          <div className="dashboard">
            <section className="welcome-section">
              <p className="welcome-label">
                TASK MANAGEMENT
              </p>

              <h1>
                Good evening, {profile.name} 👋
              </h1>

              <p className="welcome-text">
                Stay organized, focus on what matters,
                and get things done efficiently.
              </p>
            </section>

            <StatsCards tasks={tasks} />

            {activeView === "dashboard" && (
              <ProgressCard
                completed={completedTasks.length}
                total={tasks.length}
                percentage={completionPercentage}
              />
            )}

            <section className="tasks-section">
              <div className="section-header">
                <div>
                  <h2>
                    {activeView === "completed"
                      ? "Completed Tasks"
                      : activeView === "my-tasks"
                      ? "My Tasks"
                      : "My Tasks"}
                  </h2>

                  <p>
                    {activeView === "completed"
                      ? "Review the tasks you have finished."
                      : "Keep track of your daily tasks."}
                  </p>
                </div>

                <button
                  className="add-task-btn"
                  onClick={handleAddTask}
                >
                  <span>+</span>
                  Add Task
                </button>
              </div>

              <TaskFilters
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                priorityFilter={priorityFilter}
                onPriorityChange={setPriorityFilter}
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
                categories={categories}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onClear={handleClearFilters}
              />

              <TaskList
                tasks={filteredTasks}
                onToggle={handleToggleTask}
                onEdit={handleEditTask}
                onDelete={handleDeleteRequest}
              />
            </section>
          </div>
        )}

        {activeView === "settings" && (
          <div className="dashboard">
            <Settings
              darkMode={darkMode}
              onToggleTheme={() =>
                setDarkMode((value) => !value)
              }
              profile={profile}
              onProfileChange={setProfile}
            />
          </div>
        )}
      </main>

      {isProfileOpen && (
        <Profile
          profile={profile}
          onClose={() => setIsProfileOpen(false)}
          onSettings={() => {
            setIsProfileOpen(false);
            setActiveView("settings");
          }}
          onSignOut={handleSignOut}
        />
      )}

      {isNotificationsOpen && (
        <Notifications
          notifications={notifications}
          onClose={() => setIsNotificationsOpen(false)}
        />
      )}

      {isTaskModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={() => {
            setEditingTask(null);
            setIsTaskModalOpen(false);
          }}
          onSave={handleSaveTask}
        />
      )}

      {deleteTaskId !== null && (
        <ConfirmModal
          title="Delete task?"
          message="This task will be permanently removed from your task list."
          onCancel={() => setDeleteTaskId(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}

function formatDate(value) {
  if (!value) {
    return "No due date";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default App;