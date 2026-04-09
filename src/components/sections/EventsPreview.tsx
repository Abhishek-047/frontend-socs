"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { SectionHeader } from "../ui/SectionHeader";
import { EventCard } from "../cards/EventCard";
import { events } from "../../constants/events";
import { staggerCardsOnScroll } from "../../lib/animations";

export function EventsPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const upcomingEvents = events.filter(e => e.status === "upcoming").slice(0, 2);

  useEffect(() => {
    if (containerRef.current) {
      staggerCardsOnScroll(containerRef.current);
    }
  }, []);

  return (
    <section className="py-20 border-t border-primary/10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8">
        <SectionHeader 
          title="Upcoming Events" 
          subtitle="Join us for workshops, guest lectures, and capture the flag events."
          className="mb-0"
        />
        <Link 
          href="/events" 
          className="group inline-flex items-center font-jetbrains text-primary text-sm mt-4 md:mt-0 hover:text-white transition-colors"
        >
          [ View Calendar ]
          <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
      
      <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        {upcomingEvents.map((event, idx) => (
          <div key={idx} className="opacity-0">
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </section>
  );
}
