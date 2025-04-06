
import { TicketStatus } from "@/types/ticket";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TicketStatusBadgeProps {
  status: TicketStatus;
}

export function TicketStatusBadge({ status }: TicketStatusBadgeProps) {
  const statusConfig: Record<
    TicketStatus,
    { label: string; className: string }
  > = {
    open: {
      label: "Open",
      className: "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200",
    },
    in_progress: {
      label: "In Progress",
      className: "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200",
    },
    on_hold: {
      label: "On Hold",
      className: "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200",
    },
    resolved: {
      label: "Resolved",
      className: "bg-green-100 text-green-800 border-green-300 hover:bg-green-200",
    },
    closed: {
      label: "Closed",
      className: "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200",
    },
    pending: {
      label: "Pending Approval",
      className: "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200",
    },
    approved: {
      label: "Needs Acknowledgment",
      className: "bg-green-100 text-green-800 border-green-300 hover:bg-green-200",
    },
    acknowledged: {
      label: "Acknowledged",
      className: "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200",
    },
    quoted: {
      label: "Quotation Submitted",
      className: "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200",
    },
    quote_approved: {
      label: "Quote Approved",
      className: "bg-green-100 text-green-800 border-green-300 hover:bg-green-200",
    },
    quote_rejected: {
      label: "Quote Rejected",
      className: "bg-red-100 text-red-800 border-red-300 hover:bg-red-200",
    },
    under_service: {
      label: "Under Service",
      className: "bg-indigo-100 text-indigo-800 border-indigo-300 hover:bg-indigo-200",
    },
    invoiced: {
      label: "Invoiced",
      className: "bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200",
    },
    repair_requested: {
      label: "Repair Requested",
      className: "bg-red-100 text-red-800 border-red-300 hover:bg-red-200",
    },
    completed: {
      label: "Completed",
      className: "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200",
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-100 text-red-800 border-red-300 hover:bg-red-200",
    },
    pending_vendor: {
      label: "Pending Vendor",
      className: "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200",
    }
  };

  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
