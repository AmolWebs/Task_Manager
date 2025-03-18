// Define task structure for the application
const taskSchema = {
  title: '', // String, required field
  type: '', // String, required field (e.g., "call", "email", "meeting") 
  priority: '', // String, required field (e.g., "high", "medium", "low")
  associatedRecord: null, // String, optional field
  assignedTo: null, // String, optional field
  dueDate: null, // Date, required field
  notes: null, // String, optional field
  completed: false // Boolean, defaults to false
};

// Sample seed data for tasks
const seedTasks = [
  {
    id: 1,
    title: "Call for Demo schedule",
    type: "call",
    priority: "high",
    associatedRecord: "Acme Inc.",
    assignedTo: "Jane Smith",
    dueDate: new Date("2025-03-20T09:00:00"),
    notes: "Schedule a demo of our new product",
    completed: false
  },
  {
    id: 2,
    title: "Send follow-up email",
    type: "email",
    priority: "medium",
    associatedRecord: "TechCorp",
    assignedTo: "John Doe",
    dueDate: new Date("2025-03-19T14:00:00"),
    notes: "Send information about pricing",
    completed: false
  },
  {
    id: 3,
    title: "Weekly team meeting",
    type: "meeting",
    priority: "medium",
    associatedRecord: null,
    assignedTo: "All Team",
    dueDate: new Date("2025-03-22T10:00:00"),
    notes: "Review Sprint Progress",
    completed: false
  },
  {
    id: 4,
    title: "Prepare presentation",
    type: "task",
    priority: "high",
    associatedRecord: "Board Meeting",
    assignedTo: "Jane Smith",
    dueDate: new Date("2025-03-25T09:00:00"),
    notes: "Prepare Q1 sales presentation",
    completed: false
  },
  {
    id: 5,
    title: "Review marketing materials",
    type: "task",
    priority: "low",
    associatedRecord: "Spring Campaign",
    assignedTo: null,
    dueDate: new Date("2025-03-28T15:00:00"),
    notes: "Review copy and visuals for spring campaign",
    completed: false
  }
];

// Helper functions for localStorage
const localStorageKeys = {
  TASKS: 'taskManager_tasks',
  TASK_COUNTER: 'taskManager_taskCounter'
};

// Initialize localStorage with seed data if empty
function initializeLocalStorage() {
  if (!localStorage.getItem(localStorageKeys.TASKS)) {
    localStorage.setItem(localStorageKeys.TASKS, JSON.stringify(seedTasks));
    localStorage.setItem(localStorageKeys.TASK_COUNTER, '6'); // Next ID after seed data
  }
}

// Get all tasks from localStorage
function getTasks() {
  initializeLocalStorage();
  return JSON.parse(localStorage.getItem(localStorageKeys.TASKS) || '[]');
}

// Save tasks to localStorage
function saveTasks(tasks) {
  localStorage.setItem(localStorageKeys.TASKS, JSON.stringify(tasks));
}

// Get next task ID
function getNextTaskId() {
  initializeLocalStorage();
  const currentId = parseInt(localStorage.getItem(localStorageKeys.TASK_COUNTER) || '1');
  localStorage.setItem(localStorageKeys.TASK_COUNTER, (currentId + 1).toString());
  return currentId;
}

// Create a new task
function createTask(task) {
  const tasks = getTasks();
  const newTask = {
    ...task,
    id: getNextTaskId(),
    completed: false
  };
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
}

// Complete a task
function completeTask(id) {
  const tasks = getTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex !== -1) {
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      completed: true
    };
    saveTasks(tasks);
    return tasks[taskIndex];
  }
  
  return null;
}

export {
  taskSchema,
  getTasks,
  createTask,
  completeTask
};