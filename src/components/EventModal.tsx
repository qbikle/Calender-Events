import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { checkEventOverlap, formatTimeRange } from "@/utils/eventUtils";
import type { Event, EventData } from "@/types";
import { EVENT_COLORS } from "@/constants";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: Event) => void;
  selectedDate: Date | null;
  eventToEdit?: Event;
  existingEvents: Event[];
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedDate,
  eventToEdit,
  existingEvents,
}) => {
  const [formData, setFormData] = useState<EventData>({
    id: "",
    title: "",
    startTime: "09:00",
    endTime: "10:00",
    description: "",
    color: EVENT_COLORS[0].value,
  });

  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (eventToEdit) {
      setFormData(eventToEdit);
    } else {
      const defaultStartTime = "09:00";
      const defaultEndTime = "10:00";

      setFormData({
        id: crypto.randomUUID(),
        title: "",
        startTime: defaultStartTime,
        endTime: defaultEndTime,
        description: "",
        color: EVENT_COLORS[0].value,
        date: selectedDate?.toISOString().split("T")[0] || new Date().toISOString().split("T")[0],
      });
    }
  }, [eventToEdit, isOpen, selectedDate]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const [overlapWarning, setOverlapWarning] = useState<{
    hasOverlap: boolean;
    overlappingEvents: Event[];
  }>({ hasOverlap: false, overlappingEvents: [] });

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError("Event title is required");
      return false;
    }

    const startTime = new Date(`2000-01-01T${formData.startTime}`);
    const endTime = new Date(`2000-01-01T${formData.endTime}`);

    if (startTime >= endTime) {
      setError("End time must be after start time");
      return false;
    }

    // Check for overlaps
    const { hasOverlap, overlappingEvents } = checkEventOverlap(
      formData,
      existingEvents,
      eventToEdit?.id
    );

    if (hasOverlap) {
      setOverlapWarning({ hasOverlap, overlappingEvents });
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOverlapWarning({ hasOverlap: false, overlappingEvents: [] });

    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {eventToEdit ? "Edit Event" : "Create New Event"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Event Color</Label>
            <Select
              value={formData.color}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, color: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EVENT_COLORS.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: color.value }}
                      />
                      {color.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add event description"
              rows={3}
            />
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}
          {overlapWarning.hasOverlap && (
            <Alert variant="destructive">
              <AlertTitle>Time Conflict Detected</AlertTitle>
              <AlertDescription>
                This event overlaps with:
                {overlapWarning.overlappingEvents.map((event) => (
                  <div key={event.id} className="mt-1">
                    • {event.title} ({formatTimeRange(event)})
                  </div>
                ))}
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {eventToEdit ? "Save Changes" : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
