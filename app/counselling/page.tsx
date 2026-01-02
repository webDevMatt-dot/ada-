"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Calendar, MessageCircle } from "lucide-react";
import CounsellingClient from "./CounsellingClient";
import { useLanguage } from "@/context/LanguageContext";

export default function CounsellingPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Hero Section */}
            <div className="relative h-[400px] w-full flex flex-col items-center justify-center text-center px-4">
                {/* Background Image/Overlay */}
                <div className="absolute inset-0 z-0 bg-slate-900">
                    <Image
                        src="/hero.png"
                        alt="Counselling Background"
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
                        <span className="text-xs font-medium uppercase tracking-wider text-amber-500">{t('nav.counselling')}</span>
                        <div className="h-1 w-12 rounded-full bg-amber-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
                        {t('counselling.heroTitle')}
                    </h1>
                    <p className="text-lg text-slate-200 font-light max-w-2xl mx-auto">
                        {t('counselling.heroSubtitle')}
                    </p>
                </div>
            </div>

            {/* Top Content Section */}
            <div className="container mx-auto max-w-6xl px-4 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">

                    {/* Left: Text & Buttons (No Border) */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-800 mb-6">{t('counselling.introTitle')}</h2>
                            <p className="text-slate-600 leading-relaxed text-lg mb-4">
                                {t('counselling.introText1')}
                            </p>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                {t('counselling.introText2')}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button asChild size="lg" className="bg-[#8b1d2c] hover:bg-[#6d1722] text-white px-8">
                                <a href="#appointment-form">{t('counselling.scheduleBtn')}</a>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-[#8b1d2c]">
                                <a href="tel:+258841234567">{t('counselling.callBtn')}</a>
                            </Button>
                        </div>
                    </div>

                    {/* Right: Contact Card (Card Style) */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                        {/* Decorative accent top */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8b1d2c] to-amber-500" />

                        <h3 className="text-xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">{t('counselling.contactStatsTitle')}</h3>
                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="bg-amber-50 h-10 w-10 rounded-lg flex items-center justify-center text-amber-600 shrink-0">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-bold text-slate-800">{t('counselling.careLine')}</p>
                                    <p className="text-slate-600 font-mono text-sm">+258 84 123 4567</p>
                                    <p className="text-xs text-slate-400 mt-1">{t('counselling.careLineHours')}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-[#8b1d2c]/10 h-10 w-10 rounded-lg flex items-center justify-center text-[#8b1d2c] shrink-0">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-bold text-slate-800">{t('counselling.emailSupport')}</p>
                                    <p className="text-slate-600 font-medium">counselling@ada.org.mz</p>
                                    <p className="text-xs text-slate-400 mt-1">{t('counselling.confidentialNote')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 bg-slate-50 p-5 rounded-xl border border-slate-100">
                            <p className="text-sm text-slate-500 italic leading-relaxed">
                                {t('counselling.quote')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Client Form Section */}
            <CounsellingClient />
        </div>
    );
}
