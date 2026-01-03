"use client";

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, User, ArrowRight, Rss, Search } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext";

export default function UpdatesPage() {
    const { t, language } = useLanguage();
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [updates, setUpdates] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                const res = await fetch("/api/updates");
                if (res.ok) {
                    const data = await res.json();
                    setUpdates(data);
                }
            } catch (error) {
                console.error("Failed to fetch updates", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUpdates();
    }, []);

    const categoriesList = [
        "All",
        "Videos",
        "Announcements",
        "Newsletters",
        "Gallery",
        "Apostle's Update"
    ];

    // Map internal categories to translated categories for display
    const getCategoryLabel = (category: string) => {
        if (category === "apostle") return t('updates.categories.apostle');
        if (category === "newsletter") return t('updates.categories.newsletters');
        if (category === "announcement") return t('updates.categories.announcements');
        if (category === "video") return t('updates.categories.videos');
        if (category === "gallery") return t('updates.categories.gallery');
        // Capitalize first letter for fallback
        return category.charAt(0).toUpperCase() + category.slice(1);
    }

    // Helper to map DB categories to the tab values
    const mapDbCategoryToTab = (dbCategory: string) => {
        if (dbCategory === 'video') return 'Videos';
        if (dbCategory === 'announcement') return 'Announcements';
        if (dbCategory === 'newsletter') return 'Newsletters';
        if (dbCategory === 'gallery') return 'Gallery';
        if (dbCategory === 'apostle') return "Apostle's Update";
        return 'All';
    }

    // Filter items based on search query AND category
    const filteredUpdates = updates.filter(update => {
        const categoryTab = mapDbCategoryToTab(update.category);

        const matchesSearch =
            update.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            update.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            update.category.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesCategory = selectedCategory === "All" || categoryTab === selectedCategory;

        return matchesSearch && matchesCategory
    })

    // Get the latest update as featured
    const featuredUpdate = filteredUpdates.length > 0 ? filteredUpdates[0] : null;
    // The rest of the updates
    const remainingUpdates = filteredUpdates.length > 0 ? filteredUpdates.slice(1) : [];

    return (
        <div className="min-h-screen flex flex-col bg-[#f8fafd]">
            {/* Hero Section */}
            <div className="relative h-[400px] w-full flex flex-col items-center justify-center text-center px-4">
                <div className="absolute inset-0 z-0 bg-slate-900">
                    <Image
                        src="/hero.png"
                        alt="Background"
                        fill
                        className="object-cover opacity-40 mix-blend-overlay"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900/90" />
                </div>

                <div className="relative z-10 max-w-3xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="h-1 w-12 rounded-full bg-amber-500" />
                        <span className="text-xs font-medium uppercase tracking-wider text-amber-500">{t('updates.badge')}</span>
                        <div className="h-1 w-12 rounded-full bg-amber-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
                        {t('updates.heroTitle')}
                    </h1>
                    <p className="text-lg text-slate-200 font-light">
                        {t('updates.heroSubtitle')}
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto py-12 px-4">
                <div className="max-w-6xl mx-auto space-y-10">

                    {/* Search and Filters */}
                    <div className="space-y-6">
                        {/* Search Bar */}
                        <div className="relative max-w-2xl mx-auto">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Search className="h-5 w-5" />
                            </div>
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t('updates.searchPlaceholder')}
                                className="pl-12 h-14 bg-white border-slate-200 shadow-sm text-lg focus-visible:ring-amber-500"
                            />
                        </div>

                        {/* Category Pills (Tabs) */}
                        <div className="flex justify-center pb-2">
                            <Tabs defaultValue="All" onValueChange={setSelectedCategory} className="w-auto">
                                <TabsList className="bg-white border border-slate-100 p-1 h-auto shadow-sm gap-1 inline-flex flex-wrap justify-center rounded-lg">
                                    {categoriesList.map((categoryKey) => {
                                        let label = categoryKey;
                                        if (categoryKey === 'All') label = t('updates.categories.all');
                                        else if (categoryKey === 'Videos') label = t('updates.categories.videos');
                                        else if (categoryKey === 'Announcements') label = t('updates.categories.announcements');
                                        else if (categoryKey === 'Newsletters') label = t('updates.categories.newsletters');
                                        else if (categoryKey === 'Gallery') label = t('updates.categories.gallery');
                                        else if (categoryKey === "Apostle's Update") label = t('updates.categories.apostle');

                                        return (
                                            <TabsTrigger
                                                key={categoryKey}
                                                value={categoryKey}
                                                className="px-4 py-2 rounded-md text-slate-600 data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all font-medium"
                                            >
                                                {label}
                                            </TabsTrigger>
                                        )
                                    })}
                                </TabsList>
                            </Tabs>
                        </div>
                    </div>

                    <div className="space-y-16">

                        {/* Featured Update */}
                        {featuredUpdate && (
                            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <Rss className="h-5 w-5 text-amber-500" /> {t('updates.featured')}
                                </h2>
                                <div className="group relative bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 lg:h-[400px]">
                                    <div className="relative h-[300px] md:h-full w-full overflow-hidden">
                                        <Image
                                            src={featuredUpdate.image || "/hero.png"}
                                            alt={featuredUpdate.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                                    </div>
                                    <div className="p-8 md:p-12 flex flex-col justify-center relative bg-white">
                                        <div className="mb-4">
                                            <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-none">
                                                {getCategoryLabel(featuredUpdate.category)}
                                            </Badge>
                                        </div>
                                        <h3 className="text-3xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-primary transition-colors">
                                            {featuredUpdate.title}
                                        </h3>
                                        <p className="text-slate-600 text-lg mb-6 leading-relaxed line-clamp-3">
                                            {featuredUpdate.description}
                                        </p>
                                        <div className="mt-auto flex items-center justify-between border-t pt-6">
                                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" /> {new Date(featuredUpdate.created_at).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <User className="h-4 w-4" /> {featuredUpdate.team || "HQ"}
                                                </span>
                                            </div>
                                            <Button variant="ghost" className="text-primary hover:text-primary/80 p-0 font-semibold group-hover:translate-x-1 transition-transform">
                                                {t('updates.readStory')} <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Recent Updates Grid (or Search Results) */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-8">
                                {searchQuery ? `${t('updates.searchResults')} (${remainingUpdates.length})` : t('updates.recentNews')}
                            </h2>

                            {remainingUpdates.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {remainingUpdates.map((update, index) => (
                                        <Card key={index} className="border-none shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col h-full bg-white">
                                            <div className="relative h-48 w-full overflow-hidden">
                                                <Image
                                                    src={update.image || "/hero.png"}
                                                    alt={update.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute top-4 left-4">
                                                    <Badge className="bg-white/90 text-slate-900 backdrop-blur-sm shadow-sm hover:bg-white">
                                                        {getCategoryLabel(update.category)}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <CardContent className="flex-1 p-6">
                                                <div className="flex items-center gap-2 text-xs text-slate-400 mb-3 font-medium uppercase tracking-wider">
                                                    <span>{new Date(update.created_at).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span>{update.team || "HQ"}</span>
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                                    {update.title}
                                                </h3>
                                                <p className="text-slate-600 leading-relaxed text-sm line-clamp-3">
                                                    {update.description}
                                                </p>
                                            </CardContent>
                                            <CardFooter className="p-6 pt-0 mt-auto">
                                                <Button variant="link" className="text-primary p-0 h-auto font-semibold group-hover:translate-x-1 transition-transform">
                                                    {t('updates.readMore')} <ArrowRight className="ml-1 h-3 w-3" />
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
                                    <p className="text-slate-500 text-lg">{t('updates.noResults')}</p>
                                    {searchQuery && (
                                        <Button
                                            variant="link"
                                            onClick={() => setSearchQuery("")}
                                            className="mt-2 text-primary"
                                        >
                                            {t('updates.clearSearch')}
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pagination Placeholder - Hide if searching or filtered */}
                    {!searchQuery && selectedCategory === "All" && (
                        <div className="flex justify-center pt-8">
                            <Button variant="outline" size="lg" className="border-slate-200 text-slate-600 hover:text-primary hover:border-primary">
                                {t('updates.loadMore')}
                            </Button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

