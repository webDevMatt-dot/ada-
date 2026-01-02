"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { NationalEvent } from "@/types/events";
import { EventCard } from "@/components/EventCard";

export function HomeEvents({ events }: { events: NationalEvent[] }) {
    const { t, language } = useLanguage();

    // Filter only upcoming
    const upcoming = events
        .filter(e => new Date(e.start_date) >= new Date())
        .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
        .slice(0, 3); // Take top 3

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
                            {t('events.nationalPlan') || "National Plan 2026"}
                        </h2>
                    </div>

                    <Link href="/events">
                        <Button className="hidden md:flex gap-2 bg-[#8b1d2c] hover:bg-[#6d1722] text-white rounded-full px-8">
                            {t('events.viewAll') || "View All Events"} <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>

                <div className="space-y-6">
                    {upcoming.map(event => (
                        <EventCard key={event.id} event={event} language={language} t={t} />
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link href="/events">
                        <Button className="w-full gap-2 bg-[#8b1d2c] hover:bg-[#6d1722] text-white rounded-full">
                            {t('events.viewAll') || "View All Events"} <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
