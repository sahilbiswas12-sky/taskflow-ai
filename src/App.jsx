import {
  useEffect,
  useMemo,
  useState,
} from "react";

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

/* =====================================================
   DEFAULT DATA
===================================================== */

const DEFAULT_PROFILE = {
  name: "Sahil",
  email: "sahil@example.com",
  plan: "Free Plan",
};

const INITIAL_TASKS = [
  {
    id: 1,
    title: "Complete portfolio website",
    description:
      "Finish the final UI and responsive layout.",
    priority: "HIGH",
    category: "Development",
    dueDate: "2026-08-10",
    completed: false,
    createdAt:
      "2026-08-01T10:00:00.000Z",
  },

  {
    id: 2,
    title: "Build React project",
    description:
      "Complete the React task management application.",
    priority: "MEDIUM",
    category: "Development",
    dueDate: "2026-08-12",
    completed: false,
    createdAt:
      "2026-08-02T10:00:00.000Z",
  },

  {
    id: 3,
    title: "Submit internship assignment",
    description:
      "Review the final submission before sending it.",
    priority: "LOW",
    category: "Work",
    dueDate: "2026-08-15",
    completed: true,
    createdAt:
      "2026-08-03T10:00:00.000Z",
  },
];

/* =====================================================
   STORAGE
===================================================== */

function loadStorage(key, fallback) {
  try {
    const saved =
      localStorage.getItem(key);

    if (!saved) {
      return fallback;
    }

    const parsed =
      JSON.parse(saved);

    return parsed ?? fallback;
  } catch (error) {
    console.error(
      `Unable to load ${key}:`,
      error
    );

    return fallback;
  }
}

/* =====================================================
   APP
===================================================== */

function App() {
  /* =========================
     STATE
  ========================= */

  const [tasks, setTasks] =
    useState(() =>
      loadStorage(
        "taskflow-tasks",
        INITIAL_TASKS
      )
    );

  const [profile, setProfile] =
    useState(() =>
      loadStorage(
        "taskflow-profile",
        DEFAULT_PROFILE
      )
    );

  const [darkMode, setDarkMode] =
    useState(() =>
      loadStorage(
        "taskflow-dark-mode",
        true
      )
    );

  const [
    activeView,
    setActiveView,
  ] = useState("dashboard");

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("ALL");

  const [
    priorityFilter,
    setPriorityFilter,
  ] = useState("ALL");

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState("ALL");

  const [
    sortBy,
    setSortBy,
  ] = useState("NEWEST");

  const [
    isTaskModalOpen,
    setIsTaskModalOpen,
  ] = useState(false);

  const [
    editingTask,
    setEditingTask,
  ] = useState(null);

  const [
    isProfileOpen,
    setIsProfileOpen,
  ] = useState(false);

  const [
    isNotificationsOpen,
    setIsNotificationsOpen,
  ] = useState(false);

  const [
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
  ] = useState(false);

  const [
    deleteTaskId,
    setDeleteTaskId,
  ] = useState(null);

  /* =====================================================
     LOCAL STORAGE
  ===================================================== */

  useEffect(() => {
    localStorage.setItem(
      "taskflow-tasks",
      JSON.stringify(tasks)
    );
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(
      "taskflow-profile",
      JSON.stringify(profile)
    );
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

  /* =====================================================
     TASK DATA
  ===================================================== */

  const completedTasks =
    useMemo(
      () =>
        tasks.filter(
          (task) =>
            task.completed
        ),
      [tasks]
    );

  const activeTasks =
    useMemo(
      () =>
        tasks.filter(
          (task) =>
            !task.completed
        ),
      [tasks]
    );

  const categories =
    useMemo(() => {
      const values = tasks
        .map(
          (task) =>
            task.category
        )
        .filter(Boolean);

      return [
        "ALL",
        ...new Set(values),
      ];
    }, [tasks]);

  /* =====================================================
     FILTERING + SORTING
  ===================================================== */

  const filteredTasks =
    useMemo(() => {
      let result = [
        ...tasks,
      ];

      /* -------------------------
         VIEW FILTER
      ------------------------- */

      if (
        activeView ===
        "completed"
      ) {
        result =
          result.filter(
            (task) =>
              task.completed
          );
      }

      if (
        activeView ===
        "my-tasks"
      ) {
        result =
          result.filter(
            (task) =>
              !task.completed
          );
      }

      /* -------------------------
         STATUS FILTER
      ------------------------- */

      if (
        statusFilter ===
        "ACTIVE"
      ) {
        result =
          result.filter(
            (task) =>
              !task.completed
          );
      }

      if (
        statusFilter ===
        "COMPLETED"
      ) {
        result =
          result.filter(
            (task) =>
              task.completed
          );
      }

      /* -------------------------
         PRIORITY FILTER
      ------------------------- */

      if (
        priorityFilter !==
        "ALL"
      ) {
        result =
          result.filter(
            (task) =>
              task.priority ===
              priorityFilter
          );
      }

      /* -------------------------
         CATEGORY FILTER
      ------------------------- */

      if (
        categoryFilter !==
        "ALL"
      ) {
        result =
          result.filter(
            (task) =>
              task.category ===
              categoryFilter
          );
      }

      /* -------------------------
         SEARCH
      ------------------------- */

      if (
        searchTerm.trim()
      ) {
        const query =
          searchTerm
            .toLowerCase()
            .trim();

        result =
          result.filter(
            (task) => {
              const searchableText =
                `
                ${task.title || ""}
                ${task.description || ""}
                ${task.category || ""}
                ${task.priority || ""}
                ${
                  task.aiGenerated
                    ? "AI"
                    : ""
                }
                `;

              return searchableText
                .toLowerCase()
                .includes(query);
            }
          );
      }

      /* -------------------------
         SORTING
      ------------------------- */

      result.sort(
        (a, b) => {
          if (
            sortBy ===
            "OLDEST"
          ) {
            return (
              getDateTime(
                a.createdAt
              ) -
              getDateTime(
                b.createdAt
              )
            );
          }

          if (
            sortBy ===
            "DUE_SOON"
          ) {
            return (
              getDueDateTime(
                a.dueDate
              ) -
              getDueDateTime(
                b.dueDate
              )
            );
          }

          if (
            sortBy ===
            "PRIORITY"
          ) {
            const order = {
              HIGH: 1,
              MEDIUM: 2,
              LOW: 3,
            };

            return (
              (order[
                a.priority
              ] || 4) -
              (order[
                b.priority
              ] || 4)
            );
          }

          /* NEWEST */

          return (
            getDateTime(
              b.createdAt
            ) -
            getDateTime(
              a.createdAt
            )
          );
        }
      );

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

  /* =====================================================
     PROGRESS
  ===================================================== */

  const completionPercentage =
    tasks.length === 0
      ? 0
      : Math.round(
          (completedTasks.length /
            tasks.length) *
            100
        );

  /* =====================================================
     NOTIFICATIONS
  ===================================================== */

  const notifications =
    useMemo(() => {
      const upcoming =
        activeTasks
          .filter(
            (task) =>
              task.dueDate
          )
          .sort(
            (a, b) =>
              getDueDateTime(
                a.dueDate
              ) -
              getDueDateTime(
                b.dueDate
              )
          )
          .slice(0, 3);

      return upcoming.map(
        (task) => ({
          id: task.id,

          title:
            task.title,

          message: `Due ${formatDate(
            task.dueDate
          )}`,

          priority:
            task.priority,
        })
      );
    }, [activeTasks]);

  /* =====================================================
     NAVIGATION
  ===================================================== */

  const handleNavigation =
    (view) => {
      setActiveView(view);

      setIsMobileSidebarOpen(
        false
      );

      if (
        view === "settings"
      ) {
        setIsProfileOpen(
          false
        );

        setIsNotificationsOpen(
          false
        );
      }
    };

  /* =====================================================
     CREATE TASK
  ===================================================== */

  const handleAddTask = () => {
    setEditingTask(null);

    setIsTaskModalOpen(
      true
    );
  };

  /* =====================================================
     EDIT TASK
  ===================================================== */

  const handleEditTask =
    (task) => {
      setEditingTask(task);

      setIsTaskModalOpen(
        true
      );
    };

  /* =====================================================
     SAVE NORMAL TASK
  ===================================================== */

  const handleSaveTask =
    (taskData) => {
      if (editingTask) {
        setTasks(
          (currentTasks) =>
            currentTasks.map(
              (task) =>
                task.id ===
                editingTask.id
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

          createdAt:
            new Date().toISOString(),

          aiGenerated: false,
        };

        setTasks(
          (currentTasks) => [
            newTask,
            ...currentTasks,
          ]
        );
      }

      setEditingTask(null);

      setIsTaskModalOpen(
        false
      );
    };

  /* =====================================================
     ADD AI GENERATED TASKS
  ===================================================== */

  const handleAddGeneratedTasks =
    (generatedTasks) => {
      if (
        !Array.isArray(
          generatedTasks
        ) ||
        generatedTasks.length ===
          0
      ) {
        return;
      }

      const baseId =
        Date.now();

      const newTasks =
        generatedTasks
          .map(
            (
              task,
              index
            ) => {
              const title =
                String(
                  task.title ||
                    ""
                ).trim();

              const description =
                String(
                  task.description ||
                    ""
                ).trim();

              const allowedPriorities =
                [
                  "HIGH",
                  "MEDIUM",
                  "LOW",
                ];

              const priority =
                allowedPriorities.includes(
                  task.priority
                )
                  ? task.priority
                  : "MEDIUM";

              const estimate =
                Number(
                  task.estimatedMinutes
                );

              return {
                id:
                  baseId +
                  index,

                title,

                description,

                priority,

                category:
                  task.category ||
                  "Development",

                dueDate:
                  task.dueDate ||
                  "",

                estimatedMinutes:
                  Number.isFinite(
                    estimate
                  ) &&
                  estimate > 0
                    ? Math.round(
                        estimate
                      )
                    : null,

                aiGenerated:
                  true,

                completed:
                  false,

                createdAt:
                  new Date(
                    baseId +
                      index
                  ).toISOString(),
              };
            }
          )
          .filter(
            (task) =>
              task.title
          );

      if (
        newTasks.length ===
        0
      ) {
        return;
      }

      setTasks(
        (currentTasks) => [
          ...newTasks,
          ...currentTasks,
        ]
      );

      setEditingTask(null);

      setIsTaskModalOpen(
        false
      );
    };

  /* =====================================================
     COMPLETE / UNCOMPLETE TASK
  ===================================================== */

  const handleToggleTask =
    (taskId) => {
      setTasks(
        (currentTasks) =>
          currentTasks.map(
            (task) =>
              task.id ===
              taskId
                ? {
                    ...task,

                    completed:
                      !task.completed,
                  }
                : task
          )
      );
    };

  /* =====================================================
     DELETE TASK
  ===================================================== */

  const handleDeleteRequest =
    (taskId) => {
      const confirmed = window.confirm(
        "Delete this task permanently?"
      );

      if (!confirmed) {
        return;
      }

      setTasks((currentTasks) => {
        const updatedTasks =
          currentTasks.filter(
            (task) =>
              String(task.id) !==
              String(taskId)
          );

        localStorage.setItem(
          "taskflow-tasks",
          JSON.stringify(updatedTasks)
        );

        return updatedTasks;
      });

      setDeleteTaskId(null);
    };

  const handleConfirmDelete =
    () => {
      if (
        deleteTaskId ===
        null
      ) {
        return;
      }

      setTasks(
        (currentTasks) =>
          currentTasks.filter(
            (task) =>
              String(task.id) !==
              String(deleteTaskId)
          )
      );

      setDeleteTaskId(null);
    };

  /* =====================================================
     CLEAR FILTERS
  ===================================================== */

  const handleClearFilters =
    () => {
      const confirmed = window.confirm(
        "Clear all tasks and reset all filters?"
      );

      if (!confirmed) {
        return;
      }

      setTasks([]);

      localStorage.setItem(
        "taskflow-tasks",
        JSON.stringify([])
      );

      setSearchTerm("");
      setStatusFilter("ALL");
      setPriorityFilter("ALL");
      setCategoryFilter("ALL");
      setSortBy("NEWEST");
      setActiveView("dashboard");
    };

  /* =====================================================
     SIGN OUT
  ===================================================== */

  const handleSignOut =
    () => {
      setIsProfileOpen(
        false
      );

      window.alert(
        "You have been signed out of this demo application."
      );
    };

  /* =====================================================
     VIEW
  ===================================================== */

  const showTaskInterface =
    activeView ===
      "dashboard" ||
    activeView ===
      "my-tasks" ||
    activeView ===
      "completed";

  const greeting =
    getGreeting();

  /* =====================================================
     JSX
  ===================================================== */

  return (
    <div className="app">
      {/* ======================
          SIDEBAR
      ====================== */}

      <Sidebar
        activeView={
          activeView
        }
        onNavigate={
          handleNavigation
        }
        profile={profile}
        isOpen={
          isMobileSidebarOpen
        }
        onClose={() =>
          setIsMobileSidebarOpen(
            false
          )
        }
      />

      {/* ======================
          HEADER
      ====================== */}

      <Header
        searchTerm={
          searchTerm
        }
        onSearch={
          setSearchTerm
        }
        onMenu={() =>
          setIsMobileSidebarOpen(
            true
          )
        }
        darkMode={
          darkMode
        }
        onToggleTheme={() =>
          setDarkMode(
            (value) =>
              !value
          )
        }
        onProfile={() => {
          setIsProfileOpen(
            (value) =>
              !value
          );

          setIsNotificationsOpen(
            false
          );
        }}
        onNotifications={() => {
          setIsNotificationsOpen(
            (value) =>
              !value
          );

          setIsProfileOpen(
            false
          );
        }}
        profile={profile}
        notificationCount={
          notifications.length
        }
      />

      {/* ======================
          MAIN
      ====================== */}

      <main className="main-content">
        {showTaskInterface && (
          <div className="dashboard">

            {/* WELCOME */}

            <section className="welcome-section">
              <p className="welcome-label">
                TASK MANAGEMENT
              </p>

              <h1>
                {greeting},{" "}
                {profile.name} 👋
              </h1>

              <p className="welcome-text">
                Stay organized,
                focus on what
                matters, and get
                things done
                efficiently.
              </p>
            </section>

            {/* STATS */}

            <StatsCards
              tasks={tasks}
            />

            {/* PROGRESS */}

            {activeView ===
              "dashboard" && (
              <ProgressCard
                completed={
                  completedTasks.length
                }
                total={
                  tasks.length
                }
                percentage={
                  completionPercentage
                }
              />
            )}

            {/* TASK LIST */}

            <section className="tasks-section">
              <div className="section-header">
                <div>
                  <h2>
                    {activeView ===
                    "completed"
                      ? "Completed Tasks"
                      : "My Tasks"}
                  </h2>

                  <p>
                    {activeView ===
                    "completed"
                      ? "Review the tasks you have finished."
                      : "Keep track of your daily tasks."}
                  </p>
                </div>

                <button
                  type="button"
                  className="add-task-btn"
                  onClick={
                    handleAddTask
                  }
                >
                  <span>
                    +
                  </span>

                  Add Task
                </button>
              </div>

              {/* FILTERS */}

              <TaskFilters
                statusFilter={
                  statusFilter
                }
                onStatusChange={
                  setStatusFilter
                }
                priorityFilter={
                  priorityFilter
                }
                onPriorityChange={
                  setPriorityFilter
                }
                categoryFilter={
                  categoryFilter
                }
                onCategoryChange={
                  setCategoryFilter
                }
                categories={
                  categories
                }
                sortBy={
                  sortBy
                }
                onSortChange={
                  setSortBy
                }
                onClear={
                  handleClearFilters
                }
              />

              {/* TASKS */}

              <TaskList
                tasks={
                  filteredTasks
                }
                onToggle={
                  handleToggleTask
                }
                onEdit={
                  handleEditTask
                }
                onDelete={
                  handleDeleteRequest
                }
              />
            </section>
          </div>
        )}

        {/* ======================
            SETTINGS
        ====================== */}

        {activeView ===
          "settings" && (
          <div className="dashboard">
            <Settings
              darkMode={
                darkMode
              }
              onToggleTheme={() =>
                setDarkMode(
                  (value) =>
                    !value
                )
              }
              profile={
                profile
              }
              onProfileChange={
                setProfile
              }
            />
          </div>
        )}
      </main>

      {/* ======================
          PROFILE
      ====================== */}

      {isProfileOpen && (
        <Profile
          profile={
            profile
          }
          onClose={() =>
            setIsProfileOpen(
              false
            )
          }
          onSettings={() => {
            setIsProfileOpen(
              false
            );

            setActiveView(
              "settings"
            );
          }}
          onSignOut={
            handleSignOut
          }
        />
      )}

      {/* ======================
          NOTIFICATIONS
      ====================== */}

      {isNotificationsOpen && (
        <Notifications
          notifications={
            notifications
          }
          onClose={() =>
            setIsNotificationsOpen(
              false
            )
          }
        />
      )}

      {/* ======================
          TASK MODAL
      ====================== */}

      {isTaskModalOpen && (
        <TaskModal
          task={
            editingTask
          }
          onClose={() => {
            setEditingTask(
              null
            );

            setIsTaskModalOpen(
              false
            );
          }}
          onSave={
            handleSaveTask
          }
          onAddGeneratedTasks={
            handleAddGeneratedTasks
          }
        />
      )}

      {/* ======================
          DELETE CONFIRMATION
      ====================== */}

      {deleteTaskId !==
        null && (
        <ConfirmModal
          title="Delete task?"
          message="This task will be permanently removed from your task list."
          onCancel={() =>
            setDeleteTaskId(
              null
            )
          }
          onConfirm={
            handleConfirmDelete
          }
        />
      )}
    </div>
  );
}

/* =====================================================
   HELPERS
===================================================== */

function formatDate(value) {
  if (!value) {
    return "No due date";
  }

  const date =
    new Date(
      `${value}T00:00:00`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

function getDateTime(value) {
  if (!value) {
    return 0;
  }

  const time =
    new Date(
      value
    ).getTime();

  return Number.isNaN(
    time
  )
    ? 0
    : time;
}

function getDueDateTime(value) {
  if (!value) {
    return Number.POSITIVE_INFINITY;
  }

  const time =
    new Date(
      `${value}T00:00:00`
    ).getTime();

  return Number.isNaN(
    time
  )
    ? Number.POSITIVE_INFINITY
    : time;
}

function getGreeting() {
  const hour =
    new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}

export default App;