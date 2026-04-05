"use client";

import React, { useEffect, useRef } from "react";
import { PageWrapper } from "../../components/layout/PageWrapper";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { EventCard } from "../../components/cards/EventCard";
import { events } from "../../constants/events";
import { staggerCardsOnScroll } from "../../lib/animations";

export default function EventsPage() {
  const upcomingRef = useRef<HTMLDivElement>(null);
  const pastRef = useRef<HTMLDivElement>(null);

  const upcomingEvents = events.filter(e => e.status === "upcoming").sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastEvents = events.filter(e => e.status === "past").sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  useEffect(() => {
    if (upcomingRef.current) staggerCardsOnScroll(upcomingRef.current);
    if (pastRef.current) staggerCardsOnScroll(pastRef.current);
  }, []);

  return (
    <PageWrapper>
      <div className="pt-10 pb-20">
        <SectionHeader 
          title="Event Calendar" 
          subtitle="Workshops, CTFs, and tech talks to upgrade your skills."
        />
        
        <div className="space-y-20 mt-16">
          {/* Upcoming Section */}
          <section>
            <h3 className="font-jetbrains text-2xl text-primary mb-8 shadow-glow inline-block border-b border-primary pb-2">
              [ Scheduled Executions ]
            </h3>
            {upcomingEvents.length > 0 ? (
              <div ref={upcomingRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {upcomingEvents.map((event, i) => (
                  <div key={i} className="opacity-0"><EventCard event={event} /></div>
                ))}
              </div>
            ) : (
             <div className="p-8 border border-gray-800 bg-background text-gray-500 font-jetbrains rounded">
               &gt; No active events scheduled at this time.
             </div>
            )}
          </section>

          {/* Past Section */}
          <section>
            <h3 className="font-jetbrains text-2xl text-gray-400 mb-8 border-b border-gray-800 pb-2 inline-block">
              [ Archived Executions ]
            </h3>
            <div ref={pastRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-60 hover:opacity-100 transition-opacity duration-500">
              {pastEvents.map((event, i) => (
                <div key={i} className="opacity-0"><EventCard event={event} /></div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </PageWrapper>
  );
}
