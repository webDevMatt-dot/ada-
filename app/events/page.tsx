"use client";

import { Calendar, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";

const EVENTS = [
    {
        id: 1,
        title: "Sunday Divine Service",
        date: "2025-01-05",
        time: "09:00 AM - 12:00 PM",
        location: "Maputo Central Assembly",
        description: "Join us for a powerful time of worship and the Word. Bring your family and friends!",
        category: "Worship"
    },
    {
        id: 2,
        title: "Youth Night Vigil",
        date: "2025-01-10",
        time: "10:00 PM - 04:00 AM",
        location: "ADA Matola",
        description: "An intense night of prayer and seeking God's face for the youth generation.",
        category: "Youth"
    },
    {
        id: 3,
        title: "Leadership Summit",
        date: "2025-01-25",
        time: "08:30 AM - 04:00 PM",
        location: "Main Auditorium, Maputo",
        description: "Equipping leaders for the next season of ministry. Registration required.",
        category: "Leadership"
    },
    {
        id: 4,
        title: "Community Outreach",
        date: "2025-02-01",
        time: "09:00 AM - 01:00 PM",
        location: "Xai-Xai Center",
        description: "Serving our community with food distribution and medical assistance.",
        category: "Outreach"
    }
];

export default function Events() {
    const { t, language } = useLanguage();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Hero Section */}
            <div className="relative h-[400px] w-full flex flex-col items-center justify-center text-center px-4 mb-16">
                {/* Background Image/Overlay */}
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

                {/* Content */}
                <div className="relative z-10 max-w-3xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="h-1 w-12 rounded-full bg-amber-500" />
                        <span className="text-xs font-medium uppercase tracking-wider text-amber-500">{t('events.upcoming')}</span>
                        <div className="h-1 w-12 rounded-full bg-amber-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
                        {t('events.heroTitle')}
                    </h1>
                    <p className="text-lg text-slate-200 font-light max-w-2xl mx-auto">
                        {t('events.heroSubtitle')}
                    </p>
                </div>
            </div>

            {/* Application */}
            <div className="container mx-auto max-w-5xl py-16 px-4">
                <div className="grid gap-6">
                    {EVENTS.map((event) => {
                        const dateObj = new Date(event.date);
                        const day = dateObj.getDate();
                        const locale = language === 'pt' ? 'pt-PT' : 'en-US';
                        const month = dateObj.toLocaleDateString(locale, { month: 'short' });

                        return (
                            <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col md:flex-row">
                                {/* Date Badge (Desktop) */}
                                <div className="hidden md:flex flex-col items-center justify-center bg-[#f8fafd] w-32 p-6 border-r border-slate-100 shrink-0 text-center">
                                    <span className="text-3xl font-bold text-[#8b1d2c]">{day}</span>
                                    <span className="text-slate-500 font-medium uppercase tracking-wider">{month}</span>
                                </div>

                                <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="space-y-1">
                                            {/* Mobile Date */}
                                            <div className="md:hidden flex items-center gap-2 text-[#8b1d2c] font-bold mb-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>{dateObj.toLocaleDateString(locale, { weekday: 'short', month: 'long', day: 'numeric' })}</span>
                                            </div>

                                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-none mb-2">
                                                {event.category}
                                            </Badge>
                                            <h3 className="text-2xl font-bold text-slate-800">{event.title}</h3>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-slate-500 mb-6">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-[#8b1d2c]" />
                                            <span>{event.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-[#8b1d2c]" />
                                            <span>{event.location} - {t('events.location')}</span>
                                        </div>
                                    </div>

                                    <p className="text-slate-600 mb-6">{event.description}</p>

                                    <div className="flex gap-4">
                                        <Button className="bg-[#8b1d2c] hover:bg-[#6d1722] text-white">
                                            {t('home.learnMore')}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
