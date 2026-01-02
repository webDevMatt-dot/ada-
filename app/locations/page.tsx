import LocationsClient from "./LocationsClient";

const PROVINCES = [
    "Cabo Delgado",
    "Gaza",
    "Inhambane",
    "Manica",
    "Maputo",
    "Nampula",
    "Niassa",
    "Sofala",
    "Tete",
    "Zambézia"
];

// Updated interface to match your specific payload
interface ApiLocation {
    id: string; // Converted to string for internal use
    type: string;
    name: string;
    latitude: number | null;
    longitude: number | null;
    address: string | null;
    leader_name: string;
    leader_phone: string;
    // App-specific field
    province: string;
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
}

export default async function Locations() {
    let allLocations: ApiLocation[] = [];

    try {
        const fetchPromises = PROVINCES.map(async (province) => {
            try {
                const response = await fetch(`https://financas.ada.org.mz/api/v1/churchdata/public-locations/search/?q=${encodeURIComponent(province)}`, {
                    next: { revalidate: 3600 },
                    headers: {
                        'Authorization': 'Token 4eece2fe44e1019df9e33e88708d92a9b1586e6d'
                    }
                });

                if (!response.ok) return [];

                const data: RawApiLocation[] = await response.json();

                return data.map(item => ({
                    id: item.id.toString(),
                    type: item.type,
                    name: item.name,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    // Use address if provided, otherwise default to the province name
                    address: (item.address && item.address.trim() !== "")
                        ? item.address
                        : `ADA ${item.name}, ${province}`,
                    province: province === "Maputo" ? "Maputo Province" : province,
                    // Map leader_name and leader_phone from the new payload
                    leader_name: item.leader_name !== "N/A" ? item.leader_name : "Regional Pastor",
                    leader_phone: item.leader_phone || "Contact HQ"
                }));

            } catch (err) {
                console.error(`Failed to fetch for ${province}:`, err);
                return [];
            }
        });

        const results = await Promise.all(fetchPromises);

        const locationMap = new Map<string, ApiLocation>();
        results.flat().forEach(loc => {
            if (!locationMap.has(loc.id)) {
                locationMap.set(loc.id, loc);
            }
        });

        allLocations = Array.from(locationMap.values());

    } catch (error) {
        console.error("Critical error fetching locations:", error);
    }

    return <LocationsClient locations={allLocations} />;
}
