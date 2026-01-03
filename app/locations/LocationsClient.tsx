"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { MapPin, User, Phone, Search, Building2 } from "lucide-react"
import MapWrapper from "@/components/MapWrapper"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/context/LanguageContext"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

// Interface matching page.tsx
interface ApiLocation {
    id: string;
    type: "Province" | "District" | "Assembly";
    name: string;
    latitude: number | null;
    longitude: number | null;
    address: string | null;
    leader_name: string | null;
    leader_phone: string | null;
    province: string | null;
}

export default function LocationsClient({ locations }: { locations: ApiLocation[] }) {
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [sortByDistance, setSortByDistance] = useState(false);
    const { t } = useLanguage();

    // Haversine formula to calculate distance in km
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };

    const deg2rad = (deg: number) => {
        return deg * (Math.PI / 180);
    };

    const handleFindNearest = () => {
        setIsLocating(true);
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            setIsLocating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ latitude, longitude });
                setSortByDistance(true);
                setIsLocating(false);
            },
            (error) => {
                console.error("Error getting location:", error);
                alert("Unable to retrieve your location");
                setIsLocating(false);
            }
        );
    };

    // Filter and Sort locations
    const processedLocations = useMemo(() => {
        let result = locations;

        // 1. Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(loc =>
                loc.name.toLowerCase().includes(query) ||
                (loc.leader_name && loc.leader_name.toLowerCase().includes(query)) ||
                (loc.address && loc.address.toLowerCase().includes(query)) ||
                (loc.leader_phone && loc.leader_phone.toLowerCase().includes(query))
            );
        }

        // 2. Sort by Distance if enabled
        if (sortByDistance && userLocation) {
            return [...result].sort((a, b) => {
                if (a.latitude === null || a.longitude === null) return 1;
                if (b.latitude === null || b.longitude === null) return -1;

                const distA = calculateDistance(userLocation.latitude, userLocation.longitude, a.latitude, a.longitude);
                const distB = calculateDistance(userLocation.latitude, userLocation.longitude, b.latitude, b.longitude);
                return distA - distB;
            });
        }

        return result;
    }, [locations, searchQuery, sortByDistance, userLocation]);

    // Split into categories
    const provinces = useMemo(() => processedLocations.filter(l => l.type === "Province"), [processedLocations]);
    const districts = useMemo(() => processedLocations.filter(l => l.type === "District"), [processedLocations]);
    const assemblies = useMemo(() => processedLocations.filter(l => l.type === "Assembly"), [processedLocations]);

    const renderList = (items: ApiLocation[], emptyMsg: string) => {
        if (items.length === 0) {
            return (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                    <p className="text-slate-500 text-lg">{emptyMsg}</p>
                    {searchQuery && (
                        <Button
                            variant="link"
                            onClick={() => setSearchQuery("")}
                            className="mt-2 text-[#8b1d2c]"
                        >
                            {t('locations.clearFilters')}
                        </Button>
                    )}
                </div>
            );
        }

        // Add distance to items if user location is available
        const itemsWithDistance = items.map(item => {
            let distance = null;
            if (userLocation && item.latitude && item.longitude) {
                distance = calculateDistance(userLocation.latitude, userLocation.longitude, item.latitude, item.longitude);
            }
            return { ...item, distance };
        });

        // Group items by province (skip grouping if sorting by distance)
        // If sorting by distance, we might want a flat list or still grouped? 
        // Let's keep grouping for now but the sorting within groups might be weird if we sort strictly by distance globally.
        // If sortByDistance is strictly true, maybe we should just show a flat list or grouped by distance ranges?
        // Use existing design: Group by province, but sort provinces? 
        // For simplicity and to match user request "find closest", showing them in order matters.
        // If sorted by distance, let's just use a single "Nearest Locations" group or keep province groups but sorted by nearest in that province?
        // Let's stick to province grouping but sort items within province by distance if enabled.
        // AND sort provinces by the distance of their closest item? That's complex.

        // BETTER APPROACH: If finding nearest, just show a flat list or grouped by "Nearest".
        // But to minimize UI disruption, let's keep province groups, but sort existing groups by...

        // Actually, if "Find Nearest" is clicked, usually you want a flat list of closest churches regardless of province.
        // BUT the UI is Tab-based (Assemblies/Districts/Provinces).
        // Let's keep the tabs. Within a tab, if 'sortByDistance' is active, maybe we disable province grouping?
        // Let's stick to the existing grouping for consistency, but maybe auto-expand the group with the closest church?

        // Going with: Keep Province Grouping, but keys are sorted.

        const groupedItems = itemsWithDistance.reduce((groups, item) => {
            const province = item.province || "Other";
            if (!groups[province]) {
                groups[province] = [];
            }
            groups[province].push(item);
            return groups;
        }, {} as Record<string, typeof itemsWithDistance[0][]>);

        // Sort provinces alphbetically OR by closest member? Sticking to alphabetical to avoid confusion for now, 
        // unless we want to bring the user's current province to top?
        const sortedProvinces = Object.keys(groupedItems).sort();

        return (
            <Accordion type="multiple" className="space-y-4" defaultValue={sortByDistance ? sortedProvinces : undefined}>
                {sortedProvinces.map((province) => (
                    <AccordionItem key={province} value={province} className="border-none">
                        <AccordionTrigger className="hover:no-underline bg-white px-6 rounded-2xl shadow-sm border border-slate-50 mb-2 data-[state=open]:rounded-b-none data-[state=open]:shadow-none data-[state=open]:border-b-0 transition-all [&[data-state=open]]:bg-slate-50/50">
                            <span className="flex items-center gap-2">
                                <span className="text-xl font-bold text-slate-800">{province}</span>
                                <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                    {groupedItems[province].length}
                                </span>
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="bg-slate-50/50 px-6 pb-6 rounded-b-2xl border-x border-b border-slate-50 pt-2">
                            <div className="space-y-4">
                                {groupedItems[province].map((loc) => (
                                    <div
                                        key={loc.id}
                                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-50 hover:shadow-md transition-all flex flex-col md:flex-row gap-6 group"
                                    >
                                        <div className="bg-slate-50 p-4 rounded-xl h-fit shrink-0 self-start">
                                            <div className="bg-white p-2 rounded-lg shadow-sm border border-[#8b1d2c]/10 group-hover:border-[#8b1d2c] transition-colors">
                                                <MapPin className="h-6 w-6 text-[#8b1d2c]" />
                                            </div>
                                            {loc.distance !== null && (
                                                <div className="mt-2 text-[10px] font-bold text-slate-500 text-center">
                                                    {loc.distance.toFixed(1)} km
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-3 flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-4">
                                                <h2 className="text-xl font-bold text-[#1e293b] truncate pr-2">{loc.name}</h2>
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shrink-0 whitespace-nowrap ${loc.type === 'Assembly'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {loc.type}
                                                </span>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-start gap-2 text-slate-500 text-sm">
                                                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                                                    <span className="line-clamp-2">{loc.address || t('locations.addressNotAvailable')}</span>
                                                </div>

                                                {loc.province && (
                                                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                        <Building2 className="h-4 w-4 shrink-0 mt-0.5" />
                                                        <span>{loc.province}</span>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                    <User className="h-4 w-4 shrink-0" />
                                                    <span className="truncate">{loc.leader_name || t('locations.regionalPastor')}</span>
                                                </div>

                                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                    <Phone className="h-4 w-4 shrink-0" />
                                                    <span>{loc.leader_phone ? `+258 ${loc.leader_phone}` : t('locations.contactHQ')}</span>
                                                </div>
                                            </div>

                                            <div className="pt-2 flex gap-3">
                                                {loc.latitude && loc.longitude && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-xs h-8 gap-2 border-[1.5px] border-[#8b1d2c]/20 text-[#8b1d2c] hover:bg-[#8b1d2c]/5 hover:text-[#8b1d2c]"
                                                        asChild
                                                    >
                                                        <a
                                                            href={`https://www.google.com/maps/dir/?api=1&destination=${loc.latitude},${loc.longitude}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <MapPin className="h-3 w-3" />
                                                            Get Directions
                                                        </a>
                                                    </Button>
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
        );
    };

    return (
        <div className="min-h-screen bg-[#f8fafd] flex flex-col">
            {/* Hero Section */}
            <div className="relative h-[300px] w-full flex flex-col items-center justify-center text-center px-4">
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
                <div className="relative z-10 max-w-3xl mx-auto space-y-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="h-1 w-12 rounded-full bg-amber-500" />
                        <span className="text-xs font-medium uppercase tracking-wider text-amber-500">Community</span>
                        <div className="h-1 w-12 rounded-full bg-amber-500" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
                        {t('locations.heroTitle')}
                    </h1>
                </div>
            </div>

            <div className="container mx-auto max-w-7xl space-y-6 py-8 px-4">
                {/* Search Bar & Geolocation */}
                <div className="flex flex-col md:flex-row gap-4 w-full max-w-3xl mx-auto">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                            placeholder={t('locations.searchPlaceholder')}
                            className="pl-12 h-12 bg-white border-slate-200 shadow-sm rounded-xl w-full text-base focus-visible:ring-amber-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button
                        onClick={handleFindNearest}
                        disabled={isLocating}
                        className="h-12 px-6 rounded-xl bg-[#8b1d2c] hover:bg-[#7a1926] text-white shadow-sm shrink-0 gap-2"
                    >
                        <MapPin className={`h-4 w-4 ${isLocating ? 'animate-pulse' : ''}`} />
                        {isLocating ? 'Locating...' : 'Find Nearest Church'}
                    </Button>
                </div>

                <Tabs defaultValue="assemblies" className="w-full">
                    <div className="flex justify-center mb-8">
                        <TabsList className="grid w-full max-w-xl grid-cols-3 h-auto p-1 bg-slate-100 rounded-xl">
                            <TabsTrigger value="assemblies" className="py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#8b1d2c] data-[state=active]:shadow-sm transition-all font-medium">
                                Local Churches ({assemblies.length})
                            </TabsTrigger>
                            <TabsTrigger value="districts" className="py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#8b1d2c] data-[state=active]:shadow-sm transition-all font-medium">
                                Districts ({districts.length})
                            </TabsTrigger>
                            <TabsTrigger value="provinces" className="py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#8b1d2c] data-[state=active]:shadow-sm transition-all font-medium">
                                Provinces ({provinces.length})
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 items-start">
                        {/* Map - Now visible on mobile, comes first in stack */}
                        <div className="order-1 lg:order-1 w-full h-[300px] lg:h-[600px] lg:sticky lg:top-24 bg-slate-200 rounded-3xl overflow-hidden shadow-sm">
                            <TabsContent value="assemblies" className="m-0 h-full force-mount">
                                <MapWrapper locations={assemblies} userLocation={userLocation} />
                            </TabsContent>
                            <TabsContent value="districts" className="m-0 h-full force-mount">
                                <MapWrapper locations={districts} userLocation={userLocation} />
                            </TabsContent>
                            <TabsContent value="provinces" className="m-0 h-full force-mount">
                                <MapWrapper locations={provinces} userLocation={userLocation} />
                            </TabsContent>
                        </div>

                        {/* List view - Comes second */}
                        <div className="order-2 lg:order-2 w-full">
                            <TabsContent value="assemblies" className="m-0 focus-visible:outline-none">
                                {renderList(assemblies, t('locations.noResults'))}
                            </TabsContent>
                            <TabsContent value="districts" className="m-0 focus-visible:outline-none">
                                {renderList(districts, t('locations.noResults'))}
                            </TabsContent>
                            <TabsContent value="provinces" className="m-0 focus-visible:outline-none">
                                {renderList(provinces, t('locations.noResults'))}
                            </TabsContent>
                        </div>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
