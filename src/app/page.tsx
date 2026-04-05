"use client";

import { PageWrapper } from "../components/layout/PageWrapper";
import { HeroSection } from "../components/sections/HeroSection";
import { AboutSection } from "../components/sections/AboutSection";
import { StatsSection } from "../components/sections/StatsSection";
import { FeaturedProjects } from "../components/sections/FeaturedProjects";
import { EventsPreview } from "../components/sections/EventsPreview";

export default function Home() {
  return (
    <PageWrapper>
      <HeroSection />
      <div className="space-y-24 pb-20">
        <AboutSection />
        <StatsSection />
        <FeaturedProjects />
        <EventsPreview />
      </div>
    </PageWrapper>
  );
}
