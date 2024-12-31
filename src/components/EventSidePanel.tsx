import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Trash2, Edit, Plus } from "lucide-react";
import { EVENT_COLORS } from "@/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  description?: string;
  color?: string;
}

interface EventSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  events: Event[];
  onDeleteEvent: (eventId: string) => void;
  onEditEvent: (event: Event) => void;
  onAddEvent: () => void;
}

const EventSidePanel: React.FC<EventSidePanelProps> = ({
  isOpen,
  onClose,
  selectedDate,
  events,
  onDeleteEvent,
  onEditEvent,
  onAddEvent,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [colorFilter, setColorFilter] = useState("all");

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredByColor =
    colorFilter === "all"
      ? filteredEvents
      : filteredEvents.filter((event) => event.color === colorFilter);

  const sortedEvents = filteredByColor.sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader className="mb-6">
          <SheetTitle>
            Events for{" "}
            {selectedDate?.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex gap-2">
              <Select value={colorFilter} onValueChange={setColorFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="min-w-0">
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundImage: `linear-gradient(45deg, ${EVENT_COLORS.map(
                            (color) => color.value
                          ).join(",")})`,
                        }}
                      />
                    </div>
                  </SelectItem>
                  {EVENT_COLORS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color.value }}
                        />
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={onAddEvent} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {sortedEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchQuery
                  ? "No events found matching your search"
                  : "No events scheduled for this day"}
              </div>
            ) : (
              sortedEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-lg border"
                  style={{
                    borderLeftColor: event.color,
                    borderLeftWidth: "4px",
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm text-gray-500">
                        {formatTime(event.startTime)} -{" "}
                        {formatTime(event.endTime)}
                      </p>
                      {event.description && (
                        <p className="text-sm text-gray-600 mt-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditEvent(event)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteEvent(event.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EventSidePanel;
