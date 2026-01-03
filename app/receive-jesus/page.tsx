"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Heart, ArrowRight, ArrowLeft, BookOpen, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/context/LanguageContext";
import { countries } from "@/lib/countries"

export default function ReceiveJesusPage() {
    const [hasDecided, setHasDecided] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [countryCode, setCountryCode] = useState("MZ") // Default to Mozambique
    const { t } = useLanguage();

    useEffect(() => {
        // Auto-detect user's country
        fetch("https://ipapi.co/json/")
            .then(res => res.json())
            .then(data => {
                if (data.country_code) {
                    setCountryCode(data.country_code);
                }
            })
            .catch(err => console.error("Failed to detect location", err));
    }, []);

    const steps = [
        {
            title: t('receiveJesus.step1Title'),
            scripture: t('receiveJesus.step1Scripture'),
            reference: t('receiveJesus.step1Reference'),
            description: t('receiveJesus.step1Desc')
        },
        {
            title: t('receiveJesus.step2Title'),
            scripture: t('receiveJesus.step2Scripture'),
            reference: t('receiveJesus.step2Reference'),
            description: t('receiveJesus.step2Desc')
        },
        {
            title: t('receiveJesus.step3Title'),
            scripture: t('receiveJesus.step3Scripture'),
            reference: t('receiveJesus.step3Reference'),
            description: t('receiveJesus.step3Desc')
        },
        {
            title: t('receiveJesus.step4Title'),
            scripture: t('receiveJesus.step4Scripture'),
            reference: t('receiveJesus.step4Reference'),
            description: t('receiveJesus.step4Desc')
        }
    ]

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Collect form data
        const formData = new FormData(e.currentTarget)
        const data = {
            name: formData.get("name"),
            phone: formData.get("phone"),
            email: formData.get("email"),
            location: formData.get("location"),
            countryCode: countryCode,
        }

        try {
            // Using existing endpoint logic
            const response = await fetch('https://ada-org.free.beeceptor.com/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                setIsSubmitted(true)
            } else {
                console.warn("API returned error status:", response.status)
                setIsSubmitted(true)
            }
        } catch (error) {
            console.error("Submission error:", error)
            setIsSubmitted(true)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Hero Section */}
            <div className="relative h-[500px] w-full flex flex-col items-center justify-center text-center px-4">
                <div className="absolute inset-0 z-0 bg-slate-900">
                    <Image
                        src="/hero.png"
                        alt="Worship Background"
                        fill
                        className="object-cover opacity-40 mix-blend-overlay"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900/90" />
                </div>

                <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
                        {t('receiveJesus.heroTitle')}
                    </h1>
                    <p className="text-lg md:text-xl text-slate-200 leading-relaxed font-light">
                        {t('receiveJesus.heroSubtitle')}
                    </p>
                </div>
            </div>

            {/* Steps Section */}
            <div className="container mx-auto py-24 px-4">
                <div className="flex flex-col gap-8 max-w-4xl mx-auto">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={cn(
                                "flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden border-2 border-transparent transition-all duration-300 hover:border-amber-500 hover:ring-1 hover:ring-amber-500/20 hover:shadow-2xl"
                            )}
                        >
                            {/* Step Number Sidebar */}
                            <div className="bg-[#1e293b] md:w-48 flex items-center justify-center py-8 md:py-0">
                                <span className="text-6xl font-bold text-amber-500/90">
                                    {index + 1}
                                </span>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 p-8 md:p-10 space-y-4">
                                <h3 className="text-2xl md:text-3xl font-bold text-slate-800">
                                    {step.title}
                                </h3>

                                <div className="space-y-2 border-l-4 border-amber-500 pl-6 py-1">
                                    <p className="italic text-slate-600 text-lg md:text-xl leading-relaxed">
                                        "{step.scripture}"
                                    </p>
                                    <p className="text-[#8b1d2c] font-bold text-sm uppercase tracking-wider">
                                        {step.reference}
                                    </p>
                                </div>

                                <p className="text-slate-500 text-lg leading-relaxed pt-2">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Prayer of Salvation & Decision Form Section */}
            <div className="bg-white py-24">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-[#1e293b] rounded-3xl p-8 md:p-16 shadow-2xl overflow-hidden relative transition-all duration-500">
                        {/* Header with Icon */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                                {isSubmitted ? (
                                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                                ) : (
                                    <BookOpen className="h-6 w-6 text-amber-500" />
                                )}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                                {isSubmitted ? t('receiveJesus.welcomeTitle') : hasDecided ? t('receiveJesus.yourInfo') : t('receiveJesus.prayerTitle')}
                            </h2>
                        </div>

                        {!hasDecided ? (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <p className="text-slate-300 text-lg mb-10 max-w-2xl leading-relaxed">
                                    {t('receiveJesus.prayerIntro')}
                                </p>

                                {/* Prayer Text Card */}
                                <div className="bg-slate-700/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12 mb-10">
                                    <div className="space-y-6 text-slate-100 text-xl md:text-2xl leading-relaxed font-medium">
                                        <p>"{t('receiveJesus.prayerText1')}</p>
                                        <div className="space-y-2">
                                            <p>{t('receiveJesus.prayerText2')}</p>
                                            <p>{t('receiveJesus.prayerText3')}</p>
                                            <p>{t('receiveJesus.prayerText4')}</p>
                                            <p>{t('receiveJesus.prayerText5')}</p>
                                        </div>
                                        <p>{t('receiveJesus.prayerText6')}"</p>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <Button
                                    size="lg"
                                    onClick={() => setHasDecided(true)}
                                    className="bg-[#8b1d2c] hover:bg-[#6d1722] text-white text-lg h-14 px-8 rounded-xl shadow-lg transition-all active:scale-95 group"
                                >
                                    {t('receiveJesus.madeDecision')}
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </div>
                        ) : isSubmitted ? (
                            <div className="animate-in fade-in zoom-in-95 duration-500 text-center py-10">
                                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 mb-6 inline-block">
                                    <Heart className="h-16 w-16 text-green-500 mx-auto fill-green-500/20" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">{t('receiveJesus.rejoicing')}</h3>
                                <p className="text-slate-300 text-lg max-w-lg mx-auto">
                                    {t('receiveJesus.rejoicingText')}
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-6">


                                <p className="text-slate-300 text-lg mb-8 max-w-2xl">
                                    {t('receiveJesus.formIntro')}
                                </p>

                                <div className="grid gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-slate-200">{t('contact.nameLabel')} <span className="text-red-400">*</span></Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="John Doe"
                                            required
                                            className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-amber-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-200">{t('contact.phoneLabel')} <span className="text-slate-500">({t('contact.optional')})</span></Label>
                                        <div className="flex gap-2">
                                            <Select value={countryCode} onValueChange={setCountryCode} name="countryCode">
                                                <SelectTrigger className="w-[140px] bg-slate-800/50 border-slate-700 text-white focus:ring-amber-500">
                                                    <SelectValue placeholder="Country" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-[300px]">
                                                    {countries.map((c) => (
                                                        <SelectItem key={c.code} value={c.code}>
                                                            {c.flag} {c.dial_code}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                placeholder="123 456 7890"
                                                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-amber-500 flex-1"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-slate-200">{t('contact.emailLabel')} <span className="text-slate-500">({t('contact.optional')})</span></Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="john@example.com"
                                            className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-amber-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="location" className="text-slate-200">{t('receiveJesus.churchArea')} <span className="text-slate-500">({t('contact.optional')})</span></Label>
                                        <Input
                                            id="location"
                                            name="location"
                                            placeholder="e.g. Maputo, Matola..."
                                            className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-amber-500"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex flex-col items-center gap-4">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={isSubmitting}
                                        className="bg-[#8b1d2c] hover:bg-[#6d1722] text-white text-lg h-14 px-8 w-full md:w-auto rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? t('receiveJesus.sending') : t('receiveJesus.submitInfo')}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setHasDecided(false)}
                                        className="text-slate-200 hover:text-white hover:bg-white/5 h-auto font-medium"
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" /> {t('receiveJesus.goBack')}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
