// This is a simplified JavaScript version for client-side usage
// Local storage implementation

// Initialize local storage with sample tasks if empty
function initializeLocalStorage() {
  if (!localStorage.getItem('tasks')) {
    const initialTasks = [
      {
        id: 1,
        title: "Call John about project proposal",
        type: "call",
        priority: "high",
        associatedRecord: "Project X",
        assignedTo: "Alex Smith",
        dueDate: "2025-03-20",
        dueTime: "14:00",
        notes: "Discuss pricing and timeline",
        completed: false
      },
      {
        id: 2,
        title: "Send follow-up email to client",
        type: "email",
        priority: "medium",
        associatedRecord: "ABC Corp",
        assignedTo: "Maria Garcia",
        dueDate: "2025-03-19",
        dueTime: "10:30",
        notes: "Include updated proposal",
        completed: false
      },
      {
        id: 3,
        title: "Team meeting for Q2 planning",
        type: "meeting",
        priority: "high",
        associatedRecord: "Internal",
        assignedTo: "Team",
        dueDate: "2025-03-22",
        dueTime: "09:00",
        notes: "Prepare agenda beforehand",
        completed: false
      }
    ];
    localStorage.setItem('tasks', JSON.stringify(initialTasks));
  }
}

// Get all tasks from local storage
function getTasks() {
  initializeLocalStorage();
  return JSON.parse(localStorage.getItem('tasks') || '[]');
}

// Save tasks to local storage
function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Get the next available task ID
function getNextTaskId() {
  const tasks = getTasks();
  return tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1;
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

// Mark a task as completed
function completeTask(id) {
  const tasks = getTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex !== -1) {
    tasks[taskIndex].completed = true;
    saveTasks(tasks);
    return tasks[taskIndex];
  }
  
  return undefined;
}

export {
  initializeLocalStorage,
  getTasks,
  saveTasks,
  getNextTaskId,
  createTask,
  completeTask
};