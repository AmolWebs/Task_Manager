import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  getTasks, 
  createTask as createTaskFn, 
  completeTask as completeTaskFn 
} from "@shared/schema.js";

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

  // Initialize tasks from localStorage
  useEffect(() => {
    setTasks(getTasks());
  }, []);

  const createTask = async (task) => {
    try {
      const newTask = createTaskFn(task);
      setTasks(getTasks());
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

  const completeTask = async (id) => {
    try {
      const updatedTask = completeTaskFn(id);
      setTasks(getTasks());
      toast({
        title: "Success",
        description: "Task marked as complete!",
      });
      return updatedTask;
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
        setTasks,
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