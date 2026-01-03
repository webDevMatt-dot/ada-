"use client"

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'

// Fix for default markers not showing up correctly in Leaflet+Webpack/Next.js
const fixLeafletIcons = () => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
};

// Updated to match the application data structure
interface ApiLocation {
    id: string; // Adjusted to string for internal consistency or keep number if consistent
    name: string;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    province: string | null;
}

userLocation ?: { latitude: number; longitude: number } | null;
}

export default function Map({ locations, userLocation }: { locations: ApiLocation[], userLocation?: { latitude: number; longitude: number } | null }) {

    useEffect(() => {
        fixLeafletIcons();
    }, []);

    // Calculate center based on locations, or default to Maputo
    const validLocations = locations.filter(l => l.latitude !== null && l.longitude !== null);
    const center: [number, number] = validLocations.length > 0
        ? [validLocations[0].latitude!, validLocations[0].longitude!]
        : [-25.9692, 32.5732]; // Default to Maputo

    return (
        <MapContainer
            center={center}
            zoom={6}
            scrollWheelZoom={false}
            className="h-full w-full z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {validLocations.map((loc) => (
                <Marker
                    key={loc.id}
                    position={[loc.latitude!, loc.longitude!]}
                >
                    <Popup>
                        <div className="p-1">
                            <h3 className="font-bold text-slate-800 text-sm mb-1">{loc.name}</h3>
                            <p className="text-xs text-slate-600 m-0 mb-2">{loc.address}</p>
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${loc.latitude},${loc.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-medium text-[#8b1d2c] hover:underline"
                            >
                                Get Directions
                            </a>
                        </div>
                    </Popup>
                </Marker>
            ))}
            {userLocation && (
                <Marker position={[userLocation.latitude, userLocation.longitude]}>
                    <Popup>
                        <div className="p-1">
                            <h3 className="font-bold text-slate-800 text-sm mb-1">Your Location</h3>
                        </div>
                    </Popup>
                </Marker>
            )}
        </MapContainer>
    )
}
