import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AvatarWithTextProps {
  initials: string;
  name: string;
  colorClass?: string;
}

export const AvatarWithText = ({ initials, name, colorClass = "bg-blue-200 text-blue-800" }: AvatarWithTextProps) => {
  return (
    <div className="flex items-center">
      <Avatar className={`h-8 w-8 ${colorClass}`}>
        <AvatarFallback className="text-sm font-medium">{initials}</AvatarFallback>
      </Avatar>
      <span className="ml-2 text-sm text-gray-700">{name}</span>
    </div>
  );
};
