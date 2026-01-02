"use client"

import { useState } from "react"
import Image from "next/image"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/context/LanguageContext";

export default function FAQPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [activeCategory, setActiveCategory] = useState("All")
    const { t } = useLanguage();

    // FAQ Content moved inside component to access t()
    const faqs = [
        {
            category: "Services",
            question: t('faq.question1'),
            answer: t('faq.answer1'),
            badgeColor: "bg-blue-100 text-blue-600 hover:bg-blue-100"
        },
        {
            category: "Membership",
            question: t('faq.question2'),
            answer: t('faq.answer2'),
            badgeColor: "bg-green-100 text-green-600 hover:bg-green-100"
        },
        {
            category: "Beliefs",
            question: t('faq.question3'),
            answer: t('faq.answer3'),
            badgeColor: "bg-purple-100 text-purple-600 hover:bg-purple-100"
        },
        {
            category: "Services",
            question: t('faq.question4'),
            answer: t('faq.answer4'),
            badgeColor: "bg-blue-100 text-blue-600 hover:bg-blue-100"
        },
        {
            category: "General",
            question: t('faq.question5'),
            answer: t('faq.answer5'),
            badgeColor: "bg-gray-100 text-gray-600 hover:bg-gray-100"
        }
    ]

    const categories = ["All", "Beliefs", "Services", "Membership", "General"]

    const getCategoryLabel = (category: string) => {
        return t(`faq.categories.${category.toLowerCase()}`);
    }

    const filteredFaqs = faqs.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = activeCategory === "All" || faq.category === activeCategory
        return matchesSearch && matchesCategory
    })

    return (
        <div className="min-h-screen bg-[#f8fafd] flex flex-col">
            {/* Hero Section */}
            <div className="relative h-[400px] w-full flex flex-col items-center justify-center text-center px-4 mb-20">
                {/* Background Image/Overlay */}
                <div className="absolute inset-0 z-0 bg-slate-900">
                    <Image
                        src="/hero.png"
                        alt="Background"
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
                        <span className="text-xs font-medium uppercase tracking-wider text-amber-500">{t('faq.support')}</span>
                        <div className="h-1 w-12 rounded-full bg-amber-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
                        {t('faq.heroTitle')}
                    </h1>
                    <p className="text-lg text-slate-200 font-light">
                        {t('faq.heroSubtitle')}
                    </p>
                </div>
            </div>

            <div className="container mx-auto max-w-4xl px-4 pb-20">

                {/* Search Bar Container */}
                <div className="relative mb-8">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <Input
                        className="w-full pl-12 h-14 bg-white border-slate-200 rounded-xl shadow-sm focus-visible:ring-primary/20 text-slate-600 placeholder:text-slate-400"
                        placeholder={t('faq.searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Category Pills (Tabs) */}
                <div className="flex justify-start mb-10 overflow-x-auto pb-2">
                    <Tabs defaultValue="All" onValueChange={setActiveCategory} className="w-auto">
                        <TabsList className="bg-transparent gap-3 h-auto p-0">
                            {categories.map((category) => (
                                <TabsTrigger
                                    key={category}
                                    value={category}
                                    className="data-[state=active]:bg-[#1e293b] data-[state=active]:text-white border border-slate-200 rounded-full px-6 py-2 bg-white text-slate-600 text-sm font-medium transition-colors shadow-sm"
                                >
                                    {getCategoryLabel(category)}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>

                {/* FAQ Accordion List */}
                <div className="space-y-4">
                    {filteredFaqs.length > 0 ? (
                        <Accordion type="single" collapsible className="w-full space-y-4">
                            {filteredFaqs.map((faq, index) => (
                                <AccordionItem
                                    key={index}
                                    value={`item-${index}`}
                                    className="border-none bg-white rounded-xl shadow-sm px-8 overflow-hidden"
                                >
                                    <AccordionTrigger className="hover:no-underline py-8 group [&[data-state=open]>svg]:rotate-180">
                                        <div className="flex flex-col items-start text-left gap-3">
                                            <Badge className={`rounded-md px-2 py-0.5 text-[11px] font-bold border-none ${faq.badgeColor}`}>
                                                {getCategoryLabel(faq.category)}
                                            </Badge>
                                            <span className="text-xl font-bold text-slate-800 tracking-tight">
                                                {faq.question}
                                            </span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-slate-500 text-base leading-relaxed pb-8">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                            <p className="text-slate-400">{t('faq.noResults')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
