"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";

import { useEffect, useState } from "react";

interface HistoryEvent {
    id: number;
    year: number;
    title: string;
    description: string;
}

export default function HistoryPage() {
    const { t } = useLanguage();
    const [events, setEvents] = useState<HistoryEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch(`/api/history/`);
                if (response.ok) {
                    const data = await response.json();
                    setEvents(data);
                }
            } catch (error) {
                console.error("Failed to fetch history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Hero Section */}
            <div className="relative h-[400px] w-full flex flex-col items-center justify-center text-center px-4">
                {/* Background Image/Overlay */}
                <div className="absolute inset-0 z-0 bg-slate-900">
                    <Image
                        src="/hero.png"
                        alt="History Background"
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
                        <span className="text-xs font-medium uppercase tracking-wider text-amber-500">{t('history.badge')}</span>
                        <div className="h-1 w-12 rounded-full bg-amber-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
                        {t('history.heroTitle')}
                    </h1>
                    <p className="text-lg text-slate-200 font-light max-w-2xl mx-auto">
                        {t('history.heroSubtitle')}
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto max-w-4xl px-4 py-16 space-y-16">

                {/* Intro */}
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-800 font-serif">{t('history.title')}</h2>
                    <p className="text-slate-600 leading-relaxed text-lg">
                        {t('history.description')}
                    </p>
                </div>

                {/* Timeline */}
                <div className="relative border-l-2 border-slate-200 ml-4 md:ml-0 md:pl-0 space-y-12">
                    {loading ? (
                        <div className="text-center text-slate-500">Loading history...</div>
                    ) : (
                        events.map((item, index) => {
                            const isEven = index % 2 === 0;
                            // Colors for dots/badges - can be cycled or random, using the existing ones for now
                            const colors = [
                                { dot: 'bg-[#8b1d2c]', text: 'text-[#8b1d2c]', border: 'border-[#8b1d2c]/20', bgText: 'text-[#8b1d2c]/20' },
                                { dot: 'bg-[#c29c21]', text: 'text-[#c29c21]', border: 'border-[#c29c21]/20', bgText: 'text-[#c29c21]/20' },
                                { dot: 'bg-slate-300', text: 'text-slate-500', border: 'border-slate-500/20', bgText: 'text-slate-200' }
                            ];
                            const color = colors[index % colors.length];

                            return (
                                <div key={item.id} className="relative flex flex-col md:flex-row md:items-center gap-6 md:gap-12 pl-8 md:pl-0">
                                    {/* Left Side (Desktop) */}
                                    <div className={`
                                        ${isEven
                                            ? 'absolute left-[-9px] top-0 md:static md:w-1/2 md:text-right md:pr-12'
                                            : 'flex flex-col md:block md:w-1/2 md:text-right md:pr-12 order-2 md:order-1'
                                        }
                                    `}>
                                        {isEven ? (
                                            <span className={`hidden md:inline-block text-4xl font-bold ${color.bgText}`}>{item.year}</span>
                                        ) : (
                                            <div className="md:w-full space-y-2">
                                                <h3 className="text-xl font-bold text-slate-800">{item.title}</h3>
                                                <p className="text-slate-600">{item.description}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Center Dot */}
                                    <div className={`absolute left-[-9px] top-2 md:left-1/2 md:-ml-[9px] h-4 w-4 rounded-full ${color.dot} border-2 border-white shadow-sm z-10`} />

                                    {/* Right Side (Desktop) */}
                                    <div className={`
                                        md:w-1/2 md:pl-12 space-y-2
                                        ${!isEven ? 'order-1 md:order-2' : ''}
                                    `}>
                                        {isEven ? (
                                            <>
                                                <Badge variant="outline" className={`md:hidden mb-2 ${color.text} ${color.border}`}>{item.year}</Badge>
                                                <h3 className="text-xl font-bold text-slate-800">{item.title}</h3>
                                                <p className="text-slate-600">{item.description}</p>
                                            </>
                                        ) : (
                                            <>
                                                <span className={`hidden md:inline-block text-4xl font-bold ${color.bgText}`}>{item.year}</span>
                                                <Badge variant="outline" className={`md:hidden mb-2 ${color.text} ${color.border}`}>{item.year}</Badge>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

            </div>
        </div>
    );
}
