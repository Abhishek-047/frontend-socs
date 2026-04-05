import React from "react";
import { Event } from "../../constants/events";
import { GlowBorder } from "../ui/GlowBorder";
import { Calendar, MapPin } from "lucide-react";

export function EventCard({ event }: { event: Event }) {
  const isUpcoming = event.status === "upcoming";
  
  return (
    <GlowBorder intensity={isUpcoming ? "medium" : "low"}>
      <div className={`p-6 flex flex-col h-full rounded-md ${isUpcoming ? "bg-neutral" : "bg-background/40"} border-l-4 ${isUpcoming ? "border-primary" : "border-gray-600"}`}>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full ${isUpcoming ? "bg-primary shadow-glow" : "bg-gray-500"}`}></span>
            <span className={`font-jetbrains text-xs uppercase tracking-wider ${isUpcoming ? "text-primary" : "text-gray-500"}`}>
              {event.status}
            </span>
          </div>
          <span className="font-jetbrains text-xs px-2 py-1 rounded border border-gray-700 text-gray-400 uppercase">
            {event.type}
          </span>
        </div>
        
        <h3 className="text-xl font-bold font-grotesk text-white mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {event.title}
        </h3>
        
        <p className="text-gray-400 font-jetbrains text-sm mb-6 flex-grow">
          {event.description}
        </p>
        
        <div className="flex flex-col gap-2 font-jetbrains text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar size={14} className={isUpcoming ? "text-primary/70" : ""} />
            <span>{new Date(event.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin size={14} className={isUpcoming ? "text-primary/70" : ""} />
              <span>{event.location}</span>
            </div>
          )}
        </div>
      </div>
    </GlowBorder>
  );
}
