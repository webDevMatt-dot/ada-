export const dynamic = "force-dynamic";

import LocationsClient from "./LocationsClient";

// Updated interface to match specific payload
export interface ApiLocation {
    id: string; // Converted to string for internal use
    type: "Province" | "District" | "Assembly";
    name: string;
    latitude: number | null;
    longitude: number | null;
    address: string | null;
    leader_name: string | null;
    leader_phone: string | null;
    province: string | null;
}

// Raw API response item (id is number there)
interface RawApiLocation {
    id: number;
    type: string;
    name: string;
    latitude: number | null;
    longitude: number | null;
    address: string | null;
    leader_name: string;
    leader_phone: string;
    official_government_province?: string;
}

const formatProvince = (raw: string | undefined): string | null => {
    if (!raw) return null;
    // remote underscores and capitalize words
    return raw.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default async function Locations() {
    let cleanedLocations: ApiLocation[] = [];

    try {
        // Fetch with an empty query to get the full list
        const res = await fetch('https://financas.ada.org.mz/api/v1/churchdata/public-locations/search/?q=', {
            next: { revalidate: 3600 },
            headers: {
                'Authorization': 'Token 4eece2fe44e1019df9e33e88708d92a9b1586e6d'
            }
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch locations: ${res.status}`);
        }

        const rawData = await res.json() as RawApiLocation[];

        // Transform and Clean Data
        cleanedLocations = rawData.map(item => ({
            id: `${item.type}-${item.id}`,
            type: item.type as "Province" | "District" | "Assembly",
            name: item.name,
            latitude: item.latitude,
            longitude: item.longitude,
            // Fallback for empty addresses
            address: (item.address && item.address.trim().length > 0) ? item.address : null,
            leader_name: (item.leader_name && item.leader_name !== "N/A") ? item.leader_name : null,
            leader_phone: item.leader_phone || null,
            province: formatProvince(item.official_government_province),
        }));

    } catch (error) {
        console.error("Critical error fetching locations:", error);
        // Fallback to empty list or handle error UI if needed
    }

    return <LocationsClient locations={cleanedLocations} />;
}
