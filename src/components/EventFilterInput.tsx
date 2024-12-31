import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { Event } from "@/types";

interface EventFilterProps {
  events: Event[];
  onFilteredEventsChange: (events: Event[]) => void;
}

const EventFilter = ({ events, onFilteredEventsChange }: EventFilterProps) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    const filtered = events.filter(event => 
      event.title.toLowerCase().includes(query) ||
      event.description?.toLowerCase().includes(query)
    );
    onFilteredEventsChange(filtered);
  };

  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
      <Input
        type="text"
        placeholder="Search events..."
        onChange={handleSearch}
        className="pl-8"
      />
    </div>
  );
};

export default EventFilter;