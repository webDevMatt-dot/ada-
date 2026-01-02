"use client";

import { useState } from "react";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, List, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";

export interface NationalEvent {
    id: number;
    title: string;
    category?: string;
    start_date: string;
    end_date?: string;
    location?: string;
    description?: string;
    is_national?: boolean;
}

export default function EventsClient({ initialEvents }: { initialEvents: NationalEvent[] }) {
    const { t, language } = useLanguage();

    // Logic for assigning colors based on category
    const getCategoryStyles = (category?: string) => {
        if (!category) return "bg-slate-100 text-slate-700";
        const normalized = category.toLowerCase();
        if (normalized.includes("youth")) return "bg-blue-100 text-blue-700";
        if (normalized.includes("training")) return "bg-amber-100 text-amber-700";
        if (normalized.includes("worship")) return "bg-purple-100 text-purple-700";
        if (normalized.includes("conference")) return "bg-red-100 text-[#8b1d2c]";
        return "bg-slate-100 text-slate-700";
    };

    const now = new Date();
    const upcomingEvents = initialEvents.filter(e => new Date(e.start_date) >= now);
    const pastEvents = initialEvents.filter(e => new Date(e.start_date) < now).reverse(); // Most recent past first

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Hero Section (Moved here for Translation Support) */}
            <div className="relative h-[400px] w-full flex flex-col items-center justify-center text-center px-4 mb-0">
                <div className="absolute inset-0 z-0 bg-slate-900">
                    <Image
                        src="/hero.png"
                        alt="Events Background"
                        fill
                        className="object-cover opacity-40 mix-blend-overlay"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900/90" />
                </div>

                <div className="relative z-10 max-w-3xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="h-1 w-12 rounded-full bg-amber-500" />
                        <span className="text-xs font-medium uppercase tracking-wider text-amber-500">{t('events.upcoming')}</span>
                        <div className="h-1 w-12 rounded-full bg-amber-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
                        {t('events.nationalPlan')}
                    </h1>
                    <p className="text-lg text-slate-200 font-light max-w-2xl mx-auto">
                        {t('events.nationalPlanDesc')}
                    </p>
                </div>
            </div>

            <div className="container mx-auto max-w-5xl py-16 px-4">
                <Tabs defaultValue="list" className="w-full">
                    <div className="flex justify-center mb-8">
                        <TabsList className="bg-white border shadow-sm rounded-xl p-1 h-auto">
                            <TabsTrigger value="list" className="gap-2 rounded-lg px-6 py-2 data-[state=active]:bg-[#1e293b] data-[state=active]:text-white transition-all">
                                <List className="w-4 h-4" /> {t('events.listView')}
                            </TabsTrigger>
                            <TabsTrigger value="calendar" className="gap-2 rounded-lg px-6 py-2 data-[state=active]:bg-[#1e293b] data-[state=active]:text-white transition-all">
                                <Calendar className="w-4 h-4" /> {t('events.calendarView')}
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="list" className="space-y-12">

                        {/* Upcoming Events Section */}
                        <div className="space-y-6">
                            {upcomingEvents.length > 0 ? (
                                upcomingEvents.map((event) => (
                                    <EventCard key={event.id} event={event} language={language} t={t} getCategoryStyles={getCategoryStyles} />
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                                    <p className="text-slate-400">{t('events.noUpcoming') || "No upcoming events found."}</p>
                                </div>
                            )}
                        </div>

                        {/* Past Events Section */}
                        {pastEvents.length > 0 && (
                            <div className="space-y-6 pt-8 border-t border-slate-200">
                                <h2 className="text-2xl font-bold text-slate-800">{t('events.pastEvents') || "Past Events"}</h2>
                                <div className="opacity-80 grayscale-[0.3] hover:grayscale-0 transition-all duration-300 space-y-6">
                                    {pastEvents.map((event) => (
                                        <EventCard key={event.id} event={event} language={language} t={t} getCategoryStyles={getCategoryStyles} isPast />
                                    ))}
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="calendar">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 min-h-[400px] flex items-center justify-center italic text-slate-400">
                            {t('events.calendarIntegration')}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

function EventCard({ event, language, t, getCategoryStyles, isPast }: any) {
    const date = new Date(event.start_date);
    const locale = language === 'pt' ? 'pt-PT' : 'en-US';

    return (
        <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all flex flex-col md:flex-row ${isPast ? 'bg-slate-50' : ''}`}>
            <div className={`hidden md:flex flex-col items-center justify-center w-32 p-6 border-r border-slate-100 shrink-0 text-center ${isPast ? 'bg-slate-100' : 'bg-[#f8fafd]'}`}>
                <span className={`text-3xl font-bold ${isPast ? 'text-slate-500' : 'text-[#8b1d2c]'}`}>{date.getDate()}</span>
                <span className="text-slate-500 font-medium uppercase tracking-wider">
                    {date.toLocaleDateString(locale, { month: 'short' })}
                </span>
                <span className="text-xs text-slate-400 mt-1">{date.getFullYear()}</span>
            </div>
            <div className="p-8 flex-1">
                <div className="flex justify-between items-start">
                    <Badge className={`mb-3 border-none ${getCategoryStyles(event.category)}`}>
                        {event.category || "Event"}
                    </Badge>
                    {isPast && <Badge className="bg-slate-200 text-slate-600 hover:bg-slate-200" variant="secondary">{t('events.past') || "Past"}</Badge>}
                </div>

                <h3 className={`text-2xl font-bold mb-4 ${isPast ? 'text-slate-600' : 'text-slate-800'}`}>{event.title}</h3>
                <div className="flex flex-col sm:flex-row gap-4 text-slate-500 mb-4">
                    <div className="flex items-center gap-2">
                        <Clock className={`w-4 h-4 ${isPast ? 'text-slate-400' : 'text-[#8b1d2c]'}`} />
                        <span>{new Date(event.start_date).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className={`w-4 h-4 ${isPast ? 'text-slate-400' : 'text-[#8b1d2c]'}`} />
                        <span>{event.location || t('events.locationTBA') || "Location TBA"}</span>
                    </div>
                </div>
                <p className="text-slate-600 mb-6 line-clamp-3">{event.description}</p>
            </div>
        </div>
    );
}
