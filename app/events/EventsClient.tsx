"use client";

import { useState } from "react";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, List, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { NationalEvent } from "@/types/events";
import { EventCard, getCategoryStyles } from "@/components/EventCard";
import { translateDynamicText } from "@/lib/event-translator";

export function EventsClient({ initialEvents }: { initialEvents: NationalEvent[] }) {
    const { t, language } = useLanguage();
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Filter events based on active category
    const filteredEvents = initialEvents.filter(event => {
        const cat = (event.category || "").toLowerCase();
        const title = (event.title || "").toLowerCase();
        const searchStr = `${cat} ${title}`;

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesSearch = title.includes(query) || cat.includes(query) || (event.description || "").toLowerCase().includes(query);
            if (!matchesSearch) return false;
        }

        if (activeCategory === "all") return true;

        if (activeCategory === "conferences") return searchStr.includes("conference") || searchStr.includes("conferência");
        if (activeCategory === "youth") return searchStr.includes("youth") || searchStr.includes("jovem") || searchStr.includes("jovens");
        if (activeCategory === "training") return searchStr.includes("training") || searchStr.includes("leadership") || searchStr.includes("treinamento") || searchStr.includes("liderança");
        if (activeCategory === "seminars") return searchStr.includes("seminar") || searchStr.includes("seminário");
        if (activeCategory === "executive") return searchStr.includes("executive") || searchStr.includes("executivo") || searchStr.includes("board") || searchStr.includes("directors") || searchStr.includes("direcção");
        if (activeCategory === "workshops") return searchStr.includes("workshop") || searchStr.includes("class") || searchStr.includes("aula");

        return true;
    });

    const now = new Date();
    const upcomingEvents = filteredEvents.filter(e => new Date(e.start_date) >= now);
    const pastEvents = filteredEvents.filter(e => new Date(e.start_date) < now).reverse(); // Most recent past first

    const categories = [
        { id: "all", label: t("events.categories.all") },
        { id: "conferences", label: t("events.categories.conferences") },
        { id: "executive", label: t("events.categories.executive") },
        { id: "seminars", label: t("events.categories.seminars") },
        { id: "training", label: t("events.categories.training") },
        { id: "workshops", label: t("events.categories.workshops") },
        { id: "youth", label: t("events.categories.youth") },
    ].sort((a, b) => {
        if (a.id === "all") return -1;
        if (b.id === "all") return 1;
        return a.label.localeCompare(b.label);
    });

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

            <div className="container mx-auto max-w-5xl py-12 px-4">

                {/* Search Bar */}
                <div className="relative max-w-md mx-auto mb-8">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder={t('events.searchPlaceholder') || "Search events..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-full leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8b1d2c] focus:border-transparent transition-shadow shadow-sm"
                    />
                </div>

                {/* Visual Category Filter */}
                <div className="mb-12 overflow-x-auto pb-4 scrollbar-hide">
                    <div className="flex justify-start md:justify-center gap-2 md:gap-3 min-w-max px-2">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`
                                    px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border
                                    ${activeCategory === cat.id
                                        ? 'bg-[#8b1d2c] text-white border-[#8b1d2c] shadow-md transform scale-105'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-[#8b1d2c] hover:text-[#8b1d2c]'}
                                `}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

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
                                    <EventCard key={event.id} event={event} language={language} t={t} />
                                ))
                            ) : (
                                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
                                    <p className="text-slate-500 mb-2 font-medium">{t('events.noUpcoming') || "No events found."}</p>
                                    <p className="text-sm text-slate-400">Try selecting a different category.</p>
                                </div>
                            )}
                        </div>

                        {/* Past Events Section */}
                        {pastEvents.length > 0 && (
                            <div className="space-y-6 pt-8 border-t border-slate-200">
                                <h2 className="text-2xl font-bold text-slate-800">{t('events.pastEvents') || "Past Events"}</h2>
                                <div className="opacity-80 grayscale-[0.3] hover:grayscale-0 transition-all duration-300 space-y-6">
                                    {pastEvents.map((event) => (
                                        <EventCard key={event.id} event={event} language={language} t={t} isPast />
                                    ))}
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="calendar">
                        <CalendarView
                            events={filteredEvents}
                            language={language}
                            t={t}
                            getCategoryStyles={getCategoryStyles}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

function CalendarView({ events, language, t, getCategoryStyles }: any) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    // Helper: Get days in month
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    // Helper: Get start day of week (0 = Sunday)
    const getStartDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const startDay = getStartDayOfMonth(year, month);

    const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

    // Get events for specific date
    const getEventsForDate = (day: number) => {
        return events.filter((e: NationalEvent) => {
            const eDate = new Date(e.start_date);
            return eDate.getDate() === day && eDate.getMonth() === month && eDate.getFullYear() === year;
        });
    };

    // Events for the selected date detail view
    const selectedEvents = selectedDate
        ? events.filter((e: NationalEvent) => {
            const eDate = new Date(e.start_date);
            return eDate.getDate() === selectedDate.getDate() &&
                eDate.getMonth() === selectedDate.getMonth() &&
                eDate.getFullYear() === selectedDate.getFullYear();
        })
        : [];

    const monthNames = language === 'pt'
        ? ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
        : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const weekDays = language === 'pt'
        ? ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
        : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-bold text-slate-800">
                        {monthNames[month]} {year}
                    </h2>
                    <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Grid */}
                <div className="p-6">
                    <div className="grid grid-cols-7 mb-4">
                        {weekDays.map(day => (
                            <div key={day} className="text-center text-sm font-medium text-slate-400 py-2">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1 md:gap-2">
                        {Array.from({ length: startDay }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square" />
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const dayEvents = getEventsForDate(day);
                            const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === month && selectedDate?.getFullYear() === year;
                            const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;

                            return (
                                <button
                                    key={day}
                                    onClick={() => setSelectedDate(new Date(year, month, day))}
                                    className={`
                                        min-h-[100px] md:min-h-[120px] rounded-xl flex flex-col items-stretch justify-start p-1.5 relative border transition-all text-left group
                                        ${isSelected ? 'bg-white border-[#8b1d2c] ring-2 ring-[#8b1d2c] ring-offset-2 z-10' :
                                            isToday ? 'bg-amber-50/50 border-amber-200' : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50'}
                                    `}
                                >
                                    <span className={`
                                        text-sm font-semibold mb-1 ml-1 w-7 h-7 flex items-center justify-center rounded-full
                                        ${isSelected ? 'bg-[#8b1d2c] text-white' : isToday ? 'bg-amber-100 text-amber-700' : 'text-slate-700'}
                                    `}>
                                        {day}
                                    </span>

                                    {/* Event Names */}
                                    <div className="flex flex-col gap-1 w-full flex-1">
                                        {dayEvents.map((ev: NationalEvent, idx: number) => {
                                            if (idx > 2) return null; // Limit to 3 items

                                            // Determine styles
                                            const isYouth = ev.category?.toLowerCase().includes("youth");
                                            const isTraining = ev.category?.toLowerCase().includes("training");

                                            const bgClass = isYouth ? 'bg-blue-100 text-blue-700' :
                                                isTraining ? 'bg-amber-100 text-amber-700' :
                                                    'bg-red-50 text-[#8b1d2c]';

                                            return (
                                                <div key={ev.id} className={`px-1.5 py-0.5 rounded text-[10px] md:text-xs font-medium truncate w-full ${bgClass}`}>
                                                    {translateDynamicText(ev.title, language)}
                                                </div>
                                            );
                                        })}
                                        {dayEvents.length > 3 && (
                                            <span className="text-[10px] text-slate-400 pl-1">
                                                +{dayEvents.length - 3} {t('events.more')}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Selected Date Details */}
            {selectedDate && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-px bg-slate-200 flex-1" />
                        <span className="text-slate-400 font-medium text-sm uppercase tracking-widest">
                            {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                        </span>
                        <div className="h-px bg-slate-200 flex-1" />
                    </div>

                    {selectedEvents.length > 0 ? (
                        <div className="space-y-4">
                            {selectedEvents.map((event: NationalEvent) => (
                                <EventCard key={event.id} event={event} language={language} t={t} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            <p className="text-slate-400 italic">{t('events.noEventsOnDate') || "No events scheduled for this date."}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
