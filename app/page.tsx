



export const dynamic = "force-dynamic";

import { Hero } from "@/components/Hero";
import { NationalEvent } from "@/types/events";
import { HomeEvents } from "@/components/HomeEvents";
import { HomeContent, ServicesContent } from "@/components/HomeSections";

export default async function Home() {
  let events: NationalEvent[] = [];

  try {
    const years = ["2024", "2025", "2026"];
    const fetchPromises = years.map(year =>
      fetch(`https://financas.ada.org.mz/api/v1/planning/public/events/?year=${year}`, {
        cache: 'no-store',
        headers: {
          'Authorization': 'Token 4eece2fe44e1019df9e33e88708d92a9b1586e6d'
        }
      }).then(res => res.ok ? res.json() : [])
    );

    const results = await Promise.all(fetchPromises);

    // Extract 'results' array from each response page
    const allEvents = results.flatMap((data: any) => {
      if (Array.isArray(data)) return data; // Handle if API returns array directly
      if (data && Array.isArray(data.results)) return data.results; // Handle { results: [...] }
      return [];
    }) as NationalEvent[];

    const uniqueEvents = new Map(allEvents.map(e => [e.id, e]));
    events = Array.from(uniqueEvents.values());
  } catch (error) {
    console.error("Failed to fetch events for home:", error);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />

      {/* Upcoming Events Section - Placed prominently below Hero */}
      <HomeEvents events={events} />

      {/* Welcome / About Section */}
      <HomeContent />

      {/* Service Times Grid */}
      <ServicesContent />
    </div>
  );
}
