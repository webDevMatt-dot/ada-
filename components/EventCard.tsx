"use client";

import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";
import { NationalEvent } from "@/types/events";

export function getCategoryStyles(category?: string) {
    if (!category) return "bg-slate-100 text-slate-700";
    const normalized = category.toLowerCase();
    if (normalized.includes("youth")) return "bg-blue-100 text-blue-700";
    if (normalized.includes("training")) return "bg-amber-100 text-amber-700";
    if (normalized.includes("worship")) return "bg-purple-100 text-purple-700";
    if (normalized.includes("conference")) return "bg-red-100 text-[#8b1d2c]";
    return "bg-slate-100 text-slate-700";
}

interface EventCardProps {
    event: NationalEvent;
    language: string;
    t: (key: string) => string;
    isPast?: boolean;
}

export function EventCard({ event, language, t, isPast }: EventCardProps) {
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
