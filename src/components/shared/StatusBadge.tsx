import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-800",
  Suspended: "bg-yellow-100 text-yellow-800",
  Expired: "bg-red-100 text-red-800",
  "Under Review": "bg-blue-100 text-blue-800",
};

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        statusColors[status] ?? "bg-gray-100 text-gray-800",
      )}
    >
      {status}
    </span>
  );
}
