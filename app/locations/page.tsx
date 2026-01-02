import LocationsClient from "./LocationsClient";

const PROVINCE_QUERIES: Record<string, string[]> = {
    "Cabo Delgado": ["Cabo Delgado", "Pemba", "Montepuez", "Mocimboa"],
    "Gaza": ["Gaza", "Xai-Xai", "Chokwe", "Chibuto", "Macia", "Bilene", "Mandlakazi"],
    "Inhambane": ["Inhambane", "Maxixe", "Massinga", "Vilankulo", "Zavala", "Inharrime"],
    "Manica": ["Manica", "Chimoio", "Gondola", "Sussundenga"],
    "Maputo": ["Maputo", "Matola", "Boane", "Manhiça", "Marracuene", "Namaacha", "Moamba"],
    "Nampula": ["Nampula", "Nacala", "Ilha de Moçambique", "Monapo", "Angoche"],
    "Niassa": ["Niassa", "Lichinga", "Cuamba", "Lago"],
    "Sofala": ["Sofala", "Beira", "Dondo", "Nhamatanda", "Gorongosa"],
    "Tete": ["Tete", "Moatize", "Songo", "Ulongué", "Changara"],
    "Zambézia": ["Zambézia", "Quelimane", "Mocuba", "Gurué", "Alto Molocue", "Milange"]
};

// Updated interface to match your specific payload
interface ApiLocation {
    id: string; // Converted to string for internal use
    type: string;
    name: string;
    latitude: number | null;
    longitude: number | null;
    address: string | null;
    leader_name: string | null;
    leader_phone: string | null;
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
        const provincePromises = Object.entries(PROVINCE_QUERIES).map(async ([province, queries]) => {
            // Fetch for each query term in this province
            const termPromises = queries.map(async (term) => {
                try {
                    const response = await fetch(`https://financas.ada.org.mz/api/v1/churchdata/public-locations/search/?q=${encodeURIComponent(term)}`, {
                        next: { revalidate: 3600 },
                        headers: {
                            'Authorization': 'Token 4eece2fe44e1019df9e33e88708d92a9b1586e6d'
                        }
                    });

                    if (!response.ok) return [];
                    return await response.json() as RawApiLocation[];
                } catch (err) {
                    console.error(`Failed to fetch for term ${term}:`, err);
                    return [];
                }
            });

            // Wait for all terms for this province
            const results = await Promise.all(termPromises);

            // Flatten and Map
            return results.flat().map(item => ({
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
                // If "N/A" or missing, pass null so Client can handle fallback translation
                leader_name: (item.leader_name && item.leader_name !== "N/A") ? item.leader_name : null,
                leader_phone: item.leader_phone || null
            }));
        });

        const provinceResults = await Promise.all(provincePromises);

        // Deduplicate globally by ID
        const locationMap = new Map<string, ApiLocation>();
        provinceResults.flat().forEach(loc => {
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
