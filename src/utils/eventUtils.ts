import { Event } from "@/types";

export const checkEventOverlap = (
  newEvent: Omit<Event, "id">,
  existingEvents: Event[],
  editingEventId?: string
): { hasOverlap: boolean; overlappingEvents: Event[] } => {
  const newStart = new Date(`2000-01-01T${newEvent.startTime}`);
  const newEnd = new Date(`2000-01-01T${newEvent.endTime}`);

  const overlappingEvents = existingEvents.filter((event) => {
    // Skip the event being edited
    if (editingEventId && event.id === editingEventId) {
      return false;
    }

    const existingStart = new Date(`2000-01-01T${event.startTime}`);
    const existingEnd = new Date(`2000-01-01T${event.endTime}`);

    // Check for any overlap
    return (
      (newStart >= existingStart && newStart < existingEnd) || // New event starts during existing event
      (newEnd > existingStart && newEnd <= existingEnd) || // New event ends during existing event
      (newStart <= existingStart && newEnd >= existingEnd) // New event completely encompasses existing event
    );
  });

  return {
    hasOverlap: overlappingEvents.length > 0,
    overlappingEvents,
  };
};

// Helper function to format time ranges for display
export const formatTimeRange = (event: Event): string => {
  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`;
};
