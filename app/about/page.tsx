import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Heart, Shield, Users } from "lucide-react";

export const metadata = {
    title: 'About Us - ADA Church',
    description: 'Learn about our mission, vision, and the values that drive Assembleia de Deus Africana.',
}

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Hero Section */}
            <div className="relative h-[400px] w-full flex flex-col items-center justify-center text-center px-4">
                {/* Background Image/Overlay */}
                <div className="absolute inset-0 z-0 bg-slate-900">
                    <Image
                        src="/hero.png"
                        alt="About Background"
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
                        <span className="text-xs font-medium uppercase tracking-wider text-amber-500">Who We Are</span>
                        <div className="h-1 w-12 rounded-full bg-amber-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
                        About ADA
                    </h1>
                    <p className="text-lg text-slate-200 font-light max-w-2xl mx-auto">
                        Dedicated to spreading the Gospel, discipling believers, and serving our community with the love of Christ.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto max-w-6xl px-4 py-16 space-y-20">

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-[#8b1d2c] hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-[#8b1d2c]/10 rounded-xl flex items-center justify-center text-[#8b1d2c] mb-6">
                            <Target className="h-6 w-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Mission</h2>
                        <p className="text-slate-600 leading-relaxed">
                            To preach the Gospel of Jesus Christ to all nations, making disciples who are committed to biblical truth, prayer, and service, empowered by the Holy Spirit to transform their communities.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-[#c29c21] hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-[#c29c21]/10 rounded-xl flex items-center justify-center text-[#c29c21] mb-6">
                            <Heart className="h-6 w-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Vision</h2>
                        <p className="text-slate-600 leading-relaxed">
                            To be a vibrant, Christ-centered community that reflects God's glory, fosters spiritual growth, and demonstrates compassion to the brokenhearted, building a legacy of faith for future generations.
                        </p>
                    </div>
                </div>

                {/* Core Values */}
                <div className="space-y-10">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-slate-800 font-serif">Our Core Values</h2>
                        <p className="text-slate-500 mt-2">The principles that guide everything we do.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: "Biblical Authority", icon: Shield, desc: "We believe the Bible is the inspired Word of God and our final authority for faith and life." },
                            { title: "Community", icon: Users, desc: "We are a family united in Christ, supporting one another in love and fellowship." },
                            { title: "Service", icon: Heart, desc: "We serve God by serving others, looking after the needs of our neighbors and city." }
                        ].map((value, i) => (
                            <Card key={i} className="border-none shadow-sm bg-slate-50/50 hover:bg-white transition-colors">
                                <CardContent className="p-6 text-center space-y-4">
                                    <div className="w-12 h-12 mx-auto bg-white rounded-full shadow-sm flex items-center justify-center text-slate-700">
                                        <value.icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-bold text-slate-800">{value.title}</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {value.desc}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
