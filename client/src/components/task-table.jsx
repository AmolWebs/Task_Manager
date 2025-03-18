import { useState } from "react";
import { DataTable } from "./ui/data-table";
import { AvatarWithText } from "./ui/avatar-with-text";
import { useTaskContext } from "@/context/task-context";
import { MoreVertical, Phone, Mail, Calendar } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "./confirm-dialog";
import { getTaskTypeIcon } from "@/lib/utils/task-icons";
import { format } from "date-fns";

export function TaskTable() {
  const { filteredTasks, completeTask } = useTaskContext();
  const [selectedTask, setSelectedTask] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sortColumn, setSortColumn] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (columnId) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnId);
      setSortDirection("asc");
    }
  };

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
    setConfirmOpen(true);
  };

  const handleConfirmComplete = async () => {
    if (selectedTask) {
      await completeTask(selectedTask.id);
      setConfirmOpen(false);
    }
  };

  const getAvatarColor = (name) => {
    const colors = {
      "Karan S": "bg-blue-200 text-blue-800",
      "Gopichand": "bg-green-200 text-green-800",
      "Aditiya": "bg-red-200 text-red-800",
      "Kuenzang Sherub": "bg-blue-200 text-blue-800",
      "Unassigned": "bg-gray-200 text-gray-600"
    };
    
    return colors[name] || "bg-gray-200 text-gray-600";
  };

  const getInitials = (name) => {
    if (!name || name === "Unassigned") return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-red-500",
      medium: "bg-amber-500",
      low: "bg-slate-500"
    };
    return colors[priority] || "bg-slate-500";
  };

  // Format the date and time for display
  const formatDateTime = (dateStr, timeStr) => {
    if (!dateStr) return '';
    
    try {
      // If we have both date and time strings (localStorage format)
      if (timeStr) {
        const [year, month, day] = dateStr.split('-');
        const [hours, minutes] = timeStr.split(':');
        const date = new Date(year, month - 1, day, hours, minutes);
        return format(date, "d MMM, yyyy, h:mma");
      } 
      // If we have a full ISO string (API format)
      else {
        return format(new Date(dateStr), "d MMM, yyyy, h:mma");
      }
    } catch (error) {
      return dateStr;
    }
  };

  const columns = [
    {
      id: "title",
      header: "To do",
      sortable: true,
      cell: (task) => (
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
      cell: (task) => (
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
      cell: (task) => (
        <span className="text-sm text-gray-700">
          {formatDateTime(task.dueDate, task.dueTime)}
        </span>
      ),
    },
    {
      id: "associatedRecord",
      header: "Associated Record",
      sortable: true,
      cell: (task) => (
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
      cell: (task) => (
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
    {
      id: "actions",
      header: "",
      sortable: false,
      cell: (task) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 hover:bg-gray-100 rounded-md">
                <MoreVertical className="h-4 w-4 text-gray-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleTaskSelect(task)}>
                Complete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={filteredTasks}
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