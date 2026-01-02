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
    SelectValue
} from "@/components/ui/select"

const SUPPORT_TYPES = [
    {
        id: "spiritual",
        title: "Spiritual Guidance",
        desc: "Faith questions, spiritual growth, biblical understanding"
    },
    {
        id: "marital",
        title: "Marital Counselling",
        desc: "Marriage support, relationship guidance, family planning"
    },
    {
        id: "family",
        title: "Family Support",
        desc: "Parenting, family conflicts, generational issues"
    },
    {
        id: "grief",
        title: "Grief Support",
        desc: "Loss of loved ones, processing grief, finding hope"
    },
    {
        id: "general",
        title: "General Life Counselling",
        desc: "Life decisions, personal challenges, guidance"
    }
]

import { COUNTRY_CODES } from "@/data/countryCodes"

export default function CounsellingClient() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedSupport, setSelectedSupport] = useState<string>("")
    const [email, setEmail] = useState("")
    const [selectedCountryIso, setSelectedCountryIso] = useState("MZ")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false)
            alert("Your request has been submitted. A member of our pastoral team will contact you shortly.")
        }, 1500)
    }

    const selectedCountry = COUNTRY_CODES.find(c => c.country === selectedCountryIso) || COUNTRY_CODES[0];
    const isMozambique = selectedCountryIso === "MZ";

    return (
        <div id="appointment-form" className="container mx-auto max-w-4xl py-12 px-4 space-y-12">

            {/* Privacy Card */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
                <div className="p-2 bg-amber-100 rounded-full shrink-0">
                    <Lock className="h-5 w-5 text-amber-600" />
                </div>
                <div className="space-y-1">
                    <h3 className="font-bold text-slate-800">Your Privacy Matters</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        Your information is kept strictly confidential and will only be used to connect you with a counsellor. All conversations are strictly confidential and handled with the utmost care and respect.
                    </p>
                </div>
            </div>

            {/* Form Container */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="bg-[#1e293b] py-6 px-8 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white">Your Information</h2>
                    <p className="text-slate-400 text-sm mt-1">Please fill in the details below so we can best assist you.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">

                    {/* Basics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="name" className="text-slate-700 font-medium">Name <span className="text-red-500">*</span></Label>
                            <Input id="name" placeholder="Full Name" required className="rounded-xl border-slate-200 h-12 focus-visible:ring-[#8b1d2c]/20" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-slate-700 font-medium">Phone <span className="text-red-500">*</span></Label>
                            <div className="flex gap-2">
                                <Select value={selectedCountryIso} onValueChange={setSelectedCountryIso}>
                                    <SelectTrigger className="w-[140px] h-12 rounded-xl border-slate-200">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{selectedCountry.flag}</span>
                                            <span className="font-medium">{selectedCountry.code}</span>
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent position="popper" sideOffset={5} className="max-h-[300px]">
                                        {COUNTRY_CODES.map((c, i) => (
                                            <SelectItem key={c.country} value={c.country}>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">{c.flag}</span>
                                                    <span className="font-medium text-slate-700">{c.label}</span>
                                                    <span className="text-slate-400 text-xs ml-auto">{c.code}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Input id="phone" type="tel" placeholder="84 123 4567" required className="flex-1 rounded-xl border-slate-200 h-12" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700 font-medium">Email <span className="text-slate-400 font-normal">(Optional)</span></Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="rounded-xl border-slate-200 h-12"
                            />
                        </div>
                    </div>

                    {/* Support Type Cards */}
                    <div className="space-y-4">
                        <Label className="text-slate-700 font-medium block">Type of Support Needed <span className="text-red-500">*</span></Label>
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
                        <Label htmlFor="message" className="text-slate-700 font-medium">Brief Description of Your Situation <span className="text-red-500">*</span></Label>
                        <Textarea
                            id="message"
                            required
                            minLength={10}
                            placeholder="Please share a brief overview..."
                            className="rounded-xl border-slate-200 min-h-[120px] resize-none focus-visible:ring-[#8b1d2c]/20"
                        />
                        <p className="text-xs text-slate-400 text-right">Minimum 10 characters</p>
                    </div>

                    {/* Preferred Contact Method */}
                    <div className="space-y-2">
                        <Label htmlFor="contactMethod" className="text-slate-700 font-medium">Preferred Contact Method</Label>
                        <Select>
                            <SelectTrigger className="h-12 rounded-xl border-slate-200">
                                <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="phone" disabled={!isMozambique}>
                                    Phone Call {(!isMozambique) && "(Mozambique Only)"}
                                </SelectItem>
                                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                <SelectItem value="email" disabled={!email}>
                                    Email {(!email) && "(Requires Email Address)"}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Submit Button */}
                    <Button
                        disabled={isSubmitting || !selectedSupport}
                        className="w-full h-14 bg-[#8b1d2c] hover:bg-[#6d1722] text-lg rounded-xl shadow-lg transition-all"
                    >
                        {isSubmitting ? "Sending..." : "Submit Request"}
                    </Button>
                </form>
            </div>
        </div>
    )
}
