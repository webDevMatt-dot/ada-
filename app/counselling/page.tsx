import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Calendar, MessageCircle } from "lucide-react";

export const metadata = {
    title: 'Counselling - ADA Church',
    description: 'Biblical counselling and spiritual support for our community.',
}

export default function CounsellingPage() {
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
                        <span className="text-xs font-medium uppercase tracking-wider text-amber-500">Support</span>
                        <div className="h-1 w-12 rounded-full bg-amber-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
                        Pastoral Counselling
                    </h1>
                    <p className="text-lg text-slate-200 font-light max-w-2xl mx-auto">
                        Finding hope, healing, and guidance through biblical truth and spiritual support.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto max-w-5xl px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-slate-800">We Are Here to Listen</h2>
                        <p className="text-slate-600 leading-relaxed text-lg">
                            Life can be challenging, but you don't have to walk through it alone. Our pastoral team is available to provide spiritual guidance, prayer, and biblical counsel for whatever season of life you are navigating.
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            Whether you are facing marital difficulties, grief, spiritual doubts, or personal struggles, we offer a safe and confidential space to seek God's wisdom together.
                        </p>

                        <div className="pt-4 flex gap-4">
                            <Button size="lg" className="bg-[#8b1d2c] hover:bg-[#6d1722] text-white">
                                <Calendar className="mr-2 h-4 w-4" /> Schedule Appointment
                            </Button>
                            <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                                <MessageCircle className="mr-2 h-4 w-4" /> Speak to a Pastor
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Contact Information</h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-amber-50 p-3 rounded-lg text-amber-600">
                                    <Phone className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800">Pastoral Care Line</p>
                                    <p className="text-slate-500">+258 84 123 4567</p>
                                    <p className="text-xs text-slate-400 mt-1">Available Mon-Fri, 9am - 5pm</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-amber-50 p-3 rounded-lg text-amber-600">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800">Email Support</p>
                                    <p className="text-slate-500">counselling@ada.org.mz</p>
                                    <p className="text-xs text-slate-400 mt-1">Confidential correspondence</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 bg-slate-50 p-4 rounded-xl text-sm text-slate-500 border border-slate-100 italic">
                            "Where there is no guidance, a people falls, but in an abundance of counselors there is safety." — Proverbs 11:14
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
