import { Phone, Mail, CalendarDays, ClipboardCheck } from "lucide-react";

export function getTaskTypeIcon(type) {
  switch (type) {
    case "call":
      return <Phone className="h-4 w-4 text-gray-600" />;
    case "email":
      return <Mail className="h-4 w-4 text-gray-600" />;
    case "meeting":
      return <CalendarDays className="h-4 w-4 text-gray-600" />;
    case "task":
      return <ClipboardCheck className="h-4 w-4 text-gray-600" />;
    default:
      return null;
  }
}