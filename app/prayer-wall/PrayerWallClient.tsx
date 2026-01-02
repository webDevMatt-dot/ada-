"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, Send, MessageCircle, Share2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/context/LanguageContext";

// Mock Data
const PRAYER_REQUESTS = [
    {
        id: 1,
        author: "Sarah M.",
        date: "2 hours ago",
        category: "Healing",
        content: "Please pray for my mother who is undergoing surgery tomorrow. We are believing for a successful procedure and quick recovery.",
        prayedCount: 24,
        comments: 5
    },
    {
        id: 2,
        author: "João P.",
        date: "5 hours ago",
        category: "Family",
        content: "Praying for reconciliation in my family. There has been a lot of tension lately, and we need God's peace to reign in our home.",
        prayedCount: 156,
        comments: 12
    },
    {
        id: 3,
        author: "Maria S.",
        date: "1 day ago",
        category: "Employment",
        content: "I have a job interview on Monday. Please pray that God grants me favor and the wisdom to speak the right words.",
        prayedCount: 42,
        comments: 3
    },
    {
        id: 4,
        author: "Anonymous",
        date: "2 days ago",
        category: "Spiritual Growth",
        content: "I feel like I'm drifting away from God. Please pray for a renewed hunger for His Word and His presence in my life.",
        prayedCount: 89,
        comments: 15
    },
    {
        id: 5,
        author: "David L.",
        date: "3 days ago",
        category: "Health",
        content: "Recovering from a long illness. Thankful for God's sustaining grace but still need strength for full restoration.",
        prayedCount: 31,
        comments: 1
    },
    {
        id: 6,
        author: "Ana R.",
        date: "5 days ago",
        category: "Guidance",
        content: "Seeking God's direction for a major life decision regarding my education. Pray for clarity and peace.",
        prayedCount: 67,
        comments: 8
    }
];

export default function PrayerWallClient() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [activeCategory, setActiveCategory] = useState("All")
    const { t } = useLanguage();

    const categories = ["All", "Healing", "Family", "Employment", "Spiritual Growth", "Guidance"];

    return (
        <div className="min-h-screen bg-[#f8fafd] flex flex-col">
            {/* Hero Section */}
            <div className="relative h-[500px] w-full flex flex-col items-center justify-center text-center px-4">
                {/* Background Image/Overlay */}
                <div className="absolute inset-0 z-0 bg-slate-900">
                    <Image
                        src="/hero.png"
                        alt="Prayer Background"
                        fill
                        className="object-cover opacity-40 mix-blend-overlay"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900/90" />
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="h-1 w-12 rounded-full bg-amber-500" />
                        <span className="text-xs font-medium uppercase tracking-wider text-amber-500">{t('nav.prayer')}</span>
                        <div className="h-1 w-12 rounded-full bg-amber-500" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
                        {t('prayerWall.heroTitle')}
                    </h1>
                    <p className="text-lg md:text-xl text-slate-200 font-light max-w-2xl mx-auto leading-relaxed">
                        "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God." — Philippians 4:6
                    </p>

                    <div className="pt-4">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="lg" className="bg-[#8b1d2c] hover:bg-[#6d1722] text-white px-8 h-14 text-lg rounded-full shadow-lg hover:shadow-xl transition-all border-none">
                                    <Plus className="mr-2 h-5 w-5" /> {t('prayerWall.shareRequest')}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>{t('prayerWall.shareRequest')}</DialogTitle>
                                    <DialogDescription>
                                        {t('prayerWall.shareSubtitle')}
                                    </DialogDescription>
                                </DialogHeader>
                                <form className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium text-slate-700">{t('contact.nameLabel')} ({t('contact.optional')})</label>
                                        <Input id="name" placeholder={t('prayerWall.namePlaceholder')} />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="category" className="text-sm font-medium text-slate-700">{t('prayerWall.categoryLabel')}</label>
                                        <select id="category" className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950">
                                            {categories.filter(c => c !== "All").map(c => (
                                                <option key={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="request" className="text-sm font-medium text-slate-700">{t('prayerWall.yourRequestLabel')}</label>
                                        <Textarea id="request" placeholder={t('prayerWall.requestPlaceholder')} className="min-h-[100px]" />
                                    </div>
                                    <div className="footer pt-4 flex justify-end">
                                        <Button type="submit" className="bg-[#8b1d2c] hover:bg-[#6d1722]">{t('prayerWall.submitButton')}</Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto max-w-7xl px-4 py-16">

                {/* Filters */}
                <div className="flex flex-wrap gap-2 justify-center mb-12">
                    {categories.map((cat) => (
                        <Button
                            key={cat}
                            variant={activeCategory === cat ? "default" : "outline"}
                            onClick={() => setActiveCategory(cat)}
                            className={`rounded-full px-6 ${activeCategory === cat ? 'bg-[#1e293b] hover:bg-[#0f172a]' : 'bg-white hover:bg-slate-50'}`}
                        >
                            {cat === "All" ? t('locations.allProvinces').replace("Provinces", "") : cat} {/* Hacky reuse or just use English as keys? using English keys for category filtering logic but label could be translated if I had a map. For now keeping English categories in logic but maybe UI? I don't have translations for categories in my dict yet. I'll leave categories as English or untranslated for now as they are data-driven. */}
                        </Button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PRAYER_REQUESTS.filter(r => activeCategory === "All" || r.category === activeCategory).map((request) => (
                        <div key={request.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                                        {request.author[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{request.author}</h3>
                                        <span className="text-xs text-slate-400">{request.date}</span>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="bg-slate-50 text-slate-500 hover:bg-slate-100">
                                    {request.category}
                                </Badge>
                            </div>

                            <p className="text-slate-600 leading-relaxed mb-6 min-h-[80px]">
                                {request.content}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-[#8b1d2c] gap-2 pl-0 hover:bg-transparent group-hover:pl-2 transition-all">
                                    <Heart className="w-4 h-4" />
                                    <span>{request.prayedCount} {t('prayerWall.prayed')}</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600 gap-2">
                                    <Share2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
