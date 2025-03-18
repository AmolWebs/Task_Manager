import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell } from "lucide-react";

export function TopBar() {
  return (
    <header className="bg-white border-b border-gray-200 py-2 px-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="invisible">
          {/* Placeholder for layout balance */}
        </div>
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          </button>
          <div className="flex items-center">
            <Avatar className="w-8 h-8 bg-primary text-white">
              <AvatarFallback className="text-sm font-semibold">JD</AvatarFallback>
            </Avatar>
            <span className="ml-2 text-sm font-medium">John Dew</span>
          </div>
        </div>
      </div>
    </header>
  );
}
