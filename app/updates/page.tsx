"use client";

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, User, ArrowRight, Rss, Search } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext";

export default function UpdatesPage() {
    const { t, language } = useLanguage();
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")

    const categories = [
        "All",
        "Videos",
        "Announcements",
        "Newsletters",
        "Gallery",
        "Apostle's Update"
    ]

    // Mock Data for English
    const featuresEn = {
        title: "Annual Community Outreach Program Success",
        excerpt: "Our church family came together this weekend to serve over 500 meals to our local community. See the highlights and testimonies from this incredible day of service.",
        date: "October 15, 2025",
        author: "Pastor Matt",
        category: "Gallery",
        image: "/hero.png"
    }

    const updatesEn = [
        {
            title: "Sunday Service Live Stream - The Power of Faith",
            excerpt: "Watch the full recording of this Sunday's powerful message about walking in faith during uncertain times.",
            date: "October 12, 2025",
            author: "Media Team",
            category: "Videos",
            image: "/hero.png"
        },
        {
            title: "New Sunday Service Times",
            excerpt: "Starting next month, we will be adding a third service to accommodate our growing family. Please note the new schedule.",
            date: "October 5, 2025",
            author: "Admin Team",
            category: "Announcements",
            image: "/hero.png"
        },
        {
            title: "October 2025 Monthly Newsletter",
            excerpt: "Download this month's newsletter to see upcoming events, reading plans, and a word from our leadership.",
            date: "October 1, 2025",
            author: "Communications",
            category: "Newsletters",
            image: "/hero.png"
        },
        {
            title: "A Word for the Season: Embracing Change",
            excerpt: "A special update from our Apostle regarding the new direction for our church expansion project.",
            date: "September 28, 2025",
            author: "Apostle John",
            category: "Apostle's Update",
            image: "/hero.png"
        },
        {
            title: "Youth Camp Highlights 2025",
            excerpt: "Check out this gallery of photos from our amazing youth summer camp. It was a life-changing experience for many!",
            date: "September 15, 2025",
            author: "Youth Ministry",
            category: "Gallery",
            image: "/hero.png"
        },
        {
            title: "September 2025 Monthly Newsletter",
            excerpt: "Recap of last month's events and a look forward to the fall season activities.",
            date: "September 1, 2025",
            author: "Communications",
            category: "Newsletters",
            image: "/hero.png"
        }
    ]

    // Mock Data for Portuguese
    const featuresPt = {
        title: "Sucesso do Programa Anual de Apoio Comunitário",
        excerpt: "A nossa família da igreja reuniu-se este fim de semana para servir mais de 500 refeições à nossa comunidade local. Veja os destaques e testemunhos deste dia incrível de serviço.",
        date: "15 de Outubro de 2025",
        author: "Pastor Matt",
        category: "Galeria",
        image: "/hero.png"
    }

    const updatesPt = [
        {
            title: "Transmissão do Culto de Domingo - O Poder da Fé",
            excerpt: "Assista à gravação completa da mensagem poderosa deste domingo sobre caminhar na fé durante tempos incertos.",
            date: "12 de Outubro de 2025",
            author: "Equipa de Média",
            category: "Vídeos",
            image: "/hero.png"
        },
        {
            title: "Novos Horários dos Cultos de Domingo",
            excerpt: "A partir do próximo mês, adicionaremos um terceiro culto para acomodar a nossa família em crescimento. Por favor, note o novo horário.",
            date: "5 de Outubro de 2025",
            author: "Equipa Administrativa",
            category: "Anúncios",
            image: "/hero.png"
        },
        {
            title: "Boletim Informativo de Outubro de 2025",
            excerpt: "Descarregue o boletim deste mês para ver os próximos eventos, planos de leitura e uma palavra da nossa liderança.",
            date: "1 de Outubro de 2025",
            author: "Comunicações",
            category: "Boletins",
            image: "/hero.png"
        },
        {
            title: "Uma Palavra para a Estação: Abraçar a Mudança",
            excerpt: "Uma atualização especial do nosso Apóstolo sobre a nova direção para o nosso projeto de expansão da igreja.",
            date: "28 de Setembro de 2025",
            author: "Apóstolo John",
            category: "Palavra do Apóstolo",
            image: "/hero.png"
        },
        {
            title: "Destaques do Acampamento de Jovens 2025",
            excerpt: "Veja esta galeria de fotos do nosso incrível acampamento de verão para jovens. Foi uma experiência transformadora para muitos!",
            date: "15 de Setembro de 2025",
            author: "Ministério Jovem",
            category: "Galeria",
            image: "/hero.png"
        },
        {
            title: "Boletim Informativo de Setembro de 2025",
            excerpt: "Resumo dos eventos do mês passado e uma visão das atividades da estação de outono.",
            date: "1 de Setembro de 2025",
            author: "Comunicações",
            category: "Boletins",
            image: "/hero.png"
        }
    ]

    const featuredUpdate = language === 'pt' ? featuresPt : featuresEn;
    const updates = language === 'pt' ? updatesPt : updatesEn;

    // Map internal categories to translated categories for display
    const getCategoryLabel = (category: string) => {
        if (category === "Apostle's Update") return t('updates.categories.apostle');
        if (category === "Newsletters") return t('updates.categories.newsletters');
        if (category === "Announcements") return t('updates.categories.announcements');
        if (category === "Videos") return t('updates.categories.videos');
        if (category === "Gallery") return t('updates.categories.gallery');
        return category; // Fallback
    }

    const getCategoryKey = (category: string) => {
        if (category === "Apostle's Update") return 'apostle';
        return category.toLowerCase();
    }

    const categoriesList = [
        "All",
        "Videos",
        "Announcements",
        "Newsletters",
        "Gallery",
        "Apostle's Update"
    ];

    // Combine all updates for searching/filtering logic
    const allUpdates = [featuredUpdate, ...updates]

    // Filter items based on search query AND category
    const filteredUpdates = allUpdates.filter(update => {
        const matchesSearch =
            update.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            update.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            update.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            getCategoryLabel(update.category).toLowerCase().includes(searchQuery.toLowerCase())

        const matchesCategory = selectedCategory === "All" ||
            update.category === selectedCategory ||
            (language === 'pt' && update.category === t(`updates.categories.${getCategoryKey(selectedCategory)}`));

        return matchesSearch && matchesCategory
    })

    return (
        <div className="min-h-screen flex flex-col bg-[#f8fafd]">
            {/* Hero Section */}
            <div className="relative h-[400px] w-full flex flex-col items-center justify-center text-center px-4">
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

                <div className="relative z-10 max-w-3xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="h-1 w-12 rounded-full bg-amber-500" />
                        <span className="text-xs font-medium uppercase tracking-wider text-amber-500">{t('updates.badge')}</span>
                        <div className="h-1 w-12 rounded-full bg-amber-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
                        {t('updates.heroTitle')}
                    </h1>
                    <p className="text-lg text-slate-200 font-light">
                        {t('updates.heroSubtitle')}
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto py-12 px-4">
                <div className="max-w-6xl mx-auto space-y-10">

                    {/* Search and Filters */}
                    <div className="space-y-6">
                        {/* Search Bar */}
                        <div className="relative max-w-2xl mx-auto">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Search className="h-5 w-5" />
                            </div>
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t('updates.searchPlaceholder')}
                                className="pl-12 h-14 bg-white border-slate-200 shadow-sm text-lg focus-visible:ring-amber-500"
                            />
                        </div>

                        {/* Category Pills (Tabs) */}
                        <div className="flex justify-center pb-2">
                            <Tabs defaultValue="All" onValueChange={setSelectedCategory} className="w-auto">
                                <TabsList className="bg-white border border-slate-100 p-1 h-auto shadow-sm gap-1 inline-flex flex-wrap justify-center rounded-lg">
                                    {categoriesList.map((categoryKey) => {
                                        let label = categoryKey;
                                        if (categoryKey === 'All') label = t('updates.categories.all');
                                        else if (categoryKey === 'Videos') label = t('updates.categories.videos');
                                        else if (categoryKey === 'Announcements') label = t('updates.categories.announcements');
                                        else if (categoryKey === 'Newsletters') label = t('updates.categories.newsletters');
                                        else if (categoryKey === 'Gallery') label = t('updates.categories.gallery');
                                        else if (categoryKey === "Apostle's Update") label = t('updates.categories.apostle');

                                        return (
                                            <TabsTrigger
                                                key={categoryKey}
                                                value={categoryKey}
                                                className="px-4 py-2 rounded-md text-slate-600 data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all font-medium"
                                            >
                                                {label}
                                            </TabsTrigger>
                                        )
                                    })}
                                </TabsList>
                            </Tabs>
                        </div>
                    </div>

                    <div className="space-y-16">

                        {/* Featured Update */}
                        {!searchQuery && (selectedCategory === "All" || featuredUpdate.category === selectedCategory || (language === 'pt' && featuredUpdate.category === t(`updates.categories.${getCategoryKey(selectedCategory)}`))) && (
                            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <Rss className="h-5 w-5 text-amber-500" /> {t('updates.featured')}
                                </h2>
                                <div className="group relative bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 lg:h-[400px]">
                                    <div className="relative h-[300px] md:h-full w-full overflow-hidden">
                                        <Image
                                            src={featuredUpdate.image}
                                            alt={featuredUpdate.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                                    </div>
                                    <div className="p-8 md:p-12 flex flex-col justify-center relative bg-white">
                                        <div className="mb-4">
                                            <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-none">
                                                {getCategoryLabel(featuredUpdate.category) || featuredUpdate.category}
                                            </Badge>
                                        </div>
                                        <h3 className="text-3xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-primary transition-colors">
                                            {featuredUpdate.title}
                                        </h3>
                                        <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                                            {featuredUpdate.excerpt}
                                        </p>
                                        <div className="mt-auto flex items-center justify-between border-t pt-6">
                                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" /> {featuredUpdate.date}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <User className="h-4 w-4" /> {featuredUpdate.author}
                                                </span>
                                            </div>
                                            <Button variant="ghost" className="text-primary hover:text-primary/80 p-0 font-semibold group-hover:translate-x-1 transition-transform">
                                                {t('updates.readStory')} <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Recent Updates Grid (or Search Results) */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-8">
                                {searchQuery ? `${t('updates.searchResults')} (${filteredUpdates.length})` : t('updates.recentNews')}
                            </h2>

                            {filteredUpdates.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filteredUpdates.map((update, index) => (
                                        <Card key={index} className="border-none shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col h-full bg-white">
                                            <div className="relative h-48 w-full overflow-hidden">
                                                <Image
                                                    src={update.image}
                                                    alt={update.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute top-4 left-4">
                                                    <Badge className="bg-white/90 text-slate-900 backdrop-blur-sm shadow-sm hover:bg-white">
                                                        {getCategoryLabel(update.category) || update.category}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <CardContent className="flex-1 p-6">
                                                <div className="flex items-center gap-2 text-xs text-slate-400 mb-3 font-medium uppercase tracking-wider">
                                                    <span>{update.date}</span>
                                                    <span>•</span>
                                                    <span>{update.author}</span>
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                                    {update.title}
                                                </h3>
                                                <p className="text-slate-600 leading-relaxed text-sm line-clamp-3">
                                                    {update.excerpt}
                                                </p>
                                            </CardContent>
                                            <CardFooter className="p-6 pt-0 mt-auto">
                                                <Button variant="link" className="text-primary p-0 h-auto font-semibold group-hover:translate-x-1 transition-transform">
                                                    {t('updates.readMore')} <ArrowRight className="ml-1 h-3 w-3" />
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
                                    <p className="text-slate-500 text-lg">{t('updates.noResults')}</p>
                                    {searchQuery && (
                                        <Button
                                            variant="link"
                                            onClick={() => setSearchQuery("")}
                                            className="mt-2 text-primary"
                                        >
                                            {t('updates.clearSearch')}
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pagination Placeholder - Hide if searching or filtered */}
                    {!searchQuery && selectedCategory === "All" && (
                        <div className="flex justify-center pt-8">
                            <Button variant="outline" size="lg" className="border-slate-200 text-slate-600 hover:text-primary hover:border-primary">
                                {t('updates.loadMore')}
                            </Button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

