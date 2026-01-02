"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { NationalEvent } from "@/types/events";
import { EventCard } from "@/components/EventCard";

export function HomeEvents({ events }: { events: NationalEvent[] }) {
    const { t, language } = useLanguage();
    const [startIndex, setStartIndex] = useState(0);
    const ITEMS_PER_PAGE = 3;

    // Filter only upcoming
    const upcoming = events
        .filter(e => new Date(e.start_date) >= new Date())
        .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

    const visibleEvents = upcoming.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const hasNext = startIndex + ITEMS_PER_PAGE < upcoming.length;
    const hasPrev = startIndex > 0;

    const nextEvents = () => {
        if (hasNext) setStartIndex(prev => prev + ITEMS_PER_PAGE);
    };

    const prevEvents = () => {
        if (hasPrev) setStartIndex(prev => prev - ITEMS_PER_PAGE);
    };

    if (upcoming.length === 0) return null;

    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8b1d2c]/10 text-[#8b1d2c] text-xs font-bold uppercase tracking-wider mb-4">
                            <Calendar className="w-3 h-3" />
                            {t('events.upcoming') || "Upcoming Events"}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                            {t('events.nationalPlan') || "Events"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Navigation Buttons */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={prevEvents}
                                disabled={!hasPrev}
                                className="rounded-full h-10 w-10 border-slate-200 text-slate-600 hover:text-[#8b1d2c] hover:border-[#8b1d2c] disabled:opacity-30"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={nextEvents}
                                disabled={!hasNext}
                                className="rounded-full h-10 w-10 border-slate-200 text-slate-600 hover:text-[#8b1d2c] hover:border-[#8b1d2c] disabled:opacity-30"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </div>

                        <Link href="/events" className="hidden md:block">
                            <Button className="flex gap-2 bg-[#8b1d2c] hover:bg-[#6d1722] text-white rounded-full px-8">
                                {t('events.viewAll') || "View All"} <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="space-y-6">
                    {visibleEvents.map(event => (
                        <EventCard key={event.id} event={event} language={language} t={t} />
                    ))}
                </div>

                {/* Bottom Navigation Buttons */}
                <div className="flex justify-center mt-8 gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={prevEvents}
                        disabled={!hasPrev}
                        className="rounded-full h-10 w-10 border-slate-200 text-slate-600 hover:text-[#8b1d2c] hover:border-[#8b1d2c] disabled:opacity-30"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={nextEvents}
                        disabled={!hasNext}
                        className="rounded-full h-10 w-10 border-slate-200 text-slate-600 hover:text-[#8b1d2c] hover:border-[#8b1d2c] disabled:opacity-30"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link href="/events">
                        <Button className="w-full gap-2 bg-[#8b1d2c] hover:bg-[#6d1722] text-white rounded-full">
                            {t('events.viewAll') || "View All"} <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
