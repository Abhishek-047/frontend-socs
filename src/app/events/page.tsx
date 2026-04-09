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
        
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mt-8">
          <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono tracking-widest uppercase">
            <span className="w-2 h-2 bg-primary/40 rounded-full animate-pulse" />
            <span>CALENDAR_STATUS: ACTIVE</span>
          </div>
          <button 
            className="flex items-center gap-2 bg-primary/10 border border-primary/40 px-4 py-2 text-[10px] font-bold font-mono tracking-[0.2em] text-primary hover:bg-primary hover:text-black transition-all duration-300 group"
            style={{ clipPath: "polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)" }}
          >
            <span className="text-lg group-hover:rotate-90 transition-transform">+</span>
            <span>INIT_EVENT</span>
          </button>
        </div>
        
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
