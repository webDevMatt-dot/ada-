"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Heart, Send, MessageCircle, Share2, Plus, Loader2 } from "lucide-react"
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

interface PrayerRequest {
    id: number;
    author: string;
    category: string;
    content: string;
    created_at: string;
    likes: number;
    is_viral: boolean;
}

export default function PrayerWallClient() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [success, setSuccess] = useState(false)
    const [activeCategory, setActiveCategory] = useState("All")
    const { t } = useLanguage();

    // State for API data
    const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        author: "",
        category: "Healing",
        content: ""
    });

    const categories = ["All", "Healing", "Family", "Employment", "Spiritual Growth", "Guidance", "Health", "Other"];

    const getCategoryLabel = (category: string) => {
        const key = category.toLowerCase().replace(" ", "_");
        return t(`prayerWall.categories.${key}`) || category;
    }

    const fetchPrayers = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/prayers");
            if (res.ok) {
                const data = await res.json();
                setPrayerRequests(data);
            }
        } catch (error) {
            console.error("Failed to fetch prayers", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrayers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch("/api/prayers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setSuccess(true);
                setFormData({ author: "", category: "Healing", content: "" });
            } else {
                alert("Failed to submit prayer request. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting prayer:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleLike = async (id: number) => {
        // Optimistic update
        setPrayerRequests(prev => prev.map(p =>
            p.id === id ? { ...p, likes: p.likes + 1 } : p
        ));

        try {
            await fetch(`/api/prayers/${id}/like`, { method: "POST" });
            // Ideally we'd re-fetch or use the response to sync viral status if needed
            // fetchPrayers(); 
        } catch (error) {
            console.error("Failed to like:", error);
            // Revert on error
            setPrayerRequests(prev => prev.map(p =>
                p.id === id ? { ...p, likes: p.likes - 1 } : p
            ));
        }
    };

    const formatTimeAgo = (isoDate: string) => {
        const date = new Date(isoDate);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return "Just now";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

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
                                {success ? (
                                    <div className="flex flex-col items-center justify-center text-center py-6 space-y-4 animate-in fade-in zoom-in-95 duration-300">
                                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                                            <Heart className="h-8 w-8 text-green-600 fill-green-600" />
                                        </div>
                                        <div className="space-y-4 px-4">
                                            <DialogTitle className="text-2xl text-center text-green-700 font-bold tracking-tight">Prayer Received</DialogTitle>
                                            <div className="text-center text-slate-600 space-y-4">
                                                {(t('prayerWall.successMessage') || "Your prayer request has been submitted and is awaiting approval.").split('\n\n').map((part, index) => (
                                                    <p key={index} className={index === 1 ? "italic font-serif text-lg text-slate-500 border-l-4 border-amber-500 pl-4 py-1 bg-amber-50 rounded-r-lg" : "text-base font-medium"}>
                                                        {part}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                        <Button
                                            className="mt-4 bg-green-600 hover:bg-green-700 text-white min-w-[120px]"
                                            onClick={() => {
                                                setIsDialogOpen(false);
                                                // Reset after animation
                                                setTimeout(() => setSuccess(false), 300);
                                            }}
                                        >
                                            {t('common.close') || "Close"}
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <DialogHeader>
                                            <DialogTitle>{t('prayerWall.shareRequest')}</DialogTitle>
                                            <DialogDescription>
                                                {t('prayerWall.shareSubtitle')}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
                                            <div className="space-y-2">
                                                <label htmlFor="name" className="text-sm font-medium text-slate-700">{t('contact.nameLabel')} ({t('contact.optional')})</label>
                                                <Input
                                                    id="name"
                                                    placeholder={t('prayerWall.namePlaceholder')}
                                                    value={formData.author}
                                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="category" className="text-sm font-medium text-slate-700">{t('prayerWall.categoryLabel')}</label>
                                                <select
                                                    id="category"
                                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                                                    value={formData.category}
                                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                >
                                                    {categories.filter(c => c !== "All").map(c => (
                                                        <option key={c} value={c}>{getCategoryLabel(c)}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="request" className="text-sm font-medium text-slate-700">{t('prayerWall.yourRequestLabel')}</label>
                                                <Textarea
                                                    id="request"
                                                    placeholder={t('prayerWall.requestPlaceholder')}
                                                    className="min-h-[100px]"
                                                    value={formData.content}
                                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="footer pt-4 flex justify-end">
                                                <Button type="submit" className="bg-[#8b1d2c] hover:bg-[#6d1722]" disabled={submitting}>
                                                    {submitting ? <Loader2 className="animate-spin w-4 h-4" /> : t('prayerWall.submitButton')}
                                                </Button>
                                            </div>
                                        </form>
                                    </>
                                )}
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
                            {getCategoryLabel(cat)}
                        </Button>
                    ))}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {prayerRequests.length === 0 && (
                            <div className="col-span-full text-center py-12 text-slate-400">
                                <p>No prayers found to display. Be the first to share.</p>
                            </div>
                        )}
                        {prayerRequests.filter(r => activeCategory === "All" || r.category === activeCategory).map((request) => (
                            <div key={request.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group relative overflow-hidden">
                                {request.is_viral && (
                                    <div className="absolute top-0 right-0 bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10 uppercase tracking-widest">
                                        {t('prayerWall.viral')}
                                    </div>
                                )}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold uppercase">
                                            {request.author[0]}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800">{request.author}</h3>
                                            <span className="text-xs text-slate-400">{formatTimeAgo(request.created_at)}</span>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="bg-slate-50 text-slate-500 hover:bg-slate-100">
                                        {getCategoryLabel(request.category)}
                                    </Badge>
                                </div>

                                <p className="text-slate-600 leading-relaxed mb-6 min-h-[80px]">
                                    {request.content}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-slate-500 hover:text-[#8b1d2c] gap-2 pl-0 hover:bg-transparent group-hover:pl-2 transition-all"
                                        onClick={() => handleLike(request.id)}
                                    >
                                        <Heart className={`w-4 h-4 ${request.likes > 0 ? 'fill-[#8b1d2c] text-[#8b1d2c]' : ''}`} />
                                        <span>{request.likes} {t('prayerWall.prayed')}</span>
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600 gap-2">
                                        <Share2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
