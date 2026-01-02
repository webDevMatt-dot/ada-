import EventsClient, { NationalEvent } from "./EventsClient";

export const metadata = {
    title: 'Events - ADA Church',
    description: 'National Plan 2026 and upcoming church events.',
}

export default async function EventsPage() {
    let events: NationalEvent[] = [];

    try {
        // Fetch from national plan API
        const response = await fetch('https://financas.ada.org.mz/api/v1/churchdata/national-plan/', {
            cache: 'no-store'
        });

        if (response.ok) {
            events = await response.json();
            // Sort by date if API doesn't guarantee order
            events.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
        }
    } catch (error) {
        console.error("Failed to fetch events:", error);
        // Fallback or empty state will be handled by client
    }

    return (
        <EventsClient initialEvents={events} />
    );
}

