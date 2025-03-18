import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getTasks, createTask as createTaskInStorage, completeTask as completeTaskInStorage } from "@shared/schema.js";

const TaskContext = createContext(undefined);

export function TaskProvider({ children }) {
  const { toast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({
    taskTypes: [],
    priorities: [],
    dueDates: [],
    assignedTo: [],
  });

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const loadedTasks = getTasks();
    setTasks(loadedTasks);
  }, []);

  // Create task function
  const createTask = async (task) => {
    try {
      const newTask = createTaskInStorage(task);
      setTasks([...tasks, newTask]);
      toast({
        title: "Success",
        description: "Task created successfully!",
      });
      return newTask;
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to create task: ${error.message}`,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Complete task function
  const completeTask = async (id) => {
    try {
      const updatedTask = completeTaskInStorage(id);
      if (updatedTask) {
        setTasks(tasks.map(task => task.id === id ? updatedTask : task));
        toast({
          title: "Success",
          description: "Task marked as complete!",
        });
        return updatedTask;
      } else {
        throw new Error("Task not found");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to complete task: ${error.message}`,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Apply filters
  const filteredTasks = tasks.filter((task) => {
    // Filter by task type
    if (filters.taskTypes.length > 0 && !filters.taskTypes.includes(task.type)) {
      return false;
    }

    // Filter by priority
    if (filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) {
      return false;
    }

    // Filter by assigned to
    if (filters.assignedTo.length > 0) {
      if (filters.assignedTo.includes("unassigned") && task.assignedTo) {
        return false;
      } else if (
        !filters.assignedTo.includes("unassigned") && 
        !task.assignedTo || 
        !filters.assignedTo.some(assignee => 
          task.assignedTo?.toLowerCase().includes(assignee.toLowerCase())
        )
      ) {
        return false;
      }
    }

    // Filter by due date
    if (filters.dueDates.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const nextWeekStart = new Date(today);
      nextWeekStart.setDate(today.getDate() - today.getDay() + 7);
      
      const nextWeekEnd = new Date(nextWeekStart);
      nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
      
      const taskDate = new Date(task.dueDate);
      
      const isToday = taskDate.toDateString() === today.toDateString();
      const isTomorrow = taskDate.toDateString() === tomorrow.toDateString();
      const isThisWeek = taskDate >= today && taskDate < nextWeekStart;
      const isNextWeek = taskDate >= nextWeekStart && taskDate <= nextWeekEnd;
      
      const dateMatches = filters.dueDates.some(dateFilter => {
        if (dateFilter === "today") return isToday;
        if (dateFilter === "tomorrow") return isTomorrow;
        if (dateFilter === "this_week") return isThisWeek;
        if (dateFilter === "next_week") return isNextWeek;
        return false;
      });
      
      if (!dateMatches) return false;
    }

    return true;
  });

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        filters,
        setFilters,
        createTask,
        completeTask,
        setTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
}