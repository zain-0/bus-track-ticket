
import { Ticket } from "@/types/ticket";
import { TicketStatusBadge } from "./TicketStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bus, Calendar, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface TicketCardProps {
  ticket: Ticket;
  viewRoute: string;
}

export function TicketCard({ ticket, viewRoute }: TicketCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{ticket.title}</CardTitle>
          <TicketStatusBadge status={ticket.status} />
        </div>
        <div className="text-sm text-muted-foreground">ID: {ticket.id}</div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Bus className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="font-medium mr-1">Bus:</span> {ticket.bus.busNumber} ({ticket.bus.model})
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="font-medium mr-1">Created:</span> {formatDistanceToNow(ticket.createdAt, { addSuffix: true })}
          </div>
          {ticket.estimatedCost && (
            <div className="flex items-center text-sm">
              <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium mr-1">Est. Cost:</span> ${ticket.estimatedCost.toFixed(2)}
            </div>
          )}
          <p className="text-sm line-clamp-2">{ticket.description}</p>
        </div>
      </CardContent>
      <CardFooter className="pt-1">
        <Button asChild variant="outline" className="w-full">
          <Link to={`${viewRoute}/${ticket.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
