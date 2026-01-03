"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Lock, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectSeparator,
    SelectGroup,
    SelectLabel
} from "@/components/ui/select"
import { countries } from "@/lib/countries"
import { useLanguage } from "@/context/LanguageContext";

export default function CounsellingClient() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedSupport, setSelectedSupport] = useState<string>("")
    const [email, setEmail] = useState("")
    const [selectedCountryIso, setSelectedCountryIso] = useState("MZ")
    const [phoneError, setPhoneError] = useState("")
    const { t } = useLanguage();

    useEffect(() => {
        // Auto-detect user's country
        fetch("https://ipapi.co/json/")
            .then(res => res.json())
            .then(data => {
                if (data.country_code) {
                    setSelectedCountryIso(data.country_code);
                }
            })
            .catch(err => console.error("Failed to detect location", err));
    }, []);

    const SUPPORT_TYPES = [
        {
            id: "spiritual",
            title: t('counselling.spiritualTitle'),
            desc: t('counselling.spiritualDesc')
        },
        {
            id: "marital",
            title: t('counselling.maritalTitle'),
            desc: t('counselling.maritalDesc')
        },
        {
            id: "family",
            title: t('counselling.familyTitle'),
            desc: t('counselling.familyDesc')
        },
        {
            id: "grief",
            title: t('counselling.griefTitle'),
            desc: t('counselling.griefDesc')
        },
        {
            id: "general",
            title: t('counselling.generalTitle'),
            desc: t('counselling.generalDesc')
        }
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setPhoneError("")

        // Validate Phone if Mozambique
        const form = e.target as HTMLFormElement
        const phoneInput = form.querySelector('#phone') as HTMLInputElement
        const phone = phoneInput.value

        if (selectedCountryIso === "MZ" && phone) {
            const cleanPhone = phone.replace(/\D/g, '') // Remove spaces and non-digits
            if (!/^8\d{8}$/.test(cleanPhone)) {
                setPhoneError("Mozambique numbers must start with 8 and have 9 digits.")
                return
            }
        }

        setIsSubmitting(true)
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false)
            alert("Your request has been submitted. A member of our pastoral team will contact you shortly.")
        }, 1500)
    }

    const selectedCountry = countries.find(c => c.code === selectedCountryIso) || countries.find(c => c.code === "MZ") || countries[0];
    const isMozambique = selectedCountryIso === "MZ";

    return (
        <div id="appointment-form" className="container mx-auto max-w-4xl py-12 px-4 space-y-12">

            {/* Privacy Card */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
                <div className="p-2 bg-amber-100 rounded-full shrink-0">
                    <Lock className="h-5 w-5 text-amber-600" />
                </div>
                <div className="space-y-1">
                    <h3 className="font-bold text-slate-800">{t('counselling.privacyTitle')}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        {t('counselling.privacyText')}
                    </p>
                </div>
            </div>

            {/* Form Container */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="bg-[#1e293b] py-6 px-8 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white">{t('receiveJesus.yourInfo')}</h2>
                    <p className="text-slate-400 text-sm mt-1">{t('counselling.formSubtitle')}</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">

                    {/* Basics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="name" className="text-slate-700 font-medium">{t('contact.nameLabel')} <span className="text-red-500">*</span></Label>
                            <Input id="name" placeholder={t('counselling.placeholderName')} required className="rounded-xl border-slate-200 h-12 focus-visible:ring-[#8b1d2c]/20" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-slate-700 font-medium">{t('contact.phoneLabel')} <span className="text-red-500">*</span></Label>
                            <div className="flex gap-2">
                                <Select value={selectedCountryIso} onValueChange={(val) => {
                                    setSelectedCountryIso(val);
                                    if (val !== "MZ") setPhoneError("");
                                }}>
                                    <SelectTrigger className="w-[140px] h-12 rounded-xl border-slate-200">
                                        <SelectValue placeholder="Country" />
                                    </SelectTrigger>
                                    <SelectContent position="popper" sideOffset={5} className="max-h-[300px]">
                                        <SelectGroup>
                                            <SelectLabel>Portuguese Speaking</SelectLabel>
                                            {countries
                                                .filter(c => ["MZ", "AO", "BR", "PT", "CV", "GW", "ST", "TL", "GQ"].includes(c.code))
                                                .sort((a, b) => {
                                                    if (a.code === "MZ") return -1;
                                                    if (b.code === "MZ") return 1;
                                                    return a.name.localeCompare(b.name);
                                                })
                                                .map((c) => (
                                                    <SelectItem key={c.code} value={c.code}>
                                                        {c.flag} {c.dial_code}
                                                    </SelectItem>
                                                ))}
                                        </SelectGroup>
                                        <SelectSeparator />
                                        <SelectGroup>
                                            <SelectLabel>All Countries</SelectLabel>
                                            {countries
                                                .filter(c => !["MZ", "AO", "BR", "PT", "CV", "GW", "ST", "TL", "GQ"].includes(c.code))
                                                .map((c) => (
                                                    <SelectItem key={c.code} value={c.code}>
                                                        {c.flag} {c.dial_code}
                                                    </SelectItem>
                                                ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <div className="flex-1 flex flex-col gap-1">
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder={t('counselling.placeholderPhone')}
                                        required
                                        className={cn(
                                            "flex-1 rounded-xl border-slate-200 h-12",
                                            phoneError && "border-red-500 ring-red-500/20"
                                        )}
                                        onChange={() => setPhoneError("")}
                                    />
                                </div>
                            </div>
                            {phoneError && (
                                <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700 font-medium">{t('contact.emailLabel')} <span className="text-slate-400 font-normal">({t('contact.optional')})</span></Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder={t('counselling.placeholderEmail')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="rounded-xl border-slate-200 h-12"
                            />
                        </div>
                    </div>

                    {/* Support Type Cards */}
                    <div className="space-y-4">
                        <Label className="text-slate-700 font-medium block">{t('counselling.supportTypeLabel')} <span className="text-red-500">*</span></Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {SUPPORT_TYPES.map((type) => (
                                <div
                                    key={type.id}
                                    onClick={() => setSelectedSupport(type.id)}
                                    className={cn(
                                        "cursor-pointer rounded-xl border p-4 transition-all relative",
                                        selectedSupport === type.id
                                            ? "border-[#8b1d2c] bg-[#8b1d2c]/5 ring-1 ring-[#8b1d2c]"
                                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                    )}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className={cn("font-bold mb-1", selectedSupport === type.id ? "text-[#8b1d2c]" : "text-slate-800")}>
                                                {type.title}
                                            </h4>
                                            <p className="text-xs text-slate-500 leading-snug">{type.desc}</p>
                                        </div>
                                        {selectedSupport === type.id && (
                                            <div className="h-5 w-5 bg-[#8b1d2c] rounded-full flex items-center justify-center text-white shrink-0">
                                                <Check className="h-3 w-3" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <input type="hidden" name="supportType" required value={selectedSupport} />
                    </div>

                    {/* Message Box */}
                    <div className="space-y-2">
                        <Label htmlFor="message" className="text-slate-700 font-medium">{t('counselling.messageLabel')} <span className="text-red-500">*</span></Label>
                        <Textarea
                            id="message"
                            required
                            minLength={10}
                            placeholder=""
                            className="rounded-xl border-slate-200 min-h-[120px] resize-none focus-visible:ring-[#8b1d2c]/20"
                        />
                        <p className="text-xs text-slate-400 text-right">{t('counselling.minChars')}</p>
                    </div>

                    {/* Preferred Contact Method */}
                    <div className="space-y-2">
                        <Label htmlFor="contactMethod" className="text-slate-700 font-medium">{t('counselling.contactMethodLabel')}</Label>
                        <Select>
                            <SelectTrigger className="h-12 rounded-xl border-slate-200">
                                <SelectValue placeholder={t('counselling.contactMethodPlaceholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="phone" disabled={!isMozambique}>
                                    {t('counselling.methodPhone')} {(!isMozambique) && t('counselling.mozambiqueOnly')}
                                </SelectItem>
                                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                <SelectItem value="email" disabled={!email}>
                                    {t('counselling.methodEmail')} {(!email) && t('counselling.requiresEmail')}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Submit Button */}
                    <Button
                        disabled={isSubmitting || !selectedSupport}
                        className="w-full h-14 bg-[#8b1d2c] hover:bg-[#6d1722] text-lg rounded-xl shadow-lg transition-all"
                    >
                        {isSubmitting ? t('receiveJesus.sending') : t('receiveJesus.submitInfo')}
                    </Button>
                </form>
            </div>
        </div>
    )
}
