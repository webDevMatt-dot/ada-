import { EventsClient } from "./EventsClient";
export const dynamic = "force-dynamic";

import { NationalEvent } from "@/types/events";

export const metadata = {
    title: 'Events - ADA Church',
    description: 'National Plan 2026 and upcoming church events.',
}

export default async function EventsPage() {
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

        console.log(`Fetched ${events.length} events across years ${years.join(', ')}`);

        // Sort by date ascending
        events.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

    } catch (error) {
        console.error("Failed to fetch events:", error);
        // Fallback or empty state will be handled by client
    }

    return (
        <EventsClient initialEvents={events} />
    );
}

