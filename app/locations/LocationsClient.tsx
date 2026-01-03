"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { MapPin, User, Phone, Search, Building2 } from "lucide-react"
import MapWrapper from "@/components/MapWrapper"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/context/LanguageContext"

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
    const [searchQuery, setSearchQuery] = useState("")
    const { t } = useLanguage();

    // Filter all locations based on search query first
    const searchFiltered = useMemo(() => {
        if (!searchQuery) return locations;
        const query = searchQuery.toLowerCase();
        return locations.filter(loc =>
            loc.name.toLowerCase().includes(query) ||
            (loc.leader_name && loc.leader_name.toLowerCase().includes(query)) ||
            (loc.address && loc.address.toLowerCase().includes(query)) ||
            (loc.leader_phone && loc.leader_phone.toLowerCase().includes(query))
        );
    }, [locations, searchQuery]);

    // Split into categories
    const provinces = useMemo(() => searchFiltered.filter(l => l.type === "Province"), [searchFiltered]);
    const districts = useMemo(() => searchFiltered.filter(l => l.type === "District"), [searchFiltered]);
    const assemblies = useMemo(() => searchFiltered.filter(l => l.type === "Assembly"), [searchFiltered]);

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

        // Group items by province
        const groupedItems = items.reduce((groups, item) => {
            const province = item.province || "Other";
            if (!groups[province]) {
                groups[province] = [];
            }
            groups[province].push(item);
            return groups;
        }, {} as Record<string, ApiLocation[]>);

        // Sort provinces alphabetically
        const sortedProvinces = Object.keys(groupedItems).sort();

        return (
            <div className="space-y-8">
                {sortedProvinces.map((province) => (
                    <div key={province} className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-800 px-1 border-b border-slate-200 pb-2">
                            {province}
                        </h3>
                        <div className="space-y-4">
                            {groupedItems[province].sort((a, b) => a.name.localeCompare(b.name)).map((loc) => (
                                <div
                                    key={loc.id}
                                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-50 hover:shadow-md transition-all flex gap-6 group"
                                >
                                    <div className="bg-slate-50 p-4 rounded-xl h-fit shrink-0">
                                        <div className="bg-white p-2 rounded-lg shadow-sm border border-[#8b1d2c]/10 group-hover:border-[#8b1d2c] transition-colors">
                                            <MapPin className="h-6 w-6 text-[#8b1d2c]" />
                                        </div>
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
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
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

            <div className="container mx-auto max-w-7xl space-y-8 py-10 px-4">
                {/* Search Bar */}
                <div className="relative w-full max-w-2xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                        placeholder={t('locations.searchPlaceholder')}
                        className="pl-12 h-14 bg-white border-slate-200 shadow-sm rounded-2xl w-full text-lg focus-visible:ring-amber-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* sticky map matching current tab selection */}
                        <div className="hidden lg:block sticky top-24 h-[600px] bg-slate-200 rounded-3xl overflow-hidden shadow-sm">
                            <TabsContent value="assemblies" className="m-0 h-full force-mount">
                                <MapWrapper locations={assemblies} />
                            </TabsContent>
                            <TabsContent value="districts" className="m-0 h-full force-mount">
                                <MapWrapper locations={districts} />
                            </TabsContent>
                            <TabsContent value="provinces" className="m-0 h-full force-mount">
                                <MapWrapper locations={provinces} />
                            </TabsContent>
                        </div>

                        {/* List view */}
                        <div>
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
