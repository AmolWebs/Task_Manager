import { useState } from "react";
import { DataTable } from "./ui/data-table";
import { AvatarWithText } from "./ui/avatar-with-text";
import { Task } from "@shared/schema";
import { useTaskContext } from "@/context/task-context";
import { MoreVertical, Phone, Mail, Calendar } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "./confirm-dialog";
import { getTaskTypeIcon } from "@/lib/utils/task-icons";
import { format } from "date-fns";

export function TaskTable() {
  const { tasks, setTasks, completeTask } = useTaskContext();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sortColumn, setSortColumn] = useState<string>("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnId);
      setSortDirection("asc");
    }
  };

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
    setConfirmOpen(true);
  };

  const handleConfirmComplete = async () => {
    if (selectedTask) {
      await completeTask(selectedTask.id);
      setConfirmOpen(false);
    }
  };

  const getAvatarColor = (name: string) => {
    const colors = {
      "Karan S": "bg-blue-200 text-blue-800",
      "Gopichand": "bg-green-200 text-green-800",
      "Aditiya": "bg-red-200 text-red-800",
      "Kuenzang Sherub": "bg-blue-200 text-blue-800",
      "Unassigned": "bg-gray-200 text-gray-600"
    };
    
    return colors[name as keyof typeof colors] || "bg-gray-200 text-gray-600";
  };

  const getInitials = (name: string) => {
    if (name === "Unassigned") return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-red-500",
      medium: "bg-amber-500",
      low: "bg-slate-500"
    };
    return colors[priority as keyof typeof colors] || "bg-slate-500";
  };

  const columns = [
    {
      id: "title",
      header: "To do",
      sortable: true,
      cell: (task: Task) => (
        <div className="flex items-center">
          <div className="text-gray-700 mr-2">
            {getTaskTypeIcon(task.type)}
          </div>
          <div className="text-sm font-medium text-gray-900">{task.title}</div>
        </div>
      ),
    },
    {
      id: "priority",
      header: "Priority",
      sortable: true,
      cell: (task: Task) => (
        <div className="flex items-center">
          <div className={`w-1 h-4 ${getPriorityColor(task.priority)} rounded-sm mr-2`}></div>
          <span className="text-sm text-gray-700">
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
        </div>
      ),
    },
    {
      id: "dueDate",
      header: "Due date",
      sortable: true,
      cell: (task: Task) => (
        <span className="text-sm text-gray-700">
          {format(new Date(task.dueDate), "d MMM, yyyy, h:mma")}
        </span>
      ),
    },
    {
      id: "associatedRecord",
      header: "Associated Record",
      sortable: true,
      cell: (task: Task) => (
        task.associatedRecord ? (
          <AvatarWithText 
            initials={getInitials(task.associatedRecord)} 
            name={task.associatedRecord} 
            colorClass={getAvatarColor(task.associatedRecord)} 
          />
        ) : (
          <AvatarWithText initials="?" name="Unassigned" colorClass="bg-gray-200 text-gray-600" />
        )
      ),
    },
    {
      id: "assignedTo",
      header: "Assigned to",
      sortable: true,
      cell: (task: Task) => (
        task.assignedTo ? (
          <AvatarWithText 
            initials={getInitials(task.assignedTo)} 
            name={task.assignedTo} 
            colorClass={getAvatarColor(task.assignedTo)} 
          />
        ) : (
          <AvatarWithText initials="?" name="Unassigned" colorClass="bg-gray-200 text-gray-600" />
        )
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={tasks}
        columns={columns}
        onRowSelect={handleTaskSelect}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
      
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Confirm Action"
        description="Are you sure you want to mark this task as complete?"
        onConfirm={handleConfirmComplete}
      />
    </>
  );
}
