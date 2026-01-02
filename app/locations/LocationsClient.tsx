"use client"

import { useState } from "react"
import Image from "next/image"
import { MapPin, User, Phone, Search, SlidersHorizontal, Plus } from "lucide-react"
import MapWrapper from "@/components/MapWrapper"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

// Updated interface to match your specific payload
interface ApiLocation {
    id: string;
    type: string;
    name: string;
    latitude: number | null;
    longitude: number | null;
    address: string | null;
    leader_name: string;
    leader_phone: string;
    // App-specific field injected by server
    province: string;
}

const MOZAMBIQUE_PROVINCES = [
    "Cabo Delgado",
    "Gaza",
    "Inhambane",
    "Manica",
    "Maputo City",
    "Maputo Province",
    "Nampula",
    "Niassa",
    "Sofala",
    "Tete",
    "Zambézia"
];

export default function LocationsClient({ locations }: { locations: ApiLocation[] }) {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedProvince, setSelectedProvince] = useState("all")

    // Filter locations based on search and province
    const filteredLocations = locations.filter(loc => {
        const matchesProvince = selectedProvince === "all" || loc.province.toLowerCase() === selectedProvince.toLowerCase();

        if (!searchQuery) return matchesProvince;

        const query = searchQuery.toLowerCase();
        const matchesSearch =
            loc.name.toLowerCase().includes(query) ||
            loc.leader_name.toLowerCase().includes(query) ||
            (loc.address && loc.address.toLowerCase().includes(query)) ||
            loc.leader_phone.toLowerCase().includes(query) ||
            (loc.latitude && loc.longitude && `${loc.latitude},${loc.longitude}`.includes(query));

        return matchesProvince && matchesSearch;
    });

    // Group filtered locations by province

    const groupedLocations = filteredLocations.reduce((acc, loc) => {
        // Use the province grouping but handle distinct casing if necessary, 
        // though we assume consistency.
        if (!acc[loc.province]) acc[loc.province] = [];
        acc[loc.province].push(loc);
        return acc;
    }, {} as Record<string, ApiLocation[]>);

    return (
        <div className="min-h-screen bg-[#f8fafd] flex flex-col">
            {/* Hero Section */}
            <div className="relative h-[400px] w-full flex flex-col items-center justify-center text-center px-4">
                {/* Background Image/Overlay */}
                <div className="absolute inset-0 z-0 bg-slate-900">
                    <Image
                        src="/hero.png"
                        alt="Locations Background"
                        fill
                        className="object-cover opacity-40 mix-blend-overlay"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900/90" />
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-3xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="h-1 w-12 rounded-full bg-amber-500" />
                        <span className="text-xs font-medium uppercase tracking-wider text-amber-500">Community</span>
                        <div className="h-1 w-12 rounded-full bg-amber-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
                        Find an Assembly Near You
                    </h1>
                    <p className="text-lg text-slate-200 font-light max-w-2xl mx-auto">
                        Connect with a local church family for worship, fellowship, and spiritual growth.
                    </p>
                </div>
            </div>

            <div className="container mx-auto max-w-7xl space-y-8 py-10 px-4">

                {/* Search and Filters Bar */}
                <div className="flex flex-col md:flex-row gap-4 items-center bg-transparent">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                            placeholder="Search by pastor, church, phone, address, or coordinates..."
                            className="pl-12 h-12 bg-white border-none shadow-sm rounded-xl w-full focus-visible:ring-amber-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="bg-white p-3 rounded-xl shadow-sm border-none">
                            <SlidersHorizontal className="h-5 w-5 text-slate-500" />
                        </div>
                        <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                            <SelectTrigger className="w-[200px] h-12 bg-white border-none shadow-sm rounded-xl">
                                <SelectValue placeholder="All Provinces" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Provinces</SelectItem>
                                {MOZAMBIQUE_PROVINCES.map(province => (
                                    <SelectItem key={province} value={province.toLowerCase()}>
                                        {province}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button className="h-12 bg-[#8b1d2c] hover:bg-[#6d1722] text-white rounded-xl px-6 gap-2 shrink-0">
                            <Plus className="h-5 w-5" /> Submit a Location
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    {/* Left: Map Section */}
                    <div className="sticky top-24">
                        <MapWrapper locations={filteredLocations} />
                    </div>

                    {/* Right: Categorized List */}
                    <div className="space-y-10">
                        {Object.keys(groupedLocations).length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                                <p className="text-slate-500 text-lg">No locations found matching your criteria.</p>
                                {(searchQuery || selectedProvince !== "all") && (
                                    <Button
                                        variant="link"
                                        onClick={() => {
                                            setSearchQuery("");
                                            setSelectedProvince("all");
                                        }}
                                        className="mt-2 text-[#8b1d2c]"
                                    >
                                        Clear filters
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <Accordion type="multiple" className="w-full space-y-4">
                                {Object.entries(groupedLocations).map(([province, churches]) => (
                                    <AccordionItem key={province} value={province} className="bg-transparent border-none">
                                        <AccordionTrigger className="hover:no-underline py-2">
                                            <div className="flex items-center gap-3 w-full text-left">
                                                <div className="bg-[#c29c21] text-white font-bold px-4 py-1 rounded-md text-sm shrink-0">
                                                    {province}
                                                </div>
                                                <span className="text-slate-400 text-sm font-medium">
                                                    {churches.length} churches
                                                </span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-4 pb-2">
                                            <div className="space-y-4">
                                                {churches.map((loc) => (
                                                    <div
                                                        key={loc.id}
                                                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-50 hover:shadow-md transition-all flex gap-6 group"
                                                    >
                                                        <div className="bg-slate-50 p-4 rounded-xl h-fit">
                                                            <div className="bg-white p-2 rounded-lg shadow-sm border border-[#8b1d2c]/10 group-hover:border-[#8b1d2c] transition-colors">
                                                                <MapPin className="h-6 w-6 text-[#8b1d2c]" />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-3 flex-1">
                                                            <h2 className="text-2xl font-bold text-[#1e293b]">{loc.name}</h2>

                                                            <div className="space-y-2">
                                                                <div className="flex items-start gap-2 text-slate-500 text-sm">
                                                                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                                                                    <span>{loc.address || "Address not available"}</span>
                                                                </div>

                                                                {/* Service time removed as it's not in new payload */}

                                                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                                    <User className="h-4 w-4 shrink-0" />
                                                                    <span>{loc.leader_name}</span>
                                                                </div>

                                                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                                    <Phone className="h-4 w-4 shrink-0" />
                                                                    <span>{loc.leader_phone}</span>
                                                                </div>

                                                                {loc.latitude && loc.longitude && (
                                                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-mono pt-1">
                                                                        <span>{loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
