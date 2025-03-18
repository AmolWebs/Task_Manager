import { FilterButton } from "./ui/filter-button";
import { useTaskContext } from "@/context/task-context";

export function TaskFilters() {
  const { filters, setFilters } = useTaskContext();

  const taskTypeOptions = [
    { label: "Call", value: "call" },
    { label: "Email", value: "email" },
    { label: "Meeting", value: "meeting" },
    { label: "Task", value: "task" },
  ];

  const priorityOptions = [
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Low", value: "low" },
  ];

  const assignedToOptions = [
    { label: "Jane Smith", value: "Jane Smith" },
    { label: "John Doe", value: "John Doe" },
    { label: "All Team", value: "All Team" },
    { label: "Unassigned", value: "unassigned" },
  ];

  const dueDateOptions = [
    { label: "Today", value: "today" },
    { label: "Tomorrow", value: "tomorrow" },
    { label: "This Week", value: "this_week" },
    { label: "Next Week", value: "next_week" },
  ];

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <FilterButton
        label="Task Type"
        count={filters.taskTypes.length || undefined}
        options={taskTypeOptions}
        selectedValues={filters.taskTypes}
        onSelectedChange={(values) =>
          setFilters({ ...filters, taskTypes: values })
        }
      />

      <FilterButton
        label="Due Date"
        count={filters.dueDates.length || undefined}
        options={dueDateOptions}
        selectedValues={filters.dueDates}
        onSelectedChange={(values) =>
          setFilters({ ...filters, dueDates: values })
        }
      />

      <FilterButton
        label="Assigned to"
        count={filters.assignedTo.length || undefined}
        options={assignedToOptions}
        selectedValues={filters.assignedTo}
        onSelectedChange={(values) =>
          setFilters({ ...filters, assignedTo: values })
        }
      />

      <FilterButton
        label="Priority"
        count={filters.priorities.length || undefined}
        options={priorityOptions}
        selectedValues={filters.priorities}
        onSelectedChange={(values) =>
          setFilters({ ...filters, priorities: values })
        }
      />
    </div>
  );
}