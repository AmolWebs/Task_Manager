import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TopBar } from "@/components/top-bar";
import { TaskFilters } from "@/components/task-filters";
import { TaskTable } from "@/components/task-table";
import { Pagination } from "@/components/pagination";
import { CreateTaskModal } from "@/components/create-task-modal";
import { useTaskContext } from "@/context/task-context";

export default function TaskList() {
  const { filteredTasks } = useTaskContext();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const indexOfLastTask = currentPage * itemsPerPage;
  const indexOfFirstTask = indexOfLastTask - itemsPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <TopBar />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-1">Tasks</div>
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">Important Task</h1>
            <Button onClick={() => setCreateModalOpen(true)}>
              Create Task
            </Button>
          </div>
        </div>
        
        <TaskFilters />
        
        <Card className="mb-6 overflow-hidden">
          <TaskTable />
          
          <Pagination
            totalItems={filteredTasks.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(value) => {
              setItemsPerPage(value);
              setCurrentPage(1);
            }}
          />
        </Card>
      </main>
      
      <CreateTaskModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
    </div>
  );
}
