"use client"

import dynamic from 'next/dynamic';
import { MapPin } from 'lucide-react';

const Map = dynamic(() => import('./Map'), {
    ssr: false,
    loading: () => (
        <div className="h-[400px] w-full bg-slate-100 rounded-2xl animate-pulse flex items-center justify-center text-slate-400">
            <MapPin className="h-8 w-8 animate-bounce mb-2" />
            <span className="sr-only">Loading Map...</span>
        </div>
    )
});

interface ApiLocation {
    id: string;
    name: string;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    province?: string;
}

export default function MapWrapper({ locations }: { locations: ApiLocation[] }) {
    return <Map locations={locations} />;
}
