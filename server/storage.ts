import { tasks, type Task, type InsertTask } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  
  // Task-related methods
  getTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  completeTask(id: number): Promise<Task | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, any>;
  private taskStore: Map<number, Task>;
  userCurrentId: number;
  taskCurrentId: number;

  constructor() {
    this.users = new Map();
    this.taskStore = new Map();
    this.userCurrentId = 1;
    this.taskCurrentId = 1;
    
    // Initialize with sample tasks
    this.seedTasks();
  }
  
  private seedTasks() {
    const sampleTasks: InsertTask[] = [
      {
        title: "Call for Demo schedule",
        type: "call",
        priority: "high",
        associatedRecord: "Kuenzang Sherub",
        assignedTo: "Karan S",
        dueDate: new Date("2022-12-01T12:30:00"),
        notes: null,
        completed: false,
      },
      {
        title: "Email to be send to all the members",
        type: "email",
        priority: "medium",
        associatedRecord: "Gopichand",
        assignedTo: "Gopichand",
        dueDate: new Date("2022-12-01T12:30:00"),
        notes: null,
        completed: false,
      },
      {
        title: "Email to be send to all the employees",
        type: "email",
        priority: "low",
        associatedRecord: "Aditiya",
        assignedTo: "Aditiya",
        dueDate: new Date("2022-12-01T12:30:00"),
        notes: null,
        completed: false,
      },
      {
        title: "Discovery Call for Demo schedule",
        type: "call",
        priority: "low",
        associatedRecord: null,
        assignedTo: null,
        dueDate: new Date("2022-12-02T12:45:00"),
        notes: null,
        completed: false,
      },
      {
        title: "Call for Pickup Confirmation",
        type: "call",
        priority: "low",
        associatedRecord: null,
        assignedTo: null,
        dueDate: new Date("2022-12-02T12:45:00"),
        notes: null,
        completed: false,
      },
      {
        title: "Call for Demo schedule",
        type: "call",
        priority: "low",
        associatedRecord: null,
        assignedTo: null,
        dueDate: new Date("2022-12-02T12:45:00"),
        notes: null,
        completed: false,
      }
    ];
    
    sampleTasks.forEach(task => this.createTask(task));
  }

  async getUser(id: number): Promise<any | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: any): Promise<any> {
    const id = this.userCurrentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Task-related methods
  async getTasks(): Promise<Task[]> {
    return Array.from(this.taskStore.values());
  }
  
  async getTask(id: number): Promise<Task | undefined> {
    return this.taskStore.get(id);
  }
  
  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.taskCurrentId++;
    
    // Create a properly typed Task object with default values
    const task = {
      id,
      title: insertTask.title,
      type: insertTask.type,
      priority: insertTask.priority,
      dueDate: insertTask.dueDate,
      completed: false, // Default to false
      associatedRecord: insertTask.associatedRecord ?? null,
      assignedTo: insertTask.assignedTo ?? null,
      notes: insertTask.notes ?? null
    };
    
    // If completed is explicitly set to true in insertTask, override the default
    if (insertTask.completed === true) {
      task.completed = true;
    }
    
    this.taskStore.set(id, task);
    return task as Task;
  }
  
  async completeTask(id: number): Promise<Task | undefined> {
    const task = this.taskStore.get(id);
    if (!task) return undefined;
    
    const updatedTask: Task = { ...task, completed: true };
    this.taskStore.set(id, updatedTask);
    return updatedTask;
  }
}

export const storage = new MemStorage();
