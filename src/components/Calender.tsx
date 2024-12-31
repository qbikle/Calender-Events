import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { EventData } from "@/types";
import EventModal from "./EventModal";
import EventSidePanel from "./EventSidePanel";
import { Event } from "@/types";

interface DayEvents {
  [date: string]: Event[];
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<DayEvents>(
    JSON.parse(localStorage.getItem("calendarEvents") || "{}")
  );
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventData | undefined>();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  // Save events to localStorage
  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  const handleDeleteEvent = (eventId: string) => {
    if (!selectedDate) return;
    const dateKey = formatDateKey(selectedDate);
    const dayEvents = events[dateKey] || [];

    setEvents({
      ...events,
      [dateKey]: dayEvents.filter((event) => event.id !== eventId),
    });
  };

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleAddEvent = (eventData: EventData) => {
    const dateKey = formatDateKey(selectedDate!);
    const dayEvents = events[dateKey] || [];

    setEvents({
      ...events,
      [dateKey]: [...dayEvents, eventData],
    });
  };

  const handleEditEvent = (eventData: EventData) => {
    const dateKey = formatDateKey(selectedDate!);
    const dayEvents = events[dateKey] || [];

    setEvents({
      ...events,
      [dateKey]: dayEvents.map((event) =>
        event.id === eventData.id ? eventData : event
      ),
    });
  };

  // Format date for storage key
  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsSidePanelOpen(true);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-24 border border-gray-200 bg-gray-50"
        />
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const dateKey = formatDateKey(date);
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const dayEvents = events[dateKey] || [];

      days.push(
        <div
          key={day}
          onClick={() => handleDayClick(date)}
          className={`h-24 border border-gray-200 p-2 cursor-pointer transition-colors
            ${isToday ? "bg-blue-50" : ""}
            ${isSelected ? "ring-2 ring-blue-500" : ""}
            hover:bg-gray-50`}
        >
          <div className="font-medium">{day}</div>
          <div className="mt-1">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className="text-xs truncate p-1 mb-1 rounded"
                style={{ backgroundColor: event.color || "#E2E8F0" }}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const handleExportMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const monthEvents: Event[] = [];

    // Collect all events for the current month
    Object.entries(events).forEach(([dateKey, dayEvents]) => {
      const [eventYear, eventMonth] = dateKey.split("-").map(Number);
      if (eventYear === year && eventMonth === month) {
        monthEvents.push(...dayEvents);
      }
    });

    // Sort events by start time
    monthEvents.sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    // Format events for export
    const exportData = monthEvents.map((event) => ({
      title: event.title,
      date: new Date(event.date ?? new Date).toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      }),
      startTime: event.startTime,
      endTime: event.endTime,
      description: event.description || "",
    }));

    console.log(exportData);

    const csvContent = [
      ["Title", "Date", "Start Time", "End Time", "Description"],
      ...exportData.map((event) => [
        event.title,
        event.date,
        event.startTime,
        event.endTime,
        event.description,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `calendar-events-${currentDate.toLocaleString("default", {
      month: "long",
      year: "numeric",
    })}.csv`;
    link.click();
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportMonth}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Month
            </Button>
            <Button variant="outline" size="icon" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-2 text-center font-medium text-gray-600"
            >
              {day}
            </div>
          ))}
          {renderCalendarDays()}
        </div>
        <EventModal
          isOpen={isEventModalOpen}
          onClose={() => {
            setIsEventModalOpen(false);
            setSelectedEvent(undefined);
          }}
          onSave={selectedEvent ? handleEditEvent : handleAddEvent}
          selectedDate={selectedDate!}
          eventToEdit={selectedEvent}
          existingEvents={
            selectedDate ? events[formatDateKey(selectedDate)] || [] : []
          }
          key={selectedEvent?.id}
        />
        <EventSidePanel
          isOpen={isSidePanelOpen}
          onClose={() => setIsSidePanelOpen(false)}
          selectedDate={selectedDate}
          events={selectedDate ? events[formatDateKey(selectedDate)] || [] : []}
          onDeleteEvent={handleDeleteEvent}
          onEditEvent={(event) => {
            setSelectedEvent(event);
            setIsEventModalOpen(true);
          }}
          onAddEvent={() => {
            setSelectedEvent(undefined);
            setIsEventModalOpen(true);
          }}
        />
      </CardContent>
    </Card>
  );
};

export default Calendar;
