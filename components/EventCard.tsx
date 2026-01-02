"use client";

import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, CheckCircle2 } from "lucide-react";
import { NationalEvent } from "@/types/events";
import { translateDynamicText } from "@/lib/event-translator";
import { cn } from "@/lib/utils";

export function getCategoryStyles(category?: string, isPast?: boolean) {
    if (isPast) return "bg-slate-100 text-slate-400 border-none";
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

    // Translate dynamic fields
    const title = translateDynamicText(event.title, language);
    const category = translateDynamicText(event.category || "Event", language);
    const location = event.location ? translateDynamicText(event.location, language) : (t('events.locationTBA') || "Location TBA");
    const description = translateDynamicText(event.description, language);

    return (
        <div className={cn(
            "bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all flex flex-col md:flex-row relative",
            isPast ? "opacity-60 grayscale bg-slate-50/50" : "hover:shadow-md"
        )}>
            <div className={cn(
                "hidden md:flex flex-col items-center justify-center border-r border-slate-100 shrink-0 text-center transition-all",
                isPast ? "w-20 p-2 bg-slate-100/50" : "w-32 p-6 bg-[#f8fafd]"
            )}>
                <span className={cn("font-bold leading-tight", isPast ? "text-lg text-slate-400" : "text-3xl text-[#8b1d2c]")}>
                    {date.getDate()}
                </span>
                <span className={cn("font-medium uppercase tracking-tighter", isPast ? "text-[10px] text-slate-400" : "text-xs text-slate-500")}>
                    {date.toLocaleDateString(locale, { month: 'short' })}
                </span>
                {!isPast && <span className="text-xs text-slate-400 mt-1">{date.getFullYear()}</span>}
            </div>

            <div className={cn("flex-1 flex flex-col justify-center transition-all", isPast ? "p-3" : "p-8")}>
                <div className="flex items-center gap-3 mb-1">
                    <Badge className={cn("border-none text-[9px] h-4 px-1.5", getCategoryStyles(event.category, isPast))}>
                        {category}
                    </Badge>
                    {isPast && (
                        <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> {t('events.passed') || "Passed"}
                        </span>
                    )}
                </div>

                <h3 className={cn("font-bold leading-tight", isPast ? "text-base text-slate-400" : "text-2xl text-slate-800")}>
                    {title}
                </h3>

                <div className={cn("flex flex-wrap gap-x-4 gap-y-1 mt-2 text-slate-400", isPast ? "text-[11px]" : "text-sm text-slate-500")}>
                    <div className="flex items-center gap-1.5">
                        <Clock className={cn("shrink-0", isPast ? "w-3 h-3" : "w-4 h-4 text-[#8b1d2c]")} />
                        <span>{new Date(event.start_date).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <MapPin className={cn("shrink-0", isPast ? "w-3 h-3" : "w-4 h-4 text-[#8b1d2c]")} />
                        <span>{location}</span>
                    </div>
                </div>

                {/* Only show description for upcoming events to keep past events small */}
                {!isPast && (
                    <p className="mt-4 text-slate-600 text-sm line-clamp-2 max-w-2xl">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}
